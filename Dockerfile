# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and configs
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY index.html ./

# Install dependencies
RUN npm install --ignore-scripts

# Copy source code
COPY src ./src
COPY public ./public

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Runtime stage
FROM node:18-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --omit=dev --no-optional --ignore-scripts

# Copy built files and server
COPY --from=builder /app/dist ./dist
COPY server ./server

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Create non-root user
RUN useradd -r -u 1001 -g root appuser && \
    chown -R appuser:root /app && \
    chmod -R g+w /app

USER appuser

# Expose port
EXPOSE 3000

# Health check with increased timeout
HEALTHCHECK --interval=30s --timeout=30s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT}/health || exit 1

# Start the server
CMD ["node", "server/index.js"]
