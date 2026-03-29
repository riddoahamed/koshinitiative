import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const DigitalWaitlist = () => {
  const ref = useScrollAnimation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Open mailto as a lightweight approach (no backend)
    window.location.href = `mailto:koshinitiative@gmail.com?subject=Waitlist%20Signup&body=Please%20add%20me%20to%20the%20digital%20platform%20waitlist.%0A%0AEmail%3A%20${encodeURIComponent(email)}`;
    setSubmitted(true);
  };

  return (
    <section className="bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-kosh-muted/20">
      <div ref={ref} className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Coming soon
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
          Digital Platform Waitlist
        </h2>
        <p className="text-kosh-muted text-base leading-relaxed mb-10">
          Join the waitlist for our digital platform and be the first to access
          financial tools, resources, and workshops online.
        </p>

        {submitted ? (
          <p className="text-kosh-mint font-sans font-medium text-base">
            Thank you! We'll be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-md bg-white/10 border border-kosh-muted/30 text-white placeholder:text-kosh-muted font-sans text-sm focus:outline-none focus:border-kosh-mint transition-colors"
            />
            <button
              type="submit"
              className="px-8 py-3 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-sm transition-opacity hover:opacity-90 whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default DigitalWaitlist;
