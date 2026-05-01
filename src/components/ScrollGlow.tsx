import { useEffect, useRef, useState } from "react";

/**
 * A fixed, page-wide ambient glow that follows scroll progress.
 * - Moves vertically as the user scrolls (parallax-style).
 * - Shifts hue between accent (mint) and primary (purple) based on progress.
 * - Subtly drifts horizontally for a "free flowing" feel.
 */
const ScrollGlow = () => {
  const rafRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 across page scroll
  const [t, setT] = useState(0); // time-based drift

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
    let start = performance.now();
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

  // Vertical position: glow drifts from ~15vh down to ~75vh as you scroll.
  const topVH = 15 + progress * 60;
  // Horizontal drift: slow sine wave + slight scroll-based shift.
  const driftX = Math.sin(t * 0.35) * 12 + (progress - 0.5) * 18; // in vw
  // Hue rotates based on scroll between mint(156) and purple(270).
  const hueA = 156 + progress * (270 - 156); // primary glow
  const hueB = 270 - progress * (270 - 156); // secondary glow (opposite)
  // Subtle pulse on size.
  const pulse = 1 + Math.sin(t * 0.6) * 0.05;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute rounded-full blur-[140px] transition-[background-color] duration-700 ease-out"
        style={{
          top: `${topVH}vh`,
          left: `calc(50% + ${driftX}vw)`,
          width: `${70 * pulse}vw`,
          height: `${55 * pulse}vh`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, hsl(${hueA} 85% 62% / 0.22), hsl(${hueA} 85% 62% / 0) 70%)`,
          willChange: "top, left, background",
        }}
      />
      <div
        className="absolute rounded-full blur-[120px]"
        style={{
          top: `${100 - topVH}vh`,
          left: `calc(50% - ${driftX}vw)`,
          width: `${45 * pulse}vw`,
          height: `${40 * pulse}vh`,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, hsl(${hueB} 90% 60% / 0.16), hsl(${hueB} 90% 60% / 0) 70%)`,
          willChange: "top, left, background",
        }}
      />
    </div>
  );
};

export default ScrollGlow;
