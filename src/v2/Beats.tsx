import { useEffect, useMemo, useRef, useState } from "react";

// ── The three playable beats ─────────────────────────────────────────────────
// Each of these replaces a question whose subject is an IMPULSE, and an impulse
// cannot be surveyed. "The market has fallen five days — what do you do?" asks
// you to predict yourself. Watching it fall five times, and being offered the
// sixth, asks you to be yourself, which is the only reading worth having.
//
// They share one contract: play the animation, then reveal the same three
// choices the scene cards use. Nothing here scores differently — the movement
// is doing the persuading, not the arithmetic.

/**
 * Shared: the choices, revealed once the beat has made its point.
 *
 * ── WHY THE CLASS IS A PROP ────────────────────────────────────────────────
 * This file is copied into the landing site, which has its own stylesheet and
 * no Tailwind. The first version hardcoded the app's utility classes, so on
 * koshbd.com the three game beats rendered their answers as bare browser
 * buttons — the games worked and looked broken. Each site passes the class its
 * own stylesheet knows and the two copies stay byte-identical.
 */
const APP_CHOICE =
  "w-full text-left rounded-2xl border border-border bg-card px-4 py-4 text-[15px] font-medium text-foreground/85 transition-all active:scale-[0.985] hover:border-foreground/25";

export function Choices({
  choices, onPick, shown, choiceClass = APP_CHOICE, listClass = "space-y-2.5",
}: {
  choices: Array<{ id: string; text: string }>;
  onPick: (id: string) => void;
  shown: boolean;
  choiceClass?: string;
  listClass?: string;
}) {
  return (
    <div
      className={`${listClass} transition-opacity duration-500`}
      style={{ opacity: shown ? 1 : 0, pointerEvents: shown ? "auto" : "none" }}
    >
      {choices.map((c) => (
        <button key={c.id} onClick={() => onPick(c.id)} className={choiceClass}>
          {c.text}
        </button>
      ))}
    </div>
  );
}

// ── 1 · The Streak — gambler's fallacy ───────────────────────────────────────
// Five red days arrive one at a time, about 380ms apart, and the sixth slot
// sits there empty and pulsing. The empty slot is the whole mechanic: it is the
// question "so what happens now?" asked without words, and it is the exact
// shape of the itch that makes people believe a fall is "due" to end.

const FALLS = [-2.1, -1.4, -3.2, -0.9, -2.6];

export function StreakBeat({ choices, onPick, choiceClass, listClass }: BeatProps) {
  const [shown, setShown] = useState(0);
  const done = shown >= FALLS.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 450 : 380);
    return () => clearTimeout(t);
  }, [shown, done]);

  // Cumulative fall, so the number under the chart moves with the bars.
  const total = useMemo(
    () => FALLS.slice(0, shown).reduce((a, b) => a + b, 0),
    [shown],
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-end justify-between gap-2 h-32">
          {FALLS.map((f, i) => {
            const on = i < shown;
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
                <span
                  className="text-[10px] font-bold tabular-nums transition-opacity duration-300"
                  style={{ opacity: on ? 1 : 0, color: "hsl(var(--kosh-red))" }}
                >
                  {f.toFixed(1)}%
                </span>
                <div
                  className="w-full rounded-t transition-all duration-500 ease-out"
                  style={{
                    height: on ? `${Math.abs(f) * 22}px` : "0px",
                    background: "hsl(var(--kosh-red) / 0.65)",
                  }}
                />
                <span className="text-[10px] text-foreground/30">D{i + 1}</span>
              </div>
            );
          })}

          {/* The sixth day. Empty, and asking. */}
          <div className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full">
            <span className="text-[10px] font-bold text-foreground/30">?</span>
            <div
              className="w-full rounded-t border border-dashed"
              style={{
                height: "36px",
                borderColor: done ? "hsl(var(--kosh-lime) / 0.6)" : "hsl(var(--border))",
                animation: done ? "pulse 1.6s ease-in-out infinite" : undefined,
              }}
            />
            <span className="text-[10px] font-bold" style={{ color: done ? "hsl(var(--kosh-lime))" : undefined }}>
              D6
            </span>
          </div>
        </div>

        <p className="mt-3 text-center text-sm font-bold tabular-nums" style={{ color: "hsl(var(--kosh-red))" }}>
          {total.toFixed(1)}% in five days
        </p>
      </div>

      <Choices choices={choices} onPick={onPick} shown={done} choiceClass={choiceClass} listClass={listClass} />
    </div>
  );
}

// ── 2 · The Crowd — herd behaviour ───────────────────────────────────────────
// The percentage climbs while you are deciding. A static "83% are buying this"
// is a fact and a fact can be argued with; a number that is still moving is a
// clock, and it produces the feeling the question is actually about. The dots
// fill in behind it so the number has a body.

const DOTS = 60;

export function CrowdBeat({ choices, onPick, choiceClass, listClass }: BeatProps) {
  const [pct, setPct] = useState(58);
  const [shown, setShown] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const DUR = 2600;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DUR);
      // Fast at first, then creeping — the shape of a thing everyone has
      // already decided, still pulling in the last few.
      setPct(58 + (89 - 58) * (1 - Math.pow(1 - t, 3)));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setShown(true);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const lit = Math.round((pct / 100) * DOTS);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5 text-center">
        <p className="text-5xl font-bold tabular-nums" style={{ color: "hsl(var(--kosh-lime))" }}>
          {pct.toFixed(0)}%
        </p>
        <p className="mt-1 text-xs text-foreground/45">of buyers went into the same share this week</p>

        <div className="mt-4 grid grid-cols-12 gap-1.5 justify-items-center">
          {Array.from({ length: DOTS }, (_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full transition-colors duration-200"
              style={{
                background: i < lit ? "hsl(var(--kosh-lime) / 0.85)" : "hsl(var(--muted))",
              }}
            />
          ))}
        </div>
      </div>

      <Choices choices={choices} onPick={onPick} shown={shown} choiceClass={choiceClass} listClass={listClass} />
    </div>
  );
}

// ── 3 · The Ticker — short-term trading ──────────────────────────────────────
// A price that keeps moving for as long as you look at it, and a profit that
// moves with it. The point is not which button you press. It is that pressing
// nothing is also a decision and the number keeps changing while you make it —
// which is the entire experience of holding something, compressed into eight
// seconds.

export function TickerBeat({ choices, onPick, choiceClass, listClass }: BeatProps) {
  const [pts, setPts] = useState<number[]>([100]);
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let n = 0;
    // Drifts up overall — the scene says "you're up six percent" — but never in
    // a straight line, because a straight line does not tempt anybody.
    timer.current = setInterval(() => {
      n += 1;
      setPts((p) => {
        const last = p[p.length - 1];
        const drift = 0.22;
        const noise = (Math.sin(n * 1.7) + Math.sin(n * 0.9) * 0.6) * 0.55;
        return [...p, Math.max(96, last + drift + noise)].slice(-40);
      });
      if (n === 10) setShown(true);
      if (n >= 34 && timer.current) clearInterval(timer.current);
    }, 240);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const first = pts[0];
  const last = pts[pts.length - 1];
  const changePct = ((last - first) / first) * 100;

  const lo = Math.min(...pts);
  const hi = Math.max(...pts);
  const path = pts
    .map((v, i) => {
      const x = (i / Math.max(1, pts.length - 1)) * 100;
      const y = 100 - ((v - lo) / Math.max(0.001, hi - lo)) * 100;
      return `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-foreground/40">Your position</span>
          <span className="text-2xl font-bold tabular-nums" style={{ color: "hsl(var(--kosh-lime))" }}>
            +{changePct.toFixed(2)}%
          </span>
        </div>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-3 h-28 w-full" aria-hidden="true">
          <path d={path} fill="none" stroke="hsl(var(--kosh-lime))" strokeWidth={1.6}
            vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </svg>

        <p className="text-center text-[11px] text-foreground/35">
          {shown ? "Still running." : "Watching…"}
        </p>
      </div>

      <Choices choices={choices} onPick={onPick} shown={shown} choiceClass={choiceClass} listClass={listClass} />
    </div>
  );
}

interface BeatProps {
  choices: Array<{ id: string; text: string }>;
  onPick: (id: string) => void;
  /** The class each site's stylesheet uses for an answer. See Choices. */
  choiceClass?: string;
  listClass?: string;
}
