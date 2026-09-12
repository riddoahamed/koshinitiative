import { useRef, useState } from "react";

/* ── Scam or Not? ─────────────────────────────────────────────────────────────
   Three rounds, then a result that shows calibration rather than a score. The
   point of the exercise is not whether a student got two out of three; it is
   the distance between how sure they were and how right they were. That gap is
   what the programme measures, and it is the number a school has never seen
   before.

   ⚠ The wallet is "bPay", an invented brand, and it stays invented. Never
   reproduce a real payment provider's name, sender ID, logo or SMS wording
   here: that is trademark and defamation exposure, not a style preference. */

interface Round {
  from: string;
  meta: string;
  body: React.ReactNode;
  scam: boolean;
  why: string;
}

const ROUNDS: Round[] = [
  {
    from: "bPay · +880 1XXX-XXXXXX",
    meta: "SMS · today, 11:04",
    body: (
      <>
        Your account will be <b>suspended today</b>. Verify your PIN within 30 minutes to keep your
        balance safe.
      </>
    ),
    scam: true,
    why: "No wallet asks for your PIN. The thirty-minute clock is the tell — the urgency is the product.",
  },
  {
    from: "bPay · 16XXX",
    meta: "SMS · today, 14:22",
    body: (
      <>
        You have received <b>৳500</b> from 017XXXXXXXX. TrxID 8H2K9PQ4. Balance ৳2,340.
      </>
    ),
    scam: false,
    why: "It reports something that already happened, asks for nothing, and links nowhere. Suspicion is a skill, and it costs something when it fires at the wrong message.",
  },
  {
    from: "Growth Circle BD · group message",
    meta: "Forwarded 12 times",
    body: (
      <>
        <b>Guaranteed 12% every month</b>, paid every Friday. 400 members already joined. Seats close
        this week.
      </>
    ),
    scam: true,
    why: "Guaranteed and monthly do not belong in the same sentence. A return that cannot fall is usually being paid out of the next member's money.",
  },
];

const CONFIDENCE = [
  { label: "Guessing", v: 40 },
  { label: "Fairly sure", v: 70 },
  { label: "Certain", v: 95 },
];

interface Answer {
  saidScam: boolean;
  right: boolean;
  confidence: number;
}

const ScamOrNot = () => {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [pending, setPending] = useState<boolean | null>(null); // awaiting a confidence rating
  const [drag, setDrag] = useState(0);
  const startX = useRef<number | null>(null);

  const round = ROUNDS[i];
  const done = i >= ROUNDS.length;
  const showingVerdict = answers.length > i && pending === null;

  const call = (saidScam: boolean) => {
    if (pending !== null || showingVerdict || done) return;
    setPending(saidScam);
    setDrag(0);
  };

  const rate = (confidence: number) => {
    if (pending === null) return;
    setAnswers([...answers, { saidScam: pending, right: pending === round.scam, confidence }]);
    setPending(null);
  };

  const next = () => setI(i + 1);

  const restart = () => {
    setI(0);
    setAnswers([]);
    setPending(null);
  };

  /* Arrow keys are the desktop path, and they are bound to this card rather
     than to the window. On the window they also fired while somebody was
     dragging the allocation sliders next door with the keyboard, which
     answered this quiz behind their back. */
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); call(false); }
    if (e.key === "ArrowRight") { e.preventDefault(); call(true); }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    setDrag(e.touches[0].clientX - startX.current);
  };
  const onTouchEnd = () => {
    if (Math.abs(drag) > 60) call(drag > 0);
    else setDrag(0);
    startX.current = null;
  };

  if (done) {
    const correct = answers.filter((a) => a.right).length;
    const conf = Math.round(answers.reduce((s, a) => s + a.confidence, 0) / answers.length);
    const acc = Math.round((correct / answers.length) * 100);
    const gap = conf - acc;
    const surelyWrong = answers.filter((a) => !a.right && a.confidence >= 95).length;

    return (
      <div>
        <p className="fo-modlabel">Exercise two · the calibration</p>
        <div className="fo-scam">
          <div className="fo-scam__head">
            <span>Result</span>
            <span>3 of 3 answered</span>
          </div>
          <div className="fo-calib">
            <div className="fo-calib__i">
              <b className="fo-num">{acc}%</b>
              <span>accurate</span>
            </div>
            <div className="fo-calib__i">
              <b className="fo-num">{conf}%</b>
              <span>confident</span>
            </div>
            <div className="fo-calib__i fo-calib__i--gap">
              <b className="fo-num">
                {gap > 0 ? "+" : ""}
                {gap}
              </b>
              <span>point gap</span>
            </div>
          </div>
          <p style={{ fontSize: ".9rem", color: "rgba(255,255,255,.8)" }}>
            {gap > 10
              ? `You were surer than you were right${surelyWrong ? `, and certain on ${surelyWrong} you got wrong` : ""}. That distance is the thing the programme measures.`
              : gap < -10
                ? "You were better than you thought. Under-confidence costs money too — it is why people stay out of the market for a decade."
                : "Well calibrated. Your confidence matched your accuracy, which is rarer than getting them all right."}
          </p>
          <div className="fo-board__foot">
            <button className="fo-mini" onClick={restart}>
              Run it again
            </button>
          </div>
        </div>
        <p className="fo-sub">
          Every check in the programme records confidence alongside the answer. A cohort that is
          wrong and certain needs a different lesson from one that is right and unsure.
        </p>
      </div>
    );
  }

  const answer = answers[i];

  return (
    <div>
      <p className="fo-modlabel">Exercise two · spot it</p>
      <div
        className="fo-scam"
        tabIndex={0}
        onKeyDown={onKey}
        role="group"
        aria-label="Scam or not — three messages. Left arrow for real, right arrow for scam."
      >
        <div className="fo-scam__head">
          <span>
            Round {i + 1} of {ROUNDS.length}
          </span>
          <span>{round.meta}</span>
        </div>

        <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {ROUNDS.map((r, ri) => (
            <li key={r.from + ri} hidden={ri !== i}>
              <div
                className="fo-card"
                style={{ transform: drag ? `translateX(${drag * 0.4}px) rotate(${drag * 0.02}deg)` : undefined }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                <div className="fo-card__from">{r.from}</div>
                <div className="fo-card__body">{r.body}</div>
                <div className="fo-card__meta">{r.meta}</div>
              </div>
            </li>
          ))}
        </ol>

        {/* the call */}
        {pending === null && !showingVerdict && (
          <>
            <div className="fo-swipe">
              <button className="fo-swipe__no" onClick={() => call(false)}>
                Real
              </button>
              <button className="fo-swipe__yes" onClick={() => call(true)}>
                Scam
              </button>
            </div>
            <div className="fo-card__meta">Swipe, or focus this card and use ← and →.</div>
          </>
        )}

        {/* the confidence rating — this is what makes the result a calibration */}
        {pending !== null && (
          <div className="fo-conf">
            <div className="fo-conf__q">
              You said <b>{pending ? "scam" : "real"}</b>. How sure?
            </div>
            <div className="fo-chips">
              {CONFIDENCE.map((c) => (
                <button className="fo-chip" key={c.label} onClick={() => rate(c.v)}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* the verdict */}
        {showingVerdict && answer && (
          <>
            <div className={`fo-verdict ${answer.right ? "fo-verdict--right" : "fo-verdict--wrong"}`}>
              <b>
                {answer.right ? "Right." : "Not this one."} It was {round.scam ? "a scam" : "real"}.
              </b>{" "}
              {round.why}
            </div>
            <div className="fo-board__foot">
              <button className="fo-btn fo-btn--lime fo-btn--sm" onClick={next}>
                {i === ROUNDS.length - 1 ? "See the result" : "Next message"}
              </button>
            </div>
          </>
        )}
      </div>
      <p className="fo-sub">
        Three messages, ninety seconds. Students rate how sure they are, so the result shows
        calibration and not just a score.
      </p>
    </div>
  );
};

export default ScamOrNot;
