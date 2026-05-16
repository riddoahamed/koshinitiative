import { useState } from "react";
import { Menu, X } from "lucide-react";
import koshLogo from "@/assets/kosh-logo.png";
import { KOSH_APP_URL } from "@/lib/links";

const links = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Money Check", href: "#diagnostic" },
  { label: "For Organizations", href: "#for-organizations" },
  { label: "Tools", href: "#tools" },
  { label: "Resources", href: "#learn" },
  { label: "Get Involved", href: "#get-involved-form" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-kosh-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="w-full px-5 md:px-8 lg:px-10 flex items-center justify-between h-14 gap-4">
        <a href="#" className="flex items-center shrink-0">
          <img src={koshLogo} alt="Kosh" className="h-7 w-auto" />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-5 flex-1 justify-end">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-mono text-kosh-muted hover:text-kosh-mint transition-colors whitespace-nowrap"
            >
              {l.label}
            </a>
          ))}
          <a
            href={KOSH_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-kosh-mint hover:text-white transition-colors whitespace-nowrap"
          >
            Open App
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="text-white"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-kosh-dark/95 backdrop-blur-md border-t border-white/5 px-6 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-sm font-mono text-kosh-muted hover:text-kosh-mint transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href={KOSH_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="block text-sm font-mono text-kosh-mint hover:text-white transition-colors"
          >
            Open App
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
