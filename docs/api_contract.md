# AutoHeal CI — API Contract

> **Rule #1:** The frontend **NEVER** computes any logic. It only displays values returned by the backend.
> All scores, classifications, and timestamps are backend-computed.

---

## Base URL

```
http://localhost:8000
```

Set via environment variable: `VITE_API_URL`

---

## Endpoints

### `POST /run-agent`

Start the autonomous healing agent for a repository. Runs in the background; poll `/status` for updates.

**Request body:**

```json
{
  "repo_url": "https://github.com/owner/repo",
  "github_owner": "owner",
  "github_repo": "repo",
  "enable_ci_polling": true,
  "enable_push": true
}
```

| Field               | Type    | Required | Notes                  |
| ------------------- | ------- | -------- | ---------------------- |
| `repo_url`          | string  | ✅       | Full GitHub HTTPS URL  |
| `github_owner`      | string  | optional | Auto-parsed if omitted |
| `github_repo`       | string  | optional | Auto-parsed if omitted |
| `enable_ci_polling` | boolean | optional | Default: `true`        |
| `enable_push`       | boolean | optional | Default: `true`        |

**Response `200 OK`:**

```json
{
  "status": "started",
  "message": "Agent is running. Poll /status for updates."
}
```

**Response `409 Conflict`:** Another run already in progress.

---

### `GET /status`

Poll the current run state.

**Response:**

```json
{
  "status": "idle | running | done | error",
  "run_id": "run-abc12345 | null",
  "result": "AgentResults | { \"error\": \"message\" } | null"
}
```

| `status`  | Meaning                    |
| --------- | -------------------------- |
| `idle`    | No run has started         |
| `running` | Agent is executing         |
| `done`    | Run completed successfully |
| `error`   | Run crashed with an error  |

---

### `GET /results/latest`

Retrieve the most recent `results.json`.

- **`200 OK`** → `AgentResults` schema
- **`404 Not Found`** → No results exist yet

---

### `GET /health`

Health check.

```json
{ "status": "ok", "agent": "AutoHeal CI", "version": "1.0.0" }
```

---

### `GET /schema`

Machine-readable version of this document. Returns enums, field definitions, and contract rules as JSON.

---

## Schemas

### `AgentResults`

Top-level results object. Written to `results/latest.json` after every run.

```json
{
  "run_id": "run-abc12345",
  "timestamp": "2026-02-19T10:00:00+00:00",
  "repo": "https://github.com/owner/repo",
  "branch": "main",
  "success": true,
  "time_taken_seconds": 45.3,
  "iterations": 2,
  "commit_count": 2,
  "score": { ... },
  "failures": [ ... ],
  "fixes": [ ... ],
  "ci_timeline": [ ... ]
}
```

| Field                | Type             | Notes                                            |
| -------------------- | ---------------- | ------------------------------------------------ |
| `run_id`             | string           | `run-` + 8 hex chars                             |
| `timestamp`          | string           | ISO 8601 UTC                                     |
| `repo`               | string           | Source GitHub URL                                |
| `branch`             | string           | Base branch (usually `main`)                     |
| `success`            | boolean          | `true` only if **all** failures were fixed       |
| `time_taken_seconds` | float            | Always > 0 for real runs                         |
| `iterations`         | integer          | Number of fix attempts (= `fixes.length`)        |
| `commit_count`       | integer          | Commits made to the repo                         |
| `score`              | ScoreBreakdown   | Backend computed — never recalculate in frontend |
| `failures`           | FailureItem[]    | All detected failures                            |
| `fixes`              | FixItem[]        | All applied fixes                                |
| `ci_timeline`        | CITimelineNode[] | CI/CD run history                                |

---

### `ScoreBreakdown`

> ⚠️ **Frontend contract:** Display `score.total` and `score.breakdown.*` values as-is. **Never recompute.**

```json
{
  "total": 110,
  "breakdown": {
    "base": 100,
    "speed_bonus": 10,
    "commit_penalty": 0
  }
}
```

**Score formula (backend only):**

- `base` = 100 if success, 0 if not
- `speed_bonus` = +10 if `time_taken_seconds < 60`
- `commit_penalty` = -2 × max(0, commit_count − 20)
- `total` = max(0, base + speed_bonus + commit_penalty)

---

### `FailureItem`

```json
{
  "file": "src/app.py",
  "test_id": "tests/test_app.py::test_parse",
  "line": 42,
  "error_message": "SyntaxError: invalid syntax",
  "raw_output": "...full pytest output...",
  "bug_type": "SYNTAX"
}
```

| Field           | Type              | Notes                   |
| --------------- | ----------------- | ----------------------- |
| `file`          | string            | Relative path in repo   |
| `test_id`       | string            | Pytest test node ID     |
| `line`          | string \| integer | Line reference          |
| `error_message` | string            | Short error description |
| `raw_output`    | string (optional) | Full test runner output |
| `bug_type`      | **BugType enum**  | See enums below         |

---

### `FixItem`

```json
{
  "failure": { ... },
  "branch": "ai-agent/fix-SYNTAX-001",
  "commit_message": "fix: Resolve SYNTAX in src/app.py",
  "retry_count": 1,
  "iterations": [
    { "attempt": 1, "passed": true, "duration_s": 3.2 }
  ]
}
```

| Field            | Constraint                      |
| ---------------- | ------------------------------- |
| `branch`         | **MUST** start with `ai-agent/` |
| `commit_message` | **MUST** start with `fix:`      |
| `iterations`     | Array of `IterationRecord`      |

---

### `IterationRecord`

```json
{ "attempt": 1, "passed": true, "duration_s": 3.2 }
```

> Note: The backend may internally track a `reason` field for failed attempts. This is **not** exposed to the frontend.

---

### `CITimelineNode`

```json
{
  "iteration": 1,
  "branch": "ai-agent/fix-SYNTAX-001",
  "passed": true,
  "conclusion": "success",
  "started_at": "2026-02-19T10:00:00+00:00",
  "completed_at": "2026-02-19T10:00:45+00:00",
  "ci_url": "https://github.com/owner/repo/actions/runs/123"
}
```

---

## Enums

### `RunStatus`

```
idle | running | done | error
```

### `BugType`

```
LINTING | SYNTAX | INDENTATION | TYPE | TEST_FAILURE | TIMEOUT | DEPENDENCY | UNKNOWN
```

### `CIConclusion`

```
success | failure | cancelled | skipped | timeout
```

---

## Contract Rules (Judge Checklist)

| #   | Rule                                                                                    |
| --- | --------------------------------------------------------------------------------------- |
| 1   | Frontend **never** computes scores — reads `score.total` and `score.breakdown.*` as-is  |
| 2   | All branch names **must** start with `ai-agent/`                                        |
| 3   | All commit messages **must** start with `fix:`                                          |
| 4   | `bug_type` **must** be one of the `BugType` enum values exactly (case-sensitive)        |
| 5   | All timestamps **must** be ISO 8601 with UTC offset (`+00:00` or `Z`)                   |
| 6   | `time_taken_seconds` **must** be `> 0` for any real run                                 |
| 7   | `score.breakdown` **must** have exactly 3 keys: `base`, `speed_bonus`, `commit_penalty` |
