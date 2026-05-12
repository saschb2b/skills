# React Compiler Lint Setup

Since late 2025, the compiler's lint rules live in `eslint-plugin-react-hooks` v6+. The standalone `eslint-plugin-react-compiler` was deprecated and merged in. If your project uses `eslint-config-next` v16+ or any modern framework preset that pulls in `eslint-plugin-react-hooks` v7, the plugin is already loaded transitively. No additional install.

## Strict configuration

Drop into `eslint.config.mjs`:

```js
{
  rules: {
    "react-hooks/unsupported-syntax": "error",
    "react-hooks/exhaustive-deps": "error",
    "react-hooks/incompatible-library": "error",
    "react-hooks/todo": "error",
    "react-hooks/syntax": "error",
    "react-hooks/capitalized-calls": "error",
    "react-hooks/rule-suppression": "error",
    "react-hooks/no-deriving-state-in-effects": "error",
    "react-hooks/void-use-memo": "error",
    "react-hooks/automatic-effect-dependencies": "error",
    "react-hooks/memoized-effect-dependencies": "error",
    "react-hooks/hooks": "error",
  },
}
```

The first three promote `recommended` rules from `warn` to `error`. The rest are compiler rules that ship off by default.

## What each rule catches

| Rule | What it catches |
| --- | --- |
| `unsupported-syntax` | Components silently bailed for syntax reasons. The single most important rule. |
| `todo` | Broader compiler-internal lowering failures. Undocumented on react.dev, but the rule that surfaces the most. |
| `rule-suppression` | Every `"use no memo"`. Use the output as a TODO list. |
| `exhaustive-deps` | Classic dep-array correctness. Elevated because the compiler relies on it. |
| `incompatible-library` | Hooks called from libraries that violate the Rules of React. |
| `no-deriving-state-in-effects` | Derived state computed in effects, which the compiler cannot fold cleanly. |
| `void-use-memo` | `useMemo` calls whose result is unused. |
| `syntax`, `capitalized-calls`, `hooks` | Various Rules-of-React enforcement. |
| `automatic-effect-dependencies`, `memoized-effect-dependencies` | Effect dependency cleanup the compiler can verify. |

## Silent skips cascade

Once a component bails, downstream rules sometimes do not surface their own findings on the same component. The analysis stops at the first failure. Fixing an upstream skip can immediately reveal a second issue.

Treat lint cleanup as iterative, not one-shot. The first run gives the count. Subsequent runs give the truth.

## Why `recommended` is not enough

`recommended` ships `unsupported-syntax` at `warn`. CI configurations that fail only on `error` skim past it. The result: silent compiler bails land in production as re-render regressions nobody profiled for. Promote to `error` to make silent skips visible at build time.

## Source

Configuration from [The React Compiler at Eighteen Months](https://saschb2b.com/blog/react-compiler-year-in-review).
