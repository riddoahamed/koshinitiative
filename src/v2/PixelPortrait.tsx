import { memo, useEffect, useRef } from "react";
import { BASE, FACE_H, FACE_W, type Face } from "./persona/faces";

// ── The reveal ───────────────────────────────────────────────────────────────
// Drawn to a canvas at runtime from the text grids in data/persona/faces.ts, so
// no portrait is ever an image file — the whole cast costs a few kilobytes of
// source and scales to any size without going soft.
//
// `reveal` paints the pixels on in a diagonal sweep instead of appearing all at
// once. It is a few lines, and it turns the result screen from "here is your
// answer" into a moment worth waiting through, which is the entire reason
// anyone screenshots one of these.

interface Props {
  face: Face;
  /** Pixel size of one cell. 8 gives a 160px portrait. */
  scale?: number;
  /** Animate the pixels in. */
  reveal?: boolean;
  /** Whole-sweep duration, ms. */
  duration?: number;
  className?: string;
  label: string;
}

export const PixelPortrait = memo(function PixelPortrait({
  face, scale = 8, reveal = false, duration = 900, className, label,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Flatten the base plus every overlay into one grid first, so a layer drawn
    // later simply wins the cell — the sweep then has a finished picture to
    // reveal rather than re-compositing on every frame.
    const grid: Array<Array<string | null>> = Array.from(
      { length: FACE_H }, () => Array<string | null>(FACE_W).fill(null),
    );

    for (const layer of [BASE, ...face.layers]) {
      layer.rows.forEach((row, i) => {
        const y = layer.top + i;
        if (y < 0 || y >= FACE_H) return;
        for (let x = 0; x < Math.min(row.length, FACE_W); x++) {
          const ch = row[x];
          if (ch === ".") continue;
          if (face.palette[ch]) grid[y][x] = ch;
        }
      });
    }

    let raf = 0;
    const start = performance.now();
    // Diagonal sweep: a cell appears once the wavefront has passed it.
    const maxRank = FACE_W + FACE_H;

    const paint = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const front = progress * maxRank;
      for (let y = 0; y < FACE_H; y++) {
        for (let x = 0; x < FACE_W; x++) {
          const ch = grid[y][x];
          if (!ch) continue;
          if (x + y > front) continue;
          ctx.fillStyle = face.palette[ch];
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    };

    if (!reveal) { paint(1); return; }

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      paint(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [face, scale, reveal, duration]);

  return (
    <canvas
      ref={ref}
      width={FACE_W * scale}
      height={FACE_H * scale}
      className={className}
      style={{ imageRendering: "pixelated" }}
      role="img"
      aria-label={label}
    />
  );
});
