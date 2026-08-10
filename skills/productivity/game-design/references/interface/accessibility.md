---
type: Reference
title: "Game Accessibility"
description: "Designing so more people can play. The major guidelines, the impairment categories and the features that serve them, assist and difficulty modes, the subtitle and text numbers, and the ethical, market, and legal case."
tags: [game-design, accessibility, ui, assist-modes, captions]
generated: { by: claude-code/unversioned, at: 2026-07-06T00:00:00Z }
---

# Game Accessibility

Designing so that more people can play, and a discipline the rest of the interface layer keeps pointing back to: the [interface.md](interface.md) readability floor, the [dialogue.md](dialogue.md) caption rules, the [menus-and-screens.md](menus-and-screens.md) settings surface, and the optional-guidance move in [guidance-and-feedback.md](guidance-and-feedback.md) are all accessibility decisions. The connective principle is the one from [principles.md](../design/principles.md): if you ship a punishing default, budget the accessibility floor first, because difficulty the player cannot opt to soften reads as broken rather than hardcore. The frame to hold throughout is **flexibility, not dilution**, remove the barrier without removing the challenge for those who want it.

## The guidelines worth knowing

Four references cover almost everything, and you do not have to invent any of it:

- **[Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/)** (a collaboration of studios, specialists, and academics). The practical starting point: a developer-friendly checklist tiered **Basic, Intermediate, Advanced** by a reach-versus-impact-versus-cost tradeoff, across six categories (motor, cognitive, vision, hearing, speech, general). Ship the Basic tier and you reach most people for little cost.
- **[Xbox Accessibility Guidelines](https://learn.microsoft.com/en-us/gaming/accessibility/guidelines)** (Microsoft, v3.2, 2023). The most concrete spec, with target numbers and per-guideline implementation notes. A best-practice catalog, explicitly not a compliance checklist.
- **[Accessible Player Experiences](https://accessible.games/accessible-player-experiences/)** (AbleGamers). A pattern framework built from disabled players' research, split into Access patterns and Challenge patterns, on the thesis that accessibility adds flexibility to challenge rather than erasing it.
- **The CVAA** (US, FCC-enforced). The one legal hook, and a narrow one: it requires only that in-game **communications** (voice chat, text chat) be accessible for games released on or after 1 January 2019. It does not require core gameplay to be accessible. Know its scope so you neither over- nor under-claim it.

## Impairment categories and the features that serve them

Two cross-cutting rules first, because they catch the most common mistakes: **never carry essential information on color alone** (pair it with shape, icon, or text), and **never carry it on sound alone** (pair it with a visual indicator). Then, by category:

| Category | Features that remove the barrier |
| --- | --- |
| **Motor** | Full control remapping, hold-to-toggle, auto-aim and lock-on, reduced or optional input mashing and QTEs, adjustable game speed |
| **Vision** | Scalable text (to 200% without loss), high contrast, colorblind modes, screen-reader menus, audio cues, a high-contrast game mode |
| **Hearing** | Subtitles for all important speech, closed captions for non-speech audio with speaker identification, separate volume sliders, visual sound and direction indicators |
| **Cognitive** | Clear and simple text, adjustable speed, objective reminders, reduced or optional time pressure, configurable difficulty |
| **Speech** | Speech-to-text and text-to-speech for voice chat, alternatives to voice-only communication |

The text and caption numbers, all at 1080p, all minimums: body text at least 26px on console scaling to 200% ([XAG 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101)), subtitles around 46px (Ian Hamilton), at most ~40 characters and two lines per caption, with speaker identification when ambiguous. These are the same floors as [interface.md](interface.md) and [dialogue.md](dialogue.md), gathered here.

## Assist and difficulty modes

The accessibility feature that draws the most heat, and the one worth getting right. The benchmarks:

- **Celeste's Assist Mode** is the template for granular, opt-in modification (game-speed slowdown, infinite stamina, invincibility, per-save), framed by Matt Thorson around "every player is different" and deliberately renamed from "Cheat Mode" so it would not feel judgmental. The framing to keep, from speedrunner Halfcoordinated: "a wheelchair ramp doesn't ruin stairs, braille doesn't ruin a book, and assist mode doesn't ruin a game".
- **The Last of Us Part II** is the breadth benchmark (60+ options, a menu screen reader, a high-contrast mode), and **God of War Ragnarök** adds navigation and traversal assists. These show that depth of accessibility is now a shippable AAA standard, not a stretch goal.

The "should every game have an easy mode" argument (the Sekiro discourse) is worth representing honestly: one side holds that a unified difficulty is authorial intent and central to the meaning of victory; the other holds that the playing field is not level for disabled players and that one person's assist setting in a single-player game costs no one else anything. The design resolution that satisfies both is granular, opt-in assists (slow the game 20%, grant one extra dash) over a single Easy toggle, the same self-tuning instinct as embedding difficulty in the mechanics from [frameworks.md](../design/frameworks.md), and the difficulty-staircase logic in [principles.md](../design/principles.md). The cautionary case for auditing which inputs your assists actually cover is Expedition 33: offensive timed hits could be auto-resolved from day one, but the defensive timing that actually gated survival could not be assisted on any difficulty, and the gap (later half-patched by widening Story-mode windows 40%) became the game's loudest accessibility criticism.

## The case

Make it for three reasons, in plain terms. The **ethical** case: removing barriers to a shared experience is simply right, and the flexibility-not-dilution frame answers the "but challenge" objection. The **market** case: a large population of players has some disability (the often-cited "46 million US gamers with disabilities" traces to AbleGamers via the ESA 2020 Essential Facts, so cite the chain rather than as a hard first-party stat), and most accessibility features (remapping, subtitles, scalable text, colorblind modes) help far more players than they were built for, including situational ones. The **legal** case is the CVAA's narrow communications requirement above. Lead with the ethical and market cases; the legal one is a floor, not the goal.
