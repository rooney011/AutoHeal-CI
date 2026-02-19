"""
Phase 7 — Patch Validator & Retry Loop
Applies a patch, runs tests, rollbacks on failure.
Max retries: 5. Never stack broken patches.
"""
import os
import shutil
import time
from typing import Callable, Optional

from agent.fix_generator import generate_fix
from agent.test_discovery import run_tests, detect_language, detect_test_framework

MAX_RETRIES = 5


# ─── Apply / Rollback ─────────────────────────────────────────────────────────
def apply_patch(repo_path: str, patch: dict) -> bool:
    """
    Apply a patch to a file.
    patch = { "file": str, "line": int, "original": str, "patch": str }
    Returns True on success, False on failure.
    """
    if patch.get("patch") is None:
        print("[PatchValidator] Patch is null (LLM said unfixable). Skipping.")
        return False

    file_rel = patch["file"]
    file_abs = os.path.join(repo_path, file_rel)

    if not os.path.isfile(file_abs):
        print(f"[PatchValidator] File not found: {file_abs}")
        return False

    with open(file_abs, "r") as f:
        original_content = f.read()

    original_snippet = patch["original"]
    replacement = patch["patch"]

    # 1. Try Exact Match
    if original_snippet in original_content:
        new_content = original_content.replace(original_snippet, replacement, 1)
        _write_file(file_abs, new_content)
        print(f"[PatchValidator] Patch applied (Exact) to '{file_rel}'.")
        return True

    # 2. Try Fuzzy Match (Ignore whitespace/indentation)
    print("[PatchValidator] Exact match failed. Trying fuzzy match...")
    
    # Split into lines and strip
    snippet_lines = [l.strip() for l in original_snippet.strip().splitlines() if l.strip()]
    file_lines = original_content.splitlines()
    
    if not snippet_lines:
        print("[PatchValidator] Original snippet is empty or whitespace only. Cannot apply safely.")
        return False

    # Scan for matching block
    match_start_index = -1
    
    for i in range(len(file_lines)):
        # Check if snippet matches starting at line i
        match = True
        for j, s_line in enumerate(snippet_lines):
            if i + j >= len(file_lines):
                match = False
                break
            if file_lines[i + j].strip() != s_line:
                match = False
                break
        
        if match:
            match_start_index = i
            break
    
    if match_start_index != -1:
        # Reconstruct the EXACT text from the file that matched
        match_end_index = match_start_index + len(snippet_lines)
        # We need to capture the full lines including newlines from the original file
        # But splitlines() eats newlines. 
        # Safer way: Find the byte offsets or character offsets.
        
        # Simpler approach: Re-read file, find the lines by index
        with open(file_abs, "r") as f:
            lines_with_endings = f.readlines()
            
        timestamp = int(time.time())
        
        # Verify indices are valid
        if match_end_index <= len(lines_with_endings):
            # Construct the exact block to replace
            matched_block = "".join(lines_with_endings[match_start_index:match_end_index])
            
            # Now replace that block in the full content
            new_content = original_content.replace(matched_block, replacement, 1)
            _write_file(file_abs, new_content)
            print(f"[PatchValidator] Patch applied (Fuzzy) to '{file_rel}' at line {match_start_index+1}.")
            return True

    print(f"[PatchValidator] Original snippet not found in file (even fuzzily). Cannot apply.")
    return False

def _write_file(path: str, content: str):
    with open(path, "w") as f:
        f.write(content)


def rollback_patch(repo_path: str, patch: dict, backup_content: str) -> None:
    """Restore the file to its pre-patch state."""
    file_abs = os.path.join(repo_path, patch["file"])
    with open(file_abs, "w") as f:
        f.write(backup_content)
    print(f"[PatchValidator] Rolled back '{patch['file']}'.")


def read_file_content(repo_path: str, relative_path: str) -> Optional[str]:
    """Read a file's content safely."""
    abs_path = os.path.join(repo_path, relative_path)
    if not os.path.isfile(abs_path):
        return None
    with open(abs_path, "r") as f:
        return f.read()


# ─── Retry Loop ───────────────────────────────────────────────────────────────
def run_fix_retry_loop(
    repo_path: str,
    failure: dict,
    on_success_callback: Optional[Callable] = None,
) -> dict:
    """
    Main retry loop. For a given failure:
    1. Generate fix
    2. Apply patch
    3. Run tests
    4. If pass → commit → break
    5. Else → rollback → retry

    Returns a result dict with: success, retry_count, iterations.
    """
    language = detect_language(repo_path)
    framework = detect_test_framework(repo_path, language)

    iterations = []
    success = False

    for attempt in range(1, MAX_RETRIES + 1):
        start_time = time.time()
        print(f"\n[PatchValidator] ─── Attempt {attempt}/{MAX_RETRIES} ───")

        file_content = read_file_content(repo_path, failure.get("file", ""))
        if file_content is None:
            print("[PatchValidator] Could not read target file. Aborting.")
            break

        # Phase 6: Generate fix
        patch = generate_fix(
            file_path=failure.get("file", ""),
            file_content=file_content,
            bug_type=failure.get("bug_type", "UNKNOWN"),
            line_number=_extract_line_number(failure),
            error_message=failure.get("error_message", ""),
        )

        if patch is None:
            print("[PatchValidator] No patch generated. Aborting retry loop.")
            break

        # Apply patch
        applied = apply_patch(repo_path, patch)
        if not applied:
            iterations.append({"attempt": attempt, "passed": False, "reason": "patch_apply_failed", "duration_s": round(time.time() - start_time, 2)})
            continue

        # Run tests
        test_result = run_tests(repo_path, framework)
        duration = round(time.time() - start_time, 2)

        if test_result["passed"]:
            print(f"[PatchValidator] ✅ Tests PASSED on attempt {attempt}.")
            success = True
            iterations.append({"attempt": attempt, "passed": True, "duration_s": duration})
            if on_success_callback:
                on_success_callback(patch, attempt)
            break
        else:
            print(f"[PatchValidator] ❌ Tests FAILED. Rolling back...")
            rollback_patch(repo_path, patch, file_content)
            iterations.append({"attempt": attempt, "passed": False, "reason": "test_failure", "duration_s": duration})

    return {
        "success": success,
        "retry_count": len(iterations),
        "iterations": iterations,
    }


def _extract_line_number(failure: dict) -> Optional[int]:
    """Try to extract a line number from the failure metadata."""
    line = failure.get("line", "")
    if isinstance(line, int):
        return line
    import re
    match = re.search(r":(\d+)", str(line))
    if match:
        return int(match.group(1))
    return None
