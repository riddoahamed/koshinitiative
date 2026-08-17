import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { LESSONS } from "@/v2/lessons";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /learn ───────────────────────────────────────────────────────────────────
   Six lessons, readable right here. No account, no email wall, no "sign up to
   continue" halfway down. If Kosh is going to claim it teaches people money,
   the teaching has to be visible before the ask.                            */

const Learn = () => {
  /* first one open — an accordion that starts fully closed reads as empty */
  const [open, setOpen] = useState<string | null>(
    typeof window !== "undefined" && window.location.hash
      ? window.location.hash.slice(1)
      : LESSONS[0].id
  );

  return (
    <PageShell
      title="Quick money lessons"
      description="Six two-minute lessons for first-time investors in Bangladesh: what investing actually is, the emergency fund, Sanchaypatra vs DPS vs FDR, mutual funds, how to spot a scam, and your first ৳1,000. Free, no account needed."
      path="/learn"
    >
      <section className="sec page-hero">
        <div className="blob p" style={{ width: 440, height: 440, left: "-10%", top: "-4%" }} />
        <div className="wrap">
          <p className="eyebrow" data-reveal>quick lessons</p>
          <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
            Learn one thing. It takes two minutes.
          </h2>
          <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
            Six lessons, in the order they actually matter. No account, no email
            wall, no half-a-lesson-then-sign-up. Read them all in about twelve
            minutes and you will know more about money than most people who
            already invest.
          </p>
        </div>
      </section>

      <section className="sec lessons">
        <div className="wrap">
          <div className="lesson__list" data-stagger="70">
            {LESSONS.map((l) => {
              const isOpen = open === l.id;
              return (
                <article
                  className={`lesson${isOpen ? " is-open" : ""}`}
                  key={l.id}
                  id={l.id}
                  data-reveal="fade"
                >
                  <button
                    className="lesson__head"
                    onClick={() => setOpen(isOpen ? null : l.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="lesson__n">{l.n}</span>
                    <span className="lesson__headtext">
                      <span className="lesson__meta">
                        <i>{l.tag}</i>
                        <em>{l.time}</em>
                      </span>
                      <h3>{l.title}</h3>
                      <p className="lesson__hook">{l.hook}</p>
                    </span>
                    <span className="lesson__toggle" aria-hidden="true">
                      <Plus size={18} strokeWidth={2.2} />
                    </span>
                  </button>

                  <div className="lesson__body">
                    <div className="lesson__inner">
                      {l.body.map((para, i) => (
                        <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                      ))}
                      <p className="lesson__takeaway">
                        <span>the one thing</span>
                        {l.takeaway}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="page-cta" data-reveal="scale">
            <h3>Reading is the easy half.</h3>
            <p>
              Now do it with money that isn&rsquo;t real. The app puts these
              lessons to work — paper investing on real market prices, an AI
              coach that knows Bangladeshi products, and the games. Free.
            </p>
            <div className="page-cta__row">
              <a className="btn btn-primary" href={KOSH_APP_URL} target="_blank" rel="noreferrer">
                Try Kosh <ArrowRight size={16} strokeWidth={2.4} />
              </a>
              <a className="btn btn-glass" href="/quiz">What kind of investor am I?</a>
            </div>
          </div>

          <p className="disclaim" data-reveal="fade">
            Educational only. Kosh is not a licensed financial adviser, we never
            take custody of your money, and nothing here is a recommendation to
            buy any specific product. Rates and rules change — check current
            terms with the institution before you commit.
          </p>
        </div>
      </section>
    </PageShell>
  );
};

export default Learn;
