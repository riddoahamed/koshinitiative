import { motion } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import platformHero from "@/assets/brand/platform-hero.jpg";
import { KOSH_APP_URL } from "@/lib/links";

const TYPED_TEXT = "Kosh is changing that.";

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
      <img
        src={platformHero}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[78%_center] opacity-75"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--kosh-dark))_0%,hsl(var(--kosh-dark))_43%,hsl(var(--kosh-dark)/0.78)_68%,hsl(var(--kosh-dark)/0.28)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_42%,hsl(var(--accent)/0.16),transparent_34%)]" />

      <div className="max-w-4xl relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-6 inline-flex max-w-full items-center rounded-full border border-kosh-mint/25 bg-kosh-mint/10 px-3 py-1.5 text-[11px] font-sans font-semibold uppercase tracking-[0.16em] text-kosh-mint"
        >
          Learn. Save. Invest. Grow.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-sans text-4xl font-extrabold leading-[1.02] tracking-tight text-white max-w-[760px] md:text-5xl lg:text-6xl xl:text-7xl"
        >
          Money should make sense for{" "}
          <span className="text-kosh-mint">everyday Bangladeshis.</span>
        </motion.h1>

        <p
          className="mt-7 text-xl md:text-3xl font-sans font-extrabold text-kosh-mint min-h-[1.4em]"
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
          className="mt-5 text-base md:text-lg text-kosh-muted max-w-2xl font-sans leading-relaxed"
        >
          Kosh combines workshops, community programs, and a gamified app to help people understand money, build habits, and make better financial decisions without hidden agendas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href={KOSH_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-mint/15 backdrop-blur-sm border border-kosh-mint/40 text-kosh-mint font-sans font-semibold text-base transition-all hover:bg-kosh-mint/25 hover:border-kosh-mint/70 shadow-[0_0_24px_-8px_hsl(var(--accent)/0.6)]"
          >
            Rate your money readiness
            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#get-involved-clients"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-white text-white font-sans font-medium text-base transition-opacity hover:opacity-80"
          >
            Get Involved
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
