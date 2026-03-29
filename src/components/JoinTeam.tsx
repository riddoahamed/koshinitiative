import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { User, Mic, HandHelping, Building } from "lucide-react";
import { useEffect } from "react";

const roles = [
  {
    icon: User,
    title: "Campus Organiser",
    description:
      "Help bring Kosh workshops to your university. You know the campus. We have the content.",
    accent: "from-emerald-400 to-teal-500",
    number: "01",
  },
  {
    icon: Mic,
    title: "Guest Speaker",
    description:
      "Work in finance, business, or a relevant field? Share your experience with our cohort and workshop audiences.",
    accent: "from-teal-400 to-cyan-500",
    number: "02",
  },
  {
    icon: HandHelping,
    title: "Volunteer",
    description:
      "Content creation, translation, outreach, photography at events. Any capacity, any time commitment.",
    accent: "from-green-400 to-emerald-500",
    number: "03",
  },
  {
    icon: Building,
    title: "Founding Partner",
    description:
      "University, company, or organisation that wants to bring financial literacy to your people. Let us talk.",
    accent: "from-lime-400 to-green-500",
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
    <section id="join" className="bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-5xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Join the founding circle
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          We are building Kosh from the ground up.
          <br />
          If you want to be part of it — here is how.
        </h2>
        <p className="text-kosh-mint text-base leading-relaxed mb-12 max-w-2xl">
          We are looking for founding partners, volunteers, workshop facilitators,
          campus organisers, guest speakers, and community members. Tell us who you
          are and how you want to contribute.
        </p>

        {/* Role cards — modern retro style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16">
          {roles.map((role) => (
            <div
              key={role.title}
              className="group relative bg-transparent border border-white/10 rounded-2xl p-7 transition-all duration-300 hover:border-kosh-mint/40 hover:bg-white/[0.03] overflow-hidden"
            >
              {/* Gradient accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${role.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

              {/* Number tag */}
              <span className="absolute top-5 right-6 font-sans text-xs font-bold tracking-widest text-white/15 group-hover:text-kosh-mint/30 transition-colors">
                {role.number}
              </span>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-kosh-mint/10 flex items-center justify-center group-hover:bg-kosh-mint/20 transition-colors">
                  <role.icon className="w-5 h-5 text-kosh-mint" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-white text-base mb-1.5 group-hover:text-kosh-mint transition-colors">
                    {role.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/65 transition-colors">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Tally form area */}
        <div className="mb-12">
          <h3 className="font-serif text-2xl text-white mb-2">
            Tell us about yourself
          </h3>
          <p className="text-kosh-muted text-sm mb-6">
            Fill in the form below. We read every submission and reply within 48 hours.
          </p>
          <iframe
            data-tally-src="https://tally.so/embed/FORM_ID"
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
            href="https://wa.me/YOUR_NUMBER?text=Hi%20Kosh%2C%20I%20want%20to%20join%20the%20community"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-white text-white font-sans font-semibold text-sm transition-colors hover:bg-kosh-mint hover:border-kosh-mint hover:text-kosh-dark"
          >
            Join our WhatsApp community
          </a>
        </div>
      </div>
    </section>
  );
};

export default JoinTeam;
