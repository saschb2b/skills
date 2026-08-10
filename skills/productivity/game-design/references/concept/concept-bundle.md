---
type: Specification
title: "The Game Concept Bundle"
description: "What a game concept bundle is and the files it contains. A small OKF bundle in the game repo holding the game's identity: a fixed seed trio (vision, pillars, loop), draft elaboration areas, a macro written at pre-production exit, and a design log. The surface all later work is tested against."
tags: [game-design, concept, pitch, vision, okf]
generated: { by: claude-code/fable-5, at: 2026-08-10T00:00:00Z }
sources:
  - id: ryan-anatomy
    resource: https://www.gamedeveloper.com/design/the-anatomy-of-a-design-document-part-1-documentation-guidelines-for-the-game-concept-and-proposal
    title: "Tim Ryan, The Anatomy of a Design Document, Part 1 (1999)"
  - id: cerny-method
    resource: https://www.scribd.com/presentation/636445139/020913-Cerny-Method
    title: "Mark Cerny, Method (D.I.C.E. Summit 2002)"
  - id: lemarchand-macro
    resource: https://www.gamespot.com/articles/naughty-dog-designer-maps-out-uncharted-2-development/1100-6251473/
    title: "Richard Lemarchand on the Uncharted 2 macro"
  - id: sweatman-death-gdd
    resource: https://mcvuk.com/development-news/death-of-the-game-design-document/
    title: "James Sweatman, Death of the game design document"
  - id: librande-one-page
    resource: https://gdcvault.com/play/1012356/One-Page
    title: "Stone Librande, One-Page Designs (GDC 2010)"
  - id: cook-design-logs
    resource: https://lostgarden.com/2011/05/03/game-design-logs/
    title: "Daniel Cook, Game Design Logs (2011)"
  - id: upton-pitch
    resource: https://www.youtube.com/watch?v=4LTtr45y7P0
    title: "Brian Upton, 30 Things I Hate About Your Game Pitch (GDC 2017)"
  - id: allgeier-structure
    resource: https://www.directingvideogames.com/2017/08/01/provide-structure/
    title: "Brian Allgeier, Provide Structure (Directing Video Games)"
---

# The Game Concept Bundle

A game concept bundle is a small OKF bundle, versioned in the game's own repository (a `concept/` directory, or `docs/concept/`), that holds the game's identity in one navigable place: what the game is, what it refuses to be, what the player does, and how every later area (world, art, audio, cast, enemies, systems, scope) serves that. It is the home of the initial spark and the surface every proposed feature, asset, and tuning value is tested against before work starts. It is seeded once with care ([seeding.md](seeding.md)) and then tended for the life of the project ([tending.md](tending.md)); copy-paste scaffolds for every file are in [templates.md](templates.md).

The shape follows what replaced the monolithic design document. The hundred-page GDD written before the game exists is a known failure: nobody reads it, and it delays the discovery that the game is not fun until production.[^sweatman-death-gdd] What works instead is a small fixed spine plus flexible living detail: Cerny's Method forbids the big up-front document and produces a macro of five pages or less only at the end of pre-production, with per-feature micro design deferred into production.[^cerny-method] Uncharted 2 shipped within five to ten percent of its macro, the empirical case that a short fixed spine outlasts a long mutable tome.[^lemarchand-macro] Each file stays short and single-concern, in the spirit of one-page design.[^librande-one-page]

## Why an OKF bundle

Markdown files with frontmatter, next to the code, need no tool and survive every engine and agent switch. OKF adds what loose files lack: an `index.md` for progressive disclosure, `status` for the draft-to-stable lifecycle, `generated` for who last shaped a file, and `verified` to record that a human signed off the seed, which is exactly the "polished spark, approved before code" contract. A concept bundle follows the same conformance rules as any bundle: every concept file carries a non-empty `type`, `index.md` and `log.md` stay reserved, links are relative, and `okf-validate --strict` passes after every change.

## The file set

| File | `type` | What it holds | At seed |
| --- | --- | --- | --- |
| `index.md` | reserved | The one-screen pitch: x-statement, pillar list, links to everything. Doubles as the pitch surface. | Written |
| `vision.md` | Vision | X-statement, experience goal, genre, platform, audience. | Written, signed off |
| `pillars.md` | Design Pillars | Three to five one-sentence rules, each with what it rejects. | Written, signed off |
| `loop.md` | Core Loop | The player's verbs and the loop stack, 30 seconds to meta. | Written, signed off |
| `world.md` | World | Setting, tone, story premise; grows a story macro table later. | Draft stub |
| `characters.md` | Cast | Player character and moveset, key allies and NPCs. | Draft stub |
| `enemies.md` | Enemy Roster | Enemy roles and how each one pressures the loop. | Draft stub |
| `systems.md` | Systems | Items, equipment, loot, economy, progression, difficulty scaling. | Draft stub |
| `art-direction.md` | Art Direction | Visual target, references, palette and mood; grows a color script. | Draft stub |
| `audio-direction.md` | Audio Direction | BGM intent per mood, SFX character, rules for silence and dynamics. | Draft stub |
| `macro.md` | Design Macro | The five-pages-or-less table of levels, mechanics, enemies, story beats.[^cerny-method] | Empty; written at pre-production exit, then frozen |
| `scope.md` | Scope and Risks | Team fit, roadmap, the cut list, named risks and what the prototype must prove. | Risks named |
| `log.md` | reserved | Dated decisions, playtest notes, prunings, each with its reason. | First entry |

Extend the set only when the game demands it (a `pitch.md` deck skeleton for publisher outreach, a `prototype.md` defining first-playable done criteria); an area too thin to say anything about stays a stub rather than becoming invented content.

## The seed trio is load-bearing

`vision.md`, `pillars.md`, and `loop.md` are the only files that must be genuinely written, not stubbed, before any code. Every source chain converges on exactly these three: a pitch is judged on the hook, the fantasy, and the gameplay, and must answer whether the game is worth making and whether this team can make it;[^upton-pitch] the pillars are the filter that accepts and rejects every later feature; and the loop is the thing the first prototype must prove as a whole, because separate prototypes cannot show how interconnected systems feel together.[^cerny-method] Everything else is elaboration, a pre-production exit artifact (the macro), or process machinery (scope and the log[^cook-design-logs]).

## Relation to the rest of this skill

The bundle is where this skill's own lens gets persisted: the x-statement in `vision.md` names the iconic mechanic, the pillars encode the core dialectic, and `loop.md` is the macro loop, all defined in [the dissection method](../design/method.md). The `check` motion in [tending.md](tending.md) runs proposed work against the seed using the smell catalog in [the critique playbook](../design/critique.md). Allgeier's structure documents (story macro, visual macro, color script) are the growth targets for `world.md` and `art-direction.md`.[^allgeier-structure]

[^sweatman-death-gdd]: Sweatman, MCV/Develop. "The idea of writing thousands of words about a game that didn't exist started to feel maddening."
[^cerny-method]: Cerny, D.I.C.E. 2002. Macro design of five pages or less at pre-production exit; micro design just-in-time in production; the publishable first playable is the gate.
[^lemarchand-macro]: Lemarchand, GameSpot interview. The Uncharted 2 macro was a 70-row spreadsheet; the shipped game deviated by 5 to 10 percent.
[^librande-one-page]: Librande, GDC 2010. "The goal of design is to efficiently communicate ideas."
[^upton-pitch]: Upton, GDC 2017. A pitch answers two questions: is this game worth making, and can this team make it.
[^cook-design-logs]: Cook, Lostgarden 2011. Dated log entries prevent decisions made in side conversations from being lost or relitigated.
[^allgeier-structure]: Allgeier, Directing Video Games. Macro design, story macro, visual macro, and color script as the structure documents.
