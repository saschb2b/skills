---
type: Playbook
title: "Transitions: Screen, Scene, and Audio"
description: "Moving between screens, spaces, and states. What a transition is for, the visual vocabulary, the frequency-as-budget rule, a per-case playbook, the audio craft (fade, crossfade, duck, bar-synced), and the accessibility limits."
tags: [game-design, transitions, audio, pacing, ui]
generated: { by: claude-code/unversioned, at: 2026-06-24T00:00:00Z }
---

# Transitions: Screen, Scene, and Audio

The moment between two screens, spaces, or states: main menu into the save, in and out of the pause menu, through a door, death back to spawn, room to room in a dungeon. It runs on two channels at once, the visual cut and the audio handoff, and most "it feels off" problems are one of them fighting the other. This is the procedure; the screens themselves are in [menus-and-screens.md](menus-and-screens.md), the juice that dresses a transition (and its over-juice counterweight) is in [guidance-and-feedback.md](guidance-and-feedback.md), and the pacing it serves is the flow corridor in [frameworks.md](../design/frameworks.md).

## What a transition is for

A transition does a practical job and an expressive one at once: it masks a load, signals a context change, preserves or deliberately breaks the player's sense of place, controls pacing and emotion, and hides a teleport. Borrow the film-editing frame. The goal of continuity editing is an *invisible* cut, and Walter Murch's Rule of Six ranks what a cut must serve, emotion first (he weights it 51%, above rhythm, eye-trace, and spatial continuity combined), so when something has to give, sacrifice spatial continuity before emotional truth. The two failure modes to design against, from Radek Koncewicz's [Smooth Transitions](https://www.gamedeveloper.com/design/smooth-transitions) (2010), are **disorientation** (a sudden camera or context jump the player cannot place) and **helplessness** (control yanked away). God of War (2018) is the extreme case: one unbroken shot, no cuts, to keep the player inside the emotion.

## The visual vocabulary

Match the motion to the spatial truth. The type you pick is a sentence about what just happened:

| Type | Reads as | Use for |
| --- | --- | --- |
| **Cut (abrupt)** | Immediacy, same continuous moment | Instant, frequently-repeated, same-space changes |
| **Fade to black** | A hard break, time passing | Scene change, sleep, death, chapter end |
| **Fade to white** | Ambiguity, revelation, a dream | Flashbacks, visions, soft resets |
| **Crossfade / dissolve** | Two things merging, time eliding | Gentle montage, map to world |
| **Directional wipe / slide / push** | Movement through space, the map preserved | Room-to-room, keeping the player's mental map |
| **Diegetic (door, elevator, camera push)** | You never left the world | Interior to exterior, masking a load in-fiction |

The deepest choice is continuity versus disorientation. A directional slide that matches the way the player walked keeps the spatial relationship intact (the classic Zelda screen-scroll); a cut to black erases distance on purpose (teleport, fast-travel, a dream). Pick the one that tells the truth about where the player now is. Link's Awakening's remake went seamless precisely because per-screen transitions made the [map hard to hold and players got lost](https://www.dualshockers.com/aonuma-seamless-transitions-links-awakening/).

## Length is a budget, spent by frequency

The single most useful rule: **a transition the player sees hundreds of times must be near-instant; a rare dramatic one can take its time.** A room-to-room wipe in a roguelite should be a fraction of a second; a once-a-run death or a boss reveal can hold for a beat. For short loads, overlay a spinner on the frozen world rather than a full-screen load screen, and only show a progress bar past a few seconds ([McBride-Charpentier](https://www.gamedeveloper.com/design/game-design-rules-loading-screens), 2009). A two-second transition is fine once and a tax a hundred times.

## The per-case playbook

The situations you actually hit, on both channels:

| Situation | Visual | Audio |
| --- | --- | --- |
| **Main menu to game** | Fade, or a diegetic camera push that masks the load | Let the menu theme fade or carry; resolve the change on a musical beat, not mid-phrase |
| **Pause in and out** | Instant; freeze, dim, and blur the background; no heavy animation, fully reversible | Keep the game audio playing but push it "behind glass" with a low-pass filter and a volume duck; reserve a separate track for deep menu dives only |
| **Interior to exterior** | Diegetic door-fade, or seamless streaming behind the door | Crossfade the ambience beds and swap the reverb for the new acoustic space |
| **Death to respawn** | A held beat (slow-mo, vignette, fade to black or red, a "YOU DIED"-style punctuation), then the load, then fade in at spawn | Cut or duck to near-silence for the death beat, then bring up the spawn ambience |
| **Room to room (dungeon, roguelite)** | A fast directional slide or quick fade, never a long animation | Keep the track running across rooms; fade combat layers in and out vertically rather than restarting |

Pause is the one people most often over-build. It should appear instantly and halt the game with no animation in the way, because its whole job is to be reachable and reversible. The death screen is the opposite: the unhurried "YOU DIED" (which originated in Demon's Souls in 2009, not Dark Souls) earns its weight precisely by being slow and rare.

## The audio half

Audio carries as much of the transition as the visual, and a jarring music cut is the most common offender, players resent a track interrupted just because they opened a menu. The techniques, in rough order of polish:

- **Hard cut**: only for shock. Otherwise it reads as a bug.
- **Fade or crossfade**: the safe default between two distinct cues.
- **Musically-aware transition**: wait for the next bar, beat, or cue so the change lands on the pulse instead of mid-phrase. This is the professional move, and what Wwise and FMOD's transition sync points exist to do.
- **Stinger**: a short phrase (roughly one to five seconds) layered over the current track to punctuate an event without stopping it.

Two structural approaches underlie adaptive scores: **horizontal re-sequencing** (switch between whole segments at phrase ends or via bridge sections, narrative clarity and low memory) and **vertical layering** (fade instrument layers in and out over a constant base, smooth real-time intensity); most games blend both ([Berklee Online](https://online.berklee.edu/takenote/scoring-for-games-top-techniques-for-composing-music-for-interactive-media/)). For mixing across a transition, **ducking** lowers one bus under another (music under dialogue or a stinger, via sidechain), and the pause "behind glass" effect is just a ducked, low-passed snapshot of the live mix rather than a stop. Crossfade room tones and change reverb when the space changes, and remember that **silence is a tool**, a sudden drop to near-quiet is one of the strongest tension levers ([Phillips](https://www.gamedeveloper.com/audio/composing-video-game-music-to-build-suspense-part-5-semi-silence)). For loading audio, do not loop a five-second clip audibly; use long-form music, an ambience bed, or deliberate quiet.

## Accessibility limits

Transitions are a common accessibility trap, so cap them:

- **Motion.** Offer toggles or sliders for camera shake, motion blur, and aggressive camera moves during transitions; fast full-screen motion triggers motion sickness ([Xbox Accessibility Guideline 117](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117)).
- **Photosensitivity.** Keep flashing under three flashes per second over roughly a fifth to a quarter of the screen, stricter for saturated red, and prefer a fade over a hard flash ([XAG 118](https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/118); [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/avoid-flickering-images-and-repetitive-patterns/), a Basic-tier item). Do not advertise "epilepsy safe"; name the specific effect you let players control.
- **Audio.** Ship separate volume sliders for music, effects, and speech (a Basic-tier guideline) so a player can tame an abrupt or overpowering transition. See [accessibility.md](accessibility.md).
