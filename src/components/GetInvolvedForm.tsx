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
    <section id="get-involved-form" className="py-16 md:py-[100px] px-6 md:px-12 lg:px-24 bg-primary text-xs">
      <div ref={ref} className="max-w-2xl mx-auto">
        <h2 className="text-3xl text-white mb-3 md:text-5xl font-mono">
          Tell us about yourself.
        </h2>
        <p className="text-[#9FE1CB] leading-relaxed mb-2 font-mono text-sm">
          Whether you want to bring Kosh to your institution or join the team — fill in the form below. We read every submission and reply within 48 hours.
        </p>
        <p className="text-kosh-muted/60 text-xs font-mono mb-12">
          (heads up — the form takes a sec to load. we know. we're working on it. 🫠)
        </p>
        <div className="max-w-[640px] mx-auto">
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
