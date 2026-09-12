// ── GENERATED — do not hand-edit ─────────────────────────────────────────────
// Written by scripts/fetch-bank-rates.mjs from the Bangladesh Bank announced
// interest rate chart for scheduled banks (deposit rate):
//   https://www.bb.org.bd/en/index.php/financialactivity/interestdeposit
//
// Every scheduled bank files its announced deposit rates with the central bank
// and BB republishes them monthly. These are those filings, unedited — not a
// reading of 61 separate bank websites, and not anybody's estimate.
//
// A rate here is what the bank ANNOUNCED for August, 2026. Banks move rates between
// filings, run unlisted campaign rates, and quote differently on large or
// long deposits. The UI says so, and links every bank to its own rate page.
//
// Hand-editing this file would survive exactly one run of the script.

export type RateBand = { min: number; max: number } | null;

/** The five tenure bands BB publishes, in the order they appear in `fd`. */
export const FD_TENURES = [
  "3 to <6 months",
  "6 months to <1 year",
  "1 to <2 years",
  "2 to <3 years",
  "3 years and above",
] as const;

export interface GeneratedBankRate {
  /** The bank's name as Bangladesh Bank abbreviates it in the chart. */
  code: string;
  group: "state" | "specialised" | "private" | "foreign";
  savings: RateBand;
  /** Five bands, aligned to FD_TENURES. null = the bank filed nothing. */
  fd: RateBand[];
}

/** As BB prints it: "August, 2026". */
export const RATES_MONTH = "August, 2026";
/** Sortable, for staleness maths. */
export const RATES_MONTH_STAMP = "2026-08";
export const RATES_SOURCE = "https://www.bb.org.bd/en/index.php/financialactivity/interestdeposit";

export const GENERATED_BANK_RATES: GeneratedBankRate[] = [
  { code: "AGRANI", group: "state", savings: { min: 3, max: 3 }, fd: [{ min: 8.5, max: 8.5 }, { min: 8.62, max: 8.62 }, { min: 8.5, max: 8.5 }, { min: 8.5, max: 8.5 }, { min: 6.25, max: 6.25 }] },
  { code: "BASIC", group: "state", savings: { min: 3.5, max: 4.5 }, fd: [{ min: 7, max: 9.25 }, { min: 7.25, max: 10 }, { min: 7.5, max: 9.75 }, { min: 7.5, max: 9.5 }, { min: 7.5, max: 10.67 }] },
  { code: "BDBL", group: "state", savings: { min: 5, max: 5 }, fd: [{ min: 8.5, max: 9 }, { min: 8.75, max: 9.25 }, { min: 9, max: 9.5 }, null, null] },
  { code: "JANATA", group: "state", savings: { min: 2.75, max: 2.75 }, fd: [{ min: 8.5, max: 8.5 }, { min: 8.75, max: 8.75 }, { min: 9, max: 9 }, null, null] },
  { code: "RUPALI", group: "state", savings: { min: 3, max: 3.5 }, fd: [{ min: 8.25, max: 8.25 }, { min: 8.5, max: 8.5 }, { min: 8.75, max: 8.75 }, { min: 8.75, max: 8.75 }, { min: 9, max: 10.82 }] },
  { code: "SONALI", group: "state", savings: { min: 2.79, max: 2.79 }, fd: [{ min: 6.2, max: 6.2 }, { min: 6.75, max: 6.75 }, { min: 7.1, max: 7.1 }, { min: 7.32, max: 7.32 }, { min: 7.32, max: 7.32 }] },
  { code: "BKB", group: "specialised", savings: { min: 4.5, max: 4.5 }, fd: [{ min: 7, max: 9.25 }, { min: 8.5, max: 9.25 }, { min: 8.75, max: 9.25 }, { min: 9.25, max: 9.25 }, null] },
  { code: "PKB", group: "specialised", savings: { min: 3, max: 3.5 }, fd: [null, null, { min: 5.75, max: 7.5 }, null, { min: 5.67, max: 5.67 }] },
  { code: "RAKUB", group: "specialised", savings: { min: 3, max: 4 }, fd: [{ min: 8.25, max: 8.25 }, { min: 8.5, max: 8.5 }, { min: 8.75, max: 8.75 }, { min: 9, max: 9 }, { min: 9.06, max: 11.39 }] },
  { code: "AB-BANK", group: "private", savings: { min: 3.25, max: 3.25 }, fd: [{ min: 12, max: 12 }, { min: 12, max: 12 }, { min: 12, max: 12 }, { min: 12, max: 12 }, null] },
  { code: "AL-ARAFAH", group: "private", savings: { min: 2, max: 7 }, fd: [{ min: 10, max: 10.5 }, { min: 10, max: 10 }, { min: 10, max: 10.25 }, { min: 10.25, max: 10.5 }, { min: 10.5, max: 10.5 }] },
  { code: "BANK ASIA", group: "private", savings: { min: 4.6, max: 4.6 }, fd: [{ min: 4, max: 7.5 }, { min: 7.45, max: 7.75 }, { min: 7.53, max: 7.62 }, { min: 7.62, max: 7.62 }, { min: 7.62, max: 7.62 }] },
  { code: "BCBL", group: "private", savings: { min: 3.25, max: 3.5 }, fd: [{ min: 9.5, max: 9.5 }, { min: 10, max: 10 }, { min: 11, max: 11 }, null, null] },
  { code: "Bengal", group: "private", savings: { min: 2.5, max: 3.25 }, fd: [{ min: 9.75, max: 10 }, { min: 9.75, max: 10 }, { min: 9.75, max: 10 }, { min: 9.75, max: 10 }, { min: 9.75, max: 10 }] },
  { code: "BRAC", group: "private", savings: { min: 0.5, max: 6 }, fd: [{ min: 8, max: 8.75 }, { min: 8, max: 9.25 }, { min: 8, max: 9.25 }, { min: 7.5, max: 9 }, { min: 7, max: 9 }] },
  { code: "CBBL", group: "private", savings: { min: 1, max: 7.5 }, fd: [{ min: 6.25, max: 10 }, { min: 9.5, max: 10.5 }, { min: 7, max: 10.5 }, { min: 9.75, max: 9.75 }, { min: 9.75, max: 9.75 }] },
  { code: "Citizens", group: "private", savings: { min: 3, max: 7 }, fd: [{ min: 9, max: 11 }, { min: 11, max: 11.5 }, { min: 11.5, max: 11.5 }, null, null] },
  { code: "DHAKA", group: "private", savings: { min: 3.25, max: 3.25 }, fd: [{ min: 6.88, max: 7.5 }, { min: 6.62, max: 7.38 }, { min: 6.75, max: 7.38 }, { min: 7.12, max: 9.25 }, { min: 8.25, max: 10 }] },
  { code: "DUTCH-BANGLA", group: "private", savings: { min: 0.5, max: 3.25 }, fd: [{ min: 7, max: 8 }, { min: 7.1, max: 8.1 }, { min: 7.2, max: 9.5 }, { min: 7.2, max: 9.5 }, { min: 7.2, max: 9.5 }] },
  { code: "EBL", group: "private", savings: { min: 1.75, max: 2 }, fd: [{ min: 5.12, max: 8.25 }, { min: 5.5, max: 8.5 }, { min: 5.47, max: 8.75 }, { min: 3, max: 7.88 }, { min: 3, max: 7.88 }] },
  { code: "EXIM", group: "private", savings: { min: 3, max: 4 }, fd: [{ min: 5, max: 5 }, { min: 5.25, max: 5.25 }, { min: 5.5, max: 5.5 }, { min: 5.75, max: 5.75 }, { min: 6, max: 6 }] },
  { code: "FIRST SECU", group: "private", savings: { min: 3, max: 4 }, fd: [{ min: 5, max: 5 }, { min: 5.25, max: 5.25 }, { min: 5.5, max: 5.5 }, { min: 5.75, max: 5.75 }, { min: 6, max: 6 }] },
  { code: "GIBL", group: "private", savings: { min: 3, max: 4 }, fd: [{ min: 5, max: 5 }, { min: 5.25, max: 5.25 }, { min: 5.5, max: 5.5 }, { min: 5.75, max: 5.75 }, { min: 6, max: 6 }] },
  { code: "ICB", group: "private", savings: { min: 4.5, max: 4.5 }, fd: [{ min: 5.6, max: 12.9 }, { min: 5.6, max: 12.75 }, { min: 5.75, max: 12.5 }, { min: 5.75, max: 9.61 }, { min: 5.75, max: 9.61 }] },
  { code: "IFIC", group: "private", savings: { min: 2, max: 2 }, fd: [{ min: 8.5, max: 9.25 }, { min: 8.5, max: 9.25 }, { min: 8.5, max: 9.25 }, { min: 8.5, max: 9.25 }, { min: 8.5, max: 9.25 }] },
  { code: "ISLAMI", group: "private", savings: { min: 2.5, max: 3.85 }, fd: [{ min: 9.5, max: 9.6 }, { min: 9.8, max: 9.95 }, { min: 10, max: 10 }, { min: 10.2, max: 10.2 }, { min: 10.5, max: 10.5 }] },
  { code: "JAMUNA", group: "private", savings: { min: 2, max: 6 }, fd: [{ min: 7.25, max: 9.9 }, { min: 7.5, max: 9.6 }, { min: 7.75, max: 9.4 }, null, null] },
  { code: "MDBL", group: "private", savings: { min: 2, max: 3.9 }, fd: [{ min: 5.75, max: 9.5 }, { min: 8.35, max: 9.5 }, { min: 7.75, max: 9.25 }, null, null] },
  { code: "MERCANTILE", group: "private", savings: { min: 1.5, max: 8.4 }, fd: [{ min: 8, max: 9 }, { min: 8.5, max: 9.5 }, { min: 9.5, max: 9.75 }, { min: 9.75, max: 9.75 }, { min: 10, max: 10 }] },
  { code: "MGBL", group: "private", savings: { min: 2.5, max: 2.5 }, fd: [{ min: 10, max: 10.2 }, { min: 10, max: 10.2 }, { min: 10.25, max: 10.4 }, { min: 10.25, max: 10.25 }, { min: 9.75, max: 9.75 }] },
  { code: "MMBL", group: "private", savings: { min: 2, max: 4 }, fd: [{ min: 4.5, max: 10 }, { min: 4.75, max: 10 }, { min: 5, max: 6.75 }, null, null] },
  { code: "MUTUAL TRUST", group: "private", savings: { min: 2.5, max: 2.5 }, fd: [{ min: 7.75, max: 8.75 }, { min: 8, max: 9 }, { min: 8, max: 8.5 }, { min: 8, max: 8.5 }, { min: 8, max: 8.5 }] },
  { code: "NBL", group: "private", savings: { min: 1, max: 1 }, fd: [{ min: 7.25, max: 7.75 }, { min: 8, max: 8.5 }, { min: 8.5, max: 8.75 }, { min: 8.5, max: 8.75 }, { min: 8.5, max: 8.75 }] },
  { code: "NCCBL", group: "private", savings: { min: 0.5, max: 2 }, fd: [{ min: 8.5, max: 9.25 }, { min: 8.75, max: 9.5 }, { min: 9, max: 9.75 }, { min: 8.25, max: 9 }, { min: 8.5, max: 9.25 }] },
  { code: "NRBBL", group: "private", savings: { min: 1.5, max: 9.5 }, fd: [{ min: 2.75, max: 8.5 }, { min: 2.75, max: 9 }, { min: 2.75, max: 10.25 }, { min: 3, max: 10.75 }, { min: 3.5, max: 11 }] },
  { code: "NRBCBL", group: "private", savings: { min: 4.71, max: 7.05 }, fd: [{ min: 9.98, max: 9.98 }, { min: 10.28, max: 10.28 }, { min: 10.34, max: 10.34 }, { min: 10, max: 10 }, { min: 10, max: 10 }] },
  { code: "ONE BANK", group: "private", savings: { min: 2.5, max: 5 }, fd: [{ min: 8.25, max: 9 }, { min: 8.5, max: 9 }, { min: 8.5, max: 9.75 }, null, null] },
  { code: "Padma", group: "private", savings: { min: 2.5, max: 2.5 }, fd: [{ min: 2.5, max: 7.5 }, { min: 9, max: 9 }, { min: 9.5, max: 9.5 }, null, null] },
  { code: "PREMIER", group: "private", savings: { min: 2.5, max: 6 }, fd: [{ min: 9, max: 10.25 }, { min: 9, max: 10.5 }, { min: 8.5, max: 10.6 }, { min: 5, max: 7 }, { min: 5, max: 7 }] },
  { code: "PRIME", group: "private", savings: { min: 9, max: 9 }, fd: [{ min: 4.5, max: 8.38 }, { min: 4.5, max: 8.68 }, { min: 4.5, max: 8.75 }, { min: 4.5, max: 8.25 }, { min: 4.5, max: 7.25 }] },
  { code: "PUBALI", group: "private", savings: { min: 2.5, max: 2.5 }, fd: [{ min: 8, max: 8 }, { min: 8.25, max: 8.25 }, { min: 8.5, max: 8.5 }, { min: 8.5, max: 8.5 }, { min: 8.28, max: 9.25 }] },
  { code: "SBACBL", group: "private", savings: { min: 2.5, max: 5.5 }, fd: [{ min: 5.5, max: 12.5 }, { min: 5.5, max: 12.25 }, { min: 5.5, max: 12.5 }, { min: 5.5, max: 12.5 }, { min: 5.5, max: 12.5 }] },
  { code: "SHAHJALAL", group: "private", savings: { min: 2, max: 4.5 }, fd: [{ min: 5, max: 8.6 }, { min: 5, max: 7.5 }, { min: 5, max: 8.75 }, { min: 5, max: 8.25 }, { min: 5, max: 8.25 }] },
  { code: "SHIMANTO", group: "private", savings: { min: 2, max: 10.5 }, fd: [{ min: 5.5, max: 9.5 }, { min: 5.5, max: 10 }, { min: 6, max: 10.5 }, { min: 8.5, max: 9 }, { min: 7.5, max: 8.25 }] },
  { code: "SIBL", group: "private", savings: { min: 3, max: 4 }, fd: [{ min: 4.5, max: 5 }, { min: 5.25, max: 5.25 }, { min: 5.5, max: 5.5 }, { min: 5.75, max: 5.75 }, { min: 6, max: 6 }] },
  { code: "SOUTHEAST", group: "private", savings: { min: 1.25, max: 1.75 }, fd: [{ min: 5.25, max: 9.5 }, { min: 5.25, max: 9.75 }, { min: 5.5, max: 9.75 }, { min: 7.25, max: 10 }, { min: 7.25, max: 10 }] },
  { code: "STANDARD", group: "private", savings: { min: 2, max: 2 }, fd: [{ min: 4.25, max: 8.5 }, { min: 6.33, max: 10 }, { min: 10.5, max: 10.5 }, { min: 5.5, max: 6.33 }, null] },
  { code: "THE CITY", group: "private", savings: { min: 0.04, max: 2.02 }, fd: [{ min: 2.65, max: 8.35 }, { min: 3.73, max: 8.35 }, { min: 3.64, max: 8.47 }, { min: 5.7, max: 8.38 }, { min: 5.47, max: 8.38 }] },
  { code: "TRUST BANK", group: "private", savings: { min: 1.25, max: 3.25 }, fd: [{ min: 3, max: 8.5 }, { min: 7.75, max: 8.5 }, { min: 7.88, max: 8.5 }, { min: 7.88, max: 8.5 }, { min: 7.88, max: 8.5 }] },
  { code: "UCBL", group: "private", savings: { min: 5, max: 5 }, fd: [{ min: 3.75, max: 9.75 }, { min: 3.75, max: 9.5 }, { min: 4, max: 10.25 }, { min: 4.5, max: 10.25 }, { min: 4.5, max: 8.25 }] },
  { code: "UNBL", group: "private", savings: { min: 3, max: 4 }, fd: [{ min: 4.5, max: 5 }, { min: 5.25, max: 5.25 }, { min: 5.5, max: 5.5 }, { min: 5.75, max: 5.75 }, { min: 6, max: 6 }] },
  { code: "UTTARA", group: "private", savings: { min: 4.25, max: 4.25 }, fd: [{ min: 9, max: 9.5 }, { min: 9.25, max: 9.5 }, { min: 9.25, max: 9.5 }, { min: 9.25, max: 9.5 }, { min: 9.25, max: 9.5 }] },
  { code: "AL FALAH", group: "foreign", savings: { min: 9.5, max: 9.5 }, fd: [{ min: 1.75, max: 10.5 }, { min: 1.25, max: 10.5 }, { min: 1.75, max: 10.5 }, { min: 2, max: 2 }, { min: 2, max: 2 }] },
  { code: "CITI N.A.", group: "foreign", savings: { min: 0.75, max: 5 }, fd: [{ min: 8.25, max: 8.5 }, { min: 8, max: 8 }, { min: 0.1, max: 0.1 }, null, null] },
  { code: "COMMERCIAL B.", group: "foreign", savings: { min: 6, max: 6 }, fd: [{ min: 5, max: 9 }, { min: 5.25, max: 9 }, { min: 5.12, max: 8.5 }, { min: 6.44, max: 7.24 }, { min: 6.34, max: 8.46 }] },
  { code: "HABIB", group: "foreign", savings: { min: 1, max: 1 }, fd: [{ min: 7, max: 9.75 }, { min: 9, max: 10 }, { min: 10, max: 10 }, { min: 7, max: 7 }, { min: 9, max: 9 }] },
  { code: "HSBC", group: "foreign", savings: { min: 0.25, max: 6 }, fd: [{ min: 0.2, max: 8.75 }, { min: 0.3, max: 9 }, { min: 0.3, max: 8.75 }, { min: 0.3, max: 6 }, { min: 0.3, max: 6 }] },
  { code: "NBP", group: "foreign", savings: { min: 4.5, max: 4.5 }, fd: [{ min: 5.75, max: 5.75 }, { min: 5.75, max: 5.75 }, { min: 5.75, max: 8 }, { min: 6, max: 8.5 }, { min: 6.5, max: 9 }] },
  { code: "SBI", group: "foreign", savings: { min: 2, max: 3 }, fd: [{ min: 4, max: 9.5 }, { min: 5, max: 9 }, { min: 5, max: 7.25 }, { min: 5, max: 7.25 }, { min: 5, max: 7.35 }] },
  { code: "STAN.CHART", group: "foreign", savings: { min: 0.05, max: 4 }, fd: [{ min: 0.05, max: 3.25 }, { min: 0.05, max: 4.38 }, { min: 1.02, max: 3.5 }, { min: 1.02, max: 3 }, { min: 2.02, max: 4 }] },
  { code: "WOORI", group: "foreign", savings: { min: 0.5, max: 3.5 }, fd: [{ min: 1.25, max: 7 }, { min: 1.5, max: 7 }, { min: 1.75, max: 4.5 }, { min: 3, max: 5 }, { min: 3, max: 6 }] },
];
