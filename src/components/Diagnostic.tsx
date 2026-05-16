import { ArrowRight, BarChart3, ExternalLink } from "lucide-react";
import { KOSH_APP_URL } from "@/lib/links";

const Diagnostic = () => {
  return (
    <section
      id="diagnostic"
      className="bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-kosh-muted/20"
    >
      <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center">
        <div>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
            Kosh app
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-white mb-5 tracking-tight">
            Take the money check inside the Kosh app.
          </h2>
          <p className="text-kosh-muted text-base md:text-lg leading-relaxed font-sans max-w-2xl">
            The financial readiness check now lives with the platform, where it can connect to tools,
            learning paths, and next steps instead of interrupting the landing page.
          </p>
        </div>

        <a
          href={KOSH_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-2xl border border-kosh-mint/25 bg-white/[0.04] p-7 md:p-8 shadow-[0_0_45px_-18px_hsl(var(--accent)/0.65)] transition-all duration-300 hover:border-kosh-mint/60 hover:bg-white/[0.06]"
        >
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-accent to-primary opacity-80 transition-opacity group-hover:opacity-100" />
          <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-kosh-mint/30 bg-kosh-mint/10 text-kosh-mint">
            <BarChart3 className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.16em] text-kosh-mint mb-3">
            6 minute check
          </p>
          <h3 className="font-serif text-2xl text-kosh-offwhite mb-3">
            Rate your money readiness.
          </h3>
          <p className="text-sm leading-relaxed text-kosh-muted font-sans">
            See where you stand across knowledge, habits, and confidence. Then explore the Kosh
            tools built around that snapshot.
          </p>
          <span className="mt-7 inline-flex items-center gap-2 text-sm font-sans font-semibold text-kosh-mint">
            Open app.koshbd.com
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </a>
      </div>
    </section>
  );
};

export default Diagnostic;
