FROM python:3.11-slim

# Install git (required for agent operations like clone/push)
RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .

# Ensure unbuffered output for real-time logs
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Make the script executable
RUN chmod +x start.sh

CMD ["./start.sh"]
