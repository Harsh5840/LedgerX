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

# Create production deploy bundle
RUN pnpm deploy --filter ledgerX-backend --prod /app/deploy

# Install production dependencies in deploy bundle
RUN cd /app/deploy && pnpm install --prod --frozen-lockfile=false

# Generate Prisma client in the deploy bundle
RUN cd /app/deploy && npx prisma generate --schema node_modules/@ledgerX/db/prisma/schema.prisma

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy the production bundle
COPY --from=builder /app/deploy ./

# Set production environment
ENV NODE_ENV=production
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]