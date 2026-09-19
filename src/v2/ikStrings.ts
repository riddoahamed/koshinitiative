import { bnNum, type Lang } from "./i18n";

/* ── InvestKorsi in two languages ─────────────────────────────────────────────
   Same rule as the FDR dictionary: one page, one data source, two sets of
   words. Platform names, report counts and taka figures are never translated,
   because they are the evidence and a reader cross-checks them.

   The copy rule from the page itself carries into the Bangla: this describes
   the DATA and never accuses a company. "আটকে আছে" is only ever said of
   amountBad, never of the total, because the total includes money that came
   back perfectly fine. */

export interface IkStrings {
  live: string;
  report: (n: number) => string;
  platforms: (n: number) => string;
  h2a: string;
  h2b: string;
  sub: string;
  thesis: string;
  statReports: string;
  statPlatforms: string;
  statStuck: (n: number) => string;
  statStuckPlain: string;
  ctaAdd: string;
  ctaRead: string;
  note: string;
  paidH: string;
  paidP: string;
  notPaidH: string;
  notPaidP: string;
  bothBelong: string;
  wrongH: string;
  wrongP: string;
  classH: string;
  classP: (n: number) => string;
  registerH: string;
  registerP: string;
}

const EN: IkStrings = {
  live: "Live public ledger",
  report: (n) => `${n} report${n === 1 ? "" : "s"}`,
  platforms: (n) => `${n} platforms`,
  h2a: "Scams, frauds, and the ones that paid.",
  h2b: "Put yours on the record.",
  sub: "Platforms, companies, ventures — anywhere in Bangladesh money goes in. Read what really happened to other people, then tell them yours. Free, and nothing traces back to whoever wrote it.",
  thesis: "One story is one complaint. Enough of them is knowledge a market can be built on.",
  statReports: "reports filed",
  statPlatforms: "platforms covered",
  statStuck: (n) => `reported stuck, across ${n} report${n === 1 ? "" : "s"} that named a figure`,
  statStuckPlain: "reported stuck so far",
  ctaAdd: "Add your report",
  ctaRead: "Read every report",
  note: "Fifteen seconds, no account, no email. One report per investment, so nobody can pile on a company and nobody can pad their own.",
  paidH: "It paid.",
  paidP: "Money came back, on time, like they said it would.",
  notPaidH: "It didn’t.",
  notPaidP: "Went quiet, went late, or went nowhere at all.",
  bothBelong: "Both belong here.",
  wrongH: "What actually goes wrong",
  wrongP: "Counted from the reports themselves, not from anything we assumed.",
  classH: "And what kind of investment it was",
  classP: (n) => `Counted from the ${n} report${n === 1 ? "" : "s"} that said.`,
  registerH: "The register",
  registerP: "Every platform, company or venture someone has written about.",
};

const BN: IkStrings = {
  live: "চলমান উন্মুক্ত তালিকা",
  report: (n) => `${bnNum(n)}টি অভিজ্ঞতা`,
  platforms: (n) => `${bnNum(n)}টি প্ল্যাটফর্ম`,
  h2a: "প্রতারণা, জালিয়াতি, আর যেগুলো সত্যিই টাকা ফেরত দিয়েছে।",
  h2b: "আপনারটাও লিখে রাখুন।",
  sub: "প্ল্যাটফর্ম, কোম্পানি, প্রকল্প — বাংলাদেশে যেখানেই টাকা যায়। অন্যদের সঙ্গে আসলে কী হয়েছে পড়ুন, তারপর আপনারটা জানান। বিনামূল্যে, আর কে লিখেছে তা কোনোভাবেই বোঝা যায় না।",
  thesis: "একটা ঘটনা মানে একটা অভিযোগ। যথেষ্ট সংখ্যক ঘটনা মানে এমন তথ্য, যার উপর একটা বাজার দাঁড়াতে পারে।",
  statReports: "জমা পড়া অভিজ্ঞতা",
  statPlatforms: "যত প্ল্যাটফর্ম নিয়ে লেখা হয়েছে",
  statStuck: (n) => `আটকে থাকার কথা জানানো হয়েছে, অঙ্ক উল্লেখ করা ${bnNum(n)}টি অভিজ্ঞতায়`,
  statStuckPlain: "এ পর্যন্ত আটকে থাকার কথা জানানো হয়েছে",
  ctaAdd: "আপনার অভিজ্ঞতা লিখুন",
  ctaRead: "সব অভিজ্ঞতা পড়ুন",
  note: "পনেরো সেকেন্ড, অ্যাকাউন্ট লাগবে না, ইমেইলও না। প্রতি বিনিয়োগে একটি করে অভিজ্ঞতা — তাই কেউ একটা কোম্পানির উপর চড়াও হতে পারে না, নিজেরটা ফুলিয়েও দেখাতে পারে না।",
  paidH: "টাকা ফেরত এসেছে।",
  paidP: "সময়মতো, যেমনটা বলা হয়েছিল ঠিক তেমনভাবেই।",
  notPaidH: "আসেনি।",
  notPaidP: "চুপ হয়ে গেছে, দেরি করেছে, বা কিছুই হয়নি।",
  bothBelong: "দুটোরই জায়গা এখানে।",
  wrongH: "আসলে কী কী সমস্যা হয়",
  wrongP: "অভিজ্ঞতাগুলো থেকেই গোনা, আমরা ধরে নিয়েছি এমন কিছু থেকে নয়।",
  classH: "আর কোন ধরনের বিনিয়োগ ছিল",
  classP: (n) => `যে ${bnNum(n)}টি অভিজ্ঞতায় সেটা বলা হয়েছে, তা থেকে গোনা।`,
  registerH: "তালিকা",
  registerP: "যত প্ল্যাটফর্ম, কোম্পানি বা প্রকল্প নিয়ে কেউ লিখেছেন।",
};

export const ikStrings = (lang: Lang): IkStrings => (lang === "bn" ? BN : EN);
