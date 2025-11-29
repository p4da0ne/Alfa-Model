# backend/Dockerfile
FROM python:3.12-slim

# Рабочая папка — где будет лежать app/
WORKDIR /app

# Копируем всё из backend/ в /app
COPY backend/ .

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Запускаем из папки app — где лежит main.py
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000", "app.main:app"]