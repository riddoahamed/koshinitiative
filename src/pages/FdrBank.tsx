import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import PageShell from "@/v2/PageShell";
import { BANK_LOGOS } from "@/v2/fdr/bankLogos";
import { GROUP_LABEL, accessNote, rateLinkLabel, rateLinkUrl } from "@/v2/fdr/banks";
import {
  FDR_ROWS,
  FD_TENURES,
  RATES_MONTH,
  RATES_SOURCE,
  TENURE_MONTHS,
  TENURE_SHORT,
  bandAt,
  formatBand,
  netInterest,
} from "@/v2/fdr/rates";
import { cardMonths, cardRate, rateCardFor } from "@/v2/fdr/rateCards";
import { bankBySlug, slugFor } from "@/v2/fdr/seo";
import "@/v2/fdr/fdr.css";

/* ── /fdr-rates/:slug — one bank ──────────────────────────────────────────────
   "BRAC Bank FDR rate" is a different search from "FDR rates in Bangladesh",
   and one comparison page answers the second well and the first badly. Sixty-one
   pages, each answering one bank's question directly, is the oldest move in
   search — and it is only a cheap trick when the pages are empty. These carry
   that bank's five tenures, its own published card where we have read one, what
   an ordinary deposit actually earns after tax, and whether you can open one
   there at all.

   THE HUMAN PAGE EXISTS BECAUSE THE CRAWLER PAGE DOES. src/v2/fdr/seo.ts serves
   a server-rendered version of this to machines that cannot run JavaScript. A
   model that cites koshbd.com/fdr-rates/brac sends a real person to that URL
   afterwards, and if this route did not exist they would land on a 404 — which
   is a worse outcome than never being cited.                                  */

const AMOUNT = 500_000;
const taka = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;

export default function FdrBank() {
  const { slug = "" } = useParams();
  const bank = bankBySlug(slug);
  const row = bank ? FDR_ROWS.find((r) => r.bank.code === bank.code) : undefined;

  // An unknown slug goes to the table rather than to a 404: whoever followed
  // that link was looking for a bank's rate, and the table has all of them.
  if (!bank || !row) return <Navigate to="/fdr-rates" replace />;

  const card = rateCardFor(bank.code);
  const note = accessNote(bank);

  return (
    <PageShell
      path={`/fdr-rates/${slugFor(bank)}`}
      backTo="/fdr-rates"
      title={`${bank.name} FDR rate ${RATES_MONTH.replace(",", "")} — every tenure`}
      description={`${bank.name} fixed deposit rates for ${RATES_MONTH}: ${FD_TENURES.map(
        (_, i) => `${TENURE_SHORT[i]} ${formatBand(bandAt(row, i as 0))}`,
      ).join(", ")}. From its filing with Bangladesh Bank, with the bank's own rate page linked.`}
    >
      <div className="fdr">
        <div className="fdr-wrap">
          <header className="fdr-head">
            <p className="fdr-eyebrow">
              {bank.islamic ? "Islamic bank" : GROUP_LABEL[row.group]}
              {bank.since ? ` · since ${bank.since}` : ""}
            </p>
            <h1 className="fdr-h1">{bank.name} FDR rate</h1>
            <p className="fdr-lede">
              Announced for <b>{RATES_MONTH}</b> in {bank.name}&rsquo;s filing with Bangladesh Bank.
              {bank.islamic
                ? " As a Shariah-compliant bank it announces a provisional profit rate rather than interest, which can be adjusted after its income is worked out."
                : ""}
            </p>
          </header>

          {note && (
            <div className="fdr-protect">
              <p className="fdr-protect__h">{note}</p>
              <p className="fdr-protect__p">
                {bank.successor
                  ? `Bangladesh Bank still files rates under the old name and the figures below are those filings. An existing deposit carries on; ${bank.successor.name} is who you deal with now.`
                  : bank.access === "closing"
                    ? "It is winding its retail business down and is not taking new retail customers."
                    : bank.access === "corporate"
                      ? "It serves companies and institutions in Bangladesh, not walk-in individuals."
                      : "We could not confirm whether it opens deposits for individuals in Bangladesh."}
              </p>
            </div>
          )}

          <section className="fdr-sec">
            <h2 className="fdr-h2">Every tenure, on {taka(AMOUNT)}</h2>
            <table className="fdr-mini" style={{ maxWidth: 640 }}>
              <thead>
                <tr>
                  <th>Locked for</th>
                  <th>Announced rate</th>
                  <th>Interest after 10% tax</th>
                </tr>
              </thead>
              <tbody>
                {FD_TENURES.map((label, i) => {
                  const b = bandAt(row, i as 0);
                  const months = TENURE_MONTHS[i];
                  const lo = b ? netInterest(AMOUNT, b.min, months, 10) : null;
                  const hi = b ? netInterest(AMOUNT, b.max, months, 10) : null;
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
                            ? taka(hi)
                            : `${taka(lo)} – ${taka(hi)}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="fdr-detail__note">
              Simple interest for the shortest term in each band, less the 10% deducted at source when
              the bank holds your TIN (15% if not). It is the floor, not a forecast.
            </p>
          </section>

          {card && (
            <section className="fdr-sec">
              <h2 className="fdr-h2">{bank.short}&rsquo;s own published card</h2>
              <div className="fdr-card">
                <p className="fdr-detail__h">
                  {card.effectiveFrom ? `Effective ${card.effectiveFrom}` : "Undated by the bank"} · read{" "}
                  {card.readOn}
                </p>
                <div className="fdr-chips">
                  {cardMonths(card).map((m) => {
                    const r = cardRate(card, AMOUNT, m);
                    return (
                      <span key={m} className="fdr-chipnum">
                        <b>{r == null ? "—" : `${r.toFixed(2)}%`}</b>
                        {m < 12 ? `${m} mo` : `${m / 12} yr`}
                      </span>
                    );
                  })}
                </div>
                {card.note && <p className="fdr-detail__note">{card.note}</p>}
                <a className="fdr-link" href={card.source} target="_blank" rel="noopener noreferrer">
                  The card this came from <ArrowUpRight size={11} />
                </a>
              </div>
            </section>
          )}

          <section className="fdr-sec">
            <h2 className="fdr-h2">What this means for an ordinary deposit</h2>
            <p className="fdr-detail__p">
              These are announced rates, not quotes. A bank prices a fixed deposit by how much you
              deposit and by whether you are a person or a company, so a range means the bottom is
              usually the ordinary retail deposit and the top usually needs crores or a named scheme.
              Interest is taxed at source at 10% if the bank holds your TIN and 15% if it does not, and
              deposit protection covers ৳2,00,000 per depositor per bank.
            </p>
            <a
              className="fdr-cta"
              href={rateLinkUrl(bank)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {rateLinkLabel(bank)} <ArrowUpRight size={14} />
            </a>
          </section>

          <section className="fdr-sec">
            <h2 className="fdr-h2">Compare against every other bank</h2>
            <div className="fdr-others">
              {FDR_ROWS.filter((r) => r.bank.code !== bank.code)
                .sort((a, b) => (bandAt(b, 2)?.max ?? 0) - (bandAt(a, 2)?.max ?? 0))
                .slice(0, 8)
                .map((r) => (
                  <Link key={r.bank.code} className="fdr-other" to={`/fdr-rates/${slugFor(r.bank)}`}>
                    {BANK_LOGOS[r.bank.domain] && (
                      <img className="fdr-logo" src={BANK_LOGOS[r.bank.domain]} alt="" width={24} height={24} />
                    )}
                    <span>{r.bank.short}</span>
                    <b>{formatBand(bandAt(r, 2))}</b>
                  </Link>
                ))}
            </div>
            <Link className="fdr-cta fdr-cta--ghost" to="/fdr-rates">
              All 61 banks, side by side
            </Link>
          </section>

          <p className="fdr-legal">
            Rates are the ones {bank.name} announced to Bangladesh Bank for {RATES_MONTH}, from its{" "}
            <a href={RATES_SOURCE} target="_blank" rel="noopener noreferrer">
              published deposit rate chart
            </a>
            . Any bank can change its rates at any time. Kosh is not a bank, a broker or a financial
            adviser, takes no payment from any institution listed, and nothing here is a recommendation.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
