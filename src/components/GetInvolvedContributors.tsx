import { motion } from "framer-motion";
import { Users, Mic, FileText, Handshake } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const roles = [
  {
    icon: Users,
    title: "Volunteers and Campus Ambassadors",
    body: "Help run workshops, capture content, handle outreach, or represent Kosh at your university. Any capacity. Any time commitment. Genuine interest in the mission is the only requirement.",
    cta: "Apply as a volunteer →",
    isFounder: false,
  },
  {
    icon: Mic,
    title: "Guest Speakers",
    body: "Work in finance, banking, investment, or business? Share your real experience — not a lecture, just an honest conversation — with our cohort and workshop audiences.",
    cta: "Express interest →",
    isFounder: false,
  },
  {
    icon: FileText,
    title: "Education and Content Contributors",
    body: "Help us create better educational content. Bangla translation, financial explainers, curriculum review, graphic design, video. If you can make financial education clearer, we need you.",
    cta: "Contribute →",
    isFounder: false,
  },
  {
    icon: Handshake,
    title: "Co-Founding Partners",
    body: "You believe financial education in Bangladesh should be different — exciting, honest, not boring or intimidating. You want to build something that actually changes how people relate to money. And you want to build it with others who feel the same. If that is you, this is the most important card on this page.",
    cta: "Let us talk →",
    isFounder: true,
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

const GetInvolvedContributors = () => {
  const ref = useScrollAnimation();

  return (
    <section id="get-involved-contributors" className="bg-[#0D2B27] py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Join the founding circle
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          We are building this from scratch.
          <br />
          If that excites you, read on.
        </h2>
        <p className="text-[#9FE1CB] text-base leading-relaxed mb-14 max-w-2xl font-sans">
          Kosh is early. That means the people who join now help define what it becomes. We are looking for people who believe that financial education in Bangladesh should be exciting, accessible, and completely free of hidden agendas.
        </p>

        <div className="grid sm:grid-cols-2 gap-6">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="bg-[#0A1628] rounded-xl p-8 flex flex-col border-t-[3px] border-kosh-mint"
            >
              <role.icon className="text-kosh-mint mb-5" size={28} strokeWidth={1.5} />
              <h3 className="font-serif text-xl text-white mb-3">{role.title}</h3>
              <p className="text-[#9FE1CB] text-sm leading-relaxed flex-1 font-sans">{role.body}</p>
              {role.isFounder ? (
                <a
                  href="#get-involved-form"
                  className="mt-6 inline-flex items-center justify-center w-full px-8 py-3.5 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-sm transition-opacity hover:opacity-90"
                >
                  {role.cta}
                </a>
              ) : (
                <a
                  href="#get-involved-form"
                  className="mt-6 inline-flex items-center text-kosh-mint text-sm font-sans font-semibold hover:opacity-80 transition-opacity"
                >
                  {role.cta}
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
