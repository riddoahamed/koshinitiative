import { motion } from "framer-motion";
import { MessageCircle, Users } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
};

const Community = () => {
  const ref = useScrollAnimation();

  return (
    <section className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Ambient background glows — match palette */}
      <div className="pointer-events-none absolute -top-40 -right-32 w-[480px] h-[480px] rounded-full bg-primary/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-32 w-[480px] h-[480px] rounded-full bg-accent/10 blur-[140px]" />

      <div ref={ref} className="relative max-w-5xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Stay connected
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-offwhite mb-4">
          Learning is better together.
        </h2>
        <p className="text-white/60 text-base leading-relaxed mb-14 max-w-2xl font-sans">
          Join our growing community of people across Bangladesh who are taking their financial knowledge seriously. Get updates, session announcements, and resources — directly where you already are.
        </p>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {/* WhatsApp */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 flex flex-col transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-10px_hsl(var(--accent)/0.5)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-primary opacity-70" />
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 border border-white/10 flex items-center justify-center mb-5">
              <MessageCircle className="text-accent" size={20} strokeWidth={1.75} />
            </div>
            <h3 className="font-serif text-xl text-kosh-offwhite mb-3">WhatsApp Community</h3>
            <p className="text-white/60 text-sm leading-relaxed flex-1 font-sans">
              Get real-time updates, session announcements, financial tips, and direct access to the Kosh team. The fastest way to stay connected.
            </p>
            <span className="inline-block mt-5 mb-5 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-sans font-medium w-fit border border-accent/20">
              Free to join
            </span>
            <a
              href="https://chat.whatsapp.com/GSHCPsdgt7s2aONoVa15Zj?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-accent/40 text-accent font-sans font-semibold text-sm transition-all hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_24px_-6px_hsl(var(--accent)/0.7)]"
            >
              Join on WhatsApp →
            </a>
          </motion.div>

          {/* Facebook */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 flex flex-col transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent opacity-70" />
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center mb-5">
              <Users className="text-primary" size={20} strokeWidth={1.75} />
            </div>
            <h3 className="font-serif text-xl text-kosh-offwhite mb-3">Facebook Community</h3>
            <p className="text-white/60 text-sm leading-relaxed flex-1 font-sans">
              Join the conversation. Ask questions, share what you are learning, and connect with others on the same financial literacy journey.
            </p>
            <span className="inline-block mt-5 mb-5 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-sans font-medium w-fit border border-primary/20">
              Free to join
            </span>
            <a
              href="https://facebook.com/KoshInitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-primary/40 text-primary font-sans font-semibold text-sm transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_24px_-6px_hsl(var(--primary)/0.7)]"
            >
              Join the Facebook group →
            </a>
          </motion.div>
        </div>

        <p className="text-center text-white/45 text-sm mt-10 font-sans">
          No spam. No promotions. Just financial education and the people building it.
        </p>
      </div>
    </section>
  );
};

export default Community;
