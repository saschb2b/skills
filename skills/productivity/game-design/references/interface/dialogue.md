---
type: Reference
title: "Dialogue and Narrative UI"
description: "Designing conversation. Text-box and caption presentation, branching versus hub structures, the dialogue wheel and the paraphrase problem, skill-check dialogue, choice and consequence telegraphing, authoring tools, and systemic barks."
tags: [game-design, dialogue, narrative, ui, choice]
generated: { by: claude-code/unversioned, at: 2026-06-24T00:00:00Z }
---

# Dialogue and Narrative UI

The interface of conversation: how a game presents speech, structures choice, and signals consequence. This is where narrative meets usability, and where [method.md](../design/method.md)'s ludonarrative-resonance lens gets a concrete surface, the player's words are a verb, and the gap between what they choose and what the character says is a resonance gap. Presentation overlaps the [interface.md](interface.md) readability floor and [accessibility.md](accessibility.md) caption rules; choice consequence overlaps the feedforward idea in [guidance-and-feedback.md](guidance-and-feedback.md).

## Presentation

The text-box conventions are well-settled, and most are accessibility baselines, not flourishes: a name plate and speaker portrait, adjustable text speed, auto-advance, skip, and a **backlog or history log** so a player can re-read a missed line (its absence reads as inaccessible). The captions layer is where there are hard, citable rules, mostly converging on the [BBC subtitle guidelines](https://www.bbc.co.uk/accessibility/forproducts/guides/subtitles/) by way of [Xbox Accessibility Guideline 104](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/104):

- Distinguish **subtitles** (speech only) from **captions** (all important audio, with sound and speaker cues), and let the player choose.
- Identify the speaker when it is ambiguous; do not repeat the label on every line. Keep lines to about 40 characters and two lines at most. Mixed case, a readable sans-serif, and a solid or semi-opaque background plate. Subtitles on by default is a high-impact, low-cost default.

## Structure

Conversation shape is a content-budget decision before it is a UI one. Emily Short's [taxonomy](https://emshort.blog/2016/04/12/beyond-branching-quality-based-and-salience-based-narrative-structures/) and Sam Kabo Ashwell's [choice-structure patterns](https://heterogenoustasks.wordpress.com/2015/01/26/standard-patterns-in-choice-based-games/) are the practitioner references:

- **Linear** with flavor variation. Cheapest; choice is texture.
- **Branching tree.** Real divergence, but Chris Crawford's classic warning is the combinatorial explosion: pure branching needs more content than anyone wants to write, and the player sees a sliver of it. (The term "icebox" sometimes attached to that unseen content is borrowed from software project management, not a real narrative-design term; call it wasted or unreachable content.)
- **Branch-and-bottleneck.** Branches diverge then reconverge at fixed beats. The workhorse of cinematic RPGs (Mass Effect, The Witcher 3, Telltale) because it buys the feel of choice at bounded cost.
- **Hub-and-spoke.** Return to a central menu of topics. The classic CRPG conversation, good for exploration, weak for momentum.

## The dialogue wheel and the paraphrase problem

Mass Effect's wheel (2007) maps tone to a fixed position (diplomatic top, aggressive bottom) so the player learns *how* Shepard will speak, not *what* the line is, which enables fast cinematic selection. The cost is the **paraphrase problem**: the short prompt and the spoken line diverge, sometimes sharply (a terse prompt becomes a harsh speech), and the player loses control of intent. The lesson generalizes: the more you compress a choice into an icon or a tone, the more you owe the player a reliable mapping from prompt to outcome. When the gap is wide, players feel tricked.

## Skill-check and stat-driven dialogue

Disco Elysium (2019) is the modern high-water mark: 24 skills, each an internal **voice** that argues with the player, gate and color the conversation. Worth stealing precisely:

- **White checks** can be retried after investing a skill point; **red checks** cannot. The distinction tells the player which failures are learnable and which are final, a telegraph in the [critique.md](../design/critique.md) sense.
- **Passive checks** resolve silently and surface lore and characterization rather than gating progress, so stats shape the *texture* of the world, not just pass/fail gates.
- The **Thought Cabinet** internalizes ideas over time for buffs and debuffs, turning reflection into a mechanic.

The lineage is the CRPG speech and persuade check (Fallout); the move is to make a stat change what the player can *say*, not just what they can do.

## Choice, consequence, and the illusion of it

Telltale's "X will remember that" became shorthand for the **illusion of choice**: a notification promises weight the branch-and-bottleneck structure rarely delivers, since paths reconverge. Until Dawn's timed choices and Butterfly Effect create the same suggestion of sweeping consequence over a limited true decision set. None of this is inherently dishonest, but two design duties follow:

- **Telegraph the stakes, not the outcome.** Mark a choice as important or irreversible (a timer, a held confirm, a tonal shift) so the player commits knowingly. This is feedforward, the same instinct as a combat telegraph.
- **Be wary of the morality meter.** A single good-versus-evil axis tends to reward optimizing the meter over ethical reflection, judges actions context-blind, and lets a player max both ends ([Schulzke on Fallout](https://gamestudies.org/0902/articles/schulzke), 2009). Prefer consequences that are situated and legible over a number that scores the player's soul.

## Authoring tools and systemic barks

What writers actually use to build branching dialogue: [ink](https://www.inklestudios.com/ink/) (inkle's open-source narrative language with the Inky editor), [Yarn Spinner](https://yarnspinner.dev/) (from the Night in the Woods team), Twine (web interactive fiction), and the commercial articy:draft for AAA content databases.

Separately, **barks**, the systemic ambient lines, are the cheapest way to make a world feel alive and a system legible. F.E.A.R.'s squad callouts ("He's flanking!") made emergent GOAP behavior *readable*, and Jeff Orkin's maxim is the whole technique: ["if the AI didn't say it, it didn't happen"](https://www.gameaipro.com/GameAIPro2/GameAIPro2_Chapter02_Combat_Dialogue_in_FEAR_The_Illusion_of_Communication.pdf), perceived intelligence tracks presentation more than algorithm. Valve generalized this into a reusable rules engine that scores thousands of world facts to pick the best contextual line ([Ruskin, Dynamic Dialog](https://www.gamedeveloper.com/design/video-valve-s-system-for-creating-ai-driven-dynamic-dialog), GDC 2012), the same fact-to-line move behind the Left 4 Dead Director's mood.
