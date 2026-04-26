import { useEffect } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const GetInvolvedForm = () => {
  const ref = useScrollAnimation();

  useEffect(() => {
    const d = document;
    const w = "https://tally.so/widgets/embed.js";
    const v = function () {
      if (typeof (window as any).Tally !== "undefined") {
        (window as any).Tally.loadEmbeds();
      } else {
        d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(
          (e: any) => {
            e.src = e.dataset.tallySrc;
          }
        );
      }
    };
    if (typeof (window as any).Tally !== "undefined") {
      v();
    } else if (d.querySelector('script[src="' + w + '"]') == null) {
      const s = d.createElement("script");
      s.src = w;
      s.onload = v;
      s.onerror = v;
      d.body.appendChild(s);
    }
  }, []);

  return (
    <section
      id="get-involved-form"
      className="relative py-16 md:py-[100px] px-6 md:px-12 lg:px-24 bg-kosh-dark overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-accent/15 blur-[120px]" />
      </div>

      <div ref={ref} className="relative max-w-2xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-4">
          Get in touch
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-kosh-offwhite mb-4 tracking-tight">
          Tell us about yourself.
        </h2>
        <p className="text-kosh-muted leading-relaxed mb-2 font-sans text-base">
          Whether you want to bring Kosh to your institution or join the team — fill in the form below. We read every submission and reply within 48 hours.
        </p>
        <p className="text-kosh-muted/60 text-xs font-sans mb-10">
          (heads up — the form takes a sec to load. we know. we're working on it. 🫠)
        </p>
        <div className="relative max-w-[640px] mx-auto rounded-2xl border border-primary/25 bg-white/[0.03] backdrop-blur-md p-4 md:p-6 shadow-[0_0_60px_-20px_hsl(var(--primary)/0.6)]">
          <iframe
            data-tally-src="https://tally.so/embed/RGRAOQ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
            loading="lazy"
            width="100%"
            height={500}
            frameBorder="0"
            title="Join Kosh"
            className="rounded-md"
          />
        </div>
      </div>
    </section>
  );
};

export default GetInvolvedForm;
