FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY apps/mcp/package.json apps/mcp/
COPY packages/engine/package.json packages/engine/
COPY packages/content/package.json packages/content/
COPY packages/database/package.json packages/database/
RUN pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/mcp/node_modules ./apps/mcp/node_modules
COPY --from=deps /app/packages/ ./packages/
COPY . .
RUN pnpm --filter @community/mcp build

# Run
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 mcpuser

COPY --from=builder /app/apps/mcp/dist ./apps/mcp/dist
COPY --from=builder /app/apps/mcp/package.json ./apps/mcp/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

USER mcpuser
EXPOSE 3002
ENV MCP_PORT=3002
WORKDIR /app/apps/mcp
CMD ["node", "dist/server.js"]
