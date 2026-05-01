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
      "Interactive, hands-on sessions in universities, colleges, and schools. Free where possible. Minimal cost only to cover delivery.",
    detail: "Budgeting, saving, investing, financial planning. Plain language. Real-life examples.",
  },
  {
    icon: Building2,
    variant: "mixed" as const,
    title: "Corporate Financial Wellness",
    description:
      "Tailored workshops for young professionals and first-time investors.",
    detail: "Salary management, emergency funds, investment basics, long-term planning.",
  },
  {
    icon: Heart,
    variant: "accent" as const,
    title: "Pro Bono / Sponsored Programs",
    description:
      "Programs for rural women, factory workers, and underserved communities, supported by grants, sponsors, and partnerships. Delivered in local languages, free for participants.",
    detail: "Maximum impact. Minimal friction. Real measurable results.",
  },
  {
    icon: Gamepad2,
    variant: "primary" as const,
    title: "Gamified Financial Literacy with AI",
    description:
      "AI-assisted learning that turns personal finance into something you actually want to play. Built for the way young Bangladeshis learn online.",
    detail: "Personal finance. Investing awareness. Guided, informed decision-making.",
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
      {/* Top transition glow — continues the green flow from hero into this section */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-0 right-0 h-80 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 100%, hsl(156 85% 62% / 0.18), hsl(85 95% 65% / 0.10) 35%, hsl(270 95% 65% / 0.06) 60%, transparent 78%)",
        }}
      />
      <div className="pointer-events-none absolute top-20 -left-32 w-[400px] h-[400px] rounded-full bg-kosh-mint/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-40 -right-32 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[120px]" />
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="text-kosh-teal text-lg md:text-xl font-serif leading-relaxed max-w-3xl mb-14">
          We're on a mission to make financial education accessible, practical, and actionable for every young Bangladeshi.
        </p>

        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          What Kosh does
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-offwhite mb-14">
          Four programmes. One mission.
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="relative overflow-hidden bg-white/[0.04] backdrop-blur-xl rounded-2xl p-8 flex flex-col border border-white/10 hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6),0_0_25px_-12px_hsl(var(--accent)/0.5)] transition-all"
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
