---
type: Library Notes
title: "Hono"
description: "Hono is built directly on Web Standard primitives (the fetch-API `Request`/`Response`, `Headers`, `URL`), so the same code runs unchanged on Cloudflare Workers, Bun, Deno, AWS Lambda, Vercel, and Node."
tags: [javascript, backend]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# Hono

**Verified 2026-08-20.** Check the installed `hono` version first; re-verify if newer than below.

**Current stable**: 4.x (4.13, Aug 2026). **LLM default bias**: early Hono v3 or pre-4 patterns, missing the v4 RPC maturity and the web-standard framing.

## The shift
Hono is built directly on Web Standard primitives (the fetch-API `Request`/`Response`, `Headers`, `URL`), so the same code runs unchanged on Cloudflare Workers, Bun, Deno, AWS Lambda, Vercel, and Node. Its RPC mode exports the server's route types, giving end-to-end type safety with no codegen and no OpenAPI step.

## Stop / Start
| Stop (LLM default) | Start (current Hono) |
| --- | --- |
| Treating Hono as Node or Express-specific | One codebase that deploys to edge, serverless, and Node |
| Node `req`/`res` objects | The typed `Context` (`c.req`, `c.json()`, return a `Response`) |
| A single `hono/node-server` entry | The runtime adapter (`hono/cloudflare-workers`, `Bun.serve`, `@hono/node-server`) |
| Generating a client SDK or OpenAPI for typed clients | `hc<typeof app>()` (Hono RPC) for inferred end-to-end types |
| Adding React just to render server HTML | Built-in `hono/jsx` |
| Ad hoc request validation | `@hono/zod-validator` wired into routes |

## Gotchas
- For RPC inference, chain routes and export the app type (`type AppType = typeof app`). Breaking the chain degrades inference.
- Middleware is an onion model; `await next()` placement controls pre and post behavior.
- The validator and OpenAPI helpers are separate packages from the core `hono`. Read validated data with `c.req.valid('json' | 'form' | 'query')` after `zValidator`.
- 4.13 (Aug 2026) added first-class HTTP QUERY method support (`app.query()`) and a Method Not Allowed middleware, plus core routing performance work.

## Companion
[fastify.md](./fastify.md) is the Node-native alternative when edge portability is not a requirement, and [nitro.md](./nitro.md) applies a similar deploy-anywhere idea at the meta-framework layer.

## Sources
- https://hono.dev/docs
- https://hono.dev/docs/guides/rpc
