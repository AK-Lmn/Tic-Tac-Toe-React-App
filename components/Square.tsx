import type { Cell } from "@/lib/game";
import { MARKS } from "@/lib/marks";

type Props = {
  index: number;
  value: Cell;
  onPlay: (index: number) => void;
  disabled: boolean;
  highlight: boolean;
};

export function Square({ index, value, onPlay, disabled, highlight }: Props) {
  const row = Math.floor(index / 3) + 1;
  const col = (index % 3) + 1;
  const label = `Square ${row},${col}, ${value ? MARKS[value].name : "empty"}`;
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={() => onPlay(index)}
      className="square"
      data-highlight={highlight}
    >
      <span aria-hidden="true">{value ? MARKS[value].glyph : ""}</span>
    </button>
  );
}
