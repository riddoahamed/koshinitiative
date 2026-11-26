import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "@/pages/markets.css";

/* A one-line note at the top of the market homes ("/" and "/global").
   It used to be a card at the bottom of the screen, where it covered the
   hero's buttons. Now it sits under the nav, steps aside once you scroll,
   and a dismissal is remembered across visits. */
const KEY = "kosh-market-dismissed";
const read = () => { try { return localStorage.getItem(KEY) || sessionStorage.getItem(KEY); } catch { return null; } };
const save = () => { try { localStorage.setItem(KEY, "1"); } catch { /* private mode: dismiss for this view only */ } };

export default function MarketSuggestion() {
  const { pathname } = useLocation();
  const [country, setCountry] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(() => !!read());
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (dismissed) return;
    const ctrl = new AbortController();
    fetch("/api/market", { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => setCountry(data?.country ?? null)).catch(() => {});
    return () => ctrl.abort();
  }, [dismissed]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > window.innerHeight * 0.4);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const bd = country === "BD";
  // Only the two market homes offer a market switch.
  const show = !!country && !dismissed && (pathname === "/" || (bd && pathname === "/global"));
  useEffect(() => {
    document.documentElement.classList.toggle("has-market", show && !scrolled);
    return () => document.documentElement.classList.remove("has-market");
  }, [show, scrolled]);
  if (!show) return null;
  const names: Record<string, string> = { AU: "Australia", AE: "the UAE", GB: "the UK", US: "the US", CA: "Canada", BD: "Bangladesh" };
  return <aside className={`market-suggestion${scrolled ? " away" : ""}`} aria-label="Suggested market">
    <span>{names[country!] ? `In ${names[country!]}?` : "Outside Bangladesh?"}</span>
    <a href={bd ? "/bd" : "/global"}>Switch to Kosh {bd ? "Bangladesh" : "Global"} →</a>
    <button aria-label="Dismiss market suggestion" onClick={() => { save(); setDismissed(true); }}>×</button>
  </aside>;
}
