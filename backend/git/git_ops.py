"""
Phase 3 — Git Automation
Handles all git operations: branching, committing, pushing.
Rules: Never touch main. Prefix [AI-AGENT] always.
"""
import re
import subprocess
import os
from typing import Optional


# ─── Constants ────────────────────────────────────────────────────────────────
BRANCH_PREFIX = "ai-agent"
COMMIT_PREFIX = "[AI-AGENT]"
PROTECTED_BRANCHES = {"main", "master", "dev", "develop", "production"}

BRANCH_PATTERN = re.compile(
    r"^ai-agent/fix-(LINTING|SYNTAX|TYPE|TEST_FAILURE|TIMEOUT|DEPENDENCY|UNKNOWN)-\d{3,}$"
)


# ─── Validators ───────────────────────────────────────────────────────────────
def validate_branch_name(branch_name: str) -> bool:
    """
    Validates branch name against the strict format:
    ai-agent/fix-{BUG_TYPE}-{id}
    Returns True if valid, False otherwise.
    """
    return bool(BRANCH_PATTERN.match(branch_name))


def validate_commit_message(message: str) -> bool:
    """
    Validates that commit message starts with [AI-AGENT].
    """
    return message.startswith(COMMIT_PREFIX)


# ─── Branch Operations ────────────────────────────────────────────────────────
def create_branch(repo_path: str, branch_name: str) -> None:
    """Create and checkout a new branch. Raises on invalid name or protected branch."""
    if not validate_branch_name(branch_name):
        raise ValueError(
            f"Invalid branch name '{branch_name}'. "
            f"Must match pattern: ai-agent/fix-{{BUG_TYPE}}-{{id}}"
        )

    base = _get_current_branch(repo_path)
    if base in PROTECTED_BRANCHES:
        # This is expected; we branch off main
        pass

    _run_git(repo_path, ["checkout", "-b", branch_name])
    print(f"[Git] Created and checked out branch '{branch_name}'")


def _get_current_branch(repo_path: str) -> str:
    result = _run_git(repo_path, ["rev-parse", "--abbrev-ref", "HEAD"])
    return result.strip()


# ─── Commit Operations ────────────────────────────────────────────────────────
def generate_commit_message(action: str, description: str) -> str:
    """
    Generate a standardized commit message.
    Example: [AI-AGENT] Fix: Remove unused import in main.py
    """
    message = f"{COMMIT_PREFIX} {action}: {description}"
    if not validate_commit_message(message):
        raise ValueError(f"Generated commit message is invalid: '{message}'")
    return message


def commit_changes(repo_path: str, message: str) -> None:
    """Stage all changes and commit with the given message."""
    if not validate_commit_message(message):
        raise ValueError(
            f"Commit message must start with '{COMMIT_PREFIX}'. Got: '{message}'"
        )

    _run_git(repo_path, ["add", "-A"])
    _run_git(repo_path, ["commit", "-m", message])
    print(f"[Git] Committed: {message}")


# ─── Push Operations ──────────────────────────────────────────────────────────
def push_branch(repo_path: str, branch_name: str, remote: str = "origin") -> None:
    """Push the given branch to remote. Refuses to push to protected branches."""
    if branch_name in PROTECTED_BRANCHES:
        raise ValueError(
            f"SAFETY: Refusing to push to protected branch '{branch_name}'."
        )
    _run_git(repo_path, ["push", remote, branch_name])
    print(f"[Git] Pushed '{branch_name}' to '{remote}'.")


# ─── Utility ──────────────────────────────────────────────────────────────────
def _run_git(repo_path: str, args: list[str]) -> str:
    """Run a git command in the given repo directory. Raises on failure."""
    cmd = ["git"] + args
    result = subprocess.run(
        cmd,
        cwd=repo_path,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"Git command failed: {' '.join(cmd)}\n"
            f"STDERR: {result.stderr}\n"
            f"STDOUT: {result.stdout}"
        )
    return result.stdout


def get_repo_root(path: str) -> Optional[str]:
    """Get the root of the git repository containing the given path."""
    try:
        result = _run_git(path, ["rev-parse", "--show-toplevel"])
        return result.strip()
    except RuntimeError:
        return None
