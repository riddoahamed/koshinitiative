import { Link } from "react-router-dom";
import SocialLinks from "./SocialIcons";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const toolLinks = [
  { label: "Scam Spotter", to: "/scam-spotter" },
  { label: "Comparator", to: "/comparator" },
  { label: "EMI Calculator", to: "/emi-calculator" },
  { label: "SIP Calculator", to: "/sip-calculator" },
  { label: "Car Calculator", to: "/car-calculator" },
  { label: "Budget Planner", to: "/budget-planner" },
  { label: "FDR Calculator", to: "/comparator" },
  { label: "Goal Planner", to: "/sip-calculator" },
  { label: "Money Check", to: "/#diagnostic" },
];

const Footer = () => {
  const ref = useScrollAnimation();

  return (
    <footer id="contact" className="bg-kosh-dark">
      <div ref={ref} className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-[100px]">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4">
                <img
                  src="/favicon.png"
                  alt="Kosh treasure icon"
                  className="h-14 w-14 rounded-md border border-kosh-lime/25 object-contain shadow-[0_0_34px_-12px_rgba(184,255,70,0.9)]"
                />
                <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">KOSH</h2>
              </div>
              <p className="text-kosh-mint text-sm font-sans mt-2">Financial Literacy Initiative</p>
              <p className="text-kosh-muted text-sm font-sans mt-1">Bangladesh · 2025</p>
              <SocialLinks className="mt-6" />
            </div>
          </div>

          {/* Right — Contact */}
          <div className="flex flex-col justify-center">
            <a
              href="mailto:koshinitiative@gmail.com?subject=Kosh%20Enquiry&body=Hi%20Kosh%2C%0A%0AI%20am%20reaching%20out%20because%3A"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md border border-kosh-lime/50 bg-gradient-to-r from-kosh-lime to-kosh-mint text-kosh-dark font-sans font-semibold text-sm shadow-[0_0_28px_-10px_hsl(var(--kosh-lime)/0.9)] transition-all hover:brightness-110 self-start"
            >
              Send us a message
            </a>
            <a
              href="mailto:koshinitiative@gmail.com"
              className="text-kosh-mint text-sm font-sans mt-4 hover:underline self-start"
            >
              koshinitiative@gmail.com
            </a>
            <p className="text-kosh-muted text-sm font-sans mt-4">
              WhatsApp: <a href="https://wa.me/8801632253842" target="_blank" rel="noopener noreferrer" className="text-kosh-lime hover:underline">+8801632253842</a>
            </p>
            <p className="text-kosh-muted text-sm font-sans mt-1">
              Facebook: <a href="https://facebook.com/KoshInitiative" target="_blank" rel="noopener noreferrer" className="text-kosh-mint hover:underline">facebook.com/KoshInitiative</a>
            </p>
            <p className="text-kosh-muted text-xs font-sans mt-6">
              We read every message. We will reply within 48 hours.
            </p>
            <p className="text-kosh-muted text-sm font-sans mt-4">
              Join our community:{" "}
              <a
                href="https://linktr.ee/KoshFLI"
                target="_blank"
                rel="noopener noreferrer"
                className="text-kosh-mint hover:underline"
              >
                linktr.ee/KoshFLI
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Tool links row */}
      <div className="border-t border-kosh-muted/20 px-6 md:px-12 lg:px-24 py-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {toolLinks.map((l, i) => (
            <span key={l.label} className="flex items-center gap-x-4">
              <Link
                to={l.to}
                className="text-kosh-muted hover:text-kosh-mint text-xs font-mono transition-colors"
              >
                {l.label}
              </Link>
              {i < toolLinks.length - 1 && (
                <span className="text-kosh-muted/40 text-xs">|</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-kosh-muted/20 py-6 px-6 text-center">
        <p className="text-kosh-muted text-xs font-sans">
          © 2026 Kosh Financial Literacy Initiative · koshinitiative@gmail.com · This is financial education, not financial advice.
        </p>
        <p className="mt-2 text-xs font-sans">
          <a
            href="https://app.koshbd.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kosh-mint hover:text-kosh-lime underline underline-offset-2 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-kosh-muted/40"> · </span>
          <a
            href="https://app.koshbd.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-kosh-mint hover:text-kosh-lime underline underline-offset-2 transition-colors"
          >
            Terms of Service
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
