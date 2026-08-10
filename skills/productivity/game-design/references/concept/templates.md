---
type: Template
title: "Concept Bundle Templates"
description: "Copy-paste scaffolds for every file in a game concept bundle: the pitch index, the seed trio (vision, pillars, loop), an elaboration stub, the macro, scope, and the log."
tags: [game-design, concept, template, scaffold]
generated: { by: claude-code/fable-5, at: 2026-08-10T00:00:00Z }
sources:
  - id: bundle-spec
    resource: "Instantiates the file set defined in concept-bundle.md; section shapes follow the sources cited there and in seeding.md"
    title: "Concept bundle specification"
---

# Concept Bundle Templates

Scaffolds for [seeding](seeding.md) a bundle with the file set from [concept-bundle.md](concept-bundle.md). Replace bracketed placeholders; delete guidance comments. Every file keeps its `type`; dates are ISO 8601; actors follow OKF convention (`human:<id>` for people, `<producer>/<version>` for agents).

## Root `index.md` (the one-screen pitch)

```markdown
---
okf_version: "0.2"
---

# [Game title]

**[X-statement: known anchor plus the fantasy phrase.]**

[Two sentences: what the player does and what it feels like.]

Pillars: [pillar one] · [pillar two] · [pillar three]

- [Vision](vision.md) - X-statement, experience goal, genre, platform, audience.
- [Pillars](pillars.md) - The rules this game follows and what each rejects.
- [Core loop](loop.md) - The verbs and the loop stack, 30 seconds to meta.
- [World](world.md) - Setting, tone, story premise.
- [Cast](characters.md) - Player character, moveset, key figures.
- [Enemies](enemies.md) - Opposition roles and what each demands.
- [Systems](systems.md) - Items, economy, progression, scaling.
- [Art direction](art-direction.md) - Visual target, references, palette.
- [Audio direction](audio-direction.md) - BGM intent, SFX character, silence.
- [Macro](macro.md) - Empty until pre-production exit.
- [Scope](scope.md) - Team, roadmap, risks, the cut list.
```

## `vision.md`

```markdown
---
type: Vision
title: "[Game title] Vision"
description: "[One sentence; the x-statement in prose.]"
status: draft
generated: { by: [actor], at: [ISO datetime] }
---

# Vision

**X-statement.** [Anchor], but [the twist that carries the fantasy].

**Experience goal.** The player should feel [feelings], produced by [what the game does to cause them].

**Genre.** [genre] · **Platform.** [platforms] · **Audience.** [who this is for, one line]

## Why this game, why now

[Three sentences maximum. What exists that proves appetite, and what gap this fills.]
```

## `pillars.md`

```markdown
---
type: Design Pillars
title: "[Game title] Pillars"
description: "The [N] rules every decision must serve, each with what it rejects."
status: draft
generated: { by: [actor], at: [ISO datetime] }
---

# Pillars

Decisions cite pillars by number ("[P2]"). A proposal no pillar supports is creep.

## P1. [One sentence, active, feel-first.]

Rejects: [the genre staples or tempting features this pillar forbids]. USP: [yes/no].

## P2. [...]

Rejects: [...]. USP: [...]
```

## `loop.md`

```markdown
---
type: Core Loop
title: "[Game title] Core Loop"
description: "The player's verbs and the loop stack from moment to meta."
status: draft
generated: { by: [actor], at: [ISO datetime] }
---

# Core loop

**Verbs.** [The three to five things the player literally does.]

| Layer | Cycle | The player does | It yields | Feeds |
| --- | --- | --- | --- | --- |
| Moment | ~30s | [...] | [...] | Session |
| Session | [length] | [...] | [...] | Progression |
| Progression | [...] | [...] | [...] | Meta |
| Meta | [...] | [...] | [...] | The next run |

**The prototype must prove.** [Which layer, played whole, with what feel.]
```

## Elaboration stub (`world.md` shown; same shape for characters, enemies, systems, art-direction, audio-direction)

```markdown
---
type: World
title: "[Game title] World"
description: "[One sentence.]"
status: draft
generated: { by: [actor], at: [ISO datetime] }
---

# World

[Only what the idea already implies. Each claim that serves a pillar cites it.]

## Open questions

- [The questions the seed interview could not answer. Leave them; do not invent.]
```

## `macro.md` (empty at seed)

```markdown
---
type: Design Macro
title: "[Game title] Macro"
description: "Written at pre-production exit, five pages or less, then frozen."
status: draft
generated: { by: [actor], at: [ISO datetime] }
---

# Macro

Not yet written. Prerequisite: the core loop proven whole in a prototype at target quality.

<!-- At pre-production exit: a table of levels/areas x location, mechanics introduced,
     enemies, story beat. Set status to stable and treat further change as an event. -->
```

## `scope.md`

```markdown
---
type: Scope and Risks
title: "[Game title] Scope"
description: "Team fit, roadmap, named risks, and the cut list."
status: draft
generated: { by: [actor], at: [ISO datetime] }
---

# Scope

**Team.** [Who, part/full time.] **Horizon.** [Rough timeline.] **Model.** [Business model, one line.]

## Risks

| Risk | Why it could kill the game | Mitigation | Prototype proves it? |
| --- | --- | --- | --- |
| [The single hardest thing] | [...] | [...] | yes |

## Cut list

Parked branches, reversible in principle. Reopening one needs new evidence, not fondness.

- [date] [What was cut, one line.] Reason logged in log.md.
```

## `log.md` (first entry)

```markdown
# Log

## [ISO date]

* **Creation**: Concept bundle seeded. X-statement and pillars written and signed off
  by [human:<id>]. Open questions recorded in [world](world.md), [systems](systems.md),
  [art direction](art-direction.md). The prototype must prove: [the hard thing].
```

After scaffolding, run `okf-validate --strict` on the bundle and record sign-off as described in [seeding.md](seeding.md); ongoing upkeep is [tending.md](tending.md).
