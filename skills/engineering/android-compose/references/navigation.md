# Navigation

**Verified 2026-06-15** against Navigation Compose 2.9.8 (type-safe routes stable since 2.8.0) and Navigation 3 (`androidx.navigation3`) 1.1.2 stable. Confirm the versions in the project.

## Two options

- **Navigation Compose** (`androidx.navigation:navigation-compose`). The established, controller-owned graph. Type-safe routes with `@Serializable` are stable. Default for most apps.
- **Navigation 3 / Nav3** (`androidx.navigation3`). The newer, Compose-first model where **you own the back stack as observable state**. Stable as of 1.1.x. Prefer it for adaptive layouts (list-detail, multi-pane) and when you want full control of the stack. New apps targeting rich adaptive UI should evaluate it.

Do not mix the two in one graph. Pick per app (or per self-contained feature).

## Navigation Compose: type-safe routes

Routes are `@Serializable` types, not strings. Requires the `org.jetbrains.kotlin.plugin.serialization` plugin and `kotlinx-serialization-json`.

```kotlin
@Serializable object Home
@Serializable data class Profile(val userId: String)

@Composable
fun AppNavHost(navController: NavHostController = rememberNavController()) {
    NavHost(navController, startDestination = Home) {
        composable<Home> {
            HomeScreen(onOpenProfile = { id -> navController.navigate(Profile(userId = id)) })
        }
        composable<Profile> { entry ->
            val profile = entry.toRoute<Profile>()
            ProfileScreen(userId = profile.userId)
        }
    }
}
```

- `navigate(Profile(userId = "42"))` passes typed arguments; `entry.toRoute<Profile>()` reads them back. No string templates, no manual `navArgument`.
- Nested graphs: `navigation<SettingsGraph>(startDestination = ...) { ... }` groups routes.
- Pop and options: `navController.navigate(Home) { popUpTo(Home) { inclusive = true }; launchSingleTop = true }`.
- Back: `navController.popBackStack()` or `navController.navigateUp()`.

## ViewModel scoping

`hiltViewModel()` inside a `composable<T>` scopes the ViewModel to that back stack entry; it is cleared when the destination leaves the back stack. To share a ViewModel across a nested graph, scope it to the parent entry:

```kotlin
composable<Detail> { entry ->
    val parentEntry = remember(entry) { navController.getBackStackEntry<CheckoutGraph>() }
    val shared: CheckoutViewModel = hiltViewModel(parentEntry)
}
```

Avoid passing whole objects as nav arguments; pass IDs and load from a repository. Keep argument types small and serializable.

## Navigation 3 (Nav3): you own the back stack

Nav3 inverts control: the back stack is a plain observable list you keep in state, and `NavDisplay` renders the top entry (or multiple, for adaptive panes).

```kotlin
val backStack = rememberNavBackStack(Home)   // a SnapshotStateList you control
NavDisplay(
    backStack = backStack,
    onBack = { backStack.removeLastOrNull() },
    entryProvider = entryProvider {
        entry<Home> { HomeScreen(onOpen = { backStack.add(Profile(it)) }) }
        entry<Profile> { ProfileScreen(userId = it.userId) }
    },
)
```

Because the stack is ordinary state, you push/pop with list operations, persist it yourself, and drive adaptive layouts by deciding how many entries to show. This is the forward-looking direction; the API specifics are newer, so confirm signatures against the `androidx.navigation3` release notes for the version you pin.

## Deep links

Navigation Compose attaches deep links per destination (`deepLinks = listOf(navDeepLink<Profile> { uriPattern = "app://profile/{userId}" })`) and resolves them into typed routes. Register the matching `intent-filter` in the manifest.
