# AutoHeal-CI Backend

## Setup

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/Mac:
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Set environment variables (create a `.env` file in `/backend`):

```env
OPENAI_API_KEY=your_openai_key_here
GITHUB_TOKEN=your_github_token_here
LLM_MODEL=gpt-4o-mini
```

4. Run the server:

```bash
uvicorn main:app --reload --port 8000
```

## API

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/run-agent`      | Start autonomous healing agent |
| GET    | `/status`         | Poll current run status        |
| GET    | `/results/latest` | Get last results.json          |
| GET    | `/health`         | Health check                   |

## POST /run-agent Payload

```json
{
  "repo_url": "https://github.com/owner/repo",
  "github_owner": "owner",
  "github_repo": "repo",
  "enable_ci_polling": true,
  "enable_push": true
}
```

## Docker Sandbox

Build the sandbox image (first time only):

```bash
cd backend/sandbox
docker build -t autoheal-sandbox .
```

## Module Structure

```
backend/
  main.py              # FastAPI app entrypoint
  requirements.txt
  agent/
    supervisor.py      # Main orchestrator (Phase 1/7)
    repo_analyzer.py   # Repo analysis (Phase 4)
    test_discovery.py  # Test runner (Phase 4)
    failure_classifier.py  # Bug type classifier (Phase 5)
    fix_generator.py   # LLM patch generator (Phase 6)
    patch_validator.py # Retry loop (Phase 7)
    ci_monitor.py      # GitHub Actions poller (Phase 8)
    memory.py          # Structured memory store (Phase 9)
    results_engine.py  # Results + score (Phase 10)
  sandbox/
    Dockerfile
    sandbox_runner.py  # Container execution wrapper (Phase 2)
  git/
    git_ops.py         # Git automation (Phase 3)
  utils/
    validators.py
    timer.py
results/               # Output JSONs (auto-created)
```
