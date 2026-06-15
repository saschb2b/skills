# Compose and View Interop

**Verified 2026-06-15.** The interop APIs are stable. Use interop to migrate incrementally or to embed a widget Compose doesn't have yet.

## Compose inside Views

Embed Compose in an existing View hierarchy with a `ComposeView`. Set a `ViewCompositionStrategy` so the composition's lifecycle matches its host.

```kotlin
// In a Fragment / Activity using XML
composeView.apply {
    setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
    setContent { AppTheme { FeedScreen() } }
}
```

Or in XML, drop a `<androidx.compose.ui.platform.ComposeView>` into the layout and call `findViewById<ComposeView>(...).setContent { }`. `DisposeOnViewTreeLifecycleDestroyed` is the right strategy for Fragments so the composition disposes with the view.

## Views inside Compose

Wrap a legacy `View`, a `MapView`, an `AdView`, or any custom View with `AndroidView`.

```kotlin
AndroidView(
    factory = { context -> MapView(context).apply { /* one-time setup */ } },
    update = { mapView -> mapView.setMarkers(markers) },   // runs on recomposition when reads change
    modifier = Modifier.fillMaxSize(),
)
```

`factory` runs once; `update` runs on first composition and whenever state it reads changes. For Views with their own lifecycle (MapView), forward lifecycle events or use the AndroidView lifecycle helpers. Use `AndroidViewBinding` to inflate an existing XML layout (a ViewBinding) inside Compose.

## Bridging state across the boundary

- View to Compose: expose the View's data as Compose `State`/`StateFlow` and read it in `setContent`.
- Compose to View: hoist state into a shared `ViewModel` both sides read, rather than wiring callbacks through the interop layer.

## Migration strategy

Migrate screen by screen, not all at once:

1. Add Compose to the build (BOM + compiler plugin, see [tooling.md](tooling.md)) and keep the existing Views running.
2. Convert leaf screens or self-contained components to Compose first, hosting them via `ComposeView` inside the existing Activity/Fragment navigation.
3. Move shared state into ViewModels exposing `StateFlow` so both Compose and View code read one source of truth.
4. Once a navigation graph is fully Compose, switch that flow to Navigation Compose (see [navigation.md](navigation.md)).
5. Theme parity: build the Compose `MaterialExpressiveTheme`/`MaterialTheme` to match the existing XML theme so mixed screens look consistent during the transition.

Accompanist note: many former Accompanist libraries (insets, flow layouts, pager, system UI controller) have graduated into Compose Foundation/Material 3 or been replaced by edge-to-edge insets APIs. Prefer the first-party API; see [pitfalls.md](pitfalls.md).
