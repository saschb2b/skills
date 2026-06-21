---
name: game-design
description: Analyze, design, critique, and rework video game mechanics and systems, grounded in a cross-game pattern catalog and established design frameworks (MDA, core loops, flow, player motivation, game feel, economies, balance). Decompose a game by its iconic mechanic, core dialectic, macro loop, design tensions, ludonarrative resonance, and the patterns it shares with other games. Use when discussing game design ideas, concepts, reworks, or issues; when designing or balancing a mechanic, progression, economy, loop, or reward system; when asking whether a mechanic is fun, too grindy, or has a dominant strategy; or whenever the agent is self-authoring game mechanics and design decisions while building a game. Offers commands to dissect, pitch, spec a mechanic, design a loop, rework a system, find patterns, and compare games. Pairs with godot for implementation; this skill is the design thinking, not the engine code.
tags: [game, design]
date: 2026-06-21
source_post: game-mechanics
---

# Game Design

A designer's reference, written from play. Use it to think about what to design and why it works, not how to implement it in an engine (that is `godot`). It carries a cross-game pattern catalog distilled from 15 dissected games, plus the durable design frameworks, and a stance: opinionated but anti-dogmatic. Both work, for different games. Pick a stance, and be ready to argue with this one.

This fires whenever game design is on the table: a new concept, a mechanic that feels off, a rework, a balance question, "is this fun / too grindy / a dominant strategy", or the agent making its own design calls while building a game. The depth lives in the OKF bundle in [references/](./references/index.md); this file is the procedure.

## The lens: how to read any game or mechanic

Run anything you are analyzing through these axes (the full method is in [method.md](./references/method.md)):

- **Iconic mechanic.** The one phrase that names this game's mechanical identity.
- **Core dialectic.** The single tension it restates at every scale ("risk vs reward, fractally"; "greed vs gold"; "friction over convenience").
- **Macro loop.** The cycle the player actually runs, moment to moment to session.
- **Mechanic systems.** Each major system, described neutrally.
- **Design tensions.** What the developers wrestled with, in their own words. Dev quotes are gold.
- **Ludonarrative resonance.** Describe the loop without the fiction. Does it still read as a story about this character? This is a lens to hold against any mechanic, not a goal to force.
- **Patterns.** The reusable design moves it shares with other games (see [patterns.md](./references/patterns.md)).
- **Lessons.** What is worth stealing, and at what cost.

## Commands

Invoke as `/game-design <command> [target]`.

| Command | What it does |
| --- | --- |
| `dissect` | Run the full lens on an existing game or mechanic: iconic mechanic, core dialectic, macro loop, systems, tensions, resonance, patterns, lessons to steal. |
| `pitch` | Develop a new concept from scratch. Pick the iconic mechanic and core dialectic, sketch the macro loop, choose the patterns, name the risks. |
| `mechanic` | Spec or refine one mechanic: the problem it solves, the dialectic it serves, its budget or economy, its telegraph, its pitfalls. |
| `loop` | Design or critique the loop stack (moment-to-moment, session, progression, meta). Check each layer feeds the next and the bare core is fun on its own. |
| `rework` | Diagnose a flat or broken system (no opportunity cost, a dominant strategy, a missing telegraph, a treadmill) and propose targeted fixes. |
| `critique` | Adversarial design review against the catalog and the frameworks. Name the pitfalls, dominant strategies, and ethics smells. |
| `patterns` | Surface the patterns relevant to a design problem and contrast how different games solve it. |
| `compare` | Contrast two games or mechanics on a chosen axis, variants-table style. |

## Design from the experience down, not the feature up

The load-bearing framework is MDA: **Mechanics give rise to Dynamics, which produce Aesthetics** (the felt experience). The designer authors only mechanics, but the player meets the game in the opposite order, Aesthetics first. So start from the experience you want, derive the dynamics that produce it, then build the smallest mechanics that yield those dynamics. You cannot code "fun" directly; you locate the broken feedback loop and tune the mechanical lever. Frameworks, the eight kinds of fun, and the motivation models are in [frameworks.md](./references/frameworks.md).

## Core moves

The most transferable moves from the catalog ([principles.md](./references/principles.md) has the full set with caveats):

- **Pick one dialectic and restate it fractally.** Every screen should be the same trade-off in a new costume. New players learn the game once and apply it everywhere.
- **Meta-progression unlocks variety, not power.** The next run should be more interesting, not easier. (Power-ramp metas like Hades are the deliberate exception, for games that want you to eventually win.)
- **Costed power forces commitment.** Run-defining loot with a real drawback gives each run a direction; uncosted upgrades flatten every run into the same kitchen sink.
- **Loadout as budget.** Power lives inside a fixed budget (slots, points, cells, hand size); more of one means less of another. A small slot count over a large pool produces identity.
- **Telegraph honestly.** Show what is coming so combat is a decision, not a coin flip, and never let a telegraph lie. A lying telegraph is worse than none.
- **Subtract.** A tighter, smaller kit usually beats a bigger one. Make skipping a real option and removing as rewarding as adding.

## The loop stack and the flow corridor

A core loop is `act → feedback → reward → repeat`, nested by timescale: moment-to-moment, session, progression, meta. The output of an inner loop is the fuel of the outer one. Two tests: the bare moment-to-moment loop must be fun stripped of all progression, and every loop must feed a larger one or it dead-ends. Keep difficulty in the flow corridor, where challenge tracks rising skill: the flow channel, Koster's "fun is learning", the sawtooth difficulty curve, and "fair challenge" all describe the same band. Detail in [frameworks.md](./references/frameworks.md).

## Critique smells

When a design feels off, look for these (detection signals and fixes in [critique.md](./references/critique.md)):

- **Dominant strategy.** One line always wins, so the choice is not a choice. Make it situational, add a counter, or fix the incentive (players will find any crack).
- **No opportunity cost.** The player can take everything; nothing is sacrificed. Add a budget.
- **Hollow loop.** The reward does not feed the next tier, or the feedback is illegible. Close the loop.
- **Treadmill / power creep.** Numbers rise but nothing changes; new content devalues old. Prefer horizontal options and capability over magnitude.
- **Complexity over depth.** Rules to learn outnumber the decisions they create. Cut or fold; depth comes from interaction, not addition.
- **Ethics smell.** Engagement engineered against the player's interest (appointment grind, monetized randomness, social-graph extraction). The test: would the player have more fun fulfilling this contingency than not?

## Stance

Opinionated, grounded in play, anti-dogmatic. Resonance is diagnostic, not prescriptive: honestly-orthogonal games (Slay the Spire, Balatro) work because they do not force the fiction. Scale the math to your team, do not scale up: a 4x4 grid is enough, a small world needs ten points of interest, not a hundred. Design more than you ship and prune ruthlessly. Never em or en dashes.

## Reference bundle

- [method.md](./references/method.md) — the dissection lens, the concept-page anatomy, the resonance diagnostic.
- [patterns.md](./references/patterns.md) — the cross-game pattern catalog (19 patterns, by category, with exemplars and pitfalls).
- [principles.md](./references/principles.md) — the load-bearing design moves worth stealing, with their caveats.
- [frameworks.md](./references/frameworks.md) — MDA, core loops and skill atoms, flow, player motivation, depth vs complexity, game feel.
- [systems.md](./references/systems.md) — economies, feedback loops, balance, randomness, reward schedules, and the ethics line.
- [critique.md](./references/critique.md) — the design-review smell catalog and the rework procedure.

## Source

Distilled from Sascha Becker's [game-mechanics](https://github.com/saschb2b/game-mechanics) knowledge base (15 games dissected, 19 cross-game concept pages), grounded in the standard design literature cited throughout the bundle (MDA, Koster, Cook, Schell, Swink, Adams and Dormans, Schreiber, Sirlin).
