# Sascha's Skills

[![skills.sh](https://skills.sh/b/saschb2b/skills)](https://skills.sh/saschb2b/skills)

A small, growing collection of agent skills distilled from posts on [saschb2b.com/blog](https://saschb2b.com/blog). Designed to be small, composable, and to work with any agent that supports the [skills.sh](https://skills.sh) installer (Claude Code, Cursor, Codex, Cline, Windsurf, OpenCode, and others).

Each skill takes a single blog post and turns its argument into a checklist an agent can step through, end to end. Together they cover the kind of expert practice teams agree with on a calm day and skip on a busy one: the security audit nobody runs, the architecture everyone reinvents, the React pattern your LLM still writes the old way, the API codegen your LLM still wires the old way, the colors your LLM still sprinkles as hex, the UX questions the generator skips past, the ticket discipline that drops on a busy Monday.

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
npx skills@latest add saschb2b/skills --skill theme-colors
npx skills@latest add saschb2b/skills --skill javascript-ecosystem
npx skills@latest add saschb2b/skills --skill godot
npx skills@latest add saschb2b/skills --skill ask-ux
npx skills@latest add saschb2b/skills --skill to-story
npx skills@latest add saschb2b/skills --skill autopilot
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

**The problem.** Most coding agents' React output is shaped by training corpora dominated by pre-compiler React. The defaults look 2020-2024: `useMemo` for any derived value, `useCallback` for every handler, `React.memo` around every component. In a compiler-enabled codebase that is noise at best and a silent compiler bail-out at worst.

**The fix:** [`/react-compiler`](./skills/engineering/react-compiler/SKILL.md). The agent skips manual memoization when writing new components and audits existing code against the documented exception cases. Also handles the strict `eslint-plugin-react-hooks` configuration that makes silent compiler bails visible at build time.

### 4. The API codegen your LLM still wires the old way

> "The ecosystem has converged. Both the REST and GraphQL worlds independently arrived at the same conclusion: stop generating framework-specific hooks, start generating framework-agnostic options and typed documents instead."
>
> from [Typesafe API Code Generation for React in 2026](https://saschb2b.com/blog/typesafe-api-codegen-2026)

**The problem.** The bulk of API codegen examples in any agent's training corpus reflects the pre-2024 hooks pattern. The defaults look like 2022: `useGetPet()`, `useFilmsQuery()`, per-query result types passed as prop types, `@graphql-codegen/typescript-react-apollo` plugins now community-stale. None of that is wrong, exactly. It no longer composes the way the modern ecosystem expects.

**The fix:** [`/codegen-api`](./skills/engineering/codegen-api/SKILL.md). The agent picks the right tool for the API source and data-fetching library (`hey-api` for OpenAPI, `graphql-codegen` client preset for GraphQL with Apollo or urql or TanStack, `gql.tada` for small GraphQL schemas without a build step), wires the minimal config, and uses the generated primitives directly with the library's own hooks. Fragment masking handles component composition without per-query prop types or hook wrappers.

### 5. The colors your LLM still sprinkles as hex

> "Blue describes what the color looks like right now. Primary describes what the color does. One is a snapshot, the other is a role."
>
> from [Why Developers Keep Asking for Primary Instead of Blue](https://saschb2b.com/blog/designer-meets-theme)

**The problem.** LLM training corpora are dominated by tutorial code that hardcodes colors. Every output ships with hex codes inlined into component files, `rgba()` literals where `alpha()` belongs, and named CSS colors used as one-off values. Every literal is one more place that needs updating on a brand change, one more thing dark mode breaks, one more subtle visual inconsistency.

**The fix:** [`/theme-colors`](./skills/engineering/theme-colors/SKILL.md). The agent uses theme roles by default (primary, secondary, error, surface, text), reaches for `alpha()` against a theme color instead of literal `rgba()`, and moves gradients into the `sx` callback so theme values can be interpolated. Audits existing code by grepping for color literals and proposes the role-based replacement for each.

### 6. The UX questions the generator skips past

> "Polish is no longer a moat. It is a default. What is not a default is the thinking underneath."
>
> from [Questions Before Pixels](https://saschb2b.com/blog/questions-before-pixels)

**The problem.** A competent generator produces a beautiful screen in under a minute. The visible part of design is now nearly free. The invisible part (should this screen exist, what was the user doing thirty seconds before, what happens when they're wrong) is where teams quietly skip the work because the artifact already looks done.

**The fix:** [`/ask-ux`](./skills/productivity/ask-ux/SKILL.md). The agent runs the UI-vs-UX diagnostic on a reported "UX problem", then walks the twelve questions in the order they bite. Forces the answers to exist before the first pixel moves.

### 7. The ticket discipline you drop on busy Mondays

> "If a designer, a PM, or a new engineer reads the ticket cold, can they tell what we're changing and why it matters?"
>
> from [Stories, Not Braindumps](https://saschb2b.com/blog/stories-not-braindumps)

**The problem.** Every team that has been running Scrum for a while can break work down. The board fills up. The work ships. And yet, when someone outside the team opens a ticket, they cannot tell what is being built or for whom. The information is there. It was written for the author, not for the next reader.

**The fix:** [`/to-story`](./skills/productivity/to-story/SKILL.md). The agent takes a draft ticket, runs INVEST plus Connextra, rewrites it as a contract between roles. If the only failing INVEST letter is `S`, it splits with SPIDR. Stops the horizontal-by-layer split that breaks Independent, Valuable, and Testable simultaneously.

### 8. The framework version your LLM is a year behind on

> "Every AI coding tool in 2026 produces the same React app. The brand on the box is different. The code inside is not."
>
> from [The LLM Default React Stack](https://saschb2b.com/blog/llm-default-react-stack)

**The problem.** Training corpora are dominated not just by a few frameworks but by their older versions. The output defaults to manual memoization for a compiler-enabled React, NgModules for a signals-and-standalone Angular, `tailwind.config.js` for a CSS-first Tailwind v4, the `.eslintrc` schema ESLint dropped, the positional `useQuery` signature TanStack Query replaced. The framework name is current. The paradigm inside is a year or more stale.

**The fix:** [`/javascript-ecosystem`](./skills/engineering/javascript-ecosystem/SKILL.md). A changelog index across the ecosystem (frameworks, meta-frameworks, UI libraries, state, tooling, testing, mobile, backend, forms, auth, i18n, dates, API codegen, GraphQL clients, email, payments, observability, CMS, AI SDKs). The agent checks the project's installed version first, then routes to a per-tool notes file with a Stop/Start table that maps the pattern it would reach for to the one the current version wants. The notes carry a verified date and tell the agent to re-confirm against official release notes when the snapshot looks old, so it ages gracefully instead of hardcoding a moment in time. It is standalone: every notes file is complete on its own, and it composes with the `react-compiler`, `codegen-api`, `theme-colors`, and `claude-api` skills as optional deeper dives if they are installed, but requires none of them.

## Reference

### Engineering

Code-adjacent work.

- **[audit-actions](./skills/engineering/audit-actions/SKILL.md)**. Audit `.github/workflows/` for the `pull_request_target` misuse pattern that compromised TanStack, Nx, PostHog, and Trivy. Greps every workflow, walks a 10-point severity checklist, names findings, proposes the right fix.
- **[scaffold-mcp](./skills/engineering/scaffold-mcp/SKILL.md)**. Stand up a Model Context Protocol server in TypeScript using the five-layer architecture. Picks a bridge pattern based on what the target software offers.
- **[react-compiler](./skills/engineering/react-compiler/SKILL.md)**. Write and review React as if the Compiler is enabled. Skip manual `useMemo`, `useCallback`, and `React.memo` by default. Audit existing code for stale memoization and the five silent-bail patterns. Sets the strict `eslint-plugin-react-hooks` rules.
- **[codegen-api](./skills/engineering/codegen-api/SKILL.md)**. Set up typesafe API code generation in 2026. Decision matrix for OpenAPI (`hey-api`) and GraphQL (`graphql-codegen` client preset, or `gql.tada` for no build step). Generates options factories and typed documents instead of legacy hooks. Fragment masking for composition.
- **[theme-colors](./skills/engineering/theme-colors/SKILL.md)**. Every color value comes from the theme. Replace hex codes, `rgba()` literals, and named colors with palette roles (primary, secondary, error, surface, text) and the `alpha()` helper. Counterweight to LLM training corpora that scatter hex codes through component files.
- **[javascript-ecosystem](./skills/engineering/javascript-ecosystem/SKILL.md)**. Default to the latest stable major versions and their current paradigms across the JS/TS ecosystem. A changelog index that routes to per-tool Stop/Start notes (React, Angular, Vue, Svelte, Solid, Next.js, Tailwind, MUI, TanStack Query, TypeScript, Vite, Node, ESLint, and more). Checks the project's installed version first, since the snapshot ages. Counterweight to training data frozen on older versions and their patterns.
- **[godot](./skills/engineering/godot/SKILL.md)**. Develop in the Godot game engine against the current stable (4.x). Typed GDScript, the TileMapLayer API, scene and node architecture, the resource system, signals, autoloads, input handling, the .tscn/.tres/project.godot text formats, and version-tagged pitfalls and breaking changes. A dated snapshot with per-reference verified dates that checks the project's Godot version first and tells the agent to re-confirm version-specific claims when the snapshot looks old.

### Productivity

Process and discipline, not code-specific.

- **[ask-ux](./skills/productivity/ask-ux/SKILL.md)**. Force UX questioning before any UI work. UI-vs-UX diagnostic, then twelve questions in the order they bite.
- **[to-story](./skills/productivity/to-story/SKILL.md)**. Reshape a draft Jira or GitHub ticket as a real user story with INVEST-clean ACs. Splits oversized stories with SPIDR.
- **[autopilot](./skills/productivity/autopilot/SKILL.md)**. Hand off the project and let the agent run on its own. It surveys, finds one high-value low-risk improvement, verifies it, commits it, and loops. Generate-then-rank judgment for picking the work (so a sensible small feature competes on equal footing, not a fixed checklist), in-bounds vs surface-first rails, and anti-churn checks so you review a clean stream of small wins instead of one giant diff.

## Authoring your own

These are personal skills, but the structure is reusable. To write your own:

1. Add a folder under `skills/<bucket>/<slug>/`
2. Drop in a `SKILL.md` with frontmatter (`name`, `description`, optional `date`, `source_post`)
3. Start the `description` with what the skill does, then `Use when ...` triggers. This is the only field the agent reads when deciding to load the skill.
4. Keep `SKILL.md` under ~100 lines. If it bulges, split into sibling files and link to them.

See [CLAUDE.md](./CLAUDE.md) for the full conventions.

## License

MIT.
