import { Link } from "react-router-dom";

import PageShell from "@/v2/PageShell";
import { FDR_FAQS, FINE_PRINT } from "@/v2/fdr/facts";
import { RATES_MONTH, RATES_SOURCE } from "@/v2/fdr/rates";
import "@/v2/fdr/fdr.css";

/* ── /fdr-rates/faq ───────────────────────────────────────────────────────────
   The questions the table cannot answer inside a row.

   Every answer is OPEN here, unlike the accordion on the rate page. An
   accordion is right where the reader came for a number and the questions are
   secondary; it is wrong on the page somebody landed on BY SEARCHING THE
   QUESTION, where the answer should be on screen and in the page's text for a
   crawler to read without executing a click.                                */

export default function FdrFaq() {
  return (
    <PageShell path="/fdr-rates/faq" backTo="/fdr-rates">
      <div className="fdr">
        <div className="fdr-wrap">
          <header className="fdr-head">
            <p className="fdr-eyebrow">Bangladesh · fixed deposits</p>
            <h1 className="fdr-h1">Questions about FDRs in Bangladesh</h1>
            <p className="fdr-lede">
              What an announced rate actually entitles you to, what you keep after tax, what happens
              if a bank fails, and why an Islamic bank's number is provisional.
            </p>
          </header>

          <section className="fdr-sec">
            {FDR_FAQS.map((f) => (
              <div key={f.q} className="fdr-q">
                <h2 className="fdr-q__btn" style={{ cursor: "default" }}>
                  {f.q}
                </h2>
                <div className="fdr-q__a">
                  {f.a.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </section>

          <section className="fdr-sec">
            <h2 className="fdr-h2">The rules, in full</h2>
            <div className="fdr-fine" style={{ marginTop: 0, borderTop: 0, paddingTop: 0 }}>
              {FINE_PRINT.map((f) => (
                <div key={f.id} className="fdr-fine__item">
                  <p className="fdr-fine__label">{f.label}</p>
                  <p className="fdr-fine__body">
                    {f.body}{" "}
                    <a
                      className="fdr-fine__src"
                      href={f.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {f.source.name}
                    </a>
                  </p>
                </div>
              ))}
            </div>
          </section>

          <p className="fdr-legal">
            Rates on Kosh are the ones banks announced to Bangladesh Bank for {RATES_MONTH}, read from
            its{" "}
            <a href={RATES_SOURCE} target="_blank" rel="noopener noreferrer">
              published deposit rate chart
            </a>
            . Any bank can change its rates at any time and without notice. Kosh is not a bank, a
            broker or a financial adviser, takes no payment from any institution listed, and nothing
            here is a recommendation to deposit anywhere.
          </p>

          <Link className="fdr-cta" to="/fdr-rates">
            See the rate table
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
