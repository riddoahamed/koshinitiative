// ── Scoring — pure, so the result is arguable ────────────────────────────────
// Answers move four axes; the axes are normalised to -100…100; the archetype is
// whichever signature sits nearest in that space. No React, no randomness, no
// hidden weighting — a person who wants to know why they got The Land Man can
// be shown the four numbers that put them there.

import {
  ARCHETYPES, SCORABLE_ARCHETYPES, type Archetype, type ArchetypeId, type Traits,
} from "./archetypes";
import { MAX_PER_AXIS, SCENARIOS, type Scenario } from "./scenarios";

export const AXES = ["patience", "conviction", "risk", "homework"] as const;
export type Axis = (typeof AXES)[number];

/** scenarioId -> choiceId */
export type Answers = Record<string, string>;

export function emptyTraits(): Traits {
  return { patience: 0, conviction: 0, risk: 0, homework: 0 };
}

/** Raw axis movement, before normalising. */
export function accumulate(answers: Answers, deck: Scenario[] = SCENARIOS): Traits {
  const t = emptyTraits();
  for (const s of deck) {
    const picked = s.choices.find((c) => c.id === answers[s.id]);
    if (!picked) continue;
    for (const axis of AXES) t[axis] += picked.move[axis] ?? 0;
  }
  return t;
}

/** -100 … 100 on every axis, so the bars and the distance both mean something. */
export function normalise(raw: Traits): Traits {
  const out = emptyTraits();
  for (const axis of AXES) {
    const max = MAX_PER_AXIS[axis] || 1;
    out[axis] = Math.round(Math.max(-100, Math.min(100, (raw[axis] / max) * 100)));
  }
  return out;
}

function distance(a: Traits, b: Traits): number {
  return Math.sqrt(AXES.reduce((s, ax) => s + Math.pow(a[ax] - b[ax], 2), 0));
}

export interface Result {
  archetype: Archetype;
  traits: Traits;
  /** How close the fit is, 0-100. A low number is worth saying out loud. */
  fitPct: number;
  /** The one they were nearly. Half the fun of a result is the runner-up. */
  runnerUp: Archetype;
  /** Which axis is furthest from the middle — the thing that defines them. */
  defining: Axis;
  /** Whether they answered everything. */
  complete: boolean;
}

export function classify(answers: Answers, deck: Scenario[] = SCENARIOS): Result {
  const traits = normalise(accumulate(answers, deck));

  // ── The categorical answer, checked before the scored one ─────────────────
  // Buying ahead of an announcement because a relative works there is not a
  // position on a risk axis. It is a different kind of answer, and averaging it
  // into four numbers would let it disappear behind seven other picks.
  const flagged = deck.some((s) =>
    s.choices.find((c) => c.id === answers[s.id])?.flag === "insider");

  const ranked = [...SCORABLE_ARCHETYPES]
    .map((a) => ({ a, d: distance(traits, a.signature) }))
    .sort((x, y) => x.d - y.d);

  const best = ranked[0];
  const second = ranked[1];

  // The furthest any two points in a 4-axis -100…100 space can be.
  const maxD = Math.sqrt(4 * 200 * 200);
  const fitPct = Math.round(Math.max(0, 1 - best.d / maxD) * 100);

  let defining: Axis = AXES[0];
  for (const ax of AXES) if (Math.abs(traits[ax]) > Math.abs(traits[defining])) defining = ax;

  return {
    archetype: flagged ? ARCHETYPES.insider : best.a,
    // When the flag fires, the nearest scored type becomes the runner-up — it
    // is still true, and it is the more useful half of the result.
    traits,
    fitPct,
    runnerUp: flagged ? best.a : second.a,
    defining,
    complete: deck.every((s) => answers[s.id] != null),
  };
}

/** The result as one forwardable line. */
export function shareLine(r: Result): string {
  return `I'm ${r.archetype.name} — "${r.archetype.tagline}"`;
}

export const byId = (id: ArchetypeId): Archetype => ARCHETYPES[id];
