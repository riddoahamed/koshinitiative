import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type CountUpNumberProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
  decimals?: number;
};

const CountUpNumber = ({ value, suffix = "", prefix = "", delay = 0, decimals = 0 }: CountUpNumberProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    let start: number | null = null;
    const duration = 1400;
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
      setCount(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [delay, isInView, value]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

type Stat = {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  context: string;
  source: string;
  sourceUrl: string;
  year: string;
};

const stats: Stat[] = [
  {
    value: 53,
    suffix: "%",
    label: "of adults have a formal financial account",
    context: "Nearly half of Bangladeshi adults remain outside the formal financial system.",
    source: "World Bank · Global Findex",
    sourceUrl:
      "https://www.worldbank.org/en/publication/globalfindex/brief/the-global-findex-database-2021-chapter-1-ownership-of-accounts",
    year: "2021",
  },
  {
    value: 87,
    suffix: "M",
    label: "active mobile money accounts",
    context: "239M registered, only 87M active. Access exists — usage habits and confidence do not.",
    source: "Bangladesh Bank · MFS Summary",
    sourceUrl: "https://www.bb.org.bd/en/index.php/financialactivity/mfsdata",
    year: "Feb 2025",
  },
  {
    value: 20,
    suffix: "pp",
    label: "gender gap in account ownership",
    context: "The gap between men and women almost doubled since 2011.",
    source: "World Bank Findex · BIGD, BRAC University",
    sourceUrl:
      "https://bigd.bracu.ac.bd/advancing-financial-inclusion-for-women-in-bangladesh-requires-a-focus-on-financial-capability/",
    year: "2021 / 2023",
  },
  {
    value: 72.8,
    suffix: "%",
    label: "individuals now own a smartphone",
    context: "The infrastructure for digital financial education is already in people's pockets.",
    source: "BBS · Quarterly ICT Use Report",
    sourceUrl:
      "https://www.tbsnews.net/bangladesh/telecom/548-households-are-now-internet-users-bbs-1221491",
    year: "2024",
    decimals: 1,
  } as Stat & { decimals?: number },
];

const secondary: { value: string; label: string; source: string; sourceUrl: string; year: string }[] = [
  {
    value: "28%",
    label: "of Bangladesh is youth (~45.9M people)",
    source: "BBS · Population Census",
    sourceUrl: "https://www.thedailystar.net/news/bangladesh/news/youths-account-28pc-population-3293161",
    year: "2022",
  },
  {
    value: "~1.6M",
    label: "operable BO accounts — under 2% of adults invest in capital markets",
    source: "CDBL · Central Depository Bangladesh",
    sourceUrl: "https://www.cdbl.com.bd/",
    year: "2025",
  },
  {
    value: "23.96%",
    label: "gross domestic savings — down for 4 straight years",
    source: "World Bank · WDI (NY.GDS.TOTL.ZS)",
    sourceUrl: "https://data.worldbank.org/indicator/NY.GDS.TOTL.ZS?locations=BD",
    year: "2024",
  },
];

const WhyItMatters = () => {
  const ref = useScrollAnimation();

  return (
    <section
      id="why-it-matters"
      className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        <div className="max-w-3xl mb-14">
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
            The financial reality in Bangladesh
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-kosh-offwhite tracking-tight mb-5">
            Access is growing. Confidence is not keeping up.
          </h2>
          <p className="text-kosh-muted text-base md:text-lg leading-relaxed font-sans">
            Bangladesh has added tens of millions of mobile money accounts and smartphones in a decade.
            Yet most people are still figuring out saving, investing, and spotting scams on their own —
            long after the first mistake.
          </p>
        </div>

        {/* Primary stat grid */}
        <div className="grid gap-5 md:grid-cols-2 mb-6">
          {stats.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
              className="group relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-7 md:p-8 overflow-hidden hover:border-kosh-mint/40 hover:bg-white/[0.05] transition-all"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 w-56 h-56 rounded-full bg-primary/10 blur-3xl group-hover:bg-accent/15 transition-colors" />
              <p className="relative font-serif text-5xl md:text-6xl text-kosh-offwhite leading-none tracking-tight">
                <CountUpNumber
                  value={s.value}
                  suffix={s.suffix}
                  prefix={s.prefix}
                  delay={i * 0.1}
                  decimals={(s as Stat & { decimals?: number }).decimals ?? 0}
                />
              </p>
              <p className="relative mt-3 font-sans text-sm md:text-base text-kosh-offwhite/90 font-medium">
                {s.label}
              </p>
              <p className="relative mt-2 text-kosh-muted text-sm leading-relaxed font-sans">
                {s.context}
              </p>
              <p className="relative mt-5 pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-[10px] font-sans font-semibold uppercase tracking-[0.15em] text-kosh-muted/70 group-hover:text-kosh-mint transition-colors">
                <span className="truncate">{s.source}</span>
                <span className="shrink-0">{s.year} ↗</span>
              </p>
            </motion.a>
          ))}
        </div>

        {/* Secondary stat row */}
        <div className="grid gap-3 md:grid-cols-3 mb-12">
          {secondary.map((s, i) => (
            <motion.a
              key={s.label}
              href={s.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group rounded-xl border border-white/8 bg-white/[0.02] p-5 hover:border-kosh-mint/30 hover:bg-white/[0.04] transition-all"
            >
              <p className="font-serif text-3xl text-kosh-offwhite tracking-tight">{s.value}</p>
              <p className="mt-1.5 text-kosh-muted text-xs leading-relaxed font-sans">{s.label}</p>
              <p className="mt-3 flex items-center justify-between gap-2 text-[9.5px] font-sans font-semibold uppercase tracking-[0.14em] text-kosh-muted/60 group-hover:text-kosh-mint transition-colors">
                <span className="truncate">{s.source}</span>
                <span className="shrink-0">{s.year} ↗</span>
              </p>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="relative rounded-2xl border-l-2 border-kosh-mint bg-white/[0.02] pl-6 pr-6 py-6 max-w-3xl"
        >
          <p className="text-kosh-mint text-[11px] font-sans font-semibold uppercase tracking-[0.2em] mb-3">
            Our thesis
          </p>
          <p className="text-kosh-offwhite/90 text-base md:text-lg leading-relaxed font-sans">
            The knowledge about money exists. The problem is that most people in Bangladesh only find it
            years too late — after a bad loan, a Ponzi, or a wedding that wiped out five years of savings.
            Kosh brings that knowledge earlier, in language and examples that fit here.
          </p>
        </motion.div>

        <p className="mt-8 max-w-3xl text-[11px] font-sans text-kosh-muted/70 leading-relaxed">
          Sources: World Bank Global Findex, Bangladesh Bank Mobile Financial Services data, Bangladesh Bureau of Statistics,
          Central Depository Bangladesh (CDBL), BIGD at BRAC University. Click any figure to open the primary source.
        </p>
      </div>
    </section>
  );
};

export default WhyItMatters;
