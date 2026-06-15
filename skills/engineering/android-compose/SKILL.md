---
name: android-compose
description: Modern Android development with Jetpack Compose as the default UI toolkit and Material 3 Expressive as the default design direction, a dated snapshot. Covers Compose fundamentals (composables, modifiers, state hoisting, side effects, lazy lists, strong skipping, recomposition), Material 3 and Expressive theming and components (MaterialExpressiveTheme, MotionScheme, button groups, split buttons, FAB menu, floating toolbars, wavy progress indicators, shape morphing, dynamic color), architecture (ViewModel, StateFlow, collectAsStateWithLifecycle, Hilt), type-safe Navigation Compose and Navigation 3, data (Room, DataStore, Retrofit, Ktor, Coil), the Gradle Kotlin DSL build with version catalogs and KSP, testing, performance, and View interop. Use when building Android UI in Compose, theming with Material 3 or Expressive, wiring architecture or navigation, configuring the build, or debugging Compose issues. Check the project's versions first; re-verify version facts against the official Android and AndroidX docs.
date: 2026-06-15
---

# Android Development with Compose and Material 3 Expressive

This skill defaults new Android UI to **Jetpack Compose** and **Material 3 Expressive** as the design direction, captured as a dated snapshot. The paradigms (declarative UI, state hoisting, unidirectional data flow, Material 3 theming) move slowly. The exact version numbers, the Compose compiler setup, and which Expressive APIs are stable move fast, so those facts are dated and meant to be re-verified.

## Snapshot and freshness

- **Snapshot date: 2026-06-15** (the `date` in frontmatter). Targets Compose BOM **2026.06.00** (core Compose 1.11.x, `material3` 1.4.0), Kotlin **2.4.0**, Android **16 / API 36**. Each reference file carries its own `Verified` date.
- **Material 3 Expressive is the design direction, not yet a stable API.** As of this snapshot the Expressive components live in `androidx.compose.material3:material3` **1.5.0-alpha** behind `@ExperimentalMaterial3ExpressiveApi`; stable `material3` is 1.4.0 (baseline M3). Default to Expressive intent, opt into the experimental APIs explicitly, and fall back to stable baseline M3 where you need stable surface. Re-check whether 1.5.0 has gone stable before assuming it has. See [references/material3-expressive.md](references/material3-expressive.md).
- **Check the project's versions first.** Read `gradle/libs.versions.toml` and the module `build.gradle.kts` for the Compose BOM, `material3`, Kotlin, AGP, `compileSdk`/`targetSdk`. The installed versions decide which APIs and pitfalls apply. Never assume from memory.
- **Staleness rule.** If today is well past a file's `Verified` date, or a new Compose BOM / Kotlin / Android major has shipped, treat its version-specific claims (artifact versions, "experimental vs stable", breaking changes) as suspect and confirm against the AndroidX release notes. The paradigm sections age far slower.
- **Updating.** Confirm against the official docs (developer.android.com, the AndroidX release notes, m3.material.io, kotlinlang.org), refresh the file, and bump its `Verified` line. Maintainers: see [MAINTENANCE.md](MAINTENANCE.md).

## Core Rules

1. **Compose-first.** Build new UI in Compose, not XML Views. Reach for View interop only to embed an unported widget or migrate incrementally.
2. **Hoist state, flow data one way.** Composables take state down as parameters and send events up as lambdas. Keep UI state in a `ViewModel` as an immutable data class exposed via `StateFlow`.
3. **Write as if Strong Skipping is on** (it is, since Kotlin 2.0.20). Don't reflexively wrap everything in `remember`/`derivedStateOf`. Pass stable types and `@Immutable` data; memoize only when profiling says so.
4. **Material 3 Expressive is the design direction.** Theme with `MaterialExpressiveTheme`, motion with `MotionScheme`, reach for the expressive components, but keep the experimental opt-in honest. See [references/material3-expressive.md](references/material3-expressive.md).
5. **Apply the Compose compiler via the Kotlin Gradle plugin** (`org.jetbrains.kotlin.plugin.compose`), versioned with Kotlin. The old `composeOptions { kotlinCompilerExtensionVersion }` is obsolete.
6. **Collect flows with `collectAsStateWithLifecycle()`**, not `collectAsState()`, so collection pauses in the background.
7. **KSP, not kapt.** Use the Gradle Kotlin DSL with a `libs.versions.toml` version catalog. Go edge-to-edge by default (`enableEdgeToEdge()`; enforced at `targetSdk` 35+).

## Project Structure Convention

```
app/src/main/java/com/example/app/
  MainActivity.kt          enableEdgeToEdge() + setContent { AppTheme { ... } }
  ui/
    theme/                 Color.kt, Type.kt, Shape.kt, Theme.kt (MaterialExpressiveTheme)
    <feature>/             screen composables + per-feature ViewModel + UiState
    components/            reusable composables
  data/
    <feature>/             repository + data sources (Room, DataStore, network)
  di/                      Hilt modules
  navigation/              type-safe routes + NavHost (or Nav3 NavDisplay)
gradle/libs.versions.toml  the version catalog (single source of versions)
```

## Reference Files

Consult these based on the task. Each carries its own `Verified` date.

**Compose core**
- **Composables, modifiers and order, layouts, lazy lists with keys, state (remember, rememberSaveable, derivedStateOf, produceState), state hoisting, side effects (LaunchedEffect, DisposableEffect, rememberCoroutineScope, snapshotFlow), previews** - See [references/compose.md](references/compose.md)
- **App architecture, UI/domain/data layers, UDF, immutable UI state, ViewModel, StateFlow, collectAsStateWithLifecycle, Hilt dependency injection** - See [references/architecture.md](references/architecture.md)
- **Recomposition, stability and @Immutable, strong skipping, deferring state reads with lambda modifiers, compiler metrics, Layout Inspector, baseline profiles, Macrobenchmark** - See [references/performance.md](references/performance.md)

**Design and Material 3 Expressive**
- **Material 3 Expressive status and opt-in, MaterialExpressiveTheme, MotionScheme, button groups, toggle and split buttons, FAB menu, floating toolbars, loading and wavy progress indicators, MaterialShapes shape morphing** - See [references/material3-expressive.md](references/material3-expressive.md)
- **ColorScheme and color roles, dynamic color (Material You), typography type scale, shapes, dark theme, edge-to-edge and window insets** - See [references/theming.md](references/theming.md)

**Navigation and data**
- **Type-safe Navigation Compose (@Serializable routes, `composable<T>`, toRoute), nested graphs, passing arguments, ViewModel scoping, and Navigation 3 (you own the back stack)** - See [references/navigation.md](references/navigation.md)
- **Data layer, Room with KSP, DataStore over SharedPreferences, Retrofit or Ktor with kotlinx.serialization, Coil 3 image loading, repositories, coroutines and Flow** - See [references/data.md](references/data.md)

**Build, test, interop, pitfalls**
- **Gradle Kotlin DSL, the libs.versions.toml version catalog, the Compose compiler plugin, KSP, build variants, R8, AGP and Android Studio, building and verifying from the CLI with gradlew** - See [references/tooling.md](references/tooling.md)
- **Compose UI testing, semantics and test tags, finders and assertions, Turbine for flows, screenshot testing, MockK and Robolectric** - See [references/testing.md](references/testing.md)
- **Compose and View interop, AndroidView and ComposeView, ViewCompositionStrategy, incremental migration from XML** - See [references/interop.md](references/interop.md)
- **Common pitfalls, deprecated API, version-tagged breaking changes and migrations (kapt to KSP, composeOptions to the compiler plugin, collectAsState, Accompanist, edge-to-edge enforcement)** - See [references/pitfalls.md](references/pitfalls.md)

## Quick Patterns

### Stateful screen + stateless content (state hoisting)
```kotlin
@Composable
fun CounterScreen(viewModel: CounterViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    CounterContent(count = state.count, onIncrement = viewModel::increment)
}

@Composable
fun CounterContent(count: Int, onIncrement: () -> Unit) {
    Button(onClick = onIncrement) { Text("Count: $count") }
}
```

### Immutable UI state exposed as StateFlow
```kotlin
data class CounterUiState(val count: Int = 0)

class CounterViewModel : ViewModel() {
    private val _uiState = MutableStateFlow(CounterUiState())
    val uiState: StateFlow<CounterUiState> = _uiState.asStateFlow()
    fun increment() = _uiState.update { it.copy(count = it.count + 1) }
}
```

### Material 3 Expressive theme (experimental opt-in)
```kotlin
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun AppTheme(content: @Composable () -> Unit) {
    val scheme = if (isSystemInDarkTheme()) darkColorScheme()  // no expressive dark variant
                 else expressiveLightColorScheme()
    MaterialExpressiveTheme(colorScheme = scheme, motionScheme = MotionScheme.expressive(), content = content)
}
```

### Lazy list with stable keys
```kotlin
LazyColumn {
    items(items = users, key = { it.id }) { user -> UserRow(user) }
}
```

### Type-safe navigation route
```kotlin
@Serializable data class Profile(val userId: String)
composable<Profile> { backStackEntry ->
    val args = backStackEntry.toRoute<Profile>()
    ProfileScreen(userId = args.userId)
}
```
