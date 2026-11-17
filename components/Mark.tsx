import type { CSSProperties } from "react";
import type { Player } from "@/lib/game";
import { scribble, type Stroke } from "@/lib/scribble";

type Props = {
  player: Player;
  seed: number;
  /** Play the draw-on animation when the mark mounts. */
  draw?: boolean;
  className?: string;
};

export function Strokes({ strokes }: { strokes: Stroke[] }) {
  return (
    <>
      {strokes.map((s, i) => (
        <path
          key={i}
          d={s.d}
          pathLength={1}
          strokeWidth={s.w}
          style={{ "--i": i } as CSSProperties}
        />
      ))}
    </>
  );
}

/** A handwritten marker X or O. Purely decorative: the square or status text names it. */
export function Mark({ player, seed, draw = false, className = "" }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
      className={`mark ${className}`.trim()}
      data-draw={draw || undefined}
      data-player={player}
    >
      <Strokes strokes={scribble(player, seed)} />
    </svg>
  );
}
