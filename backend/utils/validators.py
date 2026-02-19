"""
Utils — Validators
Shared validation utilities used across the system.
"""
import re
from urllib.parse import urlparse


def validate_github_url(url: str) -> bool:
    """Validate that a URL is a proper GitHub repo URL."""
    try:
        parsed = urlparse(url)
        if parsed.netloc not in ("github.com", "www.github.com"):
            return False
        parts = parsed.path.strip("/").split("/")
        return len(parts) >= 2
    except Exception:
        return False


def validate_branch_format(branch: str) -> bool:
    """Validate branch follows ai-agent/fix-{BUG_TYPE}-{id} format."""
    pattern = re.compile(
        r"^ai-agent/fix-(LINTING|SYNTAX|INDENTATION|TYPE|TEST_FAILURE|TIMEOUT|DEPENDENCY|UNKNOWN)-\d{3,}$"
    )
    return bool(pattern.match(branch))


def validate_commit_prefix(message: str) -> bool:
    """Validate commit message starts with [AI-AGENT]."""
    return message.startswith("[AI-AGENT]")
