import SocialLinks from "./SocialIcons";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Footer = () => {
  const ref = useScrollAnimation();

  return (
    <footer id="contact" className="bg-kosh-dark">
      <div ref={ref} className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-[100px]">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight">KOSH</h2>
              <p className="text-kosh-mint text-sm font-sans mt-2">Financial Literacy Initiative</p>
              <p className="text-kosh-muted text-sm font-sans mt-1">Bangladesh · 2025</p>
              <SocialLinks className="mt-6" />
            </div>
          </div>

          {/* Right — Contact */}
          <div className="flex flex-col justify-center">
            <a
              href="mailto:koshinitiative@gmail.com?subject=Kosh%20Enquiry&body=Hi%20Kosh%2C%0A%0AI%20am%20reaching%20out%20because%3A"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-sm transition-opacity hover:opacity-90 self-start"
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
              WhatsApp: <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" className="text-kosh-mint hover:underline">YOUR_WHATSAPP_NUMBER</a>
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

      {/* Bottom bar */}
      <div className="border-t border-kosh-muted/20 py-6 px-6 text-center">
        <p className="text-kosh-muted text-xs font-sans">
          © 2026 Kosh Financial Literacy Initiative · koshinitiative@gmail.com · This is financial education, not financial advice.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
