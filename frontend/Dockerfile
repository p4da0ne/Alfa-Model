# ===== ЭТАП 1: Сборка React (Vite) =====
FROM node:20-alpine AS build

WORKDIR /app
# Кэшируем зависимости
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ .
# Если нужна переменная окружения на сборке (например, API URL)
# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ===== ЭТАП 2: Финальный образ — только статика + Nginx =====
FROM nginx:alpine

# Копируем собранный фронтенд (Vite собирает в /dist)
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный nginx конфиг (будет ниже)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80