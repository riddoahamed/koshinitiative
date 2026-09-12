import { useState } from "react";

/* ── The allocation board ─────────────────────────────────────────────────────
   "You have ৳10,000. Where does it go?" Six sliders that must total exactly
   100 before anything can be submitted — the constraint is the lesson, so the
   submit stays disabled rather than the split being corrected.

   Nothing is stored. No cookies, no localStorage, no per-allocation analytics:
   a student's split is theirs, and a page that quietly kept it would be a
   different product from the one the copy describes.

   Three rules the copy must keep: never show a correct answer, never grade the
   split, never use the word "should". The distribution and the consequences do
   the teaching.                                                              */

const POT = 10000;

const BUCKETS = [
  { k: "save", n: "Save", bn: "রাখা", fill: "", note: "kept, reachable" },
  { k: "grow", n: "Grow", bn: "বাড়ানো", fill: "fo-sl__fill--grow", note: "invested, locked a year" },
  { k: "spend", n: "Spend", bn: "খরচ", fill: "", note: "this week" },
  { k: "want", n: "Want", bn: "শখ", fill: "", note: "the one thing" },
  { k: "give", n: "Give", bn: "দান", fill: "fo-sl__fill--give", note: "zakat, sadaqah, a cause" },
  { k: "treat", n: "Treat", bn: "আপ্যায়ন", fill: "", note: "spent on someone else" },
] as const;

type Key = (typeof BUCKETS)[number]["k"];
type Split = Record<Key, number>;

const ZERO: Split = { save: 0, grow: 0, spend: 0, want: 0, give: 0, treat: 0 };

/* A fixed reference distribution, not live cohort data. Ten bins of ten
   percentage points, holding the share of a reference group that put that much
   into Grow. It is labelled as a reference cohort everywhere it is shown, and
   it stays a constant until there is real cohort data to replace it with —
   calling a made-up curve "your class" would be the one lie that discredits
   every other number on the page. */
const REFERENCE_GROW = [18, 24, 21, 14, 9, 6, 4, 2, 1, 1];

/* Long-run average, stated on screen next to the number it produces. Never
   presented as a projection, a forecast or a promise. */
const RATE = 0.08;
const YEARS = 10;

type Consequence =
  | { id: string; kind: "pick"; head: string; cost: number }
  | { id: string; kind: "choice"; head: string; options: [string, string]; outcomes: [string, string] };

const CONSEQUENCES: Consequence[] = [
  { id: "phone", kind: "pick", head: "Your phone screen cracks.", cost: 4000 },
  { id: "friend", kind: "pick", head: "A friend's family needs help.", cost: 2000 },
  {
    id: "fall",
    kind: "choice",
    head: "The thing in your Grow bucket falls 20%.",
    options: ["Leave it", "Move it out"],
    outcomes: [
      "It stays where it is. A year is a year, and the fall is only a number until you sell.",
      "You sold at the bottom. The loss stopped being a number and became money.",
    ],
  },
];

const taka = (n: number) => "৳" + Math.round(n).toLocaleString("en-IN");

const AllocationBoard = () => {
  const [pct, setPct] = useState<Split>(ZERO);
  const [spent, setSpent] = useState<Split>(ZERO);
  const [stage, setStage] = useState(0); // 0 = editing, 1..3 = panels revealed
  const [cqStep, setCqStep] = useState(0);
  const [shortfall, setShortfall] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<Record<string, string>>({});
  /* Which buckets each consequence was actually paid out of, in order. A cost
     is often covered by two of them, and an outcome line naming only the last
     one ("৳4,000 out of Spend" when Save paid half) quietly misreports the
     thing the exercise exists to show. */
  const [sources, setSources] = useState<Record<string, { name: string; amt: number }[]>>({});

  const total = BUCKETS.reduce((s, b) => s + pct[b.k], 0);
  const left = 100 - total;
  const submitted = stage > 0;

  const set = (k: Key, raw: number) => {
    const room = pct[k] + left;
    setPct({ ...pct, [k]: Math.max(0, Math.min(raw, room)) });
  };

  /* Reveal the three panels one at a time. The delay is the whole point — a
     student who sees the roll-forward at the same moment as the distribution
     reads neither. */
  const submit = () => {
    setStage(1);
    window.setTimeout(() => setStage(2), 400);
    window.setTimeout(() => setStage(3), 800);
  };

  const reset = () => {
    setPct(ZERO);
    setSpent(ZERO);
    setStage(0);
    setCqStep(0);
    setShortfall(null);
    setOutcomes({});
    setSources({});
  };

  const amount = (k: Key) => (pct[k] / 100) * POT;
  const balance = (k: Key) => amount(k) - spent[k];

  const growAmount = amount("grow");
  const rolled = growAmount * Math.pow(1 + RATE, YEARS);
  const bin = Math.min(9, Math.floor(pct.grow / 10));
  const below = REFERENCE_GROW.slice(0, bin).reduce((s, n) => s + n, 0);
  const peak = Math.max(...REFERENCE_GROW);

  /* Pay for a consequence out of one bucket. If the bucket cannot cover it we
     say so and let them pick again for the rest, rather than blocking the tap
     — being short is the honest outcome of the split, not an error state. */
  const payFrom = (k: Key, c: Extract<Consequence, { kind: "pick" }>) => {
    const already = (sources[c.id] ?? []).reduce((s, x) => s + x.amt, 0);
    const owing = c.cost - already;
    const took = Math.min(balance(k), owing);
    const rest = owing - took;
    const name = BUCKETS.find((b) => b.k === k)!.n;
    /* An empty bucket contributes nothing, so it does not earn a mention in
       the outcome line. */
    const next = took > 0 ? [...(sources[c.id] ?? []), { name, amt: took }] : sources[c.id] ?? [];

    setSpent({ ...spent, [k]: spent[k] + took });
    setSources({ ...sources, [c.id]: next });

    if (rest > 0) {
      setShortfall(
        took === 0
          ? `${name} is empty. The ${taka(rest)} has to come from somewhere else.`
          : `${name} covered ${taka(took)}. The other ${taka(rest)} has to come from somewhere else.`
      );
      return;
    }
    setShortfall(null);
    setOutcomes({
      ...outcomes,
      [c.id]: next.map((s) => `${taka(s.amt)} from ${s.name}`).join(", ") + ".",
    });
    setCqStep(cqStep + 1);
  };

  const choose = (c: Extract<Consequence, { kind: "choice" }>, i: 0 | 1) => {
    setOutcomes({ ...outcomes, [c.id]: c.outcomes[i] });
    setCqStep(cqStep + 1);
  };

  return (
    <div>
      <p className="fo-modlabel">Exercise one · the split</p>

      <div className="fo-board">
        <div className="fo-board__top">
          <div>
            <div className="fo-board__cap">You have</div>
            <div className="fo-board__amt fo-num">{taka(POT)}</div>
          </div>
          <div className={`fo-board__left ${left === 0 ? "fo-board__left--done" : "fo-board__left--open"}`}>
            <b className="fo-num">{left === 0 ? "100%" : `${left}%`}</b>
            {left === 0 ? "allocated" : "left to allocate"}
          </div>
        </div>

        {BUCKETS.map((b) => {
          const bal = balance(b.k);
          const drained = submitted && bal < amount(b.k);
          return (
            <div className="fo-sl" key={b.k}>
              <div className="fo-sl__top">
                <span className="fo-sl__name">
                  <label htmlFor={`fo-sl-${b.k}`}>
                    {b.n}
                    <span className="fo-sl__bn">{b.bn}</span>
                  </label>
                </span>
                <span className={`fo-sl__val fo-num ${drained ? "fo-sl__val--spent" : ""}`}>
                  {taka(drained ? bal : amount(b.k))} · {pct[b.k]}%
                </span>
              </div>
              <div className="fo-sl__track">
                <div
                  className={`fo-sl__fill ${b.fill}`}
                  style={{ width: `${(bal / POT) * 100}%` }}
                  aria-hidden="true"
                />
                <input
                  id={`fo-sl-${b.k}`}
                  className="fo-range"
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={pct[b.k]}
                  disabled={submitted}
                  onChange={(e) => set(b.k, Number(e.target.value))}
                  aria-label={`${b.n} — ${b.note}`}
                  aria-valuetext={`${pct[b.k]} percent, ${taka(amount(b.k))}`}
                />
              </div>
            </div>
          );
        })}

        <div className="fo-board__foot">
          {!submitted ? (
            <>
              <button className="fo-btn fo-btn--lime fo-btn--sm" onClick={submit} disabled={left !== 0}>
                Submit the split
              </button>
              <span style={{ fontSize: ".8rem", color: "rgba(255,255,255,.5)" }}>
                {left === 0 ? "Ready." : "Nothing submits until it adds to one hundred."}
              </span>
            </>
          ) : (
            <button className="fo-mini" onClick={reset}>
              Start again
            </button>
          )}
        </div>
      </div>

      <p className="fo-sub">
        Six buckets, not three. Save is money you keep; Grow is money that works. The constraint is
        the lesson.
      </p>

      {/* ── panel one — the distribution ───────────────────────────────── */}
      {stage >= 1 && (
        <div className="fo-res">
          <div className="fo-res__label">Where that sits</div>
          <div className="fo-res__big fo-num">{pct.grow}% to Grow</div>
          <p className="fo-res__sub">
            {below === 0
              ? "At or below where most of the reference cohort put it."
              : `More than about ${below}% of a reference cohort put into Grow.`}
          </p>
          <div className="fo-dist" role="img" aria-label={`Reference distribution of Grow allocations, yours in the ${bin * 10} to ${bin * 10 + 9} percent band`}>
            {REFERENCE_GROW.map((v, i) => (
              <i
                key={i}
                className={i === bin ? "fo-dist--you" : ""}
                style={{ height: `${(v / peak) * 100}%` }}
              />
            ))}
          </div>
          <div className="fo-distx">
            <span>Reference cohort · where you sit</span>
            <span>Grow allocation →</span>
          </div>
        </div>
      )}

      {/* ── panel two — the roll-forward ───────────────────────────────── */}
      {stage >= 2 && (
        <div className="fo-res">
          <div className="fo-res__label">Ten years on</div>
          <div className="fo-res__big fo-num">
            {taka(growAmount)} → {taka(rolled)}
          </div>
          <p className="fo-res__sub">
            Your Grow bucket at {Math.round(RATE * 100)}% a year for {YEARS} years — a long-run
            average, not a forecast and not a promise. The other five buckets are already gone.
          </p>
        </div>
      )}

      {/* ── panel three — the pressure test ────────────────────────────── */}
      {stage >= 3 && (
        <div className="fo-res">
          <div className="fo-res__label">Now the pressure test</div>
          {CONSEQUENCES.map((c, i) => {
            if (i > cqStep) return null;
            const done = Boolean(outcomes[c.id]);
            return (
              <div className={`fo-cq ${done ? "fo-cq--done" : ""}`} key={c.id}>
                <b>{c.head}</b>{" "}
                {c.kind === "pick" ? `${taka(c.cost)}. Which bucket?` : "Do you move it?"}
                {!done && c.kind === "pick" && (
                  <>
                    <div className="fo-chips">
                      {BUCKETS.map((b) => (
                        <button
                          className="fo-chip"
                          key={b.k}
                          onClick={() => payFrom(b.k, c)}
                          disabled={balance(b.k) <= 0}
                        >
                          {b.n}
                          <small className="fo-num">{taka(balance(b.k))}</small>
                        </button>
                      ))}
                    </div>
                    {shortfall && <div className="fo-outcome fo-outcome--short">{shortfall}</div>}
                  </>
                )}
                {!done && c.kind === "choice" && (
                  <div className="fo-chips">
                    {c.options.map((o, oi) => (
                      <button className="fo-chip" key={o} onClick={() => choose(c, oi as 0 | 1)}>
                        {o}
                      </button>
                    ))}
                  </div>
                )}
                {done && <div className="fo-outcome">{outcomes[c.id]}</div>}
              </div>
            );
          })}
          {cqStep >= CONSEQUENCES.length && (
            <p className="fo-res__sub">
              The assessment is what happened to the split under pressure — not whether they can
              define compound interest.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllocationBoard;
