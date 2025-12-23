D&D Dice Roller — Working Prototype Instructions
Purpose

Build a production-quality D&D dice roller prototype suitable for real D&D games (DM-facing first), not a demo.
The system must support mods, multiple parsers, themes, and deterministic 3D rolls, while remaining extensible.

The AI copilot must only extend and solidify what already exists, not redesign the system.

What Already Exists (Do Not Replace)

The following components are already present and must be kept, stabilized, and expanded:

React UI

Dice notation input

Roll trigger

Display of results

Parser Interface

Abstract contract for dice parsers

One or more example parser implementations

3D Dice Rendering

Uses dice-box-threejs

Integrated with Three.js

Theme Picker

Light/Dark or visual themes

Demo site wiring

The goal is to turn these into a cohesive, game-ready system.

Core Design Rules (Non-Negotiable)
1. Parser-First Architecture

The parser is the source of truth, not the renderer.

3D dice must reflect parser output, not generate results themselves.

Physics randomness must be seeded from parser output.

2. Determinism Is Mandatory

The same input + seed must always produce:

The same roll results

The same dice visuals

This is required for:

Replays

Debugging

Multiplayer / shared rolls later

3. Mod System Is First-Class

Mods are not optional sugar — they are part of core design.

Dice Notation & Mods (Expanded & Locked In)
Required Dice Support

The parser(s) must support standard D&D notation, including:

d20

2d6

4d6kh3 (keep highest)

4d6kl1 (drop lowest)

1d20 + 5

2d8 + 1d6 + 3

Required Modifiers (Mods)

Mods must be parsed into a structured AST, not strings.

Core Mods

khX / klX — keep highest / lowest

dhX / dlX — drop highest / lowest

+N, -N — flat modifiers

adv, dis — advantage/disadvantage (d20 only)

Conditional Mods

Exploding dice: !, !!

Reroll: r<, r<=, ro<

Minimum / maximum clamps (future-safe)

Mod Execution Rules

Mods execute in defined order:

Roll dice

Apply rerolls

Apply explode

Apply keep/drop

Apply totals & modifiers

Each step must emit intermediate data for UI display.


## Rerolls & Mods (behavior & adapter functions) ⚙️

Summary
- Rerolls are a first-class mod type (explode, compound, penetrate, reroll, rerollOnce). The parser detects them and represents them as structured mod objects on each group.
- The demo uses a ParserAdapter that exposes four primary functions used by the UI and dice engine: `parseNotation`, `rollNotation`, `handleRerolls`, and `parseFinalResults`.

Reroll flow (high level)
1. Parser produces parsed groups (with `mods`) for a notation.
2. DiceBox rolls dice according to parsed groups and emits raw `results` to the parser adapter.
3. Adapter `handleRerolls(results)` inspects the latest roll for each die and returns an array of reroll requests if any mod(s) require re-rolling (e.g., exploding dice where the latest sub-roll equals the target).
4. The UI/engine calls `diceBox.reroll(rerolls)` to perform the rerolls. Repeat steps 2–4 until `handleRerolls` returns an empty list.
5. Final results are passed to `parseFinalResults(results)` to produce a flattened, UI-friendly object with `rolls[]` and `value`.

Reroll request object (canonical shape)
- Each reroll request is an object with at least these properties:
  - `groupId` — index of the group to reroll
  - `rollId` — a string identifier for the die to reroll (supports nested sub-roll ids like `0`, `0.1`, `0.1.1`)
  - `sides` — number of sides (e.g., `6`)
  - `qty` — number of dice to reroll (usually `1`)

Notes on nested sub-rolls
- When an exploding die is re-rolled it produces a new sub-roll id (for example, `0.1`). If that sub-roll also meets the explode target, the adapter produces another reroll request for the latest sub-roll (e.g., `0.1.1`). This continues until no new rerolls are required.

Parser adapter functions (what they do)
- `parseNotation(notation: string) => Group[]`
  - Converts a notation string into an array of group objects with `qty`, `sides`, and a `mods` array (each mod is a structured object `{ type: 'explode'|'keep'|'modifier'|... , ... }`). Example mod: `{ type: 'modifier', value: 2 }`.

- `rollNotation(groups: Group[]) => { rolls: Record<id, Die>, value: number }`
  - Simulates or maps rolled dice into a normalized object map keyed by die id (used in tests and non-visual flows). Returns a `value` total and `rolls` mapping.

- `handleRerolls(results) => RerollRequest[]`
  - Inspects the *latest* roll per die to decide whether a reroll is required. For exploding mods it checks `die.result === die.sides`. It returns requests describing which dice must be re-rolled.

- `parseFinalResults(results) => { rolls: Die[], value: number }`
  - Accepts either the dice-box group array shape or the adapter `rollNotation` object. It flattens die entries into `rolls[]` and computes the final `value` total (summing group values if supplied, otherwise summing individual die results). It also marks dropped dice via `isDropped` where applicable.

Examples
- Parsed group (example):
```
{
  qty: 4,
  sides: 6,
  mods: [ { type: 'explode' }, { type: 'keep', keep: { type: 'kh', count: 3 } }, { type: 'modifier', value: 2 } ]
}
```

- Reroll request (example):
```
{ groupId: 0, rollId: '0.1', sides: 6, qty: 1 }
```

UI responsibilities for rerolls
- Listen for reroll requests emitted from the parser adapter (or from the `DiceBox` pipeline), call `diceBox.reroll(rerolls)` and wait for the reroll to finish before re-checking `handleRerolls`.
- Provide a small indicator (spinner or message) while rerolls are being performed (the demo includes `rerolling` state and a `Rerolling…` indicator).

Testing recommendations
- Unit test `handleRerolls` against nested sub-rolls and ensure the adapter returns correct reroll ids for multi-stage explosions.
- Add an E2E test where the dice engine performs rerolls until completion then assert `parseFinalResults` matches expected aggregated totals.

---



Parser Interface (Strict Contract)

All parsers must implement the same interface.

Input
parse(input: string, options?: ParseOptions): ParseResult

Output (Required Shape)
ParseResult {
  notation: string
  dice: DiceGroup[]
  modifiers: Modifier[]
  rolls: RollResult[]
  total: number
  seed: string
  metadata: {
    parserName: string
    version: string
  }
}

Errors

Errors must be structured, not thrown strings

UI must be able to:

Highlight input errors

Display user-friendly messages

UI Requirements (React)
Dice Input

Single-line input

Supports pasting full expressions

Inline validation (parser-driven)

Roll History

Stores:

Input

Seed

Total

Individual dice

Replayable rolls (same seed)

Mod Visibility

Users must be able to:

See which mods were applied

See which dice were kept/dropped

Toggle visibility of calculation steps

Theme System (Double-Checked & Expanded)
Theme Picker Requirements

Themes are not just colors.

Each theme defines:

Dice materials (color, texture, metalness)

Table/background visuals

UI color variables

Font accents (optional)

Theme Architecture

Themes must be:

JSON or TS objects

Hot-swappable at runtime

Stored in:

localStorage

Applied to:

React UI

dice-box-threejs materials

Required Themes (Minimum)

Default Light

Default Dark

#### Dice Themes (integration notes)
- Use the official `dice-themes` collection to provide community and curated themes.
- The demo includes a `ThemePicker` component that will dynamically import `@3d-dice/dice-themes` when available and present available themes to users.

- Note: theme files in `public/assets/themes` and `dist/assets/themes` are generated from `packages/dice-themes/themes` and should not be edited directly; use `packages/dice-themes` as the canonical source and run `npm run themes:copy` (or `npm run dev` / `npm run build`) to regenerate them.

- To enable the official themes in the demo, run:

```bash
cd demo/react-project
npm install @3d-dice/dice-themes
```

- The DiceBox engine accepts a `theme` identifier via `updateConfig({ theme })`. Passing a theme id (as supplied by the dice-themes package) will cause DiceBox to load the corresponding theme definitions and materials automatically.



3D Dice Rules (dice-box-threejs)

Dice count, type, and faces must match parser output

Dice rolls must:

Use seeded randomness

Land on the face dictated by parser result

Camera must:

Auto-frame all dice

Be readable on desktop and tablet

Testing (Required, Not Optional)
Parser Tests

Edge cases (invalid syntax)

Mod ordering correctness

Deterministic output

UI Tests

Input → parse → roll → render flow

Theme switching persistence

Error rendering

Documentation Expectations

The AI copilot must:

Update docs/dice_docs.md

Document:

Parser interface

Mod system

Theme system

Determinism guarantees

Definition of “Best D&D Dice Roller” (For This Project)

A roll is considered correct only if:

The parser understands the notation

Mods are applied in correct order

The result is deterministic

The 3D roll visually matches the result

The user can understand why they got that number

Final Instruction to Copilot

Treat this as a game tool, not a toy demo.
Every decision must favor clarity, correctness, and extensibility over shortcuts.