---
type: Reference
title: "Publishing and Distributing an MCP Server"
description: "The official registry, server.json, the mcp-publisher flow, distribution channels (npm, PyPI, OCI, MCPB), and the mcpServers config block consumers paste."
tags: [mcp, registry, publishing, distribution, server-json]
timestamp: 2026-06-21T00:00:00Z
---

# Publishing and Distributing an MCP Server

Two separate things ship: the **metadata** (to the registry, so the server is discoverable) and the **code** (to npm, PyPI, a container registry, or an MCPB bundle). The registry stores only metadata and points at the code.

## The official registry

[`registry.modelcontextprotocol.io`](https://registry.modelcontextprotocol.io) is the open catalog and primary source of truth for public servers, backed by Anthropic, GitHub, and others. Flag it loudly to anyone relying on it: it is **preview**, with no data-durability guarantees and possible data resets before general availability. The architecture is layered: the official registry is upstream, and downstream public marketplaces and private enterprise sub-registries ingest, filter, and re-serve it, so clients usually consume through those rather than hitting the official API directly. Source: [registry preview announcement](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/).

## server.json

The standardized manifest for registry publishing and client discovery. The schema is date-versioned at `https://static.modelcontextprotocol.io/schemas/<date>/server.schema.json`.

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.alice/weather-server",
  "description": "MCP server for weather data",
  "version": "1.0.2",
  "repository": { "url": "https://github.com/alice/weather-server", "source": "github" },
  "packages": [{
    "registryType": "npm",
    "identifier": "@alice/weather-server",
    "version": "1.0.2",
    "transport": { "type": "stdio" },
    "environmentVariables": [
      { "name": "WEATHER_API_KEY", "isRequired": true, "isSecret": true }
    ]
  }]
}
```

Rules that bite:

- **Name is reverse-DNS with exactly one slash**, `namespace/server-name`. The auth method gates the namespace: GitHub auth gives `io.github.<user>/*`, domain auth gives `com.example.../<server>`.
- **`version` is required, unique per publication, and immutable once published.** Semver is recommended, and the registry parses semver to compute "latest". Footgun: an unparseable version string is always marked latest, so mixing semver and non-semver can let a stale build win latest. Version ranges (`^1.2.3`, `1.x`) are prohibited; use a `-prerelease` suffix for metadata-only republishes.
- A **hosted** server uses a `remotes[]` array instead of `packages[]`, with `type: "streamable-http"` (or the legacy `"sse"`) and a `url`.

## Publishing flow

Use the `mcp-publisher` CLI: `brew install mcp-publisher`, then `mcp-publisher init`, edit `server.json`, `mcp-publisher login github` (device-code OAuth; `github-oidc` for CI, plus `dns` and `http` methods), then `mcp-publisher publish`. The auth method determines which namespace you may publish under.

## Distribution channels

The registry only points at code, which lives in a normal package registry, each with an ownership proof:

| `registryType` | Ownership proof |
| --- | --- |
| `npm` | An `mcpName` field in `package.json` |
| `pypi` | An `mcp-name: <name>` line in the README |
| `oci` (Docker) | A Docker label annotation with the server name |
| `mcpb` | The `file_sha256` of the release artifact |

## The consumer config block

What a user pastes into Claude Desktop (`claude_desktop_config.json`), Claude Code, or Cursor to run a stdio server as a subprocess:

```json
{
  "mcpServers": {
    "weather": {
      "command": "npx",
      "args": ["-y", "@alice/weather-server"],
      "env": { "WEATHER_API_KEY": "your-key" }
    }
  }
}
```

On Windows, `command` is often `cmd` with `/c` prepended to the real command. Make this block copy-paste correct in your README, since it is the first thing every consumer touches.

## MCPB for one-click local install

An `.mcpb` file is a ZIP bundling the server code, its dependencies, and a required `manifest.json`, for one-click install in Claude Desktop (Settings then Extensions). Build it with `npm i -g @anthropic-ai/mcpb`, then `mcpb init` and `mcpb pack`. Note the rename: **MCPB was formerly DXT**, the CLI `dxt` became `mcpb`, and the repo is now [`modelcontextprotocol/mcpb`](https://github.com/modelcontextprotocol/mcpb). Existing `.dxt` files still work, but new content should use `.mcpb`.
