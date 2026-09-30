import { describe, expect, test } from "bun:test";
import type { Video } from "../src/data/videos";
import { createSession, GameError, type GameState, nextRound, placePrediction } from "../src/game/engine";

const videos: readonly Video[] = Array.from(
  { length: 8 },
  (_, index): Video => ({
    id: `v${index}`,
    youtubeId: `youtube${index}`,
    title: `Video ${index}`,
    creator: "Creator",
    views: (index + 1) * 1000,
    category: "Comedy",
    capturedAt: "2026-09-30",
    sourceUrl: `https://youtube.com/watch?v=youtube${index}`,
    start: 0,
  }),
);

function winner(state: GameState): "left" | "right" {
  const pair = state.pairs[state.roundIndex];
  if (!pair) throw new GameError("invalid_phase");
  return pair.left.views > pair.right.views ? "left" : "right";
}

describe("prediction settlement", () => {
  test("returns twice the stake when the prediction wins", () => {
    // Given
    const state = createSession(videos, 123);
    // When
    const result = placePrediction(state, { choice: winner(state), stake: 100 });
    // Then
    expect(result.balance).toBe(1100);
    expect(result.lastResult?.payout).toBe(200);
    expect(result.correct).toBe(1);
    expect(result.streak).toBe(1);
    expect(state.balance).toBe(1000);
  });
  test("loses the stake and resets streak when prediction loses", () => {
    // Given
    const state = { ...createSession(videos, 123), streak: 3, bestStreak: 3 };
    // When
    const result = placePrediction(state, { choice: winner(state) === "left" ? "right" : "left", stake: 50 });
    // Then
    expect(result.balance).toBe(950);
    expect(result.streak).toBe(0);
    expect(result.bestStreak).toBe(3);
  });
  test("rejects a second settlement for a revealed round", () => {
    // Given
    const state = placePrediction(createSession(videos, 7), { choice: "left", stake: 10 });
    // When / Then
    expect(() => placePrediction(state, { choice: "right", stake: 10 })).toThrow("invalid_phase");
  });
  test.each([0, -10, 1, 25, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects unsupported stake %s",
    (stake) => {
      // Given
      const state = createSession(videos, 7);
      // When / Then
      expect(() => placePrediction(state, { choice: "left", stake })).toThrow("invalid_stake");
    },
  );
  test("rejects a stake greater than the available balance", () => {
    // Given
    const state = { ...createSession(videos, 7), balance: 40 };
    // When / Then
    expect(() => placePrediction(state, { choice: "left", stake: 50 })).toThrow("insufficient_balance");
  });
  test("refunds tied view counts without changing streak", () => {
    // Given
    const state = {
      ...createSession(
        videos.map((video) => ({ ...video, views: 100 })),
        7,
      ),
      streak: 2,
    };
    // When
    const result = placePrediction(state, { choice: "left", stake: 100 });
    // Then
    expect(result.balance).toBe(1000);
    expect(result.lastResult?.winner).toBe("tie");
    expect(result.streak).toBe(2);
  });
});

describe("session progression", () => {
  test("finishes after ten predictions", () => {
    // Given
    let state = createSession(videos, 5);
    // When
    for (let round = 0; round < 10; round++)
      state = nextRound(placePrediction(state, { choice: winner(state), stake: 100 }));
    // Then
    expect(state.phase).toBe("finished");
    expect(state.total).toBe(10);
    expect(state.correct).toBe(10);
    expect(state.balance).toBe(2000);
    expect(state.bestStreak).toBe(10);
  });
  test("repeats the same ordered pairs with the same seed", () => {
    // Given
    const initial = createSession(videos, 42);
    // When
    const repeated = createSession(videos, 42);
    // Then
    expect(repeated.pairs).toEqual(initial.pairs);
    expect(createSession(videos, 43).pairs).not.toEqual(initial.pairs);
  });
  test("never repeats a pair or pairs a video with itself", () => {
    // Given / When
    const state = createSession([...videos, ...videos], 42);
    // Then
    const identities = state.pairs.map((pair) =>
      [pair.left.youtubeId, pair.right.youtubeId].sort().join(":"),
    );
    expect(new Set(identities).size).toBe(10);
    expect(state.pairs.every((pair) => pair.left.youtubeId !== pair.right.youtubeId)).toBe(true);
  });
  test("rejects a dataset too small for ten unique pairs", () => {
    // Given / When / Then
    expect(() => createSession(videos.slice(0, 4), 42)).toThrow("insufficient_videos");
  });
  test("cannot skip an unplayed round", () => {
    // Given
    const state = createSession(videos, 42);
    // When / Then
    expect(() => nextRound(state)).toThrow("invalid_phase");
  });
});
