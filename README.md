# Sascha's Skills

[![skills.sh](https://skills.sh/b/saschb2b/skills)](https://skills.sh/saschb2b/skills)

A small, growing collection of agent skills distilled from posts on [saschb2b.com/blog](https://saschb2b.com/blog). Designed to be small, composable, and to work with any agent that supports the [skills.sh](https://skills.sh) installer (Claude Code, Cursor, Codex, Cline, Windsurf, OpenCode, and others).

Each skill takes a single blog post and turns its argument into a checklist an agent can step through, end to end. Together they cover the kind of expert practice teams agree with on a calm day and skip on a busy one: the security audit nobody runs, the architecture everyone reinvents, the React pattern your LLM still writes the old way, the API codegen your LLM still wires the old way, the UX questions the generator skips past, the ticket discipline that drops on a busy Monday.

## Install

All at once:

```bash
npx skills@latest add saschb2b/skills
```

One at a time:

```bash
npx skills@latest add saschb2b/skills --skill audit-actions
npx skills@latest add saschb2b/skills --skill scaffold-mcp
npx skills@latest add saschb2b/skills --skill react-compiler
npx skills@latest add saschb2b/skills --skill codegen-api
npx skills@latest add saschb2b/skills --skill ask-ux
npx skills@latest add saschb2b/skills --skill to-story
```

Browse the rendered docs at [saschb2b.com/skills](https://saschb2b.com/skills).

## Why these skills exist

I built each one because the corresponding post wasn't enough. Writing down what to do is the easy part. Running the checklist on every repo, every PR, every ticket, is where I kept failing. The agent runs the checklist for me.

### 1. The security audit nobody runs

> "The dangerous workflow looks benign in review."
>
> from [The pull_request_target Trap](https://saschb2b.com/blog/pull-request-target-trap)

**The problem.** In the year leading up to May 2026, TanStack, Nx, PostHog, Trivy, `tj-actions/changed-files`, and a wave of 500+ targeted forks were all compromised through the same `pull_request_target` misuse. The pattern is a one-line YAML choice. The audit is grep plus ten yes/no questions. Almost nobody runs it.

**The fix:** [`/audit-actions`](./skills/engineering/audit-actions/SKILL.md). The agent greps every workflow, walks the ten-point checklist per match, names findings by severity, and proposes the right fix (switch the trigger, two-workflow pattern, drop the PR-head checkout, scope the cache, pin actions by SHA). Run it on every repo once. Run it again after every supply chain headline.

### 2. The architecture you reinvent every time

> "The protocol is simple. The architecture is reusable. The hard part is always the bridge."
>
> from [How to Build an MCP Server](https://saschb2b.com/blog/how-to-build-mcp-server)

**The problem.** Every MCP server has the same five layers: transport, tool definitions, router, bridge, security. The pattern is identical from one target to the next. The bridge, the layer that actually talks to the underlying tool, is 80% of the work. New authors spend a day rediscovering the skeleton before they touch the part that matters.

**The fix:** [`/scaffold-mcp`](./skills/engineering/scaffold-mcp/SKILL.md). The agent stamps out the five layers, walks the bridge decision matrix (scripting API, REST, CLI, socket, SDK), enforces the security non-negotiables (`execFile` over `exec`, path validation, process isolation), and stops the author from over-defining tools before one works end to end.

### 3. The React pattern your LLM still writes the old way

> "Treat a `useMemo` or `useCallback` in 2026 the way you would treat a manual `for` loop in modern JavaScript. Usually fine. Occasionally necessary. Mostly a sign that the author wrote this before better tools existed."
>
> from [The React Compiler at Eighteen Months](https://saschb2b.com/blog/react-compiler-year-in-review)

**The problem.** Every coding agent's React output is shaped by training data that precedes the React Compiler. The defaults are 2020-2024 React: `useMemo` for any derived value, `useCallback` for every handler, `React.memo` around every component. In a compiler-enabled codebase that is noise at best and a silent compiler bail-out at worst.

**The fix:** [`/react-compiler`](./skills/engineering/react-compiler/SKILL.md). The agent skips manual memoization when writing new components and audits existing code against the documented exception cases. Also handles the strict `eslint-plugin-react-hooks` configuration that makes silent compiler bails visible at build time.

### 4. The API codegen your LLM still wires the old way

> "The ecosystem has converged. Both the REST and GraphQL worlds independently arrived at the same conclusion: stop generating framework-specific hooks, start generating framework-agnostic options and typed documents instead."
>
> from [Typesafe API Code Generation for React in 2026](https://saschb2b.com/blog/typesafe-api-codegen-2026)

**The problem.** LLM training data predates the 2024-2025 shift from generated hooks to generated options. The defaults look like 2022: `useGetPet()`, `useFilmsQuery()`, per-query result types passed as prop types, `@graphql-codegen/typescript-react-apollo` plugins now community-stale. None of that is wrong, exactly. It no longer composes the way the modern ecosystem expects.

**The fix:** [`/codegen-api`](./skills/engineering/codegen-api/SKILL.md). The agent picks the right tool for the API source and data-fetching library (`hey-api` for OpenAPI, `graphql-codegen` client preset for GraphQL with Apollo or urql or TanStack, `gql.tada` for small GraphQL schemas without a build step), wires the minimal config, and uses the generated primitives directly with the library's own hooks. Fragment masking handles component composition without per-query prop types or hook wrappers.

### 5. The UX questions the generator skips past

> "Polish is no longer a moat. It is a default. What is not a default is the thinking underneath."
>
> from [Questions Before Pixels](https://saschb2b.com/blog/questions-before-pixels)

**The problem.** A competent generator produces a beautiful screen in under a minute. The visible part of design is now nearly free. The invisible part (should this screen exist, what was the user doing thirty seconds before, what happens when they're wrong) is where teams quietly skip the work because the artifact already looks done.

**The fix:** [`/ask-ux`](./skills/productivity/ask-ux/SKILL.md). The agent runs the UI-vs-UX diagnostic on a reported "UX problem", then walks the twelve questions in the order they bite. Forces the answers to exist before the first pixel moves.

### 6. The ticket discipline you drop on busy Mondays

> "If a designer, a PM, or a new engineer reads the ticket cold, can they tell what we're changing and why it matters?"
>
> from [Stories, Not Braindumps](https://saschb2b.com/blog/stories-not-braindumps)

**The problem.** Every team that has been running Scrum for a while can break work down. The board fills up. The work ships. And yet, when someone outside the team opens a ticket, they cannot tell what is being built or for whom. The information is there. It was written for the author, not for the next reader.

**The fix:** [`/to-story`](./skills/productivity/to-story/SKILL.md). The agent takes a draft ticket, runs INVEST plus Connextra, rewrites it as a contract between roles. If the only failing INVEST letter is `S`, it splits with SPIDR. Stops the horizontal-by-layer split that breaks Independent, Valuable, and Testable simultaneously.

## Reference

### Engineering

Code-adjacent work.

- **[audit-actions](./skills/engineering/audit-actions/SKILL.md)**. Audit `.github/workflows/` for the `pull_request_target` misuse pattern that compromised TanStack, Nx, PostHog, and Trivy. Greps every workflow, walks a 10-point severity checklist, names findings, proposes the right fix.
- **[scaffold-mcp](./skills/engineering/scaffold-mcp/SKILL.md)**. Stand up a Model Context Protocol server in TypeScript using the five-layer architecture. Picks a bridge pattern based on what the target software offers.
- **[react-compiler](./skills/engineering/react-compiler/SKILL.md)**. Write and review React as if the Compiler is enabled. Skip manual `useMemo`, `useCallback`, and `React.memo` by default. Audit existing code for stale memoization and the five silent-bail patterns. Sets the strict `eslint-plugin-react-hooks` rules.
- **[codegen-api](./skills/engineering/codegen-api/SKILL.md)**. Set up typesafe API code generation in 2026. Decision matrix for OpenAPI (`hey-api`) and GraphQL (`graphql-codegen` client preset, or `gql.tada` for no build step). Generates options factories and typed documents instead of legacy hooks. Fragment masking for composition.

### Productivity

Process and discipline, not code-specific.

- **[ask-ux](./skills/productivity/ask-ux/SKILL.md)**. Force UX questioning before any UI work. UI-vs-UX diagnostic, then twelve questions in the order they bite.
- **[to-story](./skills/productivity/to-story/SKILL.md)**. Reshape a draft Jira or GitHub ticket as a real user story with INVEST-clean ACs. Splits oversized stories with SPIDR.

## Authoring your own

These are personal skills, but the structure is reusable. To write your own:

1. Add a folder under `skills/<bucket>/<slug>/`
2. Drop in a `SKILL.md` with frontmatter (`name`, `description`, optional `date`, `source_post`)
3. Start the `description` with what the skill does, then `Use when ...` triggers. This is the only field the agent reads when deciding to load the skill.
4. Keep `SKILL.md` under ~100 lines. If it bulges, split into sibling files and link to them.

See [CLAUDE.md](./CLAUDE.md) for the full conventions.

## License

MIT.
