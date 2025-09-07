# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only the necessary files for install/build
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/ledgerX-backend/package.json apps/ledgerX-backend/tsconfig.json ./
COPY apps/ledgerX-backend/src ./src

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm --filter @ledgerX/db exec prisma generate
RUN pnpm --filter ledgerX-backend... build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

ENV NODE_ENV=production

CMD ["node", "dist/server.js"] 