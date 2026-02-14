FROM python:3.10-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first
COPY backend/requirements.txt /app/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy full backend
COPY backend /app

# Cloud Run dynamic PORT support
CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port $PORT"]
