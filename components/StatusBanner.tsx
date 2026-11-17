import type { GameState } from "@/lib/gameReducer";
import { Mark } from "./Mark";

export function StatusBanner({ state }: { state: GameState }) {
  const { result, current } = state;
  const shown = result.status === "won" ? result.winner : result.status === "draw" ? null : current;
  const text =
    result.status === "won"
      ? `${result.winner} wins!`
      : result.status === "draw"
        ? "It's a draw!"
        : `${current}'s turn`;
  return (
    <p role="status" className="status">
      {shown && <Mark key={shown + result.status} player={shown} seed={11} draw className="status-mark" />}
      <span>{text}</span>
    </p>
  );
}
