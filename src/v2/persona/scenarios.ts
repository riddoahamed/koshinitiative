// ── Eight beats: five scenes and three games ─────────────────────────────────
//
// The first version was eight scenes with three buttons each, and the honest
// report on it was that it felt like an MCQ. It was one — a well-written one,
// but a person reading three lines and tapping one is doing a comprehension
// exercise, not playing anything.
//
// The fix is not more scenes. It is that the three beats which are ABOUT a
// behaviour you cannot describe in a sentence are now the behaviour itself:
//
//   THE STREAK  — gambler's fallacy. Five red days tick past in front of you.
//                 Reading "the market has fallen five days" and watching it
//                 fall five times are different experiences, and only the
//                 second one produces the itch the question is asking about.
//   THE CROWD   — herd behaviour. A percentage climbs while you decide. The
//                 number moving under your eyes IS the pressure; a static
//                 "83% are buying" is a fact, and a fact is resistible.
//   THE TICKER  — short-term trading. A live price and a running P&L for ten
//                 seconds, with Sell available the whole time. What you do
//                 matters, and WHEN you do it matters more.
//
// The five that stayed are scenes because they are about judgement rather than
// impulse, and no amount of animation improves "where does a bonus go". They
// carry a drawn vignette instead — see `image` and data/persona/vignettes.ts,
// which records why the sourced-photograph route was tried and abandoned.

import type { Traits } from "./archetypes";

export interface Choice {
  id: string;
  /** What you would do. Second person, present tense, short. */
  text: string;
  /** How much each axis moves. Roughly -3 … +3 per axis. */
  move: Partial<Traits>;
  /**
   * Marks a categorical answer rather than a scored one. Only "insider" today:
   * buying ahead of an announcement because a relative told you is not a point
   * in trait space, it is a different thing entirely. See classify().
   */
  flag?: "insider";
}

export type Beat = "scene" | "streak" | "crowd" | "ticker";

export interface Scenario {
  id: string;
  /** Which renderer this beat uses. "scene" is the illustrated three-option card. */
  beat: Beat;
  /** The situation. Two sentences at most. */
  scene: string;
  /** The prompt under it — always about behaviour, never about opinion. */
  ask: string;
  /** Key into public/persona/. Scenes only; the games draw themselves. */
  image?: string;
  choices: Choice[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "streak",
    beat: "streak",
    scene: "A share you own has closed red five days running.",
    ask: "The sixth day opens in a minute.",
    choices: [
      { id: "a", text: "It's due for a green day. Buy more", move: { patience: -3, conviction: -1, risk: 2, homework: -2 } },
      { id: "b", text: "Buy — but because it's cheaper, not because it's due", move: { patience: 2, conviction: 2, homework: 1 } },
      { id: "c", text: "Five days tells you nothing. Do nothing", move: { patience: 1, conviction: -1, risk: -2, homework: 1 } },
    ],
  },
  {
    id: "wedding",
    beat: "scene",
    image: "wedding",
    scene: "A cousin corners you at a wedding. He has tripled his money in one share and it is still going up.",
    ask: "What do you actually do?",
    choices: [
      { id: "a", text: "Ask which one, then go and read about it yourself", move: { homework: 2, conviction: 1 } },
      { id: "b", text: "Put a small amount in tomorrow before it runs further", move: { patience: -2, conviction: -2, risk: 2, homework: -1 } },
      { id: "c", text: "Say that's great, and change the subject", move: { patience: 2, conviction: 1, risk: -2, homework: -1 } },
    ],
  },
  {
    id: "crowd",
    beat: "crowd",
    scene: "Everyone is buying one thing this week.",
    ask: "The number is still climbing.",
    choices: [
      { id: "a", text: "Join them. That many people can't all be wrong", move: { patience: -1, conviction: -3, risk: 2, homework: -1 } },
      { id: "b", text: "Find out why they're buying first", move: { patience: 1, conviction: 1, homework: 3 } },
      { id: "c", text: "A crowd is a reason to be careful, not a reason to buy", move: { conviction: 2, risk: -2, homework: -2 } },
    ],
  },
  {
    id: "bonus",
    beat: "scene",
    image: "bonus",
    scene: "A two lakh bonus lands. Nobody knows you got it.",
    ask: "Where does it go?",
    choices: [
      { id: "a", text: "Into the thing you already own", move: { patience: 2, conviction: 2, risk: -1 } },
      { id: "b", text: "Land. Land always works", move: { patience: 1, conviction: -1, risk: -1, homework: -2 } },
      { id: "c", text: "Something new you've been reading about", move: { patience: -3, conviction: -1, risk: 2, homework: 2 } },
    ],
  },
  {
    id: "ticker",
    beat: "ticker",
    scene: "You're up six percent since this morning.",
    ask: "It's still moving.",
    choices: [
      { id: "a", text: "Sell. Take it", move: { patience: -3, conviction: -1, risk: -1 } },
      { id: "b", text: "Hold. You had a plan", move: { patience: 3, conviction: 2, risk: 1 } },
      { id: "c", text: "Sell half", move: { conviction: -1 } },
    ],
  },
  {
    id: "guaranteed",
    beat: "scene",
    image: "guaranteed",
    scene: "Someone offers three percent a month, guaranteed, from a business you can't quite picture.",
    ask: "Your first move?",
    choices: [
      { id: "a", text: "Ask to see the business", move: { homework: 2 } },
      { id: "b", text: "No. Nothing guarantees three percent a month", move: { conviction: 2, risk: -2, homework: 1 } },
      { id: "c", text: "A small amount, just to see", move: { conviction: -2, risk: 2, homework: -3 } },
    ],
  },
  {
    id: "tip",
    beat: "scene",
    image: "tip",
    scene: "Your cousin works at a listed company. Results are good, he says, and they're announced on Thursday.",
    ask: "It's Tuesday.",
    choices: [
      // Buying here is the offence, not the edge — see ARCHETYPES.insider.
      { id: "a", text: "Buy tomorrow, before it's public", move: { patience: -2, conviction: -1, risk: 2, homework: -2 }, flag: "insider" },
      { id: "b", text: "Wait for Thursday like everyone else", move: { patience: 2, conviction: 1, risk: -1, homework: 1 } },
      { id: "c", text: "Tell him to stop telling you things like that", move: { risk: -1, homework: 1 } },
    ],
  },
  {
    id: "what-you-know",
    beat: "scene",
    image: "know",
    scene: "Think about the last thing you put money into.",
    ask: "How much do you know about it?",
    choices: [
      { id: "a", text: "The business, roughly what it earns, who runs it", move: { homework: 3, conviction: 2 } },
      { id: "b", text: "The name, and that it had been going up", move: { homework: -1, risk: 1 } },
      { id: "c", text: "Someone I trust picked it", move: { homework: -2, conviction: -2, risk: -1 } },
    ],
  },
];

/** The most any single axis can move across a full run — the normaliser. */
export const MAX_PER_AXIS: Record<keyof Traits, number> = SCENARIOS.reduce(
  (acc, s) => {
    for (const axis of ["patience", "conviction", "risk", "homework"] as const) {
      acc[axis] += Math.max(0, ...s.choices.map((c) => Math.abs(c.move[axis] ?? 0)));
    }
    return acc;
  },
  { patience: 0, conviction: 0, risk: 0, homework: 0 },
);
