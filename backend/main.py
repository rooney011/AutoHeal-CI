from dotenv import load_dotenv
load_dotenv()  # Load .env file before any other imports

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional, Literal
import os
import uvicorn

from agent.supervisor import Supervisor
from agent.results_engine import load_latest_results
from utils.validators import validate_github_url

app = FastAPI(title="AutoHeal CI Agent", version="1.0.0")

# ─── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── In-Memory Run State (for status polling) ──────────────────────────────────
_run_state: dict = {"status": "idle", "run_id": None, "result": None}


# ─── Request / Response Models ─────────────────────────────────────────────────
class RunAgentRequest(BaseModel):
    repo_url: str
    github_owner: Optional[str] = ""
    github_repo: Optional[str] = ""
    enable_ci_polling: Optional[bool] = True
    enable_push: Optional[bool] = True

    @field_validator("repo_url")
    @classmethod
    def validate_url(cls, v):
        if not validate_github_url(v):
            raise ValueError(f"Invalid GitHub URL: '{v}'")
        return v


# ─── Endpoints ────────────────────────────────────────────────────────────────
@app.post("/run-agent")
async def run_agent(request: RunAgentRequest, background_tasks: BackgroundTasks):
    """
    Kick off the autonomous healing agent for a given repo.
    Runs asynchronously in the background. Poll /status for updates.
    """
    global _run_state

    if _run_state["status"] == "running":
        raise HTTPException(status_code=409, detail="An agent run is already in progress.")

    _run_state = {"status": "running", "run_id": None, "result": None}

    def _run():
        global _run_state
        try:
            supervisor = Supervisor(
                repo_url=request.repo_url,
                github_owner=request.github_owner,
                github_repo=request.github_repo,
                enable_ci_polling=request.enable_ci_polling,
                enable_push=request.enable_push,
            )
            result = supervisor.run()
            _run_state = {"status": "done", "run_id": result.get("run_id"), "result": result}
        except Exception as e:
            _run_state = {"status": "error", "run_id": None, "result": {"error": str(e)}}

    background_tasks.add_task(_run)
    return {"status": "started", "message": "Agent is running. Poll /status for updates."}


@app.get("/status")
async def get_status():
    """
    Poll the current run status.
    Returns: { status: 'idle' | 'running' | 'done' | 'error', run_id, result }
    """
    return _run_state


@app.get("/results/latest")
async def get_latest_results():
    """Retrieve the most recent results.json."""
    result = load_latest_results()
    if result is None:
        raise HTTPException(status_code=404, detail="No results found.")
    return result


@app.get("/health")
async def health():
    return {"status": "ok", "agent": "AutoHeal CI", "version": "1.0.0"}


@app.get("/schema")
async def get_schema():
    """
    Machine-readable API contract for frontend / judge inspection.
    Returns field definitions, enums, and status types.
    Frontend MUST NOT compute any logic — only display values from this schema.
    """
    return {
        "version": "1.0.0",
        "enums": {
            "RunStatus": ["idle", "running", "done", "error"],
            "BugType": [
                "LINTING",
                "SYNTAX",
                "INDENTATION",
                "TYPE",
                "TEST_FAILURE",
                "TIMEOUT",
                "DEPENDENCY",
                "UNKNOWN",
            ],
            "CIConclusion": ["success", "failure", "cancelled", "skipped", "timeout"],
        },
        "endpoints": {
            "POST /run-agent": {
                "description": "Start autonomous healing agent. Runs in background.",
                "request": {
                    "repo_url": "string (required) — full GitHub HTTPS URL",
                    "github_owner": "string (optional)",
                    "github_repo": "string (optional)",
                    "enable_ci_polling": "boolean (optional, default true)",
                    "enable_push": "boolean (optional, default true)",
                },
                "response": {"status": "'started'", "message": "string"},
            },
            "GET /status": {
                "description": "Poll current run state. Returns: {status, run_id, result}.",
                "response": {
                    "status": "RunStatus enum",
                    "run_id": "string | null",
                    "result": "AgentResults | {error: string} | null",
                },
            },
            "GET /results/latest": {
                "description": "Retrieve latest results.json. 404 if none exists.",
                "response": "AgentResults schema (see below)",
            },
            "GET /health": {
                "description": "Health check.",
                "response": {"status": "'ok'", "agent": "string", "version": "string"},
            },
            "GET /schema": {
                "description": "This endpoint — machine-readable API contract.",
            },
        },
        "schemas": {
            "AgentResults": {
                "run_id": "string — unique identifier for this run",
                "timestamp": "string — ISO 8601 UTC datetime",
                "repo": "string — GitHub repo URL",
                "branch": "string — base branch name",
                "success": "boolean — true if ALL failures were fixed",
                "time_taken_seconds": "float — wall-clock duration of the run",
                "iterations": "integer — number of fixes attempted",
                "commit_count": "integer — number of commits made",
                "score": "ScoreBreakdown",
                "failures": "FailureItem[]",
                "fixes": "FixItem[]",
                "ci_timeline": "CITimelineNode[]",
            },
            "ScoreBreakdown": {
                "total": "integer — BACKEND COMPUTED ONLY. Frontend: display as-is.",
                "breakdown": {
                    "base": "integer — 100 if success, 0 if not",
                    "speed_bonus": "integer — +10 if time_taken_seconds < 60",
                    "commit_penalty": "integer — negative: -2 per commit above 20",
                },
            },
            "FailureItem": {
                "file": "string — relative path to file",
                "test_id": "string — test identifier",
                "line": "string | integer — line reference",
                "error_message": "string — error description",
                "raw_output": "string (optional) — full test runner output",
                "bug_type": "BugType enum",
            },
            "FixItem": {
                "failure": "FailureItem — the failure that was fixed",
                "branch": "string — MUST start with 'ai-agent/'",
                "commit_message": "string — MUST start with 'fix:'",
                "retry_count": "integer — number of attempts made",
                "iterations": "IterationRecord[]",
            },
            "IterationRecord": {
                "attempt": "integer — attempt number (1-based)",
                "passed": "boolean — did tests pass on this attempt",
                "duration_s": "float — time for this attempt in seconds",
            },
            "CITimelineNode": {
                "iteration": "integer — which fix iteration this CI run is for",
                "branch": "string — branch that was pushed",
                "passed": "boolean — did CI pass",
                "conclusion": "CIConclusion enum",
                "started_at": "string — ISO 8601 UTC datetime",
                "completed_at": "string — ISO 8601 UTC datetime",
                "ci_url": "string (optional) — link to GitHub Actions run",
            },
        },
        "contract_rules": [
            "Frontend MUST NOT compute scores — read score.total and score.breakdown as-is",
            "Branch names MUST start with 'ai-agent/'",
            "Commit messages MUST start with 'fix:'",
            "bug_type MUST be one of the BugType enum values exactly",
            "All timestamps MUST be ISO 8601 with UTC offset",
            "time_taken_seconds MUST be > 0 for any real run",
        ],
    }


# ─── Dev entry ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
