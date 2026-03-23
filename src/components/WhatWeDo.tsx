import { motion } from "framer-motion";
import { GraduationCap, Building2, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const cards = [
  {
    icon: GraduationCap,
    title: "University workshops",
    description:
      "90-minute financial literacy sessions for students covering budgeting, saving, investing basics, and the investment instruments available to ordinary Bangladeshis.",
    detail: "Free for participants. Delivered on campus.",
  },
  {
    icon: Building2,
    title: "Corporate wellness sessions",
    description:
      "Practical financial wellness sessions for company teams — managing income, building savings systems, understanding investments. Designed for working professionals.",
    detail: "Flexible format. 60 to 90 minutes.",
  },
  {
    icon: Users,
    title: "Community outreach",
    description:
      "Financial education programs for communities with limited access — in plain Bangla, built for the realities of everyday financial life in Bangladesh.",
    detail: "Grant-funded where possible. Bangla-primary.",
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
    <section id="what-we-do" className="bg-kosh-offwhite py-20 md:py-28 px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          What Kosh does
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-dark mb-14">
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
              className="bg-white rounded-lg p-8 flex flex-col"
            >
              <card.icon className="text-kosh-teal mb-5" size={32} strokeWidth={1.5} />
              <h3 className="font-serif text-xl text-kosh-dark mb-3">{card.title}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed flex-1">{card.description}</p>
              <p className="mt-4 text-xs font-sans font-medium text-kosh-teal">{card.detail}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-kosh-muted text-sm mt-14 max-w-2xl mx-auto">
          Everything we do is education. We do not sell products, earn commissions, or make investment recommendations.
        </p>
      </div>
    </section>
  );
};

export default WhatWeDo;
