from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional
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


# ─── Dev entry ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
