FROM node:20-alpine AS builder

WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Просто отдаём готовую папку dist
FROM alpine:latest
RUN mkdir -p /dist
COPY --from=builder /app/dist /dist