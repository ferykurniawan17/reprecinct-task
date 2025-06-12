# Use official Node.js runtime as base image
FROM node:18-alpine

# Install curl for health check
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for Prisma)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code after generating Prisma client
COPY dist ./dist/

# Copy environment file (optional, can be overridden by runtime env vars)
COPY .env* ./

# Remove dev dependencies to reduce image size (but keep Prisma client)
RUN npm prune --production --no-optional

# Remove the dist/node_modules to avoid conflicts and let it use root node_modules
RUN rm -rf dist/node_modules

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/health || exit 1

# Start the application
CMD ["node", "dist/index.js"]
