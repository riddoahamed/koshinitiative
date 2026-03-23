import { motion } from "framer-motion";

const WhyItMatters = () => {
  return (
    <section className="bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto text-center">
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
          <p className="text-kosh-muted text-base leading-relaxed mt-6 max-w-xl mx-auto">
            That number covers a country of 170 million people — including a rapidly growing generation of young professionals entering the workforce without foundational financial knowledge.
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-kosh-muted text-base leading-relaxed mt-12 max-w-xl mx-auto"
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
