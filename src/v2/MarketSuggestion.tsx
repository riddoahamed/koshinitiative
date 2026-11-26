import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "@/pages/markets.css";

export default function MarketSuggestion() {
  const { pathname } = useLocation();
  const [country, setCountry] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("kosh-market-dismissed")) return;
    const ctrl = new AbortController();
    fetch("/api/market", { signal: ctrl.signal })
      .then(r => r.ok ? r.json() : null)
      .then(data => setCountry(data?.country ?? null)).catch(() => {});
    return () => ctrl.abort();
  }, []);
  if (!country || dismissed || sessionStorage.getItem("kosh-market-dismissed")) return null;
  const bd = country === "BD";
  // Only the two market homes offer a market switch. On /investors, /learn,
  // /blog and the rest, the banner covered content and offered a page that
  // was not the one the visitor came for.
  if (!(pathname === "/" || pathname === "/global") || (!bd && pathname === "/global")) return null;
  const names: Record<string, string> = { AU: "Australia", AE: "the UAE", GB: "the UK", US: "the US", CA: "Canada", BD: "Bangladesh" };
  return <aside className="market-suggestion" aria-label="Suggested market">
    <span>Looks like you’re {names[country] ? `in ${names[country]}` : "outside Bangladesh"}. Choose the context that fits you.</span>
    <a href={bd ? "/bd" : "/global"}>Switch to Kosh {bd ? "Bangladesh" : "Global"} →</a>
    <button aria-label="Dismiss market suggestion" onClick={() => { sessionStorage.setItem("kosh-market-dismissed", "1"); setDismissed(true); }}>×</button>
  </aside>;
}
