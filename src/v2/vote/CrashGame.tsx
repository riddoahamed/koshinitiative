import { useCallback, useEffect, useRef, useState } from "react";
import { randomTip, type Tip } from "./data";
import { taka } from "./wallet";

/* ============================================================
   IPO LAUNCH, a crash game, built to be enjoyed and then explained.
   The price line climbs; you bank before it breaks. 3% edge against you,
   exactly like the real thing. Paper money only.
   ============================================================ */

type Phase = "idle" | "running" | "crashed" | "banked";

const GROWTH = 0.00022; // per ms, ~2x at 3s, ~10x at 10s
const EDGE = 0.97;

const drawCrash = () => {
  const r = Math.random();
  return Math.min(60, Math.max(1, Math.floor((EDGE / (1 - r)) * 100) / 100));
};

type Props = {
  balance: number;
  onStake: (n: number) => void;
  onSettle: (payout: number, didBank: boolean) => void;
};

const CrashGame = ({ balance, onStake, onSettle }: Props) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stake, setStake] = useState(1000);
  const [mult, setMult] = useState(1);
  const [history, setHistory] = useState<number[]>([]);
  const [tip, setTip] = useState<Tip | null>(null);
  const [result, setResult] = useState<{ payout: number; at: number } | null>(null);

  const crashAt = useRef(2);
  const t0 = useRef(0);
  const raf = useRef(0);
  const pts = useRef<number[][]>([]);
  const phaseRef = useRef<Phase>("idle");
  phaseRef.current = phase;

  const stop = useCallback(() => cancelAnimationFrame(raf.current), []);
  useEffect(() => stop, [stop]);

  const endRound = useCallback(
    (banked: boolean, at: number) => {
      stop();
      const payout = banked ? stake * at : 0;
      setPhase(banked ? "banked" : "crashed");
      setResult({ payout, at });
      setHistory((h) => [at, ...h].slice(0, 12));
      setTip(randomTip());
      onSettle(payout, banked);
    },
    [stake, onSettle, stop]
  );

  const tick = useCallback(() => {
    const el = performance.now() - t0.current;
    const m = Math.exp(GROWTH * el);
    if (m >= crashAt.current) {
      setMult(crashAt.current);
      endRound(false, crashAt.current);
      return;
    }
    setMult(m);
    pts.current.push([el, m]);
    raf.current = requestAnimationFrame(tick);
  }, [endRound]);

  const launch = () => {
    const s = Math.min(stake, balance);
    if (s <= 0) return;
    setStake(s);
    onStake(s);
    crashAt.current = drawCrash();
    pts.current = [[0, 1]];
    t0.current = performance.now();
    setMult(1);
    setResult(null);
    setTip(null);
    setPhase("running");
    raf.current = requestAnimationFrame(tick);
  };

  const bank = () => {
    if (phaseRef.current !== "running") return;
    endRound(true, mult);
  };

  /* chart path */
  const maxM = Math.max(2, mult * 1.15);
  const maxT = Math.max(4000, (pts.current.at(-1)?.[0] || 0) * 1.05);
  const path = pts.current
    .map(([t, m], i) => {
      const x = (t / maxT) * 100;
      const y = 100 - ((m - 1) / (maxM - 1)) * 92;
      return `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  const presets = [500, 1000, 2500, 5000];
  const live = phase === "running";

  return (
    <div className="game">
      <div className="game__head">
        <div>
          <h3>IPO Launch</h3>
          <p>Bank before the listing breaks. Paper money.</p>
        </div>
        <div className="ticker" aria-label="recent crash points">
          {history.map((h, i) => (
            <span key={i} className={h < 2 ? "lo" : h < 5 ? "mid" : "hi"}>
              {h.toFixed(2)}×
            </span>
          ))}
        </div>
      </div>

      <div className={`chart ${phase}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="crashFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>
          {path && (
            <>
              <path d={`${path} L100,100 L0,100 Z`} fill="url(#crashFill)" stroke="none" />
              <path d={path} fill="none" stroke="currentColor" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
            </>
          )}
        </svg>
        <div className="chart__mult">
          <b>{mult.toFixed(2)}×</b>
          {phase === "crashed" && <em>broke at {result?.at.toFixed(2)}×</em>}
          {phase === "banked" && <em>banked {taka(result?.payout || 0)}</em>}
          {phase === "idle" && <em>set your stake</em>}
        </div>
      </div>

      <div className="game__controls">
        <div className="stakes">
          {presets.map((p) => (
            <button
              key={p}
              className={stake === p ? "on" : ""}
              disabled={live || p > balance}
              onClick={() => setStake(p)}
            >
              {taka(p)}
            </button>
          ))}
          <button
            className={stake === balance && balance > 0 ? "on danger" : "danger"}
            disabled={live || balance <= 0}
            onClick={() => setStake(balance)}
            title="Staking everything is how accounts end"
          >
            All in
          </button>
        </div>
        {live ? (
          <button className="btn btn-primary big" onClick={bank}>
            Bank {taka(stake * mult)}
          </button>
        ) : (
          <button className="btn btn-primary big" onClick={launch} disabled={balance <= 0}>
            {balance <= 0 ? "Out of paper money" : `Launch · ${taka(Math.min(stake, balance))}`}
          </button>
        )}
      </div>

      {tip && (
        <div className={`lesson ${phase === "crashed" ? "bad" : "good"}`}>
          <span className="lesson__tag">
            {phase === "crashed" ? "wiped that round" : "banked it"} · what just happened
          </span>
          <h4>{tip.t}</h4>
          <p dangerouslySetInnerHTML={{ __html: tip.p }} />
        </div>
      )}
    </div>
  );
};

export default CrashGame;
