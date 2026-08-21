---
type: Library Notes
title: "shadcn/ui"
description: "Base UI is the default base for new inits since July 2026; the CLI is `shadcn` (renamed from `shadcn-ui`)."
tags: [javascript, ui]
generated: { by: claude-code/unversioned, at: 2026-08-20T00:00:00Z }
---
# shadcn/ui

**Verified 2026-08-20.** Not semver-versioned; correctness tracks the current CLI and conventions. Check whether the project is on React 19 and Tailwind v4 first, and which primitive base it uses.

**Current state**: CLI renamed from `shadcn-ui` to `shadcn`; new projects init on React 19 + Tailwind v4 with Base UI as the default primitive base (since Jul 2026). **LLM default bias**: the Tailwind v3 / React 18 generation. HSL CSS variables, no `data-slot`, the old `npx shadcn-ui@latest` command, and `tailwind.config.js` theming.

## The shift
The package and CLI were renamed `shadcn-ui` to `shadcn`. New inits target Tailwind v4 + React 19, with components rewritten to use `@theme`, OKLCH colors, and a `data-slot` attribute on every primitive. The registry has matured into a real distribution platform (multi-file registries, validation, any public GitHub repo as a source, Radix and Base UI blocks). Since July 2026, Base UI is the default base for new inits; Radix stays fully supported via `init -b radix`, and React Aria is a third first-class base (`init -b aria`).

## Stop / Start
| Stop (LLM default) | Start (current shadcn) |
| --- | --- |
| `npx shadcn-ui@latest init` / `add` | `npx shadcn@latest init` / `add` |
| HSL CSS variables (`--background: 0 0% 100%`) | OKLCH tokens emitted by the current init |
| Styling via component internals | Target the `data-slot` attributes on every primitive |
| Assuming React 18 / Tailwind v3 scaffolds | React 19 + Tailwind v4 for new inits |
| Treating it as copy-paste only | The registry system (`registry.json`, `shadcn build`, install from GitHub) |
| Assuming Radix primitives underneath | Base UI is the default base for new inits; pick with `init -b radix` or `init -b aria` |

## Gotchas
- The Tailwind v4 init injects `@import "shadcn/tailwind.css"` into global CSS. Do not reintroduce a config-file-only setup.
- There is no single version number to pin. Correctness is matching the current CLI plus Tailwind v4 / React 19 conventions.
- `shadcn eject` inlines the styles and drops the dependency when you want that.
- Radix is not deprecated. Existing Radix projects need not migrate; an official AI-assisted skill migrates component by component when you choose to.

## Companion
Tailwind v4 paradigm notes in [tailwind.md](./tailwind.md). React 19 notes in [../frameworks/react.md](../frameworks/react.md).

## Agent skills
shadcn/ui ships an official MCP server (ui.shadcn.com/docs/mcp, `pnpm dlx shadcn@latest mcp init`) so agents browse and install registry components. Prefer it over guessing component code.

## Sources
- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default
- https://ui.shadcn.com/docs/tailwind-v4
- https://ui.shadcn.com/docs/changelog
