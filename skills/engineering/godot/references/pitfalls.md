# Godot Pitfalls & Breaking Changes

**Verified 2026-06-06** against Godot 4.x (the breaking-change and new-feature notes below are version-tagged). Re-verify the version-specific sections when a new Godot minor ships.

## Critical Pitfalls

### 1. @onready + @export = broken
```gdscript
# BAD: @onready overrides the inspector value at _ready time
@export @onready var speed: float = 100.0

# GOOD: Use one or the other
@export var speed: float = 100.0
@onready var sprite: Sprite2D = $Sprite2D
```

### 2. Parent not ready in child's _ready()
```gdscript
# BAD: parent's _ready() hasn't run yet
func _ready() -> void:
    get_parent().health  # parent may not be initialized

# GOOD: defer or use signal
func _ready() -> void:
    get_parent().ready.connect(_on_parent_ready, CONNECT_ONE_SHOT)
```

### 3. Resources are shared by reference
```gdscript
var a: ItemData = load("res://sword.tres")
var b: ItemData = load("res://sword.tres")
a.value = 999
print(b.value)  # 999! Same instance

# Fix: duplicate()
var unique: ItemData = load("res://sword.tres").duplicate()
```

### 4. Untyped code is 2x slower
```gdscript
# BAD
var speed = 100.0
var items = []

# GOOD
var speed: float = 100.0
var items: Array[Item] = []
```

### 5. get_node() every frame
```gdscript
# BAD: traverses tree each call
func _process(delta: float) -> void:
    get_node("Sprite2D").rotation += delta

# GOOD: cache with @onready
@onready var sprite: Sprite2D = $Sprite2D
```

### 6. Brittle node paths
```gdscript
# BAD
@onready var label = $"../../UI/Panel/VBox/Label"

# GOOD: unique names
@onready var label: Label = %ScoreLabel
```

### 7. _process for physics
```gdscript
# BAD: inconsistent at varying framerates
func _process(delta: float) -> void:
    move_and_slide()

# GOOD: _physics_process for physics
func _physics_process(delta: float) -> void:
    move_and_slide()
```

### 8. await hangs forever
```gdscript
# BAD: if signal never emits, coroutine leaks
await some_signal_that_might_never_fire

# SAFER: timeout pattern
var tween := create_tween()
tween.tween_callback(func() -> void: timed_out = true).set_delay(5.0)
await some_signal
tween.kill()
```

### 9. Forgetting set_input_as_handled()
```gdscript
# BAD: event propagates to _unhandled_input too
func _input(event: InputEvent) -> void:
    if event.is_action_pressed("pause"):
        toggle_pause()

# GOOD: consume the event
func _input(event: InputEvent) -> void:
    if event.is_action_pressed("pause"):
        toggle_pause()
        get_viewport().set_input_as_handled()
```

### 10. Not freeing nodes (memory leaks)
```gdscript
# Always queue_free() when done
func _on_screen_exited() -> void:
    queue_free()

# Godot 4.6: Use ObjectDB snapshots to debug leaked nodes
```

### 11. Using deprecated TileMap
```gdscript
# OLD (deprecated since 4.3)
var tilemap: TileMap = $TileMap
tilemap.set_cell(0, Vector2i(5, 3), 0, Vector2i(0, 0))  # layer param

# NEW
var layer: TileMapLayer = $GroundLayer
layer.set_cell(Vector2i(5, 3), 0, Vector2i(0, 0))  # no layer param
```

### 12. Typed array assignment from filter/map
```gdscript
# BAD: filter returns untyped Array
var items: Array[Item] = inventory.filter(func(i): return i.rare)  # ERROR

# GOOD: use .assign()
items.assign(inventory.filter(func(i: Item) -> bool: return i.rare))
```

## Godot 4.6 Breaking Changes

### Glow post-processing
- Glow now composited BEFORE tonemapping (was after)
- Default blend mode changed to Screen
- Default glow levels changed

### Physics
- Jolt Physics is default for NEW 3D projects (existing unchanged)
- Godot Physics still available

### Rendering
- Direct3D 12 is default on Windows for new projects

### Nodes
- Nodes now have internal unique IDs
- Re-save scenes via "Upgrade Project Files" to populate

### Signals
- Signals starting with underscore are hidden from auto-completion

## Deprecated API (4.x cumulative)

| Deprecated | Replacement |
|---|---|
| `TileMap` | `TileMapLayer` (4.3) |
| `yield` | `await` (4.0) |
| `connect("signal", obj, "method")` | `signal.connect(callable)` (4.0) |
| `emit_signal("name")` | `signal.emit()` (4.0) |
| `onready var` | `@onready var` (4.0) |
| `export var` | `@export var` (4.0) |
| `tool` keyword | `@tool` annotation (4.0) |
| `remote/puppet/master` | Multiplayer API (4.0) |

## Godot 4.6 New Features

- IK framework: TwoBoneIK3D, SplineIK3D, FABRIK3D, CCDIK3D, JacobianIK3D
- SSR completely rewritten
- LibGodot (engine embeddable as library)
- ObjectDB snapshots for debugging memory leaks
- Debugger "Step Out" button
- Scene tiles support 90-degree rotation
- Unified docking system with floating panels
- Game speed controls during editor testing
- Patch PCK delta encoding
- GDExtension JSON-based interface
- String placeholder highlighting in editor
- Drag resources into script editor for auto @export
