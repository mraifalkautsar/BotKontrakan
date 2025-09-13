FROM node:20-alpine as build

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci

# Set build environment
ENV NODE_ENV=production

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Second stage for a smaller production image
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy built frontend from previous stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/src/backend ./src/backend

# Create and set permissions for data directory
RUN mkdir -p data && \
    chown -R nodeuser:nodejs /app

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 15000

# Set environment variables
ENV PORT=15000

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:15000/api/health || exit 1

# Add metadata
LABEL maintainer="Kontrakan Team" \
      version="1.0" \
      description="Bot Kontrakan - Household Management System"

# Start the server
CMD ["node", "src/backend/server.js"]