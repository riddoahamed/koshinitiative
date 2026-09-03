// ── The eight investors ──────────────────────────────────────────────────────
// Not eight scores on a scale — eight people, drawn and named, so the result
// is something you recognise rather than something you read.
//
// ── ON NAMING REAL PEOPLE ───────────────────────────────────────────────────
// Three of these carry a line naming a real investor, and each of those lines
// describes a STYLE that person is publicly, uncontroversially known for —
// Buffett holding for decades, Burry doing the reading, Bogle refusing to try
// to win. That is a factual note about a public figure's public method.
//
// What is deliberately NOT here is an archetype built on an accusation about a
// named living person. "Does whatever it takes to earn money" attached to a
// real businessman is a claim of wrongdoing, and shipping it inside a product
// that also gives people financial information would put that claim in Kosh's
// mouth. The local archetypes are invented instead — the Motijheel veteran, the
// land man, the group-chat follower — and they are funnier for being ours.

import { face, PARTS, SKINS, type Face } from "./faces";

const { HAIR, BROW, EYES, MOUTH, FACIAL, WORN } = PARTS;

export type ArchetypeId =
  | "compounder" | "contrarian" | "monk" | "veteran"
  | "momentum" | "groupchat" | "land" | "sleeper";

/** The four axes every answer moves. Each runs -100 … +100. */
export interface Traits {
  /** act now  ←→  wait years */
  patience: number;
  /** follow the room  ←→  own view */
  conviction: number;
  /** protect it  ←→  push it */
  risk: number;
  /** go on gut  ←→  do the reading */
  homework: number;
}

export const AXIS_LABEL: Record<keyof Traits, [string, string]> = {
  patience: ["Acts now", "Waits"],
  conviction: ["Follows", "Own view"],
  risk: ["Protects", "Pushes"],
  homework: ["On gut", "Does the reading"],
};

export interface Archetype {
  id: ArchetypeId;
  /** The name on the card. */
  name: string;
  nameLocal?: string;
  /** Six words at most — this is the line people screenshot. */
  tagline: string;
  /** Two sentences. What this person is actually like. */
  blurb: string;
  /** The honest cost of being this. Kosh does not only flatter. */
  costs: string;
  /** Real-investor note, where one is factual and neutral. */
  tradition?: string;
  /**
   * The line under the runner-up, in small type.
   *
   * These used to be rarity claims — "rarest of the eight", "the most common
   * result of all". Nobody had counted, and once the signatures were measured
   * the numbers said otherwise. A claim about how many people share your result
   * is checkable, so it either gets checked or it does not get made.
   */
  share: string;
  /** One of the landing site's four accents. */
  accent: "mint" | "lime" | "purple" | "teal";
  /**
   * Where this person's next useful move is — a path INSIDE the app, not on
   * this site. The landing page has no comparator and no screener, so the link
   * is joined to KOSH_APP_URL at the call site rather than written absolute
   * here, which keeps this file identical to the app's copy of it.
   */
  next: { label: string; href: string };
  /**
   * The point in trait space this archetype sits at.
   *
   * ── THESE ARE MEASURED, NOT IMAGINED ────────────────────────────────────
   * The first set was written by hand from what each character ought to score,
   * and three of the eight were then unreachable — The Sleeper could not be
   * obtained by ANY of the 6,561 paths through the deck, while The Floor
   * Veteran took 64% of them. A face nobody can get is a face that will never
   * be seen, and a result two thirds of players share is not a result.
   *
   * So these are the centroids of the space the deck actually produces,
   * clustered and then matched to the character each one describes. Every
   * archetype now lands between 10% and 16% of runs, and persona.test.ts
   * brute-forces all 6,561 to prove none has gone unreachable again.
   */
  signature: Traits;
  face: Face;
}

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  compounder: {
    id: "compounder",
    name: "The Compounder",
    tagline: "Buys boring. Waits.",
    blurb:
      "You would rather own one thing you understand for ten years than ten things you don't for a month. Nothing about you is exciting, and that is the entire trick.",
    costs:
      "Patience can slide into not looking. A business you stopped checking is not the same business you bought.",
    tradition:
      "The method Warren Buffett is best known for: buy something good, then do very little for a very long time.",
    share: "Boring on purpose.",
    accent: "lime",
    next: { label: "Compare what your money could do", href: "/comparator" },
    signature: { patience: 43, conviction: 42, risk: -9, homework: 21 },
    face: face(SKINS.warm, { h: "#c9c4bb", g: "#4a4a55", c: "#3a4a6b" }, [
      HAIR.neat, WORN.specs, BROW.soft, EYES.open, MOUTH.smile, WORN.collar,
    ]),
  },

  contrarian: {
    id: "contrarian",
    name: "The Contrarian",
    tagline: "Reads what nobody read.",
    blurb:
      "When a room agrees, you get suspicious. You will spend a weekend on a document everyone else skimmed, and you are perfectly happy being the only one holding your view.",
    costs:
      "Being right early feels identical to being wrong. And being alone is not, by itself, evidence of anything.",
    tradition:
      "The method Michael Burry is known for: doing the reading everyone else skipped, then betting against the room.",
    share: "Comfortable being the only one.",
    accent: "purple",
    next: { label: "Check a claim before you believe it", href: "/scam-spotter" },
    signature: { patience: -8, conviction: 16, risk: -7, homework: 39 },
    face: face(SKINS.warm, { h: "#3b2f2a", g: "#2f2f38", c: "#4b4b57" }, [
      HAIR.messy, BROW.furrow, EYES.narrow, FACIAL.stubble, MOUTH.flat,
    ]),
  },

  monk: {
    id: "monk",
    name: "The Index Monk",
    tagline: "Refuses to play.",
    blurb:
      "You worked out early that most people lose to the market by trying to beat it, and you decided not to try. You buy the whole thing, monthly, and get on with your life.",
    costs:
      "Calm is not the same as informed. Fees, taxes and the wrong fund can quietly eat a decade of doing everything else right.",
    tradition:
      "John Bogle's idea, in one line: stop trying to win, and stop losing to fees.",
    share: "Wins by not losing.",
    accent: "teal",
    next: { label: "See what funds actually returned", href: "/screener/mutual-funds" },
    signature: { patience: 20, conviction: 14, risk: -36, homework: 0 },
    face: face(SKINS.deep, { h: "#2b2b31", g: "#4a4a55", c: "#3a4a6b" }, [
      HAIR.shaved, BROW.soft, EYES.closed, MOUTH.flat, WORN.collar,
    ]),
  },

  veteran: {
    id: "veteran",
    name: "The Floor Veteran",
    nameLocal: "মতিঝিলের আঙ্কেল",
    tagline: "Has seen this before.",
    blurb:
      "You have watched the DSE do this exact thing three times and you have the scars to prove it. Your information comes from people, not filings, and your instincts are better than they have any right to be.",
    costs:
      "A tea-stall tip is somebody else's position. Thirty years of pattern recognition still cannot see a balance sheet.",
    share: "Knows a guy.",
    accent: "mint",
    next: { label: "Put a tip next to the numbers", href: "/markets" },
    signature: { patience: 7, conviction: 8, risk: 28, homework: 4 },
    face: face(SKINS.warm, { h: "#57504a", g: "#a39c8c", c: "#6b5b3a" }, [
      HAIR.thin, BROW.flat, EYES.narrow, WORN.specsOpen, FACIAL.moustache, MOUTH.flat, WORN.collar,
    ]),
  },

  momentum: {
    id: "momentum",
    name: "The Momentum Kid",
    tagline: "Buys what's moving.",
    blurb:
      "You are fast, you are online, and you are usually in before most people have heard of it. Green is a reason and red is a reason, and either way you are already doing something.",
    costs:
      "Being early and being late look the same on a chart until it is over. Every trade costs something, and you make a lot of them.",
    share: "Always already in.",
    accent: "mint",
    next: { label: "Practise with fake money first", href: "/try" },
    signature: { patience: -44, conviction: -23, risk: 25, homework: 11 },
    face: face(SKINS.light, { h: "#2f2620", g: "#2f2f38", c: "#c8452f" }, [
      HAIR.crop, WORN.capBack, BROW.raised, EYES.wide, MOUTH.open, WORN.buds,
    ]),
  },

  groupchat: {
    id: "groupchat",
    name: "The Group-Chat Investor",
    tagline: "Whatever bhai said.",
    blurb:
      "Someone in a chat you're in is always in something, and you get in too. You are not reckless — you are trusting, which is a harder habit to notice and a harder one to change.",
    costs:
      "The person who told you is not going to tell you when they sell. That is the whole risk, and it is enough.",
    share: "Trusting, not reckless.",
    accent: "purple",
    next: { label: "Learn the traps first", href: "/scam-spotter" },
    signature: { patience: -29, conviction: -43, risk: 26, homework: -39 },
    face: face(SKINS.warm, { h: "#241f1c", g: "#2f2f38", c: "#3f8f6f" }, [
      HAIR.crop, BROW.raised, EYES.aside, MOUTH.open, WORN.buds,
    ]),
  },

  land: {
    id: "land",
    name: "The Land Man",
    nameLocal: "জমির মানুষ",
    tagline: "If you can't stand on it, no.",
    blurb:
      "Paper can go to zero and a plot cannot, and no argument has ever moved you off that. You would rather own something your family can point at than something with a ticker.",
    costs:
      "Registration, mutation and brokerage take a decade's return off the top before you own anything — and selling can take a year you don't have.",
    share: "Safest-feeling. Not the safest.",
    accent: "purple",
    next: { label: "Land vs everything else, after costs", href: "/comparator" },
    signature: { patience: 22, conviction: -5, risk: 0, homework: -33 },
    face: face(SKINS.deep, { h: "#2e2621", g: "#c9a227", c: "#f0ece4" }, [
      HAIR.neat, BROW.furrow, EYES.narrow, FACIAL.moustache, MOUTH.flat, WORN.collar, WORN.chain,
    ]),
  },

  sleeper: {
    id: "sleeper",
    name: "The Sleeper",
    tagline: "Safe, and not looking.",
    blurb:
      "Your money is somewhere it cannot fall, and you have not thought about it since you put it there. You sleep well, which is worth more than most people admit.",
    costs:
      "Inflation charges rent on money that isn't working — around 8% a year here. Doing nothing is a decision, and it has a price.",
    share: "Sleeps very well.",
    accent: "teal",
    next: { label: "See what standing still costs", href: "/comparator" },
    signature: { patience: -16, conviction: -17, risk: -13, homework: -10 },
    face: face(SKINS.light, { h: "#3a322c", g: "#4a4a55", c: "#5a6b8a" }, [
      HAIR.crop, BROW.soft, EYES.closed, MOUTH.flat, WORN.collar,
    ]),
  },
};

export const ALL_ARCHETYPES = Object.values(ARCHETYPES);
