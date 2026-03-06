# Stage 1: Build the Angular application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for better layer caching
COPY package.json package-lock.json* ./

# Install dependencies (use ci when lockfile exists for reproducible builds)
RUN npm ci

# Copy source code
COPY . .

# Build the application for production
RUN npm run build -- --configuration=production

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy built files from builder stage
# Angular 17+ outputs to dist/<project-name>/browser
COPY --from=builder /app/dist/plant-id-app/browser /usr/share/nginx/html

# Copy nginx configuration (optional, for SPA routing)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

