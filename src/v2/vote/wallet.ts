import { useCallback, useEffect, useState } from "react";
import type { PlayStats } from "./data";

/* Paper wallet — simulated taka only, stored on this device.
   Never real money, never leaves the browser. */

const KEY = "kosh_paper_v2";
export const START_BALANCE = 10000;

export type WalletState = {
  balance: number;
  rounds: number;
  wipeouts: number;
  banked: number; // rounds ended by choosing to bank
  stakeFracSum: number;
  lossFollowed: number; // losses that were followed by another bet
  lossThenBigger: number; // ...where that next bet was larger
  best: number; // best single payout
  lastStake: number;
  lastWasLoss: boolean;
};

const fresh = (): WalletState => ({
  balance: START_BALANCE,
  rounds: 0,
  wipeouts: 0,
  banked: 0,
  stakeFracSum: 0,
  lossFollowed: 0,
  lossThenBigger: 0,
  best: 0,
  lastStake: 0,
  lastWasLoss: false,
});

const read = (): WalletState => {
  if (typeof localStorage === "undefined") return fresh();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    return { ...fresh(), ...JSON.parse(raw) };
  } catch {
    return fresh();
  }
};

export function useWallet() {
  const [w, setW] = useState<WalletState>(fresh);

  useEffect(() => setW(read()), []);

  /* Always update from the previous state: the games drive these from inside
     a requestAnimationFrame loop, which would otherwise hold a stale wallet. */
  const mutate = useCallback((fn: (prev: WalletState) => WalletState) => {
    setW((prev) => {
      const next = fn(prev);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* private mode — session-only is fine */
      }
      return next;
    });
  }, []);

  /* take the stake off the balance and note the sizing behaviour */
  const placeStake = useCallback(
    (stake: number) =>
      mutate((prev) => {
        const next = { ...prev };
        const before = next.balance;
        next.balance = Math.max(0, before - stake);
        next.stakeFracSum += before > 0 ? stake / before : 0;
        if (next.lastWasLoss) {
          next.lossFollowed += 1;
          if (stake > next.lastStake) next.lossThenBigger += 1;
        }
        next.lastStake = stake;
        return next;
      }),
    [mutate]
  );

  /* settle a finished round */
  const settle = useCallback(
    (payout: number, didBank: boolean) =>
      mutate((prev) => {
        const next = { ...prev };
        next.balance += payout;
        next.rounds += 1;
        if (didBank) next.banked += 1;
        if (payout > next.best) next.best = payout;
        next.lastWasLoss = payout <= 0;
        if (payout <= 0 && next.balance <= 0) next.wipeouts += 1;
        return next;
      }),
    [mutate]
  );

  const topUp = useCallback(
    () => mutate((prev) => ({ ...prev, balance: prev.balance + 5000 })),
    [mutate]
  );
  const reset = useCallback(() => mutate(() => fresh()), [mutate]);

  const stats: PlayStats = {
    rounds: w.rounds,
    wipeouts: w.wipeouts,
    avgStakeFrac: w.rounds ? w.stakeFracSum / w.rounds : 0,
    chaseRate: w.lossFollowed ? w.lossThenBigger / w.lossFollowed : 0,
    bankedRate: w.rounds ? w.banked / w.rounds : 0,
  };

  return { wallet: w, stats, placeStake, settle, topUp, reset };
}

export const taka = (n: number) =>
  `৳${Math.round(n).toLocaleString("en-IN")}`;
