# Build stage
FROM node:18-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/* && \
    npm install -g npm@10.2.4 typescript vite

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies including devDependencies
RUN npm install --ignore-scripts --verbose

# Copy source code
COPY . .

# Debug build environment
RUN npm list || true && \
    ls -la && \
    echo "Node version: $(node -v)" && \
    echo "NPM version: $(npm -v)" && \
    echo "TypeScript version: $(tsc -v)" && \
    echo "Contents of tsconfig.json:" && \
    cat tsconfig.json && \
    echo "Contents of tsconfig.app.json:" && \
    cat tsconfig.app.json

# Run type check and build with verbose output
RUN tsc --noEmit && npm run build --verbose || (echo "Build failed" && npm list && exit 1)

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
