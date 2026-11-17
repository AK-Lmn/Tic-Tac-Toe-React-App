import type { CSSProperties } from "react";
import type { Line } from "@/lib/game";
import type { GameState } from "@/lib/gameReducer";
import { scribbleLine } from "@/lib/scribble";
import { Square } from "./Square";
import { Strokes } from "./Mark";

type Props = { state: GameState; onPlay: (index: number) => void };

const HASH = ["M100 0V300", "M200 0V300", "M0 100H300", "M0 200H300"];

/** Ends of the winning strike in the board's 300-unit box, reaching past the outer marks. */
function sweepEnds(line: Line): [[number, number], [number, number]] {
  const at = (i: number): [number, number] => [(i % 3) * 100 + 50, Math.floor(i / 3) * 100 + 50];
  const [ax, ay] = at(line[0]);
  const [bx, by] = at(line[2]);
  const len = Math.hypot(bx - ax, by - ay);
  const ux = (bx - ax) / len;
  const uy = (by - ay) / len;
  const pad = 30;
  return [
    [ax - ux * pad, ay - uy * pad],
    [bx + ux * pad, by + uy * pad],
  ];
}

export function Board({ state, onPlay }: Props) {
  const { result } = state;
  const finished = result.status !== "playing";
  const winLine: readonly number[] = result.status === "won" ? result.line : [];
  const sweep =
    result.status === "won"
      ? (() => {
          const [from, to] = sweepEnds(result.line);
          return scribbleLine(from, to, result.line[0] * 9 + result.line[2]);
        })()
      : null;

  return (
    <div
      role="group"
      aria-label="Game board"
      className="board"
      data-over={result.status === "won" ? "win" : result.status === "draw" ? "draw" : undefined}
    >
      <svg viewBox="0 0 300 300" aria-hidden="true" focusable="false" className="hash">
        {HASH.map((d, i) => (
          <path key={d} d={d} pathLength={1} style={{ "--i": i } as CSSProperties} />
        ))}
      </svg>
      {state.board.map((value, i) => (
        <Square
          key={i}
          index={i}
          value={value}
          next={state.current}
          onPlay={onPlay}
          disabled={finished || value !== null}
          highlight={winLine.includes(i)}
        />
      ))}
      {sweep && (
        <svg
          viewBox="0 0 300 300"
          aria-hidden="true"
          focusable="false"
          className="sweep"
          data-win-line
        >
          <Strokes strokes={sweep} />
        </svg>
      )}
    </div>
  );
}
