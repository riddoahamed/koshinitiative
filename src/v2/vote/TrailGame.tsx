import { useState } from "react";
import { randomTip, type Tip } from "./data";
import { taka } from "./wallet";

/* ============================================================
   THE LEDGER TRAIL, eight steps, three stones each, one gives way.
   Every step multiplies. Bank whenever you like. The trap that ends
   your run is always a real market risk, named.
   ============================================================ */

const ROWS = 8;
const TILES = 3;
/* fair step is 1.5x on 2-in-3 odds; 1.45 keeps a ~3% edge, like the real world */
const STEP_MULT = 1.45;

const HAZARDS = [
  "Margin call",
  "Regulatory halt",
  "Fraud revealed",
  "Liquidity dried up",
  "Rate shock",
  "Earnings miss",
  "Panic selling",
  "Currency shock",
];

type Phase = "idle" | "climbing" | "dead" | "banked";

const multAt = (step: number) => Math.pow(STEP_MULT, step);

type Props = {
  balance: number;
  onStake: (n: number) => void;
  onSettle: (payout: number, didBank: boolean) => void;
};

const TrailGame = ({ balance, onStake, onSettle }: Props) => {
  const [phase, setPhase] = useState<Phase>("idle");
  const [stake, setStake] = useState(1000);
  const [step, setStep] = useState(0);
  const [traps, setTraps] = useState<number[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [deadAt, setDeadAt] = useState<{ row: number; tile: number; hazard: string } | null>(null);
  const [tip, setTip] = useState<Tip | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const begin = () => {
    const s = Math.min(stake, balance);
    if (s <= 0) return;
    setStake(s);
    onStake(s);
    setTraps(Array.from({ length: ROWS }, () => Math.floor(Math.random() * TILES)));
    setPicked([]);
    setStep(0);
    setDeadAt(null);
    setTip(null);
    setResult(null);
    setPhase("climbing");
  };

  const pick = (tile: number) => {
    if (phase !== "climbing") return;
    const row = step;
    if (tile === traps[row]) {
      const hazard = HAZARDS[row % HAZARDS.length];
      setDeadAt({ row, tile, hazard });
      setPhase("dead");
      setResult(0);
      setTip(randomTip());
      onSettle(0, false);
      return;
    }
    const nextStep = row + 1;
    setPicked((p) => [...p, tile]);
    setStep(nextStep);
    if (nextStep >= ROWS) {
      const payout = stake * multAt(ROWS);
      setPhase("banked");
      setResult(payout);
      setTip(randomTip());
      onSettle(payout, true);
    }
  };

  const bank = () => {
    if (phase !== "climbing" || step === 0) return;
    const payout = stake * multAt(step);
    setPhase("banked");
    setResult(payout);
    setTip(randomTip());
    onSettle(payout, true);
  };

  const live = phase === "climbing";
  const presets = [500, 1000, 2500, 5000];
  const rowsTopDown = Array.from({ length: ROWS }, (_, i) => ROWS - 1 - i);

  return (
    <div className="game">
      <div className="game__head">
        <div>
          <h3>The Ledger Trail</h3>
          <p>Eight steps. One stone in each row gives way.</p>
        </div>
        <div className="trail__mult">
          <b>{multAt(step).toFixed(2)}×</b>
          <em>{live ? taka(stake * multAt(step)) : "step multiplier"}</em>
        </div>
      </div>

      <div className={`trail ${phase}`}>
        {rowsTopDown.map((row) => {
          const passed = row < step;
          const active = live && row === step;
          const isDeadRow = deadAt?.row === row;
          return (
            <div
              key={row}
              className={`trail__row${active ? " active" : ""}${passed ? " passed" : ""}`}
            >
              <span className="trail__label">{multAt(row + 1).toFixed(2)}×</span>
              {Array.from({ length: TILES }, (_, tile) => {
                const chosen = passed && picked[row] === tile;
                const revealTrap =
                  (phase === "dead" || phase === "banked") && traps[row] === tile;
                return (
                  <button
                    key={tile}
                    className={`stone${chosen ? " safe" : ""}${
                      revealTrap ? " trap" : ""
                    }${isDeadRow && deadAt?.tile === tile ? " hit" : ""}`}
                    disabled={!active}
                    onClick={() => pick(tile)}
                    aria-label={`Row ${row + 1}, stone ${tile + 1}`}
                  >
                    {chosen ? "✓" : revealTrap ? "✕" : ""}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {deadAt && (
        <p className="trail__hazard">
          Step {deadAt.row + 1}, <b>{deadAt.hazard}</b>. Run over, {taka(stake)} gone.
        </p>
      )}
      {phase === "banked" && (
        <p className="trail__hazard good">
          Banked at {multAt(step).toFixed(2)}×, <b>{taka(result || 0)}</b>.
        </p>
      )}

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
          >
            All in
          </button>
        </div>
        {live ? (
          <button className="btn btn-primary big" onClick={bank} disabled={step === 0}>
            {step === 0 ? "Take your first step" : `Bank ${taka(stake * multAt(step))}`}
          </button>
        ) : (
          <button className="btn btn-primary big" onClick={begin} disabled={balance <= 0}>
            {balance <= 0 ? "Out of paper money" : `Start the trail · ${taka(Math.min(stake, balance))}`}
          </button>
        )}
      </div>

      {tip && (
        <div className={`lesson ${phase === "dead" ? "bad" : "good"}`}>
          <span className="lesson__tag">
            {phase === "dead" ? "run ended" : "banked it"} · what just happened
          </span>
          <h4>{tip.t}</h4>
          <p dangerouslySetInnerHTML={{ __html: tip.p }} />
        </div>
      )}
    </div>
  );
};

export default TrailGame;
