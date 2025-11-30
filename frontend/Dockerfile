FROM node:20-alpine AS build

WORKDIR /app

# 1. Копируем ТОЛЬКО package*.json
COPY frontend/package*.json ./

# 2. Устанавливаем зависимости (кэшируется)
RUN npm ci

# 3. Копируем код
COPY frontend/ .

# 4. Собираем
RUN npm run build

# Финальный образ
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY frontend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]