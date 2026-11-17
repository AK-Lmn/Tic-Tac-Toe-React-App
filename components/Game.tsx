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
      <header className="bar">
        <h1>Tic-Tac-Toe</h1>
        <StatusBanner state={state} />
      </header>
      <div className="sheet">
        <Board state={state} onPlay={(index) => dispatch({ type: "play", index })} />
      </div>
      <footer className="dock">
        <ScoreBoard scores={state.scores} />
        <button type="button" className="new-game" onClick={() => dispatch({ type: "newGame" })}>
          New Game
        </button>
      </footer>
    </main>
  );
}
