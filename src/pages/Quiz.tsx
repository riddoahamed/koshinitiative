import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { lazy, Suspense } from "react";
import { PixelPortrait, PixelGrid } from "@/v2/PixelPortrait";
import { CrowdBeat, StreakBeat, TickerBeat, Choices } from "@/v2/Beats";
import { VIGNETTES, VIG_H, VIG_W } from "@/v2/persona/vignettes";

/* three.js is ~700KB and this is a marketing site whose load time is its SEO.
   The 3D portrait only exists on the result, so it only downloads there — the
   homepage and every other page pay nothing for it. Until it arrives (or if
   WebGL is missing) the flat drawing stands, which is a complete result. */
const VoxelPortrait = lazy(() =>
  import("@/v2/VoxelPortrait").then((m) => ({ default: m.VoxelPortrait })));
import { ARCHETYPES, AXIS_LABEL, type Traits } from "@/v2/persona/archetypes";
import { SCENARIOS, type Scenario } from "@/v2/persona/scenarios";
import { AXES, classify, type Answers, type Result } from "@/v2/persona/engine";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /quiz — "What kind of investor am I?" ────────────────────────────────────
   Was six questions about your buffer and your income. That version asked you
   to rate yourself, which is the one thing nobody can do: people are poor at
   describing their own behaviour and very good at recognising it.

   Now it is eight scenes you have already lived through — a cousin at a wedding
   with a share that has tripled, salary day, a red week, a group chat twenty
   messages deep — and the only question is what you would actually do. The
   answer is a face, drawn pixel by pixel on a canvas, which is the part people
   screenshot.

   Same deck and same art as the app's /investor-type, copied rather than
   shared: these are two repos with two deploys and no package between them.
   quiz.test.ts pins the two copies together so they cannot drift silently. */

const CAST = ["compounder", "veteran", "momentum", "land"] as const;

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Result | null>(null);
  const [lead, setLead] = useState(0);

  useEffect(() => {
    if (result || step > 0) return;
    const t = setInterval(() => setLead((i) => (i + 1) % CAST.length), 1500);
    return () => clearInterval(t);
  }, [result, step]);

  const s = SCENARIOS[step];
  const pct = result ? 100 : (step / SCENARIOS.length) * 100;

  const pick = (choiceId: string) => {
    const next = { ...answers, [s.id]: choiceId };
    setAnswers(next);
    if (step === SCENARIOS.length - 1) {
      setResult(classify(next));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageShell path="/quiz">
      <section className="sec page-hero quizsec">
        <div className="blob p" style={{ width: 480, height: 480, right: "-12%", top: "-8%" }} />
        <div className="blob m" style={{ width: 380, height: 380, left: "-8%", bottom: "0%", animationDelay: "-7s" }} />
        <div className="wrap">
          {!result ? (
            <>
              <p className="eyebrow" data-reveal>8 scenes · about 90 seconds</p>
              <h2 className="h-display quiz__h" data-reveal style={{ ["--d" as string]: "70ms" }}>
                What kind of investor am I?
              </h2>
              <p className="h-sub" data-reveal style={{ ["--d" as string]: "130ms" }}>
                Not questions about yourself — eight moments you have already
                lived through. Say what you would actually do and you get a face.
              </p>

              {step === 0 && (
                <div className="persona-lead" data-reveal="scale">
                  <PixelPortrait
                    key={CAST[lead]}
                    face={ARCHETYPES[CAST[lead]].face}
                    scale={6}
                    reveal
                    duration={520}
                    label="An investor portrait"
                  />
                </div>
              )}

              <div className="quiz" data-reveal="scale">
                <div className="quiz__bar" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </div>
                <div className="quiz__count">
                  {step + 1} of {SCENARIOS.length}
                </div>

                <Beat s={s} onPick={pick} />

                {step > 0 && (
                  <button className="quiz__back" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={14} strokeWidth={2.2} /> back
                  </button>
                )}
              </div>

              <p className="quiz__priv">
                Nothing is stored and nothing is sent anywhere. Answers live in
                this browser tab and disappear when you close it.
              </p>
            </>
          ) : (
            <Reveal r={result} onRestart={restart} />
          )}
        </div>
      </section>
    </PageShell>
  );
};

/* This site's stylesheet owns the look of an answer — the shared Beats module
   must not assume the app's Tailwind classes. See Choices in v2/Beats.tsx. */
const beatProps = (s: Scenario, onPick: (id: string) => void) => ({
  choices: s.choices,
  onPick,
  choiceClass: "qchoice",
  listClass: "quiz__choices",
});

/* A scene shows its drawn vignette and three choices; the three impulse beats
   play instead. Same contract as the app — see data/persona/scenarios.ts. */
const Beat = ({ s, onPick }: { s: Scenario; onPick: (id: string) => void }) => (
  <>
    {s.beat === "scene" && s.image && VIGNETTES[s.image] && (
      <div className="persona-vignette">
        <PixelGrid
          rows={VIGNETTES[s.image].rows}
          palette={VIGNETTES[s.image].palette}
          width={VIG_W}
          height={VIG_H}
          scale={8}
          label={s.scene}
        />
      </div>
    )}

    <h3 className="quiz__q" key={s.id}>{s.scene}</h3>
    <p className="quiz__note">{s.ask}</p>

    {s.beat === "scene" && <Choices {...beatProps(s, onPick)} shown />}
    {s.beat === "streak" && <StreakBeat {...beatProps(s, onPick)} />}
    {s.beat === "crowd" && <CrowdBeat {...beatProps(s, onPick)} />}
    {s.beat === "ticker" && <TickerBeat {...beatProps(s, onPick)} />}
  </>
);

const Reveal = ({ r, onRestart }: { r: Result; onRestart: () => void }) => {
  const a = r.archetype;
  return (
    <div className={`result acc-${a.accent}`}>
      <p className="eyebrow" data-reveal>you are</p>

      <div className="persona-lead" data-reveal="scale">
        <Suspense fallback={<PixelPortrait face={a.face} scale={8} reveal duration={950} label={a.name} />}>
          <VoxelPortrait face={a.face} size={200} label={a.name} />
        </Suspense>
      </div>

      <h2 className="h-display result__name" data-reveal style={{ ["--d" as string]: "60ms" }}>
        {a.name}
      </h2>
      {a.nameLocal && <p className="persona-local" data-reveal>{a.nameLocal}</p>}
      <p className="result__line" data-reveal style={{ ["--d" as string]: "120ms" }}>
        {a.tagline}
      </p>
      <p className="result__meaning" data-reveal style={{ ["--d" as string]: "180ms" }}>
        {a.blurb}
      </p>

      <div className="persona-shape" data-reveal>
        {AXES.map((ax) => (
          <Axis key={ax} axis={ax} value={r.traits[ax]} />
        ))}
      </div>

      <h3 className="result__h" data-reveal>What it costs you</h3>
      <p className="result__meaning" data-reveal>{a.costs}</p>

      {a.tradition && (
        <p className="persona-tradition" data-reveal>{a.tradition}</p>
      )}

      <div className="persona-runner" data-reveal>
        <PixelPortrait face={r.runnerUp.face} scale={3} label={r.runnerUp.name} />
        <div>
          <span>You were nearly</span>
          <b>{r.runnerUp.name}</b>
        </div>
      </div>

      <a
        className="result__cta"
        href={`${KOSH_APP_URL}${a.next.href}`}
        target="_blank"
        rel="noreferrer"
      >
        {a.next.label} <ArrowRight size={14} strokeWidth={2.4} />
      </a>

      <button className="quiz__back" onClick={onRestart}>
        <RotateCcw size={14} strokeWidth={2.2} /> again
      </button>
    </div>
  );
};

const Axis = ({ axis, value }: { axis: keyof Traits; value: number }) => {
  const [lo, hi] = AXIS_LABEL[axis];
  /* Centred, because these axes have two ends and neither is the good one. */
  const half = Math.min(50, Math.abs(value) / 2);
  return (
    <div className="persona-axis">
      <div className="persona-axis__labels">
        <span className={value < 0 ? "on" : ""}>{lo}</span>
        <span className={value > 0 ? "on" : ""}>{hi}</span>
      </div>
      <div className="persona-axis__track">
        <i />
        <b style={{ left: value >= 0 ? "50%" : `${50 - half}%`, width: `${Math.max(2, half)}%` }} />
      </div>
    </div>
  );
};

export default Quiz;
