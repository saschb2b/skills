---
type: Playbook
title: "Onboarding, Tutorials, and Hints"
description: "How to teach a game without a wall of text. The first-session problem, teaching through level design, the introduce-develop-twist-test structure, and hint systems on the guidance-versus-discovery axis."
tags: [game-design, onboarding, tutorial, teaching, hints]
generated: { by: claude-code/unversioned, at: 2026-07-06T00:00:00Z }
---

# Onboarding, Tutorials, and Hints

How a game teaches itself. This is the procedure half of the interface layer: a method for getting a new player competent and engaged without a wall of text, and for helping a stuck player without erasing the discovery. It is the applied form of two [frameworks.md](../design/frameworks.md) ideas, Cook's skill atoms (a player holds a model, acts, gets feedback, updates) and Koster's "fun is learning", so good teaching and good fun are the same activity. The long-game version, unlocking systems 15 and 30 hours in, is the late-introduced-mechanics pattern in [patterns.md](../design/patterns.md) and "how long can you keep teaching" in [principles.md](../design/principles.md).

## The first session decides everything

The first-time user experience (FTUE) is where players are lost. Two failure modes dominate, and they pull in opposite directions:

- **Tutorial hell.** Front-loaded walls of text and stacked prompts before the player has done anything. The mind cannot learn a verb it has not performed, so the instruction evaporates.
- **Fun deferred.** Gating the actual game behind a long unskippable ramp until motivation is gone.

The counter to both is **just-in-time teaching**: introduce a mechanic the moment before it is needed, and teach it through action rather than explanation. Note that most hard FTUE-retention numbers come from mobile practitioner blogs, not peer review, so treat the figures as directional, not measured.

## Teach through the level, not the textbox

The strongest tutorials have no tutorial. The canon to steal from:

- **Super Mario Bros. World 1-1** teaches jump, enemy, block, and powerup in the first few wordless steps, and the Goomba is deliberately the first enemy because a ground-bound thing you can jump over forgives a slow learner where a Koopa would punish one.
- **Half-Life 2's invisible tutorial** ([GMTK](https://www.youtube.com/watch?v=MMggqenxuZc)) carries its only text on button prompts and stages the environment so the player discovers each verb. **Mega Man X**'s intro stage (Egoraptor's [Sequelitis](https://archive.org/details/sequelitis-mega-man-classic-vs.-mega-man-x), 2011) teaches the whole kit wordlessly through a single designed sequence.
- **Pokemon teaches a 289-cell ruleset it never displays.** The type-effectiveness matrix appears nowhere in-game; every move carries a visible type tag, every hit answers with "It's super effective!" or its opposites, and players internalize the chart inductively over hundreds of battles, then treat the knowledge as personally discovered. The generalizable move: a ruleset far too large for a tutorial can be taught by tagging every action and grading every outcome, but only when the game supplies enough repetition to carry the induction. The economy variant of the same idea is in [principles.md](../design/principles.md): Expedition 33 pays its harder defensive input in resources, so the reward structure teaches mastery with no text at all.
- **Valve's playtest discipline** is the engine under all of it: observers watch silently and are forbidden to give hints ([Birdwell, The Cabal](https://www.gamedeveloper.com/design/the-cabal-valve-s-design-process-for-creating-i-half-life-i-), 1999); Portal's simpler early chambers exist because early testers drowned. If a tester needs a hint you cannot ship, the level has not taught it yet.

The transferable rule is the affordance-and-signifier pair from Don Norman: an affordance is the action a thing makes possible, a [signifier](https://jnd.org/signifiers-not-affordances/) is the perceptible cue that says where and how to act. Teach by building signifiers into the world (the button prompt, the lit ledge, the lone Goomba), not by narrating.

## The four-step shape

The most portable teaching structure, from Mario level director Koichi Hayashida ([Nutt, The structure of fun](https://www.gamedeveloper.com/design/the-secret-to-i-mario-i-level-design), 2012), maps onto the four-act *kishotenketsu*:

1. **Introduce** the mechanic in a safe space where failure is cheap.
2. **Develop** it with a slightly harder application.
3. **Twist** it, combine it with something or use it in an unexpected way.
4. **Test** mastery in a demanding final application.

This is [method.md](../design/method.md)'s MDA-in-reverse at the scale of a single room: pick the skill you want the player to own, then sequence the four beats that build it. It scales from one level to a whole game's pacing.

## Hint systems and the guidance-versus-discovery axis

When a player gets stuck, the design question is how much to help without stealing the "aha". The spectrum, with the move that keeps both:

| Stance | How it helps | Exemplars |
| --- | --- | --- |
| **Staged, opt-in help** | Graduated hints the player chooses to reveal | Infocom InvisiClues (subtle to explicit) |
| **Stuck-detection assist** | The game notices repeated failure and offers a way past | Nintendo Super Guide (a CPU plays the level after 5 to 8 fails) |
| **Optional companion** | An on-demand hint character | Skyward Sword's Fi, intrusive on Wii, opt-in in HD |
| **No help, by design** | Withholds hints to protect discovery | The Witness (only wrong-answer feedback), Hollow Knight (deliberate vagueness) |

The cleanest move is to let a stuck player unstick **without erasing the achievement signal**: Nintendo's Super Guide marks a level beaten-with-help in a different color, so the assist removes the wall but not the pride. Decide your stance from the experience you want, the same call as the difficulty-staircase versus slider choice in [principles.md](../design/principles.md). Discovery-first games (BotW drops the hint companion entirely) treat the absence of guidance as the content; assist-first games treat the stuck player as a retention problem. Both are valid; drifting between them by accident is not.
