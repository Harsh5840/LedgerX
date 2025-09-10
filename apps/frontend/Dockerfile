# --- Stage 1: Build ---
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root manifests for workspace install
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages

# Copy frontend app
COPY apps/frontend ./apps/frontend

# Install pnpm + deps
RUN npm install -g pnpm
RUN pnpm install --no-frozen-lockfile

# Build Next.js app
RUN pnpm --filter ledgerX-frontend build

# --- Stage 2: Run ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only production artifacts
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["pnpm", "start"]
