---
okf_version: "0.1"
---

# Post-init knowledge behind the mcp-server skill.

The procedure lives in the skill's SKILL.md. These concepts hold the depth for everything after the scaffold: the protocol surface, the agent-facing tool contract, the threat model, the maintenance playbook, testing, and publishing. All notes target the MCP `2025-11-25` spec revision.

- [Protocol Surface](protocol.md) - Spec revision, the two transports, the initialize lifecycle, server and client primitives, tool result shapes, annotations, and the official SDKs.
- [Tool Design](tool-design.md) - Anthropic's effective-tools guidance: build workflow tools not endpoint wrappers, write descriptions agents read correctly, structured output, error handling, and the context-budget problem.
- [Security and Authorization](security.md) - The MCP threat model (confused deputy, token passthrough, session hijacking, tool poisoning, rug pulls, line jumping, cross-server shadowing), OAuth 2.1 authorization, server hardening, and supply chain.
- [Maintenance and Operations](maintenance.md) - Versioning and deprecation without breaking agents, list_changed notifications, the _meta extension point, toolsets, pagination, observability, the stdio to Streamable HTTP operational cliff, and production pitfalls.
- [Testing and Debugging](testing.md) - The MCP Inspector, the stderr rule, Claude as a live test client, the three testing layers, and the eval-driven loop that lets the agent optimize the tools.
- [Publishing and Distribution](publishing.md) - The official registry, server.json, the mcp-publisher flow, distribution channels (npm, PyPI, OCI, MCPB), and the mcpServers config block consumers paste.
