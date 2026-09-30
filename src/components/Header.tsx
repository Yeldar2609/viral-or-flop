import { Coins, Fire, Info, Lightning, SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import type { GameState } from "../game/engine";
import { WalletControl } from "./WalletControl";

type Props = {
  readonly game: GameState;
  readonly sound: boolean;
  readonly onToggleSound: () => void;
  readonly onRules: () => void;
};
export function Header({ game, sound, onToggleSound, onRules }: Props) {
  return (
    <header className="site-header">
      <div className="brand">
        <span className="brand-symbol">
          <Lightning weight="fill" size={25} />
        </span>
        <span className="brand-name">
          viral<span>or</span>flop<span className="brand-tag">THE INTERNET GAME</span>
        </span>
      </div>
      <div className="header-actions">
        <div className="stat-pill">
          <Coins size={20} weight="duotone" />
          <span>
            <span className="stat-label">YOUR COINS</span>
            <strong className="stat-value">{game.balance.toLocaleString()}</strong>
          </span>
        </div>
        <div className="stat-pill">
          <Fire size={20} weight="fill" />
          <span>
            <span className="stat-label">STREAK</span>
            <strong className="stat-value">
              {game.streak}
              <small> in a row</small>
            </strong>
          </span>
        </div>
        <button
          className="icon-button"
          onClick={onToggleSound}
          type="button"
          aria-label={sound ? "Mute game sounds" : "Enable game sounds"}
          aria-pressed={sound}
        >
          {sound ? <SpeakerHigh size={22} /> : <SpeakerSlash size={22} />}
        </button>
        <button className="icon-button" onClick={onRules} type="button" aria-label="How to play">
          <Info size={23} />
        </button>
        <WalletControl />
      </div>
    </header>
  );
}
