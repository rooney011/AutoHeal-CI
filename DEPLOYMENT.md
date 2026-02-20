# Deployment Guide for AutoHeal-CI 🚀

This guide explains how to deploy the AutoHeal-CI application using Docker Compose. This ensures a consistent environment for both the Python backend and React frontend.

## Prerequisites

- **Docker Desktop** (or Docker Engine + Compose)
- **Git**

## Quick Start (Deploying Local Code)

Since `git pull` failed due to network issues, deploy the code **currently on your machine**:

1.  **Navigate to Project Root**:

    ```bash
    cd d:\AutoHeal-CI
    ```

2.  **Configure Environment**:
    Check `backend/.env` for your API keys.

    ```ini
    # Example backend/.env
    LLM_BASE_URL="https://api.openai.com/v1"  # Or Groq/Gemini via OpenAI compat
    LLM_API_KEY="sk-..."                      # Your Key
    LLM_MODEL="gpt-4o"                        # Or relevant model
    ```

3.  **Build & Run**:

    ```bash
    docker-compose up --build -d
    ```

    - This will build `backend` (Python) and `frontend` (React -> Nginx).

4.  **Access App**:
    - Frontend: [http://localhost:5173](http://localhost:5173)
    - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs)

5.  **View Logs**:

    ```bash
    docker-compose logs -f backend
    ```

6.  **Stop**:
    ```bash
    docker-compose down
    ```

## Persistence

Results are stored in `./results`, which is mounted as a volume. Data persists across container restarts.
