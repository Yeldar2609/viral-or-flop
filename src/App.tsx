import { Trophy } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { InfoDialog } from "./components/InfoDialog";
import { RoundControls } from "./components/RoundControls";
import { Summary } from "./components/Summary";
import { VideoCard } from "./components/VideoCard";
import { videos } from "./data/videos";
import type { Choice } from "./game/engine";
import { createSession, nextRound, placePrediction } from "./game/engine";
import { enableSound, playResult } from "./sound";

function readBest(): number {
  try {
    const value = Number(localStorage.getItem("viral-or-flop-best"));
    return Number.isInteger(value) && value >= 0 && value <= 10 ? value : 0;
  } catch (error) {
    if (error instanceof DOMException) return 0;
    throw error;
  }
}
export function App() {
  const [game, setGame] = useState(() => createSession(videos));
  const [stake, setStake] = useState(50);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [pending, setPending] = useState(false);
  const [best, setBest] = useState(readBest);
  const [sound, setSound] = useState(false);
  const [dialog, setDialog] = useState<"rules" | "sources" | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const locked = useRef(false);
  const timer = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    },
    [],
  );
  const pair = game.pairs[game.roundIndex];
  const result = game.lastResult;
  const revealed = game.phase === "revealed";
  const predict = (choice: Choice) => {
    if (locked.current || game.phase !== "picking") return;
    locked.current = true;
    setSelected(choice);
    setPending(true);
    timer.current = window.setTimeout(
      () => {
        const updated = placePrediction(game, { choice, stake });
        setGame(updated);
        setPending(false);
        if (sound) playResult(updated.lastResult?.won ?? false);
        const nextBest = Math.max(best, updated.bestStreak);
        setBest(nextBest);
        try {
          localStorage.setItem("viral-or-flop-best", String(nextBest));
        } catch (error) {
          if (error instanceof DOMException) setStorageAvailable(false);
          else throw error;
        }
      },
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 650,
    );
  };
  const advance = () => {
    setGame(nextRound(game));
    setSelected(null);
    locked.current = false;
  };
  const restart = () => {
    setGame(createSession(videos));
    setSelected(null);
    setStake(50);
    locked.current = false;
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const toggleSound = () => {
    if (!sound) enableSound();
    setSound(!sound);
  };
  return (
    <div className="app-shell">
      <Header game={game} sound={sound} onToggleSound={toggleSound} onRules={() => setDialog("rules")} />
      <main className="main">
        {game.phase === "finished" ? (
          <Summary game={game} onRestart={restart} />
        ) : (
          <>
            <section className="hero">
              <span className="eyebrow">
                <span className="eyebrow-dot" /> TWO CLIPS. ONE BIG CALL.
              </span>
              <h1>
                Which one broke
                <br />
                the <span>internet?</span>
              </h1>
              <p className="hero-copy">
                The views are hidden. Your instincts aren’t.
                <br className="mobile-break" /> Back the bigger hit and prove you know the feed.
              </p>
            </section>
            <div className="round-meta">
              <span>
                <strong>ROUND {String(game.roundIndex + 1).padStart(2, "0")}</strong>
                <span className="muted"> / {game.pairs.length}</span>
              </span>
              <div className="round-progress" aria-hidden="true">
                {game.pairs.map((item, index) => (
                  <span
                    key={`${item.left.id}-${item.right.id}`}
                    className={`progress-dot${index === game.roundIndex ? " active" : index < game.roundIndex ? " completed" : ""}`}
                  />
                ))}
              </div>
              <span className="personal-best">
                <Trophy size={16} />
                {storageAvailable ? "PERSONAL BEST" : "SESSION BEST"} <strong>{best}</strong>
              </span>
            </div>
            {pair && (
              <div className="arena">
                <VideoCard
                  key={`${game.roundIndex}-left`}
                  video={pair.left}
                  side="left"
                  revealed={revealed}
                  pending={pending}
                  selected={selected === "left"}
                  winner={result?.winner === "left"}
                  stake={stake}
                  onPick={predict}
                />
                <div className="vs-badge" aria-hidden="true">
                  VS
                </div>
                <VideoCard
                  key={`${game.roundIndex}-right`}
                  video={pair.right}
                  side="right"
                  revealed={revealed}
                  pending={pending}
                  selected={selected === "right"}
                  winner={result?.winner === "right"}
                  stake={stake}
                  onPick={predict}
                />
              </div>
            )}
            <RoundControls
              game={game}
              stake={stake}
              pending={pending}
              onStake={setStake}
              onAdvance={advance}
            />
            <p className="trust-note">Real YouTube clips. Recorded view counts. Virtual coins only.</p>
            <section className="how-it-works" aria-label="How the game works">
              <div className="how-step">
                <span className="step-number">01</span>
                <div>
                  <h3>Get a feel.</h3>
                  <p>Preview two corners of the internet.</p>
                </div>
              </div>
              <div className="how-step">
                <span className="step-number">02</span>
                <div>
                  <h3>Make your call.</h3>
                  <p>Back the one you think went bigger.</p>
                </div>
              </div>
              <div className="how-step">
                <span className="step-number">03</span>
                <div>
                  <h3>Meet the numbers.</h3>
                  <p>Sometimes, a cat beats everything.</p>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <footer className="site-footer">
        <span>Trust your taste. Question the algorithm.</span>
        <div>
          <button className="text-link" type="button" onClick={() => setDialog("sources")}>
            The receipts
          </button>
          <span>·</span>
          <button className="text-link" type="button" onClick={() => setDialog("rules")}>
            How to play
          </button>
        </div>
        <small>A historical prediction game. Made for the plot.</small>
      </footer>
      {dialog && <InfoDialog mode={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}
