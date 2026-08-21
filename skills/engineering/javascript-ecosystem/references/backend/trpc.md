---
type: Library Notes
title: "tRPC"
description: "v11's new TanStack Query integration stops wrapping `useQuery`/`useMutation` and instead exposes native `queryOptions`/`mutationOptions`, so you call TanStack's own hooks."
tags: [javascript, backend]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# tRPC

**Verified 2026-08-20.** Check the installed `@trpc/server` version first; re-verify if newer than below.

**Current stable**: v11 (11.18); v11 GA'd Mar 2025. **LLM default bias**: tRPC v10 with `createTRPCReact()` exposing `trpc.foo.useQuery()`, `useContext()` for cache access, JSON-only payloads, and `httpBatchLink`.

## The shift
v11's new TanStack Query integration stops wrapping `useQuery`/`useMutation` and instead exposes native `queryOptions`/`mutationOptions`, so you call TanStack's own hooks. It adds first-class RSC and App Router support (server-invokable procedures plus prefetch and hydration), streaming, and non-JSON payloads (FormData, File, Blob).

## Stop / Start
| Stop (tRPC v10) | Start (tRPC v11) |
| --- | --- |
| `createTRPCReact()` + `trpc.post.list.useQuery(input)` | `useQuery(trpc.post.list.queryOptions(input))` via `@trpc/tanstack-react-query` |
| `const utils = trpc.useContext()` | `useQueryClient` with the new `queryKey`/`pathKey` helpers |
| `httpBatchLink` for large or slow responses | `httpBatchStreamLink` to stream progressively |
| Assuming JSON-only inputs | FormData, File, Blob via parsers like `octetInputParser` |
| Treating tRPC and Server Actions as either/or | Server-invokable procedures (call directly in an RSC, no HTTP round-trip) |
| v9 `.interop()` code | Full v11 patterns (`.interop()` removed) |

## Gotchas
- v11 is largely backward-compatible with v10; the classic `@trpc/react-query` integration still works but is frozen. New work goes to the TanStack-native integration.
- tRPC now has a first-party OpenAPI generator, `@trpc/openapi` (alpha, versioned `11.x.x-alpha`), which emits an OpenAPI 3.1 spec from a router by static type analysis, no server run and no output schemas required. Treat it as alpha; oRPC and Hono RPC remain the settled choices for public typed-external APIs.
- It complements RSC and server actions rather than replacing them.
- `createTRPCContext<AppRouter>()` returns `{ TRPCProvider, useTRPC, useTRPCClient }`; configure transformers (e.g. superjson) per-link, not at client init.
- Non-JSON inputs need a non-batching link (`splitLink` + `isNonJsonSerializable`); binary uses `octetInputParser` from `@trpc/server/http`, FormData uses `z.instanceof(FormData)`.

## Companion
Server-state notes in [../data/tanstack-query.md](../data/tanstack-query.md). REST and GraphQL codegen setup in [../api-codegen/setup.md](../api-codegen/setup.md).

## Sources
- https://trpc.io/blog/announcing-trpc-v11
- https://trpc.io/docs/client/tanstack-react-query/setup
- https://trpc.io/docs/openapi
