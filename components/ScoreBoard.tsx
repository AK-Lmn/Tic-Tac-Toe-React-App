import type { Scores } from "@/lib/gameReducer";
import { MARKS } from "@/lib/marks";

export function ScoreBoard({ scores }: { scores: Scores }) {
  const items: [string, number][] = [
    [`${MARKS.X.name} wins`, scores.X],
    [`${MARKS.O.name} wins`, scores.O],
    ["Draws", scores.draws],
  ];
  return (
    <dl className="scoreboard">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
