import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type CountUpNumberProps = {
  value: number;
  suffix?: string;
  delay?: number;
};

const CountUpNumber = ({ value, suffix = "", delay = 0 }: CountUpNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.7 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let frame = 0;
    let start: number | null = null;
    const duration = 1300;
    const delayMs = delay * 1000;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;

      if (elapsed < delayMs) {
        frame = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((elapsed - delayMs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [delay, isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

const WhyItMatters = () => {
  const ref = useScrollAnimation();

  return (
    <section className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]" />
      <div ref={ref} className="relative max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 md:gap-16 text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-serif text-7xl md:text-8xl text-white font-normal">
              <CountUpNumber value={70} suffix="%+" />
            </p>
            <p className="mt-2 font-signal text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
              of adults in Bangladesh
            </p>
            <p className="text-kosh-mint text-sm font-sans font-semibold uppercase tracking-[0.15em] mt-4">
              Lack basic financial literacy
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <p className="font-serif text-7xl md:text-8xl text-white font-normal">
              <CountUpNumber value={45} suffix="%" delay={0.12} />
            </p>
            <p className="text-kosh-mint text-sm font-sans font-semibold uppercase tracking-[0.15em] mt-4">
              Population under age 25
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.24 }}
          >
            <p className="font-serif text-7xl md:text-8xl text-white font-normal">
              ~<CountUpNumber value={0} delay={0.24} />
            </p>
            <p className="text-kosh-mint text-sm font-sans font-semibold uppercase tracking-[0.15em] mt-4">
              Formal financial education in most schools
            </p>
          </motion.div>
        </div>

        <p className="text-kosh-muted text-base leading-relaxed text-center max-w-2xl mx-auto mb-12 font-sans">
          Most people are never taught how money actually works. Yet nearly half the country is young and entering the workforce.
          <br /><br />
          Kosh exists to bridge that gap by making financial knowledge practical, accessible, and relevant to everyday life.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 border-l-2 border-kosh-mint pl-6 text-left max-w-lg mx-auto"
        >
          <p className="text-kosh-mint text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-4">Our Thesis</p>
          <p className="text-kosh-muted text-base leading-relaxed font-sans">
            The knowledge about money is out there. The problem is most people only discover it years too late. Kosh exists to bring that knowledge earlier, and make it practical for everyday life.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyItMatters;
