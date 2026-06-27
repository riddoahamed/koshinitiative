import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import archiveHero from "@/assets/brand/kosh-archive.jpg";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";

const TYPED_TEXT = "From money confusion to confident moves.";
const SIGNAL_WORDS = ["Bangladesh-first", "No jargon", "No product push"];
const HEADLINE_LINES = ["Money should", "finally make", "sense."];

const Hero = () => {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    // Start typing after the headline animation settles
    const startDelay = 700;
    const charDelay = 70; // semi-fast
    let i = 0;
    let interval: ReturnType<typeof setInterval> | null = null;
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setTyped(TYPED_TEXT.slice(0, i));
        if (i >= TYPED_TEXT.length && interval) {
          clearInterval(interval);
        }
      }, charDelay);
    }, startDelay);

    return () => {
      clearTimeout(start);
      if (interval) clearInterval(interval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-kosh-dark px-6 md:px-12 lg:px-24 py-24 md:py-[110px] overflow-hidden">
      <motion.img
        src={archiveHero}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[66%_28%] opacity-90 md:hidden"
        initial={{ scale: 1.08 }}
        animate={{ scale: [1.08, 1.14, 1.08], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.img
        src={archiveHero}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 hidden h-full w-full object-cover object-[76%_24%] opacity-95 md:block"
        initial={{ scale: 1.03 }}
        animate={{ scale: [1.03, 1.075, 1.03], x: [0, -18, 0], y: [0, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,hsl(var(--kosh-dark)/0.98)_0%,hsl(var(--kosh-dark)/0.92)_38%,hsl(var(--kosh-dark)/0.64)_64%,hsl(var(--kosh-dark)/0.22)_100%)] md:block" />
      <div className="absolute inset-0 hidden bg-[linear-gradient(180deg,hsl(var(--kosh-dark)/0.38)_0%,transparent_30%,hsl(var(--kosh-dark)/0.5)_100%)] md:block" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--kosh-dark)/0.94)_0%,hsl(var(--kosh-dark)/0.78)_52%,hsl(var(--kosh-dark)/0.28)_100%)] md:hidden" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--kosh-dark)/0.72)_0%,hsl(var(--kosh-dark)/0.62)_42%,hsl(var(--kosh-dark)/0.28)_68%,hsl(var(--kosh-dark)/0.95)_100%)] md:hidden" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,hsl(var(--accent)/0.18),transparent_30%)]" />
      <motion.div
        aria-hidden="true"
        className="absolute inset-y-0 left-[32%] z-[1] hidden w-24 -skew-x-12 bg-gradient-to-r from-transparent via-kosh-mint/14 to-transparent blur-sm md:block"
        animate={{ x: ["-28vw", "62vw"], opacity: [0, 0.85, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute left-6 top-20 z-[1] h-px w-[calc(100%-3rem)] origin-left bg-gradient-to-r from-transparent via-kosh-mint/60 to-transparent md:left-12 md:w-[calc(100%-6rem)] lg:left-24 lg:w-[calc(100%-12rem)]"
        animate={{ scaleX: [0.15, 1, 0.15], opacity: [0.12, 0.55, 0.12] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-[560px]">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-5 inline-flex max-w-full items-center rounded-full border border-kosh-mint/25 bg-kosh-mint/10 px-3 py-1.5 font-signal text-[11px] font-semibold uppercase tracking-[0.16em] text-kosh-mint"
        >
          Learn. Save. Invest. Grow.
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="show"
          className="max-w-[590px] font-display text-[46px] font-extrabold leading-[0.92] text-white md:text-[64px] lg:text-[68px] xl:text-[76px]"
        >
          {HEADLINE_LINES.map((line, index) => (
            <motion.span
              key={line}
          className={index === 2 ? "block text-kosh-lime drop-shadow-[0_0_26px_hsl(var(--kosh-lime)/0.34)]" : "block"}
              variants={{
                hidden: { y: 42, opacity: 0, filter: "blur(8px)" },
                show: {
                  y: 0,
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { duration: 0.72, delay: index * 0.11, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {index === 2 ? <span className="kosh-disco-shimmer">{line}</span> : line}
            </motion.span>
          ))}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-5 hidden max-w-full flex-wrap items-center gap-2 sm:flex"
          aria-label="Kosh learning path: learn, save, invest, grow"
        >
          {SIGNAL_WORDS.map((word, index) => (
            <motion.span
              key={word}
              className="relative overflow-hidden rounded-full border border-white/12 bg-white/[0.06] px-3 py-1.5 font-signal text-[10px] font-semibold uppercase tracking-[0.12em] text-white/78 md:text-[11px]"
              animate={{ borderColor: ["rgba(255,255,255,0.12)", "rgba(184,255,70,0.58)", "rgba(255,255,255,0.12)"] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.35 }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-kosh-lime/20 to-transparent"
                animate={{ x: ["-120%", "240%"] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.35, ease: "easeInOut" }}
              />
              <span className="relative">{word}</span>
            </motion.span>
          ))}
        </motion.div>

        <p
          className="mt-5 hidden min-h-[1.3em] font-display text-xl font-semibold text-kosh-lime sm:block md:text-2xl"
          aria-label={TYPED_TEXT}
        >
          <span>{typed}</span>
          <span className="inline-block ml-1 animate-blink" aria-hidden="true">
            _
          </span>
        </p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-3 max-w-xl font-sans text-[14px] leading-relaxed text-white/84 sm:text-base md:text-[17px]"
        >
<strong className="font-semibold text-white">Kosh is a financial-literacy app for young Bangladeshis</strong> — learn to budget, save, spot scams, and start investing through bite-sized lessons and money games. Signing in (including with Google) is optional and is used only to save your learning progress across devices. Kosh is the digital home of the Kosh Financial Literacy Initiative (workshops and community programs).
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-6 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href={KOSH_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-kosh-lime/50 bg-gradient-to-r from-kosh-lime to-kosh-mint text-[#071210] font-sans font-semibold text-base transition-all hover:brightness-110 shadow-[0_0_30px_-10px_hsl(var(--kosh-lime)/0.8)]"
          >
            Open Kosh: Learn to Invest
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={KOSH_WAITLIST_EMAIL_URL}
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-white text-white font-sans font-medium text-base transition-opacity hover:opacity-80"
          >
            Join full app waitlist
          </a>
        </motion.div>

      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="text-kosh-muted animate-bounce-down" size={28} />
      </div>

      {/* Corner accent glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/15 blur-[140px]" />
    </section>
  );
};

export default Hero;
