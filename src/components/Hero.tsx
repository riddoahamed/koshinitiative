import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import SocialLinks from "./SocialIcons";

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
    <section className="relative min-h-screen flex flex-col justify-center bg-kosh-dark px-6 md:px-12 lg:px-24 py-16 md:py-[100px] overflow-hidden">
      <div className="absolute top-6 right-6 md:top-10 md:right-12 lg:right-24 z-10">
        <SocialLinks />
      </div>
      <div className="absolute top-6 right-6 md:top-10 md:right-12 lg:right-24 z-10">
        <SocialLinks />
      </div>

      <div className="max-w-4xl relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-white"
        >
          Most young Bangladeshis were{" "}
          <span className="italic text-kosh-mint">never taught</span>{" "}
          how{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-kosh-mint to-emerald-300">
            money
          </span>{" "}
          works.
        </motion.h1>

        <p
          className="mt-8 text-2xl md:text-4xl font-serif text-kosh-mint min-h-[1.4em]"
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
          Workshops, community programs, and corporate sessions, practical financial education to help students, early-career professionals, and underserved communities understand money, save, and grow wealth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#diagnostic"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-mint/15 backdrop-blur-sm border border-kosh-mint/40 text-kosh-mint font-sans font-semibold text-base transition-all hover:bg-kosh-mint/25 hover:border-kosh-mint/70 shadow-[0_0_24px_-8px_hsl(var(--accent)/0.6)]"
          >
            How personal are you with your finances?
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
