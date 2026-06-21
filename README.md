<div align="center">

# Sascha's Skills

**Expert practice, packaged as checklists your coding agent can actually run.**

[![skills.sh](https://skills.sh/b/saschb2b/skills)](https://skills.sh/saschb2b/skills)
[![Skills](https://img.shields.io/badge/skills-15-2ea44f)](#skill-reference)
[![Docs](https://img.shields.io/badge/docs-saschb2b.com-0969da)](https://saschb2b.com/skills)
[![License](https://img.shields.io/badge/license-MIT-0969da)](./LICENSE)

</div>

A small, growing collection of agent skills distilled from posts on [saschb2b.com/blog](https://saschb2b.com/blog). Designed to be small, composable, and to work with any agent that supports the [skills.sh](https://skills.sh) installer (Claude Code, Cursor, Codex, Cline, Windsurf, OpenCode, and others).

Most skills take a single blog post and turn its argument into a checklist an agent can step through, end to end; a few (like `godot`, `android-compose`, and `javascript-ecosystem`) are living reference snapshots that re-verify as they age. Together they cover the kind of expert practice teams agree with on a calm day and skip on a busy one: the security audit nobody runs, the architecture everyone reinvents, the framework version your LLM is a year behind on, the React pattern and API codegen your LLM still wires the old way, the colors your LLM still sprinkles as hex, the prop API your LLM grows by accretion, the UX questions the generator skips past, the ticket discipline that drops on a busy Monday, the agent knowledge that stays locked in one vendor's catalog instead of traveling as portable files.

## Contents

- [Install](#install)
- [Skill reference](#skill-reference)
- [Why these skills exist](#why-these-skills-exist)
- [Authoring your own](#authoring-your-own)
- [License](#license)

## Install

All at once:

```bash
npx skills@latest add saschb2b/skills
```

One at a time:

```bash
npx skills@latest add saschb2b/skills --skill audit-actions
npx skills@latest add saschb2b/skills --skill mcp-server
npx skills@latest add saschb2b/skills --skill react-compiler
npx skills@latest add saschb2b/skills --skill react-stinky
npx skills@latest add saschb2b/skills --skill codegen-api
npx skills@latest add saschb2b/skills --skill theme-colors
npx skills@latest add saschb2b/skills --skill javascript-ecosystem
npx skills@latest add saschb2b/skills --skill godot
npx skills@latest add saschb2b/skills --skill android-compose
npx skills@latest add saschb2b/skills --skill visual-consistency
npx skills@latest add saschb2b/skills --skill okf
npx skills@latest add saschb2b/skills --skill ask-ux
npx skills@latest add saschb2b/skills --skill to-story
npx skills@latest add saschb2b/skills --skill no-slop
npx skills@latest add saschb2b/skills --skill autopilot
npx skills@latest add saschb2b/skills --skill game-design
```

Browse the rendered docs at [saschb2b.com/skills](https://saschb2b.com/skills).

## Skill reference

### Engineering

Code-adjacent work.

| Skill | What it does |
| --- | --- |
| **[audit-actions](./skills/engineering/audit-actions/SKILL.md)** | Audit `.github/workflows/` for the `pull_request_target` misuse that compromised TanStack, Nx, PostHog, and Trivy. Greps every workflow, walks a 10-point severity checklist, names findings, proposes the right fix. |
| **[mcp-server](./skills/engineering/mcp-server/SKILL.md)** | Build, extend, and maintain a Model Context Protocol server across its whole lifecycle against the current spec (`2025-11-25`). Scaffolds the five-layer architecture and picks a transport (stdio vs Streamable HTTP) and a bridge pattern, then carries the post-init weight: writing tool definitions agents read correctly, extending without breaking existing agents, versioning and deprecation, the security threat model (tool poisoning, token passthrough, prompt injection, OAuth 2.1), testing with the MCP Inspector, and publishing to the registry. Deep knowledge ships as a vendored OKF bundle (protocol, tool design, security, maintenance, testing, publishing). |
| **[react-compiler](./skills/engineering/react-compiler/SKILL.md)** | Write and review React as if the Compiler is enabled. Skip manual `useMemo`, `useCallback`, and `React.memo`; audit existing code for stale memoization and the five silent-bail patterns. |
| **[react-stinky](./skills/engineering/react-stinky/SKILL.md)** | Detect React and TypeScript maintainability smells across the whole component, hook, and module, not just its props. Eight pillars: API and prop design (18 sourced categories), state and data flow, effects and lifecycle, component structure and hooks, rendering correctness, accessibility in markup, TypeScript discipline, and a cross-file duplication pass. Rates each Rancid, Funky, or Whiff and proposes the fix with a source. A per-smell guard skips native HTML attributes, library conventions, and intentional patterns. Defers memoization to `react-compiler` and colors to `theme-colors`. Scopes to a codebase, folder, file, or snippet. |
| **[codegen-api](./skills/engineering/codegen-api/SKILL.md)** | Set up typesafe API code generation. Picks `hey-api` (OpenAPI) or `graphql-codegen` / `gql.tada` (GraphQL), then emits options factories and typed documents instead of legacy hooks. |
| **[theme-colors](./skills/engineering/theme-colors/SKILL.md)** | Replace hex codes, `rgba()` literals, and named colors with theme roles (primary, surface, error, and friends) and the `alpha()` helper. Audits existing code for color literals. |
| **[javascript-ecosystem](./skills/engineering/javascript-ecosystem/SKILL.md)** | Default to the current stable majors and their paradigms across the JS/TS ecosystem (React, Angular, Vue, Next.js, Tailwind, TanStack Query, Vite, and more). A changelog index that checks the installed version first. |
| **[godot](./skills/engineering/godot/SKILL.md)** | Develop in Godot against the current stable (4.x): typed GDScript, physics, UI, scenes, the `.tscn`/`.tres` formats, editor tooling, and version-tagged pitfalls. A dated snapshot that re-verifies as it ages. |
| **[android-compose](./skills/engineering/android-compose/SKILL.md)** | Build Android apps Compose-first with Material 3 Expressive as the design direction: strong-skipping-aware Compose, Expressive theming and components (honest about the experimental opt-in), UDF architecture, type-safe Navigation Compose and Navigation 3, the data layer, the Gradle Kotlin DSL build with the Compose compiler plugin and KSP, testing, performance, and version-tagged pitfalls. A dated snapshot that checks the project's versions first. |
| **[visual-consistency](./skills/engineering/visual-consistency/SKILL.md)** | Detect and fix visual and layout consistency defects in rendered UI: uneven card heights in a grid, sibling cards whose internal sections and trailing icons do not line up, off-scale spacing, plus alignment, repeated-element sizing, type scale, table and numeric alignment, overflow, layout shift, and touch and focus sizing. Each smell gets an objective detection signal, a concrete CSS fix (subgrid, equal-height grids, spacing tokens, tabular-nums), a severity, and a Safe-or-Judgment autonomy tag. Pairs with `autopilot` (Safe maps to in-bounds work, Judgment to surface-first). Defers color to `theme-colors` and component code smells to `react-stinky`. |
| **[okf](./skills/engineering/okf/SKILL.md)** | Author, validate, and maintain knowledge for AI agents as conformant Open Knowledge Format (OKF) bundles, Google's vendor-neutral spec (v0.1) of markdown files with YAML frontmatter for portable agent context. A command surface (`init`, `add`, `enrich`, `link`, `index`, `log`, `validate`, `export`, `consume`) plus an implicit mode that conforms knowledge to OKF whenever you document a table, dataset, metric, runbook, playbook, or join path for an agent, export a catalog, or edit an existing bundle. Ships a zero-dependency conformance checker (`okf-validate.mjs`), the full normative spec, per-command playbooks, and worked templates (BigQuery table, metric, runbook). The one hard rule is a non-empty `type` field per concept; everything else is structure consumers tolerate the absence of. |

### Productivity

Process and discipline, not code-specific.

| Skill | What it does |
| --- | --- |
| **[ask-ux](./skills/productivity/ask-ux/SKILL.md)** | Force UX questioning before any UI work. The UI-vs-UX diagnostic, then twelve questions in the order they bite. |
| **[to-story](./skills/productivity/to-story/SKILL.md)** | Reshape a draft Jira or GitHub ticket into a real user story with INVEST-clean acceptance criteria. Splits oversized stories with SPIDR. |
| **[no-slop](./skills/productivity/no-slop/SKILL.md)** | Write and revise human-facing prose in a plain, professional register, stripping the tells that mark text as AI-generated. Five rules (punctuation, structure, vocabulary, stance, formatting), a tells table with fixes, before/after rewrites, and a guard against over-correcting into robotic prose. Catches list-itis and forced enumeration, not just em dashes and slop words. |
| **[autopilot](./skills/productivity/autopilot/SKILL.md)** | Hand off the project and let the agent run on its own: survey, pick one high-value low-risk improvement, verify it, commit it, and loop. Generate-then-rank work selection with anti-churn rails. |
| **[game-design](./skills/productivity/game-design/SKILL.md)** | Analyze, design, critique, and rework video game mechanics and systems. Decompose a game by its iconic mechanic, core dialectic, macro loop, design tensions, ludonarrative resonance, and shared patterns, then design from the experience down. Carries a cross-game pattern catalog (two dozen patterns distilled from 15 dissected games), the transferable design moves with their caveats, the durable frameworks (MDA, core loops, the flow corridor, motivation, depth vs complexity, game feel), the economy and balance theory, and a critique smell catalog, as a vendored OKF bundle. Commands to dissect, pitch, spec a mechanic, design a loop, rework a system, find patterns, and compare. Pairs with `godot` (this is the design thinking, that is the engine code). |

## Why these skills exist

I built each one because the corresponding post wasn't enough. Writing down what to do is the easy part. Running the checklist on every repo, every PR, every ticket, is where I kept failing. The agent runs the checklist for me.

### 1. The security audit nobody runs

> "The dangerous workflow looks benign in review."
>
> from [The pull_request_target Trap](https://saschb2b.com/blog/pull-request-target-trap)

**The problem.** In the year leading up to May 2026, TanStack, Nx, PostHog, Trivy, `tj-actions/changed-files`, and a wave of 500+ targeted forks were all compromised through the same `pull_request_target` misuse. The pattern is a one-line YAML choice. The audit is grep plus ten yes/no questions. Almost nobody runs it.

**The fix:** [`/audit-actions`](./skills/engineering/audit-actions/SKILL.md). The agent greps every workflow, walks the ten-point checklist per match, names findings by severity, and proposes the right fix (switch the trigger, two-workflow pattern, drop the PR-head checkout, scope the cache, pin actions by SHA). Run it on every repo once. Run it again after every supply chain headline.

### 2. The MCP server is the easy 10%, the maintenance is the rest

> "The protocol is simple. The architecture is reusable. The hard part is always the bridge."
>
> from [How to Build an MCP Server](https://saschb2b.com/blog/how-to-build-mcp-server)

**The problem.** Scaffolding an MCP server is a day's work. Everything that decides whether it is any good comes after: tool definitions the agent reads correctly, extending the surface without breaking agents that already depend on it, the security threat model (tool poisoning, token passthrough, prompt injection through tool results), the stdio-to-remote operational cliff, and versioning. That knowledge is scattered across a fast-moving spec, and most servers ship the skeleton and stop.

**The fix:** [`/mcp-server`](./skills/engineering/mcp-server/SKILL.md). The agent stamps out the five layers, picks a transport (stdio vs Streamable HTTP) and bridge pattern, and writes one tool end to end, then carries the post-init weight against the current `2025-11-25` spec: Anthropic's effective-tool rules, the add-a-tool touch points, name-versioning so changes don't break consumers, the security non-negotiables (`execFile` over `exec`, audience-bound tokens, untrusted tool results), testing with the MCP Inspector, and publishing to the registry. The depth ships as a vendored OKF bundle the agent reads on demand.

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

### 9. The prop API your LLM grows by accretion

> "A prop named `data` could be anything. A prop named `selectedUserId` can only be one thing."
>
> from the `cant-maintain` React API-design challenge set

**The problem.** An LLM grows a component's prop surface one request at a time. Each addition is locally reasonable: a `loading` boolean here, an `isError`/`isWarning`/`isSuccess` trio there, a `content` prop because `children` did not come to mind, a `backgroundColor: string` because the design needed one color. Nothing is wrong in isolation. The sum is an API that is hard to read, easy to misuse, and painful to change. The smell is never in the diff that introduced it.

**The fix:** [`/react-stinky`](./skills/engineering/react-stinky/SKILL.md). The agent walks the code against seven maintainability pillars: the eighteen sourced API-design smells (naming, boolean and callback conventions, string-union variants over boolean flags, discriminated unions, controlled and uncontrolled state, children and slot composition, render props, generics, extending HTML, refs, styling, accessibility, server-component boundaries, defaults, JSDoc), then state and data flow, effects and lifecycle, component structure and hooks, rendering correctness, accessibility in markup, TypeScript discipline, and a cross-file duplication pass that catches a component re-implemented elsewhere or a type declared twice. It rates each Rancid, Funky, or Whiff and proposes the concrete fix with a source. A per-smell guard keeps it from nitpicking native HTML attributes, the conventions of whatever library the file already uses, and intentional patterns, so it reads like a careful reviewer rather than a noisy linter. It defers memoization to `react-compiler` and color literals to `theme-colors`.

### 10. The agent knowledge locked in one vendor's catalog

> "LLMs don't get bored, don't forget to update a cross-reference, and can touch 15 files in one pass. The bookkeeping that causes humans to abandon personal wikis is exactly what LLMs are good at."
>
> Andrej Karpathy, quoted in [Google Cloud's OKF announcement](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/)

**The problem.** The context an agent needs to answer "how do I compute weekly active users from our event stream?" is scattered across metadata catalogs with proprietary APIs, wikis, docstrings, and the heads of senior engineers. Every agent builder re-solves the context-assembly problem from scratch, and the knowledge stays locked inside whichever system produced it. Each vendor ships its own catalog, SDK, and knowledge-graph schema, so nothing travels.

**The fix:** [`/okf`](./skills/engineering/okf/SKILL.md). The agent treats knowledge for other agents as Google's Open Knowledge Format: a bundle of plain markdown files with YAML frontmatter, versioned next to the code it describes, with no SDK and no lock-in. The skill is both explicit and ambient. On command it runs a verb surface (`init`, `add`, `enrich`, `link`, `index`, `log`, `validate`, `export`, `consume`); implicitly it conforms any knowledge you author or transform for an agent (a table, a metric, a runbook, a join path, a deprecation notice) to the spec, so it ships as a conformant bundle instead of ad-hoc prose, and it keeps an existing bundle conformant as it changes. A zero-dependency checker enforces the one hard rule, a non-empty `type` per concept, and warns on the soft guidance a permissive consumer is meant to tolerate.

### And two that run the work, not just describe it

Not every skill traces back to a single post. [`/godot`](./skills/engineering/godot/SKILL.md) is a living, dated snapshot of the Godot engine: 22 reference files spanning GDScript, physics, UI, animation, navigation, shaders, and editor tooling, each carrying its own verified date so it re-confirms against the official docs as it ages. [`/autopilot`](./skills/productivity/autopilot/SKILL.md) hands the wheel to the agent: it surveys the repo, picks one high-value low-risk improvement, verifies it, commits it, and loops, with generate-then-rank judgment and anti-churn rails so you review a clean stream of small wins instead of one giant diff.

## Authoring your own

These are personal skills, but the structure is reusable. To write your own:

1. Add a folder under `skills/<bucket>/<slug>/`
2. Drop in a `SKILL.md` with frontmatter (`name`, `description`, optional `date`, `source_post`)
3. Start the `description` with what the skill does, then `Use when ...` triggers. This is the only field the agent reads when deciding to load the skill.
4. Keep `SKILL.md` under ~100 lines. If it bulges, split into sibling files and link to them.

See [CLAUDE.md](./CLAUDE.md) for the full conventions.

## License

MIT.
