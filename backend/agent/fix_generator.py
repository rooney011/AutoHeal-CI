"""
Phase 6 — Fix Generator (LLM, Constrained)
Generates minimal patches using Gemini with a strict JSON schema.
No refactors. No formatting noise.
"""
import os
import json
import re
from typing import Optional


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
    Generate a fix patch using LLM (OpenAI-compatible capability).
    Returns a dict with file, line, original, patch — or None on failure.
    """
    try:
        from openai import OpenAI
    except ImportError:
        print("[FixGen] openai library not installed. Skipping.")
        return None

    api_key = os.environ.get("LLM_API_KEY") or os.environ.get("GEMINI_API_KEY")
    model_name = os.environ.get("LLM_MODEL", "gpt-4o")
    if model_name.startswith("gemini"):
        default_base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
    else:
        default_base_url = "https://api.openai.com/v1"
    base_url = os.environ.get("LLM_BASE_URL", default_base_url)

    # Special handling for Groq or other providers if needed
    if "groq" in base_url and not model_name.startswith("llama") and not model_name.startswith("mixtral") and not model_name.startswith("gemma"):
         # specific handling if user kept "gemini" in model name but switched URL
         # but for now we trust the user to set LLM_MODEL correctly
         pass

    if not api_key:
        print("[FixGen] LLM_API_KEY (or GEMINI_API_KEY) not set. Skipping LLM.")
        return None

    # strict JSON mode for OpenAI/Groq if supported, otherwise just system prompt
    # Groq supports json_object response_format
    
    user_message = _build_user_message(
        file_path=file_path,
        file_content=file_content,
        bug_type=bug_type,
        line_number=line_number,
        error_message=error_message,
    )

    client = OpenAI(api_key=api_key, base_url=base_url)

    import time as _time
    for attempt in range(3):
        try:
            print(f"[FixGen] Using model: {model_name} via {base_url} (attempt {attempt + 1})")
            response = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_message}
                ],
                temperature=0,
                max_tokens=1024,
            )
            raw = response.choices[0].message.content.strip()
            return _parse_and_validate(raw)

        except Exception as e:
            err_str = str(e)
            if "429" in err_str or "rate" in err_str.lower() or "quota" in err_str.lower() or "RetryInfo" in err_str:
                wait = 10 * (attempt + 1)
                print(f"[FixGen] Rate limited. Waiting {wait}s before retry...")
                _time.sleep(wait)
            else:
                print(f"[FixGen] LLM call failed: {e}")
                return None

    print("[FixGen] All retry attempts exhausted (rate limit).")
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
