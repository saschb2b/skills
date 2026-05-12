# Engineering Skills

Code-adjacent practice the agent can run on a real repo.

- **[audit-actions](./audit-actions/SKILL.md)**. Audit `.github/workflows/` for unsafe `pull_request_target` usage. Greps every workflow, walks a 10-point severity checklist, names findings, proposes the right fix.
- **[scaffold-mcp](./scaffold-mcp/SKILL.md)**. Stand up a Model Context Protocol server in TypeScript using the five-layer architecture (server, tool defs, router, bridge, security). Picks a bridge pattern based on what the target software offers.
- **[react-compiler](./react-compiler/SKILL.md)**. Write and review React as if the Compiler is enabled. Skip manual `useMemo`, `useCallback`, and `React.memo` by default. Audit existing code for stale memoization and the five silent-bail patterns. Counterweight to LLM training data that precedes the compiler.
