# ===== Лёгкий и быстрый продакшен-образ =====
FROM python:3.12-slim

WORKDIR /app

# Устанавливаем только нужное
RUN pip install --upgrade pip

# Копируем только requirements сначала (кэширование слоёв)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код
COPY backend/ .

# Запускаем через gunicorn + uvicorn workers (лучше, чем просто uvicorn)
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "2", \
     "--worker-connections", "1000", \
     "main:app"]