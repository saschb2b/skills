# Pitfalls and Migrations

**Verified 2026-06-15.** The paradigm pitfalls are durable; the version-tagged migration notes track specific releases and should be re-checked when versions move.

## Composition pitfalls

### 1. State that isn't remembered resets every recomposition
```kotlin
var count = mutableStateOf(0)            // BAD: new state object each recomposition
var count by remember { mutableStateOf(0) }  // GOOD
```

### 2. Side effects in the composable body
```kotlin
@Composable
fun Screen(vm: VM) {
    vm.load()                            // BAD: runs on every recomposition
    LaunchedEffect(Unit) { vm.load() }   // GOOD: once, in an effect
}
```

### 3. Mutating a list in place doesn't recompose
```kotlin
val items = remember { mutableListOf<Item>() }   // plain list: add() won't recompose
val items = remember { mutableStateListOf<Item>() }  // observable
// or hoist into the ViewModel and emit a new immutable list via StateFlow
```

### 4. Reading scroll/derived state directly recomposes every frame
```kotlin
val atTop = listState.firstVisibleItemIndex == 0           // BAD: recomposes on every scroll px
val atTop by remember { derivedStateOf { listState.firstVisibleItemIndex == 0 } }  // GOOD
```

### 5. Modifier order bugs
Background/padding/click order changes hit-targets and painted area. See [compose.md](compose.md). Apply the passed-in `modifier` to the outermost element and only once.

### 6. Forgetting list keys
`items(list)` without `key = { it.id }` loses item state on reorder and recomposes more than needed. Always key.

## Build and API migrations (version-tagged)

### composeOptions to the Compose compiler plugin (Kotlin 2.0+)
`composeOptions { kotlinCompilerExtensionVersion = "..." }` is **obsolete**. Apply `org.jetbrains.kotlin.plugin.compose` instead; the compiler version tracks Kotlin. See [tooling.md](tooling.md).

### kapt to KSP
kapt is in maintenance mode and slow. Move Room, Hilt, Moshi, and other processors to **KSP** (`ksp(...)` not `kapt(...)`). Both Hilt and Room support KSP.

### collectAsState to collectAsStateWithLifecycle
`collectAsState()` keeps collecting while the app is backgrounded. Use `collectAsStateWithLifecycle()` from `androidx.lifecycle:lifecycle-runtime-compose` so collection pauses below STARTED. See [architecture.md](architecture.md).

### Strong Skipping changed the memoization advice (Kotlin 2.0.20+)
Strong Skipping is default-on. Stop reflexively wrapping values/lambdas in `remember`/`derivedStateOf`/`React.memo`-style guards. Memoize only where profiling shows it. See [performance.md](performance.md).

### Edge-to-edge enforcement (targetSdk 35+)
Targeting Android 15+ forces edge-to-edge and deprecates `Window.statusBarColor`/`navigationBarColor`. Call `enableEdgeToEdge()` and handle insets in Compose; don't try to re-color system bars the old way. See [theming.md](theming.md).

### Material 2 to Material 3
Use `androidx.compose.material3`, not `androidx.compose.material`. Imports, `ColorScheme` (roles, not `Colors`), `Typography` slot names, and component params differ. Don't mix `material` and `material3` in one screen.

### Material 3 Expressive is experimental (material3 1.5.0-alpha)
`MaterialExpressiveTheme` and the Expressive components require `@OptIn(ExperimentalMaterial3ExpressiveApi::class)` and live on the 1.5.0-alpha line; stable `material3` is 1.4.0 with none of it. APIs shift between alphas. See [material3-expressive.md](material3-expressive.md). Re-check whether 1.5.0 has stabilized.

### Accompanist graduations
Many Accompanist libraries have moved into first-party APIs: insets to the framework `WindowInsets`/edge-to-edge, `FlowRow`/`FlowColumn` and pager into Compose Foundation, system UI controller superseded by `enableEdgeToEdge`. Prefer the first-party API and drop the corresponding Accompanist dependency. Confirm the current status of any Accompanist module you still use.

## Lifecycle and coroutine pitfalls

- Launch UI coroutines from `viewModelScope` (ViewModel) or `rememberCoroutineScope()` (event callbacks), not a bare `GlobalScope`.
- Don't hold a `Context`/`Activity` in a ViewModel; it outlives configuration changes and leaks. Use the `Application` context via Hilt or `AndroidViewModel` if you truly need one.
- One-off events (navigation, snackbar) stored in persistent UI state replay on recomposition/config change. Model them as consume-once state or a `Channel`. See [architecture.md](architecture.md).
- A `LaunchedEffect(someValue)` restarts when `someValue` changes; use `rememberUpdatedState` to read the latest value inside a long-lived effect without restarting it.
