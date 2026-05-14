FROM python:3.10-slim

WORKDIR /app

# Install uv
RUN pip install --no-cache-dir uv

# Copy uv files first to cache dependencies
COPY pyproject.toml uv.lock ./

# Sync dependencies
RUN uv sync --frozen

# Copy project files
COPY . .

EXPOSE 8000

# Run the app
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
