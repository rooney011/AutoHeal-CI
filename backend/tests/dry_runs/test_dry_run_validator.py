"""
Phase 12 — Pytest test wrapper for dry run validator.
Runs all 4 scenarios through the judge checklist and asserts all pass.

Run:
    cd d:\\AutoHeal-CI\\backend
    python -m pytest tests/dry_runs/test_dry_run_validator.py -v
"""
import json
import os
import re
import sys
import pytest

# ── Import from simulate_dry_run (same logic, reused) ─────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))
sys.path.insert(0, BACKEND_DIR)

from agent.results_engine import build_results, compute_score
from agent.failure_classifier import BugType

VALID_BUG_TYPES = {e.value for e in BugType}
ISO8601_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$"
)

SCENARIO_FILES = {
    1: os.path.join(SCRIPT_DIR, "scenario_1_single_bug.json"),
    2: os.path.join(SCRIPT_DIR, "scenario_2_many_bugs.json"),
    3: os.path.join(SCRIPT_DIR, "scenario_3_ci_fail_then_pass.json"),
    4: os.path.join(SCRIPT_DIR, "scenario_4_never_passes.json"),
}


def load_and_build(scenario_num: int) -> dict:
    """Load scenario JSON and produce results dict via the real engine."""
    with open(SCENARIO_FILES[scenario_num]) as f:
        scenario = json.load(f)
    inj = scenario["inject"]
    return build_results(
        repo_url=inj["repo_url"],
        branch=inj["branch"],
        failures=inj["failures"],
        fixes=inj["fixes"],
        ci_timeline=inj["ci_timeline"],
        time_taken_seconds=inj["time_taken_seconds"],
        iterations=inj["iterations"],
        commit_count=inj["commit_count"],
        success=inj["success"],
        run_id=f"test-s{scenario_num}",
    )


# ══════════════════════════════════════════════════════════════════════════════
#  Scenario 1 — Single Bug
# ══════════════════════════════════════════════════════════════════════════════

class TestScenario1SingleBug:
    @pytest.fixture(scope="class")
    def results(self):
        return load_and_build(1)

    def test_success_is_true(self, results):
        assert results["success"] is True

    def test_score_is_110(self, results):
        # 45s < 60s → base 100 + speed +10 = 110
        assert results["score"]["total"] == 110

    def test_branch_prefix(self, results):
        for fix in results["fixes"]:
            assert fix["branch"].startswith("ai-agent/"), \
                f"Branch '{fix['branch']}' must start with 'ai-agent/'"

    def test_commit_prefix(self, results):
        for fix in results["fixes"]:
            assert fix["commit_message"].startswith("fix:"), \
                f"Commit '{fix['commit_message']}' must start with 'fix:'"

    def test_bug_types_valid(self, results):
        for f in results["failures"]:
            assert f["bug_type"] in VALID_BUG_TYPES, \
                f"bug_type='{f['bug_type']}' not in valid set"

    def test_timeline_timestamps(self, results):
        for node in results["ci_timeline"]:
            for key in ("started_at", "completed_at"):
                assert ISO8601_RE.match(str(node[key])), \
                    f"{key}='{node[key]}' is not valid ISO 8601"

    def test_time_taken_positive(self, results):
        assert results["time_taken_seconds"] > 0

    def test_score_breakdown_keys(self, results):
        bd = results["score"]["breakdown"]
        assert set(bd.keys()) == {"base", "speed_bonus", "commit_penalty"}

    def test_score_math(self, results):
        bd = results["score"]["breakdown"]
        expected = max(0, bd["base"] + bd["speed_bonus"] + bd["commit_penalty"])
        assert results["score"]["total"] == expected


# ══════════════════════════════════════════════════════════════════════════════
#  Scenario 2 — Many Bugs (partial fix)
# ══════════════════════════════════════════════════════════════════════════════

class TestScenario2ManyBugs:
    @pytest.fixture(scope="class")
    def results(self):
        return load_and_build(2)

    def test_success_is_false(self, results):
        assert results["success"] is False

    def test_score_is_zero(self, results):
        # Not success → score = 0
        assert results["score"]["total"] == 0

    def test_three_fixes_applied(self, results):
        assert len(results["fixes"]) == 3

    def test_four_failures_detected(self, results):
        assert len(results["failures"]) == 4

    def test_all_branches_prefixed(self, results):
        for fix in results["fixes"]:
            assert fix["branch"].startswith("ai-agent/")

    def test_all_commits_prefixed(self, results):
        for fix in results["fixes"]:
            assert fix["commit_message"].startswith("fix:")

    def test_all_bug_types_valid(self, results):
        for f in results["failures"]:
            assert f["bug_type"] in VALID_BUG_TYPES

    def test_score_breakdown_keys(self, results):
        bd = results["score"]["breakdown"]
        assert set(bd.keys()) == {"base", "speed_bonus", "commit_penalty"}


# ══════════════════════════════════════════════════════════════════════════════
#  Scenario 3 — CI Fails Once Then Passes
# ══════════════════════════════════════════════════════════════════════════════

class TestScenario3CIFailThenPass:
    @pytest.fixture(scope="class")
    def results(self):
        return load_and_build(3)

    def test_success_is_true(self, results):
        assert results["success"] is True

    def test_score_is_110(self, results):
        # 52.8s < 60s → base 100 + speed +10 = 110
        assert results["score"]["total"] == 110

    def test_ci_timeline_has_two_entries(self, results):
        assert len(results["ci_timeline"]) == 2

    def test_first_ci_entry_failed(self, results):
        assert results["ci_timeline"][0]["passed"] is False
        assert results["ci_timeline"][0]["conclusion"] == "failure"

    def test_second_ci_entry_passed(self, results):
        assert results["ci_timeline"][1]["passed"] is True
        assert results["ci_timeline"][1]["conclusion"] == "success"

    def test_all_timestamps_valid(self, results):
        for node in results["ci_timeline"]:
            for key in ("started_at", "completed_at"):
                assert ISO8601_RE.match(str(node[key]))

    def test_branch_prefix(self, results):
        for fix in results["fixes"]:
            assert fix["branch"].startswith("ai-agent/")

    def test_commit_prefix(self, results):
        for fix in results["fixes"]:
            assert fix["commit_message"].startswith("fix:")


# ══════════════════════════════════════════════════════════════════════════════
#  Scenario 4 — Never Passes
# ══════════════════════════════════════════════════════════════════════════════

class TestScenario4NeverPasses:
    @pytest.fixture(scope="class")
    def results(self):
        return load_and_build(4)

    def test_success_is_false(self, results):
        assert results["success"] is False

    def test_score_is_zero(self, results):
        assert results["score"]["total"] == 0

    def test_no_fixes_applied(self, results):
        assert len(results["fixes"]) == 0

    def test_no_commits(self, results):
        assert results["commit_count"] == 0

    def test_no_ci_timeline(self, results):
        assert len(results["ci_timeline"]) == 0

    def test_two_failures_detected(self, results):
        assert len(results["failures"]) == 2

    def test_all_bug_types_valid(self, results):
        for f in results["failures"]:
            assert f["bug_type"] in VALID_BUG_TYPES

    def test_score_breakdown_keys(self, results):
        bd = results["score"]["breakdown"]
        assert set(bd.keys()) == {"base", "speed_bonus", "commit_penalty"}

    def test_time_taken_positive(self, results):
        assert results["time_taken_seconds"] > 0


# ══════════════════════════════════════════════════════════════════════════════
#  Cross-cutting: compute_score unit tests
# ══════════════════════════════════════════════════════════════════════════════

class TestComputeScore:
    def test_success_under_60s_no_penalty(self):
        score = compute_score(45.0, 5, True, 0)
        assert score["total"] == 110  # 100 + 10
        assert score["breakdown"]["base"] == 100
        assert score["breakdown"]["speed_bonus"] == 10
        assert score["breakdown"]["commit_penalty"] == 0

    def test_success_over_60s(self):
        score = compute_score(90.0, 5, True, 0)
        assert score["total"] == 100  # no speed bonus

    def test_success_with_commit_penalty(self):
        score = compute_score(30.0, 25, True, 0)
        # 100 + 10 - (5×2) = 100
        assert score["total"] == 100

    def test_failure_always_zero(self):
        score = compute_score(10.0, 1, False, 0)
        assert score["total"] == 0
        assert score["breakdown"]["base"] == 0

    def test_score_cannot_go_negative(self):
        score = compute_score(30.0, 100, True, 0)
        assert score["total"] >= 0
