import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { KOSH_APP_URL } from "@/lib/links";
import { PLUS_TRIAL } from "./copy";

/* ── Nov 2026 refresh pieces ──────────────────────────────────────────────
   NumbersBar: the pitch as four facts, no adjectives. Every number is the
   current offer (see docs/site-audit-2026-11.md, "Fact check").
   Mission:    why Kosh exists, on paper.
   StickyCta:  one next step that follows you on a phone.                 */

const NUMBERS = [
  { n: "৳0", t: "for the whole learning path" },
  { n: "৳10,00,000", t: "to invest and trade with, simulated on real, live prices" },
  { n: "61", t: "two-minute lessons, from your first taka to a ten-year plan" },
  { n: "10", t: "money games, zero real money" },
];

export const NumbersBar = () => (
  <section className="numbers" aria-label="Kosh in numbers">
    <div className="wrap numbers__row" data-stagger="80">
      {NUMBERS.map((x) => (
        <div className="numbers__item" key={x.t} data-reveal="fade">
          <b>{x.n}</b>
          <span>{x.t}</span>
        </div>
      ))}
    </div>
  </section>
);

export const Mission = ({ story = true }: { story?: boolean }) => (
  <section className="sec mission paper-sec" id="mission">
    <div className="wrap">
      <p className="eyebrow" data-reveal>why we exist</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Bangladesh&rsquo;s first generation of{" "}
        <span className="grad-text">confident investors.</span>
      </h2>
      <ol className="mission__list" data-stagger="90">
        <li data-reveal="fade">
          <b>We break it down</b> until it makes sense, so you never have to
          trust anyone blindly.
        </li>
        <li data-reveal="fade">
          <b>We give you the tools</b>: the kind of analysis, tech and research
          professionals use.
        </li>
        <li data-reveal="fade">
          <b>We teach it free</b>, or at the lowest price we can, with educators
          who do this for a living.
        </li>
        <li data-reveal="fade">
          <b>You build wealth</b> for your family, without the fear.
        </li>
        <li data-reveal="fade">
          <b>The market gets better</b> when enough of us invest with confidence.
        </li>
      </ol>
      <div className="mission__ctas" data-reveal="fade">
        <a className="btn btn-primary" href={KOSH_APP_URL}>Explore the app free</a>
        {story && <a className="btn btn-glass" href="/about">Read our story</a>}
      </div>
      <p className="mission__trial" data-reveal="fade">{PLUS_TRIAL}</p>
    </div>
  </section>
);

export const StickyCta = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const fn = () => {
      const past = window.scrollY > window.innerHeight * 1.4;
      const end = window.innerHeight + window.scrollY > document.body.scrollHeight - 700;
      setOn(past && !end);
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <a className={`sticky-cta${on ? " on" : ""}`} href={KOSH_APP_URL} aria-hidden={!on} tabIndex={on ? 0 : -1}>
      Explore the app free <ArrowRight size={16} strokeWidth={2.4} />
      <small>no sign-up</small>
    </a>
  );
};
