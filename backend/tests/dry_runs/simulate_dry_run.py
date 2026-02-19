"""
Phase 12 — Dry Run Simulator & Judge Checklist
===============================================
Usage:
    python tests/dry_runs/simulate_dry_run.py --scenario 1
    python tests/dry_runs/simulate_dry_run.py --scenario 2
    python tests/dry_runs/simulate_dry_run.py --scenario 3
    python tests/dry_runs/simulate_dry_run.py --scenario 4
    python tests/dry_runs/simulate_dry_run.py --all

Exit code: 0 if all checks PASS, 1 if any FAIL.
"""
import argparse
import json
import os
import sys
import re
from datetime import datetime, timezone

# ── Resolve paths relative to this script ──────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))
sys.path.insert(0, BACKEND_DIR)

from agent.results_engine import build_results, save_results

SCENARIO_FILES = {
    1: os.path.join(SCRIPT_DIR, "scenario_1_single_bug.json"),
    2: os.path.join(SCRIPT_DIR, "scenario_2_many_bugs.json"),
    3: os.path.join(SCRIPT_DIR, "scenario_3_ci_fail_then_pass.json"),
    4: os.path.join(SCRIPT_DIR, "scenario_4_never_passes.json"),
}

VALID_BUG_TYPES = {
    "LINTING", "SYNTAX", "INDENTATION", "TYPE",
    "TEST_FAILURE", "TIMEOUT", "DEPENDENCY", "UNKNOWN",
}

# ISO 8601 with UTC offset (flexible: +00:00 or Z)
ISO8601_RE = re.compile(
    r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$"
)


# ── CHECKLIST ──────────────────────────────────────────────────────────────────

def check_branch_prefix(results: dict) -> list[tuple[bool, str]]:
    """All fix branches must start with 'ai-agent/'."""
    issues = []
    for fix in results.get("fixes", []):
        branch = fix.get("branch", "")
        ok = branch.startswith("ai-agent/")
        issues.append((ok, f"Branch '{branch}' {'✅' if ok else '❌ must start with ai-agent/'}"))
    if not issues:
        issues.append((True, "✅ No fixes to check (ok for never-passes scenario)"))
    return issues


def check_commit_prefix(results: dict) -> list[tuple[bool, str]]:
    """All commit messages must start with 'fix:'."""
    issues = []
    for fix in results.get("fixes", []):
        msg = fix.get("commit_message", "")
        ok = msg.startswith("fix:")
        issues.append((ok, f"Commit '{msg}' {'✅' if ok else '❌ must start with fix:'}"))
    if not issues:
        issues.append((True, "✅ No commits to check (ok for never-passes scenario)"))
    return issues


def check_bug_types(results: dict) -> list[tuple[bool, str]]:
    """All bug_type values must be in the exact BugType enum."""
    issues = []
    for f in results.get("failures", []):
        bt = f.get("bug_type", "")
        ok = bt in VALID_BUG_TYPES
        issues.append((ok, f"bug_type='{bt}' {'✅' if ok else f'❌ not in valid set: {VALID_BUG_TYPES}'}"))
    if not issues:
        issues.append((True, "✅ No failures to check"))
    return issues


def check_timeline_timestamps(results: dict) -> list[tuple[bool, str]]:
    """CI timeline entries must have valid ISO 8601 UTC timestamps."""
    issues = []
    for node in results.get("ci_timeline", []):
        for key in ("started_at", "completed_at"):
            val = node.get(key, "")
            ok = bool(ISO8601_RE.match(str(val)))
            issues.append((ok, f"ci_timeline[{node.get('iteration')}].{key}='{val}' {'✅' if ok else '❌ invalid ISO 8601'}"))
    if not issues:
        issues.append((True, "✅ No CI timeline entries to check"))
    return issues


def check_time_tracking(results: dict) -> list[tuple[bool, str]]:
    """time_taken_seconds must be > 0."""
    t = results.get("time_taken_seconds", 0)
    ok = isinstance(t, (int, float)) and t > 0
    return [(ok, f"time_taken_seconds={t} {'✅' if ok else '❌ must be > 0'}")]


def check_score_structure(results: dict) -> list[tuple[bool, str]]:
    """score.breakdown must have exactly the 3 required keys."""
    score = results.get("score", {})
    breakdown = score.get("breakdown", {})
    required = {"base", "speed_bonus", "commit_penalty"}
    present = set(breakdown.keys())
    ok = required == present
    return [(ok, f"score.breakdown keys={sorted(present)} {'✅' if ok else f'❌ expected {sorted(required)}'}")]


def check_score_math(results: dict) -> list[tuple[bool, str]]:
    """score.total must equal what the backend formula would produce (verify backend did the math)."""
    score = results.get("score", {})
    total = score.get("total", None)
    bd = score.get("breakdown", {})
    base = bd.get("base", 0)
    bonus = bd.get("speed_bonus", 0)
    penalty = bd.get("commit_penalty", 0)
    expected = max(0, base + bonus + penalty)
    ok = total == expected
    return [(ok, f"score.total={total} == base({base})+bonus({bonus})+penalty({penalty})={expected} {'✅' if ok else '❌ mismatch'}")]


CHECKS = [
    ("Branch name prefix (ai-agent/)", check_branch_prefix),
    ("Commit message prefix (fix:)", check_commit_prefix),
    ("Bug type enum values", check_bug_types),
    ("CI timeline ISO 8601 timestamps", check_timeline_timestamps),
    ("Time tracking > 0", check_time_tracking),
    ("Score breakdown structure", check_score_structure),
    ("Score math (backend only)", check_score_math),
]


# ── RUNNER ────────────────────────────────────────────────────────────────────

def run_scenario(scenario_num: int) -> bool:
    path = SCENARIO_FILES.get(scenario_num)
    if not path or not os.path.isfile(path):
        print(f"[Simulator] ❌ Scenario file not found: {path}")
        return False

    with open(path) as f:
        scenario = json.load(f)

    inject = scenario["inject"]

    print(f"\n{'═'*60}")
    print(f"  Scenario {scenario_num}: {scenario.get('_scenario', '?')}")
    print(f"  {scenario.get('_description', '')}")
    print(f"{'═'*60}")

    # Build results using the actual engine (same code as prod)
    results = build_results(
        repo_url=inject["repo_url"],
        branch=inject["branch"],
        failures=inject["failures"],
        fixes=inject["fixes"],
        ci_timeline=inject["ci_timeline"],
        time_taken_seconds=inject["time_taken_seconds"],
        iterations=inject["iterations"],
        commit_count=inject["commit_count"],
        success=inject["success"],
        run_id=f"dry-run-s{scenario_num}",
    )

    save_results(results, run_id=f"dry-run-s{scenario_num}")
    print(f"\n[Simulator] Results saved to results/dry-run-s{scenario_num}.json\n")

    # Run all judge checks
    all_passed = True
    for check_name, check_fn in CHECKS:
        print(f"  ── {check_name}")
        sub_results = check_fn(results)
        for ok, msg in sub_results:
            print(f"       {msg}")
            if not ok:
                all_passed = False

    # Verify expected outcomes from scenario metadata
    expected = scenario.get("_expected", {})
    if "score" in expected:
        actual_score = results["score"]["total"]
        exp_score = expected["score"]
        ok = actual_score == exp_score
        print(f"\n  ── Expected score: {exp_score}")
        print(f"       score.total={actual_score} {'✅' if ok else '❌ expected ' + str(exp_score)}")
        if not ok:
            all_passed = False

    print(f"\n{'═'*60}")
    print(f"  Scenario {scenario_num} → {'✅ ALL CHECKS PASSED' if all_passed else '❌ SOME CHECKS FAILED'}")
    print(f"{'═'*60}\n")

    return all_passed


def main():
    parser = argparse.ArgumentParser(description="AutoHeal CI — Dry Run Judge Simulator")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--scenario", type=int, choices=[1, 2, 3, 4], help="Run a single scenario (1-4)")
    group.add_argument("--all", action="store_true", help="Run all 4 scenarios")
    args = parser.parse_args()

    scenarios = [1, 2, 3, 4] if args.all else [args.scenario]

    results_map = {}
    for s in scenarios:
        results_map[s] = run_scenario(s)

    print("\n══════════════ SUMMARY ══════════════")
    all_ok = True
    for s, passed in results_map.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"  Scenario {s}: {status}")
        if not passed:
            all_ok = False
    print("═════════════════════════════════════\n")

    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()
