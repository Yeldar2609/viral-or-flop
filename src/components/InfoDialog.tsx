import { ArrowUpRight, X } from "@phosphor-icons/react";
import { useEffect, useRef } from "react";
import { videos } from "../data/videos";

type Props = { readonly mode: "rules" | "sources"; readonly onClose: () => void };
export function InfoDialog({ mode, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog ref={ref} className="dialog" onCancel={onClose} onClose={onClose} aria-labelledby="dialog-title">
      <div className="dialog-header">
        <h2 id="dialog-title">
          {mode === "rules" ? "A little instinct. A lot of internet." : "Real clips. Real receipts."}
        </h2>
        <button
          className="icon-button dialog-close"
          onClick={onClose}
          aria-label="Close dialog"
          type="button"
        >
          <X size={22} />
        </button>
      </div>
      <div className="dialog-body">
        {mode === "rules" ? (
          <>
            <p>
              You start with <strong>1,000 virtual coins</strong>. Each round shows two real YouTube videos.
              Preview either one, then predict which has more recorded views.
            </p>
            <ol>
              <li>Choose your stake: 10, 50, or 100 coins.</li>
              <li>Back clip A or clip B. Your choice locks immediately.</li>
              <li>
                A correct call returns twice your stake: a 50-coin bet earns 50 coins profit. A wrong call
                loses your stake. Ties refund it.
              </li>
              <li>Play ten rounds. Build a streak, then share your score.</li>
            </ol>
            <p>
              This is a <strong>historical prediction game</strong>. Counts are recorded snapshots, not live
              totals. “Flop” means the lower-viewed video in that pair, even if it has millions of views.
            </p>
            <p>
              No deposits, cash prizes, or withdrawals. Coins have no monetary value. Your personal best is
              stored only in this browser when storage is available.
            </p>
            <p>
              Videos play through YouTube. If a player is blocked, you can still judge the thumbnail; original
              video links appear with the results. Sound is optional.
            </p>
          </>
        ) : (
          <>
            <p>
              View counts were read from the original YouTube pages on the dates below. Creators own their
              videos; we use official embeds. Counts can change after capture.
            </p>
            <div className="sources-list">
              {videos.map((video) => (
                <div className="source-item" key={video.id}>
                  <a href={video.sourceUrl} target="_blank" rel="noreferrer">
                    {video.title} <ArrowUpRight size={16} />
                  </a>
                  <span>
                    {video.creator} · {video.views.toLocaleString("en-US")} views
                  </span>
                  <small>Recorded {video.capturedAt}</small>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
