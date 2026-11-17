import type { Cell, Player } from "@/lib/game";
import { Mark } from "./Mark";

type Props = {
  index: number;
  value: Cell;
  /** Whose mark a hover preview shows. */
  next: Player;
  onPlay: (index: number) => void;
  disabled: boolean;
  highlight: boolean;
};

export function Square({ index, value, next, onPlay, disabled, highlight }: Props) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const label = `Square ${row},${col}, ${value ?? "empty"}`;
  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={disabled}
      onClick={() => !disabled && onPlay(index)}
      className="square"
      data-win={highlight}
    >
      {value ? (
        <Mark player={value} seed={index} draw />
      ) : disabled ? null : (
        <Mark player={next} seed={index} className="ghost" />
      )}
    </button>
  );
}
