---
type: Library Notes
title: "Auth.js (formerly NextAuth.js)"
description: "The project rebranded to Auth.js and split into a framework-agnostic core (`@auth/core`) with wrappers (`next-auth`, `@auth/sveltekit`, `@auth/express`) and separate `@auth/*-adapter` packages."
tags: [javascript, auth]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Auth.js (formerly NextAuth.js)

**Verified 2026-08-20.** Check the installed `next-auth` (or `@auth/*`) version first; re-verify if newer than below.

**Current stable**: v4 (`next-auth@4.24.15`) is still npm `latest` and the LTS line; v5 remains beta (`5.0.0-beta.32`, install with `@beta`) and is maintenance-only. **LLM default bias**: NextAuth v4. `getServerSession(authOptions)`, a `[...nextauth]` route in `pages/api/auth/`, `useSession`/`getSession`, `withAuth`, and the name "NextAuth.js".

## The shift
The project rebranded to Auth.js and split into a framework-agnostic core (`@auth/core`) with wrappers (`next-auth`, `@auth/sveltekit`, `@auth/express`) and separate `@auth/*-adapter` packages. v5 collapses session reading into one universal `auth()` and moves config to a root `auth.ts`. Importantly, Auth.js is now maintained by the Better Auth team in maintenance mode; they steer new projects to Better Auth.

## Stop / Start
| Stop (NextAuth v4) | Start (Auth.js v5) |
| --- | --- |
| Calling it "NextAuth.js" / `next-auth.js.org` | "Auth.js" / `authjs.dev` |
| `getServerSession` / `getSession` / `getToken` / `withAuth` | The single universal `auth()` exported from `auth.ts` |
| Inline `authOptions` + a `[...nextauth]` handler | A root `auth.ts` exporting `{ handlers, auth, signIn, signOut }` |
| Hand-rolling GET/POST in the auth route | `export const { GET, POST } = handlers` |
| Adapters from `next-auth/adapters/*` | Separate `@auth/*-adapter` packages |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL` | `AUTH_SECRET` (and `AUTH_*` provider auto-inference) |

## Gotchas
- v5 has been beta for years with no GA timeline, and is now maintenance-only. For greenfield work the maintainers themselves recommend Better Auth.
- `signIn`/`signOut` are imported from your `auth.ts` (server actions), not only `next-auth/react`.
- Choose Auth.js mainly to maintain existing v4/v5 codebases.
- The July 2026 security update patched four advisories (a Unicode-normalization email bypass, `getToken` throwing on malformed auth headers, OAuth check cookies not bound to their provider, auth failing open on provider config errors). Upgrade to `next-auth@4.24.15`, `next-auth@5.0.0-beta.32`, or `@auth/core@0.41.3` or newer.

## Companion
The recommended successor for new work is [better-auth.md](./better-auth.md).

## Sources
- https://authjs.dev/getting-started/migrating-to-v5
- https://github.com/nextauthjs/next-auth/discussions/13252
- https://better-auth.com/blog/security-update-july-2026
