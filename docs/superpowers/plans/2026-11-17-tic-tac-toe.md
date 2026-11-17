# Tic-Tac-Toe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A two-player Tic-Tac-Toe game with a personality theme, win/draw detection, a New Game button and a score board, live on Vercel.

**Architecture:** All rules live in a pure `lib/game.ts`. A pure reducer in `lib/gameReducer.ts` owns board, turn, result and scores. Client components render that state and dispatch actions. No backend, no persistence.

**Tech Stack:** Next.js (App Router) + React 19, TypeScript, Tailwind CSS, Vitest + React Testing Library + user-event, Vercel.

**Spec:** Notion "Test 1: Tic-Tac-Toe React App" (https://tremendous-tiger-a4a.notion.site/Test-1-Tic-Tac-Toe-React-App-22200bbdfc3b80d089deee909ae597e4). Submission form: https://apply.capm.us

## Global Constraints

- Stack: React + Next.js, deployed on Vercel. Submit the public production URL, not a preview URL.
- Two players take turns placing marks on a 3×3 board. X/O, emoji, icons or GIFs are all allowed.
- The game must show who won, or that it is a draw.
- A **New Game** button (exact label) starts over.
- Bonus, optional: a score board counting wins and draws. Included here.
- GitHub repo must be public. Submission needs screenshots; a demo video is optional.
- "We love style and personality": theme is a deliberate choice, not default Tailwind gray.
- Spec suggests Tailwind and shadcn/ui; shadcn is optional and skipped here (YAGNI, one button).

## Review Focus

1. Clicking an occupied square: nothing changes, turn does not flip.
2. Clicking any square after the game ended: ignored until New Game.
3. Last move fills the board AND completes a line: that is a win, not a draw.
4. New Game mid-game: board clears, scores stay. Score counted exactly once per finished game.
5. Narrow phone width (320px) and keyboard-only play (Tab, Enter/Space): board stays usable, no horizontal scroll.

---

## File Structure

| File | Responsibility |
|---|---|
| `lib/game.ts` | Pure rules: types, `WIN_LINES`, `calculateResult` |
| `lib/gameReducer.ts` | `GameState`, `GameAction`, `initialState`, `gameReducer` |
| `lib/marks.ts` | Theme constants: label and glyph per player |
| `components/Game.tsx` | Client component, `useReducer`, composes the rest |
| `components/Board.tsx`, `Square.tsx` | 3×3 grid, one button per cell |
| `components/StatusBanner.tsx` | Turn / winner / draw text |
| `components/ScoreBoard.tsx` | X wins, O wins, draws |
| `app/page.tsx`, `app/layout.tsx`, `app/globals.css` | Page shell, metadata, theme tokens |
| `__tests__/*.test.ts(x)` | One test file per unit above |

---

### Task 1: Scaffold, tooling, first deploy-ready build

**Files:**
- Create: whole Next.js app in repo root, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`
- Modify: `package.json` (add `"test": "vitest run"`)

**Interfaces:**
- Produces: `npm test` and `npm run build` both exit 0.

- [ ] **Step 1: Scaffold in the existing repo root**

Run: `npx create-next-app@latest . --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"`
Expected: app files created, no `src/` dir. Accept the default for any other prompt except Turbopack/React Compiler (either is fine).

- [ ] **Step 2: Add test tooling**

Run: `npm i -D vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom`
Config: `vitest.config.ts` uses the react plugin, `environment: "jsdom"`, `setupFiles: ["./vitest.setup.ts"]`, alias `@` to repo root. `vitest.setup.ts` imports `@testing-library/jest-dom/vitest`.

- [ ] **Step 3: Write a smoke test** `__tests__/smoke.test.ts`: `expect(1 + 1).toBe(2)`.
Run: `npm test`
Expected: 1 passed.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Vitest"
```

---

### Task 2: Game rules

**Files:**
- Create: `lib/game.ts`
- Test: `__tests__/game.test.ts`

**Interfaces:**
- Produces:
  - `type Player = "X" | "O"`
  - `type Cell = Player | null`
  - `type Board = readonly Cell[]` (length 9, index = row*3+col)
  - `type Result = { status: "playing" } | { status: "won"; winner: Player; line: [number, number, number] } | { status: "draw" }`
  - `const WIN_LINES: readonly [number, number, number][]` (8 lines)
  - `calculateResult(board: Board): Result`

- [ ] **Step 1: Write failing tests** in `__tests__/game.test.ts`, building boards from 9-char strings (`"XXXOO...."`, `.` = empty):
  - `calculateResult(empty)` → `{ status: "playing" }`
  - each of the 8 lines for X returns `won` with that exact `line` (use `it.each(WIN_LINES)`)
  - O winning on column 1 returns `winner: "O"`
  - `"XOXXOOOXX"` (full, no line) → `{ status: "draw" }`
  - `"XOXOXOOXX"` (full, X wins on the 0-4-8 diagonal) → `won`, not `draw` (Review Focus 3)
  - partially filled, no line → `playing`

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run __tests__/game.test.ts`
Expected: FAIL, cannot resolve `@/lib/game`.

- [ ] **Step 3: Implement** the types, `WIN_LINES` and `calculateResult` in `lib/game.ts`. Check lines first, then full board, else playing.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run __tests__/game.test.ts`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/game.ts __tests__/game.test.ts
git commit -m "feat: add pure game rules"
```

---

### Task 3: Game reducer with scores

**Files:**
- Create: `lib/gameReducer.ts`
- Test: `__tests__/gameReducer.test.ts`

**Interfaces:**
- Consumes: `Board`, `Player`, `Result`, `calculateResult` from `lib/game.ts`.
- Produces:
  - `type Scores = { X: number; O: number; draws: number }`
  - `type GameState = { board: Board; current: Player; starter: Player; result: Result; scores: Scores }`
  - `type GameAction = { type: "play"; index: number } | { type: "newGame" }`
  - `const initialState: GameState` (X starts, empty board, zero scores)
  - `gameReducer(state: GameState, action: GameAction): GameState` (pure, never mutates `state`)

Decisions: `play` on an occupied cell, an out-of-range index, or a finished game returns the **same state object**. A finishing move updates `scores` once, in the same transition. `newGame` clears the board, keeps scores, and alternates `starter` (the new starter also becomes `current`).

- [ ] **Step 1: Write failing tests**
  - first `play` 4 puts "X" at 4 and sets `current` to "O"
  - `play` on occupied cell → `toBe(state)` (identity, Review Focus 1)
  - play X0 O3 X1 O4 X2 → `result.status === "won"`, `scores.X === 1`; further `play` returns identical state (Review Focus 2)
  - a full-board game ending in a draw increments `scores.draws` only
  - final move that fills the board and completes a line increments the winner, not draws (Review Focus 3)
  - `newGame` after a win: board empty, `scores.X === 1` kept, `starter === "O"`, `current === "O"` (Review Focus 4)
  - `newGame` mid-game leaves scores unchanged
  - calling `gameReducer` twice with the same finishing action on the same input state yields equal scores (purity, safe under React StrictMode)
  - `play` with index `9` and `-1` returns same state

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run __tests__/gameReducer.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Implement** `initialState` and `gameReducer` in `lib/gameReducer.ts`. Build a new board array on each move; compute `result` with `calculateResult`.

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/gameReducer.ts __tests__/gameReducer.test.ts
git commit -m "feat: add game reducer with scores and alternating starter"
```

---

### Task 4: Playable UI

**Files:**
- Create: `lib/marks.ts`, `components/Game.tsx`, `components/Board.tsx`, `components/Square.tsx`, `components/StatusBanner.tsx`, `components/ScoreBoard.tsx`
- Modify: `app/page.tsx` (render `<Game />`), `app/layout.tsx` (title, description)
- Test: `__tests__/Game.test.tsx`

**Interfaces:**
- Consumes: `gameReducer`, `initialState`, `GameState` from Task 3.
- Produces:
  - `MARKS: Record<Player, { name: string; glyph: string }>` in `lib/marks.ts` (theme: `X` → `{ name: "Cat", glyph: "🐱" }`, `O` → `{ name: "Dog", glyph: "🐶" }`)
  - `Game(): JSX.Element` (`"use client"`)
  - `Square({ index, value, onPlay, disabled, highlight }: { index: number; value: Cell; onPlay: (i: number) => void; disabled: boolean; highlight: boolean })`: a `<button>` with `aria-label` `"Square {row},{col}, empty"` or `"Square {row},{col}, {name}"` (1-based row/col)
  - `StatusBanner({ state }: { state: GameState })`: `role="status"`, text `"{name}'s turn"`, `"{name} wins!"`, or `"It's a draw!"`
  - `ScoreBoard({ scores }: { scores: Scores })`: three labelled counters (`Cat wins`, `Dog wins`, `Draws`)
  - New Game: a `<button>` labelled exactly `New Game`

- [ ] **Step 1: Write failing tests** in `__tests__/Game.test.tsx` using `userEvent`:
  - renders 9 squares and the text "Cat's turn"
  - clicking square 1,1 shows the cat glyph there and "Dog's turn"
  - cats take 1,1 1,2 1,3 with dogs on 2,1 2,2 → status "Cat wins!"
  - all remaining squares are disabled after a win; clicking one does not change the board
  - a known draw sequence → status "It's a draw!"
  - clicking an occupied square leaves the turn text unchanged
  - after a cat win, `New Game` clears all squares, "Cat wins" counter reads 1, and the starting turn text is "Dog's turn"
  - `New Game` mid-game clears squares and keeps counters
  - pressing Enter on a focused empty square plays it (keyboard, Review Focus 5)

- [ ] **Step 2: Run to verify fail**

Run: `npx vitest run __tests__/Game.test.tsx`
Expected: FAIL, components not found.

- [ ] **Step 3: Implement** the components. `Game` holds `useReducer(gameReducer, initialState)`. Win-line squares get `highlight`. Native `<button>` elements give keyboard support for free; do not use `div` + `onClick`. Squares are disabled when occupied or when `result.status !== "playing"`.

- [ ] **Step 4: Run to verify pass**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/marks.ts components app __tests__/Game.test.tsx
git commit -m "feat: playable board with status, scores and New Game"
```

---

### Task 5: Style, personality, responsiveness

**Files:**
- Modify: `app/globals.css` (theme tokens on `:root`, dark-mode override), `components/*.tsx` (classes only), `app/layout.tsx` (font)
- Test: `__tests__/Game.test.tsx` (append one test)

**Interfaces:**
- Consumes: component props from Task 4 (unchanged).
- Produces: no new exports.

Decisions: playful cat-vs-dog palette via CSS variables (warm cream background, two player accent colors, not default Tailwind grays). Board is `min(92vw, 28rem)` square with `aspect-square` cells. Winning line gets a pulse animation, wrapped in `motion-safe:`. Visible `focus-visible` ring on squares and the button. Text contrast at least 4.5:1 in light and dark.

- [ ] **Step 1: Write failing test**: after a cat win, exactly three squares have `data-win="true"` and the rest do not.
Run: `npx vitest run __tests__/Game.test.tsx -t "win highlight"`
Expected: FAIL.

- [ ] **Step 2: Implement** `data-win={highlight}` on `Square`, then the styling above.

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: all PASS.

- [ ] **Step 4: Visual check** with `npm run dev`. In a browser, verify at 320px, 768px and desktop widths: no horizontal scroll, board fully visible, Tab reaches every square and `New Game`, win highlight shows. Capture screenshots (idle, mid-game, win, draw) into `docs/screenshots/` for the submission.

- [ ] **Step 5: Commit**

```bash
git add app components __tests__ docs/screenshots
git commit -m "feat: cat-vs-dog theme, responsive layout, win highlight"
```

---

### Task 6: Ship and submit

**Files:**
- Create: `README.md` (what it is, how to run `npm run dev`, `npm test`, live URL)

- [ ] **Step 1: Final gate**

Run: `npm run lint && npm test && npm run build`
Expected: all exit 0.

- [ ] **Step 2: Make the GitHub repo public and push** (ask the user before pushing; confirm `AK-Lmn/Tic-Tac-Toe-React-App` visibility is public).

```bash
git add README.md
git commit -m "docs: add README"
git push -u origin main
```

- [ ] **Step 3: Deploy to production**

Run: `npx vercel --prod`
Expected: prints a production URL. Open it and play one full game, one draw, and New Game. Use the production alias, not the preview URL.

- [ ] **Step 4: Submit** at https://apply.capm.us: pick "1) Tic-Tac-Toe", paste the live URL and repo URL, upload screenshots, add an optional Loom link and a short note. The user submits; the form is theirs to fill.

---

## Self-Review

- **Spec coverage:** turns on 3×3 (T2–T4), win/draw display (T2, T4), New Game (T4), bonus scores (T3, T4), style/personality (T5), Vercel + public repo + screenshots + submission (T6). No gaps.
- **Type consistency:** `Player`, `Board`, `Result`, `Scores`, `GameState`, `GameAction` defined in T2/T3 and used with the same names in T4. `MARKS` names (Cat/Dog) match the test strings.
- **Review Focus:** items 1–4 pinned in T2/T3/T4 tests; item 5 pinned by the keyboard test in T4 and the manual width check in T5.
- **Proportion:** logic is small; plan stays signatures and assertions, no function bodies.
