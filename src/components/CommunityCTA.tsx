import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import followTemplate from "@/assets/brand/kosh-follow-template.jpg";
import { KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";

const CommunityCTA = () => {
  const ref = useScrollAnimation();

  return (
    <section id="join" className="relative bg-kosh-dark py-16 md:py-[110px] px-5 md:px-12 lg:px-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--kosh-lime)/0.12),transparent_30%)]" />

      <div ref={ref} className="relative mx-auto max-w-5xl">
        <div className="relative mx-auto overflow-hidden rounded-[10px] border border-kosh-lime/20 bg-[#eee7d8] shadow-[0_34px_120px_-52px_hsl(var(--kosh-lime)/0.72)]">
          <img
            src={followTemplate}
            alt="Kosh archive style field note with Bangladesh line art and Kosh brand elements"
            className="block w-full"
            loading="lazy"
          />

          <div className="absolute inset-x-[13%] top-[18%] bottom-[17%] flex flex-col items-center justify-center text-center">
            <p className="mb-4 font-signal text-[10px] font-semibold uppercase tracking-[0.28em] text-[#153068] opacity-70 md:text-xs">
              Kosh archive / field note
            </p>
            <h2 className="max-w-2xl font-display text-[34px] font-extrabold leading-[0.96] tracking-tight text-[#061846] sm:text-5xl md:text-6xl lg:text-7xl">
              This is just the beginning.
            </h2>
            <p className="mt-5 max-w-xl font-signal text-[11px] uppercase tracking-[0.16em] text-[#123174] opacity-80 sm:text-xs md:text-sm">
              Follow the build, test the beta, and help shape financial literacy for Bangladesh.
            </p>

            <div className="mt-7 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="https://instagram.com/kosh.initiative"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-[#061846]/15 bg-[#061846] px-5 py-3 font-sans text-sm font-semibold text-kosh-lime shadow-[0_14px_34px_-20px_#061846] transition-all hover:-translate-y-0.5 hover:bg-[#0a2360]"
              >
                Follow Instagram
              </a>
              <a
                href={KOSH_WAITLIST_EMAIL_URL}
                className="inline-flex items-center justify-center rounded-md border border-[#061846]/20 bg-kosh-lime px-5 py-3 font-sans text-sm font-semibold text-[#061846] transition-all hover:-translate-y-0.5 hover:brightness-105"
              >
                Join beta waitlist
              </a>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center font-signal text-[11px] uppercase tracking-[0.18em] text-kosh-muted md:text-xs">
          Building futures in public. Workshops, tools, and a beta app are moving together.
        </p>
      </div>
    </section>
  );
};

export default CommunityCTA;
