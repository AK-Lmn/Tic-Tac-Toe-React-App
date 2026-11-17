import { describe, expect, it } from "vitest";
import {
  gameReducer,
  initialState,
  type GameAction,
  type GameState,
} from "@/lib/gameReducer";

const run = (moves: number[], from: GameState = initialState): GameState =>
  moves.reduce<GameState>(
    (s, index) => gameReducer(s, { type: "play", index }),
    from,
  );

// X: 0,1,2 wins on the top row; O plays 3,4.
const X_WINS = [0, 3, 1, 4, 2];
// X O X / X O O / O X X, no line. Move order alternates X,O,X,O...
const DRAW = [0, 1, 2, 4, 3, 5, 7, 6, 8];
// Last move (8) fills the board and completes X's 0-4-8 diagonal.
const WIN_ON_LAST = [0, 1, 2, 3, 4, 5, 7, 6, 8];

describe("gameReducer", () => {
  it("places X first and passes the turn to O", () => {
    const s = gameReducer(initialState, { type: "play", index: 4 });
    expect(s.board[4]).toBe("X");
    expect(s.current).toBe("O");
  });

  it("ignores a play on an occupied cell, returning the same state", () => {
    const s = run([4]);
    expect(gameReducer(s, { type: "play", index: 4 })).toBe(s);
  });

  it("ignores out-of-range indexes", () => {
    expect(gameReducer(initialState, { type: "play", index: 9 })).toBe(initialState);
    expect(gameReducer(initialState, { type: "play", index: -1 })).toBe(initialState);
  });

  it("records a win, scores it once, and ignores later plays", () => {
    const s = run(X_WINS);
    expect(s.result.status).toBe("won");
    expect(s.scores).toEqual({ X: 1, O: 0, draws: 0 });
    expect(gameReducer(s, { type: "play", index: 8 })).toBe(s);
  });

  it("scores a draw as a draw only", () => {
    const s = run(DRAW);
    expect(s.result).toEqual({ status: "draw" });
    expect(s.scores).toEqual({ X: 0, O: 0, draws: 1 });
  });

  it("scores a win, not a draw, when the last move fills the board and completes a line", () => {
    const s = run(WIN_ON_LAST);
    expect(s.result.status).toBe("won");
    expect(s.scores).toEqual({ X: 1, O: 0, draws: 0 });
  });

  it("newGame after a win clears the board, keeps scores and gives O the first move", () => {
    const s = gameReducer(run(X_WINS), { type: "newGame" });
    expect(s.board.every((c) => c === null)).toBe(true);
    expect(s.result).toEqual({ status: "playing" });
    expect(s.scores.X).toBe(1);
    expect(s.starter).toBe("O");
    expect(s.current).toBe("O");
  });

  it("newGame mid-game leaves scores unchanged", () => {
    const s = gameReducer(run([0, 1]), { type: "newGame" });
    expect(s.scores).toEqual({ X: 0, O: 0, draws: 0 });
    expect(s.board.every((c) => c === null)).toBe(true);
  });

  it("is pure: the same finishing action on the same input scores identically", () => {
    const before = run(X_WINS.slice(0, 4));
    const action: GameAction = { type: "play", index: 2 };
    const a = gameReducer(before, action);
    const b = gameReducer(before, action);
    expect(a.scores).toEqual(b.scores);
    expect(a.scores.X).toBe(1);
    expect(before.scores.X).toBe(0);
  });
});
