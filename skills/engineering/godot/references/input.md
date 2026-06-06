# Input Reference

**Verified 2026-06-06** against Godot 4.x. The Input/InputMap API and `physical_keycode`-over-`keycode` guidance are stable across 4.x. Re-verify enum names if a newer minor changes them.

For input *propagation order* (`_input` / `_gui_input` / `_unhandled_input`) and the event-vs-polling decision, see [architecture.md](architecture.md). This file covers the Input Map, action polling, devices, and runtime remapping.

## Use actions, not raw keys

Define named actions in the Input Map (Project Settings > Input Map, stored in `project.godot`) and bind keys, mouse buttons, and gamepad inputs to each. Code references the action name, so rebinding never touches gameplay code and one action can have many bindings.

## Polling actions (continuous and discrete)

```gdscript
# Continuous (movement, aiming): poll every frame
func _physics_process(_delta: float) -> void:
    var dir := Input.get_vector("left", "right", "up", "down")   # normalized Vector2, deadzoned
    velocity = dir * SPEED
    move_and_slide()

# Discrete (jump, attack): the "just" variants fire for one frame
if Input.is_action_just_pressed("jump"): jump()
if Input.is_action_just_released("charge"): release_shot()

var throttle := Input.get_action_strength("accelerate")   # 0..1 (analog triggers)
var steer := Input.get_axis("steer_left", "steer_right")  # -1..1
```
`get_vector`/`get_axis`/`get_action_strength` read analog inputs and apply the action's deadzone, so they work for both keyboard (0/1) and stick (0..1).

## Event-based handling

For one-shot actions, prefer reacting to events over polling (consume so UI/gameplay do not double-handle):
```gdscript
func _unhandled_input(event: InputEvent) -> void:
    if event.is_action_pressed("interact"):
        interact()
        get_viewport().set_input_as_handled()
```
Useful `InputEvent` subclasses: `InputEventKey`, `InputEventMouseButton`, `InputEventMouseMotion`, `InputEventJoypadButton`, `InputEventJoypadMotion`, `InputEventScreenTouch`/`ScreenDrag` (mobile).

## physical_keycode vs keycode

Bind movement to **`physical_keycode`** (position on the keyboard) so WASD stays in the same place on AZERTY/QWERTZ. Use `keycode` only when the printed letter matters (text shortcuts).
```gdscript
if Input.is_physical_key_pressed(KEY_W): ...
```

## Mouse

```gdscript
Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)   # FPS look; HIDDEN/CONFINED/VISIBLE also
Input.warp_mouse(get_viewport().get_visible_rect().size * 0.5)
# Mouse position: get_global_mouse_position() (world) / get_viewport().get_mouse_position() (screen)
```

## Gamepad

```gdscript
for id in Input.get_connected_joypads():
    print(Input.get_joy_name(id))
Input.start_joy_vibration(0, 0.5, 0.8, 0.3)        # device, weak, strong, seconds
```
Prefer named actions (with both keyboard and joypad bindings) over reading raw axes. Set per-action deadzones in the Input Map; `get_vector` honors them.

## Runtime remapping

Capture a new binding, then swap it into the action. Persist the result (see [persistence.md](persistence.md)).
```gdscript
func rebind(action: String, event: InputEvent) -> void:
    InputMap.action_erase_events(action)
    InputMap.action_add_event(action, event)

# Capture step (in a "press a key" screen):
func _input(event: InputEvent) -> void:
    if listening and (event is InputEventKey or event is InputEventJoypadButton):
        rebind(pending_action, event)
        listening = false
```
`InputMap.has_action`, `get_actions`, and `action_get_events` round out the API.

## Pitfalls

- Hardcoding keys (`KEY_SPACE`) in gameplay instead of an action. Rebinding and gamepad support then require code edits.
- Binding movement to `keycode`; use `physical_keycode` so layout does not move WASD.
- Reading `is_action_pressed` for a discrete action and firing every frame it is held. Use `is_action_just_pressed`.
- Polling in `_process` for physics-affecting input; poll movement in `_physics_process` (see [physics.md](physics.md)).
