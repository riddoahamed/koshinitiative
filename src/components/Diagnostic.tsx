import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";

type KnowledgeQ = {
  type: "knowledge";
  q: string;
  options: { label: string; correct?: boolean }[];
};
type BehaviorQ = { type: "behavior"; q: string };
type ConfidenceQ = { type: "confidence"; q: string };
type Question = KnowledgeQ | BehaviorQ | ConfidenceQ;

const questions: Question[] = [
  // Knowledge (5)
  {
    type: "knowledge",
    q: "Inflation মানে কী? (What does inflation mean?)",
    options: [
      { label: "Your salary increases (আপনার বেতন বাড়ে)" },
      { label: "The value of money goes down over time (টাকার মান সময়ের সাথে কমে যায়)", correct: true },
      { label: "Bank interest rates go up (ব্যাংকের সুদের হার বাড়ে)" },
      { label: "Stock prices fall (শেয়ারের দাম পড়ে যায়)" },
    ],
  },
  {
    type: "knowledge",
    q: "Compound interest (interest on interest) - এটা কীভাবে কাজ করে?",
    options: [
      { label: "You earn interest only on your original amount (শুধু মূল টাকার উপর সুদ পান)" },
      { label: "You earn interest on your original amount AND the interest already earned (মূল টাকা এবং আগে পাওয়া সুদ - দুটোর উপরই সুদ পান)", correct: true },
      { label: "Your bank charges you extra fees (ব্যাংক অতিরিক্ত ফি কাটে)" },
      { label: "Interest is paid only at the end of the year (সুদ শুধু বছর শেষে দেওয়া হয়)" },
    ],
  },
  {
    type: "knowledge",
    q: "Emergency fund রাখার standard advice কতো মাসের খরচ?",
    options: [
      { label: "1 month (১ মাস)" },
      { label: "1 year (১ বছর)" },
      { label: "3-6 months (৩-৬ মাস)", correct: true },
      { label: "10 months (১০ মাস)" },
    ],
  },
  {
    type: "knowledge",
    q: "DSE মানে কী?",
    options: [
      { label: "Dhaka Savings Exchange (ঢাকা সেভিংস এক্সচেঞ্জ)" },
      { label: "Dhaka Stock Exchange (ঢাকা স্টক এক্সচেঞ্জ)", correct: true },
      { label: "Digital Securities Entity (ডিজিটাল সিকিউরিটিজ এন্টিটি)" },
      { label: "Dhaka Sanchaypatra Exchange (ঢাকা সঞ্চয়পত্র এক্সচেঞ্জ)" },
    ],
  },
  {
    type: "knowledge",
    q: "Sanchaypatra (সঞ্চয়পত্র) কোথা থেকে কেনা যায়?",
    options: [
      { label: "Dhaka Stock Exchange (ঢাকা স্টক এক্সচেঞ্জ)" },
      { label: "Any private bank branch (যেকোনো প্রাইভেট ব্যাংকের শাখা)" },
      { label: "Bangladesh Bank or designated bank branches (বাংলাদেশ ব্যাংক বা নির্ধারিত ব্যাংক শাখা)", correct: true },
      { label: "bKash app (বিকাশ অ্যাপ)" },
    ],
  },
  // Behavior (5)
  { type: "behavior", q: "আপনি কি মাস শেষে review করেন, কোথায় টাকা গেছে? (Do you review where your money went at end of month?)" },
  { type: "behavior", q: "Income হাতে পাওয়ার পর save করেন, তারপর খরচ করেন? (Do you save before you spend, when your income arrives?)" },
  { type: "behavior", q: "কোনো বড় কেনাকাটার আগে কি research বা comparison করেন? (Do you research or compare before a big purchase?)" },
  { type: "behavior", q: "আপনার কি একটা emergency fund আছে যেটা আপনি regularly contribute করেন? (Do you have an emergency fund you regularly contribute to?)" },
  { type: "behavior", q: "Apni ki financial news ba money-related content follow/consume koren? (Do you follow or consume financial news or money-related content?)" },
  // Confidence (5)
  { type: "confidence", q: "Investing শুরু করতে বললে আপনি কতটা confident feel করবেন? (How confident would you feel if asked to start investing?)" },
  { type: "confidence", q: "Apnar monthly budget বানাতে কতটা confident? (How confident are you in building a monthly budget?)" },
  { type: "confidence", q: "কাউকে compound interest explain করতে পারবেন? (Could you explain compound interest to someone else?)" },
  { type: "confidence", q: "Stock market (share bazar) কীভাবে কাজ করে, কতটা বোঝেন? (How well do you understand how the stock market works?)" },
  { type: "confidence", q: "5 বছর পরের জন্য একটা basic financial plan বানাতে পারবেন? (Could you build a basic financial plan for 5 years from now?)" },
];

const behaviorOptions = [
  { label: "Never", value: 0 },
  { label: "Rarely", value: 25 },
  { label: "Sometimes", value: 50 },
  { label: "Often", value: 75 },
  { label: "Always", value: 100 },
];

const confidenceOptions = [
  { label: "1 — একদম না (Not at all)", value: 20 },
  { label: "2", value: 40 },
  { label: "3", value: 60 },
  { label: "4", value: 80 },
  { label: "5 — Very confident", value: 100 },
];

const Diagnostic = () => {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<"intro" | "questions" | "results">("intro");
  const [current, setCurrent] = useState(0);
  // answers[i] stores numeric score (0-100) for each question
  const [answers, setAnswers] = useState<(number | null)[]>(Array(15).fill(null));

  // Auto-open 1.5s after landing (once per session, respects popup dismissal)
  useEffect(() => {
    if (sessionStorage.getItem("kosh_diag_autoopened") === "1") return;
    if (sessionStorage.getItem("kosh_diag_popup_dismissed") === "1") return;
    const t = setTimeout(() => {
      sessionStorage.setItem("kosh_diag_autoopened", "1");
      setOpen(true);
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const reset = () => {
    setStage("intro");
    setCurrent(0);
    setAnswers(Array(15).fill(null));
  };

  const handleOpenChange = (o: boolean) => {
    setOpen(o);
    if (!o) reset();
  };

  const select = (score: number) => {
    const next = [...answers];
    next[current] = score;
    setAnswers(next);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1);
      } else {
        setStage("results");
      }
    }, 180);
  };

  const back = () => {
    if (current > 0) setCurrent(current - 1);
    else setStage("intro");
  };

  const avg = (arr: (number | null)[]) => {
    const valid = arr.filter((x): x is number => x !== null);
    if (!valid.length) return 0;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
  };

  const knowledgeScore = avg(answers.slice(0, 5));
  const behaviorScore = avg(answers.slice(5, 10));
  const confidenceScore = avg(answers.slice(10, 15));
  const totalScore = Math.round((knowledgeScore + behaviorScore + confidenceScore) / 3);

  const level =
    totalScore <= 35
      ? { title: "Curious — let's build the map", message: "You're exactly who Kosh is built for. The foundation is coming." }
      : totalScore <= 65
      ? { title: "Oriented — let's structure it", message: "You've got instincts. Now let's give them structure." }
      : { title: "Structured — you're ahead of most", message: "Solid foundation. The next level is about putting it to work." };

  const goWaitlist = () => {
    setOpen(false);
    setTimeout(() => {
      const el = document.getElementById("join");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  const q = questions[current];

  return (
    <section id="diagnostic" className="bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-kosh-muted/20">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#0D2B27] border border-kosh-mint/20 rounded-2xl p-8 md:p-12 text-center shadow-xl">
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
            Quick check-in
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-4 tracking-tight">
            What's your financial health score?
          </h2>
          <p className="text-kosh-muted text-sm md:text-base leading-relaxed mb-8">
            15 questions across knowledge, habits, and confidence. No grades. Just clarity.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 bg-kosh-mint text-[#0D2B27] font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#02C39A" }}
          >
            Find out in 6 minutes →
          </button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="max-w-2xl w-[calc(100vw-2rem)] sm:w-full p-0 border-0 bg-[#0D2B27] text-white max-h-[90vh] overflow-hidden flex flex-col gap-0 [&>button]:text-white [&>button]:opacity-80 [&>button]:hover:opacity-100"
        >
          {stage === "intro" && (
            <div className="p-8 md:p-12 text-center overflow-y-auto">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-kosh-mint mb-6">
                Financial health diagnostic
              </p>
              <h3 className="font-serif text-2xl md:text-3xl mb-6 leading-snug">
                "এটা test না — এটা হল আপনি এখন কোথায় আছেন সেটা বোঝার জন্য।"
              </h3>
              <p className="text-kosh-muted text-sm md:text-base mb-10">
                (This isn't a test. It's just a check-in.)
              </p>
              <button
                onClick={() => setStage("questions")}
                className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#02C39A", color: "#0D2B27" }}
              >
                Begin →
              </button>
            </div>
          )}

          {stage === "questions" && (
            <>
              <div className="px-6 md:px-10 pt-10 pb-4">
                <Progress
                  value={((current + 1) / questions.length) * 100}
                  className="h-1.5 bg-white/10 [&>div]:bg-[#02C39A]"
                />
                <div className="flex items-center justify-between mt-3 text-xs font-mono text-kosh-muted">
                  <button
                    onClick={back}
                    className="inline-flex items-center gap-1 hover:text-kosh-mint transition-colors"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                  <span>
                    {current + 1} / {questions.length}
                  </span>
                </div>
              </div>

              <div className="px-6 md:px-10 pb-10 overflow-y-auto">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-kosh-mint mb-3">
                  {q.type === "knowledge" ? "Knowledge" : q.type === "behavior" ? "Habits" : "Confidence"}
                </p>
                <h3 className="font-serif text-xl md:text-2xl mb-8 leading-snug">{q.q}</h3>

                <div className="space-y-3">
                  {q.type === "knowledge" &&
                    q.options.map((opt, i) => {
                      const selected = answers[current] !== null && opt.correct === !!answers[current];
                      return (
                        <button
                          key={i}
                          onClick={() => select(opt.correct ? 100 : 0)}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm md:text-base ${
                            selected
                              ? "border-kosh-mint bg-kosh-mint/10"
                              : "border-white/15 hover:border-kosh-mint/60 hover:bg-white/5"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}

                  {q.type === "behavior" &&
                    behaviorOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => select(opt.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm md:text-base ${
                          answers[current] === opt.value
                            ? "border-kosh-mint bg-kosh-mint/10"
                            : "border-white/15 hover:border-kosh-mint/60 hover:bg-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}

                  {q.type === "confidence" &&
                    confidenceOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => select(opt.value)}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-colors text-sm md:text-base ${
                          answers[current] === opt.value
                            ? "border-kosh-mint bg-kosh-mint/10"
                            : "border-white/15 hover:border-kosh-mint/60 hover:bg-white/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}

          {stage === "results" && (
            <div className="p-8 md:p-12 overflow-y-auto">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-kosh-mint mb-4 text-center">
                Your snapshot
              </p>
              <h3 className="font-serif text-3xl md:text-4xl text-center mb-2">{level.title}</h3>
              <p className="text-kosh-muted text-center mb-8 text-sm md:text-base">{level.message}</p>

              <div className="space-y-5 mb-8">
                {[
                  { label: "Knowledge", value: knowledgeScore },
                  { label: "Habits", value: behaviorScore },
                  { label: "Confidence", value: confidenceScore },
                ].map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-xs font-mono mb-1.5">
                      <span className="text-kosh-muted uppercase tracking-wider">{d.label}</span>
                      <span className="text-white">{d.value}</span>
                    </div>
                    <Progress value={d.value} className="h-1.5 bg-white/10 [&>div]:bg-[#02C39A]" />
                  </div>
                ))}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between text-xs font-mono mb-1.5">
                    <span className="text-kosh-mint uppercase tracking-wider">Total</span>
                    <span className="text-white font-semibold">{totalScore}</span>
                  </div>
                  <Progress value={totalScore} className="h-2 bg-white/10 [&>div]:bg-[#02C39A]" />
                </div>
              </div>

              <p className="text-kosh-muted text-sm md:text-base text-center mb-6 leading-relaxed">
                The full learning tracks are being built right now. Join the waitlist and be the first to access them when they go live.
              </p>

              <div className="text-center">
                <button
                  onClick={goWaitlist}
                  className="inline-flex items-center gap-2 font-semibold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: "#02C39A", color: "#0D2B27" }}
                >
                  Join the Waitlist →
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Diagnostic;
