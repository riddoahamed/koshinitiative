import { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { QUESTIONS, scoreQuiz, type Choice, type Profile } from "@/v2/quiz";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /quiz ────────────────────────────────────────────────────────────────────
   "What kind of investor am I?" — six questions, sixty seconds.
   Deliberately ends on a lesson, never on a product. Orientation, not advice. */

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Choice[]>([]);
  const [result, setResult] = useState<Profile | null>(null);

  const pick = (c: Choice) => {
    const next = [...answers.slice(0, step), c];
    setAnswers(next);
    if (step === QUESTIONS.length - 1) {
      setResult(scoreQuiz(next));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const q = QUESTIONS[step];
  const pct = result ? 100 : (step / QUESTIONS.length) * 100;

  return (
    <PageShell
      title="What kind of investor am I?"
      description="A 60-second, six-question read on where you actually stand as a first-time investor in Bangladesh — your buffer, your income, and how you'd really react to a bad month. Free, no account, no advice pitch."
      path="/quiz"
    >
      <section className="sec page-hero quizsec">
        <div className="blob p" style={{ width: 480, height: 480, right: "-12%", top: "-8%" }} />
        <div className="blob m" style={{ width: 380, height: 380, left: "-8%", bottom: "0%", animationDelay: "-7s" }} />
        <div className="wrap">
          {!result ? (
            <>
              <p className="eyebrow" data-reveal>60 seconds · 6 questions</p>
              <h2 className="h-display quiz__h" data-reveal style={{ ["--d" as string]: "70ms" }}>
                What kind of investor am I?
              </h2>
              <p className="h-sub" data-reveal style={{ ["--d" as string]: "130ms" }}>
                Not a personality test. Six honest questions about your buffer,
                your income and what you&rsquo;d really do on a red month, plus a
                straight answer about where to start.
              </p>

              <div className="quiz" data-reveal="scale">
                <div className="quiz__bar" aria-hidden="true">
                  <span style={{ width: `${pct}%` }} />
                </div>
                <div className="quiz__count">
                  Question {step + 1} of {QUESTIONS.length}
                </div>

                <h3 className="quiz__q" key={q.id}>{q.q}</h3>
                {q.note && <p className="quiz__note">{q.note}</p>}

                <div className="quiz__choices">
                  {q.choices.map((c) => (
                    <button className="qchoice" key={c.label} onClick={() => pick(c)}>
                      <span>{c.label}</span>
                      <ArrowRight size={16} strokeWidth={2.2} />
                    </button>
                  ))}
                </div>

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
            <div className={`result acc-${result.accent}`}>
              <p className="eyebrow" data-reveal>your result</p>
              <h2 className="h-display result__name" data-reveal style={{ ["--d" as string]: "60ms" }}>
                {result.name}
              </h2>
              <p className="result__line" data-reveal style={{ ["--d" as string]: "120ms" }}>
                {result.line}
              </p>
              <p className="result__meaning" data-reveal style={{ ["--d" as string]: "180ms" }}>
                {result.meaning}
              </p>

              <h3 className="result__h" data-reveal>Do these three, in this order</h3>
              <ol className="result__steps" data-stagger="100">
                {result.steps.map((s, i) => (
                  <li key={s.t} data-reveal="left">
                    <b>{i + 1}</b>
                    <div>
                      <h4>{s.t}</h4>
                      <p>{s.p}</p>
                      <a
                        className="result__cta"
                        href={s.href}
                        {...(s.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      >
                        {s.cta} <ArrowRight size={14} strokeWidth={2.4} />
                      </a>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="result__caution" data-reveal="fade">
                <b>One caution.</b> {result.caution}
              </p>

              <div className="result__foot" data-reveal="fade">
                <a className="btn btn-primary" href={KOSH_APP_URL} target="_blank" rel="noreferrer">
                  Do all three in the app — Try Kosh <ArrowRight size={16} strokeWidth={2.4} />
                </a>
                <a className="btn btn-glass" href="/start">See the full starting path</a>
                <button className="btn btn-ghost" onClick={restart}>
                  <RotateCcw size={15} /> Take it again
                </button>
              </div>

              <p className="disclaim">
                Educational only. This is orientation, not personalised financial
                advice. Kosh is not a licensed adviser and never takes custody
                of your money.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Quiz;
