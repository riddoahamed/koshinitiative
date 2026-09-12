// ── The small print, written down once ───────────────────────────────────────
//
// Everything on this page that is a RULE rather than a RATE. Deposit
// protection, tax, what a filed rate actually entitles you to.
//
// It lives in a data file and not in the JSX for one reason: the same sentences
// have to appear on the app page, on its FAQ, and on the public web page, and
// three hand-typed copies of a tax rate is how two of them end up wrong. When
// the Finance Act moves a number, it moves here.
//
// ── THE RULE FOR THIS FILE ──────────────────────────────────────────────────
// Every entry carries a source and the date it was checked. No exceptions, and
// no "everybody knows" — the reason this page is worth building is that most of
// what circulates about FDR rules in Bangladesh is somebody's half-remembered
// branch conversation.

export interface FineFact {
  id: string;
  label: string;
  /** One sentence. It has to survive being read at 11px. */
  body: string;
  source: { name: string; url: string };
  /** ISO date this was last read from the source. */
  checkedOn: string;
}

export const FINE_PRINT: FineFact[] = [
  {
    id: "insurance",
    label: "Deposit protection",
    body:
      "If a bank fails, the Deposit Protection Act 2026 covers up to ৳2,00,000 per depositor per bank — the whole balance for most people, and a fraction of a large FDR. Cover is per bank, not per account, so three accounts at one bank share one ceiling.",
    source: {
      name: "Bangladesh Bank — Deposit Insurance Department",
      url: "https://www.bb.org.bd/en/index.php/about/deptdtl/53",
    },
    checkedOn: "2026-09-12",
  },
  {
    id: "tax",
    label: "Tax on the interest",
    body:
      "Interest is taxed at source before it reaches you: 10% if the bank holds your 12-digit TIN, 15% if it does not. Registering a TIN with your bank is the cheapest 5 percentage points available on this page.",
    source: {
      name: "NBR guidance, reported by New Age",
      url: "https://www.newagebd.net/article/97779/nbr-asks-banks-to-properly-deduct-tax-on-interest-income",
    },
    checkedOn: "2026-09-12",
  },
  {
    id: "excise",
    label: "Excise duty",
    body:
      "A yearly excise duty is charged on bank balances. From 1 July 2026 the exemption threshold rose to ৳4,00,000, so smaller accounts pay nothing; above that it steps up with the highest balance you held during the year.",
    source: {
      name: "Finance Act 2026 briefing",
      url: "https://tnp.legal/blogs/finance-act-2026-bangladesh-tax-changes-explained",
    },
    checkedOn: "2026-09-12",
  },
  {
    id: "announced",
    label: "What an announced rate is",
    body:
      "Banks must file their announced deposit rates with Bangladesh Bank each month, and that filing is what this page shows. A bank can move its rate between filings, and what you are offered at the counter depends on the amount, the branch and the day.",
    source: {
      name: "Bangladesh Bank — announced deposit rate chart",
      url: "https://www.bb.org.bd/en/index.php/financialactivity/interestdeposit",
    },
    checkedOn: "2026-09-12",
  },
  {
    id: "islamic",
    label: "Islamic banks pay profit, not interest",
    body:
      "A Shariah-compliant bank files a provisional profit rate. It is a declaration of intent, adjusted after the bank's own income is worked out, so the final rate can land above or below the number it announced.",
    source: {
      name: "Islami Bank Bangladesh — profit rates on deposits",
      url: "https://islamibankbd.com/profit-rates-on-deposits",
    },
    checkedOn: "2026-09-12",
  },
  {
    id: "breaking",
    label: "Breaking it early",
    body:
      "Encashing before maturity usually drops you to the savings rate or the rate for the period you actually completed, and some banks add a charge. A high headline rate on a 3-year FDR is worth little if the money is needed in year one.",
    source: {
      name: "Bangladesh Bank — announced deposit rate chart",
      url: "https://www.bb.org.bd/en/index.php/financialactivity/interestdeposit",
    },
    checkedOn: "2026-09-12",
  },
];

export interface Faq {
  q: string;
  /** Paragraphs. Plain sentences — this is the page people arrive at scared. */
  a: string[];
}

export const FDR_FAQS: Faq[] = [
  {
    q: "Where do these rates come from?",
    a: [
      "Every scheduled bank in Bangladesh has to file the deposit rates it is announcing with Bangladesh Bank, and the central bank republishes all of them together as one chart each month. This page is that chart, read automatically, with each bank's own rate page linked beside it.",
      "So these are not rates we collected by ringing around branches, and not anyone's estimate. They are what each bank told the regulator it was paying, for the month shown at the top of the page.",
    ],
  },
  {
    q: "Will I actually get this rate if I walk into the branch?",
    a: [
      "Not necessarily. An announced rate is the bank's published position, not a quote. What you are offered depends on how much you are depositing, how long for, whether you already bank there, and in practice which branch you are standing in.",
      "Large deposits are frequently priced individually, and banks run campaign rates that never appear in a filing. Treat this page as the shortlist, and the bank's own page or a phone call as the quote.",
    ],
  },
  {
    q: "Why do some banks show a range instead of one rate?",
    a: [
      "Because that is what they filed. A bank that writes 7.00–9.25% for one-year deposits is telling the regulator that its rate varies across products and deposit sizes within that band.",
      "We sort the table by the top of each band, and always print the whole band, so a wide range is visible as a wide range rather than hidden behind its best number.",
    ],
  },
  {
    q: "Is a higher rate riskier?",
    a: [
      "Not automatically, but the spread is not random either. Banks pay up for deposits when they need funding, and a bank that consistently pays several points above the market is telling you something about its position.",
      "Deposit protection covers ৳2,00,000 per depositor per bank. Below that ceiling the rate is close to a free choice; above it, the bank's own health is your risk, not the state's. Splitting a large sum across banks is the standard answer, and it costs nothing but paperwork.",
    ],
  },
  {
    q: "What will I actually receive after tax?",
    a: [
      "Interest is taxed at source: 10% if your bank holds your TIN, 15% if it does not. A ৳5,00,000 deposit at 10% earns ৳50,000 a year gross and ৳45,000 after tax with a TIN — ৳42,500 without one.",
      "Excise duty is charged yearly on the balance, with nothing due below ৳4,00,000 from 1 July 2026.",
    ],
  },
  {
    q: "What is the difference between an interest rate and a profit rate?",
    a: [
      "Islamic banks do not pay interest. You enter a Mudaraba arrangement where your deposit is invested and you take a share of what it earns, so the bank announces a provisional profit rate and settles the final figure afterwards.",
      "In practice the announced profit rates sit in the same range as conventional interest rates, but the number is provisional in a way an interest rate is not — it can be adjusted up or down when the bank's income is worked out.",
    ],
  },
  {
    q: "How often is this page updated?",
    a: [
      "Bangladesh Bank publishes the chart monthly and this page follows it automatically. The month shown at the top is the month BB stamped on the chart, not the day we last looked — so if the chart stops moving, the page visibly ages instead of pretending to be current.",
      "Banks change rates between filings. That is the one thing a monthly chart can never keep up with, which is why every row links to the bank's own page.",
    ],
  },
  {
    q: "What do I need to actually open one?",
    a: [
      "An account at the bank, and the paperwork that goes with opening one: your NID, photographs, and your nominee's NID and photograph. Most banks will open the FDR the same day once the account exists.",
      "Bring your TIN if you have one. It is the difference between 10% and 15% tax on every taka of interest, for the life of the deposit, and it is the one part of this a customer controls.",
      "Requirements vary by bank and by how much you are depositing — large deposits attract more source-of-funds questions. Check the bank's own page, linked beside its name, before you go.",
    ],
  },
  {
    q: "Does Kosh get paid by any of these banks?",
    a: [
      "No. There are no sponsored placements, no affiliate links and no paid ordering on this page. The table is sorted by rate, and every bank that files with Bangladesh Bank is in it — including the ones paying the least.",
    ],
  },
];
