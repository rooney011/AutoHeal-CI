"""
Phase 6 — Fix Generator (LLM, Constrained)
Generates minimal patches using Gemini with a strict JSON schema.
No refactors. No formatting noise.
"""
import os
import json
import re
from typing import Optional

try:
    import google.generativeai as genai
    _USE_LLM = True
except ImportError:
    _USE_LLM = False


# ─── Strict System Prompt ──────────────────────────────────────────────────────
SYSTEM_PROMPT = """You are a precision code repair agent. Your ONLY job is to generate the minimal fix for a specific bug.

RULES:
1. Output ONLY valid JSON. No explanations, no markdown, no code blocks.
2. The patch must fix ONLY the reported bug. No refactoring. No formatting changes.
3. The line numbers in your patch must be exact.
4. If you cannot fix the bug, set "patch" to null.

OUTPUT SCHEMA (strict):
{
  "file": "<relative file path>",
  "line": <1-indexed line number of the fix>,
  "original": "<exact original line(s) to replace>",
  "patch": "<replacement line(s) or null if unfixable>"
}

Do not output anything else. Just the JSON object."""


# ─── Fix Generator ────────────────────────────────────────────────────────────
def generate_fix(
    file_path: str,
    file_content: str,
    bug_type: str,
    line_number: Optional[int],
    error_message: str,
) -> Optional[dict]:
    """
    Generate a fix patch using LLM.
    Returns a dict with file, line, original, patch — or None on failure.
    """
    if not _USE_LLM:
        print("[FixGen] LLM not available. Skipping.")
        return None

    user_message = _build_user_message(
        file_path=file_path,
        file_content=file_content,
        bug_type=bug_type,
        line_number=line_number,
        error_message=error_message,
    )

    api_key = os.environ.get("GEMINI_API_KEY")
    model_name = os.environ.get("LLM_MODEL", "gemini-2.0-flash")

    if not api_key:
        print("[FixGen] GEMINI_API_KEY not set. Skipping LLM.")
        return None

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel(
            model_name=model_name,
            system_instruction=SYSTEM_PROMPT,
            generation_config=genai.GenerationConfig(
                temperature=0,      # Deterministic
                max_output_tokens=512,
            ),
        )
        response = model.generate_content(user_message)
        raw = response.text.strip()
        return _parse_and_validate(raw)
    except Exception as e:
        print(f"[FixGen] Gemini call failed: {e}")
        return None


def _build_user_message(
    file_path: str,
    file_content: str,
    bug_type: str,
    line_number: Optional[int],
    error_message: str,
) -> str:
    return f"""BUG TYPE: {bug_type}
FILE: {file_path}
LINE: {line_number if line_number else 'unknown'}
ERROR: {error_message}

FILE CONTENT:
```
{file_content}
```

Output only the JSON fix object."""


def _parse_and_validate(raw: str) -> Optional[dict]:
    """Strictly parse and validate LLM output. Reject anything non-conforming."""
    # Strip potential markdown code fences
    raw = re.sub(r"^```(?:json)?\n?", "", raw.strip(), flags=re.MULTILINE)
    raw = re.sub(r"\n?```$", "", raw.strip(), flags=re.MULTILINE)

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        print(f"[FixGen] JSON parse failed: {e}. Raw: {raw[:200]}")
        return None

    required_keys = {"file", "line", "original", "patch"}
    if not required_keys.issubset(data.keys()):
        print(f"[FixGen] Missing keys. Got: {list(data.keys())}")
        return None

    if not isinstance(data["line"], int):
        print(f"[FixGen] 'line' must be an int. Got: {data['line']}")
        return None

    return data
