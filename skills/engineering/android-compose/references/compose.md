# Compose Fundamentals

**Verified 2026-06-15** against Compose BOM 2026.06.00 (core Compose 1.11.x), Kotlin 2.4.0. Check the project's BOM and Kotlin version first.

## Composables

A composable is a function annotated `@Composable` that describes UI as a function of state. It returns `Unit`; it does not return a View. Name composables that emit UI in PascalCase like a noun (`UserRow`), and composables that return a value in camelCase.

```kotlin
@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(text = "Hello $name", modifier = modifier)
}
```

Rules: composables must be idempotent and side-effect free in their body. Do not mutate external state, launch coroutines, or do I/O directly in the body. Use the effect APIs below. Always accept a `modifier: Modifier = Modifier` parameter and apply it to the outermost element.

## Modifiers (order matters)

`Modifier` is an ordered chain. Each modifier wraps the rest, so order changes the result. Padding before `background` insets the background; padding after pads inside it.

```kotlin
Box(
    Modifier
        .padding(16.dp)        // outer space
        .background(Color.Red) // painted area excludes the outer padding
        .padding(8.dp)         // inner space inside the red box
        .clickable { }         // click target is the red box + inner padding
)
```

Common modifiers: `fillMaxWidth()`, `fillMaxSize()`, `size()`, `padding()`, `background()`, `clip()`, `border()`, `clickable()`, `weight()` (inside Row/Column). Prefer passing a hoisted `modifier` in over hardcoding layout in a reusable composable.

## State

State is any value that, when it changes, triggers recomposition. Create it with `mutableStateOf` and survive recomposition with `remember`.

```kotlin
var count by remember { mutableStateOf(0) }          // forgotten on config change
var name by rememberSaveable { mutableStateOf("") }  // survives config change / process death
```

- `remember { }` caches across recompositions, lost on configuration change and when the composable leaves composition.
- `rememberSaveable { }` additionally persists through configuration changes and process death (value must be Bundle-able or have a custom `Saver`).
- `derivedStateOf { }` computes a value from other state and only triggers downstream recomposition when the *result* changes. Use it to throttle, e.g. `val showButton by remember { derivedStateOf { listState.firstVisibleItemIndex > 0 } }`.
- `produceState { }` bridges a non-Compose async source into State.
- `mutableStateListOf` / `mutableStateMapOf` are observable collections.

**Hoist state.** A composable that owns no state it doesn't render is reusable and testable. Push `value` up and pass `onValueChange` down. Keep durable UI state in a `ViewModel` (see [architecture.md](architecture.md)).

## Side effects

Run non-UI work in an effect, never in the composable body.

```kotlin
LaunchedEffect(key1 = userId) {            // runs in a coroutine; restarts when key changes
    viewModel.load(userId)
}

DisposableEffect(lifecycleOwner) {         // setup + teardown
    val observer = LifecycleEventObserver { _, _ -> }
    lifecycleOwner.lifecycle.addObserver(observer)
    onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
}

val scope = rememberCoroutineScope()       // launch from a callback (e.g. onClick)
Button(onClick = { scope.launch { snackbarHostState.showSnackbar("Saved") } }) { }

LaunchedEffect(Unit) {                      // turn snapshot State into a Flow
    snapshotFlow { listState.firstVisibleItemIndex }
        .distinctUntilChanged()
        .collect { /* react */ }
}
```

Use a stable key: `LaunchedEffect(Unit)` runs once; `LaunchedEffect(id)` restarts whenever `id` changes. `rememberUpdatedState` captures the latest value inside a long-lived effect without restarting it.

## Layouts

```kotlin
Column(verticalArrangement = Arrangement.spacedBy(8.dp)) { /* vertical stack */ }
Row(verticalAlignment = Alignment.CenterVertically) { /* horizontal */ }
Box(contentAlignment = Alignment.Center) { /* overlap / z-stack */ }
```

`Spacer(Modifier.weight(1f))` pushes siblings apart. `FlowRow` / `FlowColumn` wrap to the next line. For custom measurement, write a `Layout` or use `SubcomposeLayout`. Use `Modifier.weight()` for proportional sizing inside Row/Column.

## Lazy lists (always key your items)

Only `Lazy*` composables compose visible items. A plain `Column` with hundreds of children composes them all.

```kotlin
LazyColumn(
    contentPadding = PaddingValues(16.dp),
    verticalArrangement = Arrangement.spacedBy(8.dp),
) {
    items(items = users, key = { it.id }) { user -> UserRow(user) }
    item { Footer() }
}
```

Provide a stable `key` so Compose can reorder rather than recompose on insert/move, and so item state and animations survive reordering. `LazyVerticalGrid`, `LazyRow`, `LazyVerticalStaggeredGrid` follow the same shape. Hoist the `rememberLazyListState()` if you need to read or control scroll.

## Previews

```kotlin
@Preview(showBackground = true)
@Preview(uiMode = Configuration.UI_MODE_NIGHT_YES, name = "Dark")
@Composable
private fun GreetingPreview() {
    AppTheme { Greeting(name = "Ada") }
}
```

Preview the stateless content composable with sample data, not the screen wired to a `ViewModel`. Use `@PreviewParameter` to feed multiple sample inputs, and define a custom multipreview annotation to run a set of device/theme previews at once.

## Recomposition and Strong Skipping

Compose recomposes only the composables that read changed state. **Strong Skipping is default-on since Kotlin 2.0.20**: restartable composables are skipped when their parameters are unchanged, even when a parameter type is unstable, and unstable parameters are compared by instance. So do not reflexively wrap values in `remember`/`derivedStateOf` to "help" recomposition. Pass stable, immutable data, mark model classes `@Immutable`, and measure before optimizing. Details in [performance.md](performance.md).
