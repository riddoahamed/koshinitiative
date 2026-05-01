import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PLATFORM_URL = "https://kosh-ten.vercel.app/";

const DigitalWaitlist = () => {
  const ref = useScrollAnimation();

  return (
    <section className="relative bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      {/* Ambient glows to match palette */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/15 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/15 blur-[140px]" />

      <div ref={ref} className="relative max-w-5xl mx-auto text-center">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Now live
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-offwhite mb-4">
          Try the Kosh platform
        </h2>
        <p className="text-white/60 text-base leading-relaxed mb-12 max-w-2xl mx-auto font-sans">
          Explore our tools, calculators, and learning resources. Free to use, no sign-up required.
        </p>

        <div className="grid sm:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto text-left">
          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 flex flex-col transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-10px_hsl(var(--accent)/0.5)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-primary opacity-70 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-serif text-xl text-kosh-offwhite mb-3">Try our platform</h3>
            <p className="text-white/60 text-sm leading-relaxed flex-1 font-sans">
              Open the Kosh app, try the tools, and see how we make personal finance simple.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-sans font-semibold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Open the platform
              <ArrowRight size={14} className="text-accent" />
            </span>
          </a>

          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 flex flex-col transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)] overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-accent opacity-70 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-serif text-xl text-kosh-offwhite mb-3">Try a pilot for your Organization</h3>
            <p className="text-white/60 text-sm leading-relaxed flex-1 font-sans">
              Run a pilot session or workshop with your team or campus. Use the platform alongside our facilitators.
            </p>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-sans font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Start a pilot
              <ArrowRight size={14} className="text-primary" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default DigitalWaitlist;
