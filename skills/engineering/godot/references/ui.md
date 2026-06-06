# UI / Control Reference

**Verified 2026-06-06** against Godot 4.x. Godot 4 dropped the `rect_` prefix: it is `position`/`size`/`custom_minimum_size` (not `rect_position`/`rect_size`/`rect_min_size`) and anchor `offset_left/top/right/bottom` (not `margin_*`). Re-verify if a newer minor changes them.

## Control vs Node2D

UI lives under `Control` nodes, not `Node2D`. Controls have anchors, offsets, size flags, focus, and theme support. Put the whole UI under a `CanvasLayer` so it draws on top and ignores the world `Camera2D`.

```
CanvasLayer
  +-- Control (full-rect root)
        +-- MarginContainer
              +-- VBoxContainer
                    +-- Label
                    +-- Button
```

## Positioning: anchors, offsets, size

- `position` / `size` (Vector2): top-left and dimensions, relative to the parent rect.
- `custom_minimum_size` (Vector2): floor the node will not shrink below.
- `anchor_left/top/right/bottom` (0..1): which fraction of the parent edge each side tracks.
- `offset_left/top/right/bottom` (px): pixel distance from the anchored point.

Set anchors with presets instead of by hand:
```gdscript
set_anchors_preset(Control.PRESET_FULL_RECT)     # fill parent
set_anchors_preset(Control.PRESET_CENTER)
set_anchors_and_offsets_preset(Control.PRESET_TOP_WIDE)
```

## Prefer containers over manual anchoring

A `Container` lays out its children automatically; children give up their own `position`/`anchors`/`offsets`. This is the idiomatic way to build responsive UI.

| Container | Behavior |
|---|---|
| `VBoxContainer` / `HBoxContainer` | Stack children in a column/row |
| `GridContainer` | Grid with `columns` count |
| `MarginContainer` | Padding via theme constants `margin_left/top/right/bottom` |
| `CenterContainer` | Centers child at its minimum size |
| `PanelContainer` | Draws a StyleBox, then fills with the child |
| `ScrollContainer` | Scrollbars when the single child overflows |
| `TabContainer` | One child visible at a time, tabbed |
| `HSplitContainer` / `VSplitContainer` | Draggable divider between two children |
| `AspectRatioContainer` | Preserves child proportions on resize |
| `FlowContainer` | Wraps children to the next line/column |

### Size flags (how a child fills its container slot)
```gdscript
size_flags_horizontal = Control.SIZE_EXPAND_FILL   # grow to take free space and fill it
size_flags_vertical = Control.SIZE_SHRINK_CENTER
size_flags_stretch_ratio = 2.0                      # take 2x share vs siblings
```
`SIZE_FILL` (occupy the slot), `SIZE_EXPAND` (claim extra space), `SIZE_EXPAND_FILL` (both), `SIZE_SHRINK_CENTER`/`SHRINK_END` (stay minimum, align).

## Common nodes and signals

```gdscript
# Buttons
$Button.pressed.connect(_on_pressed)
$CheckButton.toggled.connect(func(on: bool) -> void: ...)
$OptionButton.item_selected.connect(func(idx: int) -> void: ...)

# Text
$Label.text = "Score: %d" % score
$RichTextLabel.bbcode_enabled = true
$RichTextLabel.text = "[b]Boss[/b] [color=red]warning[/color]"
$LineEdit.text_submitted.connect(_on_submit)      # Enter pressed
$TextEdit                                          # multiline editor

# Ranges
$HSlider.value_changed.connect(func(v: float) -> void: ...)
$ProgressBar.value = hp                            # also set min_value/max_value
```

## Input handling on Controls

Controls receive `_gui_input(event)`, gated by `mouse_filter`:
- `MOUSE_FILTER_STOP` (default): handle the event, stop propagation.
- `MOUSE_FILTER_PASS`: handle, then let it continue to nodes behind.
- `MOUSE_FILTER_IGNORE`: invisible to mouse (use on decorative labels/panels so clicks reach the control beneath).

```gdscript
func _gui_input(event: InputEvent) -> void:
    if event is InputEventMouseButton and event.pressed:
        accept_event()   # consume; equivalent to set_input_as_handled for GUI
```

Focus and keyboard/gamepad navigation: set `focus_mode`, wire `focus_neighbor_*`, and call `grab_focus()` on the first control when a menu opens.

## Theming

Prefer a `Theme` resource on a root Control (inherited by descendants) over per-node styling. For one-off tweaks use typed overrides:
```gdscript
$Label.add_theme_color_override("font_color", Color.RED)
$Label.add_theme_font_size_override("font_size", 24)
$Panel.add_theme_stylebox_override("panel", my_stylebox)
remove_theme_color_override("font_color")          # revert to theme
```
Each control type exposes named theme items (colors, fonts, font sizes, constants, styleboxes) listed under "Theme Properties" in its class docs.

## %unique names and @onready

UI trees get deep; use unique names so paths do not break when you reparent.
```gdscript
@onready var score_label: Label = %ScoreLabel      # mark node "Access as Unique Name"
@onready var hp_bar: ProgressBar = %HPBar
```

## Show/hide and modality

```gdscript
$Menu.visible = false                  # hidden but still in tree (process continues)
$Menu.hide()                           # same as visible = false
# Pause the world behind a menu without freezing the menu:
get_tree().paused = true
$PauseMenu.process_mode = Node.PROCESS_MODE_WHEN_PAUSED
```
For dialogs, `AcceptDialog`/`ConfirmationDialog`/`Window` provide `popup_centered()` and a `confirmed` signal.

## Pitfalls

- Building UI under `Node2D` instead of `Control`/`CanvasLayer`. UI belongs in the Control tree.
- Setting `position`/`offsets` on a child of a `Container`. The container overwrites them; change `custom_minimum_size` and size flags instead.
- Decorative panels eating clicks: set their `mouse_filter` to `IGNORE`.
- Reaching for Godot 3 names (`rect_size`, `margin_top`, `rect_min_size`). They no longer exist.
