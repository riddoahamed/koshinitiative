// ── bankRates — what each bank actually pays on a fixed deposit ─────────────
//
// The FDR card has always made the argument: "the same product pays 6% at one
// bank and 12% at another. Shopping the rate is the whole game." It never
// showed the shopping. A reader was told the spread matters and then left to go
// and find it themselves, which is the one job the card existed to do for them.
//
// ── WHERE THE NUMBERS COME FROM, AND WHY THAT CHANGED ───────────────────────
// This file used to ship EMPTY, under a comment explaining that no free
// machine-readable source for per-bank BD deposit rates exists, and that
// writing plausible numbers from memory was the worst thing we could do here.
//
// The second half of that was right and still governs everything below. The
// first half was wrong. Every scheduled bank must file its announced deposit
// rates with Bangladesh Bank, and BB republishes all of them as one chart, per
// month, per bank, split by tenure. scripts/fetch-bank-rates.mjs reads that
// chart into bankRates.generated.ts. Nobody types a rate in by hand, so nobody
// can mistype one.
//
// ── WHAT A NUMBER HERE IS, AND IS NOT ───────────────────────────────────────
// It IS: the rate the bank told the central bank it was announcing, for a
// stated month, on a stated tenure.
//
// It is NOT: a quote. Banks move rates between filings, run campaign rates
// they never file, price large deposits individually, and treat the filed
// figure as a ceiling or a floor depending on the bank. Every surface that
// renders this data has to carry that, and link the bank's own page, which is
// why `bankByCode` pairs each row with a link before it reaches the UI.

import {
  FD_TENURES,
  GENERATED_BANK_RATES,
  RATES_MONTH,
  RATES_MONTH_STAMP,
  RATES_SOURCE,
  type RateBand,
} from "./rates.generated";
import { bankByCode, type BankGroup, type BankProfile } from "./banks";

export { FD_TENURES, RATES_MONTH, RATES_MONTH_STAMP, RATES_SOURCE };
export type { RateBand };

/** Index into `fd` / FD_TENURES. 2 is "1 to <2 years" — the FDR everyone means. */
export type TenureIndex = 0 | 1 | 2 | 3 | 4;
export const DEFAULT_TENURE: TenureIndex = 2;

/** Short labels for a phone, in the same order as FD_TENURES. */
export const TENURE_SHORT = ["3–6 mo", "6 mo–1 yr", "1–2 yr", "2–3 yr", "3 yr+"] as const;

export interface FdrRow {
  bank: BankProfile;
  group: BankGroup;
  savings: RateBand;
  /** Five bands, aligned to FD_TENURES. null = the bank filed nothing. */
  fd: RateBand[];
}

/**
 * Every bank in the chart we can name, joined to its profile.
 *
 * A code with no profile is DROPPED rather than rendered as a bare code. When
 * a new bank is licensed the table silently loses a row until someone adds it
 * to banks.ts — `unmatchedCodes()` exists so a test can fail instead, because
 * "silently" is the part that would otherwise never get noticed.
 */
export const FDR_ROWS: FdrRow[] = GENERATED_BANK_RATES.flatMap((r) => {
  const bank = bankByCode(r.code);
  return bank ? [{ bank, group: r.group, savings: r.savings, fd: r.fd }] : [];
});

/** Chart codes with no entry in banks.ts. Should be empty; a test asserts it. */
export function unmatchedCodes(): string[] {
  return GENERATED_BANK_RATES.filter((r) => !bankByCode(r.code)).map((r) => r.code);
}

/** The band a row publishes for one tenure, or null if it filed nothing. */
export function bandAt(row: FdrRow, tenure: TenureIndex): RateBand {
  return row.fd[tenure] ?? null;
}

/**
 * The number a row sorts by: the top of its published range.
 *
 * Sorting on the top flatters a bank that files "2.75–9.00" over one that
 * files a flat 8.75, which is why the UI never prints the sort key alone —
 * it prints the whole range, so a wide one is visible as a wide one.
 */
export function topRate(row: FdrRow, tenure: TenureIndex): number | null {
  return bandAt(row, tenure)?.max ?? null;
}

/**
 * Months each band is counted at, for taka maths.
 *
 * The SHORTEST term in each band, deliberately. "3 months but <6 months" paid
 * at the 3-month end is the least a depositor can end up with, and a page that
 * quotes the generous end of a band it does not control is doing the thing
 * this whole surface exists to stop.
 */
export const TENURE_MONTHS = [3, 6, 12, 24, 36] as const;

/**
 * Interest actually received: simple, for the term, after tax at source.
 *
 * Simple and not compound on purpose. Banks differ — quarterly payout,
 * compounding at maturity, monthly-profit schemes — and assuming the most
 * generous of those would inflate every figure on the page by a margin the
 * depositor has no way to check. Simple interest is the floor every one of
 * them clears.
 */
export function netInterest(amount: number, ratePct: number, months: number, taxPct: number) {
  const gross = (amount * ratePct * (months / 12)) / 100;
  return gross * (1 - taxPct / 100);
}

/**
 * A band so wide the headline number stops describing the product.
 *
 * Measured, not guessed: at 1–2 years, 20 of the 61 banks file a single flat
 * rate and the median band is 0.62 points. Only ten file wider than four
 * points. So this flags a genuine minority — ICB Islamic's 5.75–12.50 and
 * SBAC's 5.50–12.50 — rather than scolding the whole table.
 */
export const WIDE_BAND_POINTS = 4;

export function isWideBand(band: RateBand): boolean {
  return !!band && band.max - band.min >= WIDE_BAND_POINTS;
}

/** The floor of a row's published range — what it commits to at worst. */
export function floorRate(row: FdrRow, tenure: TenureIndex): number | null {
  return bandAt(row, tenure)?.min ?? null;
}

export type SortKey = "top" | "floor" | "oldest";

export function rateBy(row: FdrRow, tenure: TenureIndex, by: SortKey): number | null {
  // "oldest" still RETURNS a rate — it is the number the row prints and the
  // number the taka column is worked out from. Only the ORDER changes, in
  // sortRows below. Making this return a year would put a year in the rate
  // column, which is the shape of bug that ships.
  if (by === "oldest") return topRate(row, tenure);
  return by === "top" ? topRate(row, tenure) : floorRate(row, tenure);
}

/**
 * The order the table is shown in.
 *
 * Rate descending for the two rate keys; by age for "oldest", which exists
 * because a page that only ever sorts by rate is a page that only ever points
 * at whoever is paying up for deposits. A bank that has taken deposits since
 * 1959 is a different proposition from one licensed in 2020 at the same rate,
 * and the reader should be able to see that ordering.
 *
 * Banks with no verified founding year sort last rather than being guessed
 * into a position.
 */
export function sortRows(rows: FdrRow[], tenure: TenureIndex, by: SortKey): FdrRow[] {
  if (by !== "oldest") {
    return [...rows].sort((a, b) => (rateBy(b, tenure, by) ?? -1) - (rateBy(a, tenure, by) ?? -1));
  }
  return [...rows].sort((a, b) => {
    const ay = a.bank.since ?? Infinity;
    const byr = b.bank.since ?? Infinity;
    if (ay !== byr) return ay - byr;
    return (topRate(b, tenure) ?? -1) - (topRate(a, tenure) ?? -1);
  });
}

/**
 * The middle half of the market, and the two ends.
 *
 * ── WHY NOT JUST "BEST VS WORST" ────────────────────────────────────────────
 * Because the worst is Citibank at 0.10% and the best is a bank filing a band
 * that tops out at 12.75%, and "the spread is 12.65 points" is arithmetic
 * nobody can use. The foreign banks are not competing for a retail FDR at all;
 * quoting them as the floor of a shopping range makes the page look dramatic
 * and tells the reader nothing.
 *
 * Quartiles fix that without hiding anything: the table still lists every bank
 * including both extremes, and the headline describes where the market
 * actually sits.
 */
export interface MarketBand {
  /** 25th and 75th percentile — where most banks are. */
  typicalLow: number;
  typicalHigh: number;
  best: number;
  lowest: number;
  /** Middle of the market, the fair thing to measure a good rate against. */
  median: number;
  count: number;
}

export function marketBand(
  tenure: TenureIndex = DEFAULT_TENURE,
  by: SortKey = "top",
  rows: FdrRow[] = FDR_ROWS,
): MarketBand | null {
  const vals = rows
    .map((r) => rateBy(r, tenure, by))
    .filter((v): v is number => v != null)
    .sort((a, b) => a - b);
  if (vals.length < MIN_RATES_TO_COMPARE) return null;
  const at = (q: number) => vals[Math.min(vals.length - 1, Math.floor(q * (vals.length - 1)))];
  return {
    typicalLow: at(0.25),
    typicalHigh: at(0.75),
    median: at(0.5),
    best: vals[vals.length - 1],
    lowest: vals[0],
    count: vals.length,
  };
}

export function formatBand(band: RateBand): string {
  if (!band) return "—";
  const n = (v: number) => (Math.round(v * 100) / 100).toFixed(2);
  return band.min === band.max ? `${n(band.max)}%` : `${n(band.min)}–${n(band.max)}%`;
}

/** Fewest rows worth calling a comparison. Two banks is not a market. */
export const MIN_RATES_TO_COMPARE = 3;

export interface RateSpread {
  rows: FdrRow[];
  low: FdrRow;
  high: FdrRow;
  /** Percentage points between best and worst — the reason to shop. */
  spreadPoints: number;
  /** Taka difference over a year on ৳1,00,000, which is what the gap means. */
  gapOnLakh: number;
  tenure: TenureIndex;
}

/**
 * The comparison, or null when we do not have enough to make one.
 *
 * Null is the important return. Callers must render nothing rather than an
 * empty table — a table with one row reads as "this is the rate", which is a
 * recommendation we did not make.
 */
export function fdrSpread(
  tenure: TenureIndex = DEFAULT_TENURE,
  rows: FdrRow[] = FDR_ROWS,
  by: SortKey = "top",
): RateSpread | null {
  const usable = rows.filter((r) => rateBy(r, tenure, by) != null);
  if (usable.length < MIN_RATES_TO_COMPARE) return null;
  const sorted = sortRows(usable, tenure, by);
  const high = sorted[0];
  const low = sorted[sorted.length - 1];
  const spreadPoints = Math.round((rateBy(high, tenure, by)! - rateBy(low, tenure, by)!) * 100) / 100;
  return {
    rows: sorted,
    low,
    high,
    spreadPoints,
    // On ৳1,00,000 — the unit every fee and rate on Kosh is quoted against.
    gapOnLakh: Math.round((spreadPoints / 100) * 100_000),
    tenure,
  };
}

// ── Freshness ───────────────────────────────────────────────────────────────
// Measured against BB'S OWN month stamp, never against the day we fetched.
// A cron that runs every night and reads the same stale chart would otherwise
// keep reporting "updated today" about numbers from last spring.

export type Freshness = "current" | "aging" | "stale";

/** Whole months between BB's chart month and now. */
export function monthsBehind(now: Date = new Date(), stamp = RATES_MONTH_STAMP): number {
  const [y, m] = stamp.split("-").map(Number);
  if (!y || !m) return Number.POSITIVE_INFINITY;
  return (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
}

/**
 * BB publishes a month or so in arrears, so one month behind IS current and
 * saying otherwise would train readers to ignore the badge. Three or more
 * months means the chart stopped moving or our fetch has been failing, and at
 * that point the page should say go and check the bank yourself.
 */
export function freshness(now: Date = new Date()): Freshness {
  const behind = monthsBehind(now);
  if (behind <= 1) return "current";
  if (behind <= 2) return "aging";
  return "stale";
}

// ── One rate, for one bank, at one amount and one term ──────────────────────
//
// The calculator's weakest input was always the rate: it asks for a number and
// the reader guesses, or types what a relative told them. Everything needed to
// answer it properly is now in the repo — the central bank's filing for all 61
// banks, and the published card for the handful we have read — so this is the
// function that turns "which bank, how much, how long" into the figure the
// maturity maths should use.
//
// It prefers the BANK'S OWN CARD and says so. Where there is no card it falls
// back to the filing and says that instead, because a filing is a band and a
// reader is entitled to know that the number they are about to compound is the
// top of a range rather than a quote.

import { cardRate, rateCardFor, slabFor, slabLabel, type Audience } from "./rateCards";

export interface ResolvedRate {
  pct: number;
  /** Which layer answered: the bank's own card, or its central-bank filing. */
  from: "card" | "filing";
  /** One line a reader can check, e.g. "their card · under ৳50 lakh". */
  note: string;
  /** Present when the filing answered AND it is a range, not a rate. */
  band?: RateBand;
}

/** The tenure band a term in months falls into. */
export function tenureForMonths(months: number): TenureIndex {
  if (months < 6) return 0;
  if (months < 12) return 1;
  if (months < 24) return 2;
  if (months < 36) return 3;
  return 4;
}

/** The nearest term the card publishes at or below the one asked for. */
function nearestCardMonths(code: string, months: number, audience: Audience): number | null {
  const card = rateCardFor(code);
  if (!card) return null;
  const slab = slabFor(card, 1, audience);
  void slab;
  const published = Object.keys(
    (card.slabs[audience] ?? card.slabs.individual ?? [])[0]?.rates ?? {},
  ).map(Number);
  // Round DOWN, never up: a bank publishing 12 months and nothing beyond it
  // has not told us what three years pays, and borrowing the 12-month figure
  // upward would invent the number the whole page exists to get right.
  const usable = published.filter((m) => m <= months).sort((a, b) => b - a);
  return usable[0] ?? null;
}

export function rateForBank(
  code: string,
  amount: number,
  months: number,
  audience: Audience = "individual",
): ResolvedRate | null {
  const card = rateCardFor(code);
  if (card) {
    const m = nearestCardMonths(code, months, audience);
    const pct = m == null ? null : cardRate(card, amount, m, audience);
    if (pct != null) {
      const slab = slabFor(card, amount, audience);
      const where =
        slab && !(slab.from === 0 && slab.to == null) ? ` · ${slabLabel(slab)}` : "";
      const term =
        m == null || m === months
          ? ""
          : ` · their ${m < 12 ? `${m}-month` : `${m / 12}-year`} rate`;
      return { pct, from: "card", note: `their own card${where}${term}` };
    }
  }

  const row = FDR_ROWS.find((r) => r.bank.code === code);
  if (!row) return null;
  const t = tenureForMonths(months);
  const band = bandAt(row, t);
  if (!band) return null;
  return {
    pct: band.max,
    from: "filing",
    band,
    note:
      band.min === band.max
        ? `filed with Bangladesh Bank · ${TENURE_SHORT[t]}`
        : `top of its ${band.min.toFixed(2)}–${band.max.toFixed(2)}% filing · ${TENURE_SHORT[t]}`,
  };
}
