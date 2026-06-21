---
name: mcp-server
description: Build, extend, and maintain a Model Context Protocol (MCP) server across its whole lifecycle against the current spec and official SDKs. Covers the architecture, choosing a transport (stdio vs Streamable HTTP), writing tool definitions agents actually use, adding tools without breaking existing agents, versioning and deprecation, the security threat model (tool poisoning, token passthrough, prompt injection, OAuth), testing with the MCP Inspector, and publishing to the registry. Use when building an MCP server, exposing a CLI, API, or app to AI agents (Claude Code, Cursor, Cline, Windsurf), adding or reviewing MCP tools, fixing an agent that calls the wrong tool or loads too many, securing or authorizing an MCP server, migrating transports, or shipping and versioning one. Also for any new agent-tool integration where the target has a scripting API, CLI, or HTTP surface.
date: 2026-06-21
source_post: how-to-build-mcp-server
---

# Build and maintain an MCP server

Scaffolding an MCP server is the easy 10%. The heavy lifting is everything after `init`: writing tool definitions the agent reads correctly, extending the surface without breaking agents that already depend on it, defending against tool poisoning and prompt injection, and operating the thing once it is remote. This skill covers the whole lifecycle. The deep reference for each phase is the vendored OKF bundle in [references/](./references/index.md); SKILL.md is the procedure.

## Target the current protocol

MCP uses date-string protocol revisions. As of 2026-06-21 the current stable revision is **2025-11-25** (it superseded `2025-06-18`); a stateless-core revision `2026-07-28` is the imminent next release. Build against `2025-11-25` and let the SDK negotiate older clients. The production SDK is **`@modelcontextprotocol/sdk`** (v1.x, TypeScript). The split `@modelcontextprotocol/server` + `/client` packages are the unreleased V2 line, not current. Full protocol surface, lifecycle, and result shapes in [protocol.md](./references/protocol.md).

## Step 1: Pick the transport

| Use | Transport | Why |
|---|---|---|
| Local, client spawns the server as a subprocess, one user | **stdio** | No auth, no sessions, no scaling. Default for local tools. Log to **stderr only**. |
| Remote, hosted, multiple clients | **Streamable HTTP** | Single endpoint (POST + optional SSE upgrade), `Mcp-Session-Id`, OAuth, you own scaling and ops. |

Prefer stdio until you genuinely need remote multi-client access. The old HTTP+SSE transport is deprecated (replaced by Streamable HTTP in `2025-03-26`). Transport mechanics, the stdio-vs-HTTP operational cliff, and sessions are in [protocol.md](./references/protocol.md) and [maintenance.md](./references/maintenance.md).

## Step 2: The five layers

Every server, regardless of target, has the same skeleton:

1. **Server & transport** (`src/index.ts`) — entry point, lifecycle, cleanup, chosen transport.
2. **Tool definitions** (`src/tool-definitions.ts`) — the contract the agent reads to decide what to call. **The single most important file.**
3. **Router & handlers** (`src/tool-router.ts`, `src/handlers/*.ts`) — dispatch, validation, response shaping.
4. **The bridge** (`src/executor.ts`, `scripts/*`) — how you actually talk to the target. **80% of the work.**
5. **Security & validation** (`src/utils.ts`) — input validation, `execFile` over `exec`, path checks, tool filtering.

Single production dependency: `@modelcontextprotocol/sdk` (plus `zod` for schemas). TypeScript, ESLint, and the test runner are dev-only.

## Step 3: Identify the bridge — this decides everything else

Ask how the target lets you automate it:

| Target offers | Bridge pattern | Example |
|---|---|---|
| Scripting API (Lua, GDScript, Python) | Subprocess + script-injection dispatcher in the target's language | Aseprite (Lua), Godot (GDScript) |
| REST / HTTP API | `fetch` calls from handlers | Any web service |
| Rich CLI | `execFile` directly | FFmpeg, ImageMagick |
| Socket / TCP / WebSocket server | Persistent connection, state in a shared context | Godot interactive mode |
| Native SDK | Direct import if Node-compatible | SQLite, native modules |

If two patterns apply, prefer the lower-state one (subprocess over persistent socket). State means lifecycle management.

## Step 4: Write ONE tool end to end before anything else

Do not define 50 tools up front. Pick the simplest useful operation (`get_version`, `create_file`), wire it through all five layers with the SDK's `registerTool(name, { description, inputSchema, annotations }, handler)`, then watch an agent call it in the Inspector:

```
npx @modelcontextprotocol/inspector node build/index.js
```

If the tool list reads as confusing to you, it reads as confusing to the agent. Once one tool works, adding more is mechanical.

## Writing tools agents actually use

The description is the only documentation the agent has, and tool definitions cost tokens on every request before the user speaks. Anthropic's guidance ([tool-design.md](./references/tool-design.md)) in four rules:

1. **Build few high-impact workflow tools, do not wrap every API endpoint.** Consolidate `list_users` + `list_events` + `create_event` into one `schedule_event`. More tools confuse the agent and burn its context.
2. **Write the description like onboarding a new hire.** Precise verbs, precise parameter names (`user_id` not `user`), enums over free strings, required vs optional marked and defaults documented.
3. **Return high-signal context.** Natural-language names over opaque UUIDs; paginate, filter, and truncate large results; offer a `response_format` enum (`concise`/`detailed`) instead of always dumping everything.
4. **Set annotations truthfully** — `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` — and surface tool failures as `isError: true` with an actionable message so the model self-corrects.

## Extending without breaking agents

Adding a tool touches four places: the definition, the handler, the `HANDLER_MAP` entry, and the bridge operation (if Layer 4 uses one). Document this in `CONTRIBUTING.md` so contributors don't drift.

Evolving an existing tool is where servers break their consumers. **Additive is safe** (new tools, new *optional* params, adding `outputSchema`). **Breaking is not** (removing or renaming a tool, adding a required param, narrowing a type, or silently changing semantics). MCP has no formal tool-deprecation flag, so the sanctioned path is **name-versioning**: ship `export_v2`, keep `export` working, mark `export` deprecated in its description. Fire `notifications/tools/list_changed` when the set changes. The full versioning, deprecation, `_meta`, toolsets, pagination, and observability playbook is in [maintenance.md](./references/maintenance.md).

## Security non-negotiables

MCP servers run with real privileges and read agent-influenced, attacker-reachable input. The minimum bar (full threat model and OAuth in [security.md](./references/security.md)):

- **`execFile`/`spawn`, never `exec`.** Args as an array, no shell string interpolation. Allowlist binaries.
- **Validate every path and input.** Resolve to absolute and verify it stays under the intended base; reject `..` before passing to the bridge.
- **Secrets via env vars, never CLI args** (args leak through `ps` / `/proc`). stdio servers read credentials from the environment.
- **Remote servers: OAuth 2.1.** Validate the token audience (RFC 8707) — **token passthrough is forbidden**. Validate the `Origin` header (DNS rebinding) and bind local HTTP to `127.0.0.1`.
- **Treat tool descriptions AND tool results as untrusted.** Tool poisoning, line jumping, and rug pulls all hide instructions where the agent reads them; keep destructive actions behind human approval.

## Test, debug, publish

- **Test** with the MCP Inspector (`npx @modelcontextprotocol/inspector ...`), unit-test handlers, and run an eval-driven loop on tool quality. stdio servers must log to **stderr** — a stray `stdout` write corrupts the JSON-RPC stream. See [testing.md](./references/testing.md).
- **Publish** via `server.json` (reverse-DNS name, immutable version) to the registry, and give consumers the `mcpServers` config block; MCPB (formerly DXT) packs a one-click local install. See [publishing.md](./references/publishing.md).

## Reference bundle

The post-init knowledge lives in [references/](./references/index.md) as a conformant OKF bundle:

- [protocol.md](./references/protocol.md) — spec revision, transports, lifecycle, primitives, result shapes, annotations, SDKs.
- [tool-design.md](./references/tool-design.md) — Anthropic's effective-tools guidance, naming, structured output, errors, context budget, code execution.
- [security.md](./references/security.md) — the threat model, OAuth 2.1 authorization, hardening, supply chain, OWASP MCP Top 10.
- [maintenance.md](./references/maintenance.md) — versioning, deprecation, `list_changed`, toolsets, pagination, observability, ops, pitfalls.
- [testing.md](./references/testing.md) — the Inspector, the stderr rule, test layers, eval-driven tool optimization.
- [publishing.md](./references/publishing.md) — the registry, `server.json`, distribution channels, the consumer config block, MCPB.

## Source

Based on [How to Build an MCP Server](https://saschb2b.com/blog/how-to-build-mcp-server), widened to the full lifecycle against the MCP `2025-11-25` spec. Reference implementations at [godot-mcp](https://github.com/Vollkorn-Games/godot-mcp) and [aseprite-mcp](https://github.com/Vollkorn-Games/aseprite-mcp).
