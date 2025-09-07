# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/frontend/package.json apps/frontend/tsconfig.json apps/frontend/next.config.mjs ./
COPY apps/frontend/public ./public
COPY apps/frontend/styles ./styles
COPY apps/frontend/app ./app
COPY apps/frontend/components ./components
COPY apps/frontend/hooks ./hooks
COPY apps/frontend/lib ./lib

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN pnpm --filter my-v0-project... build

# Stage 2: Run
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.env ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["pnpm", "start"] 