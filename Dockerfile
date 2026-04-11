# ==========================================
# DOCKER CONFIGURATION FOR NESTJS BACKEND
# ==========================================
# This Dockerfile creates a production-ready container for the LocalHands backend
# It uses multi-stage builds to optimize image size and security

# ==========================================
# STAGE 1: BUILD
# ==========================================
# This stage builds the application and its dependencies
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# ==========================================
# DEPENDENCY INSTALLATION
# ==========================================
# Copy package files first to leverage Docker cache
COPY package*.json ./
COPY tsconfig*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# ==========================================
# BUILD APPLICATION
# ==========================================
# Build the NestJS application using TypeScript compiler
RUN npm run build

# ==========================================
# STAGE 2: PRODUCTION
# ==========================================
# This stage creates the final production image
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# ==========================================
# NON-ROOT USER SETUP
# ==========================================
# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# ==========================================
# DEPENDENCY INSTALLATION (PRODUCTION ONLY)
# ==========================================
# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# ==========================================
# COPY BUILT ARTIFACTS
# ==========================================
# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist

# Copy Prisma files for database operations
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# ==========================================
# USER PERMISSIONS
# ==========================================
# Switch to non-root user
USER nestjs

# ==========================================
# EXPOSE PORT
# ==========================================
# Expose the application port (default NestJS port)
EXPOSE 3000

# ==========================================
# HEALTH CHECK
# ==========================================
# Add health check to ensure container is running properly
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# ==========================================
# START COMMAND
# ==========================================
# Start the NestJS application in production mode
CMD ["node", "dist/main.js"]
