import type { Player } from "./game";

export const MARKS: Record<Player, { name: string; glyph: string }> = {
  X: { name: "Cat", glyph: "🐱" },
  O: { name: "Dog", glyph: "🐶" },
};
