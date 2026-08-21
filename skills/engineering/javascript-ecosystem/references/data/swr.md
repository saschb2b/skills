---
type: Library Notes
title: "SWR"
description: "SWR is Vercel's minimal stale-while-revalidate data hook, lighter than TanStack Query and Next-aligned."
tags: [javascript, data]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# SWR

**Verified 2026-08-20.** Check the installed `swr` version first; re-verify if newer than below.

**Current stable**: v2.5 (Aug 2026). **LLM default bias**: SWR v1. No `isLoading` (deriving it from `!data && !error`), no `useSWRMutation`, and hand-rolled optimistic updates.

## The shift
SWR is Vercel's minimal stale-while-revalidate data hook, lighter than TanStack Query and Next-aligned. v2 added a real `isLoading` flag (distinct from `isValidating`), a dedicated `useSWRMutation` trigger hook, and first-class optimistic updates via `mutate` options.

## Stop / Start
| Stop (SWR v1) | Start (SWR v2) |
| --- | --- |
| Deriving loading from `!data && !error` | `const { data, isLoading } = useSWR(key, fetcher)` |
| `isValidating` to mean first load | `isLoading` (no data yet) vs `isValidating` (any in-flight request) |
| Using bound or global `mutate` for triggered writes | `useSWRMutation(key, fetcher)` with `trigger` / `isMutating` |
| Hand-rolling optimistic state | `mutate(key, update, { optimisticData, rollbackOnError, revalidate })` |
| Importing infinite loading from the wrong path | `import useSWRInfinite from 'swr/infinite'` |

## Gotchas
- v2.5 (Aug 2026) added `unload()` to clear the whole cache and drop in-flight requests, plus an experimental `cacheData` option on `SWRConfig` to prefill the cache from React Server Components.
- It is a server-cache library, not a client-state store; keep UI state elsewhere.
- Choose SWR for a minimal "single hook, just works" cache; TanStack Query for richer invalidation, devtools, and framework-agnostic use.

## Companion
The heavier server-cache alternative is [tanstack-query.md](./tanstack-query.md).

## Sources
- https://swr.vercel.app/docs/api
- https://swr.vercel.app/blog/swr-v2
- https://github.com/vercel/swr/releases
