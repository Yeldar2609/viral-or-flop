import { ArrowClockwise, ArrowSquareOut, CheckCircle, Wallet, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useSolanaWallet } from "../wallet/useSolanaWallet";

type WalletState = ReturnType<typeof useSolanaWallet>;
function WalletDialog({ state, onClose }: { readonly state: WalletState; readonly onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog wallet-dialog"
      onCancel={onClose}
      onClose={onClose}
      aria-labelledby="wallet-title"
    >
      <div className="dialog-header">
        <div>
          <span className="wallet-network">Solana Devnet</span>
          <h2 id="wallet-title">{state.address ? "Your wallet" : "Connect your wallet"}</h2>
        </div>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close wallet">
          <X size={22} />
        </button>
      </div>
      <div className="dialog-body wallet-body">
        {state.address ? (
          <>
            <p className="wallet-connected">
              <CheckCircle weight="fill" size={20} /> Connected to {state.wallet?.name}
            </p>
            <code className="wallet-address">{state.address}</code>
            <div className="wallet-balance">
              <div>
                <span className="muted">Devnet balance</span>
                <strong aria-live="polite">
                  {state.balanceLoading
                    ? "Loading…"
                    : state.balance === null
                      ? "Unavailable"
                      : state.balance.toLocaleString("en-US", { maximumFractionDigits: 4 }) + " SOL"}
                </strong>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label="Refresh Devnet balance"
                onClick={state.refreshBalance}
                disabled={state.balanceLoading}
              >
                <ArrowClockwise size={21} />
              </button>
            </div>
            {state.balanceError && (
              <p className="wallet-error" role="alert">
                {state.balanceError}
              </p>
            )}
            <div className="wallet-links">
              <a
                className="text-link"
                href={
                  "https://explorer.solana.com/address/" +
                  encodeURIComponent(state.address) +
                  "?cluster=devnet"
                }
                target="_blank"
                rel="noreferrer"
              >
                View on Explorer <ArrowSquareOut size={16} />
              </a>
              <a className="text-link" href="https://faucet.solana.com/" target="_blank" rel="noreferrer">
                Get test SOL <ArrowSquareOut size={16} />
              </a>
            </div>
            <p className="wallet-note">Game coins are separate from your wallet. Playing never spends SOL.</p>
            <button
              className="button button-dark wallet-disconnect"
              type="button"
              onClick={() => {
                void state.disconnect();
              }}
            >
              Disconnect wallet
            </button>
          </>
        ) : (
          <>
            <p>
              Choose a Solana wallet to view your Devnet balance. You can keep playing without connecting.
            </p>
            {state.wallets.length > 0 ? (
              <div className="wallet-list">
                {state.wallets.map((wallet) => (
                  <button
                    className="wallet-option"
                    key={wallet.name}
                    type="button"
                    disabled={state.connecting}
                    onClick={() => {
                      void state.connect(wallet);
                    }}
                  >
                    <img src={wallet.icon} alt="" width="32" height="32" />
                    <strong>{wallet.name}</strong>
                    <span>{state.connecting ? "Approving…" : "Connect"}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="wallet-empty">
                <strong>No Solana wallet detected</strong>
                <p>Install a wallet, then reload. On a phone, open this site inside your wallet’s browser.</p>
                <div className="wallet-links">
                  <a
                    className="text-link"
                    href="https://phantom.com/download"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Phantom <ArrowSquareOut size={16} />
                  </a>
                  <a
                    className="text-link"
                    href="https://www.solflare.com/download/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get Solflare <ArrowSquareOut size={16} />
                  </a>
                </div>
              </div>
            )}
            {state.connecting && <p role="status">Approve the connection in your wallet.</p>}
            <p className="wallet-note">Connection only. No payment or signing request.</p>
          </>
        )}
        {state.error && (
          <p className="wallet-error" role="alert">
            {state.error}
          </p>
        )}
      </div>
    </dialog>
  );
}
export function WalletControl() {
  const state = useSolanaWallet();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="wallet-launch"
        type="button"
        onClick={() => setOpen(true)}
        aria-label={state.address ? "Open connected wallet" : "Connect Solana wallet"}
      >
        <Wallet size={20} weight="bold" />
        <span>
          <strong>
            {state.address ? state.address.slice(0, 4) + "…" + state.address.slice(-4) : "Connect wallet"}
          </strong>
          <small>Solana Devnet</small>
        </span>
      </button>
      {open && <WalletDialog state={state} onClose={() => setOpen(false)} />}
    </>
  );
}
