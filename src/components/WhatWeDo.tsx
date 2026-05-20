import { motion } from "framer-motion";
import { GraduationCap, Building2, Heart, Gamepad2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlassIcon } from "@/components/ui/glass-icon";

const cards = [
  {
    icon: GraduationCap,
    variant: "primary" as const,
    title: "University & Student Workshops",
    description:
      "Hands-on sessions in universities, colleges, and schools.",
    detail: "Budgeting, saving, investing in plain language.",
  },
  {
    icon: Building2,
    variant: "mixed" as const,
    title: "Financial Education for Businesses",
    description:
      "Corporate financial wellness workshops for teams, young professionals, and first-time investors.",
    detail: "Salary, emergency funds, personal finance basics.",
  },
  {
    icon: Heart,
    variant: "accent" as const,
    title: "Pro Bono Programs",
    description:
      "Free programs for rural women, factory workers, and underserved communities.",
    detail: "Local languages. Maximum impact. Zero cost.",
  },
  {
    icon: Gamepad2,
    variant: "primary" as const,
    title: "Kosh App & Gamified Learning",
    description:
      "A financial literacy app for personal finance education that people actually want to use.",
    detail: "Built for how young Bangladeshis learn online.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
};

const WhatWeDo = () => {
  const ref = useScrollAnimation();

  return (
    <section id="what-we-do" className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Corner accent glows — match the rest of the dark sections */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/15 blur-[140px]" />
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          What Kosh does
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-offwhite mb-14">
          Four programmes. One mission.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-7">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="relative overflow-hidden bg-white/[0.04] backdrop-blur-xl rounded-2xl p-7 flex flex-col border border-white/10 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6),0_0_25px_-12px_hsl(var(--accent)/0.5)] transition-all"
            >
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
              <GlassIcon icon={card.icon} variant={card.variant} size="md" className="mb-5" />
              <h3 className="font-serif text-xl text-kosh-offwhite mb-3 relative">{card.title}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed flex-1 font-sans relative">{card.description}</p>
              <p className="mt-4 text-xs font-sans font-medium bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent relative">{card.detail}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-kosh-muted text-sm mt-14 max-w-2xl mx-auto font-sans">
          Everything we do is education. We do not sell products, earn commissions, or make investment recommendations.
        </p>
      </div>
    </section>
  );
};

export default WhatWeDo;
