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

    if original_snippet not in original_content:
        print(f"[PatchValidator] Original snippet not found in file. Cannot apply.")
        return False

    new_content = original_content.replace(original_snippet, replacement, 1)

    with open(file_abs, "w") as f:
        f.write(new_content)

    print(f"[PatchValidator] Patch applied to '{file_rel}'.")
    return True


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
