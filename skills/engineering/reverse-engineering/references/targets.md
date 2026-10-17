---
type: Reference Matrix
title: Target profiles
description: How each class of target (cartridge and disc consoles, installed PC games, managed and engine builds, mobile apps, firmware, file formats, protocols) is run, hooked, clocked, extended, kept stable across loads, and given an oracle, so the loop applies unchanged to any of them.
tags: [reverse-engineering, platforms, tooling, games]
generated: { by: claude-code/unversioned, at: 2026-10-17T15:00:00Z }
sources:
  - id: tools-recalled
    resource: "scope:author knowledge of the named emulators, debuggers, decompilers, mod loaders, and hooking libraries; verify a tool's current features before relying on one"
  - id: cwe-emulation
    resource: https://github.com/saschb2b/Mega-Man-Battle-Network-Cyberworld-Endless/blob/main/docs/EMULATION.md
    title: "Cyberworld Endless, docs/EMULATION.md (the cartridge row, end to end)"
---

# Find the row, then run the same loop

The phases never change between targets; only the instruments do. Identify the class in phase 0 of the [goal](./goal.md), then use its row for the [harness](./harness.md), the [implementation](./implement.md), and the [differential](./differential.md). Tool names are starting points recalled from practice, not endorsements; check each one's current features first.[^tools-recalled]

# Run and instrument

| Class | Image | Run it controllably | Hook or inject | Its own clock |
| --- | --- | --- | --- | --- |
| Cartridge console (NES to GBA, N64) | ROM file | Emulator with debugger and scripting (mGBA, BizHawk, Mesen), or the core linked as a library | Breakpoint instruction or emulator callback in the loaded copy | Frame counter |
| Disc console (PSX, PS2, PSP, GameCube) | Disc image (BIN/CUE, ISO, CSO) holding an executable, overlays, and archives | Emulator with debugger (DuckStation, PCSX-Redux, PCSX2, PPSSPP, Dolphin) | Emulator breakpoints and scripting, or a patched executable in a copied image; overlays load code late | Frame or VSync count |
| Installed PC game, native (PE, ELF, Mach-O) | Executable, libraries, asset archives | The process under a debugger (x64dbg, WinDbg, gdb, lldb); record and replay (rr, WinDbg Time Travel Debugging) | An injected module or proxy library with inline detours or import table hooks (Detours, MinHook), or Frida | The game loop's tick or frame count, read from its own state |
| Managed game or app (Unity Mono, .NET, Java) | Assemblies with full metadata | Decompile to near-source (ILSpy, dnSpy); run under a mod loader (BepInEx, MelonLoader) | Method patches (Harmony prefixes and postfixes) | Engine frame count |
| Native engine build (Unity IL2CPP, Unreal, Godot) | Native code plus engine metadata | Recover names first (Il2CppDumper, Cpp2IL, UE4SS, GDRE Tools), then work as native | As native, through the recovered names | Engine frame count |
| Mobile game or app (APK, IPA) | Package of bytecode and native libraries | Emulator or a test device you own; jadx, apktool | Frida; a rebuilt package for your own device only | Game loop or UI tick |
| Firmware and embedded | Flash dump | Unpack (binwalk), then QEMU or Unicorn, or hardware with a JTAG or SWD probe | Emulator hooks, probe breakpoints | Main loop or interrupt count |
| File or save format | The files | The original application as reader and writer, headless where possible | Watch its reads to map fields; describe them as Kaitai Struct or ImHex patterns | Record index |
| Network protocol or web API | Traffic | Recording proxy (mitmproxy), packet capture (Wireshark), a replay server | Proxy rewrite rules; client hooks on your own device for encrypted channels | Message sequence number |

# Integrate and prove

| Class | New code and data go | Locations stay valid by | Natural oracle |
| --- | --- | --- | --- |
| Cartridge console | Past the image's end, and RAM the game provably leaves alone | Fixed addresses per image hash | The original in a second emulator instance, in lockstep[^cwe-emulation] |
| Disc console | Unused RAM, an extended executable, or a new file in the copied image | Fixed addresses per executable hash, and per overlay | The same, in the same emulator build |
| PC native | Memory your injected module allocates | Module-relative offsets or byte signatures, never absolute addresses (the loader relocates); pin the executable's hash, since a game update moves everything | The unmodified build in a second process, driven by the same injected input, compared through state dumps at tick boundaries |
| Managed | New types and methods in your mod assembly | Type and member names | An unpatched run with the same input, or the game's own replay system |
| Native engine | Your injected module | Recovered names mapped to addresses per build | As PC native |
| Mobile | Your injected library | Package version plus signatures | The unmodified app on a second emulator or device |
| Firmware | Flash or RAM regions a long trace shows unused | Fixed addresses per dump hash | The original firmware in the emulator, or a second board |
| File format | Nothing; you write files | The format's version field | Round trip, and the original opens what you wrote |
| Protocol or API | Nothing; you send messages | The protocol version | Recorded sessions of the original client |

# Class-specific cautions

- **Emulators are oracles only as accurate as themselves.** Confirm timing-sensitive behavior on a more accurate emulator or on hardware before you mask a difference as "the engine's".
- **Relocating loaders and updates.** A PC or mobile target moves between launches and patches. Store offsets relative to their module, prefer byte signatures for anything you find, and refuse to run against an unpinned build.
- **Threads.** A multithreaded target is deterministic only at its own sync points. Compare state at tick boundaries, not mid-step.
- **Online services.** Work offline and single-player. Never touch anti-cheat, other players' sessions, or accounts you do not own.
