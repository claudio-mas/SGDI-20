# Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Produção - apenas arquivos estáticos
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/dist ./dist
# Os arquivos serão servidos pelo OpenResty via volume
CMD ["echo", "Build concluído. Arquivos em /app/dist"]
