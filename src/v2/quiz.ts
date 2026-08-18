/* ── "What kind of investor am I?" ────────────────────────────────────────────
   Six questions, sixty seconds. Two scores come out: `base` (how solid the
   ground under you is) and `risk` (how much movement you can actually live
   with). A "burned before" flag overrides, because trust is its own axis here.

   This is orientation, not advice. Every result points at a lesson or a
   practice mode, never at a product to buy.                                 */

export interface Choice {
  label: string;
  base?: number;
  risk?: number;
  burned?: boolean;
}
export interface Question {
  id: string;
  q: string;
  note?: string;
  choices: Choice[];
}

export const QUESTIONS: Question[] = [
  {
    id: "buffer",
    q: "Your phone dies tomorrow. Could you replace it without borrowing?",
    note: "This one matters more than anything else you’ll answer.",
    choices: [
      { label: "Easily. I keep savings for this", base: 3 },
      { label: "It would hurt, but yes", base: 2 },
      { label: "I’d have to borrow or use a card", base: 0 },
      { label: "I’d have to skip it", base: 0 },
    ],
  },
  {
    id: "income",
    q: "How steady is the money coming in?",
    choices: [
      { label: "Same salary, same date, every month", base: 3 },
      { label: "Mostly steady, some months are thin", base: 2 },
      { label: "Freelance or commission, so it swings", base: 1 },
      { label: "Daily or weekly cash, never the same", base: 0 },
    ],
  },
  {
    id: "horizon",
    q: "Money you put in today: when would you need it back?",
    choices: [
      { label: "I might need it within a year", base: 0, risk: 0 },
      { label: "In two or three years", base: 1, risk: 1 },
      { label: "Five years or more", base: 2, risk: 2 },
      { label: "I’m building for a decade out", base: 2, risk: 3 },
    ],
  },
  {
    id: "drop",
    q: "A month after you invest, it’s down 20%. What do you actually do?",
    note: "Be honest. The wrong answer here costs more than a wrong pick.",
    choices: [
      { label: "Sell. I can’t sleep on that", risk: 0 },
      { label: "Worry, ask around, probably hold", risk: 1 },
      { label: "Leave it. I planned for years, not months", risk: 3 },
      { label: "Put more in at the lower price", risk: 3 },
    ],
  },
  {
    id: "history",
    q: "Have you ever lost money on a scheme, a share, or a “sure thing”?",
    choices: [
      { label: "Yes, and it still stings", risk: 0, burned: true },
      { label: "Yes, but it was small", risk: 1 },
      { label: "No, I’ve never put money in", risk: 1 },
      { label: "No, I’ve invested and it went fine", risk: 2 },
    ],
  },
  {
    id: "want",
    q: "What do you actually want your money to do?",
    choices: [
      { label: "Just stop disappearing every month", base: 0, risk: 0 },
      { label: "Grow slowly, safely, without stress", risk: 1 },
      { label: "Beat inflation and build real wealth", risk: 2 },
      { label: "Grow fast. I’ll take the swings", risk: 3 },
    ],
  },
];

export interface Profile {
  key: string;
  name: string;
  line: string;
  meaning: string;
  steps: { t: string; p: string; href: string; cta: string }[];
  caution: string;
  accent: "mint" | "lime" | "purple" | "teal";
}

const APP = "https://app.koshbd.com";

export const PROFILES: Record<string, Profile> = {
  foundation: {
    key: "foundation",
    name: "The Foundation Builder",
    line: "You’re not behind. You’re just earlier in the order.",
    meaning:
      "The ground under you isn’t solid enough yet for market risk, and putting money into shares before that is how people get forced to sell at the worst moment. Your first win isn’t a return. It’s a buffer nobody can take from you.",
    steps: [
      {
        t: "Build the three-month buffer",
        p: "The single move that makes every later move possible.",
        href: "/learn#emergency-fund",
        cta: "2-minute lesson",
      },
      {
        t: "Find out where the money goes",
        p: "Most people are surprised. Track one month before changing anything.",
        href: `${APP}`,
        cta: "Open the app",
      },
      {
        t: "Learn to spot a scam now, not later",
        p: "People under money pressure are exactly who scams are built for.",
        href: "/learn#spot-a-scam",
        cta: "Read the five tells",
      },
    ],
    caution:
      "Anyone promising to fix a tight month with a high guaranteed return is describing a scam, not a shortcut.",
    accent: "mint",
  },
  rebuilder: {
    key: "rebuilder",
    name: "The Rebuilder",
    line: "You’ve been burned. That’s information, not a disqualification.",
    meaning:
      "You have the base to invest. What you don’t have is a reason to trust anyone again, and that’s reasonable. The way back isn’t a hot tip from someone new. It’s rebuilding your own judgment until you don’t need to trust a stranger at all.",
    steps: [
      {
        t: "Name what actually went wrong",
        p: "Almost every loss maps to one of five tells. Yours probably does too.",
        href: "/learn#spot-a-scam",
        cta: "Read the five tells",
      },
      {
        t: "Practise with money that isn’t real",
        p: "Real market prices, zero risk. Rebuild the instinct before the stake.",
        href: `${APP}`,
        cta: "Try paper investing",
      },
      {
        t: "Understand what you’d be buying",
        p: "Funds, dividends and NAV: the mechanics, without the pitch.",
        href: "/learn#mutual-funds",
        cta: "2-minute lesson",
      },
    ],
    caution:
      "You don’t owe anyone a second chance. Take as long as you need, waiting costs less than another loss.",
    accent: "purple",
  },
  steady: {
    key: "steady",
    name: "The Steady Saver",
    line: "Safety first, as long as safe doesn’t quietly mean shrinking.",
    meaning:
      "You have a base and you want calm. That’s a real strategy, not a lesser one. The one thing to watch is the trap that catches careful people: a return that’s lower than inflation is a slow, comfortable loss.",
    steps: [
      {
        t: "Check what your safe money really earns",
        p: "Sanchaypatra, DPS and FDR: the mechanics, honestly.",
        href: "/learn#safe-instruments",
        cta: "3-minute lesson",
      },
      {
        t: "Compare it against rising prices",
        p: "Not against zero. That comparison is where the surprise lives.",
        href: `${APP}`,
        cta: "Open the app",
      },
      {
        t: "See what one step out looks like",
        p: "Funds spread risk without asking you to pick companies.",
        href: "/learn#mutual-funds",
        cta: "2-minute lesson",
      },
    ],
    caution:
      "Nothing here says leave what’s working. It says know what it costs you to stay.",
    accent: "teal",
  },
  grower: {
    key: "grower",
    name: "The Careful Grower",
    line: "Solid base, long horizon, no appetite for drama. The best combination there is.",
    meaning:
      "You can take some movement and you’re not planning to touch the money soon, which is exactly the position where diversification does its work. Your risk isn’t losing money. It’s getting bored and doing something clever.",
    steps: [
      {
        t: "Learn how baskets beat bets",
        p: "What a fund actually owns, and the fee you pay either way.",
        href: "/learn#mutual-funds",
        cta: "2-minute lesson",
      },
      {
        t: "Practise a full year in an afternoon",
        p: "Real prices, fake money, see how you behave on a red week.",
        href: `${APP}`,
        cta: "Try paper investing",
      },
      {
        t: "Make your first real move small",
        p: "Write down why you bought it. Then leave it alone.",
        href: "/learn#first-1000",
        cta: "2-minute lesson",
      },
    ],
    caution:
      "Boring and consistent beats clever and occasional. The urge to optimise is the thing to manage.",
    accent: "mint",
  },
  explorer: {
    key: "explorer",
    name: "The Market Explorer",
    line: "You’ve got the stomach. Make sure you’ve got the reps.",
    meaning:
      "You can live with swings and you’re thinking in years, that’s a genuine edge in a market where most people flee at the first red month. The failure mode for people like you isn’t fear. It’s confidence arriving before experience does.",
    steps: [
      {
        t: "Do the reps at zero stake first",
        p: "Real DSE prices, paper money. Find out what you actually do at -20%.",
        href: `${APP}`,
        cta: "Try paper investing",
      },
      {
        t: "Know what you own and what it costs",
        p: "NAV, expense ratios, dividends, the numbers behind the story.",
        href: "/learn#mutual-funds",
        cta: "2-minute lesson",
      },
      {
        t: "Stay unscammable",
        p: "Confident beginners are the highest-value target there is.",
        href: "/learn#spot-a-scam",
        cta: "Read the five tells",
      },
    ],
    caution:
      "High risk tolerance is not the same as high skill. Keep the buffer intact no matter how good the idea sounds.",
    accent: "lime",
  },
};

export const scoreQuiz = (answers: Choice[]): Profile => {
  const base = answers.reduce((n, c) => n + (c.base ?? 0), 0);
  const risk = answers.reduce((n, c) => n + (c.risk ?? 0), 0);
  const burned = answers.some((c) => c.burned);

  if (base <= 3) return PROFILES.foundation;
  if (burned && risk <= 5) return PROFILES.rebuilder;
  if (risk <= 3) return PROFILES.steady;
  if (risk <= 7) return PROFILES.grower;
  return PROFILES.explorer;
};
