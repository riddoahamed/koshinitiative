import { motion } from "framer-motion";
import { Users, Mic, FileText, Handshake, ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlassIcon } from "@/components/ui/glass-icon";

const roles = [
  {
    icon: Users,
    variant: "primary" as const,
    title: "Volunteers and Campus Ambassadors",
    body: "Help run workshops, capture content, handle outreach, or represent Kosh at your university. Any capacity. Any time commitment. Genuine interest in the mission is the only requirement.",
    cta: "Apply as a volunteer",
    accent: "from-primary via-primary/60 to-accent",
    number: "01",
    isFounder: false,
  },
  {
    icon: Mic,
    variant: "accent" as const,
    title: "Guest Speakers",
    body: "Work in finance, banking, investment, or business? Share your real experience, not a lecture, just an honest conversation, with our cohort and workshop audiences.",
    cta: "Express interest",
    accent: "from-accent via-primary/60 to-primary",
    number: "02",
    isFounder: false,
  },
  {
    icon: FileText,
    variant: "mixed" as const,
    title: "Education and Content Contributors",
    body: "Help us create better educational content. Bangla translation, financial explainers, curriculum review, graphic design, video. If you can make financial education clearer, we need you.",
    cta: "Contribute",
    accent: "from-primary to-accent",
    number: "03",
    isFounder: false,
  },
  {
    icon: Handshake,
    variant: "primary" as const,
    title: "Co-Founding Partners",
    body: "You believe financial education in Bangladesh should be different, exciting, honest, not boring or intimidating. You want to build something that actually changes how people relate to money. And you want to build it with others who feel the same. If that is you, this is the most important card on this page.",
    cta: "Let us talk",
    accent: "from-accent to-primary",
    number: "04",
    isFounder: true,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const GetInvolvedContributors = () => {
  const ref = useScrollAnimation();

  return (
    <section
      id="get-involved-contributors"
      className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-accent/15 blur-[140px]" />

      <div ref={ref} className="relative max-w-6xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Join the founding circle
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-offwhite mb-4">
          We are building this from scratch.
          <br />
          If that excites you, read on.
        </h2>
        <p className="text-kosh-muted text-base leading-relaxed mb-14 max-w-2xl font-sans">
          Kosh is early. That means the people who join now help define what it becomes. We are looking for people who believe that financial education in Bangladesh should be exciting, accessible, and completely free of hidden agendas.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 flex flex-col transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)] overflow-hidden"
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${role.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />

              {/* Number tag */}
              <span className="absolute top-5 right-6 font-sans text-xs font-bold tracking-widest text-white/15 group-hover:text-primary/40 transition-colors">
                {role.number}
              </span>

              {/* Ambient corner glow */}
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />

              <GlassIcon icon={role.icon} variant={role.variant} size="md" className="mb-5 relative" />
              <h3 className="font-serif text-xl text-kosh-offwhite mb-3 relative">{role.title}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed flex-1 font-sans relative">{role.body}</p>

              {role.isFounder ? (
                <a
                  href="#get-involved-form"
                  className="mt-6 inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground font-sans font-semibold text-sm transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)] hover:scale-[1.01]"
                >
                  {role.cta}
                  <ArrowRight size={16} />
                </a>
              ) : (
                <a
                  href="#get-involved-form"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-sans font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  {role.cta}
                  <ArrowRight size={14} className="text-accent" />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedContributors;
