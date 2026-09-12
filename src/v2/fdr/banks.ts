// ── The bank directory ───────────────────────────────────────────────────────
//
// Bangladesh Bank's rate chart identifies banks by a short code it made up for
// the chart — "DUTCH-BANGLA", "FIRST SECU", "STAN.CHART". Nobody banks at a
// string in a government table, so this file turns each one into the bank a
// reader would recognise: its full name, its own website, and the page where it
// publishes its own rates.
//
// ── WHY THE LINKS ARE PINNED HERE AND NOT DISCOVERED AT RUNTIME ─────────────
// Every URL below was fetched and checked once. Several of the obvious guesses
// were wrong in ways that matter — basicbanklimited.com is now basicbankplc.com,
// First Security is fsibplc.com not fsiblbd.com, City Bank answers on
// citybankplc.com rather than thecitybank.com, and bengalcommercialbank.com is
// a parked domain being resold, which is exactly the sort of link you never
// want to hand somebody who is about to move their savings. Checking at build
// time would put that risk back.
//
// ── `rates` VS `site` ───────────────────────────────────────────────────────
// A `rates` link goes to the bank's own rate page or rate PDF. A bank with no
// `rates` entry publishes nothing stable we could find, and the UI links its
// homepage and says so rather than inventing a deep link that 404s. Both are
// honest; a broken deep link is not.
//
// ── AND WHY A FEW CARRY `www.` ──────────────────────────────────────────────
// Five of these banks serve a certificate that does not cover the bare domain,
// so https://onebank.com.bd fails where https://www.onebank.com.bd works. The
// rest are left bare on purpose: `www.` is not decoration, it is there only
// where the bank's own certificate requires it.
//
// Several more (BDBL, National, NCC, RAKUB, Global Islami) serve certificates
// that OMIT their intermediate CA. Those load perfectly in a browser, which
// recovers the intermediate via the certificate's AIA extension, and fail in
// anything that does not — which is why scripts/check-rates.mjs reports a TLS
// error separately from a 404 instead of declaring the link dead.
//
// Re-check these when the rate table is refreshed: `npm run rates:check -- --links`.

export type BankGroup = "state" | "specialised" | "private" | "foreign";

export interface BankProfile {
  /** Exactly as Bangladesh Bank writes it in the chart. The join key. */
  code: string;
  /** What the bank calls itself, and what the branch sign says. */
  name: string;
  /** For the table, where a full legal name would wrap to three lines. */
  short: string;
  /** Logo lookup + the "their site" link. No protocol. */
  domain: string;
  /** The bank's own rate page, when it publishes one we could verify. */
  rates?: string;
  /**
   * What is actually ON that page, checked rather than assumed.
   *
   * "card"    — the bank's own rate table, or its index of dated rate cards.
   * "product" — the FDR product page: terms, minimums, how to open one, but
   *             no rate table. Still the right destination, and the link says
   *             so instead of promising rates that are not there.
   *
   * This exists because the first pass collected any link matching
   * /interest|rate|charge/ and shipped it as "their rate page". Bank Asia's
   * led to a LENDING rate card, Eastern Bank's to the foreign-exchange board,
   * and Standard Islami's to neither. A page whose whole argument is that it
   * links the source cannot send people to the wrong source.
   */
  rateKind?: "card" | "product";
  /**
   * Shariah-compliant bank. It is not a footnote: these banks pay a
   * PROVISIONAL PROFIT RATE, not interest, and the number can move after the
   * fact. A reader filtering for halal deposits is the single most common
   * reason this page gets opened in Bangladesh.
   */
  islamic?: boolean;

  /**
   * Who can actually walk in and open a fixed deposit.
   *
   * This page is read by individuals, and three of the banks Bangladesh Bank
   * files rates for will not open a retail FDR for one. Showing their rates
   * with no mark on them is an invitation to waste an afternoon.
   *
   * "retail"     — an individual can open a deposit. The default.
   * "closing"    — winding its retail business down; no new retail customers.
   * "corporate"  — institutional clients only.
   * "unverified" — a foreign bank whose retail terms we could not confirm.
   *                Said plainly rather than guessed either way.
   */
  access?: "retail" | "closing" | "corporate" | "unverified";

  /**
   * The bank this one has been absorbed into.
   *
   * ── WHY THE ROW STAYS ───────────────────────────────────────────────────
   * Five Islamic banks became Sammilito Islami Bank in the 2025 merger and
   * Bank Alfalah's Bangladesh business went to Bank Asia, yet Bangladesh
   * Bank's August 2026 chart still files rates for all six under their old
   * names, and their websites still answer under their old brands.
   *
   * Deleting them would hide a rate the regulator is still publishing, and
   * leaving them unmarked would send somebody to open an account at a bank
   * that no longer exists. So the row stays, flagged, with the successor
   * named — which is also what a reader holding an existing FDR at First
   * Security actually needs to know.
   */
  successor?: { name: string; since: string; source: string };

  /**
   * Year the bank was established, where it could be verified.
   *
   * Not decoration: "the rate is not the only thing to compare" is easy to
   * say and useless without something else to compare. How long an
   * institution has been taking deposits is the plainest durable fact
   * available for free — Pubali has done it since 1959, Citizens since 2020,
   * and a reader weighing a headline rate deserves to know which is which.
   *
   * Sourced from Wikidata inception dates (P571) and English Wikipedia
   * infoboxes, checked 12 Sep 2026. ABSENT WHERE IT COULD NOT BE VERIFIED —
   * about half the newer private banks — because a made-up founding year
   * beside a real deposit rate is exactly the kind of decoration this page
   * refuses everywhere else.
   */
  since?: number;
}

export const BANKS: BankProfile[] = [
  // ── State-owned commercial ──
  { code: "AGRANI", name: "Agrani Bank PLC", short: "Agrani Bank", domain: "www.agranibank.org", rates: "https://www.agranibank.org/index.php/home/deposits_products/Fixed-Deposit-Account", rateKind: "product", since: 1972 },
  { code: "BASIC", name: "BASIC Bank PLC", short: "BASIC Bank", domain: "basicbankplc.com", since: 1988 },
  { code: "BDBL", name: "Bangladesh Development Bank PLC", short: "Bangladesh Development Bank", domain: "bdbl.com.bd" },
  { code: "JANATA", name: "Janata Bank PLC", short: "Janata Bank", domain: "jb.com.bd", rates: "https://jb.com.bd/products/rate_of_interest", rateKind: "card", since: 1971 },
  { code: "RUPALI", name: "Rupali Bank PLC", short: "Rupali Bank", domain: "rupalibank.com.bd", since: 1972 },
  { code: "SONALI", name: "Sonali Bank PLC", short: "Sonali Bank", domain: "sonalibank.com.bd", rates: "https://www.sonalibank.com.bd/PDF_file/intt_rates.pdf", rateKind: "card", since: 1972 },

  // ── Specialised / development ──
  { code: "BKB", name: "Bangladesh Krishi Bank", short: "Krishi Bank", domain: "krishibank.org.bd", since: 1973 },
  { code: "PKB", name: "Probashi Kallyan Bank", short: "Probashi Kallyan Bank", domain: "pkb.gov.bd", since: 2010 },
  { code: "RAKUB", name: "Rajshahi Krishi Unnayan Bank", short: "RAKUB", domain: "rakub.org.bd" },

  // ── Private commercial ──
  { code: "AB-BANK", name: "AB Bank PLC", short: "AB Bank", domain: "abbl.com", rates: "https://abbl.com/rates-and-charge/fixed-deposit-rates/", rateKind: "card", since: 1981 },
  { code: "AL-ARAFAH", name: "Al-Arafah Islami Bank PLC", short: "Al-Arafah Islami Bank", domain: "aibl.com.bd", islamic: true, rates: "https://www.aibl.com.bd/deposit/mudaraba-term-deposit-mtdr/", rateKind: "product", since: 1995 },
  { code: "BANK ASIA", name: "Bank Asia PLC", short: "Bank Asia", domain: "bankasia-bd.com", since: 1999 },
  { code: "BCBL", name: "Bangladesh Commerce Bank PLC", short: "Bangladesh Commerce Bank", domain: "bcblbd.com", rates: "https://www.bcblbd.com/interest_rates", rateKind: "card" },
  { code: "Bengal", name: "Bengal Commercial Bank PLC", short: "Bengal Commercial Bank", domain: "bgcb.com.bd", rates: "https://www.bgcb.com.bd/fixed-deposit", rateKind: "product" },
  { code: "BRAC", name: "BRAC Bank PLC", short: "BRAC Bank", domain: "bracbank.com", rates: "https://www.bracbank.com/en/page/deposit-interest-rate", rateKind: "card", since: 2001 },
  { code: "CBBL", name: "Community Bank Bangladesh PLC", short: "Community Bank", domain: "communitybankbd.com", rates: "https://www.communitybankbd.com/fdr/", rateKind: "product" },
  { code: "Citizens", name: "Citizens Bank PLC", short: "Citizens Bank", domain: "citizensbankbd.com", rates: "https://citizensbankbd.com/rates/deposit-rate", rateKind: "card", since: 2020 },
  { code: "DHAKA", name: "Dhaka Bank PLC", short: "Dhaka Bank", domain: "dhakabank.com.bd", rates: "https://dhakabank.com.bd/fixed-deposit-receipt-fdr/", rateKind: "product", since: 1995 },
  { code: "DUTCH-BANGLA", name: "Dutch-Bangla Bank PLC", short: "Dutch-Bangla Bank", domain: "dutchbanglabank.com", rates: "https://www.dutchbanglabank.com/depositsadv/term-deposit.html", rateKind: "card" },
  { code: "EBL", name: "Eastern Bank PLC", short: "Eastern Bank", domain: "ebl.com.bd", rates: "https://ebl.com.bd/retail/retail-deposit", rateKind: "card", since: 1992 },
  { code: "EXIM", name: "EXIM Bank PLC", short: "EXIM Bank", domain: "eximbankbd.com", islamic: true, rates: "https://www.eximbankbd.com/deposit/Deposit_Rates", rateKind: "card", successor: { name: "Sammilito Islami Bank PLC", since: "2025-12", source: "https://en.wikipedia.org/wiki/Sammilito_Islami_Bank" } },
  { code: "FIRST SECU", name: "First Security Islami Bank PLC", short: "First Security Islami Bank", domain: "fsibplc.com", islamic: true, rates: "https://fsibplc.com/mudaraba_term_account.php", rateKind: "card", successor: { name: "Sammilito Islami Bank PLC", since: "2025-12", source: "https://en.wikipedia.org/wiki/Sammilito_Islami_Bank" } },
  { code: "GIBL", name: "Global Islami Bank PLC", short: "Global Islami Bank", domain: "globalislamibankbd.com", islamic: true, successor: { name: "Sammilito Islami Bank PLC", since: "2025-12", source: "https://en.wikipedia.org/wiki/Sammilito_Islami_Bank" } },
  { code: "ICB", name: "ICB Islamic Bank PLC", short: "ICB Islamic Bank", domain: "icbislamic-bd.com", islamic: true, rates: "https://icbislamic-bd.com/mudrabah-term-deposit/", rateKind: "product" },
  { code: "IFIC", name: "IFIC Bank PLC", short: "IFIC Bank", domain: "ificbank.com.bd", since: 1976 },
  { code: "ISLAMI", name: "Islami Bank Bangladesh PLC", short: "Islami Bank", domain: "islamibankbd.com", islamic: true, rates: "https://islamibankbd.com/profit-rates-on-deposits", rateKind: "card", since: 1983 },
  { code: "JAMUNA", name: "Jamuna Bank PLC", short: "Jamuna Bank", domain: "jamunabankbd.com", rates: "https://jamunabankbd.com/interest-rates/", rateKind: "card" },
  { code: "MDBL", name: "Midland Bank PLC", short: "Midland Bank", domain: "www.midlandbankbd.net", rates: "https://www.midlandbankbd.net/mdb-digital-fixed-deposit-account/", rateKind: "product" },
  { code: "MERCANTILE", name: "Mercantile Bank PLC", short: "Mercantile Bank", domain: "mblbd.com", rates: "https://mblbd.com/interest-rates", rateKind: "card", since: 1999 },
  { code: "MGBL", name: "Meghna Bank PLC", short: "Meghna Bank", domain: "meghnabank.com.bd", rates: "https://www.meghnabank.com.bd/single/49/retail", rateKind: "product" },
  { code: "MMBL", name: "Modhumoti Bank PLC", short: "Modhumoti Bank", domain: "modhumotibankplc.com", rates: "https://www.modhumotibankplc.com/interest-rate/", rateKind: "card" },
  { code: "MUTUAL TRUST", name: "Mutual Trust Bank PLC", short: "Mutual Trust Bank", domain: "mutualtrustbank.com", rates: "https://www.mutualtrustbank.com/interest-rates/", rateKind: "card", since: 1999 },
  { code: "NBL", name: "National Bank PLC", short: "National Bank", domain: "nblbd.com" },
  { code: "NCCBL", name: "NCC Bank PLC", short: "NCC Bank", domain: "nccbank.com.bd", since: 1985 },
  { code: "NRBBL", name: "NRB Bank PLC", short: "NRB Bank", domain: "nrbbankbd.com", rates: "https://www.nrbbankbd.com/forms-downloads/#interest-rates", rateKind: "card", since: 2013 },
  { code: "NRBCBL", name: "NRBC Bank PLC", short: "NRBC Bank", domain: "nrbcommercialbank.com", rates: "https://www.nrbcommercialbank.com//assets/forms/Declared-Interest-Rate-latest.pdf", rateKind: "card" },
  { code: "ONE BANK", name: "ONE Bank PLC", short: "ONE Bank", domain: "www.onebank.com.bd" },
  { code: "Padma", name: "Padma Bank PLC", short: "Padma Bank", domain: "padmabankbd.com", rates: "https://padmabankbd.com/interst-rate", rateKind: "card" },
  { code: "PREMIER", name: "The Premier Bank PLC", short: "Premier Bank", domain: "thepremierbankplc.com", rates: "https://thepremierbankplc.com/rates-charges/", rateKind: "card", since: 1999 },
  { code: "PRIME", name: "Prime Bank PLC", short: "Prime Bank", domain: "primebank.com.bd", rates: "https://primebank.com.bd/interest-rate", rateKind: "card", since: 1995 },
  { code: "PUBALI", name: "Pubali Bank PLC", short: "Pubali Bank", domain: "pubalibangla.com", since: 1959 },
  { code: "SBACBL", name: "South Bangla Agriculture & Commerce Bank PLC", short: "SBAC Bank", domain: "sbacbank.com" },
  { code: "SHAHJALAL", name: "Shahjalal Islami Bank PLC", short: "Shahjalal Islami Bank", domain: "sjiblbd.com", islamic: true },
  { code: "SHIMANTO", name: "Shimanto Bank PLC", short: "Shimanto Bank", domain: "shimantobank.com", rates: "https://shimantobank.com/interest-rates", rateKind: "card", since: 2016 },
  { code: "SIBL", name: "Social Islami Bank PLC", short: "Social Islami Bank", domain: "siblbd.com", islamic: true, rates: "https://www.siblbd.com/profit-rates", rateKind: "card", successor: { name: "Sammilito Islami Bank PLC", since: "2025-12", source: "https://en.wikipedia.org/wiki/Sammilito_Islami_Bank" } },
  { code: "SOUTHEAST", name: "Southeast Bank PLC", short: "Southeast Bank", domain: "southeastbank.com.bd", rates: "https://southeastbank.com.bd/documents/deposit_rates/All_Deposit_list_of_SEBPLC.pdf", rateKind: "card", since: 1995 },
  { code: "STANDARD", name: "Standard Islami Bank PLC", short: "Standard Islami Bank", domain: "standardbankbd.com", islamic: true, rates: "https://standardbankbd.com/deposit-rate/", rateKind: "product", since: 1988 },
  { code: "THE CITY", name: "City Bank PLC", short: "City Bank", domain: "citybankplc.com" },
  { code: "TRUST BANK", name: "Trust Bank PLC", short: "Trust Bank", domain: "tblbd.com", rates: "https://tblbd.com/rates/", rateKind: "card" },
  { code: "UCBL", name: "United Commercial Bank PLC", short: "UCB", domain: "ucb.com.bd", rates: "https://www.ucb.com.bd/rates/interest-rates/", rateKind: "card" },
  { code: "UNBL", name: "Union Bank PLC", short: "Union Bank", domain: "unionbank.com.bd", islamic: true, rates: "https://www.unionbank.com.bd/deposit/mudaraba-term-deposit-receipt-mtdr", rateKind: "card", successor: { name: "Sammilito Islami Bank PLC", since: "2025-12", source: "https://en.wikipedia.org/wiki/Sammilito_Islami_Bank" } },
  { code: "UTTARA", name: "Uttara Bank PLC", short: "Uttara Bank", domain: "uttarabank-bd.com", rates: "https://www.uttarabank-bd.com/home/interestrate", rateKind: "card" },

  // ── Foreign banks operating in Bangladesh ──
  // Their headline rates look low because most of them are not competing for
  // ordinary retail deposits here at all. Left in because leaving them out
  // would be editing the central bank's table.
  { code: "AL FALAH", name: "Bank Alfalah", short: "Bank Alfalah", domain: "bankalfalah.com", access: "closing", successor: { name: "Bank Asia PLC", since: "2026-03", source: "https://www.tbsnews.net/economy/banking/bank-asia-acquire-bank-alfalah-bangladesh-tk580cr-1396911" } },
  { code: "CITI N.A.", name: "Citibank N.A.", short: "Citibank N.A.", domain: "citigroup.com", rates: "https://www.citigroup.com/rcs/citigpa/akpublic/storage/public/bangladesh_rate_matrix.pdf", rateKind: "card", access: "corporate" },
  { code: "COMMERCIAL B.", name: "Commercial Bank of Ceylon PLC", short: "Commercial Bank of Ceylon", domain: "www.combank.lk" },
  { code: "HABIB", name: "Habib Bank Ltd", short: "Habib Bank", domain: "hbl.com" },
  { code: "HSBC", name: "HSBC Bangladesh", short: "HSBC", domain: "www.hsbc.com.bd", access: "closing" },
  { code: "NBP", name: "National Bank of Pakistan", short: "National Bank of Pakistan", domain: "nbp.com.pk" },
  { code: "SBI", name: "State Bank of India", short: "State Bank of India", domain: "sbibd.com" },
  { code: "STAN.CHART", name: "Standard Chartered Bangladesh", short: "Standard Chartered", domain: "sc.com", rates: "https://www.sc.com/bd/interest-rate-matrix/", rateKind: "card", since: 1948 },
  { code: "WOORI", name: "Woori Bank", short: "Woori Bank", domain: "wooribank.com", access: "unverified" },
];

const BY_CODE = new Map(BANKS.map((b) => [b.code.toUpperCase(), b]));

/** The profile for a Bangladesh Bank chart code, or undefined for a new bank. */
export function bankByCode(code: string): BankProfile | undefined {
  return BY_CODE.get(code.toUpperCase());
}

/**
 * What to call the outbound link, so it promises only what is behind it.
 *
 * "Rate card" and "FDR page" are different promises, and a reader who taps
 * "rate card" and lands on a product brochure has been misled by us, not by
 * the bank.
 */
export function rateLinkLabel(bank: BankProfile): string {
  if (bank.rateKind === "card") return "Their rate card";
  if (bank.rateKind === "product") return "Their FDR page";
  return "Their website";
}

/** Where the link goes: the checked page, or the bank's own front door. */
export function rateLinkUrl(bank: BankProfile): string {
  return bank.rates ?? `https://${bank.domain}/`;
}

/**
 * Can an individual walk in and open a fixed deposit here?
 *
 * The page is read by individuals first. A bank that is corporate-only, is
 * winding its retail business down, or has been absorbed into another bank is
 * not a place a reader can act on today — so it is held back behind a toggle
 * rather than sorted in among banks that will actually take the money.
 */
export function opensToIndividuals(bank: BankProfile): boolean {
  if (bank.successor) return false;
  return bank.access === undefined || bank.access === "retail";
}

/** The one-line reason a bank is held back, or null when it is open. */
export function accessNote(bank: BankProfile): string | null {
  if (bank.successor) return `Now part of ${bank.successor.name}`;
  if (bank.access === "closing") return "Closing its retail business";
  if (bank.access === "corporate") return "Companies and institutions only";
  if (bank.access === "unverified") return "Retail terms unconfirmed";
  return null;
}

/** A short tag for the row, where the full sentence will not fit. */
export function accessTag(bank: BankProfile): string | null {
  if (bank.successor) return "merged";
  if (bank.access === "closing") return "closing";
  if (bank.access === "corporate") return "corporate";
  if (bank.access === "unverified") return "unconfirmed";
  return null;
}

export const GROUP_LABEL: Record<BankGroup, string> = {
  state: "State-owned",
  specialised: "Specialised",
  private: "Private",
  foreign: "Foreign",
};
