FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY backend/requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend /app/backend

# Expose port for clarity (Cloud Run uses $PORT)
EXPOSE 8080

# Command to start the application
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "${PORT:-8080}"]
