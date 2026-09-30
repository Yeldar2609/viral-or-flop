import { describe, expect, test } from "bun:test";
import type { Wallet } from "@wallet-standard/base";
import { isSolanaWallet, parseDevnetBalance } from "../src/wallet/useSolanaWallet";

const wallet: Wallet = {
  version: "1.0.0",
  name: "Test",
  icon: "data:image/png;base64,",
  accounts: [],
  chains: ["solana:devnet"],
  features: { "standard:connect": { version: "1.0.0", connect: async () => ({ accounts: [] }) } },
};
describe("Solana wallet discovery", () => {
  test("includes a Solana wallet with the standard connect feature", () => {
    // Given / When / Then
    expect(isSolanaWallet(wallet)).toBe(true);
  });
  test("excludes a wallet with no Solana chains", () => {
    // Given
    const other = { ...wallet, chains: ["ethereum:mainnet"] as const };
    // When / Then
    expect(isSolanaWallet(other)).toBe(false);
  });
  test("excludes a wallet without a callable connect feature", () => {
    // Given
    const other = { ...wallet, features: { "standard:connect": { version: "1.0.0", connect: true } } };
    // When / Then
    expect(isSolanaWallet(other)).toBe(false);
  });
});
describe("Devnet balance response", () => {
  test.each([0, 1, 2_500_000_000])("converts %s lamports to SOL", (lamports) => {
    // Given
    const payload = { jsonrpc: "2.0", id: 1, result: { context: { slot: 42 }, value: lamports } };
    // When
    const balance = parseDevnetBalance(payload);
    // Then
    expect(balance).toBe(lamports / 1_000_000_000);
  });
  test.each(["100", -1, 0.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid lamports %s",
    (value) => {
      // Given
      const payload = { jsonrpc: "2.0", id: 1, result: { value } };
      // When / Then
      expect(() => parseDevnetBalance(payload)).toThrow();
    },
  );
  test.each([
    null,
    {},
    { jsonrpc: "2.0", id: 1, result: null },
    { jsonrpc: "2.0", id: 2, result: { value: 100 } },
    { jsonrpc: "2.0", id: 1, error: { code: -32005, message: "Node is unhealthy" } },
    { jsonrpc: "2.0", id: 1, result: { value: 100 }, error: { code: -32005 } },
  ])("rejects malformed, mismatched or failed balance payload %j", (payload) => {
    // Given / When / Then
    expect(() => parseDevnetBalance(payload)).toThrow();
  });
  test("accepts the response to a refreshed balance request", () => {
    // Given
    const payload = { jsonrpc: "2.0", id: 3, result: { value: 1_000_000_000 } };
    // When
    const balance = parseDevnetBalance(payload, 3);
    // Then
    expect(balance).toBe(1);
  });
});
