import type { Video } from "../data/videos";

export type Choice = "left" | "right";
export type VideoPair = { readonly left: Video; readonly right: Video };
export type RoundResult = {
  readonly choice: Choice;
  readonly winner: Choice | "tie";
  readonly stake: number;
  readonly won: boolean;
  readonly payout: number;
};
export type GameState = {
  readonly pairs: readonly VideoPair[];
  readonly roundIndex: number;
  readonly balance: number;
  readonly streak: number;
  readonly bestStreak: number;
  readonly correct: number;
  readonly total: number;
  readonly phase: "picking" | "revealed" | "finished";
  readonly lastResult: RoundResult | null;
};
export class GameError extends Error {
  override readonly name = "GameError";
  constructor(
    readonly code: "insufficient_videos" | "invalid_stake" | "insufficient_balance" | "invalid_phase",
  ) {
    super(code);
  }
}
export function createSession(videos: readonly Video[], seed = Date.now()): GameState {
  const unique = [...new Map(videos.map((video) => [video.youtubeId, video])).values()];
  if (unique.length < 5) throw new GameError("insufficient_videos");
  let randomState = seed >>> 0;
  const random = (): number => {
    randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
    return randomState / 4294967296;
  };
  const available: VideoPair[] = [];
  for (const [index, first] of unique.entries()) {
    for (const second of unique.slice(index + 1)) {
      available.push(random() < 0.5 ? { left: first, right: second } : { left: second, right: first });
    }
  }
  const pairs: VideoPair[] = [];
  while (pairs.length < 10) {
    const [pair] = available.splice(Math.floor(random() * available.length), 1);
    if (!pair) throw new GameError("insufficient_videos");
    pairs.push(pair);
  }
  return {
    pairs,
    roundIndex: 0,
    balance: 1000,
    streak: 0,
    bestStreak: 0,
    correct: 0,
    total: 0,
    phase: "picking",
    lastResult: null,
  };
}
export function placePrediction(
  state: GameState,
  prediction: { readonly choice: Choice; readonly stake: number },
): GameState {
  if (state.phase !== "picking") throw new GameError("invalid_phase");
  const { choice, stake } = prediction;
  if (![10, 50, 100].includes(stake)) throw new GameError("invalid_stake");
  if (stake > state.balance) throw new GameError("insufficient_balance");
  const pair = state.pairs[state.roundIndex];
  if (!pair) throw new GameError("invalid_phase");
  const winner =
    pair.left.views === pair.right.views ? "tie" : pair.left.views > pair.right.views ? "left" : "right";
  const won = choice === winner;
  const payout = winner === "tie" ? stake : won ? stake * 2 : 0;
  const streak = winner === "tie" ? state.streak : won ? state.streak + 1 : 0;
  return {
    ...state,
    balance: state.balance - stake + payout,
    streak,
    bestStreak: Math.max(state.bestStreak, streak),
    correct: state.correct + Number(won),
    total: state.total + 1,
    phase: "revealed",
    lastResult: { choice, winner, stake, won, payout },
  };
}
export function nextRound(state: GameState): GameState {
  if (state.phase !== "revealed") throw new GameError("invalid_phase");
  if (state.roundIndex + 1 === state.pairs.length) return { ...state, phase: "finished" };
  return { ...state, roundIndex: state.roundIndex + 1, phase: "picking", lastResult: null };
}
