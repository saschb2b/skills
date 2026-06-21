---
type: Playbook
title: "MCP Maintenance and Operations"
description: "Versioning and deprecation without breaking agents, list_changed notifications, the _meta extension point, toolsets, pagination, observability, the stdio to Streamable HTTP operational cliff, and production pitfalls."
tags: [mcp, versioning, operations, observability, maintenance]
timestamp: 2026-06-21T00:00:00Z
---

# MCP Maintenance and Operations

This is the work after the scaffold: evolving a live server without breaking the agents that already depend on it, and running it once it is remote. Source spec pages: [versioning](https://modelcontextprotocol.io/specification/versioning), [tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools), [transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports).

## Two version numbers, kept separate

- **Protocol version**: the negotiated date string (`2025-11-25`). The SDK handles negotiation; support multiple versions and do not hard-fail older clients. On HTTP the client must send `MCP-Protocol-Version` on every post-init request, and an absent header means the server assumes `2025-03-26`.
- **Server version**: your own semver in `package.json` and `server.json`, immutable per registry publication.

## Evolving tools without breaking agents

This is where servers break their consumers, because the tool `name` is the binding key the agent learned.

**Additive, safe:** new tools; new *optional* input params (never add to `required`); adding `outputSchema`, `title`, or `icons`; widening a type.

**Breaking, avoid:** removing or renaming a tool; adding a required param; removing, renaming, or narrowing a param; tightening an `outputSchema` (clients validate against it); or, worst of all, silently changing a tool's semantics while keeping its name. The last one is also the **rug pull** security event (see [security.md](security.md)).

**Name-versioning is the sanctioned deprecation path.** MCP defines no per-tool deprecation flag, version field, or required re-consent on change. The spec models a version suffix in the name itself (`DATA_EXPORT_v2`). So ship `export_v2`, keep `export` working, and mark `export` deprecated in its description. Mirror the spec's own 12-month feature-deprecation window as convention. The names must stay within `A-Za-z0-9_-.`, 128 chars, unique per server.

## Tell clients to refresh: list_changed

Declare the capability at `initialize`, then fire the notification when the set changes (the spec wording is SHOULD). These are JSON-RPC notifications with no response.

| Primitive | Capability | Notification | Client reaction |
| --- | --- | --- | --- |
| Tools | `tools.listChanged` | `notifications/tools/list_changed` | re-`tools/list` |
| Resources (list) | `resources.listChanged` | `notifications/resources/list_changed` | re-`resources/list` |
| Resources (item) | `resources.subscribe` | `notifications/resources/updated` (carries `uri`) | re-`resources/read` |
| Prompts | `prompts.listChanged` | `notifications/prompts/list_changed` | re-`prompts/list` |

In the TypeScript SDK, `RegisteredTool.remove()`, `enable()`, `disable()`, and `update()` auto-emit `tools/list_changed`. Caveat: client support is uneven, so firing it is necessary but not sufficient; do not rely on every client refreshing.

## _meta: the schema-safe extension point

`_meta` is reserved for attaching metadata without changing the schema, so older clients ignore keys they do not recognize. Use it as the additive way to ship feature-flag, experiment, or versioning metadata before a field is standardized. Keys are an optional reverse-DNS prefix plus a name; any prefix ending in `modelcontextprotocol` or `mcp` is reserved, so use your own domain (`mycompany.com/featureFlag`). The keys `traceparent`, `tracestate`, and `baggage` are reserved for W3C Trace Context.

## Growing the surface

- **Organize handlers by domain** as the tool count grows. The SDKs do not prescribe a module pattern; the reference architecture to copy is the [GitHub MCP server's toolset structure](https://github.com/github/github-mcp-server), not the SDK docs.
- **Toolsets and feature flags** let consumers enable a subset. The GitHub server exposes `--toolsets` / `GITHUB_TOOLSETS` (comma-separated, `all` for everything), a dynamic-discovery mode that starts with only meta-tools so the host enables toolsets on demand ("to avoid situations where models get confused by the sheer number of tools"), and a `--read-only` mode that takes precedence over everything. This is the practical lever against the context-budget problem in [tool-design.md](tool-design.md).
- **Pagination** for large lists is opaque cursor-based, supported on `tools/list`, `resources/list`, `resources/templates/list`, and `prompts/list`: return an optional `nextCursor`, the client passes it back as `cursor`, missing means end. For a single tool that returns a large list there is no protocol pagination, so implement cursor and limit in the tool's own args and truncate by default.
- **Structured output** adoption is additive: declare `outputSchema`, return `structuredContent`, keep the text block in sync (see [tool-design.md](tool-design.md)).

## The stdio to Streamable HTTP operational cliff

Going remote moves a pile of work from the client to you: uptime, scaling, load balancing, authentication (stdio had none), session and state management, graceful shutdown, and observability. The core decisions:

- **Stateless vs stateful.** Stateless (no `Mcp-Session-Id`, each request independent) scales horizontally cleanly; in the TS SDK set `sessionIdGenerator: undefined`. Stateful means all requests for a session must reach the same instance, which forces sticky routing or a shared store. The ecosystem (and the `2026-07-28` RC) is moving toward stateless-by-default, so prefer stateless now.
- **Sessions.** The server may assign `Mcp-Session-Id` on the `InitializeResult`; the client then echoes it on every request. Missing post-init then `400`; server-terminated then `404`; client `DELETE` ends it; resume a broken SSE stream with GET plus `Last-Event-ID`.
- **Graceful shutdown.** Stop accepting new connections, then close each session's transport, but in-flight tool handlers are not auto-drained, so drain them before exit. Track transports in a session-keyed map and clean up on DELETE, `404`, or disconnect to avoid leaks.
- **Auth.** Remote means OAuth 2.1 (see [security.md](security.md)).

## Observability: what MCP specifies vs what you bolt on

- **In-protocol logging (spec):** declare `logging`, the client sets verbosity with `logging/setLevel`, the server emits `notifications/message` with RFC 5424 levels. Logs must not contain secrets or PII and should be rate-limited. This is the channel to the client; your backend structured logging is separate.
- **Tracing (spec hook):** propagate W3C Trace Context via the reserved `_meta` keys above; OpenTelemetry spans are yours to add.
- **Metrics, health checks, rate limiting, SLOs:** MCP specifies none, so they are ordinary ops. A typical set is per-tool call rate, p95/p99 latency, an active-session gauge, error rate, plus `/health` and `/ready`.

## Production pitfalls

| Pitfall | What breaks |
| --- | --- |
| **stdout pollution** | A `console.log` or a noisy dependency writes to stdout on a stdio server and corrupts the JSON-RPC stream. Log only to stderr (see [testing.md](testing.md)). |
| **Unbounded results** | A single tool call returns hundreds of thousands of characters and blows the context window; response bloat often costs more than schema bloat. Truncate, filter, and paginate by default. |
| **Tool sprawl** | Front-loading every definition burns tokens before the first message and makes overlapping tools misfire. Use toolsets, lazy loading, and fewer consolidated tools. |
| **Stale descriptions** | Descriptions drift from behavior; small wording changes measurably alter tool selection, and a semantic shift after approval is a rug pull. |
| **Missing cleanup** | Per-session transports, child processes, and DB connections leak when not closed on session end. |
| **Ignored cancellation** | The handler keeps running after the client gave up. On `notifications/cancelled`, stop processing and free resources, and handle the race where it arrives after completion. |
| **Schema drift** | Results stop matching the declared `outputSchema` and validating clients reject them. Generate or test `outputSchema` against the real return type. |
