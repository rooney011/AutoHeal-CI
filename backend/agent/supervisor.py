"""
Phase 1/7 — Supervisor
Orchestrates the full autonomous healing pipeline.
Single entrypoint: Supervisor.run()
"""
import os
import tempfile
import shutil
import uuid
import time
import traceback
from datetime import datetime, timezone

from agent.repo_analyzer import analyze_repo
from agent.test_discovery import run_tests
from agent.failure_classifier import classify_all_failures
from agent.patch_validator import run_fix_retry_loop
from agent.ci_monitor import poll_ci_status, build_ci_timeline
from agent.memory import record_run
from agent.results_engine import build_results, save_results
from git.git_ops import create_branch, commit_changes, push_branch, generate_commit_message
from utils.timer import Timer
from utils.validators import validate_github_url


class Supervisor:
    def __init__(
        self,
        repo_url: str,
        github_owner: str = "",
        github_repo: str = "",
        enable_ci_polling: bool = True,
        enable_push: bool = True,
    ):
        if not validate_github_url(repo_url):
            raise ValueError(f"Invalid GitHub URL: '{repo_url}'")

        self.repo_url = repo_url
        self.github_owner = github_owner
        self.github_repo = github_repo
        self.enable_ci_polling = enable_ci_polling
        self.enable_push = enable_push
        self.run_id = f"run-{uuid.uuid4().hex[:8]}"

    def run(self) -> dict:
        """
        Main execution pipeline:
        1. Clone repo
        2. Analyze + detect tests
        3. Run tests → collect failures
        4. Classify failures
        5. For each failure: run_fix_retry_loop
        6. Commit + push
        7. Poll CI
        8. Record memory
        9. Build + save results.json
        """
        timer = Timer()
        timer.start()

        workspace = tempfile.mkdtemp(prefix=f"autoheal_{self.run_id}_")
        repo_path = os.path.join(workspace, "repo")
        ci_results = []
        all_fixes = []
        total_commits = 0
        overall_success = False
        classified_failures = []  # Always in scope for build_results

        print(f"\n[Supervisor] ═══ Run {self.run_id} ═══")
        print(f"[Supervisor] Repo: {self.repo_url}")

        try:
            # ── Step 1: Clone ──────────────────────────────────────────
            print("[Supervisor] Cloning repo...")
            self._clone_repo(repo_path)

            # ── Step 2: Analyze ────────────────────────────────────────
            meta = analyze_repo(repo_path)
            print(f"[Supervisor] Language: {meta['language']}, Framework: {meta['test_framework']}")

            # ── Step 3: Run Tests ──────────────────────────────────────
            print("[Supervisor] Running initial tests...")
            test_result = run_tests(repo_path, meta["test_framework"])

            if test_result["passed"]:
                print("[Supervisor] All tests already passing. Nothing to fix.")
                overall_success = True
                raw_failures = []
            else:
                raw_failures = test_result["failures"]

                # Safety-net: if tests failed but we found 0 structured failures
                # (e.g. pytest-json-report not installed, or unusual error format),
                # synthesize a single UNKNOWN failure from the raw output so
                # the pipeline doesn't incorrectly declare success.
                if not raw_failures:
                    print("[Supervisor] ⚠ Tests failed but no structured failures parsed. "
                          "Injecting synthetic UNKNOWN failure from raw output.")
                    raw_failures = [{
                        "file": "",
                        "test_id": "unknown",
                        "line": "",
                        "error_message": test_result.get("raw_output", "Unknown error")[:1000],
                        "raw_output": test_result.get("raw_output", ""),
                    }]

                print(f"[Supervisor] Found {len(raw_failures)} failure(s).")

                # ── Step 4: Classify Failures ──────────────────────────
                classified_failures = classify_all_failures(raw_failures)

                # ── Step 5: Fix each failure ───────────────────────────
                iteration = 0
                for failure in classified_failures:
                    iteration += 1
                    bug_type = failure.get("bug_type", "UNKNOWN")
                    branch_name = f"ai-agent/fix-{bug_type}-{iteration:03d}"

                    print(f"\n[Supervisor] ── Fixing: {bug_type} (iteration {iteration}) ──")

                    # Create branch
                    create_branch(repo_path, branch_name)

                    # Run fix + retry loop
                    fix_result = run_fix_retry_loop(
                        repo_path=repo_path,
                        failure=failure,
                        on_success_callback=None,
                    )

                    if fix_result["success"]:
                        # Commit
                        msg = generate_commit_message(
                            action="Fix",
                            description=f"Resolve {bug_type} in {failure.get('file', 'unknown')}",
                        )
                        commit_changes(repo_path, msg)
                        total_commits += 1

                        # Push
                        if self.enable_push:
                            push_branch(repo_path, branch_name)

                        all_fixes.append({
                            "failure": failure,
                            "branch": branch_name,
                            "commit_message": msg,
                            "retry_count": fix_result["retry_count"],
                            "iterations": fix_result["iterations"],
                        })

                        # CI Poll
                        if self.enable_ci_polling and self.github_owner:
                            ci = poll_ci_status(
                                owner=self.github_owner,
                                repo=self.github_repo,
                                branch=branch_name,
                                iteration=iteration,
                            )
                            ci_results.append(ci)

                        # Record memory
                        record_run(
                            repo_url=self.repo_url,
                            branch=branch_name,
                            bug_type=bug_type,
                            success=True,
                            retry_count=fix_result["retry_count"],
                            ci_passed=ci_results[-1].get("passed") if ci_results else None,
                        )
                    else:
                        print(f"[Supervisor] ⚠ Could not fix {bug_type} after max retries.")
                        record_run(
                            repo_url=self.repo_url,
                            branch=branch_name,
                            bug_type=bug_type,
                            success=False,
                            retry_count=fix_result["retry_count"],
                            ci_passed=None,
                        )

                overall_success = len(all_fixes) == len(classified_failures)

        except Exception as e:
            print(f"[Supervisor] FATAL: {e}")
            traceback.print_exc()
            # Do NOT wipe classified_failures — preserve whatever was found
            # before the crash so the frontend still shows detected failures.
        finally:
            shutil.rmtree(workspace, ignore_errors=True)

        time_taken = timer.stop()
        ci_timeline = build_ci_timeline(ci_results)

        results = build_results(
            repo_url=self.repo_url,
            branch="main",
            failures=classified_failures,
            fixes=all_fixes,
            ci_timeline=ci_timeline,
            time_taken_seconds=time_taken,
            iterations=len(all_fixes),
            commit_count=total_commits,
            success=overall_success,
            run_id=self.run_id,
        )
        save_results(results, run_id=self.run_id)

        print(f"\n[Supervisor] ═══ Done. Success={overall_success}, Time={time_taken}s ═══")
        return results

    def _clone_repo(self, target_path: str) -> None:
        import subprocess

        clone_url = self.repo_url
        # Embed GITHUB_TOKEN for push access
        github_token = os.environ.get("GITHUB_TOKEN", "")
        if github_token and "github.com" in clone_url:
            # Convert https://github.com/... to https://<token>@github.com/...
            clone_url = clone_url.replace(
                "https://github.com",
                f"https://{github_token}@github.com",
            )

        max_retries = 3
        for attempt in range(max_retries):
            try:
                result = subprocess.run(
                    ["git", "clone", clone_url, target_path],
                    capture_output=True,
                    text=True,
                    timeout=120,
                )
                if result.returncode == 0:
                    break
                # If failed, raise to trigger except block
                raise RuntimeError(result.stderr)
            except Exception as e:
                if attempt == max_retries - 1:
                    raise RuntimeError(f"Clone failed after {max_retries} attempts: {e}")
                print(f"[Supervisor] Clone attempt {attempt+1} failed. Retrying in 2s...")
                import time
                time.sleep(2 * (attempt + 1))
