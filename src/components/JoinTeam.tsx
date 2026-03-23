import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const JoinTeam = () => {
  const ref = useScrollAnimation();

  return (
    <section className="bg-kosh-offwhite py-20 md:py-28 px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-3xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Volunteer with Kosh
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-dark mb-6">
          Want to help build this?
        </h2>
        <p className="text-kosh-muted text-base leading-relaxed mb-10">
          Kosh is early stage and growing. If you believe financial literacy matters
          in Bangladesh and want to contribute — as a volunteer facilitator, campus
          coordinator, content creator, or in any capacity — we want to hear from you.
          No formal experience required. Just genuine interest in the mission.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <a
            href="mailto:koshinitiative@gmail.com?subject=Volunteer%20Application%20%E2%80%94%20Kosh&body=Hi%20Kosh%2C%0A%0AI%20would%20like%20to%20volunteer.%0A%0AMy%20name%3A%0AHow%20I%20want%20to%20help%3A%0A%0AI%20have%20attached%20my%20CV%20%2F%20resume."
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-teal text-white font-sans font-semibold text-sm transition-opacity hover:opacity-90"
          >
            Send us your details
          </a>
          <a
            href="mailto:koshinitiative@gmail.com"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-kosh-teal text-kosh-teal font-sans font-medium text-sm transition-opacity hover:opacity-90"
          >
            Email us directly
          </a>
        </div>

        <p className="text-kosh-muted text-[13px] font-sans">
          Send us a short note about yourself and how you want to contribute.
          Attach your CV if you have one. We reply to every message.
        </p>
      </div>
    </section>
  );
};

export default JoinTeam;
