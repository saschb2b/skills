# Testing

**Verified 2026-06-15** against the Compose UI test APIs, Turbine, MockK, Robolectric. The APIs are stable; confirm versions in the project.

## What to test where

- **ViewModel / repository logic**. Fast local JVM unit tests. No Compose, no device.
- **Composable behavior**. Compose UI tests against the semantics tree (Robolectric for JVM speed, or instrumented on a device/emulator).
- **Visual appearance**. Screenshot tests.
- **Flows**. Turbine.

## ViewModel and flow tests

Inject a test dispatcher and assert on emitted state. Turbine makes `Flow` assertions readable.

```kotlin
@Test
fun refresh_emitsPosts() = runTest {
    val vm = FeedViewModel(FakePostRepository(posts = samplePosts))
    vm.uiState.test {                       // Turbine
        assertTrue(awaitItem().isLoading)   // initial
        val loaded = awaitItem()
        assertEquals(samplePosts, loaded.posts)
        assertFalse(loaded.isLoading)
        cancelAndIgnoreRemainingEvents()
    }
}
```

Use `kotlinx-coroutines-test` (`runTest`, `StandardTestDispatcher`) and inject the dispatcher into the ViewModel so you control virtual time. Prefer hand-written fakes for repositories; use **MockK** when a fake is impractical.

## Compose UI tests

```kotlin
@get:Rule val composeRule = createComposeRule()   // or createAndroidComposeRule<Activity>()

@Test
fun increment_updatesCount() {
    composeRule.setContent { AppTheme { CounterContent(count = 0, onIncrement = {}) } }
    composeRule.onNodeWithText("Count: 0").assertIsDisplayed()
}
```

- **Finders**: `onNodeWithText`, `onNodeWithContentDescription`, `onNodeWithTag` (pair with `Modifier.testTag("...")`), `onNode(hasText(...) and isEnabled())`.
- **Actions**: `performClick()`, `performTextInput("...")`, `performScrollToNode(...)`.
- **Assertions**: `assertIsDisplayed()`, `assertTextEquals(...)`, `assertIsEnabled()`, `assertDoesNotExist()`.
- **Sync**: the test auto-waits for idle. For custom async, use `composeRule.waitUntil { ... }` or control the clock with `mainClock`.

Test the **stateless content** composable with fixed inputs; it makes assertions deterministic. Drive a real `ViewModel` only in higher-level integration tests.

## Semantics and accessibility

Tests read the same semantics tree screen readers use, so writing testable Compose and writing accessible Compose are the same work. Give actionable elements a `contentDescription` (or text) and use `Modifier.semantics { }` for custom roles/states. If a node is hard to find in a test, it is probably hard for TalkBack too. Use `testTag` for stable hooks that don't pollute the accessibility tree (it doesn't, by default).

## Screenshot testing

Catch visual regressions by rendering a composable to an image and diffing against a golden:

- **Compose Preview Screenshot Testing**. The first-party Android Studio/AGP plugin that screenshots your `@Preview`s.
- **Roborazzi** (Robolectric-based) or **Paparazzi** (no device) for JVM-fast golden tests.

Render through your real theme so screenshots cover light/dark and the Material 3 / Expressive look.

## Robolectric

Run instrumented-style tests on the JVM (no emulator) for speed when you need Android framework classes. Good for Compose tests in CI that don't need real GPU rendering. Reserve true instrumented tests for the few flows that need a real device.
