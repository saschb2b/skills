---
type: Playbook
title: "Seeding a Game Concept"
description: "The elicitation interview and scaffolding procedure that turns a game idea into a concept bundle. Hook first, then experience goal, pillars, loop, then one light pass over each elaboration area; write the seed trio for real, stub the rest, validate, and stop before the macro."
tags: [game-design, concept, elicitation, pitch, playbook]
generated: { by: claude-code/fable-5, at: 2026-08-10T00:00:00Z }
sources:
  - id: fullerton-workshop
    resource: "Tracy Fullerton, Game Design Workshop (book), the x-statement"
    title: "Game Design Workshop"
  - id: lemarchand-playful
    resource: https://mitpress.mit.edu/9780262045513/a-playful-production-process/
    title: "Richard Lemarchand, A Playful Production Process (MIT Press 2021)"
  - id: wireframe-pillars
    resource: https://www.raspberrypi.com/news/how-pillars-and-triangles-can-focus-your-game-design/
    title: "Wireframe, How pillars and triangles can focus your game design"
  - id: hauteville-pillars
    resource: http://technicalgamedesign.blogspot.com/2011/04/pillars.html
    title: "Cedric Hauteville, Pillars"
  - id: upton-pitch
    resource: https://www.youtube.com/watch?v=4LTtr45y7P0
    title: "Brian Upton, 30 Things I Hate About Your Game Pitch (GDC 2017)"
  - id: cerny-method
    resource: https://www.scribd.com/presentation/636445139/020913-Cerny-Method
    title: "Mark Cerny, Method (D.I.C.E. Summit 2002)"
  - id: schafer-amnesia
    resource: https://www.doublefine.com/games/amnesia-fortnight
    title: "Double Fine, Amnesia Fortnight"
---

# Seeding a Game Concept

Run an interview in this order, write the seed trio for real, stub the rest, scaffold the bundle from [templates.md](templates.md), and stop. The seed is done when `vision.md`, `pillars.md`, and `loop.md` together would survive the two pitch questions: is this game worth making, and can this team make it.[^upton-pitch] Do not aim for completeness anywhere else; the pitch's only job is to earn a prototype, not to pre-answer production.[^schafer-amnesia] The anatomy of the bundle being seeded is in [concept-bundle.md](concept-bundle.md).

The interview is a conversation, not a form. Ask, push back, reflect the answer sharper than it was given, and only then write. Use the axes from [the dissection method](../design/method.md) in reverse: instead of extracting the iconic mechanic and core dialectic from a finished game, choose them for one that does not exist yet.

## The interview, in order

1. **The hook.** What is the one phrase this game would be named by, and what does it feel like? Compress into an x-statement: a comparison anchor to something known plus a phrase that carries the fantasy ("Slay the Spire, but every card is a body part you amputate").[^fullerton-workshop] If no phrase lands, the center has not been found; keep digging before touching anything else.
2. **The experience goal.** What should the player feel: dread, mastery, greed, tenderness, flow? This is MDA run in the designer's direction, aesthetics chosen first, mechanics derived later ([frameworks](../design/frameworks.md)). Lemarchand's ideation phase ends exactly here, with a written experience goal the rest of the project is checked against.[^lemarchand-playful]
3. **The pillars.** Three to five rules, each one sentence, phrased in active feel-first language ("every fight is a puzzle the player can flee", not "deep combat").[^wireframe-pillars] For each pillar record what it rejects, because a pillar that rejects nothing filters nothing (id's push-forward combat pillar rejected cover and reloading). Mark which pillars are selling points and which are quiet commitments like accessibility; a pillar need not be a marketable feature.[^hauteville-pillars]
4. **The loop.** What does the player literally do in 30 seconds, in 5 minutes, in a session, and across the campaign or meta? Name the verbs, what each cycle yields, and what that yield feeds. Write it as the loop stack ([frameworks](../design/frameworks.md)) and flag the layer the first prototype must prove; the loop must be proven whole, not as separate pieces.[^cerny-method]
5. **The elaboration pass.** One light pass per area, capturing only what the idea already implies. For each area the seed questions are:
   - `world.md`: where and when is this, what tone, what is the story premise in two sentences, what does the fiction make the loop mean?
   - `characters.md`: who is the player, what is their moveset or ability language, who else matters?
   - `enemies.md`: what kinds of opposition exist and what does each demand of the player's verbs?
   - `systems.md`: what does the player collect, equip, spend, and unlock; what grows over a run and over the campaign; what scales difficulty?
   - `art-direction.md`: what does it look like, name three reference works, what palette and mood, what must never appear?
   - `audio-direction.md`: what does it sound like, what is the BGM doing emotionally, what SFX character (crunchy, soft, diegetic), when is it silent?
   - `scope.md`: who is building this, how long, what is the single hardest thing the prototype must de-risk?[^upton-pitch]
   An unanswered question written down beats an invented answer; stubs carry `status: draft` and an `# Open questions` section.
6. **Scaffold.** Create the directory, write `index.md` (the one-screen pitch), the seed trio, the stubs, `scope.md`, and the first `log.md` entry, all from [templates.md](templates.md). Validate with `okf-validate --strict` and fix anything it reports.
7. **Sign-off.** Read the trio back to the developer. When they confirm it says what they mean, record a `verified` event with their `human:` identity on those three files. That confirmation is the contract [tending.md](tending.md) later protects.

## What not to write at seed

- **The macro.** Level count, level contents, and structure are pre-production exit work, written after prototyping has taught the team what the game is; writing it at seed is the hundred-page-GDD mistake in miniature.[^cerny-method]
- **Monetization depth.** One line naming the model is enough; strategy comes later.[^upton-pitch]
- **Backstory beyond play.** World material earns its place by making the loop mean something; lore that never touches a verb goes nowhere at seed.[^upton-pitch]
- **Numbers.** Drop rates, prices, and curves are tuning, not concept. The concept records which numbers will exist and what each must express.

[^fullerton-workshop]: Fullerton, Game Design Workshop. The x-statement is the creative center: a comparison anchor plus a phrase that makes it sound fun.
[^lemarchand-playful]: Lemarchand, A Playful Production Process. Ideation ends with a written experience goal and design goals.
[^wireframe-pillars]: Wireframe magazine. About three pillars, one sentence each, active language, focused on how players will feel.
[^hauteville-pillars]: Hauteville, Technical Game Design blog. A pillar is not necessarily a USP, but every USP should be a pillar.
[^upton-pitch]: Upton, GDC 2017. Gameplay over backstory, monetization in one line, make the prototype prove the hard thing, know your scope.
[^cerny-method]: Cerny, D.I.C.E. 2002. Pre-production is chaotic by nature; the macro comes at its end, and the loop is proven as a whole.
[^schafer-amnesia]: Double Fine's Amnesia Fortnight pitches are minutes long; the pitch earns the two-week prototype, and the prototype proves the concept.
