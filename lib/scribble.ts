import type { Player } from "./game";

/** One marker pass: an SVG path and its stroke width, in a 0-100 box. */
export type Stroke = { d: string; w: number };
type Pt = [number, number];

// Small seeded PRNG so a mark looks hand-drawn but renders identically on the
// server and the client (no hydration mismatch) and across reloads.
function rng(seed: number) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => n.toFixed(1);
const pt = ([x, y]: Pt) => `${f(x)} ${f(y)}`;
const between = (r: () => number, lo: number, hi: number) => lo + (hi - lo) * r();

/** A single slightly bowed, slightly overshooting pass from a to b. */
function pass(a: Pt, b: Pt, r: () => number, bow: number, overshoot: number): string {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const o1 = Math.min(between(r, 0, overshoot) * len, 6);
  const o2 = Math.min(between(r, 0, overshoot) * len, 6);
  const s: Pt = [a[0] - ux * o1, a[1] - uy * o1];
  const e: Pt = [b[0] + ux * o2, b[1] + uy * o2];
  const j1 = between(r, -bow, bow);
  const j2 = between(r, -bow, bow);
  const c1: Pt = [s[0] + (e[0] - s[0]) * 0.3 + px * j1, s[1] + (e[1] - s[1]) * 0.3 + py * j1];
  const c2: Pt = [s[0] + (e[0] - s[0]) * 0.7 + px * j2, s[1] + (e[1] - s[1]) * 0.7 + py * j2];
  return `M${pt(s)} C${pt(c1)} ${pt(c2)} ${pt(e)}`;
}

const jitter = (p: Pt, r: () => number, amt: number): Pt => [
  p[0] + between(r, -amt, amt),
  p[1] + between(r, -amt, amt),
];

function drawX(r: () => number): Stroke[] {
  const diagonals: [Pt, Pt][] = [
    [[22, 20], [78, 80]],
    [[78, 20], [22, 80]],
  ];
  const heavy: Stroke[] = [];
  const thin: Stroke[] = [];
  for (const [a, b] of diagonals) {
    heavy.push({ d: pass(jitter(a, r, 4), jitter(b, r, 4), r, 5, 0.07), w: between(r, 6, 8) });
    const extra = 4 + Math.floor(r() * 3);
    for (let i = 0; i < extra; i++) {
      thin.push({
        d: pass(jitter(a, r, 7), jitter(b, r, 7), r, 9, 0.1),
        w: between(r, 2.6, 4.2),
      });
    }
  }
  return [...heavy, ...thin];
}

function drawO(r: () => number): Stroke[] {
  const loops = 5 + Math.floor(r() * 2);
  const rx = between(r, 29, 33);
  const ry = between(r, 31, 35);
  const tilt = between(r, -0.25, 0.25);
  const out: Stroke[] = [];
  for (let l = 0; l < loops; l++) {
    const cx = 50 + between(r, -3.5, 3.5);
    const cy = 50 + between(r, -3.5, 3.5);
    const scale = 1 + between(r, -0.1, 0.1);
    const phase = between(r, 0, Math.PI * 2);
    const start = between(r, 0, Math.PI * 2);
    const sweep = Math.PI * 2 + between(r, 0.15, 0.5);
    const n = 24;
    const pts: Pt[] = [];
    for (let i = 0; i <= n; i++) {
      const th = start + (sweep * i) / n;
      const wob = 1 + 0.06 * Math.sin(2 * th + phase) + between(r, -0.02, 0.02);
      const x = Math.cos(th) * rx * scale * wob;
      const y = Math.sin(th) * ry * scale * wob;
      pts.push([
        cx + x * Math.cos(tilt) - y * Math.sin(tilt),
        cy + x * Math.sin(tilt) + y * Math.cos(tilt),
      ]);
    }
    let d = `M${pt(pts[0])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mid: Pt = [(pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2];
      d += ` Q${pt(pts[i])} ${pt(mid)}`;
    }
    d += ` L${pt(pts[pts.length - 1])}`;
    out.push({ d, w: l === 0 ? between(r, 5, 6.5) : between(r, 2.5, 3.5) });
  }
  return out;
}

/** Marker strokes for a player's mark. Same kind and seed always give the same drawing. */
export function scribble(kind: Player, seed: number): Stroke[] {
  const r = rng(seed * 2 + (kind === "X" ? 1 : 2));
  return kind === "X" ? drawX(r) : drawO(r);
}

/** A struck-through line (the winning sweep) as several marker passes, in any coordinate box. */
export function scribbleLine(from: Pt, to: Pt, seed: number): Stroke[] {
  const r = rng(seed + 977);
  const passes = 3;
  const out: Stroke[] = [];
  for (let i = 0; i < passes; i++) {
    const a = jitter(from, r, i === 0 ? 0.5 : 2.5);
    const b = jitter(to, r, i === 0 ? 0.5 : 2.5);
    out.push({ d: pass(a, b, r, i === 0 ? 2 : 4, 0.03), w: i === 0 ? 6 : between(r, 1.6, 2.4) });
  }
  return out;
}
