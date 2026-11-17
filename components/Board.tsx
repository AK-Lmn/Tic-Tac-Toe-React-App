import type { GameState } from "@/lib/gameReducer";
import { Square } from "./Square";

type Props = { state: GameState; onPlay: (index: number) => void };

export function Board({ state, onPlay }: Props) {
  const finished = state.result.status !== "playing";
  const winLine: readonly number[] =
    state.result.status === "won" ? state.result.line : [];
  return (
    <div role="group" aria-label="Game board" className="board">
      {state.board.map((value, i) => (
        <Square
          key={i}
          index={i}
          value={value}
          onPlay={onPlay}
          disabled={finished || value !== null}
          highlight={winLine.includes(i)}
        />
      ))}
    </div>
  );
}
