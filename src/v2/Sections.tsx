import { BookOpen, Compass, PiggyBank, TrendingUp } from "lucide-react";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";

/* ---------------- ABOUT — one sentence, ambient video ---------------- */
export const About = () => (
  <section className="sec about" id="about">
    <div className="about__video" aria-hidden="true">
      <video src="/media/ambient.mp4" autoPlay muted loop playsInline />
    </div>
    <div className="blob p" style={{ width: 420, height: 420, left: "-8%", top: "10%" }} />
    <div className="blob m" style={{ width: 380, height: 380, right: "-6%", bottom: "0%", animationDelay: "-8s" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>what kosh is</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Better <span className="grad-text">decisions</span>, not more information.
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "160ms" }}>
        Kosh is an AI-native financial decision and investment discovery
        platform for emerging markets — starting with Bangladesh.
      </p>
      <div className="about__ctas" data-reveal style={{ ["--d" as string]: "240ms" }}>
        <a className="btn btn-primary" href={KOSH_APP_URL}>Try the beta</a>
        <a className="btn btn-glass" href={KOSH_WAITLIST_EMAIL_URL}>Join the waitlist</a>
      </div>
      <div className="about__chips" data-reveal style={{ ["--d" as string]: "320ms" }}>
        <span>Free for people</span>
        <span>AI-native</span>
        <span>Built in Dhaka</span>
      </div>
    </div>
  </section>
);

/* ---------------- PROBLEM — two broken things ---------------- */
export const Problem = () => (
  <section className="sec problem" id="problem">
    <div className="stars" aria-hidden="true" />
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
        <div className="pcard glass a" data-reveal>
          <span className="pcard__tag">discovery is broken</span>
          <h3>What&rsquo;s actually worth your money?</h3>
          <p>
            The answer hides across forty tabs, group chats, and gurus selling
            the basics as masterclasses. <strong>Finding and understanding an
            opportunity is a full-time job.</strong>
          </p>
        </div>
        <div className="pcard glass b" data-reveal style={{ ["--d" as string]: "120ms" }}>
          <span className="pcard__tag">trust is broken</span>
          <h3>Decades of scams taught one lesson: stay out.</h3>
          <p>
            Crashes, Ponzis, and fine print pushed a generation to the
            sidelines — <strong>fewer than 2 in 100 adults invest</strong> in
            the capital market.
          </p>
        </div>
      </div>

      <p className="problem__punch" data-reveal>
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
          <div className="stat glass" key={s.src} data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
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

export const Product = () => (
  <section className="sec product" id="product">
    <div className="blob p" style={{ width: 460, height: 460, right: "-10%", top: "6%" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>how kosh works</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Agents find it. Humans check it. You decide.
      </h2>

      <div className="product__grid">
        <div>
          {[
            ["01", "Agents scan the market", "AI agents read funds, gold, Sanchaypatra, and DSE filings — around the clock."],
            ["02", "Humans supervise", "Real people verify every idea before it ever reaches your feed."],
            ["03", "You get a digest, not a dump", "Opportunities arrive like content — short, visual, sourced, with the why attached."],
            ["04", "You decide", "Learn it, simulate it, act when you're ready. Nothing is ever pushed."],
          ].map(([n, h, p], i) => (
            <div className="pstep" key={n} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
              <span className="pstep__n">{n}</span>
              <div>
                <h3>{h}</h3>
                <p>{p}</p>
              </div>
            </div>
          ))}
          <p className="product__note" data-reveal>
            <span className="dot" /> free for people · partners disclosed · nothing sold to you
          </p>
        </div>

        <div className="feed" data-reveal aria-label="Example of the Kosh discovery feed">
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

/* ---------------- PILLARS — Learn Decide Save Invest ---------------- */
const PILLARS = [
  { icon: BookOpen, t: "Learn", p: "5-minute lessons and games, built for Bangladesh." },
  { icon: Compass, t: "Decide", p: "Guided answers to “what should I do with ৳X?”" },
  { icon: PiggyBank, t: "Save", p: "Goals, budgets, and habits that actually stick." },
  { icon: TrendingUp, t: "Invest", p: "Paper-trade first. Real steps when you're ready." },
];

export const Pillars = () => (
  <section className="sec pillars" id="pillars">
    <div className="wrap">
      <p className="eyebrow" data-reveal>inside the app</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Learn. Decide. Save. Invest.
      </h2>
      <div className="pillars__grid">
        {PILLARS.map((c, i) => (
          <div className="pillar glass" key={c.t} data-reveal style={{ ["--d" as string]: `${i * 80}ms` }}>
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
          Kosh brings first-timers and new investors in with confidence, not
          pressure — clear guidance, safe practice, honest products.
        </p>
        <span className="who__tag" data-reveal>
          the next generation of retail investors starts here
        </span>
      </div>
    </div>
  </section>
);
