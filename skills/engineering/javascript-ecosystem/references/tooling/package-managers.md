---
type: Library Notes
title: "Package managers (pnpm / npm / Bun)"
description: "pnpm went security-by-default in v10 and shipped its Rust rewrite as v12 (Aug 2026); Bun 1.4 finished its own move to Rust and grew a built-in React Compiler and parallel test runner."
tags: [javascript, tooling]
generated: { by: claude-code/unversioned, at: 2026-09-09T00:00:00Z }
---
# Package managers (pnpm / npm / Bun)

**Verified 2026-09-09.** Check the lockfile and `packageManager` field to see which one the project uses; re-verify if newer than below.

**Current stable**: pnpm 12 (12.0 Aug 26, 2026; 12.3 Sep 2026), the Rust rewrite, with 11.25 as the last JavaScript line; npm 12.0 (Jul 2026), while Node 24 and 26 still bundle npm 11.x; Bun 1.4 (Aug 20, 2026); Yarn 4.18. **LLM default bias**: pnpm 8/9 with implicit lifecycle-script trust, npm 10/11 habits like `npm shrinkwrap`, and Bun framed as "just a fast runtime" rather than a production package manager and test runner.

## The shift
pnpm went security-by-default in v10: no implicit pre/post-install scripts, plus a `minimumReleaseAge` cooldown to dodge zero-day supply-chain attacks. pnpm 11 added native workspace release management (`pnpm change`, `pnpm lane`, `pnpm doctor`). pnpm 12 is the same CLI rewritten in Rust; it keeps pnpm 11's commands, flags, settings, and lockfile format, so the project frames it as an upgrade rather than a migration. Bun matured into a full toolchain (runtime, package manager, bundler, test runner, shell) with built-in database and S3 clients and a text lockfile; 1.4 is the first release of Bun's Rust port and adds a built-in React Compiler, `bun test --parallel`, and `bun run --parallel`.

## Stop / Start
| Stop (LLM default) | Start (current) |
| --- | --- |
| Assuming postinstall scripts "just run" under pnpm | Allow-list them via `onlyBuiltDependencies` / `pnpm approve-builds` |
| `pnpm install --resolution-only` in CI to surface peer issues | `pnpm peers check` (the flag was removed in pnpm 12 and now fails the command) |
| Bun as an experimental runtime only | Bun as a drop-in package manager (`bun install`) and test runner (`bun test`) |
| Reaching for Jest or Vitest reflexively in Bun projects | Built-in `bun test` (Jest-compatible API; `--parallel`, `--shard`, `--changed` in 1.4) |
| `npm i -g pnpm` and version drift | Corepack and the `packageManager` field |
| A separate Postgres or Redis driver in Bun apps | Bun's built-in `Bun.sql` and Redis clients where applicable |
| `npm shrinkwrap` / `npm-shrinkwrap.json` | Removed in npm 12; ship `package-lock.json` |
| Reaching for Changesets or Lerna in every pnpm repo | pnpm's own `pnpm change` / `pnpm lane` release commands |
| `sharp` for image resizing in a Bun service | `Bun.Image` (built in since 1.4) |

## Gotchas
- pnpm's blocked install scripts can silently break native-module packages until you approve them; a fresh repo may need `pnpm approve-builds`.
- `minimumReleaseAge` can delay legitimately urgent patches; tune it deliberately.
- pnpm 12 behavior deltas beyond the removed flag: globally installed `node`, `deno`, and `bun` shims run the version the current project pins (`globalShims` defaults on); git dependencies on GitHub, GitLab, and Bitbucket always resolve through HTTPS URLs, so private SSH access needs machine-level git config; `pnpm add -g yarn` installs the real tool; lockfiles order cyclic dependency graphs deterministically; `packageImportMethod: auto` tries hardlinks before reflinks on Linux; `engineStrict` fails installs on incompatible engines even under optional subtrees; unknown keys in `pnpm-workspace.yaml` error instead of being ignored; the pnpmfile `filterLog` hook is deprecated and ignored.
- Bun's lockfile is text (`bun.lock`), not the old binary `bun.lockb`. Bun on Windows still has rougher edges than macOS or Linux.
- Bun 1.4 (the Rust port) documents no breaking changes; the new APIs (`Bun.Image`, `Bun.WebView`, `Bun.markdown`, `Bun.cron()`, `Bun.Terminal`, HTTP/3 in `Bun.serve()` and `fetch()`) are additive and several are marked experimental.
- Yarn's live line is Berry (4.x). There is no Yarn 5, and Yarn 1 "classic" is frozen.

## Companion
[node.md](./node.md) covers the runtime whose releases bundle the npm version documented here.

## Sources
- https://pnpm.io/blog/releases/12.0
- https://pnpm.io/blog/whats-different-in-pnpm-12
- https://bun.sh/blog/bun-v1.4
- https://github.com/npm/cli/releases
