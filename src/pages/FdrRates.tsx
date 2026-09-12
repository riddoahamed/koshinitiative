import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ChevronDown } from "lucide-react";

import PageShell from "@/v2/PageShell";
import { PlatformLogo } from "@/v2/PlatformLogo";
import { BANK_LOGOS } from "@/v2/fdr/bankLogos";
import { GROUP_LABEL, accessNote, accessTag, opensToIndividuals, rateLinkLabel, rateLinkUrl, type BankGroup } from "@/v2/fdr/banks";
import {
  DEFAULT_TENURE,
  FDR_ROWS,
  FD_TENURES,
  RATES_MONTH,
  RATES_SOURCE,
  TENURE_SHORT,
  TENURE_MONTHS,
  bandAt,
  fdrSpread,
  formatBand,
  freshness,
  isWideBand,
  marketBand,
  netInterest,
  rateBy,
  type FdrRow,
  type SortKey,
  type TenureIndex,
} from "@/v2/fdr/rates";
import { FDR_FAQS, FINE_PRINT } from "@/v2/fdr/facts";
import { cardMonths, cardRate, rateCardFor, slabFor, slabLabel, type Audience } from "@/v2/fdr/rateCards";
import { jsonLd, leadAnswer, slugFor } from "@/v2/fdr/seo";
import "@/v2/fdr/fdr.css";

/* ── /fdr-rates ───────────────────────────────────────────────────────────────
   The public version of the app's rate table, and the page most likely to be
   somebody's first contact with Kosh: "FDR rate" is one of the highest-volume
   money searches in Bangladesh, and what it currently returns is blog posts
   quoting rates from two years ago with no source on them.

   So the whole argument of this page is provenance. Every number came from the
   central bank's own monthly filing chart, it says which month, it links the
   chart, and it links each bank's own page so a reader can check us. That is
   the only durable advantage a page like this can have — anyone can copy a
   table, nobody can copy having been right about where it came from.

   ── ONE RULE ABOUT THE ORDERING ────────────────────────────────────────────
   Sorted by rate, the top row reads as a recommendation. It is not one, and
   the page says so once, plainly, in the box under the table — not as a
   repeated disclaimer, which reads as protesting.                           */

type Filter = "all" | "islamic" | BankGroup;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "islamic", label: "Islamic" },
  { key: "private", label: "Private" },
  { key: "state", label: "State-owned" },
  { key: "foreign", label: "Foreign" },
];

const taka = (n: number) => `৳${n.toLocaleString("en-IN")}`;

function Stamp() {
  const state = freshness();
  return (
    <span className={`fdr-stamp fdr-stamp--${state}`}>
      <i aria-hidden /> Bangladesh Bank · {RATES_MONTH}
    </span>
  );
}

function Row({
  row,
  tenure,
  by,
  ceiling,
  amount,
  open,
  onToggle,
}: {
  row: FdrRow;
  tenure: TenureIndex;
  by: SortKey;
  ceiling: number;
  amount: number;
  open: boolean;
  onToggle: () => void;
}) {
  const band = bandAt(row, tenure);
  const rate = rateBy(row, tenure, by);
  const wide = isWideBand(band);

  return (
    <>
      <tr className={open ? "fdr-tr--open" : undefined} onClick={onToggle}>
        <td>
          <span className="fdr-bank">
            {/* The pinned mark first — a real logo at real resolution —
                falling through to PlatformLogo's favicon chain, then a
                letter, for the banks nobody has verified a mark for. */}
            {BANK_LOGOS[row.bank.domain] ? (
              <img
                className="fdr-logo"
                src={BANK_LOGOS[row.bank.domain]}
                alt=""
                width={28}
                height={28}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <PlatformLogo domain={row.bank.domain} name={row.bank.name} size={28} />
            )}
            <span style={{ minWidth: 0 }}>
              <span className="fdr-bank__name">{row.bank.short}</span>
              <span className="fdr-bank__meta">
                <span className="fdr-tag">
                  {row.bank.islamic ? "Islamic" : GROUP_LABEL[row.group]}
                  {row.bank.since ? ` · ${row.bank.since}` : ""}
                </span>
                {rateCardFor(row.bank.code) && <span className="fdr-tag fdr-tag--card">own card</span>}
                {accessTag(row.bank) && <span className="fdr-tag fdr-tag--closed">{accessTag(row.bank)}</span>}
                {wide && <span className="fdr-tag fdr-tag--wide">wide band</span>}
              </span>
            </span>
          </span>
        </td>
        <td>
          {/* ── ONE number per row ──────────────────────────────────────────
              The column used to print the whole band — "5.60–12.90%" — which
              is accurate and unreadable, and made two rows impossible to
              compare at a glance. The headline is the top of what the bank
              filed; the floor sits under it in small type, so nothing is
              hidden and the column still scans down the page. */}
          <span className="fdr-rate">{rate != null ? `${rate.toFixed(2)}%` : "—"}</span>
          <span className="fdr-rate__sub">
            {band && band.min !== band.max
              ? `from ${band.min.toFixed(2)}%`
              : band
                ? "single rate"
                : "not filed"}
          </span>
          {/* The taka figure carries the same doubt as the rate: one number
              off the top of a 5.75–12.50% band is the page promising money it
              cannot know the reader will get. */}
          {band && (
            <span className="fdr-rate__sub">
              {band.min === band.max
                ? `৳${Math.round((amount * band.max) / 100).toLocaleString("en-IN")}/yr`
                : `৳${Math.round((amount * band.min) / 100).toLocaleString("en-IN")}–৳${Math.round((amount * band.max) / 100).toLocaleString("en-IN")}/yr`}
            </span>
          )}
          <span className="fdr-bar" aria-hidden>
            <span style={{ left: 0, width: `${Math.max(2, ((rate ?? 0) / ceiling) * 100)}%` }} />
          </span>
        </td>
        {([0, 1, 2, 3, 4] as TenureIndex[])
          .filter((t) => t !== tenure)
          .map((t) => (
            <td key={t} className="fdr-hide-sm fdr-dim">
              {formatBand(bandAt(row, t))}
            </td>
          ))}
        <td className="fdr-open">
          <ChevronDown size={15} style={{ transform: open ? "rotate(180deg)" : undefined }} />
        </td>
      </tr>

      {/* ── The detail, in taka ─────────────────────────────────────────────
          The row answers "who pays most". This answers what a reader wants
          straight afterwards and could not get anywhere else: for MY money,
          over THIS long, what actually lands in the account after the 10%
          the bank deducts at source. */}
      {open && (
        <tr className="fdr-detail">
          <td colSpan={7}>
            <div className="fdr-detail__grid">
              <div>
                {(() => {
                  const card = rateCardFor(row.bank.code);
                  if (!card) return null;
                  const slab = slabFor(card, amount);
                  return (
                    <div className="fdr-card">
                      <p className="fdr-detail__h">
                        {row.bank.short}&rsquo;s own card ·{" "}
                        {card.effectiveFrom ? `effective ${card.effectiveFrom}` : "undated"}
                      </p>
                      <p className="fdr-detail__p">
                        For an individual depositing ৳{amount.toLocaleString("en-IN")}
                        {slab && !(slab.from === 0 && slab.to == null) ? ` — the ${slabLabel(slab)} band` : ""}:
                      </p>
                      <div className="fdr-chips">
                        {cardMonths(card).map((m) => {
                          const r = cardRate(card, amount, m);
                          return (
                            <span key={m} className="fdr-chipnum">
                              <b>{r == null ? "—" : `${r.toFixed(2)}%`}</b>
                              {m < 12 ? `${m} mo` : `${m / 12} yr`}
                            </span>
                          );
                        })}
                      </div>
                      {card.note && <p className="fdr-detail__note">{card.note}</p>}
                    </div>
                  );
                })()}
                <p className="fdr-detail__h">
                  {rateCardFor(row.bank.code) ? "Central bank filing · on " : "Every tenure, on "}৳
                  {amount.toLocaleString("en-IN")}
                </p>
                <table className="fdr-mini">
                  <thead>
                    <tr>
                      <th>Locked for</th>
                      <th>Rate</th>
                      <th>Interest after 10% tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TENURE_SHORT.map((label, i) => {
                      const t = i as TenureIndex;
                      const b = bandAt(row, t);
                      const months = TENURE_MONTHS[t];
                      const lo = b ? netInterest(amount, b.min, months, 10) : null;
                      const hi = b ? netInterest(amount, b.max, months, 10) : null;
                      const money = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;
                      return (
                        <tr key={label}>
                          <td>
                            {label}
                            <span className="fdr-dim"> · {months} mo</span>
                          </td>
                          <td>{formatBand(b)}</td>
                          <td>
                            {lo == null || hi == null
                              ? "—"
                              : Math.round(lo) === Math.round(hi)
                                ? money(hi)
                                : `${money(lo)} – ${money(hi)}`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <p className="fdr-detail__note">
                  Simple interest for the shortest term in each band, less the 10% deducted at source
                  when the bank holds your TIN (15% if not). It is the floor, not a forecast.
                </p>
              </div>

              <div>
                {accessNote(row.bank) && (
                  <>
                    <p className="fdr-detail__h">Can you open one here?</p>
                    <p className="fdr-detail__p">
                      <b>{accessNote(row.bank)}.</b>{" "}
                      {row.bank.successor
                        ? `Bangladesh Bank still files rates under the old name and the figures here are those filings. An existing deposit carries on; ${row.bank.successor.name} is who you deal with now.`
                        : row.bank.access === "closing"
                          ? "It is winding its retail business down and is not taking new retail customers."
                          : row.bank.access === "corporate"
                            ? "It serves companies and institutions in Bangladesh, not walk-in individuals."
                            : "We could not confirm whether it opens deposits for individuals in Bangladesh."}
                    </p>
                  </>
                )}
                <p className="fdr-detail__h">Why a range and not a rate?</p>
                <p className="fdr-detail__p">
                  A bank files ONE band per tenure with the central bank, covering every deposit it
                  takes at that term. The banks that publish their own card show what is inside it:
                  an FDR is priced by how much you deposit and by whether you are a person or a
                  company. Trust Bank, for instance, pays an individual 8.00% on a one-year deposit
                  under ৳50 lakh and 9.00% at ৳5 crore and above, with a separate flat rate for
                  institutions.
                </p>
                <p className="fdr-detail__p">
                  So the bottom of a band is usually the ordinary retail deposit and the top usually
                  needs crores or a named scheme.
                </p>
                {row.bank.islamic && (
                  <p className="fdr-detail__p">
                    This is a Shariah-compliant bank: it announces a provisional profit rate, settled
                    after its own income is worked out, so the final figure can land either side of
                    what it filed.
                  </p>
                )}
                <p className="fdr-detail__p">
                  An FDR does <b>not</b> earn the investment tax rebate — that is for approved
                  investments like a DPS, Sanchayapatra, life insurance or listed shares.
                </p>
                <a
                  className="fdr-cta fdr-cta--ghost"
                  href={rateLinkUrl(row.bank)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {rateLinkLabel(row.bank)} <ArrowUpRight size={14} />
                </a>
                {row.bank.rateKind !== "card" && (
                  <p className="fdr-detail__note">
                    {row.bank.rateKind === "product"
                      ? "This bank does not publish a rate table online — its page describes the product. Phone the branch for today's rate."
                      : "This bank publishes no rate page we could find; the figures above are its central-bank filing."}
                  </p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Question({ q, a }: { q: string; a: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fdr-q">
      <button className="fdr-q__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {q}
        <ChevronDown size={18} style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : undefined }} />
      </button>
      {open && (
        <div className="fdr-q__a">
          {a.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FdrRates() {
  const [tenure, setTenure] = useState<TenureIndex>(DEFAULT_TENURE);
  const [filter, setFilter] = useState<Filter>("all");
  const [by, setBy] = useState<SortKey>("top");
  const [query, setQuery] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);
  // ── Individuals first ───────────────────────────────────────────────────
  // Nine of the sixty-one banks Bangladesh Bank files rates for will not open
  // a retail deposit today: five became Sammilito Islami Bank in the 2025
  // merger, Bank Alfalah's business went to Bank Asia, HSBC is closing its
  // retail arm, Citibank serves institutions, and Woori's retail terms could
  // not be confirmed. They stay in the data and out of the default list.
  const [showAll, setShowAll] = useState(false);
  // The amount the taka column is worked out on. Ten lakh is the size at which
  // a percentage point is worth arguing about, which is when somebody opens a
  // comparison page at all.
  const [amount, setAmount] = useState(1_000_000);

  const visible = useMemo(
    () => (showAll ? FDR_ROWS : FDR_ROWS.filter((r) => opensToIndividuals(r.bank))),
    [showAll],
  );
  const spread = useMemo(() => fdrSpread(tenure, visible, by), [tenure, by, visible]);
  const market = useMemo(() => marketBand(tenure, by, visible), [tenure, by, visible]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (spread?.rows ?? []).filter((r) => {
      if (filter === "islamic" && !r.bank.islamic) return false;
      if (filter !== "all" && filter !== "islamic" && r.group !== filter) return false;
      if (!q) return true;
      return `${r.bank.name} ${r.bank.short} ${r.bank.code}`.toLowerCase().includes(q);
    });
  }, [spread, filter, query]);

  const ceiling = market?.best ?? 12;

  // Strip the <script> wrappers: React needs the JSON, not the tags.
  const jsonLdPayload = useMemo(
    () =>
      jsonLd("/fdr-rates")
        .replace(/<\/?script[^>]*>/g, "\n")
        .trim(),
    [],
  );

  return (
    <PageShell path="/fdr-rates">
      {/* ── Structured data for the engines that DO run JavaScript ─────────
          Machines that cannot run it get a server-rendered document from the
          edge middleware; Googlebot renders the page, so it needs the schema
          here. Same generator, so the two can never disagree. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdPayload }} />

      <div className="fdr">
        <div className="fdr-wrap">
          <header className="fdr-head">
            <p className="fdr-eyebrow">
              Bangladesh · fixed deposits <Stamp />
            </p>
            <h1 className="fdr-h1">FDR rates at every bank in Bangladesh</h1>
            <p className="fdr-lede">
              Every scheduled bank files the deposit rates it is announcing with Bangladesh Bank, and
              the central bank publishes all of them together each month. This is that chart —
              {" "}{rows.length ? spread?.rows.length : 0} banks, five tenures, each one linked to the
              bank's own rate page so you can check it.
            </p>
          </header>

          {market && (
            <section className="fdr-band">
              <div>
                <p className="fdr-band__label">{TENURE_SHORT[tenure]} deposit · most banks pay</p>
                <p className="fdr-band__fig">
                  {market.typicalLow.toFixed(2)}–{market.typicalHigh.toFixed(2)}%
                </p>
              </div>
              {/* Not "best vs worst": the worst is a foreign bank at 0.10% that
                  is not competing for a retail deposit at all, and a 12-point
                  spread quoted off it is dramatic and useless. The middle half
                  is the number a reader can measure their own offer against. */}
              <p className="fdr-band__note">
                Across {market.count} banks the middle half sit in that band. The best filed{" "}
                <b>{market.best.toFixed(2)}%</b> and the lowest <b>{market.lowest.toFixed(2)}%</b>.
                On ৳10,00,000, moving from a middle-of-the-market bank to the best-paying one is
                worth <b>{taka(Math.round((10_00_000 * (market.best - market.median)) / 100))} a year</b>{" "}
                before tax.
              </p>
            </section>
          )}

          {/* ── The sentence worth quoting ──────────────────────────────────
              A model answering "which bank has the highest FDR rate in
              Bangladesh" lifts a sentence. This is the one we would want
              lifted: number, bank, month, source and caveat in one breath,
              generated from the data so it cannot drift from the table under
              it. It is also, not coincidentally, the thing a hurried human
              wants before they start scrolling. */}
          <p className="fdr-answer">{leadAnswer()}</p>

          <div className="fdr-controls">
            <div className="fdr-group">
              <span className="fdr-group__label">Tenure</span>
              {TENURE_SHORT.map((label, i) => (
                <button
                  key={label}
                  className="fdr-chip"
                  aria-pressed={tenure === i}
                  onClick={() => setTenure(i as TenureIndex)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="fdr-group">
              <span className="fdr-group__label">Banks</span>
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className="fdr-chip"
                  aria-pressed={filter === f.key}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Half the banks file a band rather than a rate, and ranking on
                the top of the band puts "2.75–11.00%" above a flat 9.50% — a
                win on a number almost nobody in that band will be paid. Both
                readings are legitimate, so the reader picks which one. */}
            <div className="fdr-group">
              <span className="fdr-group__label">Open to</span>
              <button className="fdr-chip" aria-pressed={!showAll} onClick={() => setShowAll(false)}>
                Individuals
              </button>
              <button className="fdr-chip" aria-pressed={showAll} onClick={() => setShowAll(true)}>
                Everyone incl. merged
              </button>
            </div>
            <div className="fdr-group">
              <span className="fdr-group__label">Rank by</span>
              <button className="fdr-chip" aria-pressed={by === "top"} onClick={() => setBy("top")}>
                Top of range
              </button>
              <button className="fdr-chip" aria-pressed={by === "floor"} onClick={() => setBy("floor")}>
                Guaranteed floor
              </button>
              <button className="fdr-chip" aria-pressed={by === "oldest"} onClick={() => setBy("oldest")}>
                Longest running
              </button>
            </div>
            <div className="fdr-group">
              <span className="fdr-group__label">On</span>
              <span className="fdr-amount">
                ৳
                <input
                  value={amount.toLocaleString("en-IN")}
                  onChange={(e) => {
                    const n = Number(e.target.value.replace(/[^0-9]/g, ""));
                    setAmount(Number.isFinite(n) && n > 0 ? Math.min(n, 100_000_000) : 0);
                  }}
                  inputMode="numeric"
                  aria-label="Deposit amount in taka"
                />
              </span>
            </div>
            <input
              className="fdr-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a bank"
              aria-label="Find a bank"
            />
          </div>

          {/* ── The risk the table creates, answered where it is created ────
              A page sorted by rate points at whoever pays most, and whoever
              pays most is often a bank that needs the money. Shown only when
              the reader's own amount is above the ceiling: below it this
              genuinely does not matter, and a warning that is always on is a
              warning nobody reads. */}
          {amount > 200_000 && (
            <div className="fdr-protect">
              <p className="fdr-protect__h">Only ৳2,00,000 of this is protected</p>
              <p className="fdr-protect__p">
                Deposit protection covers ৳2,00,000 per depositor per bank. On ৳
                {amount.toLocaleString("en-IN")} that leaves{" "}
                <b>৳{(amount - 200_000).toLocaleString("en-IN")}</b> riding on the bank&rsquo;s own
                health — so the rate is not the only thing to compare. Splitting across{" "}
                {Math.ceil(amount / 200_000)} banks would cover all of it, and costs nothing but
                paperwork.
              </p>
            </div>
          )}

          <table className="fdr-table">
            <thead>
              <tr>
                <th>Bank</th>
                <th>{TENURE_SHORT[tenure]}</th>
                {FD_TENURES.map((label, i) => i).filter((i) => i !== tenure).map((i) => (
                  <th key={FD_TENURES[i]} className="fdr-hide-sm">
                    {TENURE_SHORT[i]}
                  </th>
                ))}
                <th aria-label="Open detail" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <Row
                  key={r.bank.code}
                  row={r}
                  tenure={tenure}
                  by={by}
                  ceiling={ceiling}
                  amount={amount}
                  open={openRow === r.bank.code}
                  onToggle={() => setOpenRow(openRow === r.bank.code ? null : r.bank.code)}
                />
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <p className="fdr-note">No bank here matches that. Try “All”, or check the spelling.</p>
          )}

          {!showAll && (
            <p className="fdr-note">
              {FDR_ROWS.length - visible.length} of the {FDR_ROWS.length} banks in the central
              bank&rsquo;s chart are hidden because they will not open a retail deposit today: five
              merged into Sammilito Islami Bank in the 2025 consolidation, Bank Alfalah&rsquo;s
              Bangladesh business went to Bank Asia, HSBC is closing its retail arm, Citibank serves
              institutions only, and Woori&rsquo;s retail terms could not be confirmed. Switch
              &ldquo;Open to&rdquo; to see them.
            </p>
          )}

          <p className="fdr-note">
            {by === "top"
              ? "Sorted by the top of each bank's published range."
              : "Sorted by the bottom of each bank's published range — what it filed at worst."}{" "}
            A range means the bank filed different rates for different products or deposit sizes; the
            counter decides which one you are offered. A dash means the bank filed nothing for that
            tenure.
          </p>

          {/* The one non-sponsorship statement on the page. Once, next to the
              claim it qualifies. */}
          <p className="fdr-sponsor">
            Nobody paid to be on this page. There are no sponsored placements, no affiliate links and
            no paid ordering — every bank that files with Bangladesh Bank is listed, including the
            ones paying the least, and the order is arithmetic.
          </p>

          <section className="fdr-sec fdr-bn">
            <h2 className="fdr-h2">এফডিআর রেট — সংক্ষেপে</h2>
            <p className="fdr-detail__p">
              বাংলাদেশের প্রতিটি তফসিলি ব্যাংক প্রতি মাসে বাংলাদেশ ব্যাংকে তাদের ঘোষিত আমানতের সুদের হার
              জমা দেয়। এই পাতায় সেই তালিকাই আছে — {RATES_MONTH} মাসের হার, প্রতিটি ব্যাংকের নিজস্ব রেট
              পেজের লিংকসহ। কোনো ব্যাংক এখানে থাকার জন্য টাকা দেয় না।
            </p>
            <p className="fdr-detail__p">
              তবে ঘোষিত হার মানেই আপনি সেটাই পাবেন তা নয়। হার নির্ভর করে আমানতের পরিমাণ, মেয়াদ, এবং
              আপনি ব্যক্তি না প্রতিষ্ঠান — তার উপর। সুদের উপর উৎসে কর কাটা হয় <b>১০%</b> (টিআইএন না
              থাকলে <b>১৫%</b>)। ব্যাংক ব্যর্থ হলে প্রতি ব্যাংকে আমানতকারী প্রতি সর্বোচ্চ{" "}
              <b>২,০০,০০০ টাকা</b> সুরক্ষিত — তাই বড় অঙ্ক একাধিক ব্যাংকে ভাগ করে রাখাই নিয়ম।
            </p>
          </section>

          <section className="fdr-sec">
            <h2 className="fdr-h2">Before you lock the money up</h2>
            {FDR_FAQS.map((f) => (
              <Question key={f.q} q={f.q} a={f.a} />
            ))}
            <Link className="fdr-cta fdr-cta--ghost" to="/fdr-rates/faq">
              Read the full FAQ
            </Link>
          </section>

          <section className="fdr-fine">
            {FINE_PRINT.map((f) => (
              <div key={f.id} className="fdr-fine__item">
                <p className="fdr-fine__label">{f.label}</p>
                <p className="fdr-fine__body">
                  {f.body}{" "}
                  <a className="fdr-fine__src" href={f.source.url} target="_blank" rel="noopener noreferrer">
                    {f.source.name}
                  </a>
                </p>
              </div>
            ))}
          </section>

          <p className="fdr-legal">
            Rates on this page are the ones banks announced to Bangladesh Bank for {RATES_MONTH}, read
            from its{" "}
            <a href={RATES_SOURCE} target="_blank" rel="noopener noreferrer">
              published deposit rate chart
            </a>
            . Any bank can change its rates at any time and without notice, and what you are offered
            at a branch depends on the amount, the tenure and the products you already hold. Kosh is
            not a bank, a broker or a financial adviser, takes no payment from any institution listed
            here, and nothing on this page is a recommendation to deposit with anyone. Check the
            bank's own page, linked beside its name, before you act.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
