---
type: Reference
title: "Systems, Economies, and Balance"
description: "Internal economies, feedback loops, balancing methods, randomness, reward schedules, and the ethics line, with sources."
tags: [game-design, economy, balance, randomness, rewards, ethics]
generated: { by: claude-code/unversioned, at: 2026-07-06T00:00:00Z }
---

# Systems, Economies, and Balance

The systems-design half of the craft: how resources flow, how options stay viable, how randomness lands, and how rewards are scheduled, with the line where engagement turns into exploitation. The catalog's economy patterns (currency-as-crafting, aspirational-crafting) are in [patterns.md](patterns.md); this note is the general theory.

## Internal economies

Adams and Dormans model any game economy as four node types ([Game Mechanics](https://books.google.com/books/about/Game_Mechanics.html?id=_Azio0txIdAC)):

| Node | What it does | Effect on total resources |
| --- | --- | --- |
| Source | Creates resources (a gold mine, a respawn) | Increases |
| Drain / sink | Consumes them permanently (repair costs, upkeep) | Decreases |
| Converter | A drain feeding a source (one tree becomes fifty boards) | Changes; can inflate or deflate |
| Trader | Exchanges resources between owners at a price | Unchanged; only redistributes |

The converter-versus-trader distinction is load-bearing: misclassifying a trader as a converter is a common source of unintended inflation. The same model is Dan Cook's faucet-and-drain. Every economy needs its sinks sized against its sources, or it inflates until currency stops mattering. This is exactly why the currency-as-crafting pattern denominates trade in consumables; the sink is built into the currency.

## Feedback loops

- **Positive (reinforcing)** feedback amplifies a lead: rich gets richer. It rewards mastery and ends games decisively, but risks blowouts and decides matches early (Monopoly, kill streaks).
- **Negative (balancing)** feedback pushes back proportionally to a lead: it enables comebacks and keeps races close, but can punish good play (Mario Kart's blue shell). It is the standard tool for suppressing a runaway dominant strategy.

Well-designed games layer both: positive feedback to reward skill and conclude, negative feedback as dynamic difficulty control ([overview](https://machinations.io/articles/game-systems-feedback-loops-and-how-they-help-craft-player-experiences)). When a game drags or snowballs, look here first.

## Balancing methods

- **Transitive balance and cost curves** ([Schreiber](https://gamebalanceconcepts.wordpress.com/2010/07/21/level-3-transitive-mechanics-and-cost-curves/)): a linear power order, balanced by pricing power so better things cost more. Express each benefit and drawback in one resource and require cost to track benefit. The vocabulary matters: an option that is too strong is overpowered (fix the benefit) or under-costed (fix the cost), and those are different fixes.
- **Intransitive balance, rock paper scissors** ([Schreiber](https://gamebalanceconcepts.wordpress.com/2010/09/01/level-9-intransitive-mechanics/)): no single best option because everything is countered. It is an emergency brake on dominant strategies but harder to tune for fairness. Real games combine transitive and intransitive. Applied at combat-content scale this becomes the typed-damage-matrix pattern in [patterns.md](patterns.md), where a hand-tuned effectiveness matrix moves depth from raw numbers onto matchups.
- **What balance means** (Sirlin, [definitions](https://www.sirlin.net/articles/balancing-multiplayer-games-part-1-definitions)): a game is balanced when a reasonably large number of options are viable, especially at high-level play. A dominant strategy that consistently beats experts by doing one move collapses the decision into a non-decision; that is degenerate. Note the split of responsibility: the player should exploit any legal tactic (most have undiscovered counters), but the designer still removes the genuinely degenerate ones. Do not conflate the two roles.

## Randomness: input versus output

- **Input randomness** resolves before the decision (map generation, the next Tetris piece, an opening hand). The player sees it and strategizes around it. It gives replayability, clean skill attribution, and meaningful decisions.
- **Output randomness** resolves after the decision (hit chance, dice combat). It gives tension, drama, and forgiveness for the underdog, but weakens the link between choice and outcome and can feel unfair or mask a shallow system.

([Burgun](https://www.gamedeveloper.com/design/randomness-and-game-design); the terms originated on the Ludology podcast.) The catalog's telegraph pattern is the same instinct applied to combat: it converts output randomness on the enemy into input randomness the player can plan against. When output randomness must carry weight, temper it with pseudo-random distribution or bad-luck protection (the anti-streak pity systems that bias drops upward after a dry spell smooth feel-bad runs without the player noticing).

## Reward schedules

Hopson ported operant conditioning to games ([Behavioral Game Design](https://www.gamedeveloper.com/design/behavioral-game-design)). A reward is a contingency of time, activity, and payout:

| Schedule | Pattern of behavior | Typical use |
| --- | --- | --- |
| Fixed ratio (after N actions) | A burst, then a post-reward pause | predictable grinds |
| Variable ratio (after a varying N) | The highest, steadiest rate, no pause | random loot drops |
| Fixed interval (after time T) | A pause, then accelerating checking near the deadline | daily rewards |
| Variable interval (after a random time) | Steady moderate activity | random world events |

Variable ratio is the strongest engagement engine because any action might be the winning one, which is exactly why it is also the structure of a slot machine. Intrinsic versus extrinsic still applies: tangible expected rewards can undermine intrinsic motivation, while rewards that inform (certifying mastery, unlocking a new verb) support it. Prefer competence-signaling rewards over flat repetition payouts.

## The ethics line

The same loop that makes a game compelling can be turned against the player. Hold these:

- **Hopson's own test** ([No Skinner Box](https://www.gamedeveloper.com/design/there-is-no-skinner-box-says-bungie-user-research-lead)): a contingency is ethical if the designer genuinely believes the player will have more fun fulfilling it than not. Calling a game "a Skinner box" describes nothing about whether it is exploitative; the test is the intent and the player's actual benefit.
- **Dark patterns** (Zagal, Bjork, Lewis, [FDG 2013](https://dblp.org/rec/conf/fdg/ZagalB013.html)): design crafted to get users to do things they would not otherwise choose, across temporal (grinding, play-by-appointment), monetary (pay-to-skip, pre-delivered content), and social (social pyramid schemes, friend spam) forms.
- **Loot boxes** ([Zendle and Cairns](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0206767)): monetizing a variable-ratio random reward with near-miss presentation imports gambling structure. Spending robustly correlates with problem-gambling severity, strengthened by near-miss displays; represent it as a gambling-like structure with a consistent correlational harm signal and regulatory concern, not a proven causal pipeline.
- **Treadmills and power creep**: meaningful progression grants genuine new capability or content; a treadmill simulates progress with inflating numbers that only gate time, and power creep devalues prior investment. Prefer horizontal progression (different options, not strictly stronger) and reward capability over magnitude, which also satisfies the competence need from [frameworks.md](frameworks.md).

The reward-design checklist: the reward should make the game more fun, not just stickier; support intrinsic motivation rather than supplanting it; respect the player's time; avoid monetized randomness aimed at vulnerable players; do not weaponize the player's social graph; build progression that grants real capability; and design engagement loops, not withdrawal loops.
