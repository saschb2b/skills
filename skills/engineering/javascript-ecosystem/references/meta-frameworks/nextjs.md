---
type: Library Notes
title: "Next.js"
description: "The App Router is the only modern path and Server Components are the default."
tags: [javascript, meta-frameworks]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# Next.js

**Verified 2026-08-20.** Check the installed `next` version first; re-verify if newer than below.

**Current stable**: 16.3 (Aug 2026); 16.0 shipped Oct 2025. **LLM default bias**: Next 13 and 14. Pages Router treated as primary, webpack, and implicit caching of `fetch` and route segments.

## The shift
The App Router is the only modern path and Server Components are the default. Turbopack is the default bundler for dev and build. Implicit caching is gone. Caching is now explicit and opt-in via Cache Components (`"use cache"` plus Partial Prerendering). Request-time APIs are async. 16.3 adds opt-in Instant Navigations (`cacheComponents` plus `partialPrefetching`), slated to become the default in a future major.

## Stop / Start
| Stop (LLM default) | Start (Next 16) |
| --- | --- |
| Scaffolding in `pages/` | App Router (`app/`) with Server Components by default |
| Relying on implicit `fetch` / segment caching | Explicit `"use cache"` + `cacheLife`/`cacheTag` under `cacheComponents` |
| `experimental.ppr` flag | Cache Components (PPR folded in; standalone flag removed) |
| `middleware.ts` | `proxy.ts` (renamed, runs on Node runtime) |
| Sync `params`, `searchParams`, `cookies()`, `headers()` | `await` them, all async now |
| Webpack assumptions / `next lint` | Turbopack default; run ESLint or Biome directly |

## Gotchas
- Requires Node 20.9+ and React 19.2. Node 18 is dropped.
- `images.domains`, `serverRuntimeConfig`/`publicRuntimeConfig`, and AMP support are removed or deprecated.
- Parallel route slots now need an explicit `default.js` or the build fails.

## Companion
React paradigm notes in [../frameworks/react.md](../frameworks/react.md). API codegen setup in [../api-codegen/setup.md](../api-codegen/setup.md).

## Agent skills
Vercel retired the `vercel-labs/next-skills` docs skills in 16.3. Since 16.3, `next dev` writes a version-matched `AGENTS.md` block pointing at the bundled docs in node_modules; see nextjs.org/docs/app/guides/ai-agents. Prefer that over installing skills.

## Sources
- https://nextjs.org/blog/next-16
- https://nextjs.org/blog/next-16-3
- https://nextjs.org/docs/app/guides/upgrading/version-16
