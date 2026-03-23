import { useState } from "react";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Footer = () => {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xeooojed", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer id="contact" className="bg-kosh-dark">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">KOSH</h2>
              <p className="text-kosh-mint text-sm font-sans mt-2">Financial Literacy Initiative</p>
              <p className="text-kosh-muted text-sm font-sans mt-1">Bangladesh · 2025</p>

              <div className="flex gap-4 mt-6">
                <a
                  href="https://instagram.com/kosh.initiative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-kosh-mint transition-colors"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://linkedin.com/company/kosh-financial-literacy-initiative"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-kosh-mint transition-colors"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Right — Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Name"
                  className="w-full bg-transparent border-b border-kosh-muted text-white placeholder:text-kosh-muted py-3 text-sm font-sans focus:outline-none focus:border-kosh-mint transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="Email"
                  className="w-full bg-transparent border-b border-kosh-muted text-white placeholder:text-kosh-muted py-3 text-sm font-sans focus:outline-none focus:border-kosh-mint transition-colors"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  placeholder="Tell us about your university, company, or how you want to get involved."
                  className="w-full bg-transparent border-b border-kosh-muted text-white placeholder:text-kosh-muted py-3 text-sm font-sans focus:outline-none focus:border-kosh-mint transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
              {status === "sent" && (
                <p className="text-kosh-mint text-sm font-sans">Thank you. We will be in touch.</p>
              )}
              {status === "error" && (
                <p className="text-red-400 text-sm font-sans">Something went wrong. Please try again.</p>
              )}
            </form>
            <p className="text-kosh-muted text-xs font-sans mt-6">
              We read every message. We will reply within 48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-kosh-muted/20 py-6 px-6 text-center">
        <p className="text-kosh-muted text-xs font-sans">
          © 2025 Kosh Financial Literacy Initiative · koshinitiative@gmail.com · This is financial education, not financial advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
