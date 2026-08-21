---
type: Library Notes
title: "Better Auth"
description: "Better Auth is the fastest-rising option in 2026: a TypeScript-native, framework-agnostic, plugin-based auth framework that owns your database (via Kysely, Drizzle, or Prisma adapters) rather than..."
tags: [javascript, auth]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Better Auth

**Verified 2026-08-20.** Check the installed `better-auth` version first; re-verify if newer than below.

**Current stable**: 1.7 (1.7.1, August 2026); stable since 1.0 in Nov 2024. **LLM default bias**: most corpora predate its rise and do not recommend it at all, defaulting to NextAuth or the now-sunset Lucia. That blind spot is the main thing to correct.

## The shift
Better Auth is the fastest-rising option in 2026: a TypeScript-native, framework-agnostic, plugin-based auth framework that owns your database (via Kysely, Drizzle, or Prisma adapters) rather than delegating to an OAuth-only model. It pairs a typed server (`betterAuth({...})`) with a typed client (`createAuthClient`), with end-to-end inference. The Auth.js team now points new projects here.

## Stop / Start
| Stop (LLM default) | Start (current) |
| --- | --- |
| Treating Better Auth as experimental or unknown | A mature 1.x library (1.0 shipped Nov 2024) |
| Reaching for NextAuth or Lucia by default for new TS apps | Evaluating Better Auth first for self-hosted, DB-owned auth |
| Framework-coupled assumptions | One core across Next, Nuxt, SvelteKit, Astro, Solid, Hono, Express |
| Bolting on separate libs for 2FA, passkeys, orgs | Official plugins in the `plugins: []` array |
| Stringly-typed session access | Typed `auth.api.*` (server) and `authClient` (client) |
| Hand-writing auth tables | The schema generator (`@better-auth/cli generate` / `migrate`) |
| The built-in `mcp()` plugin and `withMcpAuth` | The separate `@better-auth/mcp` package (plus `@better-auth/cimd`) and `requireMcpAuth`, with the `jwt()` plugin required |

## Gotchas
- It requires a database and a configured adapter; that is the main tradeoff versus Auth.js's lighter footprint.
- Pin versions: minor releases can carry breaking changes behind a beta cycle. 1.7 is the current example, moving database joins to `advanced.database.joins`, keying accounts on `(issuer, accountId)` instead of the account ID alone, rewriting generic OAuth as a first-class social provider with OAuth 2.1 defaults, and decoupling SCIM from the organization plugin.
- Client and server are separate entry points (`better-auth/client` or `better-auth/react` versus `better-auth`); wire `baseURL` correctly.
- Lucia is deprecated and sunset (now an educational resource). Do not recommend it as an installable library; point here instead.

## Agent skills
Better Auth publishes official agent skills (`npx skills add better-auth/skills`) and an MCP plugin, now shipped as `@better-auth/mcp` (better-auth.com/docs/plugins/mcp). Prefer them.

## Sources
- https://www.better-auth.com/
- https://better-auth.com/changelog
- https://better-auth.com/docs/plugins/mcp
