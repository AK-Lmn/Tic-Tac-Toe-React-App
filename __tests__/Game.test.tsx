import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Game } from "@/components/Game";

const sq = (r: number, c: number) =>
  screen.getByRole("button", { name: new RegExp(`^Square ${r},${c},`) });
const squares = () => screen.getAllByRole("button", { name: /^Square / });
const status = () => screen.getByRole("status");
const counter = (label: string) =>
  screen.getByText(label).nextElementSibling as HTMLElement;

async function play(moves: number[]) {
  const user = userEvent.setup();
  for (const i of moves) {
    await user.click(sq(Math.floor(i / 3) + 1, (i % 3) + 1));
  }
  return user;
}

// Cat: 0,1,2 (top row). Dog: 3,4.
const CAT_WINS = [0, 3, 1, 4, 2];
const DRAW = [0, 1, 2, 4, 3, 5, 7, 6, 8];

describe("<Game />", () => {
  it("renders 9 empty squares and Cat's turn", () => {
    render(<Game />);
    expect(squares()).toHaveLength(9);
    expect(status()).toHaveTextContent("Cat's turn");
  });

  it("places the cat glyph and passes the turn to Dog", async () => {
    render(<Game />);
    await play([4]);
    expect(sq(2, 2)).toHaveTextContent("🐱");
    expect(status()).toHaveTextContent("Dog's turn");
  });

  it("announces a cat win", async () => {
    render(<Game />);
    await play(CAT_WINS);
    expect(status()).toHaveTextContent("Cat wins!");
  });

  it("disables every square after a win so the board cannot change", async () => {
    render(<Game />);
    const user = await play(CAT_WINS);
    squares().forEach((s) => expect(s).toHaveAttribute("aria-disabled", "true"));
    await user.click(sq(3, 3));
    expect(sq(3, 3)).toHaveTextContent("");
  });

  it("announces a draw", async () => {
    render(<Game />);
    await play(DRAW);
    expect(status()).toHaveTextContent("It's a draw!");
    expect(counter("Draws")).toHaveTextContent("1");
  });

  it("ignores a click on an occupied square", async () => {
    render(<Game />);
    const user = await play([4]);
    await user.click(sq(2, 2));
    expect(status()).toHaveTextContent("Dog's turn");
    expect(sq(2, 2)).toHaveTextContent("🐱");
  });

  it("New Game after a win clears the board, keeps the score and gives Dog the first move", async () => {
    render(<Game />);
    const user = await play(CAT_WINS);
    await user.click(screen.getByRole("button", { name: "New Game" }));
    squares().forEach((s) => expect(s).toHaveTextContent(""));
    expect(counter("Cat wins")).toHaveTextContent("1");
    expect(status()).toHaveTextContent("Dog's turn");
  });

  it("New Game mid-game clears the board and keeps counters at zero", async () => {
    render(<Game />);
    const user = await play([0, 1]);
    await user.click(screen.getByRole("button", { name: "New Game" }));
    squares().forEach((s) => expect(s).toHaveTextContent(""));
    expect(counter("Cat wins")).toHaveTextContent("0");
    expect(counter("Dog wins")).toHaveTextContent("0");
  });

  it("plays a focused empty square with the Enter key", async () => {
    render(<Game />);
    const user = userEvent.setup();
    sq(1, 1).focus();
    await user.keyboard("{Enter}");
    expect(sq(1, 1)).toHaveTextContent("🐱");
  });

  it("labels squares for screen readers", () => {
    render(<Game />);
    expect(sq(1, 1)).toHaveAccessibleName("Square 1,1, empty");
    expect(within(screen.getByRole("group", { name: /board/i })).getAllByRole("button")).toHaveLength(9);
  });
});

describe("win highlight", () => {
  it("marks exactly the three winning squares with data-win", async () => {
    render(<Game />);
    await play(CAT_WINS);
    const won = squares().filter((s) => s.getAttribute("data-win") === "true");
    expect(won).toEqual([sq(1, 1), sq(1, 2), sq(1, 3)]);
  });
});

describe("keyboard focus", () => {
  it("keeps focus on a square after it is played with Enter", async () => {
    render(<Game />);
    const user = userEvent.setup();
    sq(1, 1).focus();
    await user.keyboard("{Enter}");
    expect(sq(1, 1)).toHaveFocus();
  });
});
