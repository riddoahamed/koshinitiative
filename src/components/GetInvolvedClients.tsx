import { motion } from "framer-motion";
import { GraduationCap, Building2, Trophy } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlassIcon } from "@/components/ui/glass-icon";

const cards = [
  {
    icon: GraduationCap,
    variant: "primary" as const,
    title: "Academic Institutions",
    body: "Bring a Kosh financial literacy session to your campus or school. We handle content and delivery. You provide the room and the students.",
    tag: "Free for students",
    cta: "Request a session →",
  },
  {
    icon: Building2,
    variant: "mixed" as const,
    title: "Corporate Partners",
    body: "Run a practical financial wellness session for your team. Budgeting, saving, investing basics. 60 to 90 minutes. Fits a lunch break or half-day.",
    tag: "For teams of any size",
    cta: "Get in touch →",
  },
  {
    icon: Trophy,
    variant: "accent" as const,
    title: "Events and Competitions",
    body: "Planning a financial literacy competition, hackathon, or awareness event? We can design and facilitate it with you.",
    tag: "Workshops · Competitions · Group learning",
    cta: "Tell us about your event →",
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

const GetInvolvedClients = () => {
  const ref = useScrollAnimation();

  return (
    <section id="get-involved-clients" className="bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Work with Kosh
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-offwhite mb-4">
          Bring financial literacy to your people.
        </h2>
        <p className="text-kosh-muted text-base leading-relaxed mb-14 max-w-2xl font-sans">
          We work with universities, schools, companies, and organisations that want to give their students or teams real financial knowledge. No products. Just education.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
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
              <p className="text-kosh-muted text-sm leading-relaxed flex-1 font-sans relative">{card.body}</p>
              <span className="relative inline-block mt-5 mb-5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-sans font-medium w-fit">
                {card.tag}
              </span>
              <a
                href="#get-involved-form"
                className="relative inline-flex items-center text-primary text-sm font-sans font-semibold hover:text-accent transition-colors"
              >
                {card.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedClients;
