---
type: Reference
title: "Menus, Screens, and the HUD"
description: "Designing the non-play surfaces. Menu information architecture, HUD philosophies from maximal to diegetic, the lifecycle screens from title to game-over, and respecting the player's time."
tags: [game-design, ui, menus, hud, screens]
generated: { by: claude-code/unversioned, at: 2026-06-24T00:00:00Z }
---

# Menus, Screens, and the HUD

The surfaces around play: the menus the player navigates, the HUD that overlays the action, and the lifecycle screens that bracket a session. These are where a game spends the player's patience, so the governing principle is **respect the player's time**, with the [interface.md](interface.md) cognition limits (Hick, Fitts, the readability floor) as the constraints. Two living corpora are worth keeping open while you work: the [Game UI Database](https://www.gameuidatabase.com/) (Edd Coates, ~1,300 titles filterable by screen type) and [Interface In Game](https://interfaceingame.com/).

## Menus and information architecture

A menu is a decision tree the player walks under Hick's law, so the structure is the design:

- **Chunk by frequency and depth.** Group options into a shallow hierarchy rather than one long flat list; keep the things players touch every session (resume, loadout) one input away and bury the things they set once (key bindings) deeper. Breadth costs scanning time, depth costs navigation steps; balance against how often each option is used.
- **Design for the input.** On a controller, raw Fitts distance matters less than a loud, unambiguous focus and selection state, a sane focus order, and wrap-around at the ends. On mouse and touch, larger and nearer targets win, and radial or pop-up menus beat dropdowns because the cursor does not travel. The Game UI Database keeps a Button Layouts facet precisely because the input changes the calculus.
- **Settings are an accessibility surface, not an afterthought.** Control remapping, text size, subtitle options, colorblind modes, and difficulty live here; burying or omitting them is an access regression. See [accessibility.md](accessibility.md).

## HUD philosophies

The HUD is a standing negotiation between information and immersion. The spectrum, with the four-quadrant placement logic from [interface.md](interface.md):

| Approach | What it does | Cost | Exemplars |
| --- | --- | --- | --- |
| **Maximal / informative** | Everything on screen, always | Clutter, split attention | Steel Battalion cockpit, MGS soliton radar, MMO raid frames |
| **Minimal / dynamic** | Elements fade in only when relevant | Player can miss state if the rule is unclear | The Last of Us, Metro 2033 (mask fog and breathing instead of a HUD) |
| **Diegetic** | Information lives on in-world objects | Expensive to build, can become less readable than the overlay | Dead Space spine health, Far Cry 2 map, Metroid Prime visor |

The honest counterweight is the **minimal-HUD paradox**: directors often want both fully diegetic UI and all system information visible at once, two conflicting extremes, and when the diegetic version is tackled late it collapses into clutter that defeats the immersion it was for. Diegetic UI only pays off with early, focused playtesting that confirms gameplay-critical information stays readable and sits where the player already looks. Minimal is not automatically better; the test is always whether the player can read the state they need at the moment they need it.

## The lifecycle screens

Each bracketing screen has a job; the failures come from forgetting it.

- **Title and "press start".** The front door. The friction here (multi-second logos, a needless start gate) is the first thing the player feels, so make every logo skippable on any input after the first view and never gate the options menu behind the intro. Unskippable splash logos exist for asset loading and legal display reasons, and players hate them anyway; engineer around them.
- **Loading screens.** Originally a canvas free of in-game tech limits, now mostly a mask for streaming the world. Fill them with tips, lore, or play: Namco's loading-minigame patent (US 5,718,632, the Galaxian-in-Ridge-Racer trick) [chilled the feature for two decades until it expired in 2015](https://www.eff.org/deeplinks/2015/12/loading-screen-game-patent-finally-expires), so the minigame is fair game again. The modern move is to hide the load entirely behind an elevator, a slow door, or a squeeze-through gap (God of War), which doubles as cinematic pacing.
- **Pause and suspend.** Let the player stop without penalty. Suspend saves and Quick Resume make leaving cheap; the design cost is auditing audio, physics, and AI to be freeze-safe.
- **Death and game-over.** The screen the player sees most in a hard game, so it is a time-respect test (see below), not a place for a long animation or an unskippable cutscene.
- **Results, score, and victory.** The payoff recap: performance (time, deaths, combo, rank) plus progression (XP, unlocks, rewards). The common failure is trapping the player on a scoreboard they cannot dismiss. Reward-schedule theory for what to surface here is in [systems.md](../design/systems.md).

## Respect the player's time

The principle that ties the lifecycle screens together, and the one players notice in its absence:

- **Never make the player re-watch or re-traverse to retry.** An unskippable cutscene before a hard checkpoint is the single most-resented anti-pattern. Instant fail-and-retry (Celeste, Hotline Miami) keeps the player in the flow corridor from [frameworks.md](../design/frameworks.md). The honest caveat: frictionless retry can also enable rote memorize-and-perfect grinding, so pair it with checkpoints that actually move the player forward.
- **Match friction to stakes.** Confirm destructive, irreversible actions (delete save, sell a rare); do not confirm routine ones. Confirmation spam trains the player to click through every dialog blindly, which defeats the one confirmation that mattered. The error-prevention craft is in [guidance-and-feedback.md](guidance-and-feedback.md).
- **Make the set-once things fast to reach and the every-session things faster.** This is just Hick and Fitts applied to a real player's week.
