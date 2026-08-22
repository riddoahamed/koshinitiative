import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import Starfield from "./Starfield";
import { fetchTotals, taka, EMPTY_TOTALS, type Totals } from "@/lib/investkorsiData";

/* ---------------- INVESTKORSI — the teaser on the homepage ----------------

   InvestKorsi is the one thing Kosh has that needs NO trust to be useful.
   Every other surface asks a sceptical Bangladeshi saver to believe an app
   about money before it pays out. This one asks nothing — no account, no
   email, no download — and hands over other people's real experiences
   immediately. That makes it the best front door the product has.

   A front door is not a brochure. This used to be three pillar cards, a
   three-line sub-head and a paragraph of promises, which is a lot of reading
   for a thing whose entire pitch is "look at the numbers". It is now the
   claim, the numbers, and the door. Everything the pillars said — anonymity,
   one report per investment, optional attribution — is said on /investkorsi,
   where someone who wants it is already looking for it.

   THE FIGURES ARE FETCHED, NOT TYPED. The old markup hardcoded 48 via
   data-count, which is fine on the day it ships and a lie by the next report.
   A marketing number about other people's money is exactly the wrong thing to
   let drift, so it reads from the same table the app does and simply does not
   render if the fetch fails.

   ── THE COPY RULE ────────────────────────────────────────────────────────
   This section describes the DATA and never a company. No firm is named.
   "৳48 lakh reported stuck" is a fact about a table; "X is dangerous" is a
   claim about a real business nobody at Kosh has investigated. And "stuck" is
   only ever said of amountBad — amount_total includes money that came back
   perfectly fine. */

export const InvestKorsi = () => {
  const [t, setT] = useState<Totals>(EMPTY_TOTALS);

  useEffect(() => {
    let alive = true;
    fetchTotals().then((v) => alive && setT(v));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="sec investkorsi" id="investkorsi">
      <Starfield density={1.4} />

      <div className="wrap">
        <p className="eyebrow" data-reveal>
          InvestKorsi
        </p>

        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          Who actually <span className="grad-text">got paid?</span>
        </h2>

        <p className="h-sub" data-reveal style={{ ["--d" as string]: "160ms" }}>
          Anonymous reports on the platforms, funds and groups Bangladeshis invest through.
          Read them free, then learn what to look for.
        </p>

        {t.reports > 0 && (
          <div className="ik__figures" data-reveal="fade">
            <span>
              <b>{t.reports}</b> reports
            </span>
            <span>
              <b>{t.platforms}</b> platforms
            </span>
            {t.amountBad > 0 && (
              <span>
                <b>{taka(t.amountBad)}</b> reported stuck
              </span>
            )}
          </div>
        )}

        <div className="ik__cta" data-reveal style={{ ["--d" as string]: "120ms" }}>
          <a className="btn btn-primary" href="/investkorsi">
            See the reports <ArrowRight size={16} aria-hidden />
          </a>
          <a className="btn btn-glass" href="/investkorsi">
            Add yours
          </a>
        </div>

        <p className="ik__fine" data-reveal="fade">
          People&rsquo;s own reports. Kosh has not investigated any company listed.
        </p>
      </div>
    </section>
  );
};

export default InvestKorsi;
