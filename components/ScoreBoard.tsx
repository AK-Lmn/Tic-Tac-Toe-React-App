import type { Scores } from "@/lib/gameReducer";

export function ScoreBoard({ scores }: { scores: Scores }) {
  const items: [string, number][] = [
    ["X wins", scores.X],
    ["Draws", scores.draws],
    ["O wins", scores.O],
  ];
  return (
    <dl className="scoreboard">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd key={value} className="count" data-n={value}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
