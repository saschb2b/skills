---
type: Library Notes
title: "React Native (with Expo)"
description: "The New Architecture (Fabric renderer, TurboModules, JSI) is enabled by default since React Native 0.76."
tags: [javascript, mobile]
generated: { by: claude-code/unversioned, at: 2026-08-21T00:00:00Z }
---
# React Native (with Expo)

**Verified 2026-08-20.** Check the installed `react-native` and Expo SDK versions first; re-verify if newer than below.

**Current stable**: React Native 0.87 (Aug 2026); New Architecture default since 0.76; Expo SDK 57 (Jun 2026), which bundles React Native 0.86. **LLM default bias**: `npx react-native init`, the old bridge architecture, bare React Native as the default path, and class components.

## The shift
The New Architecture (Fabric renderer, TurboModules, JSI) is enabled by default since React Native 0.76. The official docs now recommend building new apps with a framework, featuring Expo first, with Expo Router for file-based routing. The legacy `react-native init` was removed.

## Stop / Start
| Stop (LLM default) | Start (current) |
| --- | --- |
| `npx react-native init MyApp` | `npx create-expo-app@latest` (or `npx @react-native-community/cli@latest init` for bare) |
| Bare React Native as the default path | A framework first (Expo), per the official Get Started |
| Old bridge architecture / manual `newArchEnabled` opt-in | New Architecture on by default (0.76+); opt out only if needed |
| Hand-rolled navigation | Expo Router (file-based, universal across iOS, Android, web) |
| Class components and legacy lifecycles | Function components and Hooks |

## Gotchas
- `react-native init` was deprecated at the end of 2024 and removed in 0.77; uninstall the global `react-native-cli`.
- Expo is a production-grade framework now, not just a prototyping sandbox; the bare workflow remains for constrained cases.
- Expo SDK 57 bundles React Native 0.86, so an Expo app trails the bare-RN latest (0.87) by a version. Pin to the SDK's RN version rather than upgrading `react-native` on its own.
- Expo is moving to a more frequent, non-breaking SDK cadence instead of roughly three releases a year. SDK 57 was deliberately a small upgrade.

## Agent skills
Expo publishes official agent skills (`npx skills add expo/skills`), now roughly two dozen covering router, native UI, modules, data fetching, dev client, and the EAS services, documented at docs.expo.dev/skills. For Expo and React Native work, prefer the official skill.

## Companion
[../frameworks/react.md](../frameworks/react.md) covers the component model and hooks that this shares with the web.

## Sources
- https://reactnative.dev/docs/getting-started
- https://reactnative.dev/architecture/landing-page
- https://docs.expo.dev/router/introduction/
