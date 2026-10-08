# Multi-stage production container for SEOC Disaster Platform
FROM python:3.9-slim

WORKDIR /app

# Install system GIS dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgdal-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose ports: 8000 (FastAPI / Web Dashboard), 8501 (Streamlit)
EXPOSE 8000 8501

# Default command: launch FastAPI Backend
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
