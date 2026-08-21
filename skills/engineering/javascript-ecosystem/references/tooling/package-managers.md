---
type: Library Notes
title: "Package managers (pnpm / npm / Bun)"
description: "pnpm went security-by-default in v10: no implicit pre/post-install scripts, plus a `minimumReleaseAge` cooldown to dodge zero-day supply-chain attacks."
tags: [javascript, tooling]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# Package managers (pnpm / npm / Bun)

**Verified 2026-08-20.** Check the lockfile and `packageManager` field to see which one the project uses; re-verify if newer than below.

**Current stable**: pnpm 11.22 (Aug 2026), with pnpm 12 (a Rust rewrite) in release candidate; npm 12.0 (Jul 2026), while Node 24 and 26 still bundle npm 11.x; Bun 1.3.x; Yarn 4.17. **LLM default bias**: pnpm 8/9 with implicit lifecycle-script trust, npm 10/11 habits like `npm shrinkwrap`, and Bun framed as "just a fast runtime" rather than a production package manager and test runner.

## The shift
pnpm went security-by-default in v10: no implicit pre/post-install scripts, plus a `minimumReleaseAge` cooldown to dodge zero-day supply-chain attacks. pnpm 11 added native workspace release management (`pnpm change`, `pnpm lane`, `pnpm doctor`). Bun matured into a full toolchain (runtime, package manager, bundler, test runner, shell) with built-in database and S3 clients and a text lockfile.

## Stop / Start
| Stop (LLM default) | Start (current) |
| --- | --- |
| Assuming postinstall scripts "just run" under pnpm | Allow-list them via `onlyBuiltDependencies` / `pnpm approve-builds` |
| Bun as an experimental runtime only | Bun as a drop-in package manager (`bun install`) and test runner (`bun test`) |
| Reaching for Jest or Vitest reflexively in Bun projects | Built-in `bun test` (Jest-compatible API) |
| `npm i -g pnpm` and version drift | Corepack and the `packageManager` field |
| A separate Postgres or Redis driver in Bun apps | Bun's built-in `Bun.sql` and Redis clients where applicable |
| `npm shrinkwrap` / `npm-shrinkwrap.json` | Removed in npm 12; ship `package-lock.json` |
| Reaching for Changesets or Lerna in every pnpm repo | pnpm's own `pnpm change` / `pnpm lane` release commands |

## Gotchas
- pnpm's blocked install scripts can silently break native-module packages until you approve them; a fresh repo may need `pnpm approve-builds`.
- `minimumReleaseAge` can delay legitimately urgent patches; tune it deliberately.
- Bun's lockfile is text (`bun.lock`), not the old binary `bun.lockb`. Bun on Windows still has rougher edges than macOS or Linux.
- pnpm 12 is a Rust rewrite but keeps pnpm 11's commands, flags, settings, and lockfile format, so treat it as an upgrade rather than a migration. It is still a release candidate; ship on 11.x.
- Bun is being rewritten from Zig to Rust (announced Jul 2026). That is an internals change, not a new API surface.
- Yarn's live line is Berry (4.x). There is no Yarn 5, and Yarn 1 "classic" is frozen.

## Companion
[node.md](./node.md) covers the runtime whose releases bundle the npm version documented here.

## Sources
- https://pnpm.io/blog
- https://bun.com/blog
- https://github.com/npm/cli/releases
