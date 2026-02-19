FROM mirror.gcr.io/library/python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python test runners
RUN pip install --no-cache-dir \
    pytest \
    pytest-json-report \
    pylint \
    flake8

# Set up working directory
WORKDIR /workspace

# Default: keep container alive for exec
CMD ["tail", "-f", "/dev/null"]
