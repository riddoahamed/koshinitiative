/* ── The one line ─────────────────────────────────────────────────────────────
   Every page, every meta tag, the hero glass and the nav all say the same
   thing. If a visitor reads exactly one sentence on this site, it is this one.

   It is deliberately the answer to the question in the founder story, the
   question everyone froze on: "Okay… but what should I do?"                  */

/** Short form — hero glass, nav, page straplines. */
export const VP_SHORT = "From “where do I start?” to your first real investment.";

/** Full form — hero H1, meta description, page intros. */
export const VP_LONG =
  "Kosh takes you from “I don’t know where to start” to your first real investment. Free lessons, risk-free practice on real market prices, and honest answers. Starting in Bangladesh.";

/** The three things we always promise, in the order people care about them. */
export const PROMISE_CHIPS = [
  "Free to start",
  "No account needed to learn",
  "We never touch your money",
];

export const MAIL = "koshinitiative@gmail.com";
export const mailto = (subject: string) =>
  `mailto:${MAIL}?subject=${encodeURIComponent(subject)}`;
