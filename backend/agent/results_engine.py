"""
Phase 10 — Results JSON & Score Engine
Generates results.json as the single source of truth.
Score logic: Base 100, +10 speed bonus, −2 per commit > 20.
"""
import json
import os
from datetime import datetime, timezone
from typing import Optional

RESULTS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "results")


# ─── Score Engine ─────────────────────────────────────────────────────────────
def compute_score(
    time_taken_seconds: float,
    commit_count: int,
    success: bool,
    retry_count: int,
) -> dict:
    """
    Score logic (backend-only):
    - Base: 100 points if success, 0 if not
    - Speed bonus: +10 if < 60 seconds
    - Commit penalty: −2 per commit above 20
    """
    if not success:
        return {"total": 0, "breakdown": {"base": 0, "speed_bonus": 0, "commit_penalty": 0}}

    base = 100
    speed_bonus = 10 if time_taken_seconds < 60 else 0
    commit_penalty = max(0, (commit_count - 20) * 2)

    total = base + speed_bonus - commit_penalty
    return {
        "total": max(0, total),
        "breakdown": {
            "base": base,
            "speed_bonus": speed_bonus,
            "commit_penalty": -commit_penalty,
        },
    }


# ─── Results Builder ──────────────────────────────────────────────────────────
def build_results(
    repo_url: str,
    branch: str,
    failures: list[dict],
    fixes: list[dict],
    ci_timeline: list[dict],
    time_taken_seconds: float,
    iterations: int,
    commit_count: int,
    success: bool,
    run_id: Optional[str] = None,
) -> dict:
    """Assemble the full results.json data structure."""
    score = compute_score(
        time_taken_seconds=time_taken_seconds,
        commit_count=commit_count,
        success=success,
        retry_count=iterations,
    )

    return {
        "run_id": run_id or f"run-{datetime.now(timezone.utc).strftime('%Y%m%d%H%M%S')}",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "repo": repo_url,
        "branch": branch,
        "success": success,
        "time_taken_seconds": round(time_taken_seconds, 2),
        "iterations": iterations,
        "commit_count": commit_count,
        "score": score,
        "failures": failures,
        "fixes": fixes,
        "ci_timeline": ci_timeline,
    }


def save_results(results: dict, run_id: Optional[str] = None) -> str:
    """Save results.json to the results directory. Returns file path."""
    os.makedirs(RESULTS_DIR, exist_ok=True)
    filename = f"{run_id or results.get('run_id', 'results')}.json"
    filepath = os.path.join(RESULTS_DIR, filename)

    # Also write latest.json for easy frontend polling
    latest_path = os.path.join(RESULTS_DIR, "latest.json")

    for path in [filepath, latest_path]:
        with open(path, "w") as f:
            json.dump(results, f, indent=2)

    print(f"[Results] Saved to '{filepath}'")
    return filepath


def load_latest_results() -> Optional[dict]:
    """Load the most recent results."""
    latest = os.path.join(RESULTS_DIR, "latest.json")
    if os.path.isfile(latest):
        with open(latest, "r") as f:
            return json.load(f)
    return None
