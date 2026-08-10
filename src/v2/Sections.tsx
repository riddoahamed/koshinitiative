import {
  ShieldCheck,
  Sparkles,
  ShieldAlert,
  Compass,
  LineChart,
  PieChart,
  Gamepad2,
  MoonStar,
  Factory,
  Flower2,
  Bike,
  Laptop,
  HardHat,
  ArrowRight,
} from "lucide-react";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";
import ShaderBg from "./ShaderBg";
import Starfield from "./Starfield";

/* ---------------- ABOUT — one sentence over the living shader ---------------- */
export const About = () => (
  <section className="sec about" id="about">
    <ShaderBg />
    <div className="veil" aria-hidden="true" />
    <div className="wrap" data-stagger="110">
      <p className="eyebrow" data-reveal>what kosh is</p>
      <h2 className="h-display" data-reveal>
        An AI-powered <span className="grad-text">investment discovery</span> and
        trust platform.
      </h2>
      <p className="h-sub" data-reveal>
        A better way for people to learn, understand, and take action with
        money — starting with the ones traditional finance leaves behind or
        overwhelms.
      </p>
      <div className="about__ctas" data-reveal="scale">
        <a className="btn btn-primary" href={KOSH_APP_URL}>Try the beta</a>
        <a className="btn btn-glass" href={KOSH_WAITLIST_EMAIL_URL}>Join the waitlist</a>
      </div>
      <div className="about__chips" data-reveal="fade">
        <span>Free for people</span>
        <span>We never touch your money</span>
        <span>Starting in Bangladesh</span>
      </div>
    </div>
  </section>
);

/* ---------------- PROBLEM — two broken things ---------------- */
export const Problem = () => (
  <section className="sec problem" id="problem">
    <Starfield density={1.6} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>the problem</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Advice everywhere. Judgment nowhere.
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "160ms" }}>
        Financial information isn&rsquo;t scarce anymore — it&rsquo;s fragmented,
        overwhelming, and hard to trust.
      </p>

      <div className="problem__cards">
        <div className="pcard glass a" data-reveal="left">
          <span className="pcard__tag">discovery is broken</span>
          <h3>What&rsquo;s actually worth your money?</h3>
          <p>
            The answer hides across forty tabs, group chats, and gurus selling
            the basics as masterclasses. <strong>Finding and understanding an
            opportunity is a full-time job.</strong>
          </p>
        </div>
        <div className="pcard glass b" data-reveal="right" style={{ ["--d" as string]: "140ms" }}>
          <span className="pcard__tag">trust is broken</span>
          <h3>Decades of scams taught one lesson: stay out.</h3>
          <p>
            Crashes, Ponzis, and fine print pushed a generation to the
            sidelines — <strong>fewer than 2 in 100 adults invest</strong> in
            the capital market.
          </p>
        </div>
      </div>

      <p className="problem__punch" data-reveal="scale">
        So money sits still — <span className="grad-text">while prices don&rsquo;t.</span>
      </p>
    </div>
  </section>
);

/* ---------------- NUMBERS — access vs confidence ---------------- */
const STATS = [
  {
    num: <><span data-count="53">0</span><small>%</small></>,
    lede: <>of adults have a financial account. <strong>Access has arrived.</strong></>,
    src: "World Bank · Global Findex 2021",
  },
  {
    num: <>4<small> in </small>5</>,
    lede: <>adults lack basic financial literacy. <strong>Confidence hasn&rsquo;t.</strong></>,
    src: "S&P Global FinLit Survey",
  },
  {
    num: <>&lt;2<small>%</small></>,
    lede: <>of Bangladeshis invest in the capital market.</>,
    src: "CDBL · BO accounts",
  },
  {
    num: <>$<span data-count="30">0</span><small>B</small></>,
    lede: <>sent home yearly by Bangladeshis abroad — asking <strong>“now what?”</strong></>,
    src: "Bangladesh Bank · FY2025",
  },
];

export const Numbers = () => (
  <section className="sec numbers" id="numbers">
    <div className="wrap">
      <p className="eyebrow" data-reveal>the reality</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Access arrived. <span className="shimmer">Confidence didn&rsquo;t.</span>
      </h2>
      <div className="numbers__grid">
        {STATS.map((s, i) => (
          <div className="stat glass" key={s.src} data-reveal="scale" style={{ ["--d" as string]: `${i * 110}ms` }}>
            <div className="stat__num grad-text">{s.num}</div>
            <p className="stat__lede">{s.lede}</p>
            <p className="stat__src">{s.src}</p>
          </div>
        ))}
      </div>
      <p className="numbers__note" data-reveal>public sources · figures rounded</p>
    </div>
  </section>
);

/* ---------------- PRODUCT — agents scan, humans check, you decide ---------------- */
const FEED = [
  {
    tags: [["t1", "mutual fund"], ["t2", "halal ✓"]],
    h: "AIMS 1st Fund — NAV dips below 5-year average",
    p: "Dividend season is close. Here's what a NAV dip means — and doesn't.",
    why: "why it surfaced: value signal",
  },
  {
    tags: [["t2", "gold"], ["t3", "explainer"]],
    h: "Gold is up 4% this month",
    p: "The 2-minute version of inflation hedging — before you follow the crowd.",
    why: "agent found · human checked",
  },
  {
    tags: [["t1", "sanchaypatra"]],
    h: "Sanchaypatra rates revised",
    p: "Old vs new rates, compared. What changes if you already hold one.",
    why: "source: national savings directorate",
  },
  {
    tags: [["t3", "dse"], ["t2", "dividend"]],
    h: "GP declares 125% cash dividend",
    p: "What a dividend actually pays you — beginner math, real numbers.",
    why: "agent found · human checked",
  },
  {
    tags: [["t2", "habit"]],
    h: "Your emergency fund beats every tip",
    p: "Three months of expenses, parked safely — the boring move that wins.",
    why: "kosh fundamentals",
  },
];

const FeedCard = ({ c }: { c: (typeof FEED)[number] }) => (
  <article className="fcard">
    <div className="fcard__tags">
      {c.tags.map(([cls, t]) => (
        <i key={t} className={cls}>{t}</i>
      ))}
    </div>
    <h4>{c.h}</h4>
    <p>{c.p}</p>
    <div className="fcard__meta">
      <span>{c.why}</span>
      <b>✓✓</b>
    </div>
  </article>
);

const feedTilt = (e: { currentTarget: HTMLDivElement; clientX: number; clientY: number }) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.setProperty("--ry", `${x * 7}deg`);
  el.style.setProperty("--rx", `${-y * 7}deg`);
};
const feedTiltReset = (e: { currentTarget: HTMLDivElement }) => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

export const Product = () => (
  <section className="sec product" id="product">
    <div className="blob p" style={{ width: 460, height: 460, right: "-10%", top: "6%" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>how kosh works</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Agents find it. Humans check it. You get to decide.
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Our loop is simple:{" "}
        <strong>Discover → Verify → Understand → Practise → Invest.</strong>
      </p>

      <div className="product__grid">
        <div data-stagger="120">
          {[
            ["01", "Discover", "AI agents scan funds, gold, Sanchaypatra, and DSE filings around the clock, and surface what's actually worth your attention."],
            ["02", "Verify", "Every idea is checked against real sources and screened for scams. Humans supervise before anything reaches your feed."],
            ["03", "Understand", "Explainable AI tells you why it surfaced — in plain language, with the numbers shown. No jargon, no hype."],
            ["04", "Practise", "Paper-invest with real market data and zero risk, until the decision feels obvious instead of scary."],
            ["05", "Invest", "Act when you're ready, through disclosed partners. We never touch your money."],
          ].map(([n, h, p]) => (
            <div className="pstep" key={n} data-reveal="left">
              <span className="pstep__n">{n}</span>
              <div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            </div>
          ))}
          <p className="product__note" data-reveal="fade">
            <span className="dot" /> free for people · every partner disclosed · we never hold your funds
          </p>
        </div>

        <div
          className="feed"
          data-reveal="right"
          aria-label="Example of the Kosh discovery feed"
          onMouseMove={feedTilt}
          onMouseLeave={feedTiltReset}
        >
          <div className="feed__win">
            <div className="feed__track">
              {FEED.map((c) => <FeedCard key={c.h} c={c} />)}
              {FEED.map((c) => <FeedCard key={`${c.h}-2`} c={c} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- PILLARS — everything in one place ---------------- */
const PILLARS = [
  { icon: ShieldCheck, t: "Verified data", p: "Real numbers from real sources — never a made-up figure." },
  { icon: Sparkles, t: "Explainable AI", p: "Guidance that always shows its reasoning, in plain language." },
  { icon: ShieldAlert, t: "Scam detection", p: "Spot the Ponzi, the fake broker, and the too-good return." },
  { icon: Compass, t: "Personalised guidance", p: "Answers shaped by your income, goals, and level." },
  { icon: LineChart, t: "Paper investing", p: "Practise with real markets and zero risk." },
  { icon: PieChart, t: "Portfolio tools", p: "See what you own, what it costs, and what it earns." },
  { icon: Gamepad2, t: "Games", p: "Learn money the way you'd actually choose to." },
  { icon: MoonStar, t: "Shariah screening", p: "Halal filters built in, not bolted on." },
];

export const Pillars = () => (
  <section className="sec pillars" id="pillars">
    <div className="wrap">
      <p className="eyebrow" data-reveal>inside the app</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Everything you need, <span className="grad-text">in one place.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        The tools scattered across a dozen apps, brokers, and group chats —
        gathered into one loop that actually finishes.
      </p>
      <div className="pillars__grid" data-stagger="110">
        {PILLARS.map((c) => (
          <div className="pillar glass" key={c.t} data-reveal="scale">
            <div className="pillar__icon"><c.icon size={21} strokeWidth={1.9} /></div>
            <h3>{c.t}</h3>
            <p>{c.p}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- WHO — for the ones who haven't started ---------------- */
export const Who = () => (
  <section className="sec who" id="who">
    <div className="wrap">
      <div className="who__inner">
        <p className="eyebrow" data-reveal>who it&rsquo;s for</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          For the ones who haven&rsquo;t started.
        </h2>
        <ul className="who__lines">
          {[
            "Watched from the sidelines for years.",
            "Set up a DPS in 2021 — never looked again.",
            "Burned once. Trust nothing now.",
            "Waiting until it “feels safe”.",
          ].map((l, i) => (
            <li key={l} data-reveal style={{ ["--d" as string]: `${i * 70}ms` }}>{l}</li>
          ))}
          <li className="hot" data-reveal style={{ ["--d" as string]: "300ms" }}>
            Meanwhile, markets move daily — and <em>waiting has a price.</em>
          </li>
        </ul>
        <p className="who__close" data-reveal>
          We start with the people traditional finance leaves behind or
          overwhelms — <strong>students and freelancers, RMG workers,
          immigrants, diaspora communities, and first-time investors.</strong>
        </p>
        <span className="who__tag" data-reveal>
          the next generation of retail investors starts here
        </span>
      </div>
    </div>
  </section>
);

/* ---------------- INCLUSION / CSR — literacy → inclusion, SDGs ---------------- */
const AUDIENCES = [
  {
    icon: Factory,
    t: "Garment & factory workers",
    p: "Cash at the gate becomes a savings habit that outlasts the shift.",
  },
  {
    icon: Flower2,
    t: "Working women",
    p: "Money someone else managed becomes independence of her own.",
  },
  {
    icon: Bike,
    t: "Gig & delivery riders",
    p: "An income that changes daily meets a plan that stays steady.",
  },
  {
    icon: Laptop,
    t: "Freelancers",
    p: "Feast-or-famine invoices turn into a runway they can count on.",
  },
  {
    icon: HardHat,
    t: "Blue-collar & day workers",
    p: "Surviving the month becomes building past it.",
  },
];

const TEACH = [
  ["Where the money goes", "Budgeting that survives an irregular, cash-in-hand income."],
  ["Pay yourself first", "Turning a daily wage into a balance that actually grows."],
  ["The safety net", "A buffer built before the emergency — not borrowed after it."],
  ["Money you can trust", "Wallets, banks, and knowing what’s genuinely safe."],
  ["Breaking the debt cycle", "Spotting the loan that’s designed to trap you."],
  ["The first taka invested", "The small, confident step from saving to owning."],
];

const SDGS = [
  ["1", "No Poverty", "#E5243B"],
  ["4", "Quality Education", "#C5192D"],
  ["5", "Gender Equality", "#FF3A21"],
  ["8", "Decent Work & Growth", "#A21942"],
  ["10", "Reduced Inequalities", "#DD1367"],
];

export const Inclusion = () => (
  <section className="sec inclusion" id="inclusion">
    <div className="blob m" style={{ width: 440, height: 440, left: "-10%", top: "4%" }} />
    <div className="blob p" style={{ width: 400, height: 400, right: "-8%", bottom: "6%", animationDelay: "-9s" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>sustainability · financial inclusion</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Literacy today. <span className="grad-text">Inclusion tomorrow.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "160ms" }}>
        Financial confidence shouldn&rsquo;t depend on your collar, your gender,
        or your payslip. Kosh reaches the people the system overlooked — factory
        floors, delivery routes, home offices — and walks them from their first
        budget to their first investment.
      </p>

      {/* literacy → inclusion path */}
      <div className="incl__path" data-reveal="scale">
        <div className="incl__node">
          <span>today</span>
          <b>We teach the concepts</b>
          <p>Free, plain-language personal finance — built for real Bangladeshi wages and lives.</p>
        </div>
        <div className="incl__arrow" aria-hidden="true"><ArrowRight size={22} strokeWidth={2.2} /></div>
        <div className="incl__node hot">
          <span>tomorrow</span>
          <b>We open the door</b>
          <p>Accounts, safe savings, and first investments — inclusion, not just information.</p>
        </div>
      </div>

      {/* who we bring in */}
      <h3 className="incl__h" data-reveal>Who we&rsquo;re bringing in</h3>
      <div className="incl__who" data-stagger="100">
        {AUDIENCES.map((a) => (
          <article className="ic glass" key={a.t} data-reveal="scale">
            <div className="ic__icon"><a.icon size={21} strokeWidth={1.9} /></div>
            <h4>{a.t}</h4>
            <p>{a.p}</p>
          </article>
        ))}
      </div>

      {/* what we teach */}
      <h3 className="incl__h" data-reveal>What we put in their hands</h3>
      <ul className="tlist" data-stagger="80">
        {TEACH.map(([t, d]) => (
          <li key={t} data-reveal="left">
            <b>{t}</b>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {/* SDG alignment */}
      <div className="incl__sdg">
        <p className="incl__sdg-label" data-reveal>Aligned with the UN Sustainable Development Goals</p>
        <div className="incl__sdg-row" data-stagger="90">
          {SDGS.map(([n, name, color]) => (
            <span className="sdg" key={n} data-reveal="scale" style={{ background: color }}>
              <b>{n}</b>
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  </section>
);
