import { getWallets } from "@wallet-standard/app";
import type { Wallet, WalletAccount } from "@wallet-standard/base";
import {
  StandardConnect,
  type StandardConnectFeature,
  StandardDisconnect,
  type StandardDisconnectFeature,
  StandardEvents,
  type StandardEventsFeature,
} from "@wallet-standard/features";
import ky from "ky";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";

type Features = StandardConnectFeature & StandardDisconnectFeature & StandardEventsFeature;
const methods = {
  [StandardConnect]: "connect",
  [StandardDisconnect]: "disconnect",
  [StandardEvents]: "on",
} as const;
function hasFeature<K extends keyof Features>(
  wallet: Wallet,
  key: K,
): wallet is Wallet & { readonly features: Pick<Features, K> } {
  const feature = wallet.features[key];
  return (
    typeof feature === "object" &&
    feature !== null &&
    "version" in feature &&
    feature.version === "1.0.0" &&
    methods[key] in feature &&
    typeof Reflect.get(feature, methods[key]) === "function"
  );
}
export function isSolanaWallet(wallet: Wallet): boolean {
  return wallet.chains.some((chain) => chain.startsWith("solana:")) && hasFeature(wallet, StandardConnect);
}
function solanaAccount(accounts: readonly WalletAccount[]): WalletAccount | undefined {
  return accounts.find((account) => account.chains.some((chain) => chain.startsWith("solana:")));
}
class WalletError extends Error {
  override readonly name = "WalletError";
  constructor(
    readonly code: "unsupported" | "account" | "balance",
    message: string,
  ) {
    super(message);
  }
}
const balanceResponse = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.number().int(),
  error: z.never().optional(),
  result: z.object({ value: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER) }),
});
export function parseDevnetBalance(payload: unknown, expectedId = 1): number {
  const parsed = balanceResponse.safeParse(payload);
  if (!parsed.success || parsed.data.id !== expectedId)
    throw new WalletError("balance", "Devnet returned an invalid balance response.");
  return parsed.data.result.value / 1_000_000_000;
}
type Session = { readonly wallet: Wallet; readonly address: string };
type Balance = {
  readonly address: string | null;
  readonly value: number | null;
  readonly loading: boolean;
  readonly error: string | null;
};
export function useSolanaWallet() {
  const [wallets, setWallets] = useState<readonly Wallet[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<Balance>({
    address: null,
    value: null,
    loading: false,
    error: null,
  });
  const [refresh, setRefresh] = useState(0);
  const request = useRef(0);
  const selected = useRef<Wallet | null>(null);
  const offWallet = useRef<(() => void) | null>(null);
  const address = session?.address ?? null;
  const clear = useCallback(() => {
    request.current += 1;
    offWallet.current?.();
    offWallet.current = null;
    selected.current = null;
    setSession(null);
    setConnecting(false);
    return request.current;
  }, []);

  useEffect(() => {
    const registry = getWallets();
    const update = () => setWallets(registry.get().filter(isSolanaWallet));
    const offRegister = registry.on("register", update);
    const offUnregister = registry.on("unregister", (...removed) => {
      update();
      if (selected.current && removed.includes(selected.current)) {
        clear();
        setError("The wallet is no longer available.");
      }
    });
    update();
    return () => {
      request.current += 1;
      offWallet.current?.();
      offWallet.current = null;
      offRegister();
      offUnregister();
    };
  }, [clear]);

  const connect = useCallback(
    async (wallet: Wallet): Promise<void> => {
      const generation = clear();
      selected.current = wallet;
      setConnecting(true);
      setError(null);
      try {
        if (!isSolanaWallet(wallet) || !hasFeature(wallet, StandardConnect))
          throw new WalletError("unsupported", "This wallet does not support Solana connections.");
        let changedAccounts: readonly WalletAccount[] | null = null;
        if (hasFeature(wallet, StandardEvents)) {
          offWallet.current = wallet.features[StandardEvents].on("change", (change) => {
            if (request.current !== generation || !change.accounts) return;
            changedAccounts = change.accounts;
            const account = solanaAccount(change.accounts);
            setSession(account ? { wallet, address: account.address } : null);
          });
        }
        const result = await wallet.features[StandardConnect].connect();
        if (request.current !== generation) return;
        const account = solanaAccount(changedAccounts ?? result.accounts);
        if (!account) throw new WalletError("account", "The wallet did not share a Solana account.");
        setSession({ wallet, address: account.address });
      } catch (cause) {
        if (request.current !== generation) return;
        clear();
        setError(cause instanceof Error ? cause.message : "Wallet connection was declined or failed.");
      } finally {
        if (request.current === generation) setConnecting(false);
      }
    },
    [clear],
  );

  const disconnect = useCallback(async (): Promise<void> => {
    const wallet = selected.current;
    const generation = clear();
    setError(null);
    try {
      if (wallet && hasFeature(wallet, StandardDisconnect))
        await wallet.features[StandardDisconnect].disconnect();
    } catch (cause) {
      if (request.current === generation)
        setError(cause instanceof Error ? cause.message : "The wallet could not finish disconnecting.");
    }
  }, [clear]);

  useEffect(() => {
    const controller = new AbortController();
    setBalance({ address, value: null, loading: address !== null, error: null });
    if (!address) return () => controller.abort();
    void (async () => {
      try {
        const payload: unknown = await ky
          .post("https://api.devnet.solana.com", {
            json: {
              jsonrpc: "2.0",
              id: refresh + 1,
              method: "getBalance",
              params: [address, { commitment: "confirmed" }],
            },
            signal: controller.signal,
            timeout: 10_000,
            retry: 0,
          })
          .json();
        const value = parseDevnetBalance(payload, refresh + 1);
        if (!controller.signal.aborted) setBalance({ address, value, loading: false, error: null });
      } catch (cause) {
        if (!controller.signal.aborted)
          setBalance({
            address,
            value: null,
            loading: false,
            error: cause instanceof Error ? cause.message : "Could not read the Devnet balance.",
          });
      }
    })();
    return () => controller.abort();
  }, [address, refresh]);

  return {
    wallets,
    wallet: session?.wallet ?? null,
    address,
    connecting,
    error,
    connect,
    disconnect,
    balance: balance.address === address ? balance.value : null,
    balanceLoading: address !== null && (balance.address !== address || balance.loading),
    balanceError: balance.address === address ? balance.error : null,
    refreshBalance: useCallback(() => setRefresh((value) => value + 1), []),
  };
}
