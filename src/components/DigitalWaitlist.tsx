import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import appHome from "@/assets/brand/app-home.jpg";
import appTools from "@/assets/brand/app-tools.jpg";
import appExplainers from "@/assets/brand/app-explainers.jpg";
import { KOSH_APP_URL } from "@/lib/links";

const appHighlights = [
  "Money level check",
  "Bangladesh-specific tools",
  "Short explainers and comparisons",
];

const DigitalWaitlist = () => {
  const ref = useScrollAnimation();

  return (
    <section className="relative bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-accent/12 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-primary/14 blur-[140px]" />

      <div ref={ref} className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-4 text-kosh-mint">
            Kosh app
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-kosh-offwhite mb-5 tracking-tight">
            A financial literacy product, not another content page.
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-sans">
            The app turns money education into a guided path: checks, tools, explainers, levels,
            and small actions people can actually come back to.
          </p>

          <div className="space-y-3 mb-9">
            {appHighlights.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-sans text-kosh-offwhite/85">
                <CheckCircle2 className="h-4 w-4 text-kosh-mint" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={KOSH_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-kosh-mint px-6 py-3.5 text-sm font-sans font-semibold text-[#071210] transition-opacity hover:opacity-90"
            >
              Open app.koshbd.com
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#get-involved-form"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3.5 text-sm font-sans font-semibold text-white transition-colors hover:border-kosh-mint/50 hover:text-kosh-mint"
            >
              Request prototype access
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative min-h-[560px] lg:min-h-[680px]">
          <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <img
            src={appHome}
            alt="Kosh app home screen with money level check"
            className="absolute left-1/2 top-0 z-20 w-[58%] max-w-[310px] -translate-x-1/2 rounded-[1.8rem] border border-white/15 shadow-[0_30px_100px_-28px_rgba(0,0,0,0.9)] sm:w-[46%]"
          />
          <img
            src={appTools}
            alt="Kosh app tools screen"
            className="absolute left-0 top-24 z-10 w-[45%] max-w-[250px] -rotate-6 rounded-[1.6rem] border border-white/12 opacity-[0.82] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.85)] sm:w-[39%]"
          />
          <img
            src={appExplainers}
            alt="Kosh app explainers screen"
            className="absolute right-0 top-32 z-10 w-[45%] max-w-[250px] rotate-6 rounded-[1.6rem] border border-white/12 opacity-[0.82] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.85)] sm:w-[39%]"
          />
          <div className="absolute bottom-0 left-0 right-0 z-30 rounded-2xl border border-kosh-mint/20 bg-[#071210]/80 px-5 py-4 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.22em] text-kosh-mint mb-2 font-sans font-semibold">
              Product principle
            </p>
            <p className="text-sm md:text-base text-kosh-offwhite/85 font-sans leading-relaxed">
              No products. No commissions. No hidden agenda. Just education built around the
              money decisions Bangladeshis actually face.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DigitalWaitlist;
