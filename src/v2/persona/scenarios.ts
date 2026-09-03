// ── Eight moments, not eight questions ───────────────────────────────────────
// "What is your risk tolerance? (a) Low (b) Medium (c) High" is a form, and
// nobody finishes a form for fun. Nobody knows the answer either — people are
// terrible at describing their own behaviour and very good at recognising it.
//
// So every card here is a scene from an actual Bangladeshi life: a cousin at a
// wedding, salary day, a red week, a group chat 20 messages deep. You do not
// rate yourself. You just say what you would do, and the shape comes out of
// what you picked.
//
// The options are deliberately all defensible. There is no obviously-correct
// answer to pick to look good, which is the failure mode of every quiz that
// scores you on virtue rather than telling you who you are.

import type { Traits } from "./archetypes";

export interface Choice {
  id: string;
  /** What you would do. Second person, present tense, short. */
  text: string;
  /** How much each axis moves. Roughly -2 … +2 per axis. */
  move: Partial<Traits>;
}

export interface Scenario {
  id: string;
  /** The situation. Two sentences at most. */
  scene: string;
  /** The prompt under it — always about behaviour, never about opinion. */
  ask: string;
  choices: Choice[];
}

export const SCENARIOS: Scenario[] = [
  {
    id: "wedding",
    scene: "A cousin corners you at a wedding. He has tripled his money in one share and it is still going up.",
    ask: "What do you actually do?",
    choices: [
      { id: "a", text: "Ask which one, then go and read about it yourself", move: { homework: 2, conviction: 1 } },
      { id: "b", text: "Put a small amount in tomorrow before it runs further", move: { patience: -2, conviction: -2, risk: 2, homework: -1 } },
      { id: "c", text: "Say that's great, and change the subject", move: { patience: 2, conviction: 1, risk: -2, homework: -1 } },
    ],
  },
  {
    id: "salary",
    scene: "Your salary lands at nine in the morning.",
    ask: "Where is it by nine at night?",
    choices: [
      { id: "a", text: "Already moved — a standing instruction did it before you woke up", move: { patience: 2, risk: -1, homework: 1 } },
      { id: "b", text: "Sitting in the account. You'll decide at the end of the month", move: { patience: -1 } },
      { id: "c", text: "Mostly gone. It was a long month", move: { patience: -1, risk: 1, homework: -1 } },
    ],
  },
  {
    id: "red-week",
    scene: "The market falls twelve percent in a week. Everything you hold is red.",
    ask: "What are you doing on Thursday?",
    choices: [
      { id: "a", text: "Checking the price about four times a day", move: { patience: -2, conviction: -1, risk: -1, homework: 1 } },
      { id: "b", text: "Buying more. Same thing, cheaper", move: { patience: 2, conviction: 2, risk: 2, homework: 1 } },
      { id: "c", text: "Not opening the app at all", move: { conviction: -1, risk: -1, homework: -2 } },
    ],
  },
  {
    id: "bonus",
    scene: "A two lakh bonus lands. Nobody knows you got it.",
    ask: "Where does it go?",
    choices: [
      { id: "a", text: "Into the thing you already own", move: { patience: 2, conviction: 2, risk: -1 } },
      { id: "b", text: "Land. Land always works", move: { patience: 1, conviction: -1, risk: -1, homework: -2 } },
      { id: "c", text: "Something new you've been reading about", move: { patience: -3, conviction: -1, risk: 2, homework: 2 } },
    ],
  },
  {
    id: "chat",
    scene: "A group chat you're in is twenty messages deep about one stock. It's up eight percent today.",
    ask: "What happens next?",
    choices: [
      { id: "a", text: "You mute it", move: { patience: 2, conviction: 2, risk: -1 } },
      { id: "b", text: "You read every message and buy nothing", move: { patience: 1, conviction: 1, risk: -1, homework: 2 } },
      { id: "c", text: "You buy a little before it runs", move: { patience: -3, conviction: -3, risk: 2, homework: -2 } },
    ],
  },
  {
    id: "guaranteed",
    scene: "Someone offers three percent a month, guaranteed, from a business you can't quite picture.",
    ask: "Your first move?",
    choices: [
      { id: "a", text: "Ask to see the business", move: { homework: 2 } },
      { id: "b", text: "No. Nothing guarantees three percent a month", move: { conviction: 2, risk: -2, homework: 1 } },
      { id: "c", text: "A small amount, just to see", move: { conviction: -2, risk: 2, homework: -3 } },
    ],
  },
  {
    id: "up-forty",
    scene: "Something you own is up forty percent after three years. You had planned to hold it for ten.",
    ask: "Do you sell?",
    choices: [
      { id: "a", text: "Yes. Forty percent is forty percent", move: { patience: -2, conviction: -1, risk: -1 } },
      { id: "b", text: "No. The plan was ten years", move: { patience: 3, conviction: 2, risk: 1 } },
      { id: "c", text: "Half. Take some off, let the rest run", move: { patience: -1, conviction: -1 } },
    ],
  },
  {
    id: "what-you-know",
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
