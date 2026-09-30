# Viral or Flop

## 0. Research log
Reference: minimalist execution + Linear light workspace primitives, previously read in this session. Recombined into a playful editorial game, not a finance dashboard. User prioritizes fastest complete hosted build. Extended concept generation and external screen research deferred for this timebox. Motion reference: beui.dev number and action-swap patterns; count reveals describe real state, no fabricated statistics.

## 1. Intent
An instantly understandable two-clip game: preview, stake virtual coins, choose the video with more recorded views, reveal, repeat. Main persona is a hackathon judge on desktop; secondary is a friend opening the link on a phone. Historical replay, not live market data. One memorable visual: big view counts revealing the surprising winner.

## 2. Color
Canvas #f7f5ef; ink #161713; muted #686a60; surface #ffffff; border #deded5. Lime #d9f84a primary, purple #7255dc secondary, purple-soft #eeebfa. Success #246444 with #e9f2e9; loss #b0443b with #fbefeb. All tokens in :root. Semantic labels accompany color.

## 3. Typography
Space Grotesk variable packaged locally, UI system sans fallback. Display56 desktop/36 mobile, body16, caption13, label11 uppercase tracking. Numeric values tabular, display36-64. Weight400,500,600,700. Headings tight line-height1.05 and tracking-.045em. Body1.5.

## 4. Layout
Main max1160px centered. Header76px. Spacing4,8,12,16,20,24,32,40,48,64. Two equal minmax(0,1fr) video cards desktop, one mobile at640. Video media16/9. Card radius16, buttons10, badgesfull. Document scroll. All flex/grid children min-width0. At375px readable without horizontal scrolling.

## 5. Primitives
VideoCard: native preview button loads official YouTube embed, separate prediction button, hidden counts until reveal, winning/losing/selected states, source metadata after reveal. Button: lime primary, ink secondary, hover/active/focus/disabled. StatPill: wallet/streak/best. Stake selector: native aria-pressed buttons10,50,100. Dialog: native modal for rules/sources, Escape and focus return. Progress dots: ten rounds with textual round count. Summary: score, best streak, finalcoins, share/restart. Error message rolealert. All touch controls44pxminimum.

## 6. Motion
150ms press/hover transform and opacity. Reveal count1200ms ease-out with number updates; reduced-motion immediate result. Result entrance220ms opacity/translateY. Confetti only on correct prediction, CSS transform/opacity and reduced-motionoff. No perpetual decorative animation. Sound opt-in via native WebAudio, no background audio.

## 7. Depth
Fine borders, dark media frame, card shadow0 4px 16px rgba(22,23,19,.04). Strong lime CTA. No gradients. Reusable design tokens not inline arbitrary palette.

## 8. Accessibility and scope
Visible3px focus outline, semantic buttons and headings, exact displayed counts, polite result announcement, no motion dependence. Credits and links to video source after reveal, capture dates surfaced. Third-party embeds may be blocked by network or creator; thumbnails and original source links remain available. Real source counts only; no fake crowd odds, users, leaderboards or performance claims. Coins have no monetary value; historical replay game. Browser-only best streak stored, no user messages/accounts.

## Wallet connection
Solana Devnet wallet entry uses the existing ink button, Wallet icon and explicit network label. Native dialog reuses modal spacing, focus and Escape handling. States: no installed wallet with official install links; wallet choice; pending approval; connected address and Devnet SOL balance; recoverable connection/RPC errors; disconnected. Balance is separate from virtual game coins. No signing or transfers. On mobile the header wraps controls and keeps every action at least44px. Wallet icons come from registered Wallet Standard providers.
