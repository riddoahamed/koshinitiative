import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KOSH_APP_URL } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

/* Artwork geometry (fractions of the 1672x941 plate) */
const PLATE_W = 1672;
const PLATE_H = 941;
const MONITOR_CX = 0.665;
const MONITOR_CY = 0.46;
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
      const scale = Math.max(vw / PLATE_W, vh / PLATE_H) * 1.02;
      const sw = PLATE_W * scale;
      const sh = PLATE_H * scale;
      let left = vw / 2 - MONITOR_CX * sw;
      let top = vh / 2 - MONITOR_CY * sh;
      left = Math.min(0, Math.max(vw - sw, left));
      top = Math.min(0, Math.max(vh - sh, top));
      if (sw - vw < vw * 0.28) left = (vw - sw) / 2; // wide screens: keep the tiger
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
          Kosh. From “where do I start?” to your first real investment. Free
          money lessons, risk-free practice on real market prices, and honest
          answers. Starting in Bangladesh.
        </h1>

        <div ref={stageRef} className="hero__stage">
          <img
            className="hero__plate"
            src="/img/hero-plate-off.jpg"
            alt="A vintage KOSH computer resting in a Bangladeshi night landscape, with a tiger, river, bridge and port cranes behind it"
            draggable={false}
          />

          {/* the black screen itself: text written straight on the glass */}
          <div className={`crt ${phase === "off" ? "" : "on"} ${phase}`}>
            <div className="crt__beam" />

            {phase === "off" && (
              <button className="crt__hint" onClick={() => powerOn()} aria-label="Power on Kosh">
                <span className="crt__hint-in">
                  power on<em>tap the screen</em>
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
                  <a className="crt__cta" href="/start">Learn Something Free</a>
                  <a className="crt__cta" href={KOSH_APP_URL}>Try Kosh</a>
                </div>
              </div>
              <button className="crt__explore" onClick={explore}>
                Explore <span className="arr">⬇</span>
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
          <p className="hero__strap-vp">
            From <span>&ldquo;where do I start?&rdquo;</span> to your first real
            investment
          </p>
          <p className="hero__strap-sub">
            Free money lessons · risk-free practice on real prices · we never
            touch your money
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
