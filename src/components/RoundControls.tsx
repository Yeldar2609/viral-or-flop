import { ArrowRight, ChartBar, Coins, Lightning } from "@phosphor-icons/react";
import type { GameState } from "../game/engine";

type Props = {
  readonly game: GameState;
  readonly stake: number;
  readonly pending: boolean;
  readonly onStake: (amount: number) => void;
  readonly onAdvance: () => void;
};
export function RoundControls({ game, stake, pending, onStake, onAdvance }: Props) {
  const revealed = game.phase === "revealed";
  const result = game.lastResult;
  return revealed && result ? (
    <section className={`result-panel ${result.won ? "win" : "loss"}`} aria-live="polite">
      <span className="result-icon">
        {result.won ? <Lightning weight="fill" size={28} /> : <ChartBar weight="fill" size={28} />}
      </span>
      <div className="result-copy">
        <h2 className="result-title">
          {result.winner === "tie"
            ? "A dead heat. Coins returned."
            : result.won
              ? game.streak >= 3
                ? "You’re on fire. Called it."
                : "Called it. You know the feed."
              : "The internet had other plans."}
        </h2>
        <p className="result-description">
          {result.winner === "tie"
            ? "Both videos have the same recorded views."
            : result.won
              ? `+${result.stake} coins profit. ${game.streak > 1 ? `${game.streak} correct in a row.` : "Keep that instinct going."}`
              : `−${result.stake} coins. There’s always another surprise.`}
        </p>
      </div>
      <button className="button button-primary" type="button" onClick={onAdvance}>
        {game.roundIndex + 1 === game.pairs.length ? "See my results" : "Next round"}
        <ArrowRight weight="bold" />
      </button>
    </section>
  ) : (
    <section className="stake-panel">
      <div className="stake-label">
        <Coins size={22} />
        <div>
          <strong>How sure are you?</strong>
          <span className="muted">Choose your stake, then back a clip.</span>
        </div>
      </div>
      <fieldset
        className="stake-options"
        aria-label="Choose your virtual coin stake"
        style={{ border: 0, margin: 0, padding: 0 }}
      >
        {[10, 50, 100].map((amount) => (
          <button
            className={`stake-option${stake === amount ? " selected" : ""}`}
            key={amount}
            type="button"
            onClick={() => onStake(amount)}
            aria-pressed={stake === amount}
            disabled={pending || amount > game.balance}
          >
            {amount}
            <span>coins</span>
          </button>
        ))}
      </fieldset>
      <span className="stake-hint">
        <strong>2× return</strong> on a correct call
      </span>
    </section>
  );
}
