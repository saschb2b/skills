---
type: Playbook
title: "Testing and Debugging an MCP Server"
description: "The MCP Inspector, the stderr rule, Claude as a live test client, the three testing layers, and the eval-driven loop that lets the agent optimize the tools."
tags: [mcp, testing, debugging, inspector, evals]
timestamp: 2026-06-21T00:00:00Z
---

# Testing and Debugging an MCP Server

Three layers, from mechanics to quality: confirm the protocol works, confirm the handlers work, and confirm the agent can actually use the tools. Sources: [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector), [debugging guide](https://modelcontextprotocol.io/docs/tools/debugging).

## The stderr rule (the most important debugging fact)

For a **stdio** server, stdout carries the JSON-RPC stream. The spec: "Local MCP servers should not log messages to stdout... as this will interfere with protocol operation." Anything logged to **stderr** is captured by the host automatically. A single stray `console.log`, `print`, or noisy dependency on stdout corrupts the stream and produces parse errors. On Streamable HTTP, stderr is not captured by the client, so use `notifications/message` or your own log aggregation instead.

## The MCP Inspector

The official first stop is `@modelcontextprotocol/inspector`, an interactive, transport-agnostic UI. Run it with no install via `npx`, pointing at the command that launches your server:

```bash
# local build
npx @modelcontextprotocol/inspector node build/index.js arg1 arg2
# an npm-published server
npx -y @modelcontextprotocol/inspector npx @modelcontextprotocol/server-filesystem ~/Desktop
# pass env vars
npx @modelcontextprotocol/inspector -e API_KEY=value -- node build/index.js
```

It opens a web UI (default port 6274, with a Node proxy on 6277) with tabs for Tools (list and call with custom inputs, see schemas and results), Resources (list, inspect, test subscriptions), Prompts (test templates with arguments), and a Notifications pane for server logs. Buttons export a paste-ready `mcp.json`. Use it to walk the edge cases: invalid inputs, missing required args, concurrency, error handling.

The proxy prints a random session token that must ride as a Bearer token; it binds to localhost and validates `Origin` against DNS rebinding. Do not set `DANGEROUSLY_OMIT_AUTH` (the auth model was added after a critical RCE, CVE-2025-49596). Confirm the Inspector and Node versions before relying on a specific flag.

## CLI mode for CI

`--cli` turns the Inspector into a scriptable JSON-RPC client, which is the integration-test surface for CI:

```bash
npx @modelcontextprotocol/inspector --cli node build/index.js --method tools/list
npx @modelcontextprotocol/inspector --cli node build/index.js \
  --method tools/call --tool-name get_forecast --tool-arg city=Berlin
```

## Claude as a live test client

Claude Desktop and Claude Code are real clients you can wire your server into. Gotchas:

- The working directory may be undefined, so use **absolute paths** in the config.
- A stdio server inherits only a limited environment, so pass everything else through `env` in the config block.
- A capability-negotiation failure surfaces as JSON-RPC `-32602`.
- Logs are at `~/Library/Logs/Claude/mcp*.log` (macOS) or `%APPDATA%\Claude\logs` (Windows); tail with `tail -n 20 -F`.
- **Fully quit and reopen** after a code change. Closing the window is not enough.

## The three testing layers

1. **Unit-test the handlers.** Call the handler functions directly with your normal test framework. MCP prescribes no harness here, so this is ordinary testing.
2. **Integration-test the protocol.** Drive `tools/list`, `tools/call`, and friends over JSON-RPC against a running server. The Inspector CLI in JSON mode is built for this in CI.
3. **Eval-test tool quality.** This is the load-bearing layer, because a tool can pass layers 1 and 2 and still be one the agent cannot use. Generate realistic eval tasks, run them in simple agentic loops (a `while` loop alternating an LLM call and a tool call, one per task), and collect accuracy, tool-call count, token use, and errors. Then paste the transcripts into Claude Code and let it refactor the tool descriptions and schemas. The design rationale for this loop is in [tool-design.md](tool-design.md). This is the same loop that surfaces whether your descriptions, parameter names, and result shapes are doing their job.
