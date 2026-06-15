# Build and Tooling

**Verified 2026-06-15** against AGP 9.2.x, Kotlin 2.4.0, Android Studio "Quail" (2026.1.x), Android 16 / API 36, Compose BOM 2026.06.00. These version numbers are volatile; confirm against the project and the release notes.

## Gradle Kotlin DSL + version catalog

Use `build.gradle.kts` (Kotlin DSL) and a single `gradle/libs.versions.toml` version catalog as the source of truth for versions. No hardcoded version strings scattered across modules.

```toml
# gradle/libs.versions.toml
[versions]
agp = "9.2.0"
kotlin = "2.4.0"
composeBom = "2026.06.00"
material3 = "1.5.0-alpha21"   # Expressive; override the BOM's stable 1.4.0
lifecycle = "2.10.0"
hilt = "2.56"
ksp = "2.4.0-..."             # KSP version tracks the Kotlin version; confirm the suffix

[libraries]
compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
compose-material3 = { group = "androidx.compose.material3", name = "material3", version.ref = "material3" }
lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycle" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
hilt = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
```

## The Compose compiler plugin (not composeOptions)

Since Kotlin 2.0 the Compose compiler is versioned with Kotlin and applied as a Gradle plugin. **Do not** set `composeOptions { kotlinCompilerExtensionVersion = ... }`. That is obsolete and will mismatch.

```kotlin
// app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.compose.compiler)   // org.jetbrains.kotlin.plugin.compose
    alias(libs.plugins.ksp)
    alias(libs.plugins.hilt)
}

android {
    compileSdk = 36
    defaultConfig {
        minSdk = 24
        targetSdk = 36
    }
    buildFeatures { compose = true }   // enables Compose; no kotlinCompilerExtensionVersion needed
}

dependencies {
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.material3)
    implementation(libs.lifecycle.runtime.compose)
    androidTestImplementation(platform(libs.compose.bom))
}

// optional: emit Compose compiler metrics/reports for stability debugging
composeCompiler {
    // reportsDestination = layout.buildDirectory.dir("compose_compiler")
    // metricsDestination = layout.buildDirectory.dir("compose_compiler")
}
```

The Compose BOM (`platform(...)`) aligns all `androidx.compose.*` versions; declare Compose libraries without versions and let the BOM pin them. Override a single library (like `material3` for Expressive alphas) by giving it an explicit version after the BOM.

## SDK levels and edge-to-edge

New apps in mid-2026: `compileSdk = 36`, `targetSdk = 36` (Android 16). `minSdk` per your audience (24 is a common floor; Coil 3 needs 23+). Targeting `targetSdk` 35+ enforces edge-to-edge; handle insets in Compose (see [theming.md](theming.md)).

## KSP over kapt

Use **KSP** for annotation processors (Room, Hilt, Moshi). kapt is in maintenance mode and is much slower. Apply the KSP plugin and use `ksp(...)` instead of `kapt(...)` for every processor that supports it (Hilt and Room both do).

```kotlin
dependencies {
    implementation(libs.hilt.android); ksp(libs.hilt.compiler)
    implementation(libs.room.runtime); ksp(libs.room.compiler)
}
```

## Release builds

Enable R8 (`isMinifyEnabled = true`, `isShrinkResources = true`) for release. Keep `proguard-rules.pro` minimal; most AndroidX/Compose rules ship with the libraries. Ship a Baseline Profile (see [performance.md](performance.md)). Configure signing through a keystore, never committed.

## Building and verifying from the CLI

Verify changes with the Gradle wrapper, not just the IDE. The Compose compiler runs as part of Kotlin compilation, so a successful compile already proves your composables and `@OptIn` usage are valid. Run the narrowest task that answers the question, fastest first.

```sh
./gradlew :app:compileDebugKotlin     # fastest: does the Kotlin (and Compose) compile?
./gradlew :app:assembleDebug          # compile + build the debug APK
./gradlew :app:testDebugUnitTest      # JVM unit tests (ViewModel, repository, Robolectric)
./gradlew :app:lintDebug              # Android lint (a11y, deprecations, resource issues)
./gradlew :app:connectedDebugAndroidTest  # instrumented + Compose UI tests (needs a device/emulator)
./gradlew :app:installDebug           # install on a connected device/emulator
```

Use the variant-specific task (`compileDebugKotlin`, not `build`) to keep the loop fast. Add `--offline` when there is no network and dependencies are cached. `./gradlew tasks` lists module tasks; `./gradlew :app:dependencies` resolves the version-catalog graph (useful for diagnosing a BOM override). Treat a clean `compileDebugKotlin` plus relevant unit tests as the minimum bar before considering a Compose change done.

## Android Studio

Use the current stable Android Studio ("Quail" series as of this snapshot) for the matching AGP. Compose tooling: live previews, interactive preview, Layout Inspector recomposition counts, the Compose preview screenshot test plugin. Keep the Kotlin/Compose-compiler/AGP versions mutually compatible; the AGP and Kotlin release notes list the supported matrix.
