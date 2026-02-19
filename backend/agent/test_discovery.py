"""
Phase 4 — Test Discovery & Execution
Detects language, framework, runs tests, parses failure output.
No hardcoded paths. No guessing.
"""
import os
import sys
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


# ─── Dependency Installation ─────────────────────────────────────────────────
def _install_dependencies(repo_path: str) -> None:
    """
    Install requirements.txt / package.json deps before running tests.
    Silently skipped if no lockfile is found.
    """
    req_file = os.path.join(repo_path, "requirements.txt")
    if os.path.isfile(req_file):
        import subprocess
        print("[TestDiscovery] Installing Python deps (requirements.txt)...")
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", req_file, "--quiet"],
            cwd=repo_path,
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode != 0:
            print(f"[TestDiscovery] pip install warnings/errors:\n{result.stderr[:500]}")
        else:
            print("[TestDiscovery] dep install OK")


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
    _install_dependencies(repo_path)

    report_path = os.path.join(repo_path, ".autoheal_report.json")
    cmd = [
        sys.executable, "-m", "pytest",
        "--json-report",
        f"--json-report-file={report_path}",
        "--tb=short",
        "-q",
    ]
    result = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True, timeout=120)
    raw_output = result.stdout + result.stderr

    failures = []
    if os.path.exists(report_path):
        try:
            with open(report_path, "r") as f:
                report = json.load(f)

            # Standard test failures
            for test in report.get("tests", []):
                if test.get("outcome") in ("failed", "error"):
                    call = test.get("call", {})
                    failures.append({
                        "file": test.get("nodeid", "").split("::")[0],
                        "test_id": test.get("nodeid", ""),
                        "line": call.get("longrepr", "").split("\n")[0] if call else "",
                        "error_message": call.get("longrepr", "") if call else "",
                        "raw_output": raw_output,
                    })

            # Collection errors (SyntaxError / ImportError cause pytest to fail
            # at collection time — these show up under "collectors", not "tests")
            for collector in report.get("collectors", []):
                if collector.get("outcome") == "error":
                    longrepr = collector.get("longrepr", "")
                    failures.append({
                        "file": collector.get("nodeid", "").split("::")[0],
                        "test_id": collector.get("nodeid", ""),
                        "line": "",
                        "error_message": longrepr,
                        "raw_output": raw_output,
                    })
        except (json.JSONDecodeError, KeyError):
            failures = _parse_pytest_output(raw_output)
        finally:
            try:
                os.remove(report_path)
            except OSError:
                pass
    
    # Fallback: if JSON report found nothing (or wasn't generated), 
    # try parsing raw output. This is crucial for collection errors 
    # where pytest-json-report might not populate 'collectors' as expected.
    if not failures:
        failures = _parse_pytest_output(raw_output)
    
    passed = result.returncode == 0
    return {"passed": passed, "failures": failures, "raw_output": raw_output}


def _run_unittest(repo_path: str) -> dict:
    _install_dependencies(repo_path)
    cmd = [sys.executable, "-m", "unittest", "discover", "-v"]
    result = subprocess.run(cmd, cwd=repo_path, capture_output=True, text=True, timeout=120)
    raw = result.stdout + result.stderr
    failures = _parse_unittest_output(raw)
    return {"passed": result.returncode == 0, "failures": failures, "raw_output": raw}


def _run_jest(repo_path: str) -> dict:
    # Install node deps if package.json exists
    pkg_json = os.path.join(repo_path, "package.json")
    if os.path.isfile(pkg_json):
        print("[TestDiscovery] Installing node deps (npm install)...")
        subprocess.run(
            "npm install --silent",
            cwd=repo_path, capture_output=True, text=True,
            timeout=120, shell=True,
        )

    # Use shell=True so Windows finds npx.cmd
    result = subprocess.run(
        "npx jest --json",
        cwd=repo_path, capture_output=True, text=True,
        timeout=120, shell=True,
    )
    failures = _parse_jest_output(result.stdout)
    return {"passed": result.returncode == 0, "failures": failures, "raw_output": result.stdout}


# ─── Output Parsers ───────────────────────────────────────────────────────────
def _parse_pytest_output(output: str) -> list[dict]:
    """
    Fallback parser for pytest short TB output.
    Handles both:
    - Test failures:    FAILED tests/test_foo.py::test_bar - AssertionError
    - Collection errors: ERROR collecting tests/test_foo.py  (SyntaxError, ImportError)
    """
    failures = []
    seen = set()

    # 1. Regular FAILED lines
    fail_pattern = re.compile(r"^FAILED (.+?)(?:\s+-\s+(.+))?$", re.MULTILINE)
    for match in fail_pattern.finditer(output):
        file_path = match.group(1).split("::")[0].strip()
        test_id = match.group(1).strip()
        key = test_id
        if key not in seen:
            seen.add(key)
            failures.append({
                "file": file_path,
                "test_id": test_id,
                "line": "",
                "error_message": match.group(2).strip() if match.group(2) else "",
                "raw_output": output,
            })

    # 2. Collection errors — split output into sections by separator lines,
    # then scan each section for its 'ERROR collecting' header and E-lines.
    # This prevents cross-section bleeding of error messages.
    sections = _split_into_sections(output)
    for section in sections:
        # Check if this section contains a collection error header
        header_match = re.search(
            r"ERROR collecting (.+?\.py)\b",
            section,
        )
        if not header_match:
            continue
        file_path = header_match.group(1).strip()
        key = f"collect:{file_path}"
        if key in seen:
            continue
        seen.add(key)
        # Extract E-lines from this section only
        error_message = _extract_e_lines(section)
        failures.append({
            "file": file_path,
            "test_id": file_path,
            "line": "",
            "error_message": error_message,
            "raw_output": output,
        })

    return failures


def _split_into_sections(output: str) -> list[str]:
    """
    Split pytest output into sections.
    Splits on:
    1. Pure separator lines (=====, _____, -----)
    2. 'ERROR collecting' subsection headers (e.g. '_____ ERROR collecting foo.py _____')
    """
    sections = []
    current: list[str] = []
    collect_header = re.compile(r"^_+\s+ERROR collecting ")

    for line in output.splitlines():
        is_pure_sep = set(line.strip()).issubset({"_", "-", "=", " "}) and len(line.strip()) > 10
        is_collect_header = bool(collect_header.match(line))

        if is_pure_sep or is_collect_header:
            if current:
                sections.append("\n".join(current))
            current = [line]
        else:
            current.append(line)

    if current:
        sections.append("\n".join(current))
    return sections


def _extract_e_lines(section: str) -> str:
    """
    Extract lines prefixed with 'E ' from a pytest section.
    These are the actual exception lines (e.g. SyntaxError, IndentationError).
    Falls back to any non-blank, non-separator content.
    """
    e_lines = []
    for line in section.splitlines():
        if line.startswith("E ") or line.startswith("E\t"):
            e_lines.append(line[2:].strip())

    if e_lines:
        return "\n".join(e_lines)[:1000]

    # Fallback: return a cleaned snippet of the section
    non_sep = [
        ln.strip() for ln in section.splitlines()
        if ln.strip() and not set(ln.strip()).issubset({"_", "-", "=", " "})
    ]
    return "\n".join(non_sep[:15])[:1000]


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
