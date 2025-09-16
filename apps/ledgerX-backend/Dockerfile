# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy workspace configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all packages and the backend app
COPY packages ./packages
COPY apps/ledgerX-backend ./apps/ledgerX-backend

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile=false

# Generate Prisma client
RUN pnpm --filter @ledgerX/db exec prisma generate

# Build all packages in correct order
RUN pnpm -r build

# Copy the entire workspace to deploy directory (excluding deploy dir)
RUN mkdir -p /app/deploy
RUN cp -r packages apps package.json pnpm-lock.yaml pnpm-workspace.yaml /app/deploy/

# Install production dependencies
RUN cd /app/deploy && pnpm install --prod --frozen-lockfile=false

# Copy the already generated Prisma client from the build stage
RUN cp -r node_modules/.pnpm/@prisma+client@* /app/deploy/node_modules/.pnpm/ 2>/dev/null || true
RUN cp -r node_modules/@prisma /app/deploy/node_modules/ 2>/dev/null || true

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy the production bundle
COPY --from=builder /app/deploy ./

# Set production environment
ENV NODE_ENV=production
EXPOSE 5000

# Start the application
CMD ["node", "apps/ledgerX-backend/dist/server.js"]