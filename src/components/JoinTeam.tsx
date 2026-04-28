import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { User, Mic, HandHelping, Building } from "lucide-react";
import { useEffect } from "react";

const roles = [
  {
    icon: User,
    title: "Campus Organiser",
    description:
      "Help bring Kosh workshops to your university. You know the campus. We have the content.",
    accent: "from-primary via-primary/60 to-accent",
    number: "01",
  },
  {
    icon: Mic,
    title: "Guest Speaker",
    description:
      "Work in finance, business, or a relevant field? Share your experience with our cohort and workshop audiences.",
    accent: "from-accent via-primary/60 to-primary",
    number: "02",
  },
  {
    icon: HandHelping,
    title: "Volunteer",
    description:
      "Content creation, translation, outreach, photography at events. Any capacity, any time commitment.",
    accent: "from-primary to-accent",
    number: "03",
  },
  {
    icon: Building,
    title: "Founding Partner",
    description:
      "University, company, or organisation that wants to bring financial literacy to your people. Let us talk.",
    accent: "from-accent to-primary",
    number: "04",
  },
];

const JoinTeam = () => {
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
    <section id="join" className="relative bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24 overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-accent/15 blur-[140px]" />

      <div ref={ref} className="relative max-w-5xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
          Join the founding circle
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          We are building Kosh from the ground up.
          <br />
          If you want to be part of it — here is how.
        </h2>
        <p className="text-white/60 text-base leading-relaxed mb-12 max-w-2xl font-sans">
          We are looking for founding partners, volunteers, workshop facilitators,
          campus organisers, guest speakers, and community members. Tell us who you
          are and how you want to contribute.
        </p>

        {/* Role cards — glassmorphic, purple/green vibe */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {roles.map((role) => (
            <div
              key={role.title}
              className="group relative bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-7 transition-all duration-300 hover:border-primary/40 hover:bg-white/[0.06] hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)] overflow-hidden"
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${role.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />

              {/* Number tag */}
              <span className="absolute top-5 right-6 font-sans text-xs font-bold tracking-widest text-white/15 group-hover:text-primary/40 transition-colors">
                {role.number}
              </span>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-colors">
                  <role.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-white text-base mb-1.5 transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-white/55 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Tally form area */}
        <div className="mb-12 bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_0_60px_-20px_hsl(var(--primary)/0.4)]">
          <h3 className="font-serif text-2xl text-white mb-2">
            Tell us about yourself
          </h3>
          <p className="text-white/55 text-sm mb-6 font-sans">
            Fill in the form below. We read every submission and reply within 48 hours.
          </p>
          <iframe
            data-tally-src="https://tally.so/embed/RGRAOQ"
            loading="lazy"
            width="100%"
            height={500}
            frameBorder="0"
            title="Join the Kosh founding circle"
            className="rounded-md"
          />
        </div>

        {/* WhatsApp button */}
        <div className="text-center">
          <a
            href="https://chat.whatsapp.com/GSHCPsdgt7s2aONoVa15Zj?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground font-sans font-semibold text-sm transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.7)] hover:scale-[1.02]"
          >
            Join our WhatsApp community
          </a>
        </div>
      </div>
    </section>
  );
};

export default JoinTeam;
