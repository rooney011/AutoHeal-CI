"""
Phase 9 — Memory & Learning (Lightweight)
Structured memory store: bug type → fix success, retry counts, CI outcomes.
No ML training. Just JSON storage.
"""
import json
import os
from datetime import datetime, timezone
from typing import Optional

MEMORY_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "results", "memory.json")


# ─── Memory Schema ─────────────────────────────────────────────────────────────
# {
#   "runs": [ { run metadata } ],
#   "bug_stats": {
#     "LINTING": { "attempts": 3, "successes": 2, "avg_retries": 1.5 },
#     ...
#   }
# }


def _load_memory() -> dict:
    if os.path.isfile(MEMORY_FILE):
        with open(MEMORY_FILE, "r") as f:
            return json.load(f)
    return {"runs": [], "bug_stats": {}}


def _save_memory(data: dict) -> None:
    os.makedirs(os.path.dirname(MEMORY_FILE), exist_ok=True)
    with open(MEMORY_FILE, "w") as f:
        json.dump(data, f, indent=2)


# ─── Public API ───────────────────────────────────────────────────────────────
def record_run(
    repo_url: str,
    branch: str,
    bug_type: str,
    success: bool,
    retry_count: int,
    ci_passed: Optional[bool],
) -> None:
    """Append a run record and update aggregated bug statistics."""
    memory = _load_memory()

    run_entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "repo": repo_url,
        "branch": branch,
        "bug_type": bug_type,
        "success": success,
        "retry_count": retry_count,
        "ci_passed": ci_passed,
    }
    memory["runs"].append(run_entry)

    # Update aggregate stats
    stats = memory.get("bug_stats", {})
    if bug_type not in stats:
        stats[bug_type] = {"attempts": 0, "successes": 0, "total_retries": 0}

    stats[bug_type]["attempts"] += 1
    if success:
        stats[bug_type]["successes"] += 1
    stats[bug_type]["total_retries"] += retry_count
    stats[bug_type]["avg_retries"] = round(
        stats[bug_type]["total_retries"] / stats[bug_type]["attempts"], 2
    )

    memory["bug_stats"] = stats
    _save_memory(memory)
    print(f"[Memory] Recorded run: bug_type={bug_type}, success={success}, retries={retry_count}")


def get_bug_stats(bug_type: Optional[str] = None) -> dict:
    """Retrieve memory stats for a specific bug type or all types."""
    memory = _load_memory()
    stats = memory.get("bug_stats", {})
    if bug_type:
        return stats.get(bug_type, {})
    return stats


def get_success_rate(bug_type: str) -> Optional[float]:
    """Return historical success rate for a given bug type (0.0–1.0)."""
    stats = get_bug_stats(bug_type)
    if not stats or stats.get("attempts", 0) == 0:
        return None
    return round(stats["successes"] / stats["attempts"], 2)
