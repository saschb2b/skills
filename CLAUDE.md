# Skills Repo Conventions

This repo is a collection of agent skills. Each skill is one self-contained folder under `skills/<bucket>/<slug>/` with a `SKILL.md` inside. Skills work with any coding agent that supports the [skills.sh](https://skills.sh) installer (Claude Code, Cursor, Codex, Cline, Windsurf, OpenCode).

## Layout

```
skills/
  engineering/
    <slug>/SKILL.md
  productivity/
    <slug>/SKILL.md
```

Buckets in use:

- `engineering/` for code-adjacent practice (audits, scaffolds, refactors)
- `productivity/` for process and discipline (planning, writing, design)

The two folders are the on-disk split (operates on a codebase vs operates on a process). They do not affect discovery: the agent auto-invokes a skill by reading its `description`, and skills install by slug. So the folder is just a maintenance home. The root `README.md` browse view groups skills by **domain** instead (Frontend/UI/UX, Game, AI & agents, Writing & workflow, Mobile, Security), which is how a human actually looks for one, and each `SKILL.md` carries a `tags:` facet (see the format below) for finer slicing. At ~16 skills this shallow tree is deliberate. Do not add domain folders until a cluster reaches roughly five skills sharing a tag; grow a folder from an earned tag cluster, not a guess.

## Adding a skill

When you add a new skill, touch five places. Forgetting any of them silently degrades the install experience or leaves the skill untested for invocation.

1. `skills/<bucket>/<slug>/SKILL.md` plus `skills/<bucket>/<slug>/permissions.yaml`. The skill itself. Every skill folder carries a `permissions.yaml` capability manifest (the card's `bom` counts it, so a missing one desyncs the card). For a pure-knowledge skill it is the five-line block used by `no-slop` and `autopilot`. `model: knowledge`, `executes: false`, `network: none`, `shell: false`, `filesystem_writes: false`. Those stay `false` even when the skill's guidance has the agent write files, because that is the agent's capability, not the shipped artifact's.
2. `README.md`. Add a line under the matching **domain group** in the Skill reference section (the listing groups by domain, not by bucket). Link the slug to its SKILL.md.
3. `skills/<bucket>/README.md`. Add a line in the bucket index.
4. `.claude-plugin/plugin.json`. Add `./skills/<bucket>/<slug>` to the `skills` array.
5. `evals/cases/<slug>.yaml`. Invocation eval cases: a few `should_fire` prompts, a couple `should_not_fire`, and `route_to_sibling` cases for any skill it overlaps with. See [evals/README.md](evals/README.md).

Then run `pnpm check` (which runs `node scripts/check-skills.mjs`) and `pnpm eval:validate`. The first enforces every skill rule below (the `: ` and ` #` frontmatter traps, `name` matching the folder, the 1024-char description cap, plugin.json registration, that every relative link inside the skill resolves, and that any `references/` directory is a conformant OKF bundle). The second checks the invocation cases are valid YAML, match the schema, and cover every skill. Both exit non-zero on any failure. Run them before you commit.

The `javascript-ecosystem` skill is a dated snapshot of a fast-moving ecosystem, so it carries extra anti-staleness machinery: a snapshot `date`, a per-notes-file `**Verified YYYY-MM-DD**` stamp, a freshness section in its `SKILL.md`, and `skills/engineering/javascript-ecosystem/MAINTENANCE.md`. Run `node scripts/check-freshness.mjs` to list the oldest entries due for a re-verify against official docs.

## Trust cards (re-signing a changed skill)

Most skills carry a `CARD.md` (a `trust-card` OKF concept binding the skill's content digest, signature, and capability manifest) plus a rendered `CARD.svg`. `cards.json` at the repo root is the aggregate render feed. `pnpm cards:check` gates CI: it rebuilds every card and fails if any is stale, so a skill whose files changed must have its card regenerated, rebuilt, and re-signed before merge.

The lifecycle when you edit a skill's content, in order (finish all content edits first, since the digest is computed over the bundle):

1. **Regenerate the card** so its `target_digest` matches the new content:
   ```sh
   python3 skills/engineering/trust-card/scripts/card.py generate skills/<bucket>/<slug> \
       --identity did:web:saschb2b.com --expires <YYYY-MM-DD>
   ```
   This rewrites `<slug>/CARD.md` and `<slug>/CARD.manifest.json`. Convention for `--expires` is roughly one year out (the existing cards were minted with a 2027-06-29 horizon).
2. **Rebuild the render feed** for that skill: `pnpm cards <slug>` (updates `cards.json` and `<slug>/CARD.svg`). Run bare `pnpm cards` to rebuild all.
3. **Sign the bound digest.** This is Sascha's interactive step and cannot be done from an agent session:
   ```sh
   python3 skills/engineering/trust-card/scripts/card.py sign skills/<bucket>/<slug>/CARD.md
   ```
   With `cosign` on PATH this runs the keyless Sigstore + Rekor flow, which opens a browser for OIDC login and writes `<slug>/CARD.md.sigstore` with the Rekor entry stapled. Add `--key ~/keys/card.key` to use the local ed25519 fallback instead. Card artifacts (`CARD.md`, `CARD.svg`, `CARD.md.sigstore`, hero art) are excluded from the content digest, so signing never re-stales the thing it signs.
4. **Verify and commit the signature separately.** Sascha commits it as `chore: sign <slug> changes` (a distinct commit before merge, per the git workflow):
   ```sh
   python3 skills/engineering/trust-card/scripts/card.py verify skills/<bucket>/<slug>/CARD.md \
       --bundle skills/<bucket>/<slug>
   pnpm cards:check   # what CI enforces; stays red until the signed card is committed
   ```

The full command reference and the layer-by-layer trust model live in `skills/engineering/trust-card/SKILL.md` and its `references/layers.md`.

`CARD.svg` has a permanent per-skill visual identity. Existing cover seeds are
frozen in `scripts/card-visual-identity.mjs`; never rotate one when the skill's
content or digest changes. New skills derive their seed from the stable slug.
Palette, composition, layout, typography, and base geometry come from that
identity. File count, word count, and heading count may only make the bounded
edition-level adjustments defined there. Keep the palette, style, and font
arrays append-only, then run `pnpm cards:test` when changing card rendering.

## Skill-invocation evals

The `description` is the only field the agent reads when deciding to auto-invoke a skill, so a reword can silently stop the agent reaching for it, or make it grab a sibling instead. The harness in `evals/` is the regression test. Run it on your own whenever you touch a skill:

- After adding a skill or editing any `description`, run `pnpm eval:validate`. It is fast, needs no model and no key, and fails on a broken case file or a skill with no cases.
- When a `description` changed, also run the full invocation eval to confirm the model still routes correctly. It needs no API key, because the classification is an agent text run. `pnpm eval` validates and writes `evals/results/manifest.json`; classify the prompts with a subagent (blind, against a stripped `{id, prompt}` view so the answers do not leak) writing `evals/results/answers.json`; then `pnpm eval:score` prints recall, specificity, disambiguation, and a findings list. Steps are in [evals/README.md](evals/README.md).

A 100% table means the descriptions separate cleanly under a focused router, not that auto-invocation is guaranteed mid-conversation. Treat the disambiguation column (does the intended sibling win on an overlapping prompt) as the signal that two descriptions have clean boundaries.

## SKILL.md format

```markdown
---
name: <slug>
description: <one or two sentences. Lead with what the skill does, then explicit "Use when ..." triggers. This is the only field the agent reads when deciding to load the skill.>
tags: [<domain>, <task-type>]
date: 2026-05-12
source_post: <blog-slug>
---

# <Display Title>

## <Section>

...
```

Rules:

- Keep the body under ~100 lines. If it grows past that, move the detail into a `references/` subdirectory and link to it from SKILL.md. The agent reads SKILL.md eagerly and the reference files only when it needs them. This is "progressive disclosure". That `references/` directory is a vendored OKF bundle (see "Vendored knowledge as OKF bundles" below), so it ships in the same install and adds no dependency.
- The `description` field is critical and capped at 1024 characters. It must include trigger phrases the agent will recognize in user prompts.
- **Never put `: ` (colon followed by a space) inside any frontmatter value.** YAML parses it as a key/value separator inside a plain scalar, gray-matter throws, and the skill is silently dropped from the build. Use a period, semicolon, dash, or rephrase. Colons in URLs, code (`docker:latest`), or compound words without trailing space are fine.
- **Never put ` #` (a space followed by `#`) inside any frontmatter value.** YAML treats `#` as a comment marker when preceded by whitespace; the rest of the line is silently dropped from the parsed value. If you must mention hex codes in a description, do it in the body of SKILL.md instead.
- `name` in frontmatter must match the folder name.
- The H1 in the body is the human-facing title. The `name` in frontmatter is the slug used everywhere else.
- Dates are ISO 8601 (`YYYY-MM-DD`).
- `source_post` is a blog slug under `saschb2b.com/blog/<slug>` when the skill was distilled from a post. Optional.
- `tags` is an optional inline list of lowercase-hyphen facets, domain first then task-type (`tags: [frontend, react, review]`). It is advisory metadata for browsing and for deciding when a cluster has earned its own folder, not something the agent reads to route. Use the inline flow form `[a, b, c]` (a block list of `- item` lines also parses, since the frontmatter checker skips indented lines); the `: ` and ` #` traps still apply, so keep tag values plain.

## Vendored knowledge as OKF bundles

When a skill carries substantial reference knowledge (detection catalogs, per-area notes, before/after guidance), that knowledge lives in `<skill>/references/` as a conformant [Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog) bundle. SKILL.md stays the thin procedure and links into it.

Why a bundle, not loose files. A bundle is just markdown with frontmatter, so it ships inside the skill with no extra install and no dependency. Formatting the knowledge as OKF makes it navigable (progressive disclosure via `index.md`), portable (any agent or viewer reads it, no SDK), and citable, and it lets the knowledge be promoted to a standalone bundle later without a rewrite. Use it when the reference material is big enough to bloat SKILL.md or is reused; a small skill keeps its knowledge inline.

**Always work on a bundle through the `okf` skill, never freehand.** This is a standing instruction for any agent in this repo, covering every `references/` bundle and any standalone bundle authored here:

- **Creation.** New bundle or new concept file: invoke the `okf` skill and follow its `init`/`add` playbooks (descriptive `type`, recommended frontmatter, structural body, the sharpest markdown form per fact).
- **Enrichment.** Growing a bundle from a source or deepening one: run the skill's `enrich` flow including the entity pass, so every load-bearing name the documents mention but never explain gets its own linked concept.
- **Editing.** Any edit to an existing bundle triggers the skill's implicit-mode bookkeeping: refresh the concept's `timestamp`, append a dated `log.md` entry (heading is the bare ISO date), regenerate the affected `index.md`, and add a link with the relationship named in prose whenever an edit creates one.
- **Validation.** Finish every bundle-touching change with the skill's `validate` command in strict mode (the producer gate: zero orphans, zero broken links), not just the default conformance check that CI runs. `pnpm check` passing is necessary, not sufficient.

Rules for a `references/` bundle:

- Every concept file carries YAML frontmatter with a non-empty `type` (the one hard OKF requirement). Recommended: `title`, a one-sentence `description`, `tags`, and an ISO 8601 `timestamp`. The `: ` and ` #` frontmatter traps apply here too, so quote any value that needs them.
- A root `references/index.md` declares `okf_version: "0.1"` and lists each concept with its description. It is the only `index.md` in the bundle allowed frontmatter.
- Reserved filenames `index.md` and `log.md` are never concept files.
- Cross-link with relative or bundle-absolute (`/foo.md`) paths, and name the relationship in the prose, not the link.

Validate one bundle directly with the vendored checker; after producing or editing a bundle, run it with `--strict` (the producer gate, turning orphans and broken concept links into failures):

```sh
node skills/engineering/okf/okf-validate.mjs skills/<bucket>/<slug>/references --strict
```

`check-skills.mjs` runs the non-strict form for every skill that has a `references/` directory and fails on a non-conformant bundle, so the hard rule is enforced on every commit; the strict pass is the agent's own bar when touching a bundle.

`javascript-ecosystem` follows this layout too: its ~90 per-tool notes live under `references/<category>/`. On top of the OKF bundle it carries the dated-snapshot machinery (a per-note `**Verified YYYY-MM-DD**` stamp, `scripts/check-freshness.mjs`, and `MAINTENANCE.md`), because a fast-moving ecosystem snapshot needs explicit re-verification.

## Style

- Tables for decision matrices. Lists for sequential steps. Headings for sections the agent will need to jump to.
- Lead each section with what the agent should do, not background motivation. Background goes after the action.
- Never em or en dashes. Write natural prose with periods, commas, colons, parentheses.

## Distribution

The repo is installed via the [skills.sh](https://skills.sh) registry:

```sh
npx skills@latest add saschb2b/skills
npx skills@latest add saschb2b/skills --skill <slug>
```

It is also registered as a Claude Code plugin via `.claude-plugin/plugin.json`.
