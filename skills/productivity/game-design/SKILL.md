---
name: game-design
description: Analyze, design, critique, balance, and rework video game mechanics, systems, and interface, grounded in a cross-game pattern catalog and design frameworks (MDA, core loops, flow, game feel, economy). The first stop for any design-touching change or discussion, including mid-implementation in an engine like Godot. Use when designing, balancing, brainstorming, or reworking a mechanic, progression, economy, loadout, inventory, loot, shop, enemy or difficulty scaling, reward, menu, or UI system; when tuning drop rates, prices, curves, or scaling; when asking whether something is fun, too grindy, or has a dominant strategy; when designing menus, HUD, transitions, onboarding, dialogue, guidance, input prompts, or accessibility; when capturing, pitching, or iterating a game idea, concept, vision, design pillars, or GDD, persisted as a living concept bundle; or when self-authoring game systems while building one. Rides alongside godot, which writes the engine code, while this decides what that code should do.
tags: [game, design]
date: 2026-08-10
source_post: game-mechanics
---

# Game Design

A designer's reference, written from play. Use it to decide what to design and why it works; `godot` handles how to implement it in the engine, and on a change that is both at once, run them together rather than letting one defer to the other. It carries a cross-game pattern catalog distilled from 17 dissected games, the durable design frameworks, an interface and UX layer (menus, screens, teaching, dialogue, feedback, accessibility), and a stance: opinionated but anti-dogmatic. Both work, for different games. Pick a stance, and be ready to argue with this one.

This fires whenever game design is on the table: a new game idea that needs a concept and a home for it, a mechanic that feels off, a rework, a balance question, a menu or HUD or tutorial or dialogue screen that needs designing, "is this fun / too grindy / a dominant strategy", or the agent making its own design and interface calls while building a game. The depth lives in the OKF bundle in [references/](./references/index.md); this file is the procedure.

## Reach for this first

This is the first stop on any design-touching change or discussion, not a reference of last resort, and not only when someone says the word "design". Before you commit to a balance number, an enemy or difficulty scaling curve, a drop rate, a shop price, an economy value, an inventory rule, a menu flow, or a progression gate, run it through the lens and the patterns here instead of improvising from training data. This holds mid-implementation: when you are editing GDScript or a scene and the change encodes a design decision, the engine work and this design work run together, so load this and reason from it before you answer. If you catch yourself about to give a design answer from general knowledge, stop and open the relevant reference file first. That habit is the whole point of the skill, and it is what keeps it influential across a long coding session rather than firing once and fading.

To make this automatic in a real game project (so it is consulted on every design-touching change without anyone asking), wire it on the project side: a path-scoped `CLAUDE.md` rule, a `paths:`-activated rule, or a `UserPromptSubmit` hook that nudges consulting this skill on design keywords. Run `/game-design wire` to scaffold these into the current project; the mechanics and copy-paste snippets are in [INTEGRATION.md](./INTEGRATION.md).

## The lens: how to read any game or mechanic

Run anything you are analyzing through these axes (the full method is in [method.md](./references/design/method.md)):

- **Iconic mechanic.** The one phrase that names this game's mechanical identity.
- **Core dialectic.** The single tension it restates at every scale ("risk vs reward, fractally"; "greed vs gold"; "friction over convenience").
- **Macro loop.** The cycle the player actually runs, moment to moment to session.
- **Mechanic systems.** Each major system, described neutrally.
- **Design tensions.** What the developers wrestled with, in their own words. Dev quotes are gold.
- **Ludonarrative resonance.** Describe the loop without the fiction. Does it still read as a story about this character? This is a lens to hold against any mechanic, not a goal to force.
- **Patterns.** The reusable design moves it shares with other games (see [patterns.md](./references/design/patterns.md)).
- **Lessons.** What is worth stealing, and at what cost.

## Commands

Invoke as `/game-design <command> [target]`.

| Command | What it does |
| --- | --- |
| `dissect` | Run the full lens on an existing game or mechanic: iconic mechanic, core dialectic, macro loop, systems, tensions, resonance, patterns, lessons to steal. |
| `pitch` | Develop a new concept from scratch. Pick the iconic mechanic and core dialectic, sketch the macro loop, choose the patterns, name the risks. Persist the result with `concept seed`. |
| `concept` | Seed, grow, and tend the game's concept bundle, the OKF home of its identity kept in the game repo. `concept seed` runs the elicitation interview and scaffolds the bundle (vision, pillars, loop written for real; world, cast, enemies, systems, art, audio, scope as stubs). `concept check` tests proposed work against the seed before any code. `concept tend` folds decisions in, prunes branches with recorded reasons, and keeps the OKF bookkeeping. See [the concept area](./references/concept/index.md). |
| `mechanic` | Spec or refine one mechanic: the problem it solves, the dialectic it serves, its budget or economy, its telegraph, its pitfalls. |
| `loop` | Design or critique the loop stack (moment-to-moment, session, progression, meta). Check each layer feeds the next and the bare core is fun on its own. |
| `rework` | Diagnose a flat or broken system (no opportunity cost, a dominant strategy, a missing telegraph, a treadmill) and propose targeted fixes. |
| `critique` | Adversarial design review against the catalog and the frameworks. Name the pitfalls, dominant strategies, and ethics smells. |
| `patterns` | Surface the patterns relevant to a design problem and contrast how different games solve it. |
| `compare` | Contrast two games or mechanics on a chosen axis, variants-table style. |
| `interface` | Design or review a screen, menu, HUD, dialogue, or feedback surface against the UX foundations, the diegesis matrix, and the readability floor. |
| `teach` | Design how the game onboards and teaches a mechanic: the first-session ramp, teaching through level design, the introduce-develop-twist-test shape, and the hint stance. |
| `wire` | Set up project-side auto-triggering in the current game project so this skill is consulted on every design-touching change. Scaffolds a CLAUDE.md rule, a `paths:`-scoped rule, and a `UserPromptSubmit` hook, following [INTEGRATION.md](./INTEGRATION.md). |

## The concept bundle: where the soul lives

A game's identity deserves a home before any code exists. The `concept` command builds and tends one: a small OKF bundle in the game's own repo holding the seed trio that must be written for real (vision with its x-statement, three to five pillars each naming what it rejects, the core loop stack) plus draft stubs for world, cast, enemies, systems, art direction, audio direction, and scope. The trio gets a human sign-off, and from then on every proposed feature is checked against it: name the pillar it serves, the loop layer it feeds, and the critique smells it survives, or it goes to the cut list with a logged reason. The bundle is tended like a bonsai, grown and pruned deliberately with every cut recorded, and the macro (level structure and contents) is deliberately absent until the loop is proven whole in a prototype. Anatomy in [concept-bundle.md](./references/concept/concept-bundle.md), the interview in [seeding.md](./references/concept/seeding.md), the lifecycle in [tending.md](./references/concept/tending.md), scaffolds in [templates.md](./references/concept/templates.md).

## Design from the experience down, not the feature up

The load-bearing framework is MDA: **Mechanics give rise to Dynamics, which produce Aesthetics** (the felt experience). The designer authors only mechanics, but the player meets the game in the opposite order, Aesthetics first. So start from the experience you want, derive the dynamics that produce it, then build the smallest mechanics that yield those dynamics. You cannot code "fun" directly; you locate the broken feedback loop and tune the mechanical lever. Frameworks, the eight kinds of fun, and the motivation models are in [frameworks.md](./references/design/frameworks.md).

## Core moves

The most transferable moves from the catalog ([principles.md](./references/design/principles.md) has the full set with caveats):

- **Pick one dialectic and restate it fractally.** Every screen should be the same trade-off in a new costume. New players learn the game once and apply it everywhere.
- **Build on one verb, then deepen it.** Make every enemy, level, and item pose a question about one core verb, and let upgrades extend it rather than add parallel ones. One polished ability beats five mediocre ones, though the verb-is-everything bet lives or dies on enemy and level authoring.
- **Meta-progression unlocks variety, not power.** The next run should be more interesting, not easier. (Power-ramp metas like Hades are the deliberate exception, for games that want you to eventually win.)
- **Costed power forces commitment.** Run-defining loot with a real drawback gives each run a direction; uncosted upgrades flatten every run into the same kitchen sink.
- **Loadout as budget.** Power lives inside a fixed budget (slots, points, cells, hand size); more of one means less of another. A small slot count over a large pool produces identity.
- **Telegraph honestly.** Show what is coming so combat is a decision, not a coin flip, and never let a telegraph lie. A lying telegraph is worse than none. Honesty is about what; timing strictness is a separate, tunable dial with an accessibility bill.
- **Give the defender a verb.** Make the player do something when they are attacked; the dead time between turns is where genre fatigue lives. Pay successful defense in resources, not just survival, and the economy teaches mastery by itself.
- **Subtract.** A tighter, smaller kit usually beats a bigger one. Make skipping a real option and removing as rewarding as adding.
- **Inventory is a decision or a chore.** Treat equipment, loot, consumables, loadouts, and upgrades as one problem: a carried thing earns its slot or it is clutter. A capacity limit only creates a choice when its cost is visible and immediate, and a consumable players hoard is punishing them. The full treatment (storage models, the inventory puzzle, itemization, enhancement, weight, the hoarder trap) is in [inventory.md](./references/design/inventory.md).

## The loop stack and the flow corridor

A core loop is `act → feedback → reward → repeat`, nested by timescale: moment-to-moment, session, progression, meta. The output of an inner loop is the fuel of the outer one. Two tests: the bare moment-to-moment loop must be fun stripped of all progression, and every loop must feed a larger one or it dead-ends. Keep difficulty in the flow corridor, where challenge tracks rising skill: the flow channel, Koster's "fun is learning", the sawtooth difficulty curve, and "fair challenge" all describe the same band. Detail in [frameworks.md](./references/design/frameworks.md).

## The interface layer

A mechanic the player cannot perceive, parse, or operate is broken, so the interface is part of the design, not paint over it. Sort most interface problems with two questions (the theory is in [interface.md](./references/interface/interface.md)): is it a usability fault ("I didn't know I could", "I clicked the wrong thing") or an engageability one ("it got boring")? The fixes do not transfer. And where should a piece of information live on the diegesis matrix, diegetic, non-diegetic, spatial, or meta? From there the surfaces split out, each with its own page in the bundle below: menus, screens, and the HUD; transitions between them; onboarding and how the game teaches; dialogue and choice UI; in-world guidance and feedback; input prompts and button glyphs; and the accessibility floor. The throughlines are respect the player's time, telegraph honestly, never carry information on color or sound alone, and never let polish hide the state.

## Critique smells

When a design feels off, look for these (detection signals and fixes in [critique.md](./references/design/critique.md)):

- **Dominant strategy.** One line always wins, so the choice is not a choice. Make it situational, add a counter, or fix the incentive (players will find any crack).
- **No opportunity cost.** The player can take everything; nothing is sacrificed. Add a budget.
- **Hollow loop.** The reward does not feed the next tier, or the feedback is illegible. Close the loop.
- **Treadmill / power creep.** Numbers rise but nothing changes; new content devalues old. Prefer horizontal options and capability over magnitude.
- **Complexity over depth.** Rules to learn outnumber the decisions they create. Cut or fold; depth comes from interaction, not addition.
- **Ethics smell.** Engagement engineered against the player's interest (appointment grind, monetized randomness, social-graph extraction). The test: would the player have more fun fulfilling this contingency than not?

## Stance

Opinionated, grounded in play, anti-dogmatic. Resonance is diagnostic, not prescriptive: honestly-orthogonal games (Slay the Spire, Balatro) work because they do not force the fiction. Scale the math to your team, do not scale up: a 4x4 grid is enough, a small world needs ten points of interest, not a hundred. Design more than you ship and prune ruthlessly. Never em or en dashes.

## Reference bundle

The design core:

- [method.md](./references/design/method.md) - the dissection lens, the concept-page anatomy, the resonance diagnostic.
- [patterns.md](./references/design/patterns.md) - the cross-game pattern catalog (19 patterns, by category, with exemplars and pitfalls).
- [principles.md](./references/design/principles.md) - the load-bearing design moves worth stealing, with their caveats.
- [frameworks.md](./references/design/frameworks.md) - MDA, core loops and skill atoms, flow, player motivation, depth vs complexity, game feel.
- [systems.md](./references/design/systems.md) - economies, feedback loops, balance, randomness, reward schedules, and the ethics line.
- [critique.md](./references/design/critique.md) - the design-review smell catalog and the rework procedure.
- [inventory.md](./references/design/inventory.md) - storage models, the inventory puzzle, equipment and itemization, enhancement, consumables, weight, loadouts, and the QoL and ethics lines.

The concept area:

- [concept-bundle.md](./references/concept/concept-bundle.md) - what a game concept bundle is: the file set, the seed trio, the spine-vs-detail rule, and the OKF conformance contract.
- [seeding.md](./references/concept/seeding.md) - the elicitation interview (hook, experience goal, pillars, loop, elaboration passes) and the scaffold procedure.
- [tending.md](./references/concept/tending.md) - check, grow, prune: testing work against the seed, folding decisions in, cutting branches with recorded reasons, and the events-not-edits rule.
- [templates.md](./references/concept/templates.md) - copy-paste scaffolds for every file in a concept bundle.

The interface layer:

- [interface.md](./references/interface/interface.md) - usability vs engageability, the diegesis matrix, game usability heuristics, the cognition that constrains UI, the readability floor.
- [menus-and-screens.md](./references/interface/menus-and-screens.md) - menu information architecture, HUD philosophies, the lifecycle screens, respecting the player's time.
- [transitions.md](./references/interface/transitions.md) - the visual vocabulary, the frequency-as-budget rule, a per-case playbook (menu, pause, door, death, room-to-room), and the audio craft.
- [onboarding.md](./references/interface/onboarding.md) - teaching through level design, the introduce-develop-twist-test shape, and hint systems on the guidance-vs-discovery axis.
- [dialogue.md](./references/interface/dialogue.md) - caption practice, branching vs hub structures, the paraphrase problem, skill-check dialogue, choice telegraphing, tools, and barks.
- [guidance-and-feedback.md](./references/interface/guidance-and-feedback.md) - wayfinding and signposting, signifier vs feedforward vs feedback, juice and its counterweight, error prevention, the waypoint debate.
- [input-prompts.md](./references/interface/input-prompts.md) - placing the key hint, device-aware glyph swapping, rebinding-aware prompts, glyph assets, encoding tap vs hold, and the console and accessibility rules.
- [accessibility.md](./references/interface/accessibility.md) - the guidelines, the impairment categories and their features, assist modes, the text and caption numbers, and the case.

## Source

Distilled from Sascha Becker's [game-mechanics](https://github.com/saschb2b/game-mechanics) knowledge base (17 games dissected, 19 cross-game concept pages), grounded in the standard design literature cited throughout the bundle (MDA, Koster, Cook, Schell, Swink, Adams and Dormans, Schreiber, Sirlin), with the interface layer grounded in the game UX and accessibility literature (Hodent, Norman, the Fagerholt and Lorentzon diegesis matrix, Desurvire's playability heuristics, Hamilton, and the Game Accessibility and Xbox Accessibility Guidelines).
