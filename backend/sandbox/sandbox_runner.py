"""
Phase 2 — Docker Sandbox Runner
Handles container lifecycle: build, clone, exec, teardown.
"""
import docker
import os
import tempfile
import shutil
import uuid
from typing import Optional

SANDBOX_IMAGE_NAME = "autoheal-sandbox"
DOCKERFILE_DIR = os.path.dirname(os.path.abspath(__file__))


def build_image(client: docker.DockerClient) -> None:
    """Build the sandbox Docker image from the local Dockerfile."""
    print(f"[Sandbox] Building image '{SANDBOX_IMAGE_NAME}'...")
    client.images.build(path=DOCKERFILE_DIR, tag=SANDBOX_IMAGE_NAME, rm=True)
    print(f"[Sandbox] Image '{SANDBOX_IMAGE_NAME}' built successfully.")


def run_in_sandbox(
    repo_url: str,
    command: list[str],
    env: Optional[dict] = None,
    timeout: int = 120,
) -> dict:
    """
    Clone repo into a temp workspace, run a command inside the sandbox container,
    and return stdout, stderr, exit_code.

    Always tears down the container after the run.
    """
    client = docker.from_env()
    container_name = f"autoheal-run-{uuid.uuid4().hex[:8]}"

    # Ensure image exists
    try:
        client.images.get(SANDBOX_IMAGE_NAME)
    except docker.errors.ImageNotFound:
        build_image(client)

    workspace = tempfile.mkdtemp(prefix="autoheal_workspace_")
    result = {"stdout": "", "stderr": "", "exit_code": -1}

    try:
        print(f"[Sandbox] Starting container '{container_name}'...")
        container = client.containers.run(
            SANDBOX_IMAGE_NAME,
            name=container_name,
            volumes={workspace: {"bind": "/workspace", "mode": "rw"}},
            environment=env or {},
            detach=True,
            network_mode="bridge",  # Limited; GitHub/PyPI only via firewall rules
            mem_limit="512m",
            cpu_count=2,
        )

        # Clone the repo
        print(f"[Sandbox] Cloning '{repo_url}'...")
        clone_result = container.exec_run(
            cmd=["git", "clone", repo_url, "/workspace/repo"],
            workdir="/workspace",
        )
        if clone_result.exit_code != 0:
            result["stderr"] = clone_result.output.decode("utf-8", errors="replace")
            result["exit_code"] = clone_result.exit_code
            return result

        # Run the provided command
        print(f"[Sandbox] Running command: {' '.join(command)}")
        exec_result = container.exec_run(
            cmd=command,
            workdir="/workspace/repo",
        )
        result["stdout"] = exec_result.output.decode("utf-8", errors="replace")
        result["exit_code"] = exec_result.exit_code

    except Exception as e:
        result["stderr"] = str(e)
        result["exit_code"] = -1
    finally:
        # Always teardown
        try:
            container = client.containers.get(container_name)
            container.stop(timeout=5)
            container.remove(force=True)
            print(f"[Sandbox] Container '{container_name}' removed.")
        except Exception:
            pass
        shutil.rmtree(workspace, ignore_errors=True)

    return result
