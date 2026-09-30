# Viral or Flop

A ten-round game about spotting the more-viewed video. Preview two real YouTube clips, stake virtual coins, lock a pick, and reveal the recorded view counts.

## Run

```sh
bun install
bun run dev
bun test
bun run build
bun run preview
```

## Game

- Start with 1,000 virtual coins. Stakes are 10, 50 or 100.
- A correct prediction returns twice the stake (one stake of net profit); a wrong prediction loses the stake. Ties refund it.
- Ten unique pairs per session, randomized across 14 real videos.
- Personal best streak persists locally when browser storage is available.
- Optional sound, mobile layout, source receipts, score copying, and replay.

This is a historical prediction game, not a live financial market. Coins have no monetary value. No authentication, payments, real-money betting, fabricated crowd statistics, or shared leaderboard.

## Video provenance

See [docs/VIDEO_SOURCES.md](docs/VIDEO_SOURCES.md). View-count snapshots are from official YouTube page metadata on 2026-09-30. All selected pages reported embedding permitted at collection. YouTube hosts the video streams; local thumbnails make the game load reliably. Creator restrictions, regional restrictions, consent screens, and network policies can still affect playback. Each player has an original-video fallback link.

## Deployment

Production build is static `dist/`, with relative asset paths and `.nojekyll`. Source is on `viral-or-flop/build`; GitHub Pages artifacts are on `gh-pages`. Never push to main for this task.

## Validation

16 domain tests cover payouts, ties, invalid stakes, duplicate settlement, deterministic pair selection and session completion. Browser checks cover an entire ten-round session, both result paths, rule/source dialogs, replay, score sharing, reduced motion, and responsive layouts. Development-only instrumentation dependencies are excluded from production.

## Solana Devnet wallet
The header supports installed Solana Wallet Standard wallets, shows their public account address and reads SOL balances from the Solana Devnet RPC. Users can refresh, open the Devnet explorer/faucet, and disconnect. Mobile users should open the site in their wallet browser. Connection never signs or sends transactions; game coins remain separate.

References: https://github.com/anza-xyz/wallet-standard and https://solana.com/docs/rpc/http/getbalance .
