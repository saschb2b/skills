---
type: Library Notes
title: "Clerk"
description: "Clerk is the leading managed and hosted identity provider, with prebuilt components (`<ClerkProvider>`, `<SignIn/>`, `<UserButton/>`) and hooks (`useUser`, `useAuth`)."
tags: [javascript, auth]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Clerk

**Verified 2026-08-20.** Check the installed `@clerk/nextjs` version first; re-verify if newer than below.

**Current stable**: `@clerk/nextjs` v7 (Core 3, 7.5.x); React lives in the renamed `@clerk/react` (v6). **LLM default bias**: pre-Core 2 Clerk. `authMiddleware()`, synchronous `auth()`, `@clerk/clerk-react`, and `@clerk/nextjs` v4/v5 import paths.

## The shift
Clerk is the leading managed and hosted identity provider, with prebuilt components (`<ClerkProvider>`, `<SignIn/>`, `<UserButton/>`) and hooks (`useUser`, `useAuth`). Two paradigm breaks stack up. `authMiddleware()` became `clerkMiddleware()` and `auth()` became async in the Core 2 / v6 jump. Core 3 (March 2026, `@clerk/nextjs` v7) then collapsed `<SignedIn>`, `<SignedOut>`, and `<Protect>` into a single `<Show>` component and renamed `@clerk/clerk-react` to `@clerk/react`.

## Stop / Start
| Stop (pre-Core 2) | Start (current Clerk) |
| --- | --- |
| `authMiddleware()` | `clerkMiddleware()` from `@clerk/nextjs/server` with `createRouteMatcher` |
| `const { userId } = auth()` (sync) | `const { userId } = await auth()` (async since v6) |
| `clerkClient.users...` as a singleton | `const client = await clerkClient()` (async factory) |
| Installing old majors | `@clerk/nextjs` v7 (Core 3) / `@clerk/react` v6 |
| `redirectUrl`-style props | `fallbackRedirectUrl` / `forceRedirectUrl` |
| `<SignedIn>` / `<SignedOut>` / `<Protect>` | One `<Show>` with a condition (`when="signed-in"`, `when={{ role: 'admin' }}`) |
| Importing from `@clerk/clerk-react` or `@clerk/types` | `@clerk/react` (renamed); types come from the SDK you already import |

## Gotchas
- "Core" version is not the npm package version: Core 2 is v6, Core 3 is v7. Do not conflate them.
- The async `auth()` change is the single most common thing LLMs get wrong in App Router code. Always `await` it.
- Clerk is managed SaaS (data on Clerk, usage pricing, vendor lock-in), categorically different from self-hosting Auth.js or Better Auth.
- App Router requires `clerkMiddleware()` present, or `auth()` throws.
- Core 3 raises the floor and shifts behavior: Next.js 15.2.3+ and Node 20.9+, `<ClerkProvider>` goes inside `<body>` rather than wrapping `<html>`, `auth.protect()` returns 401 instead of 404, and `getToken()` throws `ClerkOfflineError` offline instead of returning null. Clerk Elements is deprecated. Run the upgrade CLI first, since it catches aliased imports and re-exports.

## Companion
The self-hosted alternative, where you own the user tables, is [better-auth.md](./better-auth.md).

## Agent skills
Clerk publishes official agent skills (clerk.com/SKILL.md, clerk.com/agents) and an MCP server at mcp.clerk.com/mcp, registered in your agent with `clerk mcp install`. Docs at clerk.com/docs/guides/ai/overview. Prefer them.

## Sources
- https://clerk.com/docs/reference/nextjs/overview
- https://clerk.com/docs/guides/development/upgrading/upgrade-guides/core-3
- https://clerk.com/changelog/2026-03-03-core-3
