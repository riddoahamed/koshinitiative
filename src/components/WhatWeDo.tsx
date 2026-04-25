import { motion } from "framer-motion";
import { GraduationCap, Building2, Heart } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const cards = [
  {
    icon: GraduationCap,
    title: "University & Student Workshops",
    description:
      "Interactive, hands-on sessions in universities, colleges, and schools. Free where possible. Minimal cost only to cover delivery.",
    detail: "Budgeting, saving, investing, financial planning. Plain language. Real-life examples.",
  },
  {
    icon: Building2,
    title: "Corporate Financial Wellness",
    description:
      "Tailored workshops for young professionals and first-time investors.",
    detail: "Salary management, emergency funds, investment basics, long-term planning.",
  },
  {
    icon: Heart,
    title: "Pro Bono / Sponsored Programs",
    description:
      "Programs for rural women, factory workers, and underserved communities — supported by grants, sponsors, and partnerships. Delivered in local languages, free for participants.",
    detail: "Maximum impact. Minimal friction. Real measurable results.",
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
    <section id="what-we-do" className="bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="text-kosh-teal text-lg md:text-xl font-serif leading-relaxed max-w-3xl mb-14">
          We're on a mission to make financial education accessible, practical, and actionable for every young Bangladeshi.
        </p>

        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          What Kosh does
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-offwhite mb-14">
          Three programmes. One mission.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="bg-white/[0.03] backdrop-blur-sm rounded-lg p-8 flex flex-col border border-primary/15 hover:border-primary/50 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.5)] transition-all"
            >
              <card.icon className="text-accent mb-5" size={32} strokeWidth={1.5} />
              <h3 className="font-serif text-xl text-kosh-offwhite mb-3">{card.title}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed flex-1 font-sans">{card.description}</p>
              <p className="mt-4 text-xs font-sans font-medium text-primary">{card.detail}</p>
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
