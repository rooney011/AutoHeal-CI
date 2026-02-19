"""
Phase 5 — Failure Classification (CRITICAL)
Rule-based classifier using regex. Matches judge test cases EXACTLY.
LLM is ONLY a fallback.
"""
import re
from enum import Enum
from typing import Optional


# ─── Bug Type Enum ─────────────────────────────────────────────────────────────
class BugType(str, Enum):
    LINTING = "LINTING"
    SYNTAX = "SYNTAX"
    INDENTATION = "INDENTATION"
    TYPE = "TYPE"
    TEST_FAILURE = "TEST_FAILURE"
    TIMEOUT = "TIMEOUT"
    DEPENDENCY = "DEPENDENCY"
    UNKNOWN = "UNKNOWN"


# ─── Classification Rules (Order matters — most specific first) ────────────────
# Each rule: (regex_pattern, BugType)
CLASSIFICATION_RULES: list[tuple[re.Pattern, BugType]] = [
    # Dependency / Import
    (re.compile(r"ModuleNotFoundError|ImportError|No module named", re.IGNORECASE), BugType.DEPENDENCY),

    # Syntax
    (re.compile(r"SyntaxError|invalid syntax", re.IGNORECASE), BugType.SYNTAX),

    # Indentation
    (re.compile(r"IndentationError|unexpected indent|unindent does not match", re.IGNORECASE), BugType.INDENTATION),

    # Type / Attribute / Name errors
    (re.compile(r"TypeError|AttributeError|NameError|UnboundLocalError", re.IGNORECASE), BugType.TYPE),

    # Linting
    (re.compile(r"unused import|F401|line too long|E501|trailing whitespace|W291|W293", re.IGNORECASE), BugType.LINTING),

    # Timeout
    (re.compile(r"TimeoutError|timed out|Timeout", re.IGNORECASE), BugType.TIMEOUT),

    # Generic test failure (AssertionError, FAILED)
    (re.compile(r"AssertionError|FAILED|assert", re.IGNORECASE), BugType.TEST_FAILURE),
]


# ─── Classifier ───────────────────────────────────────────────────────────────
def classify_failure(error_message: str, raw_output: str = "") -> BugType:
    """
    Main classifier. Applies regex rules in order.
    Checks error_message first (scoped per failure), then falls back to raw_output.
    This is important because raw_output may span multiple failures.
    """
    # Pass 1: check scoped error_message only
    for pattern, bug_type in CLASSIFICATION_RULES:
        if pattern.search(error_message):
            return bug_type

    # Pass 2: fall back to full raw_output if nothing matched
    for pattern, bug_type in CLASSIFICATION_RULES:
        if pattern.search(raw_output):
            return bug_type

    return BugType.UNKNOWN


def classify_all_failures(failures: list[dict]) -> list[dict]:
    """
    Classify a list of failure dicts (from test_discovery).
    Adds 'bug_type' field to each failure.
    """
    classified = []
    for failure in failures:
        bug_type = classify_failure(
            error_message=failure.get("error_message", ""),
            raw_output=failure.get("raw_output", ""),
        )
        classified.append({**failure, "bug_type": bug_type.value})
    return classified


def get_dominant_bug_type(classified_failures: list[dict]) -> Optional[str]:
    """Return the most common bug type from a list of classified failures."""
    if not classified_failures:
        return None
    from collections import Counter
    counts = Counter(f["bug_type"] for f in classified_failures)
    return counts.most_common(1)[0][0]
