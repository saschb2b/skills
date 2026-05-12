---
name: audit-actions
description: Audit a repository's GitHub Actions workflows for unsafe pull_request_target usage that can lead to supply chain compromise. Use when the user asks to audit workflows, review CI/CD security, check pwn request risk, harden Actions, or after a supply chain incident in a dependency. Also use proactively when reviewing any PR that touches .github/workflows/.
date: 2026-05-12
source_post: pull-request-target-trap
---

# Audit pull_request_target

## What this skill catches

The `pull_request_target` + PR-head checkout combination is the entire bug class behind the public compromises of TanStack (May 2026), Nx (Aug 2025), PostHog (Nov 2025), Trivy (Feb 2026), tj-actions/changed-files (Mar 2025), and the prt-scan campaign (Mar 2026). Permission flags do not prevent it. SLSA provenance does not prevent it. Cache writes bypass `permissions: contents: read` entirely.

If a workflow uses `pull_request_target` AND checks out the PR head, attacker-controlled code runs on a runner that holds the base repo's `GITHUB_TOKEN`, has access to declared secrets, and can mint OIDC tokens for trusted publishing.

## Run

1. **Find every usage.** Locally: `grep -rn "pull_request_target" .github/workflows/`. Org-wide: `gh search code "pull_request_target" --owner $ORG --extension yml`.
2. **For each match, ask in order. Stop at the first "yes" — that's a finding.**
   - Does the workflow check out the PR head (`actions/checkout` with `ref: ${{ github.event.pull_request.head.sha }}` or similar)? **CRITICAL.**
   - Does it run any contributor-supplied code (`pnpm install`, `npm test`, `make build`, `actions/setup-*`, a script committed in the PR)? **CRITICAL.**
   - Does it write to the Actions cache (no `lookup-only: true` on `actions/cache`)? **HIGH.** Cache writes use a runner-internal token and bypass workflow permissions; a poisoned cache is restored by `release.yml` later.
   - Does it use third-party actions pinned by tag (`@v1`, `@main`) rather than commit SHA? **HIGH.**
   - Does it set `id-token: write`? **HIGH** in combination with any of the above — OIDC tokens are scraped from runner memory, not stolen from secrets.
   - Is the trigger even necessary? Most legitimate uses (labelling, commenting, metadata) work fine with `pull_request`.

## Findings template

For each workflow, produce:

```
file: .github/workflows/<name>.yml
trigger: pull_request_target
findings:
  - <CRITICAL|HIGH|MEDIUM>: <what>
recommendation: <one of below>
```

## Fixes, in order of preference

1. **Switch to `pull_request`.** Default answer. If the workflow doesn't need write access to the base repo or secrets, this closes the entire bug class.
2. **Two-workflow pattern (`pull_request` + `workflow_run`).** Untrusted code runs in a `pull_request` workflow with no secrets and no write permissions, writes its output as an artifact, and a `workflow_run` workflow triggered on completion reads the artifact and does the privileged work. The trust boundary becomes the artifact handoff — auditable in YAML.
3. **Remove the PR-head checkout.** If the workflow legitimately needs `pull_request_target` (labelling, metadata), do not check out or execute the PR's code at all.
4. **Disable cache writes from untrusted contexts.** Use `actions/cache/restore@v4` only; do not run the save step on fork-triggered builds. Or scope cache keys with attacker-derived prefixes so they cannot collide with release-pipeline keys.
5. **Pin every third-party action by full commit SHA**, not tag. `tj-actions/changed-files`' compromise propagated to thousands of repos because they used `@v44`.
6. **Minimize the publish workflow's surface.** If `id-token: write` must exist, the workflow with it should do nothing except verify pre-built artifacts and publish — no third-party actions, no postinstall scripts, no untrusted paths.

## What this skill does NOT cover

- npm-side hardening (2FA / FIDO2, fine-grained tokens, `minimumReleaseAge`). Out of scope.
- Self-hosted runner abuse — different threat model.
- Script injection via `${{ github.event.pull_request.title }}` and friends. Related but separate; flag for follow-up.

## Source

Based on [The pull_request_target Trap](https://saschb2b.com/blog/pull-request-target-trap) — full attack anatomy of the May 2026 TanStack incident and the year of prior cases.
