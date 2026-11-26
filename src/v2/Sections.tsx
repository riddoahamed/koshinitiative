import {
  ShieldAlert,
  Compass,
  PieChart,
  MoonStar,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { KOSH_APP_URL } from "@/lib/links";
import { PROMISE_CHIPS } from "./copy";

/* ---------------- PROMISE — the one line, said plainly ----------------
   First thing after the hero. One sentence a beginner understands, one
   sentence explaining how, and the low-commitment door as the primary CTA. */
export const Pitch = () => (
  <section className="sec about" id="about">
    <div className="wrap" data-stagger="110">
      <p className="eyebrow" data-reveal>what kosh does</p>
      <h2 className="h-display" data-reveal>
        We take you from <span className="grad-text">“where do I start?”</span>{" "}
        to your first real investment.
      </h2>
      <p className="h-sub" data-reveal>
        Free lessons in simple words. Practise with pretend money on real
        prices. Then see your real options side by side, fees and all,
        and <strong>decide for yourself.</strong>
      </p>
      <div className="about__ctas" data-reveal="scale">
        <a className="btn btn-primary" href="/bd/start">Learn something free</a>
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
/* Each door opens the real app (guest mode, no sign-up) on the feature it
   names, with a real screen of it on the card. A taste, not a page about it. */
const DOORS = [
  {
    shot: "/img/app/check.webp",
    kicker: "1 minute",
    t: "What kind of investor am I?",
    p: "A few taps about your life and money. Everything after it is tuned to you.",
    href: `${KOSH_APP_URL}/check`,
    cta: "Start the check",
  },
  {
    shot: "/img/app/learn.webp",
    kicker: "2 minutes a lesson",
    t: "Learn it like a game",
    p: "Short lessons with XP, streaks and mini-games like Scam Spotter. Lesson one is waiting.",
    href: `${KOSH_APP_URL}/learn`,
    cta: "Start lesson one",
  },
  {
    shot: "/img/app/arcade.webp",
    kicker: "10 games",
    t: "Play with money",
    p: "Fly Doggesh through a candle chart, swipe on pitches, play the scammer. Zero real money.",
    href: `${KOSH_APP_URL}/play`,
    cta: "Open the arcade",
  },
];

export const Paths = () => (
  <section className="sec paths" id="start">
    <div className="wrap">
      <p className="eyebrow" data-reveal>start here</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        &ldquo;If I were to start investing today&hellip;&rdquo;
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Get a taste of how Kosh teaches: short, simple, and played like a game.
        Tap one and you&rsquo;re in the app. No sign-up.
      </p>
      <div className="paths__grid" data-stagger="120">
        {DOORS.map((d) => (
          <a className="door" key={d.t} href={d.href} data-reveal="scale">
            <div className="door__shot" aria-hidden="true">
              <img src={d.shot} alt="" loading="lazy" decoding="async" />
            </div>
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

/* ---------------- KOSH LEARN — the paid, deeper path ----------------
   The homepage still leads with free learning. This is the next door for
   someone who wants a guided programme, a live room, or a programme for a
   child or team — without making the main promise feel like an upsell. */
export const KoshLearnTeaser = () => (
  <section className="sec learn-teaser" id="offerings">
    <div className="wrap">
      <div className="learn-teaser__head" data-stagger="100">
        <div>
          <p className="eyebrow" data-reveal>kosh learn</p>
          <h2 className="h-display" data-reveal>
            Learn alone. Learn live. <span className="grad-text">Bring the people you care about.</span>
          </h2>
        </div>
        <p className="h-sub" data-reveal>
          Structured courses, live webinar cohorts, money lessons for children,
          and practical sessions for workplaces — all in the plain language Kosh is known for.
        </p>
      </div>
      <div className="learn-teaser__grid" data-stagger="90">
        <a href="/bd/offerings/courses" className="learn-teaser__card glass" data-reveal="scale">
          <BookOpen size={21} strokeWidth={1.8} />
          <b>Courses + cohorts</b>
          <span>Self-paced foundations and live guided programmes.</span>
        </a>
        <a href="/bd/offerings/kids" className="learn-teaser__card glass" data-reveal="scale">
          <MoonStar size={21} strokeWidth={1.8} />
          <b>Money for kids</b>
          <span>Earn, save, grow and protect — with a parent nearby.</span>
        </a>
        <a href="/bd/offerings/workplace" className="learn-teaser__card glass" data-reveal="scale">
          <ShieldAlert size={21} strokeWidth={1.8} />
          <b>Kosh at work</b>
          <span>Useful money education for real working lives.</span>
        </a>
      </div>
      <a className="learn-teaser__link" href="/bd/offerings" data-reveal>
        See everything Kosh Learn offers <ArrowRight size={16} strokeWidth={2.2} />
      </a>
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
    src: "S&P Global FinLit Survey · 2014",
  },
  {
    num: <><span data-count="53">0</span><small>%</small></>,
    lede: <>already have a financial account</>,
    src: "World Bank · Global Findex 2021",
  },
];

export const Problem = ({ homepage = false }: { homepage?: boolean }) => (
  <section className="sec problem" id="problem">
    <div className="wrap">
      <p className="eyebrow" data-reveal>the problem</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Everyone tells you to invest. Nobody tells you <span className="grad-text">how.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "160ms" }}>
        The info is out there, spread across forty tabs and group chats. Then
        there are the trading &ldquo;gurus&rdquo; who don&rsquo;t understand
        how markets work, selling the basics for &#2547;4,000&ndash;5,000 and
        calling it a masterclass. You can&rsquo;t tell who to trust.
      </p>

      <div className="problem__cards">
        <div className="pcard glass a" data-reveal="left">
          <span className="pcard__tag">nobody shows you the how</span>
          <h3>What&rsquo;s actually worth your money?</h3>
          <p>
            Finding a good option, checking it and understanding it takes
            hours. <strong>So most people never start.</strong>
          </p>
        </div>
        <div className="pcard glass b" data-reveal="right" style={{ ["--d" as string]: "140ms" }}>
          <span className="pcard__tag">and trust is broken</span>
          <h3>Decades of scams taught one lesson: stay out.</h3>
          <p>
            Share crashes, Ponzi schemes and hidden fine print scared a whole
            generation off. <strong>But staying out costs you too.</strong>
          </p>
        </div>
      </div>

      <div className="problem__stats" data-stagger="110">
        {/* the hero already says 98%; on the homepage the <2% stat would repeat it */}
        {(homepage ? STATS.slice(1) : STATS).map((s) => (
          <div className="mini" key={s.src} data-reveal="fade">
            <b className="grad-text">{s.num}</b>
            <span>{s.lede}</span>
            <i>{s.src}</i>
          </div>
        ))}
      </div>

      <p className="problem__punch" data-reveal="scale">
        So money sits still, <span className="grad-text">while prices don&rsquo;t.</span>
      </p>
    </div>
  </section>
);

/* ---------------- PRODUCT — agents scan, humans check, you decide ---------------- */

/* the four things that aren't already a step in the loop */
const EXTRAS = [
  { icon: ShieldAlert, t: "Scam detection" },
  { icon: Compass, t: "Personalised guidance" },
  { icon: PieChart, t: "Portfolio tools" },
  { icon: MoonStar, t: "Shariah screening" },
];

export const Product = () => (
  <section className="sec product" id="product">
    <div className="wrap">
      <p className="eyebrow" data-reveal>how kosh works</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Agents find it. Humans check it. You get to decide.
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Five steps, in this order, every time:{" "}
        <strong>Discover → Verify → Understand → Practise → Invest.</strong>
      </p>

      <ol className="loop" data-stagger="90">
        {[
          ["01", "Discover", "Every day, our AI reads the news and filings on funds, gold, Sanchaypatra and DSE shares, and picks out what matters."],
          ["02", "Verify", "Numbers come straight from the source, never made up by AI. If something looks off, a person checks it first."],
          ["03", "Understand", "Each card tells you, in simple words, why it's there. No jargon, no hype."],
          ["04", "Practise", "Practise with pretend money on real prices, until it stops feeling scary."],
          ["05", "Invest", "When you're ready, we show where and how to open the real thing. We never touch your money."],
        ].map(([n, h, p]) => (
          <li className="loop__step" key={n} data-reveal="fade">
            <span className="loop__n">{n}</span>
            <h3>{h}</h3>
            <p>{p}</p>
          </li>
        ))}
      </ol>

      <div className="product__extras" data-reveal="fade">
        {EXTRAS.map((e) => (
          <span key={e.t}><e.icon size={14} strokeWidth={2} />{e.t}</span>
        ))}
      </div>
      <p className="product__note" data-reveal="fade">
        <span className="dot" /> free to start · nothing pays to appear · we never hold your funds
      </p>
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
            "Set up a DPS in 2021. Never looked at it again.",
            "Burned once. Trust nothing now.",
            "Waiting until it “feels safe”.",
          ].map((l, i) => (
            <li key={l} data-reveal style={{ ["--d" as string]: `${i * 70}ms` }}>{l}</li>
          ))}
          <li className="hot" data-reveal style={{ ["--d" as string]: "300ms" }}>
            Meanwhile, markets move daily, and <em>waiting has a price.</em>
          </li>
        </ul>

        <div className="who__aud" data-reveal="fade">
          {AUDIENCE.map((a) => <span key={a}>{a}</span>)}
        </div>

        <div className="incl__path" data-reveal="scale">
          <div className="incl__node">
            <span>today</span>
            <b>We teach the concepts</b>
            <p>Free, plain-language money lessons, built for real Bangladeshi wages and lives.</p>
          </div>
          <div className="incl__arrow" aria-hidden="true"><ArrowRight size={22} strokeWidth={2.2} /></div>
          <div className="incl__node hot">
            <span>tomorrow</span>
            <b>We open the door</b>
            <p>Accounts, safe savings, and first investments. Inclusion, not just information.</p>
          </div>
        </div>

        <a className="who__learnlink" href="/learn" data-reveal>
          The lessons are public. Read them without an account
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
