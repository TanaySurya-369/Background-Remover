FROM python:3.10-slim

WORKDIR /app

# System dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (better caching)
COPY backend/requirements.txt ./requirements.txt

RUN pip install --no-cache-dir -r requirements.txt

# Copy full backend
COPY backend ./backend

ENV PYTHONPATH=/app

EXPOSE 8080

CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8080"]
