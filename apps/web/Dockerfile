FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/
COPY packages/engine/package.json packages/engine/
COPY packages/content/package.json packages/content/
COPY packages/ui/package.json packages/ui/
COPY packages/database/package.json packages/database/
COPY packages/theme/package.json packages/theme/
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ ./packages/
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter @community/web build

# Run
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/content ./content

USER nextjs
EXPOSE 3003
ENV PORT=3003
WORKDIR /app/apps/web
CMD ["pnpm", "start"]
