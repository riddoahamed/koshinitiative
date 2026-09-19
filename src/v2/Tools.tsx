import { useEffect, useState } from "react";
import { ArrowRight, Landmark, ScrollText } from "lucide-react";
import Starfield from "./Starfield";
import { fetchTotals, taka, EMPTY_TOTALS, type Totals } from "@/lib/investkorsiData";
import { FDR_ROWS, RATES_MONTH, DEFAULT_TENURE, topRate } from "./fdr/rates";

/* ── FREE TOOLS ───────────────────────────────────────────────────────────────

   FDR rates and InvestKorsi were the two loneliest things on this site. Both
   are real destinations with their own pages, both are the sort of thing
   somebody actively searches for, and neither needs an account, a download or
   a word of trust to be useful. One of them had a whole homepage section and a
   headline that duplicated the hero; the other had no homepage presence at all
   and existed only as the sixth item in a dropdown.

   They belong together and they belong early. This is the part of the site a
   sceptical saver can use before believing anything we say, which makes it the
   cheapest yes on the page.

   ── THE NUMBERS ARE READ, NOT TYPED ──────────────────────────────────────
   The bank count and the month come from the generated rate file, the ledger
   figures from the same table the app reads. A marketing number about other
   people's money is exactly the wrong thing to hardcode and let drift, so if
   the ledger fetch fails its stat simply does not render.

   ── THE COPY RULE, INHERITED FROM THE OLD SECTION ────────────────────────
   This describes DATA and never a company. No firm is named, and "stuck" is
   only ever said of amountBad, because amount_total includes money that came
   back perfectly fine. */

const BANK_COUNT = FDR_ROWS.length;

/** The best announced rate anywhere in the table, at the default tenure. */
const BEST_RATE = FDR_ROWS.reduce<number | null>((best, row) => {
  const r = topRate(row, DEFAULT_TENURE);
  return r !== null && (best === null || r > best) ? r : best;
}, null);

export const Tools = () => {
  const [t, setT] = useState<Totals>(EMPTY_TOTALS);

  useEffect(() => {
    let alive = true;
    fetchTotals().then((v) => alive && setT(v));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="sec tools" id="tools">
      <Starfield density={1.2} />

      <div className="wrap">
        <p className="eyebrow" data-reveal>free tools</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          Two things you can use right now,{" "}
          <span className="grad-text">without an account.</span>
        </h2>
        <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
          No signup, no download, nothing sold to you. Both are built from
          public filings and what people told us, and both stay free whether or
          not you ever open the app.
        </p>

        <div className="tools__grid" data-stagger="130">
          <a className="tool" href="/fdr-rates" data-reveal="scale">
            <span className="tool__icon"><Landmark size={22} strokeWidth={1.9} /></span>
            <h3>FDR rates, every bank</h3>
            <p>
              What each scheduled bank announced to Bangladesh Bank for a fixed
              deposit, in one sortable table, with the tax and the early-break
              penalty spelled out.
            </p>
            <span className="tool__stats">
              <b>{BANK_COUNT} banks</b>
              {BEST_RATE !== null && <b>up to {BEST_RATE.toFixed(2)}%</b>}
              <em>{RATES_MONTH}</em>
            </span>
            <span className="tool__go">
              Compare the rates <ArrowRight size={15} strokeWidth={2.3} />
            </span>
          </a>

          <a className="tool" href="/investkorsi" data-reveal="scale">
            <span className="tool__icon tool__icon--b"><ScrollText size={22} strokeWidth={1.9} /></span>
            <h3>InvestKorsi, the public ledger</h3>
            <p>
              What actually happened to people&rsquo;s money at Bangladeshi
              platforms: who got paid, who is still waiting, and what went
              wrong. Anonymous, and yours takes two minutes to add.
            </p>
            <span className="tool__stats">
              {t.reports > 0 ? (
                <>
                  <b>{t.reports} reports</b>
                  <b>{t.platforms} platforms</b>
                  {t.amountBad > 0 && <em>{taka(t.amountBad)} reported stuck</em>}
                </>
              ) : (
                <em>Read the ledger</em>
              )}
            </span>
            <span className="tool__go">
              See what happened <ArrowRight size={15} strokeWidth={2.3} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
