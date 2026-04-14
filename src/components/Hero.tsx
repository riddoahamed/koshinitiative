import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SocialLinks from "./SocialIcons";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center bg-kosh-dark px-6 md:px-12 lg:px-24 py-16 md:py-[100px] overflow-hidden">
      {/* Background texture layers */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px',
      }} />
      <div className="absolute inset-0 bg-gradient-to-br from-kosh-teal/10 via-transparent to-kosh-mint/5" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-kosh-mint/5 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-kosh-teal/8 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="absolute top-6 right-6 md:top-10 md:right-12 lg:right-24 z-10">
        <SocialLinks />
      </div>

      <div className="max-w-4xl relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-white"
        >
          Most young Bangladeshis were{" "}
          <span className="italic text-kosh-mint">never taught</span>{" "}
          how{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-kosh-mint to-emerald-300">
            money
          </span>{" "}
          works.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 text-2xl md:text-4xl font-serif text-kosh-mint"
        >
          Kosh is changing that.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-5 text-base md:text-lg text-kosh-muted max-w-2xl font-sans leading-relaxed"
        >
          Workshops, community programs, and corporate sessions — practical financial education to help students, early-career professionals, and underserved communities understand money, save, and grow wealth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 flex flex-col sm:flex-row gap-4"
        >
          <a
            href="#get-involved-contributors"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-base transition-opacity hover:opacity-90"
          >
            Join the Founding Circle
          </a>
          <a
            href="#get-involved-clients"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-white text-white font-sans font-medium text-base transition-opacity hover:opacity-80"
          >
            Get Involved
          </a>
          <a
            href="mailto:koshinitiative@gmail.com?subject=Kosh%20Enquiry&body=Hi%20Kosh%2C%0A%0AI%20have%20a%20question%3A"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-kosh-muted text-kosh-muted font-sans font-medium text-base transition-colors hover:border-white hover:text-white"
          >
            Ask Us Anything
          </a>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <ChevronDown className="text-kosh-muted animate-bounce-down" size={28} />
      </div>
    </section>
  );
};

export default Hero;
