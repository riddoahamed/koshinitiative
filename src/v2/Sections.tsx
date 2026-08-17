import {
  ShieldAlert,
  Compass,
  PieChart,
  MoonStar,
  ArrowRight,
  Target,
  BookOpen,
  Wallet,
} from "lucide-react";
import { KOSH_APP_URL } from "@/lib/links";
import { PROMISE_CHIPS } from "./copy";
import ShaderBg from "./ShaderBg";
import Starfield from "./Starfield";

/* ---------------- PROMISE — the one line, said plainly ----------------
   First thing after the hero. One sentence a beginner understands, one
   sentence explaining how, and the low-commitment door as the primary CTA. */
export const Pitch = () => (
  <section className="sec about" id="about">
    <ShaderBg />
    <div className="veil" aria-hidden="true" />
    <div className="wrap" data-stagger="110">
      <p className="eyebrow" data-reveal>what kosh does</p>
      <h2 className="h-display" data-reveal>
        We take you from <span className="grad-text">“where do I start?”</span>{" "}
        to your first real investment.
      </h2>
      <p className="h-sub" data-reveal>
        Free lessons in plain language. Practice on real market prices with
        money that isn&rsquo;t real. Then one honest answer to the question
        every app dodges — <strong>what should I actually do?</strong>
      </p>
      <div className="about__ctas" data-reveal="scale">
        <a className="btn btn-primary" href="/start">Learn something free</a>
        <a className="btn btn-glass" href={KOSH_APP_URL}>Try Kosh</a>
      </div>
      <div className="about__chips" data-reveal="fade">
        {PROMISE_CHIPS.map((c) => <span key={c}>{c}</span>)}
      </div>
    </div>
  </section>
);

/* ---------------- PATHS — the beginner routes, made explicit ----------------
   The thing the site was missing: an actual door for someone who has never
   invested and doesn't want a pitch. Three, and they all really work. */
const DOORS = [
  {
    icon: Target,
    kicker: "60 seconds",
    t: "What kind of investor am I?",
    p: "Six honest questions. You get a straight read on where you actually stand — and what to do about it.",
    href: "/quiz",
    cta: "Take the quiz",
    accent: "a",
  },
  {
    icon: BookOpen,
    kicker: "2 minutes each",
    t: "Teach me one thing",
    p: "Six short lessons: what investing is, the buffer that comes first, Sanchaypatra vs DPS, funds, and how a scam here actually sounds.",
    href: "/learn",
    cta: "Read a lesson",
    accent: "b",
  },
  {
    icon: Wallet,
    kicker: "the whole path",
    t: "What do I do first?",
    p: "The full starting order, written out — from your first taka saved to your first real investment. No jargon, nothing sold.",
    href: "/start",
    cta: "See the path",
    accent: "c",
  },
];

export const Paths = () => (
  <section className="sec paths" id="start">
    <div className="blob m" style={{ width: 420, height: 420, right: "-8%", top: "10%" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>start here</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        &ldquo;If I were to start investing today&hellip;&rdquo;
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Pick the door that sounds like you. All three are free, none of them
        need an account, and every one of them ends with something you can
        actually do this week.
      </p>
      <div className="paths__grid" data-stagger="120">
        {DOORS.map((d) => (
          <a className={`door glass ${d.accent}`} key={d.t} href={d.href} data-reveal="scale">
            <div className="door__icon"><d.icon size={22} strokeWidth={1.9} /></div>
            <span className="door__kicker">{d.kicker}</span>
            <h3>{d.t}</h3>
            <p>{d.p}</p>
            <span className="door__cta">{d.cta} <ArrowRight size={15} strokeWidth={2.2} /></span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------- PROBLEM — two broken things, with the numbers folded in ---------------- */
const STATS = [
  {
    num: <>&lt;2<small>%</small></>,
    lede: <>of adults here invest in the capital market</>,
    src: "CDBL · BO accounts",
  },
  {
    num: <>4<small> in </small>5</>,
    lede: <>lack basic financial literacy</>,
    src: "S&P Global FinLit Survey",
  },
  {
    num: <><span data-count="53">0</span><small>%</small></>,
    lede: <>already have a financial account</>,
    src: "World Bank · Global Findex 2021",
  },
];

export const Problem = () => (
  <section className="sec problem" id="problem">
    <Starfield density={1.6} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>the problem</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Everyone tells you to invest. Nobody tells you <span className="grad-text">how.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "160ms" }}>
        The information isn&rsquo;t missing anymore. It&rsquo;s scattered across
        forty tabs, group chats, and gurus selling the basics as masterclasses —
        and you can&rsquo;t tell which half is lying.
      </p>

      <div className="problem__cards">
        <div className="pcard glass a" data-reveal="left">
          <span className="pcard__tag">nobody shows you the how</span>
          <h3>What&rsquo;s actually worth your money?</h3>
          <p>
            Finding one opportunity, checking it, and understanding it is a
            full-time job. <strong>So most people never get past deciding to
            decide.</strong>
          </p>
        </div>
        <div className="pcard glass b" data-reveal="right" style={{ ["--d" as string]: "140ms" }}>
          <span className="pcard__tag">and trust is broken</span>
          <h3>Decades of scams taught one lesson: stay out.</h3>
          <p>
            Crashes, Ponzis, and fine print pushed a whole generation to the
            sidelines — <strong>and staying out has a price nobody quotes
            you.</strong>
          </p>
        </div>
      </div>

      <div className="problem__stats" data-stagger="110">
        {STATS.map((s) => (
          <div className="mini" key={s.src} data-reveal="fade">
            <b className="grad-text">{s.num}</b>
            <span>{s.lede}</span>
            <i>{s.src}</i>
          </div>
        ))}
      </div>

      <p className="problem__punch" data-reveal="scale">
        So money sits still — <span className="grad-text">while prices don&rsquo;t.</span>
      </p>
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

/* the four things that aren't already a step in the loop */
const EXTRAS = [
  { icon: ShieldAlert, t: "Scam detection" },
  { icon: Compass, t: "Personalised guidance" },
  { icon: PieChart, t: "Portfolio tools" },
  { icon: MoonStar, t: "Shariah screening" },
];

export const Product = () => (
  <section className="sec product" id="product">
    <div className="blob p" style={{ width: 460, height: 460, right: "-10%", top: "6%" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>how kosh works</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Agents find it. Humans check it. You get to decide.
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Five steps, in this order, every time:{" "}
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
          <div className="product__extras" data-reveal="fade">
            {EXTRAS.map((e) => (
              <span key={e.t}><e.icon size={14} strokeWidth={2} />{e.t}</span>
            ))}
          </div>
          <p className="product__note" data-reveal="fade">
            <span className="dot" /> free to start · every partner disclosed · we never hold your funds
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

/* ---------------- IMPACT — who it's for + the inclusion case, merged ----------------
   Was two sections saying the same thing twice. One now: the lines that land,
   the people we start with, the literacy → inclusion path, and the SDGs. */
const AUDIENCE = [
  "Students",
  "Freelancers",
  "Garment & factory workers",
  "Gig & delivery riders",
  "Working women",
  "Day workers",
  "Diaspora & returnees",
  "First-time investors",
];

const SDGS = [
  ["1", "No Poverty", "#E5243B"],
  ["4", "Quality Education", "#C5192D"],
  ["5", "Gender Equality", "#FF3A21"],
  ["8", "Decent Work & Growth", "#A21942"],
  ["10", "Reduced Inequalities", "#DD1367"],
];

export const Impact = () => (
  <section className="sec who" id="inclusion">
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

        <div className="who__aud" data-reveal="fade">
          {AUDIENCE.map((a) => <span key={a}>{a}</span>)}
        </div>

        <div className="incl__path" data-reveal="scale">
          <div className="incl__node">
            <span>today</span>
            <b>We teach the concepts</b>
            <p>Free, plain-language money lessons — built for real Bangladeshi wages and lives.</p>
          </div>
          <div className="incl__arrow" aria-hidden="true"><ArrowRight size={22} strokeWidth={2.2} /></div>
          <div className="incl__node hot">
            <span>tomorrow</span>
            <b>We open the door</b>
            <p>Accounts, safe savings, and first investments — inclusion, not just information.</p>
          </div>
        </div>

        <a className="who__learnlink" href="/learn" data-reveal>
          The lessons are public — read them without an account
          <ArrowRight size={15} strokeWidth={2.2} />
        </a>

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
    </div>
  </section>
);
