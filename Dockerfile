# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g npm@10.2.4 typescript@5.0.4 vite@4.2.1

# Copy package files and TypeScript configs
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Install all dependencies including devDependencies
RUN npm install --ignore-scripts --verbose

# Copy source code
COPY . .

# Debug build environment
RUN echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)" && \
    echo "TypeScript version: $(tsc -v)" && \
    echo "Vite version: $(vite --version)" && \
    echo "Directory contents:" && \
    ls -la && \
    echo "TypeScript config:" && \
    cat tsconfig.json

# Build the application
RUN NODE_ENV=production npm run build || (echo "Build failed with error $?" && ls -la && exit 1)

# Runtime stage
FROM node:18-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files and install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev --no-optional --ignore-scripts --verbose

# Copy built files and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

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
