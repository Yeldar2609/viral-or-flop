import { ArrowClockwise, ShareNetwork, Trophy } from "@phosphor-icons/react";
import { useState } from "react";
import type { GameState } from "../game/engine";

type Props = { readonly game: GameState; readonly onRestart: () => void };
export function Summary({ game, onRestart }: Props) {
  const [feedback, setFeedback] = useState("");
  const rank =
    game.correct >= 8
      ? "You are the algorithm."
      : game.correct >= 5
        ? "Your feed taught you well."
        : "The internet surprised you.";
  const share = async () => {
    const text =
      "I called " +
      game.correct +
      "/" +
      game.total +
      " on Viral or Flop. Best streak: " +
      game.bestStreak +
      ". Think you know the internet? " +
      location.href;
    try {
      await navigator.clipboard.writeText(text);
      setFeedback("Score copied. Send it to someone who thinks they know better.");
    } catch (error) {
      if (error instanceof Error) setFeedback(text);
      else throw error;
    }
  };
  return (
    <section className="game-summary">
      <span className="eyebrow">
        <Trophy weight="fill" /> THAT’S A WRAP
      </span>
      <h1>{rank}</h1>
      <div className="summary-score">
        {game.correct}
        <span>/{game.total}</span>
      </div>
      <p className="hero-copy">Correct calls. No algorithm could do the guessing for you.</p>
      <div className="summary-grid">
        <div className="summary-stat">
          <span>Final balance</span>
          <strong>{game.balance.toLocaleString()} coins</strong>
        </div>
        <div className="summary-stat">
          <span>Best streak</span>
          <strong>{game.bestStreak} in a row</strong>
        </div>
        <div className="summary-stat">
          <span>Net result</span>
          <strong>
            {game.balance >= 1000 ? "+" : ""}
            {game.balance - 1000} coins
          </strong>
        </div>
      </div>
      <div className="header-actions">
        <button className="button button-primary" onClick={onRestart} type="button">
          <ArrowClockwise /> Run it back
        </button>
        <button className="button button-secondary" onClick={() => void share()} type="button">
          <ShareNetwork /> Challenge a friend
        </button>
      </div>
      <p className="share-feedback" role="status">
        {feedback}
      </p>
    </section>
  );
}
