# Material 3 Expressive

**Verified 2026-06-15.** Status facts are version-tagged and volatile. Stable `androidx.compose.material3:material3` is **1.4.0** (baseline M3, no Expressive). The Expressive components and `MaterialExpressiveTheme` live in the **1.5.0-alpha** line behind `@ExperimentalMaterial3ExpressiveApi`. Re-check the release notes before assuming 1.5.0 has gone stable.

## What Expressive is, and how to treat it

Material 3 Expressive (announced Google I/O 2025) is the current Material design direction: bigger and bolder shapes, more emotive color, springier motion, and a richer component set. It is research-backed and is the look Google is steering toward. Treat it as the **design intent** for new UI.

But the implementation is not stable yet. As of this snapshot:

- There is **no separate `material3-expressive` artifact**. Everything ships inside the main `androidx.compose.material3:material3` library, promoted incrementally through the 1.5.0 alphas.
- `MaterialExpressiveTheme`, `expressiveLightColorScheme()`, the new components, and `MotionScheme` are gated by `@OptIn(ExperimentalMaterial3ExpressiveApi::class)`. There is an `expressiveLightColorScheme()` but no `expressiveDarkColorScheme()`; for dark mode use the baseline `darkColorScheme()` (or a custom dark `ColorScheme`).
- The API surface shifts between alphas (components move in and out of experimental). Pin a specific alpha and read its release notes; do not assume an API is where it was last alpha.

**Decision rule.** Default to Expressive theming and components for the design direction. When you need a stable, ship-without-opt-in surface, use baseline M3 from `material3` 1.4.0 (`MaterialTheme`, standard `Button`, `LinearProgressIndicator`, etc.) and layer Expressive in as it stabilizes.

## Enabling Expressive theming

```kotlin
@OptIn(ExperimentalMaterial3ExpressiveApi::class)
@Composable
fun AppTheme(
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit,
) {
    val dark = isSystemInDarkTheme()
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ->
            if (dark) dynamicDarkColorScheme(LocalContext.current)
            else dynamicLightColorScheme(LocalContext.current)
        dark -> darkColorScheme()              // no expressive dark variant ships; use baseline dark
        else -> expressiveLightColorScheme()
    }
    MaterialExpressiveTheme(
        colorScheme = colorScheme,
        motionScheme = MotionScheme.expressive(),  // springy; MotionScheme.standard() is calmer
        content = content,
    )
}
```

`MaterialExpressiveTheme` is the Expressive counterpart to `MaterialTheme`. It adds `motionScheme` (see Motion below) on top of the usual `colorScheme`, `typography`, and `shapes`. Components inside read these via `MaterialTheme.colorScheme` etc., exactly as in baseline M3. Dynamic color (Material You) details are in [theming.md](theming.md).

## Motion scheme (spring-based)

Expressive motion is spring-physics based, exposed as a `MotionScheme` with `MotionScheme.expressive()` (more energetic) and `MotionScheme.standard()` (more restrained). Pull tokens from the theme instead of hardcoding `tween` durations:

```kotlin
val spec = MaterialTheme.motionScheme.defaultSpatialSpec<Float>()
val offset by animateDpAsState(targetValue = target, animationSpec = MaterialTheme.motionScheme.fastSpatialSpec())
```

Spatial specs animate position/size; effects specs animate color/alpha. Using the scheme keeps motion consistent and on-brand across the app.

## Expressive components

Reach for these for the Expressive look. All require the experimental opt-in and may shift between alphas; confirm the exact signature against the version you depend on.

- **Button groups** (`ButtonGroup`). A connected row of buttons that flex and animate on press; the canonical Expressive control cluster.
- **Toggle buttons** (`ToggleButton`). Shape-shifting selectable buttons (round when off, squarer when on).
- **Split button** (`SplitButton`). A primary action plus an attached dropdown trigger.
- **FAB menu** (`FloatingActionButtonMenu`). A FAB that expands into a labeled menu of actions, replacing hand-rolled speed-dials.
- **Floating toolbars** (`FloatingToolbar`, horizontal and vertical). A floating, contained action bar that hovers over content.
- **Loading indicators** (`LoadingIndicator`, `ContainedLoadingIndicator`). The Expressive shape-morphing busy indicator.
- **Wavy progress indicators** (`LinearWavyProgressIndicator`, `CircularWavyProgressIndicator`). The signature wavy determinate/indeterminate progress.
- **Shape morphing**. `MaterialShapes` predefined shapes plus `androidx.graphics.shapes` (`RoundedPolygon`, `Morph`) to animate between shapes. See "Shapes" below.

Buttons gain more shape and size options; many baseline components get expressive variants. When an Expressive variant exists, prefer it for new UI; otherwise use the baseline component.

## Shapes and shape morphing

Expressive leans on richer shapes. `MaterialShapes` offers a library of predefined shapes (cookie, clover, pill, and more). Morph between two shapes with the `androidx.graphics.shapes` library:

```kotlin
val morph = remember { Morph(MaterialShapes.Cookie9Sided, MaterialShapes.Clover4Leaf) }
// drive morph.toPath(progress) from an animation and clip with a custom Shape
```

Use morphs for moments of delight (a selected state, a success animation), not everywhere. Theme-level corner shapes still come from `MaterialTheme.shapes` (small/medium/large); see [theming.md](theming.md).

## Gradle

Expressive ships in the main `material3` artifact, so just track a BOM (or pin `material3`) new enough to include the alpha you want. Because Expressive is on the 1.5.0-alpha line while the stable BOM maps `material3` to 1.4.0, you typically override `material3` to a specific alpha rather than rely on the BOM:

```kotlin
implementation(platform("androidx.compose:compose-bom:2026.06.00"))
implementation("androidx.compose.material3:material3:1.5.0-alpha21") // overrides the BOM's 1.4.0
```

Confirm the latest alpha and whether 1.5.0 is stable before pinning. Build setup details are in [tooling.md](tooling.md).
