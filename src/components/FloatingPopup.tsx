import { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, X } from "lucide-react";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";

const FloatingPopup = () => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("kosh_tester_popup_shown") === "1") {
      setDismissed(true);
      return;
    }

    let dismissTimer: ReturnType<typeof setTimeout> | null = null;
    const appearTimer = setTimeout(() => {
      setVisible(true);
      dismissTimer = setTimeout(() => {
        setVisible(false);
        setDismissed(true);
        sessionStorage.setItem("kosh_tester_popup_shown", "1");
      }, 12000);
    }, 14000);

    return () => {
      clearTimeout(appearTimer);
      if (dismissTimer) clearTimeout(dismissTimer);
    };
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("kosh_tester_popup_shown", "1");
    setVisible(false);
    setDismissed(true);
  };

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[60] max-w-[300px] animate-in fade-in slide-in-from-bottom-3 duration-1000 ease-out"
      role="status"
      aria-live="polite"
    >
      <div
        className="relative rounded-2xl bg-[#0D2B27] text-white border border-kosh-mint/20 shadow-2xl px-4 py-3.5 pr-8"
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
          <div className="flex-1">
            <p className="text-[10px] font-mono uppercase tracking-wider text-kosh-mint mb-1">
              Beta access
            </p>
            <p className="text-sm leading-snug mb-3">
              Try the current Kosh beta, or join the waitlist for the full app.
            </p>
            <a
              href={KOSH_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#02C39A", color: "#0D2B27" }}
            >
              Try beta app
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={KOSH_WAITLIST_EMAIL_URL}
              onClick={dismiss}
              className="ml-2 inline-flex items-center gap-1 text-[12px] font-semibold text-kosh-mint hover:text-white"
            >
              Waitlist
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </a>
            <p className="text-white/50 text-[10px] mt-2 leading-snug">
              Early access now. Full app waitlist for what comes next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingPopup;
