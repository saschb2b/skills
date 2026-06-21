---
type: Reference
title: "MCP Security and Authorization"
description: "The MCP threat model (confused deputy, token passthrough, session hijacking, tool poisoning, rug pulls, line jumping, cross-server shadowing), OAuth 2.1 authorization, server hardening, and supply chain."
tags: [mcp, security, oauth, authorization, threat-model]
timestamp: 2026-06-21T00:00:00Z
---

# MCP Security and Authorization

An MCP server runs with real privileges and reads input that is agent-influenced and, through tool results, attacker-reachable. This note keeps the spec's MUST and SHOULD language where the spec uses it. Sources: [security best practices](https://modelcontextprotocol.io/specification/2025-06-18/basic/security_best_practices), [authorization](https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization).

## Protocol-layer threats (the spec's named three)

### Confused deputy

An MCP proxy server that fronts a third-party API as a single OAuth client can be tricked into issuing authorization codes without real user consent, by combining a static client ID, dynamic client registration, and a third-party consent cookie that suppresses the consent screen on the attacker's crafted `redirect_uri`. Mitigation: proxy servers **MUST** implement per-client consent, keep a server-side per-user registry of approved `client_id` values and check it before forwarding, validate `redirect_uri` by exact string match, and protect the consent page (CSRF token, `frame-ancestors`/`X-Frame-Options: DENY`, `__Host-` cookies).

### Token passthrough (forbidden)

A server that accepts a token not issued to itself and forwards it downstream circumvents rate limiting and audit, breaks trust boundaries, and becomes an exfiltration proxy. The rule is absolute: a server **MUST NOT** accept any token that was not explicitly issued for it. Validate the audience (RFC 8707): reject any token whose audience is not this server. If the server calls upstream APIs, it acts as a separate OAuth client and **MUST NOT** pass the client's token through.

### Session hijacking

If a session ID is guessable or reusable, an attacker can impersonate a client or inject events into a shared queue. Mitigations: servers that implement authorization **MUST** verify all inbound requests and **MUST NOT** use sessions for authentication; servers **MUST** use secure, non-deterministic session IDs (a CSPRNG, not sequential); and servers **SHOULD** bind the session ID to user identity (a key like `<user_id>:<session_id>`) so a guessed session alone cannot impersonate a user.

## OAuth 2.1 authorization

Authorization is **OPTIONAL** in MCP and transport-scoped. HTTP transports **SHOULD** conform to the spec; **stdio transports SHOULD NOT** use it and instead read credentials from the environment. So local equals env-based secrets, remote equals OAuth.

The MCP server is an **OAuth 2.1 Resource Server**:

- It **MUST** serve Protected Resource Metadata (RFC 9728) at `/.well-known/oauth-protected-resource`, with at least one `authorization_servers` entry, and return `401` plus a `WWW-Authenticate` header pointing at that metadata when unauthenticated.
- The authorization server **MUST** publish Authorization Server Metadata (RFC 8414). Both sides **SHOULD** support Dynamic Client Registration (RFC 7591).
- The client **MUST** use PKCE, **MUST** include the RFC 8707 `resource` parameter (the server's canonical URI) on both authorization and token requests so the token is audience-bound, and **MUST** send `Authorization: Bearer <token>` on every request, never in the query string.
- The server validates the token per OAuth 2.1, validates the audience, and returns `401` for invalid or expired tokens, `403` for insufficient scope. Endpoints **MUST** be HTTPS; redirect URIs **MUST** be `localhost` or HTTPS and validated by exact match.

Cloudflare's `workers-oauth-provider` is a ready-made resource-server implementation if you do not want to build it.

## Tool-layer threats (the dangerous, MCP-specific ones)

These exploit that the agent reads tool descriptions and tool results as trusted text.

| Threat | What it is | Defense |
| --- | --- | --- |
| **Tool poisoning** (OWASP MCP03) | Malicious instructions hidden in a tool description, schema, or return value that the model reads but the user does not see. The Invariant Labs PoC hid an instruction to read `~/.ssh/id_rsa` and exfiltrate it via a parameter. | Treat the entire tool schema as an injection surface. Scan descriptions; pin and re-approve on change. |
| **Prompt injection via tool results** | Data a tool returns carries instructions the model then executes. Tool responses bypass the connection-time vetting that descriptions get and flow straight into context. | Treat every tool result as untrusted input. Strip control tags (`<IMPORTANT>`, `<system>`); tell the model returned values are data, not instructions; constrain results to a schema. |
| **Rug pull** | A server silently changes a tool's definition after the user approved it; MCP does not pin definitions and most clients do not re-prompt on change. | Pin and SHA-256-hash the canonical definition, alert and re-approve on any change. As an author, never repurpose an approved tool name; version it instead (see [maintenance.md](maintenance.md)). |
| **Line jumping** | A tool influences the agent merely by being listed, because `tools/list` descriptions enter context on connect, before any call. | Scan descriptions before inclusion; trust-on-first-use that alerts on new or modified tools. |
| **Cross-server shadowing** | A malicious server's description manipulates how the agent uses a different trusted server's tools (for example, instructing it to BCC an attacker on every `send_email`). | Isolate privileged tools in separate agent contexts; prevent one server's description from referencing another's tools; monitor cross-server data flows. |

The cross-cutting defenses: keep destructive actions behind **human-in-the-loop approval that shows the full parameters** (not just a tool name) and happens outside the model's context, and treat tool descriptions and tool results as untrusted end to end.

## Server hardening (especially stdio subprocess bridges)

- **Command injection.** Use `execFile` or `spawn` with an argument array, never `exec` with an interpolated shell string. `exec` spawns a shell and is injectable through file names. Allowlist the binary and insert a `--` separator so attacker-supplied args are not parsed as flags. (Real CVE: gemini-mcp-tool RCE, CVE-2026-0755.)
- **Path traversal.** `path.resolve()` to an absolute path, then verify the result starts with the intended base directory; reject on a traversal hit, with no fallback. Restrict filesystem access to required directories.
- **Secrets via env, not args.** CLI args are world-readable via `ps` and `/proc/<pid>/cmdline`; env vars are not. Pull from the environment or a secrets manager, never source control, and never log credential values.
- **Least privilege and isolation.** Minimum permissions, per-server scoped credentials (never shared across servers), short-lived tokens, and process sandboxing (containers, restricted FS and network).
- **Input validation.** Strict JSON Schema with `additionalProperties: false` and `pattern` constraints; length limits (very long inputs often signal injection).
- **Rate limiting, timeouts, and audit logging** per session or tenant; redact secrets and PII from logs.
- **Local HTTP servers.** Validate the `Origin` header (invalid then `403`) to stop DNS rebinding, bind to `127.0.0.1` only, and require a token. The official TypeScript SDK once shipped without default DNS-rebinding protection (CVE-2025-66414, fixed in v1.24.0), so confirm your SDK version enables it.

## Supply chain

`npx -y @untrusted/mcp-server` executes arbitrary code with your credentials, files, and environment, and even scanning a config can execute its commands. So: review third-party servers before approving, verify package names against typosquats (`filesystem` vs `filesytem`; a malicious `postmark-mcp` once harvested emails), pin specific versions and use lockfiles rather than `@latest`, run a scanner such as `mcp-scan` (it also detects post-install description changes for rug pulls), and sandbox untrusted servers. The official [MCP Registry](https://registry.modelcontextprotocol.io) is a discovery source of truth but is preview and self-reported, so discovery is solved while trust is still the open problem (see [publishing.md](publishing.md)).

## OWASP MCP Top 10 (2025)

A checklist to sweep against: MCP01 Token Mismanagement and Secret Exposure, MCP02 Privilege Escalation via Scope Creep, MCP03 Tool Poisoning, MCP04 Supply Chain and Dependency Tampering, MCP05 Command Injection, MCP06 Intent Flow Subversion, MCP07 Insufficient AuthN/AuthZ, MCP08 Lack of Audit and Telemetry, MCP09 Shadow MCP Servers, MCP10 Context Injection and Over-Sharing. Source: [OWASP MCP Top 10](https://owasp.org/www-project-mcp-top-10/), [OWASP MCP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/MCP_Security_Cheat_Sheet.html).
