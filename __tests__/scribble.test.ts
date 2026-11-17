import { describe, expect, it } from "vitest";
import { scribble, scribbleLine } from "@/lib/scribble";

const nums = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe("scribble", () => {
  it("is deterministic for the same kind and seed", () => {
    expect(scribble("X", 3)).toEqual(scribble("X", 3));
    expect(scribble("O", 7)).toEqual(scribble("O", 7));
  });

  it("differs between seeds", () => {
    expect(scribble("X", 1)).not.toEqual(scribble("X", 2));
    expect(scribble("O", 1)).not.toEqual(scribble("O", 2));
  });

  it("builds an X from at least ten overlapping strokes and an O from at least five loops, for every seed", () => {
    for (let seed = 0; seed < 12; seed++) {
      expect(scribble("X", seed).length).toBeGreaterThanOrEqual(10);
      expect(scribble("O", seed).length).toBeGreaterThanOrEqual(5);
    }
  });

  it("keeps thin passes bold enough to read as marker, not pen", () => {
    for (const kind of ["X", "O"] as const) {
      const strokes = scribble(kind, 3);
      expect(Math.min(...strokes.map((s) => s.w))).toBeGreaterThanOrEqual(2.5);
      expect(strokes[0].w).toBeGreaterThanOrEqual(5);
    }
  });

  it("keeps every coordinate finite and inside the 0-100 box with a small margin", () => {
    for (const kind of ["X", "O"] as const) {
      for (let seed = 0; seed < 9; seed++) {
        for (const { d } of scribble(kind, seed)) {
          expect(d.startsWith("M")).toBe(true);
          for (const n of nums(d)) {
            expect(Number.isFinite(n)).toBe(true);
            expect(n).toBeGreaterThan(-6);
            expect(n).toBeLessThan(106);
          }
        }
      }
    }
  });

  it("draws the heaviest stroke first", () => {
    const strokes = scribble("X", 4);
    expect(strokes[0].w).toBe(Math.max(...strokes.map((s) => s.w)));
  });
});

describe("scribbleLine", () => {
  it("starts near the given point and returns at least two passes", () => {
    const strokes = scribbleLine([10, 20], [90, 20], 5);
    expect(strokes.length).toBeGreaterThanOrEqual(2);
    const [x, y] = nums(strokes[0].d);
    expect(Math.abs(x - 10)).toBeLessThan(8);
    expect(Math.abs(y - 20)).toBeLessThan(8);
  });
});
