import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
};

const GetInvolved = () => {
  const ref = useScrollAnimation();

  return (
    <section id="get-involved" className="bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-5xl mx-auto text-center">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Get involved
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-dark mb-6 max-w-2xl mx-auto">
          Get involved, join the journey, or ask us anything.
        </h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            custom={0}
            variants={fadeUp}
            href="#join"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-teal text-white font-sans font-semibold text-sm transition-opacity hover:opacity-90"
          >
            Join the founding team
          </motion.a>
          <motion.a
            custom={1}
            variants={fadeUp}
            href="mailto:koshinitiative@gmail.com?subject=Workshop%20%2F%20Partnership%20Enquiry&body=Hi%20Kosh%2C%0A%0AI%20would%20like%20to%3A"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-kosh-teal text-kosh-teal font-sans font-medium text-sm transition-opacity hover:opacity-90"
          >
            Attend a workshop / partner with us
          </motion.a>
          <motion.a
            custom={2}
            variants={fadeUp}
            href="https://wa.me/8801607966000?text=Hi%20Kosh%2C%20I%20have%20a%20question"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-kosh-muted text-kosh-muted font-sans font-medium text-sm transition-colors hover:border-kosh-teal hover:text-kosh-teal"
          >
            Ask a question / WhatsApp us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default GetInvolved;
