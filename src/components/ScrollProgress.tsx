import { useEffect, useState } from "react";

/**
 * Sticky scroll progress indicator with brand gradient.
 * Sits just below the hero; visible only after the user starts scrolling.
 */
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      setProgress(p);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const pct = progress * 100;

  return (
    <div
      aria-hidden
      className="fixed top-14 left-0 right-0 z-40 h-[3px] bg-white/5 backdrop-blur-sm pointer-events-none"
    >
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(90deg, hsl(156 85% 62%), hsl(85 95% 65%), hsl(270 95% 65%))",
          boxShadow:
            "0 0 12px hsl(156 85% 62% / 0.7), 0 0 20px hsl(270 95% 65% / 0.4)",
        }}
      />
      {/* glowing dot at the end */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-[left] duration-150 ease-out"
        style={{
          left: `calc(${pct}% - 4px)`,
          background: "hsl(85 95% 70%)",
          boxShadow:
            "0 0 12px hsl(85 95% 65% / 0.9), 0 0 24px hsl(156 85% 62% / 0.6)",
          opacity: pct > 0.5 ? 1 : pct * 2,
        }}
      />
    </div>
  );
};

export default ScrollProgress;
