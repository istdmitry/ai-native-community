# AI-Native Community

Independent, community-driven platform for AI-Native methodology. 10-page website + MCP server for AI agents.

## Tech Stack
- Next.js 14 (App Router) at `apps/web/`
- MCP Server (Express + Streamable HTTP) at `apps/mcp/`
- Supabase (PostgreSQL)
- pnpm monorepo with `packages/*`
- TypeScript strict mode

## Package Namespace
All packages use `@community/*` prefix (not `@repo/*`).

## Monorepo Layout
```
apps/web/          — Next.js web platform (port 3001)
apps/mcp/          — MCP server (port 3002)
packages/engine/   — Scoring engine (forked from ai-native-app)
packages/content/  — Content loaders, YAML data, i18n
packages/ui/       — Base UI components
packages/database/ — Supabase types and migrations
packages/theme/    — Single dark theme (from org design system)
content/           — MDX pages, YAML frameworks, assessment content
scripts/           — Build-time scripts (content sync)
```

## Design
- Dark-only theme: bg=#0F1419, text=#E8E9ED, accent teal=#0D9E8F
- Design tokens from org design system: `C:\dev\ai-native-organization\design-system\tokens\style1-dark.json`
- Independent visual identity (not 8Hats branded)

## Key Commands
```bash
pnpm dev              # Start web app (localhost:3001)
pnpm dev:mcp          # Start MCP server (localhost:3002)
pnpm -r type-check    # Type-check all packages
pnpm -r test          # Run all tests
pnpm build            # Build everything
```

## Conventions
- Content source of truth: YAML + MDX in `/content/`
- DB synced at build time via `scripts/sync-content.ts`
- No auth for MVP (anonymous assessment, optional email)
- English only for MVP
