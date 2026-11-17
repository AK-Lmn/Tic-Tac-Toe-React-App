import { calculateResult, type Board, type Player, type Result } from "./game";

export type Scores = { X: number; O: number; draws: number };

export type GameState = {
  board: Board;
  current: Player;
  starter: Player;
  result: Result;
  scores: Scores;
};

export type GameAction = { type: "play"; index: number } | { type: "newGame" };

export const initialState: GameState = {
  board: Array(9).fill(null),
  current: "X",
  starter: "X",
  result: { status: "playing" },
  scores: { X: 0, O: 0, draws: 0 },
};

const other = (p: Player): Player => (p === "X" ? "O" : "X");

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "play": {
      const { index } = action;
      if (
        state.result.status !== "playing" ||
        !Number.isInteger(index) ||
        index < 0 ||
        index > 8 ||
        state.board[index] !== null
      ) {
        return state;
      }
      const board = state.board.map((cell, i) =>
        i === index ? state.current : cell,
      );
      const result = calculateResult(board);
      const scores =
        result.status === "won"
          ? { ...state.scores, [result.winner]: state.scores[result.winner] + 1 }
          : result.status === "draw"
            ? { ...state.scores, draws: state.scores.draws + 1 }
            : state.scores;
      return { ...state, board, result, scores, current: other(state.current) };
    }
    case "newGame": {
      const starter = other(state.starter);
      return {
        ...initialState,
        board: Array(9).fill(null),
        starter,
        current: starter,
        scores: state.scores,
      };
    }
  }
}
