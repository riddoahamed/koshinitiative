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
    <section className="bg-[#0D2B27] py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-5xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Stay connected
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Learning is better together.
        </h2>
        <p className="text-[#9FE1CB] text-base leading-relaxed mb-14 max-w-2xl font-sans">
          Join our growing community of people across Bangladesh who are taking their financial knowledge seriously. Get updates, session announcements, and resources — directly where you already are.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="bg-[#0F3830] rounded-xl p-8 flex flex-col border-t-[3px] border-[#25D366]"
          >
            <MessageCircle className="text-[#25D366] mb-5" size={28} strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-white mb-3">WhatsApp Community</h3>
            <p className="text-[#9FE1CB] text-sm leading-relaxed flex-1 font-sans">
              Get real-time updates, session announcements, financial tips, and direct access to the Kosh team. The fastest way to stay connected.
            </p>
            <span className="inline-block mt-5 mb-5 px-3 py-1 rounded-full bg-[#25D366]/15 text-[#25D366] text-xs font-sans font-medium w-fit">
              Free to join
            </span>
            <a
              href="https://chat.whatsapp.com/GSHCPsdgt7s2aONoVa15Zj?mode=gi_t"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-[#25D366] text-[#25D366] font-sans font-semibold text-sm transition-colors hover:bg-[#25D366] hover:text-kosh-dark"
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
            className="bg-[#0F3830] rounded-xl p-8 flex flex-col border-t-[3px] border-[#1877F2]"
          >
            <Users className="text-[#1877F2] mb-5" size={28} strokeWidth={1.5} />
            <h3 className="font-serif text-xl text-white mb-3">Facebook Community</h3>
            <p className="text-[#9FE1CB] text-sm leading-relaxed flex-1 font-sans">
              Join the conversation. Ask questions, share what you are learning, and connect with others on the same financial literacy journey.
            </p>
            <span className="inline-block mt-5 mb-5 px-3 py-1 rounded-full bg-[#1877F2]/15 text-[#1877F2] text-xs font-sans font-medium w-fit">
              Free to join
            </span>
            <a
              href="https://facebook.com/KoshInitiative"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-[#1877F2] text-[#1877F2] font-sans font-semibold text-sm transition-colors hover:bg-[#1877F2] hover:text-white"
            >
              Join the Facebook group →
            </a>
          </motion.div>
        </div>

        <p className="text-center text-kosh-muted text-sm mt-10 font-sans">
          No spam. No promotions. Just financial education and the people building it.
        </p>
      </div>
    </section>
  );
};

export default Community;
