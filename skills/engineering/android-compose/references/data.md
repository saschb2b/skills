# Data Layer

**Verified 2026-06-15** against Room (KSP), DataStore, Retrofit/Ktor with kotlinx.serialization, Coil 3.5.0. The repository pattern is stable; check library versions.

## Repository as single source of truth

A repository exposes data to the rest of the app and hides where it comes from. Prefer returning `Flow` for observable data and `suspend` functions for one-shots. The ViewModel never talks to Room/Retrofit directly.

```kotlin
class DefaultPostRepository @Inject constructor(
    private val api: PostApi,
    private val dao: PostDao,
) : PostRepository {
    override fun observePosts(): Flow<List<Post>> = dao.observeAll().map { it.map(PostEntity::toModel) }
    override suspend fun refresh() {
        val remote = api.getPosts()
        dao.upsertAll(remote.map(PostDto::toEntity))   // network -> DB; DB is the truth the UI reads
    }
}
```

## Coroutines and Flow

Do async work with coroutines. Inject a `CoroutineDispatcher` (don't hardcode `Dispatchers.IO`) so it's swappable in tests. Wrap blocking I/O with `withContext(ioDispatcher)`. Use `Flow` for streams, `stateIn`/`shareIn` to hot-share, and `flowOn` to move upstream work off the main thread.

## Room (use KSP)

```kotlin
@Entity(tableName = "posts")
data class PostEntity(@PrimaryKey val id: String, val title: String)

@Dao
interface PostDao {
    @Query("SELECT * FROM posts ORDER BY title")
    fun observeAll(): Flow<List<PostEntity>>

    @Upsert suspend fun upsertAll(posts: List<PostEntity>)
}

@Database(entities = [PostEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun postDao(): PostDao
}
```

Add Room with the **KSP** processor, not kapt: `ksp("androidx.room:room-compiler:...")` plus `implementation("androidx.room:room-ktx:...")`. `Flow`-returning queries emit on every change. Provide explicit `Migration`s (or `fallbackToDestructiveMigration` only in dev). Room also supports a multiplatform artifact if the project is KMP.

## DataStore (not SharedPreferences)

`DataStore` replaces `SharedPreferences`: async, coroutine/Flow-based, no ANR-prone blocking reads. Preferences DataStore for key-value, Proto DataStore for typed schemas.

```kotlin
val Context.settings by preferencesDataStore("settings")
val DARK = booleanPreferencesKey("dark")

val darkFlow: Flow<Boolean> = context.settings.data.map { it[DARK] ?: false }
suspend fun setDark(on: Boolean) { context.settings.edit { it[DARK] = on } }
```

## Networking

- **Retrofit + OkHttp** with the kotlinx.serialization converter is the common choice. Define a typed interface with `suspend` functions.
- **Ktor client** is the idiomatic option for Kotlin Multiplatform or when you want a coroutine-native client without Retrofit.
- Serialize with **kotlinx.serialization** (`@Serializable` DTOs, `Json { ignoreUnknownKeys = true }`). Apply the `org.jetbrains.kotlin.plugin.serialization` plugin.

```kotlin
interface PostApi {
    @GET("posts") suspend fun getPosts(): List<PostDto>
}
```

Keep network DTOs separate from domain models and from Room entities; map between them at the layer boundary so a network shape change doesn't ripple into the UI.

## Images with Coil 3

Coil 3 is the Compose-first image loader (Kotlin Multiplatform, `AsyncImage`).

```kotlin
AsyncImage(
    model = post.imageUrl,
    contentDescription = null,
    contentScale = ContentScale.Crop,
    modifier = Modifier.size(64.dp).clip(MaterialTheme.shapes.medium),
)
```

For placeholder/error/crossfade use an `ImageRequest` or `rememberAsyncImagePainter`. Coil 3 needs the `coil-network-okhttp` (or ktor) artifact for HTTP. Note Coil 3.x raised `minSdk` to 23.

## WorkManager and Paging

- **WorkManager** for deferrable, guaranteed background work (sync, upload). Define a `CoroutineWorker`.
- **Paging 3** (`androidx.paging:paging-compose`) for large/remote lists: a `PagingSource` (or `RemoteMediator` with Room) exposed as `Flow<PagingData<T>>`, collected with `collectAsLazyPagingItems()` and rendered in a `LazyColumn`.
