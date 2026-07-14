import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";

gsap.registerPlugin(ScrollTrigger);

/* Artwork geometry (fractions of the 1672x941 plates) */
const PLATE_W = 1672;
const PLATE_H = 941;
const MONITOR_CX = 0.665;
const MONITOR_CY = 0.46;

/* off → (power) static → chest (the treasury menu art) → ui (text links on the black glass) */
type Phase = "off" | "static" | "chest" | "ui";

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
      stage.style.transformOrigin = `${MONITOR_CX * 100}% ${MONITOR_CY * 100}%`;
    };
    layout();
    const ro = new ResizeObserver(layout);
    if (heroRef.current) ro.observe(heroRef.current);
    return () => ro.disconnect();
  }, []);

  /* deep-linkable screen state (?crt=chest|ui) — also used for visual QA */
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("crt");
    if (s === "chest" || s === "ui") setPhase(s);
  }, []);

  /* ---------- power on: flicker + static, then the treasury appears ---------- */
  const powerOn = (fast = false) => {
    if (phaseRef.current !== "off") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || fast) {
      setPhase("chest");
      return;
    }
    setPhase("static");
    timers.current.push(window.setTimeout(() => setPhase("chest"), 560));
  };
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  /* ---------- scroll: chest → ui → release into the site ---------- */
  useEffect(() => {
    const wrapEl = wrapRef.current;
    const hero = heroRef.current;
    const stage = stageRef.current;
    const fade = fadeRef.current;
    if (!wrapEl || !hero || !stage || !fade) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: wrapEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              if (p > 0.06 && phaseRef.current === "off") powerOn(true);
              if (p > 0.38 && (phaseRef.current === "chest" || phaseRef.current === "static")) {
                setPhase("ui");
              } else if (p <= 0.34 && phaseRef.current === "ui") {
                setPhase("chest");
              }
            },
          },
        })
        .fromTo(
          stage,
          { scale: 1 },
          { scale: reduced ? 1 : 1.14, ease: "power1.inOut", duration: 1 }
        )
        .fromTo(fade, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power1.in" }, 0.78);
    }, wrapEl);

    return () => ctx.revert();
  }, []);

  const explore = () => {
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;
    window.scrollTo({
      top: wrapEl.offsetTop + wrapEl.offsetHeight - window.innerHeight * 0.5,
      behavior: "smooth",
    });
  };

  const booted = phase !== "off";

  return (
    <div ref={wrapRef} className="heroWrap" id="top">
      <header ref={heroRef} className={`hero ${phase}${booted ? " booted" : ""}`}>
        <h1 className="sr">
          Kosh — an AI-native financial decision and investment discovery
          platform for emerging markets, starting with Bangladesh.
        </h1>

        <div ref={stageRef} className="hero__stage">
          <img
            className="hero__plate"
            src="/img/hero-plate-off.jpg"
            alt="A vintage KOSH computer resting in a Bangladeshi night landscape — a tiger, river, bridge and port cranes behind it"
            draggable={false}
          />
          <img
            className="hero__chest"
            src="/img/hero-chest.jpg"
            alt=""
            aria-hidden="true"
            draggable={false}
          />

          {/* CRT glass */}
          <div className={`crt ${phase === "off" ? "" : "on"} ${phase}`}>
            <div className="crt__glow" />
            <div className="crt__static" />
            <div className="crt__beam" />

            {/* the screen IS the menu — text links blended into the glass */}
            <nav className="crt__ui" aria-label="Kosh menu">
              <div className="crt__top">
                <a className="crt__home" href="#vision">
                  <img src="/img/mascot.png" alt="" className="px" />
                  <span>Vision</span>
                </a>
                <div className="crt__nav">
                  <a href="#problem">The Problem</a>
                  <a href="#product">The Product</a>
                  <a href="#story">About Us</a>
                </div>
              </div>
              <div className="crt__mid">
                <a className="crt__cta" href={KOSH_APP_URL}>
                  Try The Beta App
                </a>
                <a className="crt__cta" href={KOSH_WAITLIST_EMAIL_URL}>
                  Join the Waitlist
                </a>
              </div>
              <button className="crt__explore" onClick={explore}>
                Explore <span className="arr">⬇</span>
              </button>
            </nav>

            <div className="crt__scan" />
            <div className="crt__vign" />
            <div className="crt__sheen" />
          </div>

          <button
            className="hero__power"
            aria-label="Power on the Kosh machine"
            onClick={() => powerOn()}
          />

          {/* annotation-style callout pointing at the K power badge */}
          <button className="hero__callout" onClick={() => powerOn()}>
            <span className="hero__callout-text">
              power on<em>explore kosh</em>
            </span>
            <span className="hero__callout-line" />
            <span className="hero__callout-tip">▸</span>
          </button>
        </div>

        <div className="hero__vign" />

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
