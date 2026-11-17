import { describe, expect, it } from "vitest";
import { WIN_LINES, calculateResult, type Board, type Cell } from "@/lib/game";

const parse = (s: string): Board =>
  [...s].map((c): Cell => (c === "X" || c === "O" ? c : null));

describe("calculateResult", () => {
  it("reports playing for an empty board", () => {
    expect(calculateResult(parse("........."))).toEqual({ status: "playing" });
  });

  it("reports playing for a partial board with no line", () => {
    expect(calculateResult(parse("XO..X...O"))).toEqual({ status: "playing" });
  });

  it.each(WIN_LINES)("detects X winning on line %i-%i-%i", (a, b, c) => {
    const cells: string[] = Array(9).fill(".");
    [a, b, c].forEach((i) => (cells[i] = "X"));
    expect(calculateResult(parse(cells.join("")))).toEqual({
      status: "won",
      winner: "X",
      line: [a, b, c],
    });
  });

  it("detects O winning on column 1", () => {
    const r = calculateResult(parse("XO.XO..O."));
    expect(r).toEqual({ status: "won", winner: "O", line: [1, 4, 7] });
  });

  it("reports draw for a full board with no line", () => {
    expect(calculateResult(parse("XOXXOOOXX"))).toEqual({ status: "draw" });
  });

  it("reports a win, not a draw, when the last move fills the board and completes a line", () => {
    const r = calculateResult(parse("XOXOXOOXX"));
    expect(r).toEqual({ status: "won", winner: "X", line: [0, 4, 8] });
  });
});
