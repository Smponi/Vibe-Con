# Stage 1: Build
FROM node:25-alpine AS build

# System-Deps für pnpm
RUN npm install -g pnpm

# User wechseln für den Build-Prozess
USER node
WORKDIR /home/node/app

# Files kopieren und Permissions sicherstellen
COPY --chown=node:node package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=node:node . .
RUN pnpm run build

# Stage 2: Runtime (Hardened Nginx)
# Das unprivileged Image läuft standardmäßig auf Port 8080 mit User 'nginx'
FROM nginxinc/nginx-unprivileged:alpine

# Static Files kopieren
COPY --from=build /home/node/app/dist /usr/share/nginx/html

# Port 8080 ist der Standard für unprivileged Nginx
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
