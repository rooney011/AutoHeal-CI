"""
Phase 4 — Test Discovery & Execution
Detects language, framework, runs tests, parses failure output.
No hardcoded paths. No guessing.
"""
import os
import subprocess
import re
import json
from typing import Optional


# ─── Language / Framework Detection ───────────────────────────────────────────
def detect_language(repo_path: str) -> str:
    """Detect primary language of the repo by file presence."""
    py_files = _count_files_with_ext(repo_path, ".py")
    js_files = _count_files_with_ext(repo_path, ".js") + _count_files_with_ext(repo_path, ".ts")

    if py_files >= js_files:
        return "python"
    return "javascript"


def detect_test_framework(repo_path: str, language: str) -> str:
    """Detect the test framework used in the repo."""
    if language == "python":
        if _file_exists(repo_path, "pytest.ini") or _file_exists(repo_path, "pyproject.toml"):
            return "pytest"
        if _file_exists(repo_path, "setup.py"):
            return "unittest"
        return "pytest"  # Default for Python
    elif language == "javascript":
        pkg = _read_package_json(repo_path)
        if pkg:
            scripts = pkg.get("scripts", {})
            deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
            if "jest" in deps or "jest" in scripts.get("test", ""):
                return "jest"
        return "jest"  # Default for JS
    return "unknown"


# ─── Test Execution ───────────────────────────────────────────────────────────
def run_tests(repo_path: str, framework: str) -> dict:
    """
    Run tests using the detected framework.
    Returns structured dict: { "passed": bool, "failures": [...], "raw_output": str }
    """
    if framework == "pytest":
        return _run_pytest(repo_path)
    elif framework == "unittest":
        return _run_unittest(repo_path)
    elif framework == "jest":
        return _run_jest(repo_path)
    else:
        return {"passed": False, "failures": [], "raw_output": f"Unknown framework: {framework}"}


def _run_pytest(repo_path: str) -> dict:
    report_path = os.path.join(repo_path, ".autoheal_report.json")
    cmd = [
        "pytest",
        "--json-report",
        f"--json-report-file={report_path}",
        "--tb=short",
        "-q",
    ]
    result = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True, timeout=120)
    raw_output = result.stdout + result.stderr

    failures = []
    if os.path.exists(report_path):
        with open(report_path, "r") as f:
            report = json.load(f)
        for test in report.get("tests", []):
            if test.get("outcome") in ("failed", "error"):
                call = test.get("call", {})
                failures.append({
                    "file": test.get("nodeid", "").split("::")[0],
                    "test_id": test.get("nodeid", ""),
                    "line": call.get("longrepr", "").split("\n")[0] if call else "",
                    "error_message": call.get("longrepr", "") if call else "",
                })
        os.remove(report_path)
    else:
        # Fallback: parse raw output
        failures = _parse_pytest_output(raw_output)

    passed = result.returncode == 0
    return {"passed": passed, "failures": failures, "raw_output": raw_output}


def _run_unittest(repo_path: str) -> dict:
    cmd = ["python", "-m", "unittest", "discover", "-v"]
    result = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True, timeout=120)
    raw = result.stdout + result.stderr
    failures = _parse_unittest_output(raw)
    return {"passed": result.returncode == 0, "failures": failures, "raw_output": raw}


def _run_jest(repo_path: str) -> dict:
    cmd = ["npx", "jest", "--json"]
    result = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True, timeout=120)
    failures = _parse_jest_output(result.stdout)
    return {"passed": result.returncode == 0, "failures": failures, "raw_output": result.stdout}


# ─── Output Parsers ───────────────────────────────────────────────────────────
def _parse_pytest_output(output: str) -> list[dict]:
    """Fallback parser for pytest short TB output."""
    failures = []
    pattern = re.compile(r"FAILED (.+?)(?:\s*-\s*(.+))?$", re.MULTILINE)
    for match in pattern.finditer(output):
        failures.append({
            "file": match.group(1).split("::")[0].strip(),
            "test_id": match.group(1).strip(),
            "line": "",
            "error_message": match.group(2).strip() if match.group(2) else "",
        })
    return failures


def _parse_unittest_output(output: str) -> list[dict]:
    failures = []
    pattern = re.compile(r"FAIL: (.+?)\n.*?AssertionError: (.+?)(?=\n-{60}|\Z)", re.DOTALL)
    for match in pattern.finditer(output):
        failures.append({
            "file": "",
            "test_id": match.group(1).strip(),
            "line": "",
            "error_message": match.group(2).strip(),
        })
    return failures


def _parse_jest_output(output: str) -> list[dict]:
    failures = []
    try:
        data = json.loads(output)
        for suite in data.get("testResults", []):
            for test in suite.get("testResults", []):
                if test.get("status") == "failed":
                    failures.append({
                        "file": suite.get("testFilePath", ""),
                        "test_id": " > ".join(test.get("ancestorTitles", []) + [test.get("title", "")]),
                        "line": "",
                        "error_message": "\n".join(test.get("failureMessages", [])),
                    })
    except (json.JSONDecodeError, KeyError):
        pass
    return failures


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _count_files_with_ext(root: str, ext: str) -> int:
    count = 0
    for _, _, files in os.walk(root):
        count += sum(1 for f in files if f.endswith(ext))
    return count


def _file_exists(root: str, filename: str) -> bool:
    return os.path.isfile(os.path.join(root, filename))


def _read_package_json(root: str) -> Optional[dict]:
    pkg_path = os.path.join(root, "package.json")
    if os.path.isfile(pkg_path):
        with open(pkg_path, "r") as f:
            return json.load(f)
    return None
