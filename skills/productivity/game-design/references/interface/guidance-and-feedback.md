---
type: Reference
title: "Guidance and Feedback"
description: "How a game tells the player where to go and acknowledges what they did. Wayfinding and signposting, affordances and feedforward, juice for the interface and its counterweight, error prevention, and the waypoint debate."
tags: [game-design, guidance, feedback, signposting, juice]
generated: { by: claude-code/unversioned, at: 2026-06-24T00:00:00Z }
---

# Guidance and Feedback

The two halves of the conversation between game and player that are not dialogue: **guidance** (where do I go, what can I do) before an action, and **feedback** (what just happened) after it. Three timing windows are worth keeping distinct, because each is a different design problem: a **signifier** says "this is interactable", **feedforward** says "here is what this action will do", and **feedback** says "here is what happened". Guidance is the gentle cousin of the honest telegraph in [critique.md](../design/critique.md) and [principles.md](../design/principles.md); feedback is the UI-scale relative of game feel in [frameworks.md](../design/frameworks.md).

## Wayfinding and signposting

Lead the eye through the world without a HUD arrow. The toolkit:

- **Light, color, and contrast.** A saturated accent the player learns to follow. Mirror's Edge's [runner vision](https://www.ea.com/news/runners-vision-in-mirrors-edge-catalyst) paints the path red; Valve's level designers use warm-versus-cool lighting to cue safety versus threat. The player keeps camera control, which a waypoint marker takes away.
- **Leading lines and landmarks.** Architecture, paths, and a distant "weenie", Disney Imagineering's term for a visual magnet that draws guests forward (Mickey's 10 Commandments, via Marty Sklar). Breath of the Wild runs on this: its towers and the ever-visible Hyrule Castle pull the player across an open world without a quest marker.
- **The golden (critical) path.** The idealized route through a level. Author it deliberately, then place the optional content off it, so the player who follows their eye succeeds and the player who explores is rewarded.

## Affordances, signifiers, and feedforward

The vocabulary is Don Norman's: an affordance is a possible action, a [signifier](https://jnd.org/signifiers-not-affordances/) is the perceivable cue for it, and feedforward (Djajadiningrat et al., DIS 2002) previews the *outcome* before the player commits. The live design argument here is the **yellow-paint debate** (reignited 2024 by Final Fantasy VII Rebirth, Resident Evil 4, and Assassin's Creed Shadows, which [added paint after playtests showed players could not tell what was climbable](https://kotaku.com/yellow-paint-debate-ff7-rebirth-demo-resident-evil-4-1851249608)): literal paint on every interactable reads as patronizing, but its absence strands players. The synthesis most designers land on: make the signposting **optional** (a toggle) or **diegetic** (worn rope, chalk, wear marks) rather than a uniform overlay, so it guides the players who need it without insulting the ones who do not.

## Juice for the interface, and its counterweight

Feedback presentation, the number pop, the reward toast, the confirmed-selection snap, is what makes an identical mechanic feel responsive. Make it carry information, not just sparkle: color-code magnitude (a crit reads differently from a tick), prioritize what matters, and stack notifications so they do not bury each other.

The counterweight is the one most often forgotten. **Over-juicing hides game state.** When the screen fills with particles and wobbling numbers, the player cannot read what mattered, and feedback becomes a smokescreen for a thin underlying system. Strategy and decision-heavy moments in particular need calm and clarity over flash. The core game-feel theory (Swink, "Juice it or lose it", the Art of Screenshake) is in [frameworks.md](../design/frameworks.md); the rule for the interface is the same as for the HUD, juice only as far as it keeps the state legible.

## Error prevention and confirmation

Nielsen's heuristics carry straight over. **Error prevention** (#5) beats good error messages: the best design stops the mistake happening. **User control and freedom** (#3) wants an emergency exit, which is why **undo beats confirm** wherever it is feasible (act immediately, offer an undo affordance) rather than interrogating every action. When undo is impossible, match the friction to the stakes:

- Routine action: no confirmation.
- Destructive but recoverable: a confirm with **default focus on the safe option**, so a reflexive press cancels rather than commits.
- Irreversible (delete save, spend a rare currency): a deliberate gesture like **hold-to-confirm**, which moves the action from reflex to a conscious decision without cluttering the UI.

Over-confirming is its own failure: confirmation spam trains the player to dismiss every dialog, so the one that mattered gets clicked through too. This is the [menus-and-screens.md](menus-and-screens.md) respect-the-player's-time principle at the level of a single button.

## Orientation feedback and the waypoint debate

Objective markers, compasses, and minimaps are the most contested guidance tool. Mark Brown's ["Following the Little Dotted Line"](https://www.youtube.com/watch?v=FzOCkXsyIqo) (2015) frames it: a marker makes navigation trivial but dissolves exploration and the skill of reading a world, the "follow the GPS line" critique. The tells:

- Marker-saturated worlds (Skyrim's compass, marker-heavy open worlds) reduce travel to connect-the-dots.
- The better default is BotW's: markers are **on but fully disable-able without breaking the game**, and they mark places the player physically saw, so they feel earned.

The design move is to prefer **diegetic guidance**, landmarks, NPC directions, in-world signs, so the player navigates by reading the world rather than the HUD, and to make any hand-holding layer something the player can switch off. That choice is also an accessibility setting; see [accessibility.md](accessibility.md).
