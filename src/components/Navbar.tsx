import { useState } from "react";
import { Menu, X } from "lucide-react";
import koshLogo from "@/assets/kosh-logo.png";

const links = [
  { label: "What We Do", href: "#what-we-do" },
  { label: "Why It Matters", href: "#why-it-matters" },
  { label: "Resources", href: "#learn" },
  { label: "Get Involved", href: "#get-involved-form" },
  { label: "Community", href: "#join" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-kosh-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between h-14">
        <a href="#" className="flex items-center">
          <img src={koshLogo} alt="Kosh" className="h-7 w-auto" />
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs font-mono text-kosh-muted hover:text-kosh-mint transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
