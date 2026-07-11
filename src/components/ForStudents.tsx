import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ForStudents = () => {
  const ref = useScrollAnimation();

  return (
    <section className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]" />
      <div ref={ref} className="relative max-w-3xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Reach further, together
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
          Kosh works with the institutions closest to underserved Bangladeshis.
        </h2>
        <p className="text-kosh-muted text-base leading-relaxed mb-8 font-sans">
          We serve students, young professionals, first-time investors, women, and SME owners
          directly through the app and workshops. To reach industrial workforces, rural women,
          and low-income savers, we partner with employers, NGOs, INGOs, and development partners
          who already have the trust and the last-mile reach.
        </p>
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            "Students",
            "Young professionals",
            "First-time investors",
            "Women",
            "SME owners",
            "Employers",
            "NGOs · INGOs",
            "Universities",
            "Development partners",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 font-sans text-[11px] font-medium text-kosh-offwhite/80"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href="mailto:koshinitiative@gmail.com?subject=Partner%20with%20Kosh&body=Hi%20Kosh%2C%20we%27d%20like%20to%20partner.%20Our%20organisation%3A"
          className="inline-flex items-center justify-center rounded-md border border-kosh-lime/50 bg-gradient-to-r from-kosh-lime to-kosh-mint px-8 py-3.5 text-sm font-sans font-semibold text-kosh-dark shadow-[0_0_28px_-10px_hsl(var(--kosh-lime)/0.9)] transition-all hover:brightness-110"
        >
          Reach your community with Kosh
        </a>
      </div>
    </section>
  );
};

export default ForStudents;
