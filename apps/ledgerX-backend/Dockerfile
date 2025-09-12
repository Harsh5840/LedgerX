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
RUN pnpm -r build
# Create a pruned deployable bundle with correct node_modules layout
RUN pnpm deploy --filter ledgerX-backend --prod /app/deploy

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

# Copy the deploy bundle
COPY --from=builder /app/deploy ./

ENV NODE_ENV=production
EXPOSE 5000

# Generate Prisma Client in the final image so .prisma/client exists at runtime
RUN npx prisma generate --schema node_modules/@ledgerX/db/prisma/schema.prisma

CMD ["node", "dist/server.js"]