---
type: Reference
title: "Game Interface and UX Foundations"
description: "The UX foundations under every game screen. Usability versus engageability, the diegesis matrix, game usability heuristics, the cognition that constrains an interface, and the readability floor."
tags: [game-design, ui, ux, hud, readability]
generated: { by: claude-code/unversioned, at: 2026-06-24T00:00:00Z }
---

# Game Interface and UX Foundations

The interface layer of the skill. Where [method.md](../design/method.md) reads a game by its mechanics, these notes read it by its screens, menus, prompts, and feedback, the surface the player actually touches. This file is the hub and the theory; the concrete surfaces are split across [menus-and-screens.md](menus-and-screens.md), teaching in [onboarding.md](onboarding.md), conversation in [dialogue.md](dialogue.md), wayfinding and acknowledgment in [guidance-and-feedback.md](guidance-and-feedback.md), and the universal-access floor in [accessibility.md](accessibility.md). The load-bearing idea: a brilliant mechanic the player cannot perceive, parse, or operate is a broken mechanic. UI is where dynamics become legible, so it is part of the design, not a coat of paint over it.

## Usability versus engageability

Celia Hodent's split ([The Gamer's Brain](https://celiahodent.com/gamers-brain-part-3-ux-engagement-immersion-retention-gdc17-talk/), 2017) is the frame to hold. Game UX has two separable jobs, and they fail for different reasons:

- **Usability** asks "can the player use it". Hodent's pillars: signs and feedback, clarity (are those signs perceived), form follows function, consistency, minimum workload, error prevention and recovery, and flexibility. The critical caveat: usability pillars apply only where friction is **accidental**. A Souls boss is hard on purpose; a menu the player cannot find is hard by accident. Never sand down intended challenge in the name of usability.
- **Engageability** asks "does the player want to keep going". Its pillars are motivation, emotion, and game flow. This is where the [frameworks.md](../design/frameworks.md) motivation and flow models live; usability gets out of the way, engageability pulls forward.

Diagnose a complaint by which side it is on. "I didn't know I could do that" and "I clicked the wrong thing" are usability. "It got boring" and "I stopped caring" are engageability. The fixes do not transfer.

## The diegesis matrix

The four-quadrant map for where a piece of interface lives, on two axes: is it part of the **fiction** (can the avatar perceive it), and is it in the game's 3D **space** or a 2D overlay. Coined in Fagerholt and Lorentzon's 2009 Chalmers thesis *Beyond the HUD*, brought into design practice by Marcus Andrews ([Game UI Discoveries](https://www.gamedeveloper.com/design/game-ui-discoveries-what-players-want), 2010, who credits them), and popularized by Anthony Stonehouse ([User interface design in video games](https://www.gamedeveloper.com/design/user-interface-design-in-video-games), 2014, often miscredited as the origin).

| Quadrant | In fiction | In 3D space | What it is | Exemplars |
| --- | --- | --- | --- | --- |
| **Non-diegetic** | No | No | A 2D overlay only the player sees | Most health bars, minimaps, hotbars |
| **Diegetic** | Yes | Yes | An object in the world the avatar could see | Dead Space spine health and holographic inventory, Metro 2033 wrist watch, Far Cry 2 paper map |
| **Spatial** | No | Yes | Rendered in the world but the avatar is not aware of it | Fable golden trail, Forza racing line, floating waypoints, Left 4 Dead ally outlines |
| **Meta** | Yes | No | A 2D screen effect representing the avatar's state | Blood splatter, low-health red vignette, BioShock screen distortion |

Use it as a placement tool, not a scorecard. Pushing UI toward diegetic deepens immersion but costs art, animation, and VFX, and risks the "minimal-HUD paradox" where the in-world version becomes less readable than the overlay it replaced (the HUD craft is in [menus-and-screens.md](menus-and-screens.md)). A single element can span quadrants, and the right answer is whatever keeps gameplay-critical information legible where the player already looks. Far Cry 2's map is the canonical lesson: it is diegetic because Jack physically raises it, the world does not pause while he reads it, and shade can make it hard to see, immersion and friction in the same object.

## Usability heuristics for games

Nielsen's ten usability heuristics give a precise vocabulary for traditional interface faults and still apply, but they say nothing about what makes a game worth playing (fun, challenge, story, emotion), which is exactly why game-specific sets were built to extend them: Desurvire's HEP ([CHI 2004](https://dl.acm.org/doi/10.1145/985921.986102), 43 heuristics over game play, story, mechanics, usability), the empirically refined PLAY ([Desurvire and Wiberg, 2009](https://link.springer.com/chapter/10.1007/978-3-642-02774-1_60)), and Pinelle, Wong and Stach's set derived from analyzing 108 GameSpot reviews ([CHI 2008](https://dl.acm.org/doi/10.1145/1357054.1357282)). Treat them as an inspection checklist when reviewing a build; the design-review smell catalog in [critique.md](../design/critique.md) folds the most load-bearing ones in.

## The cognition the interface has to respect

Every UI rule below is downstream of a hard limit on human attention, memory, and motor control:

- **Attention is selective.** You do not see what you do not attend to. A sign that is present but not noticed is functionally absent, so signs need salience (size, contrast, motion), not just existence. This is Hodent's signs-and-feedback plus clarity pillars in one sentence.
- **Working memory is tiny.** Cowan's focus-of-attention capacity is about four chunks (Miller's older 7±2 is the rhetorical ceiling). Do not ask the player to hold state across screens; show it where it is used.
- **Hick's law** ([1952](https://lawsofux.com/hicks-law/)): choice time grows with the number of options, so chunk long menus into grouped submenus rather than one flat list.
- **Fitts's law** ([1954](https://www.yorku.ca/mack/hhci2018.html)): time to hit a target falls as it gets bigger and closer, so make frequent actions large and near, and exploit screen edges and corners, which are effectively infinite-size targets.

Caveat worth stating: Hick and Fitts are mouse-cursor models. On a controller, navigation is discrete, so a clear focus and selection state, sane focus order, and wrap-around matter more than raw pixel distance. Together these are why "minimum workload" earns its place as a usability pillar: cognitive budget spent parsing the UI is budget not spent on the game.

## The readability floor

Text too small to read is the most common, most fixable usability failure, born of the "10-foot problem": UI is authored on a near PC monitor but consumed from a couch on a TV. Concrete floors people cite (all tied to 1080p, so rules of thumb, not standards):

- **Body text**: a minimum of 28px per the [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/use-an-easily-readable-default-font-size/), 26 to 52px on console per [Xbox Accessibility Guideline 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101), and these are minimums, not targets.
- **Subtitles**: about 46px (Ian Hamilton), covered with the rest of caption practice in [accessibility.md](accessibility.md) and [dialogue.md](dialogue.md).
- **Contrast**: games borrow WCAG, roughly 4.5:1 for normal text and 3:1 for large; prefer sans-serif and never carry information on color alone.

The cheap test: shrink your UI mockup to about a third of screen size on a desktop monitor. If you cannot read it shrunk, it will not read from the couch. Make text user-scalable and you have turned the single most-complained-about issue into a setting.
