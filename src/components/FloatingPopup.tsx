import { useEffect, useState } from "react";
import { X } from "lucide-react";

const FloatingPopup = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("kosh_popup_shown") === "1") {
      setDismissed(true);
      return;
    }

    // Wait until the diagnostic modal has been opened-then-closed (opt-out),
    // then appear 5 seconds later. Poll session flag.
    let appearTimer: ReturnType<typeof setTimeout> | null = null;
    let dismissTimer: ReturnType<typeof setTimeout> | null = null;

    const tryShow = () => {
      // Don't show if user already scrolled past the diagnostic section
      const el = document.getElementById("diagnostic");
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0) return;
      }
      setVisible(true);
      // Auto-dismiss after 6 seconds
      dismissTimer = setTimeout(() => {
        setVisible(false);
        setDismissed(true);
        sessionStorage.setItem("kosh_popup_shown", "1");
      }, 6000);
    };

    const interval = setInterval(() => {
      if (sessionStorage.getItem("kosh_diag_popup_dismissed") === "1") {
        clearInterval(interval);
        appearTimer = setTimeout(tryShow, 5000);
      }
    }, 400);

    return () => {
      clearInterval(interval);
      if (appearTimer) clearTimeout(appearTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("kosh_popup_shown", "1");
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
      className="fixed bottom-4 right-4 z-[60] max-w-[260px] animate-in fade-in slide-in-from-bottom-3 duration-1000 ease-out"
      role="status"
      aria-live="polite"
    >
      <div
        className="relative rounded-2xl bg-[#0D2B27] text-white border border-white/10 shadow-2xl px-3 py-2.5 pr-7"
        style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.5)" }}
      >
        <button
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-1.5 right-1.5 text-white/50 hover:text-white transition-colors"
        >
          <X size={12} />
        </button>
        <div className="flex items-start gap-2">
          <span className="text-sm leading-none mt-0.5">🧠</span>
          <div className="flex-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-kosh-mint mb-0.5">
              Real quick
            </p>
            <p className="text-xs leading-snug mb-1.5">
              Do you actually know your money situation? Takes 6 min.
            </p>
            <button
              onClick={goCheck}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#02C39A", color: "#0D2B27" }}
            >
              Check now
            </button>
            <p className="text-white/50 text-[10px] mt-1.5 leading-snug">
              Or find it later in the menu, no rush.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPopup;
