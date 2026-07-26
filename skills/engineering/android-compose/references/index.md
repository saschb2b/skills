---
okf_version: "0.2"
---

# Per-area Jetpack Compose reference notes behind the android-compose skill.

- [App Architecture](architecture.md) - The recommended architecture is three layers, each depending only inward:
- [Compose Fundamentals](compose.md) - A composable is a function annotated `@Composable` that describes UI as a function of state.
- [Data Layer](data.md) - A repository exposes data to the rest of the app and hides where it comes from.
- [Compose and View Interop](interop.md) - Embed Compose in an existing View hierarchy with a `ComposeView`.
- [Material 3 Expressive](material3-expressive.md) - Material 3 Expressive (announced Google I/O 2025) is the current Material design direction: bigger and bolder shapes, more emotive color, springier motion, and a richer component set.
- [Navigation](navigation.md) - Do not mix the two in one graph.
- [Performance](performance.md) - Compose recomposes composables that read changed state.
- [Pitfalls and Migrations](pitfalls.md) - var count = mutableStateOf(0) // BAD: new state object each recomposition
- [Testing](testing.md) - Inject a test dispatcher and assert on emitted state.
- [Theming, Color, Type, Edge-to-Edge](theming.md) - Material 3 color is a set of *roles*, not hex codes.
- [Build and Tooling](tooling.md) - Use `build.gradle.kts` (Kotlin DSL) and a single `gradle/libs.versions.toml` version catalog as the source of truth for versions.
