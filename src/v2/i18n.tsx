import { Link, useLocation } from "react-router-dom";

/* ── TWO LANGUAGES, ONE PAGE ──────────────────────────────────────────────────

   The FDR table and the InvestKorsi ledger are the two pages most likely to be
   somebody's first arrival, and most of that audience reads Bangla first. They
   needed a Bangla version.

   The tempting shortcut is a second copy of each page. That is how you end up
   with a Bangla page quoting last quarter's rates: the English one gets the fix
   and the Bangla one is forgotten. So there is ONE page per tool and a
   dictionary, and every number, bank name and rate still comes from the same
   source in both languages. A translation can go stale; a divergent fork goes
   wrong.

   The language lives in the URL (`/bn/fdr-rates`) rather than in state, because
   a Bangla page nobody can link to or index is not really a Bangla page. The
   fdr/seo.ts generator has been emitting an `hreflang="bn-BD"` alternate all
   along — it finally points somewhere true. */

export type Lang = "en" | "bn";

/** The Bangla mirror of every localised route, keyed by the English path. */
export const BN_OF: Record<string, string> = {
  "/fdr-rates": "/bn/fdr-rates",
  "/investkorsi": "/bn/investkorsi",
};
export const EN_OF: Record<string, string> = Object.fromEntries(
  Object.entries(BN_OF).map(([en, bn]) => [bn, en])
);

export const useLang = (): Lang =>
  useLocation().pathname.startsWith("/bn/") ? "bn" : "en";

/** Pick the right half of a bilingual string pair. */
export const pick = <T,>(lang: Lang, en: T, bn: T): T => (lang === "bn" ? bn : en);

/** Bengali-Arabic numerals, for prose where Latin digits look imported.
 *  Rates and table figures stay Latin on purpose: they are read against the
 *  banks' own published charts, which use Latin digits. */
const BN_DIGIT = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const bnNum = (n: number | string): string =>
  String(n).replace(/[0-9]/g, (d) => BN_DIGIT[+d]);

/** The switch itself. Renders on both halves of a pair and always links to the
 *  other one, so it is a real anchor a reader can open in a new tab. */
export const LangToggle = ({ className = "" }: { className?: string }) => {
  const { pathname } = useLocation();
  const isBn = pathname.startsWith("/bn/");
  const other = isBn ? EN_OF[pathname] : BN_OF[pathname];
  if (!other) return null;
  return (
    <div className={`langsw ${className}`.trim()}>
      <Link to={isBn ? other : pathname} aria-current={!isBn ? "true" : undefined} className={!isBn ? "on" : ""}>
        English
      </Link>
      <Link to={isBn ? pathname : other} aria-current={isBn ? "true" : undefined} className={isBn ? "on" : ""}>
        বাংলা
      </Link>
    </div>
  );
};
