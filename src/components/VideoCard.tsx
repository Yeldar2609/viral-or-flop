import { ArrowUpRight, Check, Eye, Play, YoutubeLogo } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { Video } from "../data/videos";
import type { Choice } from "../game/engine";

type Props = {
  readonly video: Video;
  readonly side: Choice;
  readonly revealed: boolean;
  readonly pending: boolean;
  readonly selected: boolean;
  readonly winner: boolean;
  readonly stake: number;
  readonly onPick: (side: Choice) => void;
};
function Count({ value }: { readonly value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const started = performance.now();
    let frame = 0;
    const tick = (time: number) => {
      const progress = Math.min((time - started) / 1200, 1);
      setDisplay(Math.round(value * (1 - (1 - progress) ** 3)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return (
    <span role="img" aria-label={`${value.toLocaleString("en-US")} views`}>
      {display.toLocaleString("en-US")}
    </span>
  );
}
export function VideoCard({ video, side, revealed, pending, selected, winner, stake, onPick }: Props) {
  const [playing, setPlaying] = useState(false);
  const letter = side === "left" ? "A" : "B";
  const embed = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&mute=1&rel=0&playsinline=1&start=${video.start}`;
  return (
    <article
      className={`video-card${selected ? " is-selected" : ""}${revealed ? (winner ? " is-winner" : " is-loser") : ""}`}
    >
      <div className="video-topline">
        <span className="clip-letter">{letter}</span>
        <span className="clip-category">{video.category}</span>
        <span className="muted">
          {revealed ? (winner ? "THE VIRAL ONE" : "THE UNDERDOG") : "VIEWS HIDDEN"}
        </span>
      </div>
      <div className="video-media">
        {playing ? (
          <div className="media-frame">
            {video.localClip ? (
              <video
                src={`${import.meta.env.BASE_URL}clips/${video.localClip}`}
                poster={`${import.meta.env.BASE_URL}thumbnails/${video.youtubeId}.jpg`}
                controls
                autoPlay
                playsInline
                loop
                preload="metadata"
                aria-label={`Play clip ${letter}`}
              >
                <track
                  kind="captions"
                  src={`${import.meta.env.BASE_URL}clips/sneezing-panda.vtt`}
                  srcLang="en"
                  label="English"
                />
              </video>
            ) : (
              <iframe
                src={embed}
                title={`Play clip ${letter}: ${video.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
        ) : (
          <button
            className="video-poster"
            onClick={() => setPlaying(true)}
            type="button"
            aria-label={`Preview clip ${letter}`}
          >
            <img
              src={`${import.meta.env.BASE_URL}thumbnails/${video.youtubeId}.jpg`}
              alt={`Preview of ${video.title}`}
              width="480"
              height="360"
              fetchPriority="high"
            />
            <span className="play-button">
              <Play weight="fill" size={24} />
              <span>Watch the clip</span>
            </span>
          </button>
        )}
        {pending && selected && (
          <div className="loading-overlay">
            <span className="loading-word">PREDICTION LOCKED.</span>
          </div>
        )}
      </div>
      <div className="video-bottom">
        {playing && (
          <a className="text-link player-fallback" href={video.sourceUrl} target="_blank" rel="noreferrer">
            Player not loading? Watch on YouTube <ArrowUpRight size={14} />
          </a>
        )}
        {revealed ? (
          <>
            <div className="video-count">
              <span className="count-label">
                <Eye size={16} /> RECORDED VIEWS
              </span>
              <strong className="count-value">
                <Count value={video.views} />
              </strong>
            </div>
            <h2 className="clip-title">{video.title}</h2>
            <p className="clip-creator">
              {video.creator} <span>· {video.capturedAt}</span>
            </p>
            <a className="text-link" href={video.sourceUrl} target="_blank" rel="noreferrer">
              <YoutubeLogo size={18} /> Original video <ArrowUpRight size={15} />
            </a>
          </>
        ) : (
          <>
            <h2 className="clip-title">Could this be the viral one?</h2>
            <p className="clip-creator">Watch it. Trust your gut. Make your call.</p>
            <button
              className={`pick-button${selected ? " chosen" : ""}`}
              type="button"
              disabled={pending}
              onClick={() => onPick(side)}
            >
              {selected ? (
                <>
                  <Check weight="bold" /> Locked on {letter}
                </>
              ) : (
                <>
                  Back clip {letter}
                  <span>
                    {stake} coins <ArrowUpRight weight="bold" />
                  </span>
                </>
              )}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
