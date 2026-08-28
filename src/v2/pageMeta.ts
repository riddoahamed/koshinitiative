import { VP_LONG } from "./copy";

/* ── One description per route, in one place ──────────────────────────────────

   Every page used to carry its own title and description inline, passed to
   PageShell where only a browser running JavaScript would ever see them. That
   was fine while the client was the only consumer. It stopped being fine the
   moment the edge middleware needed the same strings for link previews: a
   string that lives inside a React component cannot be read by code that runs
   before React exists.

   Copying them into the middleware would have created the failure this
   codebase keeps meeting — two sets of copy, one of them slowly becoming
   untrue, and nobody noticing because both render fine. So the copy moved
   here, and BOTH consumers read it:

     · the page components, via PageShell → applySeo (what a human sees)
     · middleware.ts, via ogMeta (what an unfurler sees)

   This module must stay import-pure. It is pulled into the Vercel edge bundle,
   which is built by Vercel and not by Vite, so nothing here may reach for a
   path alias, the DOM, or anything with side effects. `copy.ts` is safe on the
   same grounds — it has no imports of its own.                              */

export interface PageMeta {
  title: string;
  description: string;
  /** Keep out of search. Set where the page is a tool for a room rather than
      something anyone should land on cold — the preview must agree with the
      page, or the middleware quietly makes an unindexed page indexable. */
  noindex?: boolean;
}

/** Keyed by pathname, no trailing slash. "/" is the homepage. */
export const PAGE_META: Record<string, PageMeta> = {
  "/": {
    title: "From “where do I start?” to your first real investment",
    description: VP_LONG,
  },
  "/blog": {
    title: "Blog — money in Bangladesh, explained",
    description:
      "Free lessons, guides, how-tos and straight answers about money and investing in Bangladesh. How to start, how to spot a scam, how much you need, what Sanchaypatra and DPS really pay, and how to use the Kosh app. No account needed.",
  },
  "/blog/submit": {
    title: "Submit to the Kosh blog",
    description:
      "Submit a lesson, guide, how-to or answer for the Kosh blog. Everything is reviewed by a human before it goes live.",
  },
  "/learn": {
    title: "Quick money lessons",
    description:
      "Six two-minute lessons for first-time investors in Bangladesh: what investing actually is, the emergency fund, Sanchaypatra vs DPS vs FDR, mutual funds, how to spot a scam, and your first ৳1,000. Free, no account needed.",
  },
  "/start": {
    title: "If I were to start investing today",
    description:
      "The honest starting order for a first-time investor in Bangladesh — where you stand, the buffer that comes first, what you're actually being offered, risk-free practice, and a first real move that can't hurt you.",
  },
  "/quiz": {
    title: "What kind of investor am I?",
    description:
      "A 60-second, six-question read on where you actually stand as a first-time investor in Bangladesh — your buffer, your income, and how you'd really react to a bad month. Free, no account, no advice pitch.",
  },
  "/investkorsi": {
    title: "InvestKorsi — scams, frauds, and the ones that paid",
    description:
      "A public ledger of what happened to people's money at Bangladeshi platforms, companies and ventures. Anonymous reports on the frauds, the projects that went quiet, and the investments that did exactly what they said. Free to read, no account needed.",
  },
  "/feedback": {
    title: "What people are telling us",
    description:
      "Real feedback from Kosh users, grouped into themes by AI — anonymous, paraphrased, and never the raw text. See what people are asking us to fix or build next.",
  },
  "/vote": {
    title: "Kosh Live, vote, reveal, decide",
    description:
      "A live session tool from Kosh: vote on what you'd do with ৳10 lakh, see the room's answer, then walk through how the decision actually gets made.",
    // Run in a room, shared by a link on a slide. It has never been a page to
    // find in search, and Vote.tsx has said so since it was written.
    noindex: true,
  },
};

/* Routes that render the same page under a second path. An alias must unfurl
   as the thing it actually shows, not as the site default — /investor-type is
   the URL people share, and it was previewing as the homepage. */
export const PATH_ALIASES: Record<string, string> = {
  "/live": "/vote",
  "/investor-type": "/quiz",
};
