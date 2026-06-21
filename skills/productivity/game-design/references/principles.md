---
type: Reference
title: "Design Moves Worth Stealing"
description: "The load-bearing, transferable design principles the cross-game catalog repeats, each with its caveat and the games that source it."
tags: [game-design, principles, lessons, heuristics]
timestamp: 2026-06-21T00:00:00Z
---

# Design Moves Worth Stealing

The principles that recur across the dissected games and generalize past their genre. Each is a move you can apply, the reason it works, and the caveat, because none of these is universal. Both work, for different games. These are the opinionated layer; the neutral pattern definitions are in [patterns.md](patterns.md), and the academic backing for several is in [frameworks.md](frameworks.md).

## Structure and identity

- **Pick one dialectic and restate it fractally.** Choose a single central tension ("speed vs accuracy", "greed vs survival", "specialize vs adapt") and make every screen a restatement of it. Players intuit the principle once and apply it everywhere; the game feels coherent. The most transferable move in the set. Source: Slay the Spire, Moonlighter 2, Mega Man Battle Network.
- **Constraint produces identity.** A small slot count drawn from a large pool forces builds to be distinct. About four slots is the repeated sweet spot; six is usually too many, two too few. Source: Balatro (5 of 150+ Jokers), Hollow Knight (11 notches), Pokemon (4 moves).
- **Opportunity cost must be felt, and visible.** Every loadout choice should foreclose another, and the player must be able to see what they are giving up. If they cannot see the sacrifice, the budget does not bite. Source: Sparklite, Moonlighter 2, Nier Automata (the HUD itself is in the budget).

## Power and progression

- **Meta-progression unlocks variety, not power.** For replay-heavy games, the next run should be more interesting, not easier. New options, modifiers, and starting states, yes; bigger base stats, no. Caveat: a deliberate power ramp is right for a game that wants you to eventually win and then stop (Hades). Pick a stance and be consistent. Source: Slay the Spire, Balatro.
- **Costed power forces commitment, not collection.** Give run-defining loot a real drawback so each run gets a direction. Uncosted upgrades flatten variety because every great run ends up the same shape. Use soft costs (opportunity cost) freely and hard costs (a permanent ban on a whole system) sparingly. Source: Slay the Spire boss relics, Path of Exile keystones, BotW heart-vs-stamina.
- **A permanent fork makes players into kinds of players.** A meta choice you cannot respec ("more hearts or more stamina") turns a loadout into an identity. If you let players respec, it is a loadout, not a choice. Source: Breath of the Wild, Cult of the Lamb doctrines.
- **Augment, never replace.** New progression systems should add an orthogonal axis, not supersede an old one. Replacement creates dead content; augmentation creates depth. A new system that is just "more damage" competes with the existing one and forces you to deprecate it. Source: Warframe (held the line for over a decade), Path of Exile leagues.
- **How long can you keep teaching.** In a long game, engagement past hour 30 comes from learning a system that just unlocked, not from more of the same. A system introduced at hour H needs roughly H more hours of content to justify it, late reveals should be narratively earned, and returning players need a tutorial log. Source: Xenoblade, Nier Automata, Warframe.

## Combat and fairness

- **Telegraph honestly; a telegraph is a promise.** Show what is coming so combat is a decision, not a coin flip. This moves randomness off the enemy and onto the player's own kit. The honesty is non-negotiable: a telegraph that lies or omits is worse than none. Source: Slay the Spire, Mega Man Battle Network, Xenoblade Vision, Hollow Knight.
- **Subtract; make skipping a real option.** A tighter, smaller kit usually beats a bigger one, and removing should be as rewarding as adding. Treat "take nothing" as a first-class choice in any reward draft; it changes the decision from "which is best" to "is any of these worth my limited slot". Source: Slay the Spire, Mega Man Battle Network, Balatro.

## Systems and economy

- **Write rules, not encounters.** A small system of universal, multiplicative rules generates more emergent content than a large team can hand-author. Multiplicative interactions beat additive content. Source: Breath of the Wild's chemistry engine.
- **Every currency is a verb.** Prefer currencies that each do something (perform an operation, gate a craft) over an abstract pile of gold; inflation control then lives in the system rather than being bolted on. Source: Path of Exile.
- **The chase is the game.** For loot-driven games, a perfect item must be reachable but rarely reached. Determinism is a bug to nerf in regulated doses; if you close the chase, you remove the engine. Caveat: this needs a working trade or second economy to absorb the imperfect items. Source: Path of Exile, Warframe Rivens.
- **Friction can be identity.** Deliberate inconvenience (manual trade, earned cartography, hidden math) can be the point and filter for the audience you want. Caveat: it also filters out players you might have wanted, so choose it on purpose, not by neglect. Source: Path of Exile, Hollow Knight, Pokemon.

## Process and scope

- **Pick a stance: bounded or infinite.** A narrative-leaning game usually wants a bounded arc with opt-in escalation; a grind-as-endgame game wants infinite escalation. Decide which, rather than drifting. Source: Hades and Sparklite (bounded) versus Warframe (infinite).
- **Constraints are a brief.** A publisher or hardware limit often becomes the game's identity. Treat the constraint as a design prompt, not just an obstacle. Source: Nier Automata (a "more content" note became the multi-route structure), Warframe (a rejected pitch became free-to-play trade), BotW (Wii U hardware drove rules over content).
- **Scale the math to your team, do not scale up.** A 4x4 grid is enough, a 5 square kilometer world wants about ten points of interest rather than a hundred. Down-scale ambitious moves to a budget you can actually tune and ship. Source: the recurring indie reading of AAA systems across the catalog.
- **Design more than you ship, and prune ruthlessly.** Most games ship too much. Generate many ideas and let half of what you prototype get cut; anything that does not earn its slot is noise. Pair this with tracking something real (pick rates, win rates, completion) over another round of playtester opinions. Source: Slay the Spire (Mega Crit's metric-driven pruning).
- **Seedable RNG buys community for free.** If a game has any randomness, make it seedable from day one and add a daily-seeded mode with a leaderboard: everyone plays the same seed today, the leaderboard reveals skill. Low cost, high engagement, the kind of community a patch cannot manufacture (Wordle proved it). Source: Slay the Spire's daily climb. Pair it with quiet anti-streak pity systems (bias drops upward after a dry spell) so random rewards rarely feel malicious; see [systems.md](systems.md).
- **Climb a difficulty staircase, do not ship a slider.** For any game with a "did you win" loop, replay depth comes from a staircase of stacking single-constraint modifiers the player climbs one rung at a time, not an Easy-to-Hard slider chosen once. Each rung is a digestible new lesson and players self-pace. Source: Slay the Spire Ascension, Hades Heat, Balatro Stakes; the pattern is in [patterns.md](patterns.md).

## The meta-principle

These are heuristics, not laws, and several of them contradict each other on purpose (vision-driven versus metric-driven; bounded versus infinite; friction versus convenience). The skill is knowing which one your game wants. Hold them as questions to ask, not boxes to check, and be ready to argue with any of them.
