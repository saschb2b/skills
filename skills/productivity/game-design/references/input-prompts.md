---
type: Reference
title: "Input Prompts and Button Glyphs"
description: "The most literal signifier, the key or button hint. Where to place it, swapping glyphs to the active device, keeping it rebinding-aware, glyph asset sources, encoding tap versus hold, and the console and accessibility rules."
tags: [game-design, ui, input, controls, accessibility]
generated: { by: claude-code/unversioned, at: 2026-06-24T00:00:00Z }
---

# Input Prompts and Button Glyphs

The input prompt is the most literal [signifier](guidance-and-feedback.md) there is: it names the exact key or button to press. It is also how a game teaches its verbs, the button-prompt-only tutorial in [onboarding.md](onboarding.md). The design question is almost never whether to show it, but how, where, and how it adapts, because the same prompt has to stay correct across a keyboard, three console pads, and a player who remapped their controls.

## Where to put it

Four placements, used together, each for a different job:

| Placement | What it is | Use for |
| --- | --- | --- |
| **Contextual prompt** | A hint anchored on or near the interactable ("Press E to open"), often world-anchored | The moment-to-moment "you can act here" cue |
| **Persistent legend** | A fixed action bar or corner list of the currently-relevant actions | A stable, small action set the player references |
| **Controls screen** | The full action-to-key map in the pause or options menu | The reference of last resort, and an accessibility requirement |
| **First-use, then fade** | A prompt shown the first time a verb is available, then retired | Teaching without permanent clutter |

The contextual prompt is where the diegesis question from [interface.md](interface.md) bites: Dead Space's in-world door holograms are diegetic (the character sees them), while the visually near-identical Callisto Protocol prompts are spatial (projected for the player only). Over-prompting has a real cost, an interface that labels and confirms everything clogs up, so prefer fading a prompt once the verb is learned over showing it forever.

## Show the right device

When a prompt shows an Xbox glyph to a player on a DualSense, it has lied, and the player has to translate. The convention, from Zach Burke's [5 Golden Rules of Input](https://www.gamedeveloper.com/design/the-5-golden-rules-of-input) (2015), is to **swap every on-screen glyph to match the last-used device**, detected with a timestamp engine (store the time of the last real event per device, most recent wins). Two caveats from the same source: an analog stick drifts, so require a minimum movement before it counts as a device switch, and hide the mouse cursor when the player is on a pad. The failure mode is showing the wrong brand's glyphs or a generic "Button 1"; for an unrecognized pad, fall back to a sensible generic prompt, not the wrong branded one. Engine support is now standard (Unreal's CommonUI, Unity input-prompt packages, and Steam Input below).

## Show the right key

A prompt must display the **actual currently-bound** control, not a hardcoded glyph, or it goes wrong the instant the player remaps. This is why the [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/allow-controls-to-be-remapped-reconfigured/) prefer in-game remapping (so prompts reflect the current mapping) and rank "allow controls to be remapped" a Basic-tier, best-value accessibility feature, it also serves AZERTY and alternative-controller users, not only motor impairments. The implementation rule is to re-read the binding when you draw the prompt, never bake the glyph in. The remapping surface itself lives in settings; see [menus-and-screens.md](menus-and-screens.md) and [accessibility.md](accessibility.md).

## Glyph assets and the Sony trademark gotcha

[Steam Input](https://partner.steamgames.com/doc/api/isteaminput) is the reference implementation: `GetGlyphForActionOrigin` returns a device-correct glyph for whatever the player has bound (a PlayStation pad shows PlayStation buttons), `GetStringForActionOrigin` gives the localized label, and because origins are queried live the prompt stays correct after a rebind and future-proofs to hardware Valve adds later. An action can have several bound origins, so cycle through them rather than assuming one. For art, several free packs cover every device: Xelu's prompts and Kenney's input prompts (both CC0), PromptFont (an SIL-licensed glyph font), and Mr. Breakfast's prompts (CC0). The licensing gotcha worth knowing: the PlayStation cross, circle, square, and triangle shapes are Sony trademarks, so a CC0 pack often omits them (OpenGameArt strips them from Xelu's pack) and you source those four separately.

## Encode the input type, and respect the platform

A glyph also has to say *how* to press. Tap, hold (a fill ring that completes over the hold and cancels if released early, the hold-to-confirm gesture from [guidance-and-feedback.md](guidance-and-feedback.md)), mash, a chord, or a stick or d-pad direction each get a distinct treatment. Two hard constraints close it out:

- **Platform rules.** Console certification requires correct first-party button names and glyphs, and the layouts genuinely differ: the PlayStation cross-versus-circle confirm mapping varies by region and era (and PS5 standardized cross-to-confirm at the system level while letting games keep their own), and Nintendo's A and B sit in the opposite physical positions from Xbox, so you cannot reuse one glyph set across platforms.
- **Accessibility.** Pair every glyph with a text label, not a glyph alone ([Xbox Accessibility Guideline 106](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/106), narrated as "A to Select", and labeled correctly, "Left mouse button", not "symbol"). The character inside the glyph, not just the button outline, has to clear the readability floor and scale to 200% ([XAG 101](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/101)). And never lean on the PlayStation face-button colors alone; color is never the only channel.
