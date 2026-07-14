import { useEffect, useRef } from "react";

/* Interactive pixel starfield: brand-tinted stars that twinkle, drift,
   and swirl away from the cursor (the hover-reactive background ask).
   2D canvas, DPR-capped, pauses offscreen. */

const COLORS = [
  "255, 255, 255",
  "160, 245, 200", // mint
  "205, 250, 120", // lime
  "190, 150, 255", // purple
];

type Props = { density?: number; className?: string };

const Starfield = ({ density = 1, className = "" }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const still =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).has("still");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;
    type Star = {
      x: number; y: number; hx: number; hy: number;
      r: number; c: string; tw: number; ph: number; vx: number; vy: number;
    };
    let stars: Star[] = [];

    const seed = () => {
      const area = (W * H) / (dpr * dpr);
      const n = Math.round((area / 9000) * density);
      stars = Array.from({ length: n }, () => {
        const x = Math.random() * W;
        const y = Math.random() * H;
        return {
          x, y, hx: x, hy: y,
          r: (Math.random() < 0.82 ? 0.9 + Math.random() * 1.0 : 1.8 + Math.random()) * dpr,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          tw: 0.45 + Math.random() * 0.55,
          ph: Math.random() * Math.PI * 2,
          vx: 0, vy: 0,
        };
      });
    };
    const resize = () => {
      W = canvas.width = canvas.clientWidth * dpr;
      H = canvas.height = canvas.clientHeight * dpr;
      seed();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let mx = -9999, my = -9999;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) * dpr;
      my = (e.clientY - r.top) * dpr;
    };
    const onLeave = () => { mx = -9999; my = -9999; };
    const host = canvas.parentElement || canvas;
    host.addEventListener("pointermove", onMove as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(
      (es) => { visible = es[0]?.isIntersecting ?? true; },
      { rootMargin: "80px" }
    );
    io.observe(canvas);

    const R = 130 * dpr; // cursor influence radius
    /* reduced motion / still capture: one static frame, no loop */
    const drawStatic = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        ctx.fillStyle = `rgba(${s.c}, ${s.tw})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
    };
    if (still) {
      drawStatic();
      const roStill = new ResizeObserver(() => { resize(); drawStatic(); });
      roStill.observe(canvas);
      return () => {
        ro.disconnect();
        roStill.disconnect();
        io.disconnect();
        host.removeEventListener("pointermove", onMove as EventListener);
        host.removeEventListener("pointerleave", onLeave);
      };
    }

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = (performance.now() - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        // gentle repulsion from the cursor, spring back home
        const dx = s.x - mx, dy = s.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = ((R - d) / R) * 1.15 * dpr;
          s.vx += (dx / d) * f;
          s.vy += (dy / d) * f;
        }
        s.vx += (s.hx - s.x) * 0.012;
        s.vy += (s.hy - s.y) * 0.012;
        s.vx *= 0.90;
        s.vy *= 0.90;
        s.x += s.vx;
        s.y += s.vy;

        const a = s.tw * (0.55 + 0.45 * Math.sin(t * 1.7 + s.ph));
        ctx.fillStyle = `rgba(${s.c}, ${a})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [density]);

  return <canvas ref={ref} className={`starfield ${className}`} aria-hidden="true" />;
};

export default Starfield;
