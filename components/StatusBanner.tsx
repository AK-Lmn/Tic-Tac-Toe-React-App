import type { GameState } from "@/lib/gameReducer";
import { MARKS } from "@/lib/marks";

export function StatusBanner({ state }: { state: GameState }) {
  const { result, current } = state;
  const text =
    result.status === "won"
      ? `${MARKS[result.winner].name} wins!`
      : result.status === "draw"
        ? "It's a draw!"
        : `${MARKS[current].name}'s turn`;
  return (
    <p role="status" className="status">
      {text}
    </p>
  );
}
