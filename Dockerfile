# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN apk add --no-cache npm && \
    npm ci --only=production

# Copy built files and server
COPY --from=builder /app/dist ./dist
COPY server ./server

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server/index.js"]
