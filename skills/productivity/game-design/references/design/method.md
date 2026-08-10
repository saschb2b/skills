---
type: Playbook
title: "The Dissection Method"
description: "The repeatable lens for reading any game or mechanic. Iconic mechanic, core dialectic, macro loop, design tensions, ludonarrative resonance, patterns, lessons, and the concept-page anatomy."
tags: [game-design, analysis, method, patterns]
generated: { by: claude-code/unversioned, at: 2026-06-21T00:00:00Z }
---

# The Dissection Method

A repeatable lens for taking any game or mechanic apart and seeing what makes it work. Run the same axes every time; consistency is what lets you compare across games and notice when the same move recurs. This is the analysis half of the skill; the synthesis half (designing new things) runs the same axes in reverse, from a target experience down to the mechanics that produce it.

## The axes

Extract these from whatever you are analyzing. The first two are the load-bearing ones.

- **Iconic mechanic.** The one phrase that names this game's mechanical identity, the system you would name the game by. "Forma plus Riven Disposition." "1500-node passive tree plus skill gems as gear." "Poker hands times Jokers times deck-mutation times an Ante staircase." If you cannot say it in a phrase, you have not found the center yet.
- **Core dialectic.** The single tension the game restates across all its systems. "Risk vs reward, fractally." "Greed vs gold." "Friction over convenience." "Power fantasy vs grind." This is the most stealable idea in the whole method: pick one dialectic and restate it fractally, so every screen is the same trade-off in a new costume and the player learns the game once.
- **Macro loop.** The cycle the player actually runs, written as pseudo-code or a short ordered list, from the moment-to-moment action up through the session. What do you do, what do you get, what does it change, why do you go again.
- **Mechanic systems.** Each major system named and described neutrally and analytically: combat, loadout, map, progression, economy. One unit of analysis each. When a game has more than about ten systems, treat them separately rather than as one blur.
- **Design tensions.** What the developers wrestled with, in their own words. Block-quote real dev quotes whenever they exist; they triangulate intent better than any outside reading. Frame reception as "what design problem surfaced", not as a review.
- **Ludonarrative resonance.** A lens, not a pattern. The diagnostic: describe the loop without referring to the fiction, then ask whether it still reads as a story about this character. Resonance is in the verbs, not in the labels or the cutscenes. Grade it Affirms, Orthogonal, or Dissonant. Crucially this is diagnostic, not prescriptive: a game can be honestly orthogonal (Slay the Spire, Balatro) and be better for not forcing the fiction. Do not treat resonance as a universal good.
- **Patterns.** The reusable design moves the game shares with others, as a tag list. Curated moves point at the catalog in [patterns.md](patterns.md); uncurated ones are just named.
- **Lessons.** Opinionated, first person, split into what is worth stealing and what to be careful about, ideally with a concrete note on how you would build it at your own scale. Always ask the cost, not just the upside.

## Promote a move to a pattern only when two games share it

A single game's clever mechanic is not yet a pattern; it is just that game's mechanic. A design move earns a named, curated pattern entry once **two or more games independently use it**, because the point of the pattern layer is contrast. The variants table, showing how different games solve the same problem with different math, is what earns a pattern its existence. One game gives you nothing to contrast. The exception is a developer-coined term with a strong unique angle, which can stand alone.

## The concept-page anatomy

When you do write up a pattern, this is the shape that holds the contrast (it is the shape every entry in [patterns.md](patterns.md) follows):

1. **Lemma.** One line stating the pattern.
2. **What it solves.** What goes wrong without it, and what adding it fixes. Be concrete.
3. **Variants across games.** A table whose columns are chosen to highlight where the games differ, not where they agree. This is the load-bearing section. For loadout patterns: budget shape, what gets packed, the constraint, the trade-off cost. For map patterns: shape, node types, what is revealed.
4. **When to use, and when to avoid.** The genres, scales, and contexts where it works, and where it does not.
5. **Pitfalls.** Where it fails or feels bad, and the common implementation mistakes.
6. **Adjacent patterns.** What it relates to and how.

## Using the method to design, not just analyze

The same axes generate. To pitch a new game or mechanic, decide the experience you want, then choose the iconic mechanic and core dialectic that would produce it, sketch the macro loop, pick the patterns from [patterns.md](patterns.md) that fit, and name the pitfalls up front. This is MDA run backwards, from aesthetic down to mechanic; see [frameworks.md](frameworks.md). The critique and rework version of the same loop is in [critique.md](critique.md).
