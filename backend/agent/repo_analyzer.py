"""
Phase 4 — Repo Analyzer
Scans cloned repo for structure, language, and test setup.
"""
import os


def analyze_repo(repo_path: str) -> dict:
    """
    Analyze the repository structure and return metadata.
    """
    from agent.test_discovery import detect_language, detect_test_framework

    language = detect_language(repo_path)
    framework = detect_test_framework(repo_path, language)

    return {
        "repo_path": repo_path,
        "language": language,
        "test_framework": framework,
        "has_requirements": os.path.isfile(os.path.join(repo_path, "requirements.txt")),
        "has_package_json": os.path.isfile(os.path.join(repo_path, "package.json")),
        "has_dockerfile": os.path.isfile(os.path.join(repo_path, "Dockerfile")),
    }
