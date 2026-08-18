import { ArrowRight, Target, BookOpen, LineChart, ShieldCheck, Wallet } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /start ───────────────────────────────────────────────────────────────────
   "If I were to start investing today…" — the page the site never had.
   The honest order of operations, written out, with a real link at every step
   and nothing sold in between.                                              */

const STEPS = [
  {
    icon: Target,
    n: "01",
    when: "today · 60 seconds",
    t: "Find out where you actually stand",
    p: "Not what you should buy, but where you are. Six questions about your buffer, your income and how you'd really react to a bad month. You get a straight read and a starting point.",
    href: "/quiz",
    cta: "Take the quiz",
  },
  {
    icon: ShieldCheck,
    n: "02",
    when: "today · 2 minutes",
    t: "Build the buffer before anything else",
    p: "Three months of expenses you can reach in a day. It earns almost nothing, and it is still the highest-value move you will make, because it stops one bad month from forcing you to sell at the worst time.",
  
    href: "/learn#emergency-fund",
    cta: "Read the lesson",
  },
  {
    icon: BookOpen,
    n: "03",
    when: "this week · 10 minutes",
    t: "Learn what you're being offered",
    p: "Sanchaypatra, DPS, FDR, mutual funds: what each one actually pays you and where the money comes from. Then the five tells that give a scam away, so nobody sells you a shortcut.",
    href: "/learn",
    cta: "Six quick lessons",
  },
  {
    icon: LineChart,
    n: "04",
    when: "this month · zero risk",
    t: "Practise with money that isn't real",
    p: "Paper-invest on real market prices. The point isn't the return. It's finding out what you do when the number goes red, before that costs you anything.",
    href: KOSH_APP_URL,
    cta: "Try Kosh",
  },
  {
    icon: Wallet,
    n: "05",
    when: "when you're ready",
    t: "Make the first real move small",
    p: "An amount that can't hurt you. Write down in one sentence why you bought it and what would make you sell. Then leave it alone. That last part is the whole lesson.",
    href: "/learn#first-1000",
    cta: "Read the lesson",
  },
];

const RULES = [
  ["Nothing guaranteed is safe.", "A promised high return is the oldest lie in finance. Real returns move."],
  ["Never invest a deadline.", "If you need the money within a year, it doesn't belong in a market."],
  ["Ask where the return comes from.", "Profits, rent, a state budget. Someone can always name it. If nobody can, walk."],
  ["Slow is a strategy.", "Nothing worth doing expires today. Urgency is a sales tool, not a signal."],
  ["Small first, always.", "Your first investment's job is to teach you how you behave, not to make you money."],
];

const Start = () => (
  <PageShell
    title="If I were to start investing today"
    description="The honest starting order for a first-time investor in Bangladesh — where you stand, the buffer that comes first, what you're actually being offered, risk-free practice, and a first real move that can't hurt you."
    path="/start"
  >
    <section className="sec page-hero">
      <div className="blob m" style={{ width: 460, height: 460, right: "-10%", top: "-6%" }} />
      <div className="wrap">
        <p className="eyebrow" data-reveal>start here</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
          &ldquo;If I were to start investing today&hellip;&rdquo;
        </h2>
        <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
          Here is the honest order, the one almost nobody tells you. Five steps.
          The first three are free and take about fifteen minutes total. Nothing
          on this page is trying to sell you anything.
        </p>
      </div>
    </section>

    <section className="sec startsteps">
      <div className="wrap">
        <ol className="sstep__list" data-stagger="90">
          {STEPS.map((s) => (
            <li className="sstep" key={s.n} data-reveal="left">
              <div className="sstep__rail" aria-hidden="true">
                <span className="sstep__dot"><s.icon size={17} strokeWidth={2} /></span>
              </div>
              <div className="sstep__body">
                <span className="sstep__when">{s.n} · {s.when}</span>
                <h3>{s.t}</h3>
                <p>{s.p}</p>
                <a
                  className="sstep__cta"
                  href={s.href}
                  {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                >
                  {s.cta} <ArrowRight size={15} strokeWidth={2.3} />
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>

    <section className="sec rules">
      <div className="wrap">
        <p className="eyebrow" data-reveal>before a single taka moves</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
          Five rules that have saved more money than any tip.
        </h2>
        <ul className="rule__list" data-stagger="80">
          {RULES.map(([t, p]) => (
            <li key={t} data-reveal="fade">
              <b>{t}</b>
              <span>{p}</span>
            </li>
          ))}
        </ul>

        <div className="page-cta" data-reveal="scale">
          <h3>Now do steps 1 to 5 for real.</h3>
          <p>
            The app is where the path actually happens: the money check, the coach,
            paper investing on real prices, and the games. Free, and we never
            touch your money.
          </p>
          <div className="page-cta__row">
            <a className="btn btn-primary" href={KOSH_APP_URL} target="_blank" rel="noreferrer">
              Try Kosh <ArrowRight size={16} strokeWidth={2.4} />
            </a>
            <a className="btn btn-glass" href="/quiz">Not sure? Take the 60-second check</a>
          </div>
        </div>

        <p className="disclaim" data-reveal="fade">
          Educational only. Kosh is not a licensed financial adviser, we never
          take custody of your money, and nothing here is a recommendation to
          buy any specific product.
        </p>
      </div>
    </section>
  </PageShell>
);

export default Start;
