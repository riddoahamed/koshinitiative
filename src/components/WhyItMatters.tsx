import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const WhyItMatters = () => {
  const ref = useScrollAnimation();

  return (
    <section className="bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-serif text-7xl md:text-8xl text-white font-normal">28%</p>
            <p className="text-kosh-mint text-sm font-sans font-semibold uppercase tracking-[0.15em] mt-4">
              of Bangladeshis have basic financial literacy
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            <p className="font-serif text-7xl md:text-8xl text-white font-normal">56%</p>
            <p className="text-kosh-mint text-sm font-sans font-semibold uppercase tracking-[0.15em] mt-4">
              of Bangladeshis own a smartphone
            </p>
            <p className="text-kosh-muted text-xs font-sans mt-2">GSMA, 2023</p>
          </motion.div>
        </div>

        <p className="text-kosh-muted text-base leading-relaxed text-center max-w-2xl mx-auto mb-12 font-sans">
          More than half of Bangladesh now has a smartphone. The knowledge to use
          it for financial growth is still missing for most.
        </p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-kosh-muted text-base leading-relaxed text-center max-w-xl mx-auto font-sans"
        >
          The problem is not that people are bad with money. It is that nobody taught them. The information that exists is scattered, jargon-heavy, and almost always attached to someone trying to sell something. Kosh exists to fix that.
        </motion.p>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 border-l-2 border-kosh-mint pl-6 text-left max-w-lg mx-auto"
        >
          <p className="font-serif text-xl md:text-2xl text-white leading-snug italic">
            "I am not an expert. I am someone who learned the hard way and decided to build the shortcut I never had."
          </p>
          <cite className="block mt-4 text-kosh-muted text-sm font-sans not-italic">
            Riddo, Founder of Kosh
          </cite>
        </motion.blockquote>
      </div>
    </section>
  );
};

export default WhyItMatters;
