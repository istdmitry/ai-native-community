# AI-Native Community

An independent, community-driven platform for AI-native practice: self-assessments,
published frameworks, and an MCP server so an AI agent can read the same material directly.

Not a product of any single company — the content is meant to be inspected, argued with,
and reused.

## What is in here

- `content/frameworks/` — the published frameworks (AI-Nativity, HALA) as MDX plus a
  machine-readable YAML twin.
- `content/assessments/` — assessment definitions.
- `content/levels/` — the maturity levels the scoring engine maps onto.
- `apps/web/` — Next.js 14 (App Router) site.
- `apps/mcp/` — MCP server (Express + Streamable HTTP) exposing the same content to agents.
- `packages/engine/` — scoring engine.

Content is the source of truth in YAML and MDX under `content/`, and is synced into the
database at build time by `scripts/sync-content.ts`.

## Running it

```bash
pnpm install
pnpm dev          # web app on localhost:3001
pnpm dev:mcp      # MCP server on localhost:3002
pnpm -r type-check
pnpm -r test
```

Requires pnpm and a Supabase (PostgreSQL) connection for the database-backed paths.

## Status

MVP scope: English only, no auth, anonymous assessment with an optional email. Development
is intermittent — read the commit history before assuming any part is current.
