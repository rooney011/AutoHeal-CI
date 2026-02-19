"""
Phase 8 — CI/CD Monitor
Polls GitHub Actions for CI status and captures timeline data.
"""
import os
import time
import requests
from typing import Optional
from datetime import datetime, timezone


GITHUB_API_BASE = "https://api.github.com"
POLL_INTERVAL_SECONDS = 15
MAX_POLL_ATTEMPTS = 40  # 10 minutes max


def get_headers() -> dict:
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise EnvironmentError("GITHUB_TOKEN environment variable not set.")
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


# ─── CI Polling ───────────────────────────────────────────────────────────────
def poll_ci_status(
    owner: str,
    repo: str,
    branch: str,
    iteration: int,
) -> dict:
    """
    Poll GitHub Actions workflow runs until completion or timeout.
    Returns structured CI result with status and timestamps.
    """
    headers = get_headers()
    started_at = datetime.now(timezone.utc).isoformat()

    print(f"[CIMonitor] Polling CI for '{owner}/{repo}' on branch '{branch}'...")

    for poll_attempt in range(1, MAX_POLL_ATTEMPTS + 1):
        try:
            run = _get_latest_run(owner, repo, branch, headers)
            if run is None:
                print(f"[CIMonitor] No workflow run found. Waiting...")
                time.sleep(POLL_INTERVAL_SECONDS)
                continue

            status = run.get("status")        # queued, in_progress, completed
            conclusion = run.get("conclusion")  # success, failure, cancelled, etc.
            run_id = run.get("id")
            html_url = run.get("html_url", "")

            print(f"[CIMonitor] Poll #{poll_attempt}: status={status}, conclusion={conclusion}")

            if status == "completed":
                completed_at = datetime.now(timezone.utc).isoformat()
                return {
                    "iteration": iteration,
                    "run_id": run_id,
                    "branch": branch,
                    "status": status,
                    "conclusion": conclusion,      # "success" or "failure"
                    "passed": conclusion == "success",
                    "started_at": started_at,
                    "completed_at": completed_at,
                    "ci_url": html_url,
                    "poll_attempts": poll_attempt,
                }

            time.sleep(POLL_INTERVAL_SECONDS)

        except requests.RequestException as e:
            print(f"[CIMonitor] Request error: {e}. Retrying...")
            time.sleep(POLL_INTERVAL_SECONDS)

    # Timeout
    return {
        "iteration": iteration,
        "branch": branch,
        "status": "timeout",
        "conclusion": "timeout",
        "passed": False,
        "started_at": started_at,
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "poll_attempts": MAX_POLL_ATTEMPTS,
    }


def _get_latest_run(owner: str, repo: str, branch: str, headers: dict) -> Optional[dict]:
    """Fetch the latest workflow run for the given branch."""
    url = f"{GITHUB_API_BASE}/repos/{owner}/{repo}/actions/runs"
    params = {"branch": branch, "per_page": 1, "event": "push"}
    response = requests.get(url, headers=headers, params=params, timeout=30)
    response.raise_for_status()
    runs = response.json().get("workflow_runs", [])
    return runs[0] if runs else None


# ─── CI Timeline Builder ───────────────────────────────────────────────────────
def build_ci_timeline(ci_results: list[dict]) -> list[dict]:
    """Format CI results into a timeline structure for results.json."""
    return [
        {
            "iteration": r.get("iteration"),
            "branch": r.get("branch"),
            "passed": r.get("passed"),
            "conclusion": r.get("conclusion"),
            "started_at": r.get("started_at"),
            "completed_at": r.get("completed_at"),
            "ci_url": r.get("ci_url", ""),
        }
        for r in ci_results
    ]
