import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import koshLogo from "@/assets/kosh-logo.png";

const CommunityCTA = () => {
  const ref = useScrollAnimation();

  return (
    <section id="join" className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/12 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/12 blur-[140px]" />
      <div ref={ref} className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight mb-6">
          This is just the beginning.
        </h2>
        <p className="text-kosh-muted text-base md:text-lg font-sans leading-relaxed mb-10 max-w-2xl mx-auto">
          Kosh is being built in public, from scratch, with no hidden agenda. If you believe financial education should be honest and accessible — follow along. Or get involved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="https://instagram.com/kosh.initiative"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-kosh-mint text-kosh-mint font-sans font-medium text-sm transition-all hover:bg-kosh-mint/10"
          >
            Follow on Instagram
          </a>
          <a
            href="https://www.linkedin.com/company/koshinitiative"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-kosh-mint text-kosh-mint font-sans font-medium text-sm transition-all hover:bg-kosh-mint/10"
          >
            Find us on LinkedIn
          </a>
        </div>

        {/* Kosh logomark */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-kosh-mint/10 blur-3xl" />
          </div>
          <img
            src={koshLogo}
            alt="Kosh logomark"
            className="relative w-28 h-28 md:w-40 md:h-40 object-contain opacity-80"
          />
        </div>
      </div>
    </section>
  );
};

export default CommunityCTA;
