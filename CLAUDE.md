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

## Adding a skill

When you add a new skill, touch four places. Forgetting any of them silently degrades the install experience.

1. `skills/<bucket>/<slug>/SKILL.md`. The skill itself.
2. `README.md`. Add a line under the matching Reference section. Link the slug to its SKILL.md.
3. `skills/<bucket>/README.md`. Add a line in the bucket index.
4. `.claude-plugin/plugin.json`. Add `./skills/<bucket>/<slug>` to the `skills` array.

## SKILL.md format

```markdown
---
name: <slug>
description: <one or two sentences. Lead with what the skill does, then explicit "Use when ..." triggers. This is the only field the agent reads when deciding to load the skill.>
date: 2026-05-12
source_post: <blog-slug>
---

# <Display Title>

## <Section>

...
```

Rules:

- Keep the body under ~100 lines. If it grows past that, split detail into sibling files (`examples.md`, `reference.md`, etc.) and link to them from SKILL.md. The agent reads SKILL.md eagerly and the siblings only when it needs them. This is "progressive disclosure".
- The `description` field is critical and capped at 1024 characters. It must include trigger phrases the agent will recognize in user prompts.
- `name` in frontmatter must match the folder name.
- The H1 in the body is the human-facing title. The `name` in frontmatter is the slug used everywhere else.
- Dates are ISO 8601 (`YYYY-MM-DD`).
- `source_post` is a blog slug under `saschb2b.com/blog/<slug>` when the skill was distilled from a post. Optional.

## Style

- Tables for decision matrices. Lists for sequential steps. Headings for sections the agent will need to jump to.
- Lead each section with what the agent should do, not background motivation. Background goes after the action.
- Never em or en dashes. Write natural prose with periods, commas, colons, parentheses.

## Distribution

The repo is installed via the [skills.sh](https://skills.sh) registry:

```sh
npx skills@latest add saschb2b/skills
npx skills@latest add saschb2b/skills --skill=<slug>
```

It is also registered as a Claude Code plugin via `.claude-plugin/plugin.json`.
