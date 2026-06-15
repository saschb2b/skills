# App Architecture

**Verified 2026-06-15** against the official Android architecture guidance, Lifecycle 2.10.0, Hilt 2.56. The layering and UDF principles are stable; the artifact versions move.

## Layers

The recommended architecture is three layers, each depending only inward:

- **UI layer**. Compose composables plus a `ViewModel` that holds and exposes screen state. Renders state, forwards events.
- **Domain layer** (optional). Use-case classes that encapsulate reusable business logic and combine repositories. Add it only when logic is shared across ViewModels or a ViewModel gets fat.
- **Data layer**. Repositories that expose data and mediate between sources (network, database, DataStore). The single source of truth. See [data.md](data.md).

Dependencies point UI to domain to data. The data layer knows nothing about the UI.

## Unidirectional data flow (UDF)

State flows down, events flow up. The `ViewModel` owns the state; composables render it and call back on user actions. Never mutate UI state from inside a composable's body.

```
ViewModel --(immutable UiState via StateFlow)--> Composable
Composable --(events: onClick, onTextChange)----> ViewModel
```

## UI state as one immutable object

Model each screen's state as a single immutable `data class`. Expose it as a read-only `StateFlow`; mutate it only through `MutableStateFlow.update`.

```kotlin
data class FeedUiState(
    val isLoading: Boolean = true,
    val posts: List<Post> = emptyList(),
    val error: String? = null,
)

@HiltViewModel
class FeedViewModel @Inject constructor(
    private val repo: PostRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(FeedUiState())
    val uiState: StateFlow<FeedUiState> = _uiState.asStateFlow()

    init { refresh() }

    fun refresh() = viewModelScope.launch {
        _uiState.update { it.copy(isLoading = true, error = null) }
        runCatching { repo.getPosts() }
            .onSuccess { posts -> _uiState.update { it.copy(isLoading = false, posts = posts) } }
            .onFailure { e -> _uiState.update { it.copy(isLoading = false, error = e.message) } }
    }
}
```

Alternatively expose repository flows with `stateIn`:

```kotlin
val uiState: StateFlow<FeedUiState> = repo.observePosts()
    .map { FeedUiState(isLoading = false, posts = it) }
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), FeedUiState())
```

`SharingStarted.WhileSubscribed(5_000)` keeps the upstream alive across configuration changes but stops it shortly after the UI goes away.

## Collecting state in Compose

Collect with `collectAsStateWithLifecycle()` from `androidx.lifecycle:lifecycle-runtime-compose`, not `collectAsState()`. It pauses collection when the lifecycle drops below STARTED, so background screens stop doing work.

```kotlin
@Composable
fun FeedScreen(viewModel: FeedViewModel = hiltViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()
    FeedContent(state = state, onRefresh = viewModel::refresh)
}
```

Split each screen into a stateful wrapper (reads the ViewModel) and a stateless content composable (takes state + lambdas). Preview and test the stateless one.

## One-off events

For events that should fire once (navigation, snackbars, toasts), do not put them in the persistent UI state, or they replay on recomposition/config change. Prefer modeling them as state that the UI consumes and acknowledges, or use a `Channel`/`SharedFlow` collected in a `LaunchedEffect`. Keep them rare; most "events" are better expressed as state.

## Dependency injection with Hilt

Hilt is Google's DI recommendation. Annotate the `Application` with `@HiltAndroidApp`, the `Activity` with `@AndroidEntryPoint`, ViewModels with `@HiltViewModel` + `@Inject constructor`, and obtain them in Compose with `hiltViewModel()`. Bind interfaces in `@Module` objects. Use the **KSP** Hilt processor, not kapt (see [tooling.md](tooling.md)). Koin is a viable lighter-weight alternative if the project already uses it.

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {
    @Binds abstract fun bindPostRepo(impl: DefaultPostRepository): PostRepository
}
```

## navigation

Keep navigation out of ViewModels where you can; expose state and let the UI react. Type-safe Navigation Compose and Navigation 3 are covered in [navigation.md](navigation.md).
