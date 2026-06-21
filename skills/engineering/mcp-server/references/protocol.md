---
type: Reference
title: "MCP Protocol Surface"
description: "The spec revision, the two transports, the initialize lifecycle, server and client primitives, tool result shapes, annotations, and the official SDKs."
tags: [mcp, protocol, transports, lifecycle, sdk]
timestamp: 2026-06-21T00:00:00Z
---

# MCP Protocol Surface

MCP is JSON-RPC 2.0 between a client (the agent host) and a server (your integration). This note is the map of what the protocol gives you. Build against the current revision and let the SDK negotiate older clients.

## Spec revision

MCP versions by date string, where each date marks the last backwards-incompatible revision, not every release.

| Revision | Brought |
| --- | --- |
| `2024-11-05` | Baseline. Used the now-deprecated HTTP+SSE two-endpoint transport. The version a server assumes if no `MCP-Protocol-Version` header is sent on HTTP. |
| `2025-03-26` | Streamable HTTP transport (replacing HTTP+SSE), OAuth 2.1 authorization, tool annotations, audio content. |
| `2025-06-18` | MCP servers classified as OAuth Resource Servers, Resource Indicators required, elicitation, structured tool output (`structuredContent` + `outputSchema`), `MCP-Protocol-Version` header made required on HTTP. |
| **`2025-11-25`** (current) | Icons metadata, elicitation overhaul plus URL-mode elicitation, sampling gains tool-calling, input-validation errors returned as tool execution errors, JSON Schema 2020-12 as default dialect, experimental Tasks. |
| `2026-07-28` (next, RC) | Stateless protocol core (removes the initialize handshake and session IDs so servers run behind plain load balancers), Tasks as an official extension, MCP Apps (sandboxed-iframe HTML), authorization hardening. |

As of 2026-06-21, target **`2025-11-25`**. The `2026-07-28` stateless shift is imminent, so design HTTP servers to tolerate going stateless (see [maintenance.md](maintenance.md)). Source: [2025-11-25 changelog](https://modelcontextprotocol.io/specification/2025-11-25/changelog), [2026-07-28 RC](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/).

## The two transports

Clients should support stdio whenever possible. Custom transports are allowed but rare.

**stdio (local).** The client launches the server as a subprocess and speaks newline-delimited JSON-RPC over stdin/stdout. `stderr` is free for any logging. The single hard rule: nothing but valid MCP messages on stdout, or you corrupt the stream. No auth, no sessions, no scaling. This is the default for local integrations.

**Streamable HTTP (remote).** The server is an independent process serving many clients on a single endpoint (for example `https://example.com/mcp`) that handles both POST and GET. Mechanics:

- **POST**: every client message is a new POST. The `Accept` header must list both `application/json` and `text/event-stream`. For a request, the server answers with either one JSON response or an SSE stream that eventually carries the response. Client-sent responses/notifications get `202 Accepted` with no body.
- **GET**: the client may open a standing SSE stream for server-initiated requests and notifications.
- **`Mcp-Session-Id`**: the server may assign it on the `InitializeResult`; if assigned, the client must echo it on every later request. Must be globally unique, cryptographically secure, visible-ASCII. Missing post-init session id then `400`; server-terminated session then `404` (client re-initializes); client `DELETE` ends a session.
- **`MCP-Protocol-Version`**: the client must send the negotiated version (`2025-11-25`) on every post-init HTTP request. Absent header then the server assumes `2025-03-26`; invalid then `400`.
- **Resumability**: servers may put an `id` on SSE events; a disconnected client resumes with a GET carrying `Last-Event-ID`, and the server replays only what followed. Disconnection is not cancellation.
- **Security**: validate the `Origin` header (invalid then `403`) to stop DNS rebinding, and bind to `127.0.0.1` when local.

HTTP+SSE (the `2024-11-05` two-endpoint transport) is deprecated; Streamable HTTP replaced it in `2025-03-26`. A server may keep hosting both for legacy clients. Source: [transports](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports).

## Lifecycle and capability negotiation

Three phases: initialization, operation, shutdown.

1. **`initialize`** (client to server) carries `protocolVersion`, `capabilities`, and `clientInfo`. The client sends its latest supported version; the server echoes the same string if it supports it, otherwise returns a version it does support, and the client disconnects if it cannot accept that (`-32602` "Unsupported protocol version").
2. The `initialize` result returns the server `capabilities`, `serverInfo`, and optional `instructions`.
3. **`notifications/initialized`** (client to server) signals readiness. Before it, only `ping` is allowed.
4. **Shutdown** uses the transport, not a message. stdio: the client closes the server's stdin, then SIGTERM, then SIGKILL. HTTP: close the connections.

Capabilities declare which features each side offers. Server: `tools`, `prompts`, `resources` (with `subscribe` and/or `listChanged`), `logging`, `completions`, `tasks`. Client: `roots` (with `listChanged`), `sampling`, `elicitation`, `tasks`. The `listChanged` sub-capability says the side will fire change notifications; `subscribe` (resources only) says it supports per-item subscriptions. Source: [lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle).

## Server primitives (server to client)

- **Tools** are model-controlled actions. `tools/list` (paginated), `tools/call`; notification `notifications/tools/list_changed`. The contract that decides whether the agent succeeds is the tool definition, covered in [tool-design.md](tool-design.md).
- **Resources** are application-driven context data, each a URI. `resources/list`, `resources/read`, `resources/templates/list`, `resources/subscribe`/`unsubscribe`; notifications `.../list_changed` and `.../updated`. Templates use RFC 6570 URI templates (`file:///{path}`) and support completion.
- **Prompts** are user-controlled templates, often surfaced as slash commands. `prompts/list`, `prompts/get` (with arguments); notification `.../list_changed`.

## Client features the server can call (server to client)

- **Sampling** (`sampling/createMessage`) asks the client's own LLM to generate, with `modelPreferences`, `systemPrompt`, `maxTokens`. Human-in-the-loop should gate it. In `2025-11-25` it gained `tools` + `toolChoice` for a multi-turn tool loop inside sampling.
- **Roots** (`roots/list`) let the client expose filesystem boundaries (each a `file://` URI) to the server.
- **Elicitation** (`elicitation/create`) lets the server ask the user for input through the client. Form mode takes a flat schema of primitives and must not request secrets; URL mode (new in `2025-11-25`) hands off sensitive auth or payment flows out of band.

## Utilities

Logging (`logging/setLevel`, `notifications/message`, RFC 5424 levels), Completions (`completion/complete` for prompt arguments and template URIs, capped at 100 values), Pagination (opaque cursor-based, never page numbers), Progress (`progressToken` in `_meta` then `notifications/progress`), Cancellation (`notifications/cancelled` with the target `requestId`), Ping, and Tasks (experimental durable requests with polling).

## Tool result shape

A result is an array of content blocks plus flags.

- **Content blocks**: `text`, `image` (base64 + `mimeType`), `audio` (base64 + `mimeType`), `resource_link` (a URI the client can fetch or subscribe), and embedded `resource` (inline `text` or `blob`).
- **`isError`**: `true` marks a tool execution error (an API failure, a bad input, a business-logic error) returned inside a normal result so the model can read it and retry. This is distinct from a JSON-RPC protocol error (unknown tool, malformed request), which the model usually cannot fix. See [tool-design.md](tool-design.md).
- **`structuredContent` + `outputSchema`** (since `2025-06-18`): a tool may declare an `outputSchema` (JSON Schema, default 2020-12); if it does, the server must return `structuredContent` conforming to it and the client should validate. For backwards compatibility, also serialize the same JSON into a `text` block.

## Tool annotations

An optional `annotations` object gives clients a risk vocabulary. Defaults are deliberately worst-case, so an unannotated tool is treated conservatively.

| Annotation | Meaning | Default |
| --- | --- | --- |
| `title` | Human-readable display name, distinct from the machine `name` | — |
| `readOnlyHint` | The tool does not modify its environment | `false` |
| `destructiveHint` | If it modifies, changes are destructive rather than additive (only meaningful when not read-only) | `true` |
| `idempotentHint` | Repeated calls with the same args have no additional effect | `false` |
| `openWorldHint` | The tool touches an open world of external entities (web) rather than a closed domain (a memory store) | `true` |

Set them truthfully: `readOnlyHint: true` on reads, `destructiveHint: false` on purely additive writes, `openWorldHint: false` on closed-domain tools. Clients must treat annotations as untrusted unless they come from a trusted server, so they drive UX and policy, not enforcement. Real safety lives in deterministic controls (see [security.md](security.md)). Source: [tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools), [annotations as risk vocabulary](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/).

## Official SDKs

Maintained SDKs: TypeScript, Python, Java (Spring AI), Kotlin, C#, Go, PHP, Ruby, Rust, Swift ([SDK list](https://modelcontextprotocol.io/docs/sdk)).

**TypeScript naming trap.** The production-recommended package is **`@modelcontextprotocol/sdk`** (v1.x; the README states v1.x remains recommended for production). Install with `npm install @modelcontextprotocol/sdk zod`. A V2 line split into `@modelcontextprotocol/server` + `@modelcontextprotocol/client` is in pre-release; do not present those package names as current. The v1.x high-level API:

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

server.registerTool(
  "get_forecast",
  {
    description: "Get the weather forecast for a city. Returns conditions and temperature in Celsius.",
    inputSchema: { city: z.string().describe("City name, for example 'Berlin'") },
    annotations: { readOnlyHint: true, openWorldHint: true },
  },
  async ({ city }) => ({ content: [{ type: "text", text: `Forecast for ${city}...` }] }),
);

await server.connect(new StdioServerTransport());
```

`registerResource(name, uriOrTemplate, metadata, readCallback)` and `registerPrompt(name, config, handler)` follow the same shape. Remote servers use `StreamableHTTPServerTransport` (options include `sessionIdGenerator`, `enableDnsRebindingProtection`, `allowedHosts`, `allowedOrigins`, and stateless mode via `sessionIdGenerator: undefined`). `list_changed` notifications fire automatically when you register, remove, enable, disable, or update a primitive. Python's FastMCP derives the input schema, description, and output schema from a typed, docstringed function. Source: [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).
