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

// X: 0,1,2 (top row). O: 3,4.
const X_WINS = [0, 3, 1, 4, 2];
const DRAW = [0, 1, 2, 4, 3, 5, 7, 6, 8];

describe("<Game />", () => {
  it("renders 9 empty squares and X's turn", () => {
    render(<Game />);
    expect(squares()).toHaveLength(9);
    expect(status()).toHaveTextContent("X's turn");
  });

  it("draws an X and passes the turn to O", async () => {
    render(<Game />);
    await play([4]);
    expect(sq(2, 2)).toHaveAccessibleName("Square 2,2, X");
    expect(status()).toHaveTextContent("O's turn");
  });

  it("announces an X win", async () => {
    render(<Game />);
    await play(X_WINS);
    expect(status()).toHaveTextContent("X wins!");
  });

  it("disables every square after a win so the board cannot change", async () => {
    render(<Game />);
    const user = await play(X_WINS);
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
    expect(status()).toHaveTextContent("O's turn");
    expect(sq(2, 2)).toHaveAccessibleName("Square 2,2, X");
  });

  it("New Game after a win clears the board, keeps the score and gives O the first move", async () => {
    render(<Game />);
    const user = await play(X_WINS);
    await user.click(screen.getByRole("button", { name: "New Game" }));
    squares().forEach((s) => expect(s).toHaveTextContent(""));
    expect(counter("X wins")).toHaveTextContent("1");
    expect(status()).toHaveTextContent("O's turn");
  });

  it("New Game mid-game clears the board and keeps counters at zero", async () => {
    render(<Game />);
    const user = await play([0, 1]);
    await user.click(screen.getByRole("button", { name: "New Game" }));
    squares().forEach((s) => expect(s).toHaveTextContent(""));
    expect(counter("X wins")).toHaveTextContent("0");
    expect(counter("O wins")).toHaveTextContent("0");
  });

  it("plays a focused empty square with the Enter key", async () => {
    render(<Game />);
    const user = userEvent.setup();
    sq(1, 1).focus();
    await user.keyboard("{Enter}");
    expect(sq(1, 1)).toHaveAccessibleName("Square 1,1, X");
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
    await play(X_WINS);
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

describe("marks and win sweep", () => {
  it("contains no emoji anywhere in the interface", async () => {
    const { container } = render(<Game />);
    await play(DRAW);
    expect(container.textContent).not.toMatch(/\p{Extended_Pictographic}/u);
  });

  it("draws an X as several marker strokes inside the played square", async () => {
    render(<Game />);
    await play([4]);
    expect(sq(2, 2).querySelectorAll("svg path").length).toBeGreaterThanOrEqual(5);
  });

  it("draws an O as several marker loops", async () => {
    render(<Game />);
    await play([4, 0]);
    expect(sq(1, 1).querySelectorAll("svg path").length).toBeGreaterThanOrEqual(3);
  });

  it("strikes the winning line only when someone has won", async () => {
    const { container } = render(<Game />);
    expect(container.querySelector("[data-win-line]")).toBeNull();
    await play(X_WINS);
    expect(container.querySelector("[data-win-line]")).not.toBeNull();
  });

  it("does not strike a line on a draw", async () => {
    const { container } = render(<Game />);
    await play(DRAW);
    expect(container.querySelector("[data-win-line]")).toBeNull();
  });
});
