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
    /* Leads on the fact rather than the promise: "98% of Bangladeshis have no
       investment account" is the half of this sentence a stranger stops for,
       and it is the same CDBL figure the Problem section cites. */
    title: "Learn money and investing, since we were never taught",
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
  "/fdr-rates": {
    title: "FDR rates in Bangladesh — every bank, updated monthly",
    description:
      "What every scheduled bank in Bangladesh pays on a fixed deposit, from Bangladesh Bank's own monthly filing chart: 61 banks, five tenures, Islamic and conventional, each linked to the bank's own rate page. No sponsored placements.",
  },
  "/fdr-rates/faq": {
    title: "FDR questions — rates, tax, protection and profit rates",
    description:
      "Will I get the advertised rate? What is taxed at source? What happens if the bank fails? Why do Islamic banks quote a provisional profit rate? Straight answers about fixed deposits in Bangladesh, with sources.",
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
      "Eight moments every Bangladeshi saver has lived through — a cousin at a wedding, salary day, a red week — and one of eight investor types at the end of it. About 90 seconds. Free, no account, no advice pitch.",
  },
  "/investkorsi": {
    title: "InvestKorsi — scams, frauds, and the ones that paid",
    description:
      "A public ledger of what happened to people's money at Bangladeshi platforms, companies and ventures. Anonymous reports on the frauds, the projects that went quiet, and the investments that did exactly what they said. Free to read, no account needed.",
  },
  /* ── The Bangla halves ───────────────────────────────────────────────────
     Written in Bangla rather than translated at the last moment: a search
     result is the one line most of this audience reads before deciding, and a
     machine-flavoured one reads as a machine. */
  "/bn/fdr-rates": {
    title: "এফডিআর রেট — বাংলাদেশের সব ব্যাংকের হার, প্রতি মাসে হালনাগাদ",
    description:
      "বাংলাদেশের প্রতিটি তফসিলি ব্যাংক স্থায়ী আমানতে কত সুদ দেয়, বাংলাদেশ ব্যাংকের নিজস্ব মাসিক তালিকা থেকে: ৬১টি ব্যাংক, পাঁচটি মেয়াদ, ইসলামি ও প্রচলিত দুই ধরনের, প্রতিটির সঙ্গে ব্যাংকের নিজের রেট পেজের লিংক। কোনো স্পনসর্ড জায়গা নেই।",
  },
  "/bn/investkorsi": {
    title: "ইনভেস্টকরসি — কার টাকা ফেরত এলো, কার এলো না",
    description:
      "বাংলাদেশি প্ল্যাটফর্ম, কোম্পানি আর প্রকল্পে মানুষের টাকার কী হয়েছে তার একটি উন্মুক্ত তালিকা। প্রতারণা, চুপ হয়ে যাওয়া প্রকল্প, আর যেগুলো ঠিক যা বলেছিল তাই করেছে — সবই বেনামে জমা দেওয়া অভিজ্ঞতা। পড়তে কোনো অ্যাকাউন্ট লাগে না।",
  },
  "/for-organizations": {
    title: "Financial literacy programmes for organizations",
    description:
      "Fifteen minutes a week that people actually finish. Kosh runs money programmes for schools, universities, RMG and factory floors, offices, and community groups in Bangladesh — earn, allocate, protect and grow, measured on decisions rather than recall. Try both exercises on the page, no sign-up.",
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
  "/for-schools": "/for-organizations",
  // Both are what people actually type or search for; the canonical page is
  // the one with the word a reader would recognise in it.
  "/fdr": "/fdr-rates",
  "/bank-rates": "/fdr-rates",
};
