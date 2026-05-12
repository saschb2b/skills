---
name: scaffold-mcp
description: Scaffold a new Model Context Protocol (MCP) server in TypeScript using the proven five-layer architecture. Use when the user wants to build an MCP server, expose a piece of software to AI agents (Claude Code, Cursor, Cline, Windsurf), connect a tool to an LLM, or asks "how do I make X accessible to AI?". Also use when starting any new agent-tool integration where the target software has its own scripting API, CLI, or HTTP surface.
date: 2026-05-12
source_post: how-to-build-mcp-server
---

# Scaffold an MCP server

## The five layers

Every MCP server, regardless of target software, has the same skeleton:

1. **Server & Transport** (`src/index.ts`) — stdio entry point, lifecycle, cleanup.
2. **Tool Definitions** (`src/tool-definitions.ts`) — the contract the AI reads to decide what to call. **The single most important file.**
3. **Router & Handlers** (`src/tool-router.ts`, `src/handlers/*.ts`) — request dispatch, validation, response shaping.
4. **The Bridge** (`src/executor.ts`, `scripts/*`) — how you actually talk to the target. **80% of the work.**
5. **Security & Validation** (`src/utils.ts`) — path checks, `execFile` over `exec`, tool filtering.

## Step 1: Identify the bridge — this decides everything else

Ask: how does the target software let me automate it?

| Target offers | Bridge pattern | Example |
|---|---|---|
| Scripting API (Lua, GDScript, Python) | Subprocess + script-injection dispatcher in the target's language | Aseprite (Lua), Godot (GDScript) |
| REST / HTTP API | `fetch` calls from handlers | Any web service |
| Rich CLI | `execFile` directly | FFmpeg, ImageMagick |
| Socket / TCP / WebSocket server | Persistent connection, manage state in `ServerContext` | Godot interactive mode |
| Native SDK | Direct import if Node-compatible | SQLite, native modules |

If two patterns apply, prefer the lower-state one (subprocess > persistent socket). State means lifecycle management.

## Step 2: Scaffold the files

```
your-mcp/
  src/
    index.ts             # Layer 1
    context.ts           # Shared state
    tool-definitions.ts  # Layer 2
    tool-router.ts       # Layer 3
    executor.ts          # Layer 4
    utils.ts             # Layer 5
    handlers/
      <domain>-handlers.ts
    scripts/
      operations.<lua|gd|py>   # Layer 4 if bridge needs it
  package.json
  tsconfig.json
```

Single production dependency: `@modelcontextprotocol/sdk`. Everything else (TypeScript, ESLint, Vitest) is dev-only.

## Step 3: Write ONE tool end to end before anything else

Do not define 50 tools up front. Pick the simplest useful operation (`get_version`, `create_file`), wire it through all five layers, run the inspector, watch the AI call it. Once one tool works, adding more is mechanical.

```
npx @anthropic/mcp-inspector build/index.js
```

If the tool list reads as confusing to you, it reads as confusing to the AI.

## Tool description rules

The description is the only documentation the AI has. Three rules:

1. **Precise verbs.** "Create a new sprite file with the specified dimensions and save it to the given path" beats "Sprite creation tool".
2. **Enums over strings.** `enum: ["RGB", "Grayscale", "Indexed"]` constrains the AI to valid values.
3. **Mark required vs optional clearly.** If a parameter has a sensible default, make it optional and document the default in the description.

## Handler skeleton

Every handler does four things, in this order:

```typescript
async function handleX(args, ctx) {
  const params = normalizeParameters(args);          // snake_case → camelCase
  validatePath(params.inputPath);                    // security
  const result = await executeOperation(...);        // call the bridge
  return { content: [{ type: "text", text: result.stdout }], isError: false };
}
```

Group handlers by domain. Each file 3–8 functions, none over ~25 KB. The codebase stays maintainable at 60+ tools.

## Security non-negotiables

- **`execFile`, never `exec`.** Arguments as array — no shell interpretation, no injection through file names.
- **Path validation on every path parameter.** Reject anything containing `..` before passing to the bridge.
- **Process isolation.** One subprocess per operation. If the target crashes on bad input, the MCP keeps running and the AI retries.
- **Tool filtering via env vars.** Support `MCP_TOOLSETS`, `MCP_EXCLUDE_TOOLS`, `MCP_READ_ONLY` so consumers can lock down what the AI sees. The filter runs before the tool list is exposed.

## Adding a new tool — four touch points

1. Tool definition in `tool-definitions.ts`
2. Handler function in `handlers/<domain>-handlers.ts`
3. Entry in `HANDLER_MAP` in `tool-router.ts`
4. Operation in the bridge script (if Layer 4 uses one)

Document this in `CONTRIBUTING.md` so future contributors don't drift.

## Source

Based on [How to Build an MCP Server](https://saschb2b.com/blog/how-to-build-mcp-server) — reference implementations at [godot-mcp](https://github.com/Vollkorn-Games/godot-mcp) and [aseprite-mcp](https://github.com/Vollkorn-Games/aseprite-mcp).
