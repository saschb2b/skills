---
type: Library Notes
title: "Fastify"
description: "Fastify 5 is a maintenance-and-modernization major: it requires Node 20+, removes years of deprecated APIs, and tightens defaults rather than adding features."
tags: [javascript, backend]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# Fastify

**Verified 2026-08-20.** Check the installed `fastify` version first; re-verify if newer than below.

**Current stable**: 5.x (5.12); Fastify 6 is in alpha. **LLM default bias**: Fastify v4, the long-lived stable major.

## The shift
Fastify 5 is a maintenance-and-modernization major: it requires Node 20+, removes years of deprecated APIs, and tightens defaults rather than adding features. The core selling point is unchanged: JSON-Schema-driven validation and serialization plus an encapsulated plugin system for high throughput with strong typing.

## Stop / Start
| Stop (Fastify 4) | Start (Fastify 5) |
| --- | --- |
| Installing on Node 16 or 18 | Node 20+ |
| Deprecated v4 APIs like `reply.getResponseTime()` | The v5 replacements (`reply.elapsedTime`) |
| Loose or implicit schema assumptions | Explicit JSON schemas (v5 validation is stricter, AJV bumped) |
| v4-era `@fastify/*` plugin versions | The v5-aligned plugin versions |

## Gotchas
- Fastify 4 reached end of life June 30, 2025; v4 codebases are unsupported.
- The breaking changes are mostly removals of long-deprecated APIs plus an AJV major bump, so migration is usually mechanical. Consult the v5 migration guide.
- Mismatched v4-era plugins can fail to register against v5.
- Fastify 6 alphas started landing in Aug 2026 (another removal-and-dependency-bump major). Stay on 5.x in production and do not present v6 APIs as current.
- Stay current on 5.x patches: several 5.11 and 5.12 releases were security releases.
- v5 requires a full JSON Schema (with explicit `type`) for `querystring`, `params`, `body`, and `response`; the `jsonShorthand` option was removed.
- `listen()` takes an object now (`fastify.listen({ port: 3000 })`); the variadic `listen(port, host, cb)` form is gone, and `request.connection` is now `request.socket`.

## Companion
[express.md](./express.md) is the incumbent this replaces on new Node services, and [hono.md](./hono.md) is the option when the same code must run outside Node.

## Sources
- https://fastify.dev/docs/latest/Guides/Migration-Guide-V5/
- https://github.com/fastify/fastify/releases
