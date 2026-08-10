---
type: Reference
title: "Design Frameworks"
description: "MDA, core loops and skill atoms, the flow corridor, player motivation, depth versus complexity, and game feel, with sources."
tags: [game-design, frameworks, mda, flow, motivation, game-feel]
generated: { by: claude-code/unversioned, at: 2026-06-21T00:00:00Z }
---

# Design Frameworks

The durable, repeatedly-cited theory that grounds the catalog. These are the load-bearing anchors; where a framework is dated or contested it is flagged. The catalog's own moves are in [principles.md](principles.md); economy and balance theory is in [systems.md](systems.md).

## MDA: design from the experience down

Hunicke, LeBlanc, and Zubek's MDA framework ([paper](https://users.cs.northwestern.edu/~hunicke/MDA.pdf)) splits a game into three layers:

- **Mechanics** are the rules, data, and algorithms, the only layer you author directly.
- **Dynamics** are the run-time behavior of those mechanics under player input, emergent and tuned only indirectly.
- **Aesthetics** are the felt emotional responses, the actual target.

The load-bearing idea is the two directions of traversal. The designer reads M to D to A: mechanics give rise to dynamics, which produce aesthetics. The player meets the game in reverse, A to D to M: the experience sets the tone, expressed through observable dynamics, operated through mechanics. So you cannot author "fun" directly. You name the aesthetic you want, model the dynamics that would produce it, find the broken feedback loop, and tune the mechanical lever. Design experience-first, not feature-first.

LeBlanc's **eight kinds of fun** ([reference](http://algorithmancy.8kindsoffun.com/)) replace the word "fun" with targets you can design toward: Sensation, Fantasy, Narrative, Challenge, Fellowship, Discovery, Expression, Submission. Most games aim at several in proportion. Name yours.

Caveat: MDA is mechanics-centric and treats narrative, art, and UI as out of scope, and its aesthetics list is acknowledged as somewhat arbitrary. When story needs first-class standing, the DDE successor (Design, Dynamics, Experience, [overview](https://www.gamedeveloper.com/design/from-mda-to-dde)) puts content on equal footing with rules. Use MDA as a shared vocabulary and a debugging lens, not as a formula that generates fun.

## Core loops and skill atoms

The core gameplay loop is the cycle the player runs most often: `act to get to upgrade to repeat`. Daniel Cook's sharper framing ([The Chemistry of Game Design](https://lostgarden.com/2007/07/19/the-chemistry-of-game-design/)) is a **skill atom**: the player holds a mental model, takes an action, gets feedback, and updates the model. Chaining atoms builds a skill tree, where each mastered skill becomes the input action for the next unmastered one.

Loops nest by timescale, and the structure is fractal:

| Loop | Timescale | Example payoff |
| --- | --- | --- |
| Moment-to-moment | seconds | first reward within 30 to 60 seconds |
| Session / core | minutes | clear a run, level up |
| Progression | hours | unlock a biome, beat a boss |
| Meta | days to weeks | permanent upgrades, mastery, standing |

The hierarchy works because the output of an inner loop is the fuel of the outer one.

Cook's **loops versus arcs** ([Loops and Arcs](https://lostgarden.com/2012/04/30/loops-and-arcs/)): a loop delivers value through repeated exercise (use it for masterable systems), an arc is a broken loop you exit immediately and delivers value once (use it for one-shot story beats). Do not bury narrative in a mastery loop or build repeatable content out of arcs. And plan for burnout: players feel pleasure while learning a skill, not while exercising a mastered one, so a chain that stops introducing new atoms goes stale.

How to design or critique a loop: name the core verb (if you cannot, the loop is unfocused); close it with immediate, legible feedback so the mental model updates; front-load the first reward; ensure every loop output feeds a larger loop; and run the isolation test, strip away progression, story, and meta, and confirm the bare moment-to-moment loop is still fun. If the core is not fun alone, no amount of progression or story saves it.

## The flow corridor

Csikszentmihalyi's flow channel ([overview](https://en.wikipedia.org/wiki/Flow_(psychology))): flow happens when perceived challenge roughly equals perceived skill. Above the diagonal is anxiety, below is boredom. Three preconditions you build in directly: clear goals, immediate feedback, and a challenge pitched just above current skill. Because play raises skill, holding difficulty constant slides the player into boredom, so the bar must keep rising.

Four descriptions of the same corridor, worth holding together:

- **Flow channel**: challenge tracking rising skill.
- **Koster, fun is learning** ([A Theory of Fun](https://www.theoryoffun.com/press.shtml)): the brain rewards itself for grokking a new pattern; boredom comes from both too-easy (pattern mastered) and too-hard (reads as noise, not a learnable structure). A good game teaches everything it has before the player stops playing.
- **Sawtooth difficulty** ([fractal curves](https://www.gamedeveloper.com/design/doing-difficulty-right-fractal-curves)): never a monotonic ramp; oscillate tension and release in Normal, Peak, Rest cycles, and steepen the slope late as the flow zone widens with mastery.
- **Fair challenge** (Mark Brown, [GMTK](https://gmtk.substack.com/p/whats-the-point-of-hard-games-anyway)): the player blames themselves, sees a path to victory, feels themselves improving, and can retry cheaply. Failure must be the player's fault, never the game's, which is why telegraphing and readable silhouettes are preconditions: you cannot master a pattern you cannot perceive.

Different players have different flow zones, so a single static difficulty curve serves only a slice of the audience; the strongest fix is to embed difficulty choices in the mechanics so players self-tune (Jenova Chen, [Flow in Games](https://www.jenovachen.com/flowingames/abstract.htm)). The most durable practical tool for replay difficulty is the cumulative-modifier staircase (Ascension, Heat, Stakes): one new constraint per rung, climbed deliberately, instead of a single Easy-to-Hard slider. It is in the catalog in [patterns.md](patterns.md).

## Player motivation

- **Self-Determination Theory** is the empirically strong one ([PENS](https://selfdeterminationtheory.org/player-experience-of-needs-satisfaction-pens/)). Games pull to the degree they satisfy three needs: competence (feeling effective), autonomy (meaningful choice), relatedness (connection). The game-specific PENS additions are presence and intuitive controls, since clumsy controls directly suppress felt competence. This explains why any game is compelling; it is universal, not a segmentation.
- **Quantic Foundry's model** ([model](https://quanticfoundry.com/gamer-motivation-model/)) is the empirically-derived map, from factor analysis over a million-plus players: six paired factor groups (Action, Social, Mastery, Achievement, Immersion, Creativity). Players are continuous points, not discrete types; design for blends, and watch for anti-correlated factors (challenge pulls against excitement).
- **Bartle's types** (Achievers, Explorers, Socializers, Killers, [source](https://mud.co.uk/richard/hcds.htm)) are influential but dated and unvalidated, derived from a single text MUD; Bartle disclaimed rigor himself. Use them as vocabulary and a reminder to support multiple play styles, not as a measured instrument.
- **The overjustification guardrail** ([meta-analysis](https://home.ubalt.edu/tmitch/642/articles%20syllabus/Deci%20Koestner%20Ryan%20meta%20IM%20psy%20bull%2099.pdf)): expected, tangible rewards for an already-enjoyable activity can reduce intrinsic motivation once removed. Unexpected rewards and competence feedback do not, and can enhance it. Prefer rewards that signal mastery; use extrinsic carrots to bootstrap onboarding, then transition to intrinsic drivers.

## Depth versus complexity

- **Emergence versus progression** (Juul, [The Open and the Closed](https://jesperjuul.net/text/openandtheclosed.html)): emergence is a few simple rules combining into wide variation, content-efficient and replayable (chess, Tetris); progression is separate challenges presented serially, strong authorial control but consumed once and content-expensive. Most games are hybrids.
- **Orthogonal options** (Soren Johnson, [Seven Deadly Sins](https://www.designer-notes.com/gd-column-1-seven-deadly-sin-for-strategy-games/)): a new option should open a new axis of decision, not be strictly better content or a re-skin. Depth comes from interaction, not addition. When you add, fold or cut something; players can only track so many options.
- **Complexity is a budget** (Dan Felder, [Complexity vs Depth](https://danfelder.net/2015/05/21/design-101-complexity-vs-depth/)): depth is how hard the best move is to find once you know the rules (the goal); complexity is how much you must learn and juggle (the cost). They are independent. Depth is revenue, complexity is cost, never let cost exceed revenue; when unsure, choose the less complex option.
- **Interesting decisions** (Sid Meier, [GDC](https://www.gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions)): a game is a series of interesting decisions. A choice is not interesting if one option always wins, if it is random, or if it has no consequence; it is interesting with real trade-offs, situational value, room for expression, and information that is sufficient but uncertain. Raise decision density, not content volume. (The exact provenance of the quote is unsettled; the wording Meier endorses is "a series of interesting decisions".)

## Game feel

Steve Swink's game feel ([chapter 1](http://mycours.es/gamedesign2014/files/2014/10/Game-Feel-Steve-Swink-chapter-1.pdf)) is real-time control of a virtual object in a simulated space, with interactions emphasized by polish. Three parts: real-time control (the response feels perceived in the same moment it is expressed, with the loop under roughly 100 milliseconds), simulated space (physical interactions you actively perceive), and polish (effects that enhance the interaction without changing the underlying simulation). The key insight is that feel can be moved as much by polish as by the simulation itself.

Juice ([Juice it or lose it](https://www.youtube.com/watch?v=Fy0aCDmgnxg), the [Art of Screenshake](https://www.youtube.com/watch?v=AJdEqssNZ-U)) is the non-essential audio-visual feedback (tweening, squash and stretch, screen shake, hit pause, particles, camera kick) that makes identical mechanics feel alive. The mechanics are unchanged; only the feedback differs. The counterweight: over-juicing hurts readability and hides game state, so juice only as far as keeps the state legible.
