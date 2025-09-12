# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/ledgerX-backend ./apps/ledgerX-backend

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm --filter @ledgerX/db exec prisma generate
RUN pnpm --filter ledgerX-backend build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/ledgerX-backend/dist ./dist
COPY --from=builder /app/apps/ledgerX-backend/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Copy .env file from source
# COPY apps/ledgerX-backend/.env ./.env

ENV NODE_ENV=production
EXPOSE 5000

CMD ["node", "dist/server.js"]