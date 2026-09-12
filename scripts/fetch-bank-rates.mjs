#!/usr/bin/env node
// ── The FDR rate table, read from the central bank ───────────────────────────
//
//   npm run rates
//
// Every scheduled bank in Bangladesh must file its announced deposit rates with
// Bangladesh Bank, and BB republishes them as one chart, per month, per bank,
// broken down by tenure. That chart is the only free, authoritative, machine-
// readable per-bank deposit rate source that exists for this country.
//
// ── WHY THIS REPLACED "TYPE THEM IN BY HAND" ────────────────────────────────
// src/data/bankRates.ts used to ship empty on the reasoning that there is no
// free machine-readable source and inventing numbers is worse than showing
// none. The first half of that was wrong — this page has existed the whole
// time. The second half still stands, and this script is built around it:
// it will refuse to write anything it could not read.
//
// ── WHAT IT WILL NOT DO ─────────────────────────────────────────────────────
// It never writes a partial table. A layout change that drops half the banks
// would otherwise look exactly like half the banks withdrawing their rates,
// and the page would quietly report a market that does not exist. If the parse
// comes back short, or the month cannot be read, or the table loses more banks
// than a reshuffle could explain, it exits 1 and leaves the last good file
// alone. A red build is a worse morning than a silent lie is a year.
//
// ── FRESHNESS IS BB'S OWN STAMP, NOT OUR CLOCK ──────────────────────────────
// The generated file carries the month BB printed on the chart, not the day we
// fetched it. If BB stops publishing, the page ages visibly and says so,
// instead of looking current because a cron ran.
//
// EXIT CODES: 0 wrote (or nothing to write), 1 could not read it.

import { readFileSync, writeFileSync } from "node:fs";

const CHART = "https://www.bb.org.bd/en/index.php/financialactivity/interestdeposit";
const OUT = new URL("../src/v2/fdr/rates.generated.ts", import.meta.url);

// ── The floor ───────────────────────────────────────────────────────────────
// 61 banks filed in August 2026. Banks merge and licences get pulled, so this
// is deliberately well below the real count — it is a "the parse broke" alarm,
// not a "the sector shrank" one.
const MIN_BANKS = 40;

const GROUPS = {
  SCBs: "state",
  DFIs: "specialised",
  PCBs: "private",
  FBs: "foreign",
};

/** BB prints "August, 2026". We keep both the label and a sortable stamp. */
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

function monthStamp(label) {
  const m = /^\s*([A-Za-z]+)\s*,\s*(\d{4})\s*$/.exec(label);
  if (!m) return null;
  const idx = MONTHS.indexOf(m[1].toLowerCase());
  if (idx < 0) return null;
  return `${m[2]}-${String(idx + 1).padStart(2, "0")}`;
}

const text = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();

/**
 * A published cell is "8.50", "7.00-9.25", or empty.
 *
 * Empty is a real answer — several banks file nothing for the long tenures —
 * and it has to survive as null all the way to the UI, which renders a dash.
 * Coercing it to 0 would sort those banks to the bottom of a "worst rate"
 * list they never entered.
 */
function parseCell(raw) {
  const s = raw.replace(/%/g, "").replace(/\s/g, "");
  if (!s || s === "-" || s === "--") return null;
  const nums = [...s.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  if (!nums.length || nums.some((n) => !Number.isFinite(n))) return null;
  // A rate outside 0–30% is a misread column, not a bank paying 300%.
  if (nums.some((n) => n < 0 || n > 30)) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return { min, max };
}

async function fetchChart() {
  // ── The .gov.bd certificate trap ──────────────────────────────────────────
  // bb.org.bd serves a shared multi-tenant government certificate that omits
  // its intermediate CA. macOS curl and browsers recover by fetching the
  // intermediate from the cert's AIA extension; most Linux runtimes do not, so
  // this fetch can succeed on a laptop and fail only on CI. See
  // supabase/functions/_shared/bdGovCa.ts, which solved the same problem for
  // the edge functions by bundling the Sectigo intermediate.
  //
  // Node cannot be handed an extra CA at the fetch() call, so the workflow
  // passes it through NODE_EXTRA_CA_CERTS instead. If this throws on CI and
  // works locally, that env var is what is missing — never reach for
  // NODE_TLS_REJECT_UNAUTHORIZED, which turns a verified read of a rate table
  // into an unverified one.
  const res = await fetch(CHART, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; KoshRates/1.0; +https://koshbd.com)" },
    signal: AbortSignal.timeout(60_000),
  });
  if (!res.ok) throw new Error(`Bangladesh Bank returned HTTP ${res.status}`);
  return res.text();
}

function parseChart(html) {
  const table = /<table[\s\S]*?<\/table>/i.exec(html)?.[0];
  if (!table) throw new Error("No table on the page — the chart moved or the layout changed.");

  let month = null;
  let group = null;
  const banks = [];

  for (const row of table.match(/<tr[\s\S]*?<\/tr>/gi) ?? []) {
    const cells = (row.match(/<t[dh][\s\S]*?<\/t[dh]>/gi) ?? []).map((c) => text(c));

    // A lone cell is either the month stamp or a section heading. BB prints
    // both as full-width rows, which is how we tell the sections apart.
    if (cells.length === 1) {
      const only = cells[0];
      if (GROUPS[only]) group = GROUPS[only];
      else if (monthStamp(only)) month = only;
      continue;
    }

    // name + savings + 5 SND tiers + 5 fixed-deposit tenures.
    if (cells.length !== 12) continue;
    const [name, savings, ...rest] = cells;
    if (!name || /name of the bank/i.test(name)) continue;

    banks.push({
      code: name,
      group: group ?? "private",
      savings: parseCell(savings),
      // rest[0..4] are the SND tiers, which are a corporate product; the five
      // fixed-deposit tenures are rest[5..9] and they are what this page is for.
      fd: rest.slice(5, 10).map(parseCell),
    });
  }

  if (!month) throw new Error("Could not read the month off the chart.");
  if (banks.length < MIN_BANKS) {
    throw new Error(`Only ${banks.length} banks parsed (floor is ${MIN_BANKS}). Refusing to write a partial table.`);
  }
  return { month, monthStamp: monthStamp(month), banks };
}

/** What is on disk now, so we can refuse a suspicious shrink and skip no-ops. */
function previous() {
  try {
    const src = readFileSync(OUT, "utf8");
    const stamp = /RATES_MONTH_STAMP = "([\d-]+)"/.exec(src)?.[1] ?? null;
    const count = (src.match(/\{ code:/g) ?? []).length;
    return { stamp, count };
  } catch {
    return { stamp: null, count: 0 };
  }
}

const cell = (c) => (c ? `{ min: ${c.min}, max: ${c.max} }` : "null");

function render({ month, monthStamp: stamp, banks }) {
  const rows = banks
    .map(
      (b) =>
        `  { code: ${JSON.stringify(b.code)}, group: ${JSON.stringify(b.group)}, savings: ${cell(b.savings)}, fd: [${b.fd.map(cell).join(", ")}] },`,
    )
    .join("\n");

  return `// ── GENERATED — do not hand-edit ─────────────────────────────────────────────
// Written by scripts/fetch-bank-rates.mjs from the Bangladesh Bank announced
// interest rate chart for scheduled banks (deposit rate):
//   ${CHART}
//
// Every scheduled bank files its announced deposit rates with the central bank
// and BB republishes them monthly. These are those filings, unedited — not a
// reading of ${banks.length} separate bank websites, and not anybody's estimate.
//
// A rate here is what the bank ANNOUNCED for ${month}. Banks move rates between
// filings, run unlisted campaign rates, and quote differently on large or
// long deposits. The UI says so, and links every bank to its own rate page.
//
// Hand-editing this file would survive exactly one run of the script.

export type RateBand = { min: number; max: number } | null;

/** The five tenure bands BB publishes, in the order they appear in \`fd\`. */
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

/** As BB prints it: "${month}". */
export const RATES_MONTH = ${JSON.stringify(month)};
/** Sortable, for staleness maths. */
export const RATES_MONTH_STAMP = ${JSON.stringify(stamp)};
export const RATES_SOURCE = ${JSON.stringify(CHART)};

export const GENERATED_BANK_RATES: GeneratedBankRate[] = [
${rows}
];
`;
}

// ── Run ─────────────────────────────────────────────────────────────────────
const dry = process.argv.includes("--dry");
console.log(`\nKosh · bank deposit rates from Bangladesh Bank\n`);

let parsed;
try {
  parsed = parseChart(await fetchChart());
} catch (err) {
  console.error(`  FAILED  ${err.message}\n`);
  console.error(`  Nothing was written. The page keeps the last good table and`);
  console.error(`  shows how old it is, which is the correct failure.\n`);
  process.exit(1);
}

const prev = previous();
console.log(`  ${parsed.banks.length} banks · ${parsed.month}`);
if (prev.stamp) console.log(`  on disk: ${prev.count} banks · ${prev.stamp}`);

// A reshuffle can lose a bank or two to a merger. Losing a quarter of them is
// a layout change we have not noticed yet.
if (prev.count && parsed.banks.length < prev.count * 0.75) {
  console.error(`\n  FAILED  ${parsed.banks.length} banks is far short of the ${prev.count} we had.`);
  console.error(`  Refusing to overwrite. Check the chart by hand.\n`);
  process.exit(1);
}

if (parsed.monthStamp && prev.stamp && parsed.monthStamp < prev.stamp) {
  console.error(`\n  FAILED  BB is showing ${parsed.month}, older than the ${prev.stamp} on disk.\n`);
  process.exit(1);
}

if (dry) {
  console.log(`\n  --dry: not writing.\n`);
  process.exit(0);
}

writeFileSync(OUT, render(parsed));
console.log(
  parsed.monthStamp === prev.stamp
    ? `\n  Rewrote the same month (${parsed.month}) — banks amend filings mid-month.\n`
    : `\n  Updated to ${parsed.month}.\n`,
);
