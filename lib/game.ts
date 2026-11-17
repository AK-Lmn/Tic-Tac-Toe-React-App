export type Player = "X" | "O";
export type Cell = Player | null;
export type Board = readonly Cell[];
export type Line = [number, number, number];

export type Result =
  | { status: "playing" }
  | { status: "won"; winner: Player; line: Line }
  | { status: "draw" };

export const WIN_LINES: readonly Line[] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function calculateResult(board: Board): Result {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const first = board[a];
    if (first && first === board[b] && first === board[c]) {
      return { status: "won", winner: first, line };
    }
  }
  return board.every((cell) => cell !== null)
    ? { status: "draw" }
    : { status: "playing" };
}
