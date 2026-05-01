import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const ForStudents = () => {
  const ref = useScrollAnimation();

  return (
    <section className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]" />
      <div ref={ref} className="relative max-w-3xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Building foundations early
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
          Financial literacy should not wait until university.
        </h2>
        <p className="text-kosh-muted text-base leading-relaxed mb-10 font-sans">
          We run specialised sessions for secondary and higher secondary students
          across Bangladesh — introducing budgeting, savings, and financial
          decision-making before the pressure of real income begins. Because the
          earlier someone understands how money works, the better every decision
          after it becomes.
        </p>
        <a
          href="mailto:koshinitiative@gmail.com?subject=School%20Session%20Enquiry&body=Hi%20Kosh%2C%20I%20would%20like%20to%20bring%20a%20session%20to%20my%20school.%20Here%20are%20my%20details%3A"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-sm transition-opacity hover:opacity-90"
        >
          Bring Kosh to your school
        </a>
      </div>
    </section>
  );
};

export default ForStudents;
