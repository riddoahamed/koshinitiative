import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { KOSH_APP_URL } from "@/lib/links";

/* ── WHY KOSH: the things people buy Kosh for ─────────────────────────────
   Each line is a feature that is live in the app today (checked 26 Nov
   2026), and each card opens that feature in guest mode. No stock is ever
   named or recommended here.                                              */
const EDGES = [
  {
    t: "Trade like the pros",
    p: "Get ৳10,00,000 to invest and trade with, on real, live prices. Make your first mistakes here, not with your salary.",
    href: `${KOSH_APP_URL}/portfolio`,
    cta: "Open practice trading",
  },
  {
    t: "We do the hard work for you",
    p: "Our AI reads the filings and the news every day. A person checks the numbers. You get the short version in your feed.",
    href: KOSH_APP_URL,
    cta: "See the feed",
  },
  {
    t: "Every option in one place",
    p: "Savings, Sanchayapatra, gold, funds, DSE and global stocks, side by side. Nobody pays to be listed.",
    href: KOSH_APP_URL,
    cta: "Browse options",
  },
  {
    t: "Check an offer in ten seconds",
    p: "Saw an investment online? Screenshot it. Kosh tells you what it really pays and what it leaves out.",
    href: `${KOSH_APP_URL}/analyse`,
    cta: "Check an offer",
  },
  {
    t: "See what you'd really earn",
    p: "Fund returns after fees, over five years, three and one. Not the rate on the poster.",
    href: `${KOSH_APP_URL}/tools`,
    cta: "Open the fund screener",
  },
  {
    t: "Halal filter built in",
    p: "Screen funds for Shariah compliance in one tap, then compare their real returns side by side.",
    href: `${KOSH_APP_URL}/tools`,
    cta: "Try the filter",
  },
];

export const WhyKosh = () => (
  <section className="sec edge paper-sec" id="why">
    <div className="wrap">
      <p className="eyebrow" data-reveal>why kosh</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        We do the research. <span className="grad-text">You make the call.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        The tools and homework professionals use, in plain words, free to start.
        Tap any of these and you&rsquo;re in the app. No sign-up.
      </p>
      <div className="edge__grid" data-stagger="80">
        {EDGES.map((e) => (
          <a className="edge__card" key={e.t} href={e.href} data-reveal="fade">
            <h3>{e.t}</h3>
            <p>{e.p}</p>
            <span className="edge__cta">{e.cta} <ArrowRight size={15} strokeWidth={2.2} /></span>
          </a>
        ))}
      </div>
    </div>
  </section>
);

/* ── LEARN PATHS: the real path in the app, unit by unit ──────────────────
   Units, lesson counts and games are copied from app.koshfinance.com/learn
   (26 Nov 2026). If the app's path changes, change this list the same week.
   The row scrolls itself, stops when you touch or hover it, and can be
   swiped. With reduced motion it is a plain swipeable row.               */
const UNITS = [
  { n: 1, t: "Understand how money works", l: 8, eg: ["Four things we call investing", "Why your FDR is quietly losing", "Spot a scam in 60 seconds"], games: ["Scam Spotter", "IPO Launch"] },
  { n: 2, t: "Know where your money goes", l: 5, eg: ["Why your budgets keep failing", "Your bKash history is a budget", "Make salary day run itself"], games: ["Kosh Quest"] },
  { n: 3, t: "Handle debt without it handling you", l: 5, eg: ["Good debt, bad debt", "The minimum payment trap", "What the CIB knows about you"], games: [] },
  { n: 4, t: "Pay the right tax, legally", l: 5, eg: ["Do you owe tax?", "Investments that cut your tax", "Filing your return, step by step"], games: [] },
  { n: 5, t: "Choose where to keep your savings", l: 5, eg: ["Sanchayapatra, explained", "DPS: saving on autopilot", "Gold: know why you hold it"], games: [] },
  { n: 6, t: "Buy your first share", l: 8, eg: ["What a share really is", "Open your BO account", "Four numbers that matter"], games: ["Which Investor Are You?", "Candle Quest"] },
  { n: 7, t: "Stop your own brain losing you money", l: 6, eg: ["Why losses hurt twice as much", "Why crowds buy at the top", "Crypto, without the sermon"], games: ["The Ledger Trail", "Hot or Catfish"] },
  { n: 8, t: "Build a mix that fits you", l: 6, eg: ["How the pieces fit together", "Rent or buy: the real math", "Your mix at every age"], games: ["MonerPoly"] },
  { n: 9, t: "Make a plan for the next ten years", l: 5, eg: ["Turn a wish into a goal", "Your retirement number", "Your plan on one page"], games: ["Which Investor Are You?"] },
  { n: 10, t: "Grow what comes in", l: 8, eg: ["Steady pay from unsteady income", "Getting paid from abroad", "From earner to owner"], games: ["Scam Spotter", "Grand Trade Auto"] },
];
const LESSONS = UNITS.reduce((a, u) => a + u.l, 0); // 61

const UnitCard = ({ u, hidden }: { u: (typeof UNITS)[number]; hidden?: boolean }) => (
  <a
    className="unit"
    href={`${KOSH_APP_URL}/learn`}
    aria-hidden={hidden || undefined}
    tabIndex={hidden ? -1 : undefined}
  >
    <span className="unit__k">Unit {u.n} · {u.l} lessons</span>
    <h3>{u.t}</h3>
    <ul>
      {u.eg.map((x) => <li key={x}>{x}</li>)}
    </ul>
    {u.games.length > 0 && <span className="unit__games">+ {u.games.join(", ")}</span>}
  </a>
);

export const LearnPaths = () => {
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (new URLSearchParams(window.location.search).has("still")) return;
    let raf = 0;
    let paused = false;
    let resume = 0;
    let visible = false;
    let pos = row.scrollLeft;
    const hold = () => {
      paused = true;
      window.clearTimeout(resume);
    };
    const release = (ms = 2500) => {
      window.clearTimeout(resume);
      resume = window.setTimeout(() => { paused = false; pos = row.scrollLeft; }, ms);
    };
    const tick = () => {
      if (!paused && visible) {
        const half = row.scrollWidth / 2;
        pos += 0.5;
        if (pos >= half) pos -= half;
        row.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.1 });
    io.observe(row);
    /* Only a real mouse hover pauses it. A tap also fires hover events on a
       phone, and the "leave" never comes, so the row would stop for good. */
    const onEnter = (e: PointerEvent) => { if (e.pointerType === "mouse") hold(); };
    const onLeave = (e: PointerEvent) => { if (e.pointerType === "mouse") release(600); };
    const onDown = () => hold();
    const onUp = () => release();
    const onFocus = () => hold();
    const onBlur = () => release(600);
    const onScroll = () => { if (paused) pos = row.scrollLeft; };
    row.addEventListener("pointerenter", onEnter);
    row.addEventListener("pointerleave", onLeave);
    row.addEventListener("pointerdown", onDown);
    row.addEventListener("pointerup", onUp);
    row.addEventListener("pointercancel", onUp);
    row.addEventListener("touchstart", onDown, { passive: true });
    row.addEventListener("touchend", onUp, { passive: true });
    row.addEventListener("focusin", onFocus);
    row.addEventListener("focusout", onBlur);
    row.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resume);
      io.disconnect();
      row.removeEventListener("pointerenter", onEnter);
      row.removeEventListener("pointerleave", onLeave);
      row.removeEventListener("pointerdown", onDown);
      row.removeEventListener("pointerup", onUp);
      row.removeEventListener("pointercancel", onUp);
      row.removeEventListener("touchstart", onDown);
      row.removeEventListener("touchend", onUp);
      row.removeEventListener("focusin", onFocus);
      row.removeEventListener("focusout", onBlur);
      row.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="sec learnpath" id="start">
      <div className="wrap">
        <p className="eyebrow" data-reveal>learn investing, free</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          From your first taka to a <span className="grad-text">ten-year plan.</span>
        </h2>
        <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
          One path in the app, in order. Two-minute lessons with games along the
          way, and a test at the end of each unit you can pass to skip ahead.
        </p>
        <ul className="learnpath__facts" data-reveal="fade">
          <li><b>10</b> units</li>
          <li><b>{LESSONS}</b> lessons</li>
          <li><b>2 min</b> a lesson</li>
          <li><b>~2 months</b> at one a day</li>
        </ul>
      </div>
      <div className="learnpath__row" ref={rowRef} data-lenis-prevent-wheel="" aria-label="Units in the Kosh learning path">
        <div className="learnpath__track">
          {UNITS.map((u) => <UnitCard u={u} key={u.n} />)}
          {UNITS.map((u) => <UnitCard u={u} key={`b${u.n}`} hidden />)}
        </div>
      </div>
      <div className="wrap learnpath__ctas" data-reveal="fade">
        <a className="btn btn-primary" href={`${KOSH_APP_URL}/learn`}>Start unit 1 free</a>
        <a className="btn btn-glass" href={`${KOSH_APP_URL}/check`}>Not sure where to start? 1-min check</a>
      </div>
    </section>
  );
};
