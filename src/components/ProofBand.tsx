import koshLogo from "@/assets/brand/kosh-logo-transparent.png";
import nsuLogo from "@/assets/brand/nsu-startups-next-logo.jpg";

const ProofBand = () => {
  return (
    <section className="relative bg-kosh-dark px-6 md:px-12 lg:px-24 py-12 md:py-16 border-y border-white/10 overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-[radial-gradient(circle_at_25%_50%,hsl(var(--accent)/0.16),transparent_50%)]" />
      <div className="relative max-w-6xl mx-auto grid gap-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
        <div>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.22em] text-kosh-mint mb-3">
            Ecosystem signal
          </p>
          <h2 className="font-serif text-2xl md:text-4xl text-white tracking-tight">
            Building from inside Bangladesh's startup ecosystem.
          </h2>
        </div>

        <div className="hidden md:block h-24 w-px bg-white/10" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
          <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/45 mb-3">Part of</p>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white p-1.5">
                <img src={nsuLogo} alt="NSU Startups Next" className="h-full w-full object-contain" />
              </span>
              <div>
                <p className="font-sans text-lg md:text-xl font-extrabold leading-tight text-white">
                  NSU Startups Next
                </p>
                <p className="text-xs font-sans text-kosh-muted mt-1">Cohort 4 · May 2026</p>
              </div>
            </div>
          </div>

          <span className="hidden sm:inline text-kosh-mint/70 font-sans font-semibold">x</span>

          <div className="flex items-center gap-3 rounded-xl border border-kosh-mint/20 bg-kosh-mint/10 px-5 py-4">
            <img src={koshLogo} alt="Kosh" className="h-10 w-10 object-contain" />
            <div>
              <p className="font-sans text-xl md:text-2xl font-extrabold tracking-[0.16em] text-white">
                KOSH
              </p>
              <p className="text-xs font-sans text-kosh-muted">Financial Literacy Initiative</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofBand;
