// ── What a machine gets when it asks for /fdr-rates ──────────────────────────
//
// koshbd.com is a single-page app: every dot-less path is rewritten to
// index.html and React draws the page in the browser. That is invisible to a
// reader and fatal to everything that does not run JavaScript.
//
// MEASURED, 12 Sep 2026: a request with GPTBot's user agent returned 13,777
// bytes containing 1,569 characters of visible text — all of it the HOMEPAGE
// description — and not one rate, not one bank name. ChatGPT, Claude and
// Perplexity could not cite this page because they could not see it. Every
// other thing anybody does for "AI visibility" is downstream of that.
//
// So this module renders the page's OWN DATA as plain server-side HTML for
// clients that cannot run the app.
//
// ── THIS IS NOT CLOAKING, AND THE DIFFERENCE MATTERS ────────────────────────
// Cloaking is showing machines something DIFFERENT from what people get. Every
// figure below is generated from the same bankRates data the React page
// renders, from the same file, at the same moment. A machine gets the same
// table a reader gets, minus the interactivity it cannot use anyway. If the
// two ever diverge, that is a bug in this file, not a strategy.
//
// ── WHY IT IS WORTH THE TROUBLE ─────────────────────────────────────────────
// A language model answering "which bank has the highest FDR rate in
// Bangladesh" has to get that number from somewhere. Today it gets it from
// blog posts quoting 2024 rates with no source. We have the central bank's
// own monthly filing, the month stamp, and a link to every bank's own page —
// the most citable version of this answer that exists in this country. It was
// simply unreadable.

import { BANKS, opensToIndividuals, type BankProfile } from "./banks";
import {
  DEFAULT_TENURE,
  FDR_ROWS,
  FD_TENURES,
  RATES_MONTH,
  RATES_MONTH_STAMP,
  RATES_SOURCE,
  TENURE_SHORT,
  bandAt,
  formatBand,
  marketBand,
  topRate,
  type FdrRow,
} from "./rates";
import { FDR_FAQS, FINE_PRINT } from "./facts";
import { rateCardFor } from "./rateCards";

const SITE = "https://www.koshbd.com";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Banks an individual can actually open a deposit at, best rate first. */
function retailRows(): FdrRow[] {
  return FDR_ROWS.filter((r) => opensToIndividuals(r.bank))
    .filter((r) => topRate(r, DEFAULT_TENURE) != null)
    .sort((a, b) => topRate(b, DEFAULT_TENURE)! - topRate(a, DEFAULT_TENURE)!);
}

/**
 * The answer to the question people actually type, in one sentence.
 *
 * "Start each section with a direct answer" is the single most repeated piece
 * of advice for being quoted by a language model, and it happens to be good
 * writing anyway. This is the sentence we would want lifted verbatim — so it
 * carries the number, the bank, the month, the source and the caveat, and it
 * is built from the data rather than typed.
 */
export function leadAnswer(): string {
  const rows = retailRows();
  const best = rows[0];
  const band = marketBand(DEFAULT_TENURE, "top", rows);
  if (!best || !band) return "";
  const bestBand = bandAt(best, DEFAULT_TENURE)!;
  const ranged =
    bestBand.min !== bestBand.max
      ? ` ${best.bank.name} files a range of ${formatBand(bestBand)}, so the top of it generally needs a very large deposit;`
      : "";
  return (
    `The highest announced one-to-two year FDR rate in Bangladesh for ${RATES_MONTH} is ` +
    `${bestBand.max.toFixed(2)}% at ${best.bank.name}, among the ${rows.length} banks an individual can open a ` +
    `fixed deposit at.${ranged} most banks pay between ${band.typicalLow.toFixed(2)}% and ` +
    `${band.typicalHigh.toFixed(2)}%. Every figure is the rate the bank itself filed with Bangladesh Bank ` +
    `for ${RATES_MONTH}; banks can change rates at any time, and interest is taxed at source at 10% ` +
    `(15% without a TIN).`
  );
}

/** The full table, as a table, because that is what the question is about. */
function rateTable(rows: FdrRow[]): string {
  const head = [
    "<tr><th>Bank</th><th>Type</th>",
    ...FD_TENURES.map((_, i) => `<th>${esc(TENURE_SHORT[i])}</th>`),
    "</tr>",
  ].join("");
  const body = rows
    .map((r) => {
      const cells = FD_TENURES.map((_, i) => `<td>${esc(formatBand(bandAt(r, i as 0)))}</td>`).join("");
      const kind = r.bank.islamic ? "Islamic" : r.group === "state" ? "State-owned" : "Private";
      return `<tr><td><a href="${SITE}/fdr-rates/${slugFor(r.bank)}">${esc(r.bank.name)}</a></td><td>${kind}</td>${cells}</tr>`;
    })
    .join("\n");
  return `<table><caption>Announced fixed deposit rates, ${esc(RATES_MONTH)} — % per year</caption><thead>${head}</thead><tbody>\n${body}\n</tbody></table>`;
}

/**
 * URL-safe name for a bank's own page.
 *
 * Derived from the BANK'S NAME, not its domain. The first version used the
 * domain and produced /fdr-rates/tblbd for Trust Bank, /fdr-rates/abbl for AB
 * Bank and /fdr-rates/jb for Janata — URLs that match no search anybody types.
 * The whole reason these pages exist is "Trust Bank FDR rate", and the words
 * in the URL are part of that answer.
 *
 * Built from `short` because the legal suffix is noise in a URL: "Trust Bank
 * PLC" and "Trust Bank" are the same search, and nobody types PLC.
 */
export function slugFor(bank: BankProfile): string {
  return bank.short
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function bankBySlug(slug: string): BankProfile | undefined {
  return BANKS.find((b) => slugFor(b) === slug.toLowerCase());
}

// ── Structured data ─────────────────────────────────────────────────────────
// Three types, each earning its place. Dataset because this IS a dataset and
// it is how a machine learns the thing has a source, a licence and a date.
// FAQPage because the questions are real questions with real answers. And
// BreadcrumbList so a per-bank page is understood as part of a table rather
// than as a stray page about a bank.

export function jsonLd(pathname: string): string {
  const rows = retailRows();
  const updated = `${RATES_MONTH_STAMP}-01`;
  const blocks: unknown[] = [
    {
      "@context": "https://schema.org",
      "@type": "Dataset",
      name: `Fixed deposit (FDR) rates of every scheduled bank in Bangladesh — ${RATES_MONTH}`,
      description: leadAnswer(),
      url: `${SITE}/fdr-rates`,
      dateModified: updated,
      temporalCoverage: RATES_MONTH_STAMP,
      isAccessibleForFree: true,
      creativeWorkStatus: "Published",
      keywords: [
        "FDR rate Bangladesh",
        "fixed deposit rate",
        "best FDR rate",
        "highest FDR rate",
        "bank interest rate Bangladesh",
        "এফডিআর রেট",
        "ফিক্সড ডিপোজিট সুদের হার",
      ],
      spatialCoverage: { "@type": "Country", name: "Bangladesh" },
      creator: { "@type": "Organization", name: "Kosh", url: SITE },
      isBasedOn: {
        "@type": "Dataset",
        name: "Announced interest rate chart of scheduled banks (deposit rate)",
        creator: { "@type": "Organization", name: "Bangladesh Bank" },
        url: RATES_SOURCE,
      },
      variableMeasured: FD_TENURES.map((t) => ({
        "@type": "PropertyValue",
        name: `Fixed deposit rate, ${t}`,
        unitText: "percent per annum",
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FDR_FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Kosh", item: SITE },
        { "@type": "ListItem", position: 2, name: "FDR rates", item: `${SITE}/fdr-rates` },
      ],
    },
  ];

  // The table itself as an ItemList, so a model can lift the ranking rather
  // than having to parse prose about it.
  blocks.push({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Banks by one-to-two year FDR rate, ${RATES_MONTH}`,
    numberOfItems: rows.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: rows.slice(0, 25).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${r.bank.name} — ${formatBand(bandAt(r, DEFAULT_TENURE))}`,
      url: `${SITE}/fdr-rates/${slugFor(r.bank)}`,
    })),
  });

  void pathname;
  return blocks
    .map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`)
    .join("\n");
}

// ── The document a machine gets ─────────────────────────────────────────────

/** Bangla terms, because a large share of the searches are in Bangla. */
const BANGLA = `
<section>
<h2>এফডিআর রেট বাংলাদেশ — কোন ব্যাংকে সুদের হার সবচেয়ে বেশি</h2>
<p>বাংলাদেশের প্রতিটি তফসিলি ব্যাংক প্রতি মাসে বাংলাদেশ ব্যাংকে তাদের ঘোষিত আমানতের সুদের হার জমা দেয়। এই পাতায় সেই তালিকাই আছে — ${esc(RATES_MONTH)} মাসের হার, প্রতিটি ব্যাংকের নিজস্ব রেট পেজের লিংকসহ।</p>
<p>মনে রাখবেন: ঘোষিত হার মানেই আপনি সেটাই পাবেন তা নয়। আমানতের পরিমাণ, মেয়াদ এবং আপনি ব্যক্তি না প্রতিষ্ঠান — তার উপর হার নির্ভর করে। সুদের উপর উৎসে কর কাটা হয় ১০% (টিআইএন না থাকলে ১৫%)। ব্যাংক ব্যর্থ হলে প্রতি ব্যাংকে আমানতকারী প্রতি সর্বোচ্চ ২,০০,০০০ টাকা সুরক্ষিত।</p>
</section>`;

export function fdrCrawlerDocument(pathname: string, title: string, description: string): string {
  const rows = retailRows();
  const band = marketBand(DEFAULT_TENURE, "top", rows);
  const withCards = rows.filter((r) => rateCardFor(r.bank.code));

  const faq = FDR_FAQS.map(
    (f) => `<h3>${esc(f.q)}</h3>${f.a.map((p) => `<p>${esc(p)}</p>`).join("")}`,
  ).join("\n");

  const rules = FINE_PRINT.map(
    (f) =>
      `<h3>${esc(f.label)}</h3><p>${esc(f.body)} <a href="${esc(f.source.url)}">${esc(f.source.name)}</a></p>`,
  ).join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}${pathname}">
<link rel="alternate" hreflang="bn-BD" href="${SITE}${pathname}">
<link rel="alternate" hreflang="en" href="${SITE}${pathname}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}${pathname}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta name="twitter:card" content="summary_large_image">
${jsonLd(pathname)}
</head>
<body>
<h1>FDR rates in Bangladesh — every bank, ${esc(RATES_MONTH)}</h1>

<p><strong>${esc(leadAnswer())}</strong></p>

<p>Last updated: ${esc(RATES_MONTH)}. Source:
<a href="${esc(RATES_SOURCE)}">Bangladesh Bank's announced interest rate chart for scheduled banks (deposit rate)</a>.
Published by <a href="${SITE}">Kosh</a>. No bank pays to appear on this page and there are no affiliate links.</p>

<h2>Where most banks sit</h2>
${
  band
    ? `<p>Across ${rows.length} banks an individual can open a deposit at, the middle half pay between
<strong>${band.typicalLow.toFixed(2)}%</strong> and <strong>${band.typicalHigh.toFixed(2)}%</strong> on a one-to-two year
fixed deposit. The best filed ${band.best.toFixed(2)}% and the lowest ${band.lowest.toFixed(2)}%.</p>`
    : ""
}

<h2>Every bank's FDR rate, ${esc(RATES_MONTH)}</h2>
${rateTable(rows)}

<h2>Why a bank shows a range instead of one rate</h2>
<p>A bank files one band per tenure with the central bank, and that band has to cover every deposit it takes
at that term. Banks price a fixed deposit by how much you deposit and by whether you are a person or a company.
Trust Bank, for example, pays an individual 8.00% on a one-year deposit under ৳50 lakh and 9.00% at ৳5 crore and
above, with a separate flat rate for institutions. AB Bank pays an individual 12.00% at one year and an
institution 6.50%. So the bottom of a band is usually the ordinary retail deposit and the top usually needs
crores or a named scheme.</p>
${
  withCards.length
    ? `<p>Kosh has read the published rate card of ${withCards.length} banks directly:
${withCards.map((r) => esc(r.bank.name)).join(", ")}.</p>`
    : ""
}

<h2>Banks that cannot take a retail deposit right now</h2>
<p>Bangladesh Bank still files rates for banks that no longer operate independently. First Security Islami,
Global Islami, Social Islami, EXIM and Union Bank merged into Sammilito Islami Bank in the 2025 consolidation;
Bank Alfalah's Bangladesh business went to Bank Asia; HSBC is winding down its retail banking in Bangladesh;
Citibank N.A. serves institutions only. Those are listed on the page but held back from the default comparison.</p>

<h2>Questions about FDRs in Bangladesh</h2>
${faq}

<h2>The rules that change what a rate is worth</h2>
${rules}
${BANGLA}

<h2>Each bank's own page</h2>
<ul>
${rows.map((r) => `<li><a href="${SITE}/fdr-rates/${slugFor(r.bank)}">${esc(r.bank.name)} FDR rate</a></li>`).join("\n")}
</ul>

<p><a href="${SITE}/fdr-rates">Open the interactive FDR rate table</a> ·
<a href="${SITE}/fdr-rates/faq">FDR questions answered</a></p>
</body>
</html>`;
}

/**
 * Title and description for one bank's rate page.
 *
 * Shared by the unfurler path (ogDocument), the crawler document and the React
 * page, so a link to a bank's page says the same thing wherever it surfaces.
 */
export function fdrBankMeta(pathname: string): { title: string; description: string } | null {
  const slug = pathname.replace(/^\/fdr-rates\/?/, "").replace(/\/$/, "");
  if (!slug || slug === "faq") return null;
  const bank = bankBySlug(slug);
  const row = bank ? FDR_ROWS.find((r) => r.bank.code === bank.code) : undefined;
  if (!bank || !row) return null;
  return {
    title: `${bank.name} FDR rate ${RATES_MONTH.replace(",", "")} — every tenure`,
    description:
      `${bank.name} fixed deposit rates for ${RATES_MONTH}: ` +
      FD_TENURES.map((_, i) => `${TENURE_SHORT[i]} ${formatBand(bandAt(row, i as 0))}`).join(", ") +
      `. From the bank's own filing with Bangladesh Bank, with its rate page linked. No sponsored placements.`,
  };
}

// ── One page per bank ───────────────────────────────────────────────────────
//
// "BRAC Bank FDR rate" and "ইসলামী ব্যাংক এফডিআর রেট" are the searches; a
// single comparison page ranks for none of them well. Sixty-one pages, each
// answering one bank's question directly and linking back to the table, is the
// oldest trick in search and it is only a trick when the pages are empty. These
// are not: each carries that bank's five tenures, its own published card where
// we have read one, what it means for an ordinary deposit, and its status.
//
// Returns null for a path that is not a bank, so the caller can fall back.

export function bankFdrDocument(pathname: string): string | null {
  const slug = pathname.replace(/^\/fdr-rates\/?/, "").replace(/\/$/, "");
  if (!slug || slug === "faq") return null;
  const bank = bankBySlug(slug);
  if (!bank) return null;
  const row = FDR_ROWS.find((r) => r.bank.code === bank.code);
  if (!row) return null;

  const card = rateCardFor(bank.code);
  const headline = bandAt(row, DEFAULT_TENURE);
  const { title, description } = fdrBankMeta(pathname)!;

  const rows = FD_TENURES.map(
    (t, i) => `<tr><td>${esc(t)}</td><td>${esc(formatBand(bandAt(row, i as 0)))}</td></tr>`,
  ).join("");

  const lead =
    `${bank.name}'s announced fixed deposit rate for a one-to-two year deposit is ` +
    `${headline ? formatBand(headline) : "not filed"} for ${RATES_MONTH}, as filed with Bangladesh Bank.` +
    (bank.islamic
      ? ` ${bank.name} is a Shariah-compliant bank, so this is a provisional profit rate rather than interest and can be adjusted after the bank's income is worked out.`
      : "") +
    (bank.since ? ` It has been taking deposits since ${bank.since}.` : "");

  const status = bank.successor
    ? `<h2>Can you open one here?</h2><p><strong>${esc(bank.name)} is now part of ${esc(bank.successor.name)}.</strong>
       Bangladesh Bank still files rates under the old name and the figures here are those filings. An existing
       deposit carries on; ${esc(bank.successor.name)} is who you deal with now.</p>`
    : bank.access === "closing"
      ? `<h2>Can you open one here?</h2><p><strong>${esc(bank.name)} is winding down its retail business</strong> and is not taking new retail customers.</p>`
      : bank.access === "corporate"
        ? `<h2>Can you open one here?</h2><p><strong>${esc(bank.name)} serves companies and institutions in Bangladesh</strong>, not walk-in individuals.</p>`
        : "";

  const own = card
    ? `<h2>${esc(bank.name)}'s own published rate card</h2>
       <p>Read from <a href="${esc(card.source)}">the bank's own page</a> on ${esc(card.readOn)}${
         card.effectiveFrom ? `, effective ${esc(card.effectiveFrom)}` : ""
       }. ${card.note ? esc(card.note) : ""}</p>`
    : "";

  const ld = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${bank.name} Fixed Deposit (FDR)`,
    category: "Fixed deposit",
    provider: { "@type": "BankOrCreditUnion", name: bank.name, url: `https://${bank.domain}` },
    areaServed: { "@type": "Country", name: "Bangladesh" },
    url: `${SITE}/fdr-rates/${slug}`,
    ...(headline
      ? {
          interestRate: {
            "@type": "QuantitativeValue",
            minValue: headline.min,
            maxValue: headline.max,
            unitText: "percent per annum",
          },
        }
      : {}),
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Kosh", item: SITE },
      { "@type": "ListItem", position: 2, name: "FDR rates", item: `${SITE}/fdr-rates` },
      { "@type": "ListItem", position: 3, name: bank.name, item: `${SITE}/fdr-rates/${slug}` },
    ],
  };

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${SITE}/fdr-rates/${slug}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${SITE}/fdr-rates/${slug}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script type="application/ld+json">${JSON.stringify(crumbs)}</script>
</head>
<body>
<h1>${esc(bank.name)} FDR rate — ${esc(RATES_MONTH)}</h1>
<p><strong>${esc(lead)}</strong></p>
${status}
<h2>Every tenure</h2>
<table><caption>${esc(bank.name)} announced fixed deposit rates, ${esc(RATES_MONTH)}</caption>
<thead><tr><th>Tenure</th><th>Rate (% per year)</th></tr></thead><tbody>${rows}</tbody></table>
${own}
<h2>What this means for an ordinary deposit</h2>
<p>These are announced rates, not quotes. A bank prices a fixed deposit by how much you deposit and by whether
you are a person or a company, so a range means the bottom is usually the ordinary retail deposit and the top
usually needs crores or a named scheme. Interest is taxed at source at 10% if the bank holds your TIN and 15%
if it does not, and deposit protection covers ৳2,00,000 per depositor per bank.</p>
<p>Check ${esc(bank.name)}'s own page before acting:
<a href="${esc(bank.rates ?? `https://${bank.domain}/`)}">${esc(bank.rates ? "their rate card" : "their website")}</a>.</p>
<p><a href="${SITE}/fdr-rates">Compare ${esc(bank.name)} against every other bank in Bangladesh</a></p>
</body>
</html>`;
}
