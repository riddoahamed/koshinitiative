import { useEffect, useRef, useState } from "react";

/**
 * Anchored hero glow with subtle scroll-following ambience.
 * - Primary glow stays anchored to the top (hero area) and fades as you scroll.
 * - A soft secondary glow drifts subtly with scroll for cohesion across sections.
 */
const ScrollGlow = () => {
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      setProgress(p);
      rafRef.current = null;
    };

    const onScroll = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hero anchor glow: strong at top, fades as you scroll down.
  const heroOpacity = Math.max(0, 1 - progress * 1.4);
  // Subtle drifting secondary glow for cohesion.
  const driftX = Math.sin(t * 0.3) * 8;
  const driftY = Math.cos(t * 0.25) * 6;
  const hueB = 270 - progress * (270 - 156);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Anchored hero green glow */}
      <div
        className="absolute rounded-full blur-[160px]"
        style={{
          top: "-10vh",
          left: "50%",
          width: "85vw",
          height: "75vh",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, hsl(156 85% 62% / 0.28), hsl(156 85% 62% / 0) 70%)",
          opacity: heroOpacity,
          transition: "opacity 400ms ease-out",
        }}
      />
      {/* Subtle drifting secondary glow */}
      <div
        className="absolute rounded-full blur-[140px]"
        style={{
          top: `${50 + driftY}vh`,
          left: `calc(50% + ${driftX}vw)`,
          width: "55vw",
          height: "45vh",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, hsl(${hueB} 90% 60% / 0.10), hsl(${hueB} 90% 60% / 0) 70%)`,
          opacity: 0.6 + progress * 0.2,
        }}
      />
    </div>
  );
};

export default ScrollGlow;
