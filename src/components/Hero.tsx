import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-kosh-dark px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-white"
        >
          Most young Bangladeshis were never taught how money works.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 text-xl md:text-2xl font-serif text-kosh-mint"
        >
          Kosh is changing that.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-4 text-base md:text-lg text-kosh-muted"
        >
          Workshops, corporate sessions, and community programs — in plain language, with no agenda.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-base transition-opacity hover:opacity-90"
          >
            Partner with us
          </a>
          <a
            href="#what-we-do"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-white text-white font-sans font-medium text-base transition-opacity hover:opacity-80"
          >
            Learn more
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <ChevronDown className="text-kosh-muted animate-bounce-down" size={28} />
      </div>
    </section>
  );
};

export default Hero;
