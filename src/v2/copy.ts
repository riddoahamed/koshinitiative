/* ── The one line ─────────────────────────────────────────────────────────────
   Every page, every meta tag, the hero glass and the nav all say the same
   thing. If a visitor reads exactly one sentence on this site, it is this one.

   It is deliberately the answer to the question in the founder story, the
   question everyone froze on: "Okay… but what should I do?"                  */

/** The hook. Same fact as the "<2% invest" stat in the Problem section, read
 *  from the other side, because the share who are OUT is the arresting half.
 *  Source: CDBL BO accounts against the adult population. */
export const STAT_HOOK =
  "~98% of Bangladeshis don\u2019t have a formal investment account";

/** Short form: hero, footer, page straplines. */
export const VP_SHORT = "Learn money and investing, since we were never taught.";

/** Full form: meta description, page intros. */
export const VP_LONG =
  "Around 98% of Bangladeshis have never opened a formal investment account. Kosh teaches money and investing from the beginning: free lessons, risk-free practice on real market prices, honest answers, and tools you can use without an account.";

/** The three things we always promise, in the order people care about them. */
export const PROMISE_CHIPS = [
  "Free to start",
  "No account needed to learn",
  "We never touch your money",
];

export const MAIL = "koshinitiative@gmail.com";
export const mailto = (subject: string) =>
  `mailto:${MAIL}?subject=${encodeURIComponent(subject)}`;
