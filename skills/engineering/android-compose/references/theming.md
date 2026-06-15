# Theming, Color, Type, Edge-to-Edge

**Verified 2026-06-15** against Compose BOM 2026.06.00 (`material3` 1.4.0 baseline), Android 16 / API 36. Re-verify edge-to-edge enforcement and dynamic-color APIs against the platform docs.

## Color by role, never by literal

Material 3 color is a set of *roles*, not hex codes. Components read roles from `MaterialTheme.colorScheme`; you assign colors to roles once, in the theme. Key roles: `primary` / `onPrimary` / `primaryContainer` / `onPrimaryContainer`, the same for `secondary` and `tertiary`, plus `surface`, `surfaceVariant`, `surfaceContainer*` (lowest/low/high/highest), `background`, `error`, and the `onX` content colors that sit on each.

```kotlin
Surface(color = MaterialTheme.colorScheme.surfaceContainer) {
    Text("Hi", color = MaterialTheme.colorScheme.onSurface)
}
```

Never inline a `Color(0xFF...)` in a component. Define palettes in `ui/theme/Color.kt`, assemble them into a `ColorScheme` in `Theme.kt`, and reference roles everywhere else. For a translucent variant use `color.copy(alpha = 0.5f)` against a role, not a new literal.

## Dynamic color (Material You)

On Android 12+ (API 31+) you can derive the scheme from the user's wallpaper:

```kotlin
val context = LocalContext.current
val scheme = when {
    dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ->
        if (dark) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
    dark -> darkColorScheme(/* your brand fallback */)
    else -> lightColorScheme(/* your brand fallback */)
}
```

Always provide a hand-built fallback `ColorScheme` for pre-31 devices and for when you want brand colors over wallpaper. The Material Theme Builder (m3.material.io) generates a full role set from a seed color.

## Dark theme

Drive dark mode from `isSystemInDarkTheme()` and supply a separate dark `ColorScheme`. Do not branch on `isSystemInDarkTheme()` inside components to pick colors; let the roles differ between the two schemes and read roles unconditionally. Test every screen in both themes with a dark `@Preview`.

## Typography

Type is also role-based: `displayLarge/Medium/Small`, `headlineLarge/.../Small`, `titleLarge/.../Small`, `bodyLarge/.../Small`, `labelLarge/.../Small`. Read styles from the theme:

```kotlin
Text("Title", style = MaterialTheme.typography.headlineSmall)
```

Define a `Typography` in `ui/theme/Type.kt` (custom `FontFamily`, weights, tracking) and pass it to the theme. Material 3 Expressive adds emphasized type styles; see [material3-expressive.md](material3-expressive.md).

## Shapes

`MaterialTheme.shapes` carries `extraSmall`, `small`, `medium`, `large`, `extraLarge` corner shapes. Components pull their corner radius from the matching slot; clip custom surfaces with `Modifier.clip(MaterialTheme.shapes.medium)`. Expressive shape morphing is in [material3-expressive.md](material3-expressive.md).

## Edge-to-edge and window insets

Going edge-to-edge is the default and is **enforced when `targetSdk` is 35+** (Android 15+): the app draws behind the system bars and the old `statusBarColor` / `navigationBarColor` window APIs are deprecated no-ops. Opt in explicitly in the Activity and then consume insets in Compose.

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()          // call before setContent
        super.onCreate(savedInstanceState)
        setContent { AppTheme { AppRoot() } }
    }
}
```

Handle insets in Compose, not by re-coloring system bars:

- `Scaffold` applies content insets through its `innerPadding`; pass it down and apply it.
- `Modifier.safeDrawingPadding()`, `Modifier.windowInsetsPadding(WindowInsets.systemBars)`, `WindowInsets.ime`, `WindowInsets.navigationBars` for finer control.
- `Modifier.imePadding()` lifts content above the keyboard.

```kotlin
Scaffold { innerPadding ->
    LazyColumn(contentPadding = innerPadding) { /* items */ }
}
```

Adjust system bar icon contrast (light vs dark icons) via the `SystemBarStyle` arguments to `enableEdgeToEdge()`, not by painting the bar.
