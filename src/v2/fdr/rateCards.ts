// ── The banks' own rate cards ────────────────────────────────────────────────
//
// Bangladesh Bank's chart gives one BAND per bank per tenure — "8.00–9.25%" —
// because it compresses a whole price list into two numbers. This file holds
// the price list itself, for the banks that publish one, so the page can answer
// the question the band cannot: at MY amount, as an individual, what rate?
//
// ── WHAT THIS IS AND IS NOT ─────────────────────────────────────────────────
// It IS: the bank's own published card, read off the bank's own page or PDF,
// with the effective date the bank printed on it.
//
// It is NOT scraped. Nineteen banks publish a readable card and every one of
// them lays it out differently — some price by amount slab, some by product
// name, some in Bengali, several only in a PDF. A parser over that produces a
// number per bank with no way to tell a good one from a bad one, which is the
// single failure this whole surface exists to avoid. So each card is read by a
// person, carries its source, and carries the date it was read.
//
// ── WHY IT OVERRIDES THE CENTRAL BANK ───────────────────────────────────────
// Because it is fresher and more specific. Mercantile's card is effective
// 1 September 2026; BB's chart is August. And where BB says "7.75–8.50", the
// bank's own card says an individual with under ৳50 lakh gets 8.00% at twelve
// months — which is the number the reader came for.
//
// When a card and the filing disagree, BOTH are shown. The bank's card leads,
// the filing sits under it, and the reader can see the disagreement rather
// than having it resolved for them silently.
//
// ── KEEPING IT HONEST ───────────────────────────────────────────────────────
// `readOn` is the day a human read the page. `effectiveFrom` is the date the
// BANK printed on the card. scripts/check-rate-cards.mjs re-fetches each source
// and reports when the page changed, so a stale card is found rather than
// trusted — the same watcher-not-parser pattern the sourcing layer uses.

export type Audience = "individual" | "institution";

export interface CardSlab {
  /** Inclusive floor in taka. 0 = from the first taka. */
  from: number;
  /** Exclusive ceiling in taka, or null for "and above". */
  to: number | null;
  /** Months → rate. Only the tenures the bank actually publishes. */
  rates: Record<number, number>;
}

export interface BankRateCard {
  /** Joins to BANKS[].code. */
  code: string;
  /** The page or PDF this was read from. */
  source: string;
  /** As the bank printed it, e.g. "1 September 2026", or null if undated. */
  effectiveFrom: string | null;
  /** ISO date a person read it. */
  readOn: string;
  /**
   * Rates by audience. A bank that publishes one table for everybody gets a
   * single "individual" entry — claiming a separate institutional rate it
   * never published would be inventing one.
   */
  slabs: Partial<Record<Audience, CardSlab[]>>;
  /** Anything the table alone would mislead about. Shown under the card. */
  note?: string;
}

export const BANK_RATE_CARDS: BankRateCard[] = [
  {
    // ── Dutch-Bangla: where one extra month is worth 1.30 points ────────────
    // Its ordinary term deposit pays the same 7.00/7.10/7.20% at every amount
    // slab — unusual, and worth knowing, because at DBBL size buys you
    // nothing. But its 13-MONTH FDR pays 8.50%, to individuals and companies
    // alike. Thirteen months instead of twelve is worth more than any amount
    // of extra money, which is precisely the kind of thing a band flattens.
    code: "DUTCH-BANGLA",
    source: "https://www.dutchbanglabank.com/depositsadv/term-deposit.html",
    effectiveFrom: null,
    readOn: "2026-09-12",
    slabs: {
      individual: [{ from: 0, to: null, rates: { 3: 7.0, 6: 7.1, 12: 7.2, 24: 7.2, 36: 7.2 } }],
      institution: [{ from: 0, to: null, rates: { 3: 7.0, 6: 7.1, 12: 7.2, 24: 7.2, 36: 7.2 } }],
    },
    note: "Dutch-Bangla's 13-month FDR pays 8.50% — 1.30 points more than its twelve-month rate, and the same for individuals and companies. Its ordinary rates do not improve with the size of the deposit.",
  },
  {
    // ── Padma: the clearest named-promotion ladder ─────────────────────────
    // Its ordinary FDR runs 6.00% at a month to 9.50% at a year, and beside it
    // sit named short-tenor products — Privilege 100, Priority 200, Comfort
    // 400 — which are the "promotional rates" a central-bank band cannot
    // express. Only the ordinary ladder is encoded, because the named products
    // carry their own terms; they are named in the note instead.
    code: "Padma",
    source: "https://padmabankbd.com/interst-rate",
    effectiveFrom: null,
    readOn: "2026-09-12",
    slabs: {
      individual: [{ from: 0, to: null, rates: { 1: 6.0, 3: 7.5, 6: 9.0, 12: 9.5 } }],
    },
    note: "Padma also runs named day-count deposits: Privilege 100 at 7.75%, Priority 200 at 9.00% and Comfort 400 at 9.50%, all at any amount. Its card stops at twelve months.",
  },
  {
    // ── Uttara: the clearest individual/institution split, and real promos ──
    // Dated 9 August 2026 on the bank's own page. Its ordinary FDR pays an
    // individual 9.00% at a year against 6.70% for a company — and its named
    // day-count products (UB 100/200/300 days) are the promotional pricing a
    // central-bank band cannot express at all.
    code: "UTTARA",
    source: "https://www.uttarabank-bd.com/home/interestrate",
    effectiveFrom: "9 August 2026",
    readOn: "2026-09-12",
    slabs: {
      individual: [
        { from: 0, to: 20_000_000, rates: { 3: 8.5, 6: 8.75, 12: 9.0, 24: 9.0, 36: 9.0 } },
        { from: 20_000_000, to: 50_000_000, rates: { 3: 8.7, 6: 8.8, 12: 8.9, 24: 8.9 } },
        { from: 50_000_000, to: 250_000_000, rates: { 3: 8.8, 6: 8.9, 12: 9.0, 24: 9.0 } },
        { from: 250_000_000, to: null, rates: { 3: 8.9, 6: 9.0, 12: 9.0, 24: 9.0 } },
      ],
      institution: [{ from: 0, to: null, rates: { 3: 6.25, 6: 6.5, 12: 6.7, 24: 6.7, 36: 6.7 } }],
    },
    note: "Uttara also runs named short-tenor FDRs: 100 days pays 8.60–8.85%, 200 days 8.70–8.95% and 300 days 8.80–9.00%, rising with the amount — all from ৳10 lakh up. For money you can leave under a year those beat its ordinary 3- and 6-month rates.",
  },
  {
    // ── Mercantile: the clearest promotional structure in the country ──────
    // Day-count tenors (61–99, 100–199, 200–299, 300–360) sit alongside the
    // ordinary monthly ladder, which is exactly the "special tenor" pricing a
    // central-bank band flattens away. The card is dated by the bank.
    code: "MERCANTILE",
    source: "https://mblbd.com/interest-rates",
    effectiveFrom: "1 September 2026",
    readOn: "2026-09-12",
    slabs: {
      individual: [
        { from: 0, to: 10_000_000, rates: { 1: 3.0, 3: 8.0, 6: 8.5, 12: 9.0, 24: 9.0, 36: 9.0 } },
        { from: 10_000_000, to: null, rates: { 1: 3.0, 3: 8.5, 6: 8.75, 12: 9.25, 24: 9.0, 36: 9.0 } },
      ],
    },
    note: "Mercantile also prices by day count: 61–99 days 7.00% (7.50% at ৳1 crore+), 100–199 days 8.00%, 200–299 days 8.25%, 300–360 days 8.50%. Those beat the 3- and 6-month rates for money you can leave a little longer.",
  },
  {
    // ── AB Bank: the widest individual/institution gap on the page ─────────
    // 12.00% to an individual at one year against 6.50% to an institution.
    // Both figures are the bank's own, and the 12.00% corroborates exactly
    // what AB filed with Bangladesh Bank — which is the cross-check that
    // makes a hand-read card trustworthy.
    code: "AB-BANK",
    source: "https://abbl.com/rates-and-charge/fixed-deposit-rates/",
    effectiveFrom: null,
    readOn: "2026-09-12",
    slabs: {
      individual: [{ from: 0, to: null, rates: { 1: 8.0, 3: 12.0, 6: 12.0, 12: 12.0, 24: 12.0 } }],
      institution: [{ from: 0, to: null, rates: { 1: 3.0, 3: 7.0, 6: 6.0, 12: 6.5, 24: 6.0 } }],
    },
    note: "AB Bank also runs a \u2018Profit First\u2019 variant that pays out monthly at a lower headline — 11.50% for 3 and 6 months, 11.00% for a year — and separate rates above ৳10 crore.",
  },
  {
    // Trust Bank prints the clearest card in the country and is the worked
    // example the UI uses to explain what a band contains: individuals priced
    // in four deposit slabs, institutions on one flat line.
    code: "TRUST BANK",
    source: "https://tblbd.com/rates/",
    effectiveFrom: null,
    readOn: "2026-09-12",
    slabs: {
      individual: [
        { from: 0, to: 5_000_000, rates: { 1: 3.0, 3: 7.75, 6: 7.75, 12: 8.0 } },
        { from: 5_000_000, to: 10_000_000, rates: { 1: 3.25, 3: 8.0, 6: 8.0, 12: 8.25 } },
        { from: 10_000_000, to: 50_000_000, rates: { 1: 3.5, 3: 8.25, 6: 8.25, 12: 8.5 } },
        { from: 50_000_000, to: null, rates: { 1: 3.75, 3: 8.5, 6: 8.5, 12: 9.0 } },
      ],
      institution: [{ from: 0, to: null, rates: { 1: 3.5, 3: 7.75, 6: 8.0, 12: 8.25 } }],
    },
    note: "Trust Bank's card stops at twelve months; longer tenures are quoted at the branch.",
  },
];

const BY_CODE = new Map(BANK_RATE_CARDS.map((c) => [c.code.toUpperCase(), c]));

export function rateCardFor(code: string): BankRateCard | undefined {
  return BY_CODE.get(code.toUpperCase());
}

/** The slab a deposit of `amount` falls into, or undefined. */
export function slabFor(
  card: BankRateCard,
  amount: number,
  audience: Audience = "individual",
): CardSlab | undefined {
  const slabs = card.slabs[audience] ?? card.slabs.individual;
  return slabs?.find((s) => amount >= s.from && (s.to == null || amount < s.to));
}

/**
 * The exact rate for an amount and a term, or null when the bank's card does
 * not cover that term.
 *
 * Null matters: Trust Bank publishes nothing past twelve months, and inventing
 * a three-year rate by holding the twelve-month figure flat would be making up
 * the most important number on the page.
 */
export function cardRate(
  card: BankRateCard,
  amount: number,
  months: number,
  audience: Audience = "individual",
): number | null {
  const slab = slabFor(card, amount, audience);
  if (!slab) return null;
  return slab.rates[months] ?? null;
}

/** Every term the card publishes, ascending — for rendering its own table. */
export function cardMonths(card: BankRateCard, audience: Audience = "individual"): number[] {
  const slabs = card.slabs[audience] ?? card.slabs.individual ?? [];
  const all = new Set<number>();
  for (const s of slabs) for (const m of Object.keys(s.rates)) all.add(Number(m));
  return [...all].sort((a, b) => a - b);
}

/** Taka label for a slab boundary: "under ৳50 lakh", "৳5 crore and above". */
export function slabLabel(slab: CardSlab): string {
  const money = (n: number) => {
    if (n >= 10_000_000) return `৳${n / 10_000_000} crore`;
    if (n >= 100_000) return `৳${n / 100_000} lakh`;
    return `৳${n.toLocaleString("en-IN")}`;
  };
  // A single slab with no ceiling is the bank quoting one rate for everybody,
  // which it writes as "Any Amount" — not "under ৳0", which is what the
  // from-0 branch produced before this line existed.
  if (slab.from === 0 && slab.to == null) return "any amount";
  if (slab.from === 0) return `under ${money(slab.to!)}`;
  if (slab.to == null) return `${money(slab.from)} and above`;
  return `${money(slab.from)} – ${money(slab.to)}`;
}
