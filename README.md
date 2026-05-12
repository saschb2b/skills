# Sascha's Skills

A small, growing collection of Claude Code skills distilled from posts at [saschb2b.com/blog](https://saschb2b.com/blog). Each skill is one post's argument turned into a checklist an agent can actually run.

## Install

All at once:

```sh
npx skills@latest add saschb2b/skills
```

Or pick individually:

```sh
npx skills@latest add saschb2b/skills/audit-pr-target
npx skills@latest add saschb2b/skills/scaffold-mcp-server
npx skills@latest add saschb2b/skills/questions-before-pixels
npx skills@latest add saschb2b/skills/story-not-braindump
```

## Skills

### Engineering

- **`/audit-pr-target`** — Audit `.github/workflows/` for the `pull_request_target` misuse pattern that compromised TanStack, Nx, PostHog, and Trivy. Based on [The pull_request_target Trap](https://saschb2b.com/blog/pull-request-target-trap).
- **`/scaffold-mcp-server`** — Stand up a Model Context Protocol server in TypeScript using the proven five-layer architecture. Based on [How to Build an MCP Server](https://saschb2b.com/blog/how-to-build-mcp-server).

### Productivity

- **`/questions-before-pixels`** — Run the 12-question UX handbook and the UI-vs-UX diagnostic before any pixels get drawn. Based on [Questions Before Pixels](https://saschb2b.com/blog/questions-before-pixels).
- **`/story-not-braindump`** — Turn a draft ticket into a real user story with INVEST + Connextra, and split too-big stories with SPIDR. Based on [Stories, Not Braindumps](https://saschb2b.com/blog/stories-not-braindumps).

## License

MIT.
