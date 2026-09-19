import type { Lang } from "../i18n";

/* ── The FDR page in two languages ────────────────────────────────────────────
   One dictionary, one page. Numbers, bank names and rates are never translated:
   they come from the Bangladesh Bank filing and a reader checks them against
   the banks' own charts, which print Latin digits.

   The Bangla is written, not converted. "Tenure" is মেয়াদ, not a transliteration;
   withholding tax is উৎসে কর because that is what the deduction is called on a
   Bangladeshi bank statement. */

export interface FdrStrings {
  eyebrow: string;
  h1: string;
  lede: (banks: number) => string;
  bandLabel: (tenure: string) => string;
  controls: { tenure: string; banks: string; openTo: string; rankBy: string; on: string };
  openTo: { individuals: string; everyone: string };
  rankBy: { top: string; floor: string; oldest: string };
  search: string;
  colBank: string;
  protectH: string;
  noMatch: string;
  sortedTop: string;
  sortedFloor: string;
  rangeNote: string;
  sponsor: string;
  faqH: string;
  faqCta: string;
  summaryH: string;
  summary: string[];
  filters: Record<string, string>;
  stamp: string;
  bandNote: (o: { count: number; best: string; lowest: string; gain: string }) => string;
  protectP: (o: { amount: string; unprotected: string; banks: number }) => string;
  faqNote: string;
}

const EN: FdrStrings = {
  eyebrow: "Bangladesh · fixed deposits",
  h1: "FDR rates at every bank in Bangladesh",
  lede: (banks) =>
    `Every scheduled bank files the deposit rates it is announcing with Bangladesh Bank, and the central bank publishes all of them together each month. This is that chart — ${banks} banks, five tenures, each one linked to the bank's own rate page so you can check it.`,
  bandLabel: (t) => `${t} deposit · most banks pay`,
  controls: { tenure: "Tenure", banks: "Banks", openTo: "Open to", rankBy: "Rank by", on: "On" },
  openTo: { individuals: "Individuals", everyone: "Everyone incl. merged" },
  rankBy: { top: "Top of range", floor: "Guaranteed floor", oldest: "Longest running" },
  search: "Find a bank",
  colBank: "Bank",
  protectH: "Only ৳2,00,000 of this is protected",
  noMatch: "No bank here matches that. Try “All”, or check the spelling.",
  sortedTop: "Sorted by the top of each bank's published range.",
  sortedFloor:
    "Sorted by the bottom of each bank's published range — what it filed at worst.",
  rangeNote:
    "A range means the bank filed different rates for different products or deposit sizes; the counter decides which one you are offered. A dash means the bank filed nothing for that tenure.",
  sponsor:
    "Nobody paid to be on this page. There are no sponsored placements, no affiliate links and no paid ordering — every bank that files with Bangladesh Bank is listed, including the ones paying the least, and the order is arithmetic.",
  faqH: "Before you lock the money up",
  faqCta: "Read the full FAQ",
  summaryH: "FDR rates, in short",
  summary: [],
  filters: { all: "All", islamic: "Islamic", private: "Private", state: "State-owned", foreign: "Foreign" },
  stamp: "Bangladesh Bank",
  bandNote: ({ count, best, lowest, gain }) =>
    `Across ${count} banks the middle half sit in that band. The best filed ${best} and the lowest ${lowest}. On ৳10,00,000, moving from a middle-of-the-market bank to the best-paying one is worth ${gain} a year before tax.`,
  protectP: ({ amount, unprotected, banks }) =>
    `Deposit protection covers ৳2,00,000 per depositor per bank. On ৳${amount} that leaves ৳${unprotected} riding on the bank's own health — so the rate is not the only thing to compare. Splitting across ${banks} banks would cover all of it, and costs nothing but paperwork.`,
  faqNote: "",
};

const BN: FdrStrings = {
  eyebrow: "বাংলাদেশ · স্থায়ী আমানত",
  h1: "বাংলাদেশের সব ব্যাংকের এফডিআর রেট",
  lede: (banks) =>
    `প্রতিটি তফসিলি ব্যাংক তার ঘোষিত আমানতের সুদের হার বাংলাদেশ ব্যাংকে জমা দেয়, আর কেন্দ্রীয় ব্যাংক প্রতি মাসে সবগুলো একসঙ্গে প্রকাশ করে। এই পাতায় সেই তালিকাই আছে — ${banks}টি ব্যাংক, পাঁচটি মেয়াদ, আর প্রতিটির সঙ্গে সংশ্লিষ্ট ব্যাংকের নিজস্ব রেট পেজের লিংক, যাতে আপনি নিজে মিলিয়ে নিতে পারেন।`,
  bandLabel: (t) => `${t} মেয়াদ · বেশিরভাগ ব্যাংক দেয়`,
  controls: { tenure: "মেয়াদ", banks: "ব্যাংক", openTo: "কাদের জন্য", rankBy: "সাজান", on: "পরিমাণ" },
  openTo: { individuals: "ব্যক্তি", everyone: "সব (একীভূতসহ)" },
  rankBy: { top: "সর্বোচ্চ হার", floor: "নিশ্চিত সর্বনিম্ন", oldest: "পুরনো ব্যাংক" },
  search: "ব্যাংক খুঁজুন",
  colBank: "ব্যাংক",
  protectH: "এর মধ্যে মাত্র ২,০০,০০০ টাকা সুরক্ষিত",
  noMatch: "এই নামে কোনো ব্যাংক পাওয়া যায়নি। “সব” দেখুন, বা বানানটা মিলিয়ে নিন।",
  sortedTop: "প্রতিটি ব্যাংকের ঘোষিত সীমার সর্বোচ্চ হার অনুযায়ী সাজানো।",
  sortedFloor:
    "প্রতিটি ব্যাংকের ঘোষিত সীমার সর্বনিম্ন হার অনুযায়ী সাজানো — অর্থাৎ সবচেয়ে কম যা তারা জমা দিয়েছে।",
  rangeNote:
    "সীমা মানে ব্যাংকটি বিভিন্ন পণ্য বা আমানতের পরিমাণের জন্য আলাদা হার জমা দিয়েছে; আপনি কোনটি পাবেন তা কাউন্টারে ঠিক হয়। ড্যাশ মানে ওই মেয়াদের জন্য ব্যাংকটি কিছু জমা দেয়নি।",
  sponsor:
    "এই পাতায় থাকার জন্য কোনো ব্যাংক টাকা দেয়নি। কোনো স্পনসর্ড জায়গা নেই, অ্যাফিলিয়েট লিংক নেই, টাকার বিনিময়ে ক্রম বদলায় না — বাংলাদেশ ব্যাংকে যারা হার জমা দেয় তাদের সবাই এখানে আছে, সবচেয়ে কম হার যারা দেয় তারাও, আর ক্রমটা নিছক হিসাব।",
  faqH: "টাকা আটকে রাখার আগে",
  faqCta: "পুরো প্রশ্নোত্তর পড়ুন",
  summaryH: "এফডিআর রেট — সংক্ষেপে",
  summary: [],
  filters: { all: "সব", islamic: "ইসলামি", private: "বেসরকারি", state: "রাষ্ট্রায়ত্ত", foreign: "বিদেশি" },
  stamp: "বাংলাদেশ ব্যাংক",
  bandNote: ({ count, best, lowest, gain }) =>
    `${count}টি ব্যাংকের মধ্যে মাঝের অর্ধেক এই সীমার মধ্যে পড়ে। সর্বোচ্চ জমা পড়েছে ${best}, সর্বনিম্ন ${lowest}। ১০,০০,০০০ টাকায় বাজারের মাঝামাঝি একটি ব্যাংক ছেড়ে সবচেয়ে বেশি হার দেওয়া ব্যাংকে গেলে কর বাদ দেওয়ার আগে বছরে ${gain} বেশি পাওয়া যায়।`,
  protectP: ({ amount, unprotected, banks }) =>
    `আমানত সুরক্ষা প্রতি ব্যাংকে প্রতি আমানতকারীর জন্য ২,০০,০০০ টাকা পর্যন্ত। ${amount} টাকায় বাকি ${unprotected} টাকা পুরোপুরি ব্যাংকটির নিজের অবস্থার উপর নির্ভর করে — তাই শুধু হার দেখে সিদ্ধান্ত নেওয়া ঠিক নয়। ${banks}টি ব্যাংকে ভাগ করে রাখলে পুরোটাই সুরক্ষিত হয়, আর তাতে কাগজপত্র ছাড়া বাড়তি কোনো খরচ নেই।`,
  faqNote:
    "প্রশ্নোত্তরগুলো আপাতত ইংরেজিতে — মেয়াদের আগে ভাঙলে কী হয়, কর কীভাবে কাটে, ইসলামি ব্যাংকের মুনাফার হার কীভাবে ঠিক হয়, সবই সেখানে বিস্তারিত আছে।",
};

export const fdrStrings = (lang: Lang): FdrStrings => (lang === "bn" ? BN : EN);
