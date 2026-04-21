import { useEffect, useState } from "react";
import { X } from "lucide-react";

const FloatingPopup = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("kosh_diag_popup_dismissed") === "1") {
      setDismissed(true);
      return;
    }

    const t = setTimeout(() => {
      // Don't show if user already scrolled past the diagnostic section
      const el = document.getElementById("diagnostic");
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) return; // already past
      }
      setVisible(true);
    }, 4000);

    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("kosh_diag_popup_dismissed", "1");
    setVisible(false);
    setDismissed(true);
  };

  const goCheck = () => {
    const el = document.getElementById("diagnostic");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    dismiss();
  };

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] max-w-[320px] animate-in fade-in slide-in-from-bottom-2 duration-500"
      role="status"
      aria-live="polite"
    >
      <div
        className="relative rounded-2xl bg-[#0D2B27] text-white border border-white/10 shadow-2xl px-4 py-3 pr-9"
        style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" }}
      >
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-2 right-2 text-white/50 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
        <div className="flex items-start gap-2">
          <span className="text-base leading-none mt-0.5">🧠</span>
          <div className="flex-1">
            <p className="text-xs font-mono uppercase tracking-wider text-kosh-mint mb-0.5">
              Real quick
            </p>
            <p className="text-sm leading-snug mb-2">
              Do you actually know your money situation? Takes 6 min.
            </p>
            <button
              onClick={goCheck}
              className="text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#02C39A", color: "#0D2B27" }}
            >
              Check now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPopup;
