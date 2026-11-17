"use client";

import { useReducer } from "react";
import { gameReducer, initialState } from "@/lib/gameReducer";
import { Board } from "./Board";
import { ScoreBoard } from "./ScoreBoard";
import { StatusBanner } from "./StatusBanner";

export function Game() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <main className="game">
      <h1>Cats vs Dogs</h1>
      <StatusBanner state={state} />
      <Board
        state={state}
        onPlay={(index) => dispatch({ type: "play", index })}
      />
      <button
        type="button"
        className="new-game"
        onClick={() => dispatch({ type: "newGame" })}
      >
        New Game
      </button>
      <ScoreBoard scores={state.scores} />
    </main>
  );
}
