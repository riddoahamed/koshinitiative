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
// ── AND ON SALMAN F RAHMAN, SPECIFICALLY ────────────────────────────────────
// He is named here, once, in The Insider's tradition line — and what that line
// says is exactly what the public record supports and nothing more.
//
// Checked 4 Sep 2026 before writing it: he has been in custody since August
// 2024 with bail repeatedly refused, and faces Anti-Corruption Commission cases
// over banking-sector irregularities plus seventeen CID money-laundering cases
// concerning roughly Tk 1,000 crore moved through Janata Bank letters of credit
// between 2021 and 2024. He has NOT been convicted. There is no verdict and no
// sentence.
//
// That distinction is the whole design of the line. "Jailed fraudster" is a
// claim about a man Bangladesh has not finished trying, published by a company
// that also tells people where to put their savings; under the Cyber Security
// Act and the Penal Code's defamation sections that is Kosh's exposure, not a
// hypothetical. "Accused of, in custody, untried" is a description of the
// public record, it is what makes the case worth teaching from, and it is
// stronger writing besides — the reader supplies the verdict.
//
// The archetype itself is about the BEHAVIOUR — investing on who you know
// rather than what you know — which is a real and very Bangladeshi habit, and
// the reason it belongs in a financial-literacy product at all. The face is an
// original character, as all of them are.

import { face, PARTS, SKINS, type Face } from "./faces";

const { HAIR, BROW, EYES, MOUTH, FACIAL, WORN } = PARTS;

export type ArchetypeId =
  | "compounder" | "contrarian" | "monk" | "veteran"
  | "momentum" | "groupchat" | "land" | "sleeper" | "insider";

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
   * is joined to KOSH_APP_URL at the call site.
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
    signature: { patience: 52, conviction: 42, risk: -29, homework: 22 },
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
    signature: { patience: 11, conviction: 22, risk: -15, homework: 40 },
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
    signature: { patience: 26, conviction: 12, risk: -43, homework: -7 },
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
    signature: { patience: 5, conviction: -23, risk: 11, homework: -26 },
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
    signature: { patience: -21, conviction: -3, risk: 12, homework: 27 },
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
    signature: { patience: -41, conviction: -34, risk: 27, homework: -11 },
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
    signature: { patience: 31, conviction: 9, risk: 2, homework: 0 },
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
    signature: { patience: -12, conviction: -6, risk: -20, homework: -5 },
    face: face(SKINS.light, { h: "#3a322c", g: "#4a4a55", c: "#5a6b8a" }, [
      HAIR.crop, BROW.soft, EYES.closed, MOUTH.flat, WORN.collar,
    ]),
  },

  // ── The one you cannot score your way into ────────────────────────────────
  // The Insider is not a point in trait space — it is a categorical answer, set
  // by what you do with a tip from someone on the inside. See classify().
  insider: {
    id: "insider",
    name: "The Insider",
    nameLocal: "চেনা লোক আছে",
    tagline: "Knows someone. Always.",
    blurb:
      "You do not read filings, you read people, and you have usually heard it before it was announced. In a market this small that genuinely is an edge — right up until it is the thing that ends you.",
    costs:
      "Trading on information the public does not have is a criminal offence, not a clever move, and the BSEC has brought cases. The bigger cost is quieter: the person who tells you is never the one who tells you to sell.",
    tradition:
      "Bangladesh has been watching where this road goes. Salman F Rahman — Beximco vice-chairman and adviser to the last prime minister — has been in custody since August 2024 with bail refused, facing Anti-Corruption Commission cases over banking irregularities and seventeen CID money-laundering cases covering about Tk 1,000 crore. Nothing is proven; he has not been tried. That is the point: proximity to power looked like the safest position in the country until it did not.",
    share: "Heard it first.",
    accent: "mint",
    next: { label: "What actually counts as insider trading", href: "/scam-spotter" },
    // Never matched by distance — the override in classify() owns this one.
    signature: { patience: 0, conviction: 0, risk: 0, homework: 0 },
    face: face(SKINS.warm, { h: "#221c18", g: "#3a3a44", c: "#8a7a3a" }, [
      HAIR.neat, BROW.furrow, EYES.aside, MOUTH.smirk, WORN.collar, WORN.chain,
    ]),
  },
};

export const ALL_ARCHETYPES = Object.values(ARCHETYPES);

/**
 * The eight that nearest-centroid ranking chooses between.
 *
 * The Insider is excluded on purpose. Its signature is all zeroes, so leaving
 * it in the distance ranking would hand it to anyone who answered near the
 * middle — the opposite of what it means. It is reached by doing the thing,
 * not by scoring like it. See classify().
 */
export const SCORABLE_ARCHETYPES = ALL_ARCHETYPES.filter((a) => a.id !== "insider");
