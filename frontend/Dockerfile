# ---------- Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Baked in at build time so the SPA calls the API at the right path.
# Compose passes VITE_API_URL=/api ; nginx (below) proxies /api -> backend:5000.
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine

# Static site
COPY --from=builder /app/dist /usr/share/nginx/html

# Serve the SPA + reverse-proxy the API to the backend container
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
