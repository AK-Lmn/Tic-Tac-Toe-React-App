---
name: Tic-Tac-Toe
description: A rigid construction sheet that a wild human hand scribbles on; exact grid, marker marks, one orange strike.
colors:
  paper: "#fafaf6"
  paper-night: "#0c0e1a"
  ink: "#121212"
  ink-night: "#f4f2ea"
  signal-orange: "#ff4a1c"
  signal-orange-night: "#ff6a3d"
  construction-blue: "#2f4bff"
  construction-blue-night: "#8a9bff"
typography:
  status:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 8cqw, 2.4rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  score:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.15
  action:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
  wordmark:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    letterSpacing: "-0.005em"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
rounded:
  none: "0px"
spacing:
  gap: "1rem"
  cell: "25cqw"
  sheet-margin: "12.5cqw"
components:
  button-new-game:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0.95rem 1rem"
    typography: "{typography.action}"
  button-new-game-hover:
    backgroundColor: "{colors.signal-orange}"
    textColor: "{colors.ink}"
  square:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "25cqw"
  scoreboard-cell:
    textColor: "{colors.ink}"
    padding: "0.6rem 0.75rem 0.5rem"
    rounded: "{rounded.none}"
---

# Design System: Tic-Tac-Toe

## Overview

**Creative North Star: "The Construction Sheet"**

An exact grid with a wild hand on it. The sheet is ruled in faint blue construction hairlines that divide the space into square cells; everything else (board, score row, bar) hangs off those cell edges. The marks are the only unruly thing: seeded black-marker X and O scribbles made of several overlapping strokes, drawn on at the moment of play. One signal orange appears when something is decided: the winning strike, and the press of New Game.

The register is a Crouwel-style gridded specimen: neo-grotesque type, tabular numerals, sharp corners, ink on paper. Dark mode keeps the same plan on a blue-black ground. The board is the hero; chrome stays quiet, flat, and hairline-thin.

**Key Characteristics:**
- Visible cell grid; board edges land on construction lines (half-cell sheet margin).
- Sharp corners everywhere, no radius anywhere.
- Marker-scribble marks, deterministic per seed, drawn on stroke by stroke.
- Orange is rare and means "decided" or "act".
- Flat: depth comes from hairlines and tint, never shadow.
- Light and dark follow the system.

## Colors

A near-monochrome ink-on-paper palette, a blue hairline tint for structure, and one hot orange.

### Primary
- **Signal Orange** (see `signal-orange`; `signal-orange-night` in dark): the winning strike, text selection, and New Game hover and press. Never a fill for large surfaces.

### Neutral
- **Sheet Paper** (`paper` / `paper-night`): page ground, a warm white and a blue-black.
- **Marker Ink** (`ink` / `ink-night`): marks, hash dividers, type, score rules, and the New Game bar at rest.
- **Construction Blue** (`construction-blue` / `construction-blue-night`): never used solid. Mixed into transparency at 17% (light) and 24% (dark) for grid hairlines, 9% and 12% for hover tint, 18% and 24% for press tint.

### Named Rules
**The One Strike Rule.** Orange marks a decision or an action, and nothing else. If a screen shows more than one orange element at rest, one of them is wrong.
**The Blue Is Only Air Rule.** Construction blue exists only as a low-alpha tint of the grid and cell states. It is never text, a border at full strength, or a button.
**The Mark Reads Without Color Rule.** X and O are distinguished by shape (diagonals versus loops), never by hue; orange is reserved for the strike.

## Typography

**Display, Body, and Label Font:** Archivo (via next/font, with system-ui, sans-serif fallback). One family throughout; tabular numerals set on body.

**Character:** A plain neo-grotesque doing specimen duty. Contrast comes from weight (500 to 800) and size, not from a second face.

### Hierarchy
- **Status** (800, clamp(1.6rem, 8cqw, 2.4rem), 1.1, -0.02em): the whose-turn or result line, led by a small drawn mark at 1.2em.
- **Score** (700, 2rem, 1.15): the three counters.
- **Action** (600, 1rem): New Game.
- **Wordmark** (600, 0.875rem, -0.005em): the title above the status line.
- **Label** (500, 0.8rem): score captions (X wins, Draws, O wins).

### Named Rules
**The Weight Does The Work Rule.** Hierarchy comes from weight and size in one family; do not introduce a second typeface.

## Layout

One centered column whose width is `min(100% - 2rem, clamp(18rem, 100dvh - 20rem, 40rem))`, declared as a size container so every inner measure is in `cqw`. A cell is 25cqw; the sheet pads 12.5cqw (half a cell) on all sides so the three-cell board begins and ends on grid lines. The bar (wordmark, status) and dock (scores, New Game) inset by the same 12.5cqw, so text and score cells share the board's column edges. Vertical rhythm between bar, sheet, and dock is 1rem. Works from 320px; the board sizes to the viewport height on short screens.

**The Cell Alignment Rule.** Anything that sits under or beside the board is measured in the board's cell units (cqw), not in rem or percentages of the viewport.

## Elevation & Depth

Flat. There are no drop shadows. The sheet carries a 1px inset hairline frame (`inset 0 0 0 1px` in grid blue) that completes the outer edge of the ruled grid. State is shown by background tint and ghost previews, not lift.

**The Flat Sheet Rule.** Surfaces never lift; feedback is a tint change or a stroke, not a shadow.

## Shapes

Sharp, rectilinear, square. Squares are 1:1 cells with no radius. Dividers are ink hash lines (dashed-draw paths, 2.2 stroke, square caps); the marks themselves are round-capped, round-joined marker strokes at varying widths. The contrast between square structure and round hand is the signature.

## Components

### Squares (board cells)
Transparent buttons, 1:1, ink. Marks fill 78% of the cell. Squares use `aria-disabled` so keyboard focus survives a move.
- **Hover (pointer devices):** 9% blue tint plus a ghost of the next player's mark at 0.16 opacity.
- **Focus-visible:** 3px ink outline inset 8px; the ghost shows too.
- **Press:** 18% blue tint, ghost to 0.3.
- **Occupied or game over:** no hover or tint, default cursor.
- **Win:** non-winning marks step back to 0.4 opacity; on a draw all marks dim to 0.6.

### Marks
Seeded scribbles from one generator: X is several overlapping long strokes in two diagonals; O is five to six wobbly overlapping loops. Same player and seed always yields the same drawing. Drawn on with a 200ms stroke dash animation, 28ms stagger per stroke, expo-out easing.

### Win strike
A single orange marker line through the winning three, extending 30 units past the outer marks, drawn on after 220ms with a 300ms animation.

### Status line
Heading-weight text with a small drawn mark of whoever is up or has won. On a draw there is no mark.

### Score row
Three equal cells aligned to the board's columns, separated by 1px ink rules top and bottom and between cells. Caption above a 2rem numeral; a nonzero count ticks in (220ms rise and fade).

### New Game button
Full width, ink fill, paper text, left-aligned, no radius. Hover and press flip to orange fill with ink text; press nudges 1px down. Focus-visible is a 3px ink outline offset 3px.

### Motion
Crisp, one authored moment, nothing loops. Single easing `cubic-bezier(0.16, 1, 0.3, 1)`. State changes run 90 to 240ms; strokes draw 200 to 420ms. All draw-on and tick animation is gated by `prefers-reduced-motion: no-preference`.

## Do's and Don'ts

### Do:
- **Do** align every new element to cell edges (25cqw cell, 12.5cqw half-cell inset).
- **Do** keep corners square and structure flat; use 1px hairlines for division.
- **Do** build new marks, strikes, or illustrations from the scribble generator so they stay deterministic and share the marker hand.
- **Do** keep hover, focus, and press states distinct (tint, outline, deeper tint) and make hover conditional on `(hover: hover)`.
- **Do** gate any new animation behind `prefers-reduced-motion: no-preference`.
- **Do** define colors as custom properties on `:root` with a dark override.

### Don't:
- **Don't** use orange for anything that is not a decision or an action.
- **Don't** use emoji, stock icons, or rounded pastel card styling.
- **Don't** use full-strength blue; it is only a transparent tint.
- **Don't** introduce a second typeface or color-coded X and O.
- **Don't** use `disabled` on squares; keep `aria-disabled` so focus survives.
