import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STAT_HOOK } from "./copy";
import { KOSH_APP_URL } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

/* Artwork geometry (fractions of the 1672x941 plate) */
const PLATE_W = 1672;
const PLATE_H = 941;
const MONITOR_CX = 0.665;
const MONITOR_CY = 0.46;
/* 50 cells so 2% lands on exactly one of them and the maths is honest */
const BOOT_CELLS = 50;

/* black-glass quad, as fractions of the stage (matches .crt in CSS) */
const GLASS_W = 0.246;
const GLASS_H = 0.376;

/* off → (click) boot flash → ui (menu written on the black screen)
   → dive (scroll zooms into the black screen; it takes over the viewport) */
type Phase = "off" | "boot" | "ui" | "dive";

const HeroMachine = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("off");
  const phaseRef = useRef<Phase>("off");
  phaseRef.current = phase;
  const timers = useRef<number[]>([]);

  /* ---------- layout: cover the viewport, monitor biased to center ---------- */
  useEffect(() => {
    const layout = () => {
      const stage = stageRef.current;
      const hero = heroRef.current;
      if (!stage || !hero) return;
      const vw = hero.clientWidth;
      const vh = hero.clientHeight;
      if (!vw || !vh) return;
      /* Two layouts, because one does not work for both shapes.

         WIDE: cover the viewport. The plate is 16:9 and so is a laptop, so
         covering costs almost nothing and the artwork fills the frame.

         NARROW: contain the monitor instead. Covering a 16:9 plate on a 9:19.5
         phone is driven entirely by the height term — it scaled the plate to
         roughly four times the viewport width, so the machine's sides were cut
         off and you got a slab of beige with no object in it. Here the scale is
         chosen from the GLASS, whose geometry we know exactly, so the monitor
         lands at a predictable size with real margin around it. The letterbox
         is invisible: .hero is already #04070f. */
      const narrow = vw < 760;
      let sw: number;
      let sh: number;
      let left: number;
      let top: number;

      if (narrow) {
        /* the black screen should occupy this much of the viewport width; the
           bezel and casing around it land at roughly 1.5x that, which is what
           leaves the margin */
        const GLASS_TARGET = 0.6;
        let scale = (vw * GLASS_TARGET) / (GLASS_W * PLATE_W);
        scale = Math.min(scale, (vh * 0.82) / PLATE_H); // never taller than the frame
        sw = PLATE_W * scale;
        sh = PLATE_H * scale;
        /* Horizontally: centre the MONITOR, because the machine sits off-centre
           in the artwork and centring the plate buries it behind the crop.
           Vertically: centre the PLATE, because the monitor's midpoint is at
           0.46 and centring on that pushed the whole image down, leaving a
           taller black band above it than below. */
        left = vw / 2 - MONITOR_CX * sw;
        top = (vh - sh) / 2;
        /* deliberately NOT clamped to the viewport edges: that clamp is what
           forces a cover fit, and a cover fit is the bug */
      } else {
        const scale = Math.max(vw / PLATE_W, vh / PLATE_H) * 1.02;
        sw = PLATE_W * scale;
        sh = PLATE_H * scale;
        left = vw / 2 - MONITOR_CX * sw;
        top = vh / 2 - MONITOR_CY * sh;
        left = Math.min(0, Math.max(vw - sw, left));
        top = Math.min(0, Math.max(vh - sh, top));
        if (sw - vw < vw * 0.28) left = (vw - sw) / 2; // wide screens: keep the tiger
      }
      stage.style.width = `${sw}px`;
      stage.style.height = `${sh}px`;
      stage.style.left = `${left}px`;
      stage.style.top = `${top}px`;
      /* zoom origin = the black-glass centre (so the dive goes *into* the screen) */
      stage.style.transformOrigin = `${(GLASS_W / 2 + 0.5428) * 100}% ${(GLASS_H / 2 + 0.269) * 100}%`;
    };
    layout();
    const ro = new ResizeObserver(layout);
    if (heroRef.current) ro.observe(heroRef.current);
    return () => ro.disconnect();
  }, []);

  /* deep-linkable screen state (?crt=ui) for QA */
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("crt");
    if (s === "ui" || s === "chest") setPhase("ui");
  }, []);

  /* ---------- power on: quick CRT beam, then the menu is written on screen ---------- */
  const powerOn = (fast = false) => {
    if (phaseRef.current !== "off") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || fast) {
      setPhase("ui");
      return;
    }
    setPhase("boot");
    timers.current.push(window.setTimeout(() => setPhase("ui"), 480));
  };
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  /* ---------- scroll: menu holds, then we dive into the black screen ---------- */
  useEffect(() => {
    const wrapEl = wrapRef.current;
    const hero = heroRef.current;
    const stage = stageRef.current;
    const fade = fadeRef.current;
    if (!wrapEl || !hero || !stage || !fade) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const diveScale = () => {
        const vw = hero.clientWidth, vh = hero.clientHeight;
        const gw = GLASS_W * stage.clientWidth;
        const gh = GLASS_H * stage.clientHeight;
        return Math.min(6, Math.max(vw / gw, vh / gh) * 1.16);
      };
      gsap
        .timeline({
          scrollTrigger: {
            trigger: wrapEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (p > 0.05 && phaseRef.current === "off") powerOn(true);
              if (p > 0.30 && phaseRef.current === "boot") setPhase("ui");
              if (p > 0.60 && phaseRef.current === "ui") setPhase("dive");
              else if (p <= 0.55 && phaseRef.current === "dive") setPhase("ui");
            },
          },
        })
        /* the dive: the black glass grows to fill the viewport */
        .to(stage, { scale: reduced ? 1 : diveScale, ease: "power2.in", duration: 0.45 }, 0.55)
        /* pure violet-black takes over → seamless handoff to the next section */
        .to(fade, { opacity: 1, ease: "power1.in", duration: 0.26 }, 0.72);
    }, wrapEl);

    return () => ctx.revert();
  }, []);

  const explore = () => {
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    window.scrollTo({
      top: wrapEl.offsetTop + wrapEl.offsetHeight + 2,
      behavior: "smooth",
    });
  };

  const booted = phase !== "off";

  return (
    <div ref={wrapRef} className="heroWrap" id="top">
      <header ref={heroRef} className={`hero ${phase}${booted ? " booted" : ""}`}>
        <h1 className="sr">
          Kosh. Learn money and investing, since we were never taught. Around
          98% of Bangladeshis have never opened a formal investment account.
        </h1>

        <div ref={stageRef} className="hero__stage">
          {/* 442 kB of JPEG on the critical path of every visit, preloaded, on
              a mostly-mobile Bangladeshi audience. WebP is 145 kB of the same
              picture; the <source> lets anything too old fall back. */}
          <picture>
            <source srcSet="/img/hero-plate-off.webp" type="image/webp" />
            <img
            className="hero__plate"
            src="/img/hero-plate-off.jpg"
            alt="A vintage KOSH computer resting in a Bangladeshi night landscape, with a tiger, river, bridge and port cranes behind it"
            draggable={false}
            />
          </picture>

          {/* the black screen itself: text written straight on the glass */}
          <div className={`crt ${phase === "off" ? "" : "on"} ${phase}`}>
            <div className="crt__beam" />

            {/* ── THE BOOT SCREEN ─────────────────────────────────────────
                A loading bar that never gets anywhere. It reads as the retro
                machine booting for about a second, and then you notice it is
                stopped at 2% and the number being shouted is the 98% that has
                not loaded — which is the share of Bangladeshi adults with no
                formal investment account.

                The emphasis is inverted on purpose: a progress bar normally
                celebrates the filled part, and the whole point here is the
                empty one. So the 2% is one dim cell and a small label, and
                the 98% is the large lime number with the live cells.

                The whole screen is the button, so a tap anywhere powers on. */}
            {phase === "off" && (
              <button className="crt__hint" onClick={() => powerOn()} aria-label="Power on Kosh">
                <span className="boot">
                  <span className="boot__top">
                    KOSH OS 1.0<i />
                  </span>

                  <span
                    className="boot__bar"
                    role="img"
                    aria-label="Loading bar stopped at 2 percent, 98 percent remaining"
                  >
                    {Array.from({ length: BOOT_CELLS }, (_, i) => (
                      <i
                        key={i}
                        className={i === 0 ? "on" : ""}
                        style={i === 0 ? undefined : { animationDelay: `${(BOOT_CELLS - i) * 42}ms` }}
                      />
                    ))}
                  </span>

                  <span className="boot__legend">
                    <span className="boot__small">2% loaded</span>
                    <b className="boot__big">98% remaining</b>
                  </span>

                  <span className="boot__stat">
                    ~98% of Bangladeshis don&rsquo;t invest formally
                  </span>
                  <span className="boot__line">
                    Since you were never taught about money, <em>let us.</em>
                  </span>

                  <span className="boot__press">press start<i /></span>
                </span>
              </button>
            )}
            <nav className="crt__ui" aria-label="Kosh menu">
              <div className="crt__top">
                <a className="crt__home" href="#vision">
                  <svg className="crt__binoc" viewBox="0 0 16 9" shapeRendering="crispEdges" aria-hidden="true">
                    <g fill="currentColor">
                      {/* left lens ring */}
                      <rect x="1" y="0" width="5" height="1" />
                      <rect x="1" y="8" width="5" height="1" />
                      <rect x="0" y="1" width="1" height="7" />
                      <rect x="6" y="1" width="1" height="7" />
                      {/* right lens ring */}
                      <rect x="10" y="0" width="5" height="1" />
                      <rect x="10" y="8" width="5" height="1" />
                      <rect x="9" y="1" width="1" height="7" />
                      <rect x="15" y="1" width="1" height="7" />
                      {/* bridge */}
                      <rect x="6" y="3" width="4" height="2" />
                    </g>
                  </svg>
                  <span>Vision</span>
                </a>
                <div className="crt__nav">
                  <a href="#problem">The Problem</a>
                  <a href="#product">The Product</a>
                  <a href="#story">About Us</a>
                  <a className="crt__fun" href="#funance">Funance</a>
                </div>
              </div>
              <div className="crt__mid">
                <div className="crt__ctas">
                  {/* "Learn Something Free" was removed from the glass: it was
                      the longest string on a ~225px screen and the only one
                      that wrapped. /start is still one tap away in the nav
                      under "If I started today", and the section below the
                      hero opens on it. One CTA on the screen also gives the
                      machine a single obvious thing to do. */}
                  <a className="crt__cta" href={KOSH_APP_URL}>Try Kosh</a>
                </div>
              </div>
              <button className="crt__explore" onClick={explore}>
                Explore{" "}
                <span className="arr">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 4v15m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </button>
            </nav>
          </div>

          <button
            className="hero__power"
            aria-label="Power on the Kosh machine"
            onClick={() => powerOn()}
          />

          {/* clean annotation callout → the K power badge */}
          <button className="hero__callout" onClick={() => powerOn()}>
            <span className="hero__callout-text">
              power on<em>explore kosh</em>
            </span>
            <span className="hero__callout-line" />
            <span className="hero__callout-tip">▸</span>
          </button>
        </div>

        <div className="hero__vign" />

        {/* The one line. Readable before the machine is even switched on:
            the site should never be a beautiful picture that says nothing. */}
        <div className="hero__strap">
          {/* The fact first. It is the same number as the "<2% invest" stat
              further down the page, read from the side that stops a scroll. */}
          <p className="hero__strap-stat">{STAT_HOOK}</p>
          <p className="hero__strap-vp">
            Learn money and investing, <span>since we were never taught.</span>
          </p>
          <p className="hero__strap-sub">
            Free lessons · risk-free practice on real prices · we never touch
            your money
          </p>
        </div>

        <div className="hero__scrollcue" aria-hidden="true">
          <span>scroll</span>
          <i />
        </div>

        <button className="hero__skip" onClick={() => { powerOn(true); explore(); }}>
          skip intro
        </button>

        <div ref={fadeRef} className="hero__fade" />
      </header>
    </div>
  );
};

export default HeroMachine;
