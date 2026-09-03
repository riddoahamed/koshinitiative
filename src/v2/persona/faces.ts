// ── Pixel portraits, built from parts ────────────────────────────────────────
// Kosh Quest draws its sprites as hand-written text grids on a canvas and ships
// no image files. This does the same for the investor personas, with one change
// that matters at this size: hand-drawing eight complete 20x20 heads is eight
// chances to draw a head wrong. So there is ONE base head, and everything that
// makes a face a particular person — hair, brow, eyes, mouth, whatever they are
// wearing — is a sparse overlay stacked on top of it.
//
// A layer row is 20 characters. '.' is transparent, every other character is a
// palette key. faces.test.ts asserts the width of every row in this file,
// because a row one character short shifts an eye into a temple and the result
// still renders — it just looks wrong, and only to a person.
//
// No likeness of any real person is drawn here. These are original characters.

export const FACE_W = 20;
export const FACE_H = 20;

/** A sparse overlay: `rows[0]` is drawn at `top`. */
export interface Layer {
  top: number;
  rows: string[];
}

export interface Face {
  /** Skin, hair and cloth colours for this character. */
  palette: Record<string, string>;
  /** Drawn in order, over the base head. */
  layers: Layer[];
}

// ── The base head ────────────────────────────────────────────────────────────
// s = skin, d = shadow, k = outline, t = clothing.

export const BASE: Layer = {
  top: 0,
  rows: [
    "....................",
    ".....kkkkkkkkkk.....",
    "....kssssssssssk....",
    "...ksssssssssssssk..",
    "...kssssssssssssk...",
    "...kssssssssssssk...",
    "...kssssssssssssk...",
    "...kssssssssssssk...",
    "...kssssssssssssk...",
    "...kssssssssssssk...",
    "...kssssssssssssk...",
    "...kssssssssssssk...",
    "....kssssssssssk....",
    ".....kssssssssk.....",
    "......kksssskk......",
    "........ssss........",
    ".......kssssk.......",
    "..kkkkkktttkkkkkkk..",
    ".kttttttttttttttttk.",
    ".kttttttttttttttttk.",
  ],
};

// ── The grid everything is aligned to ────────────────────────────────────────
// The head occupies columns 3-16, so its centre line falls between columns 9
// and 10. Every feature below is symmetric about that line, and every feature
// sits in its own band:
//
//   rows 1-4    hair
//   rows 5-7    brows
//   rows 8-9    eyes            (spectacles sit over rows 7-10)
//   rows 10-11  nose, moustache
//   rows 12-13  mouth
//   rows 17-19  shoulders, collar
//
// The first pass ignored this and the faces showed it: eyes landed outside the
// lenses they were meant to sit behind, and a "smile" put its two corners at
// columns 6 and 11 — two columns off centre, which at this size reads as a
// person with a crooked mouth rather than a friendly one.

// ── Hair ─────────────────────────────────────────────────────────────────────

const HAIR = {
  /** Neat, full, swept. */
  neat: {
    top: 1,
    rows: [
      ".....hhhhhhhhhh.....",
      "....hhhhhhhhhhhh....",
      "...hhhh......hhhh...",
      "...hh..........hh...",
    ],
  },
  /** Receding, thin on top — the years show. */
  thin: {
    top: 1,
    rows: [
      ".......hhhhhh.......",
      "....hh.hhhhhh.hh....",
      "...hhh........hhh...",
      "...hh..........hh...",
    ],
  },
  /** Slept on it, thought about something else. */
  messy: {
    top: 0,
    rows: [
      "......h..h..h.h.....",
      ".....hhhhhhhhhhh....",
      "....hhhhhhhhhhhhh...",
      "...hhh..h.....hhh...",
      "...hh..........hh...",
    ],
  },
  /** Short crop, tidy. */
  crop: {
    top: 1,
    rows: [
      ".....hhhhhhhhhh.....",
      "....hhhhhhhhhhhh....",
      "...hh..........hh...",
    ],
  },
  /** Shaved close. */
  shaved: {
    top: 2,
    rows: [
      "....hhhhhhhhhhhh....",
      "...hh..........hh...",
    ],
  },
} satisfies Record<string, Layer>;

// ── Brows — where most of the expression lives ───────────────────────────────

const BROW = {
  flat:   { top: 6, rows: [".....bbbb..bbbb....."] },
  /** Pulled down and in. Concentration, or suspicion. */
  furrow: { top: 6, rows: [".....bbb....bbb.....", "........b..b........"] },
  /** Lifted. Surprise, appetite. */
  raised: { top: 5, rows: [".....bbbb..bbbb....."] },
  /** Short and outer-set. Kindness, or tiredness. */
  soft:   { top: 6, rows: [".....bb......bb....."] },
} satisfies Record<string, Layer>;

// ── Eyes — a white pair with the pupils set inward, so they look at you ──────

const EYES = {
  open:   { top: 8, rows: ["......ww....ww......", "......we....ew......"] },
  /** Wide. The screen is winning. */
  wide:   { top: 7, rows: ["......ww....ww......", "......we....ew......", "......ww....ww......"] },
  /** Narrowed. Reading the room. */
  narrow: { top: 8, rows: ["......dd....dd......", "......ee....ee......"] },
  /** Shut. Not asleep — untroubled. */
  closed: { top: 9, rows: [".....eeee..eeee....."] },
  /** Looking off to one side, at something you cannot see. */
  aside:  { top: 8, rows: ["......ww....ww......", "......ew....ew......"] },
} satisfies Record<string, Layer>;

// ── Mouths ───────────────────────────────────────────────────────────────────

const MOUTH = {
  smile:  { top: 12, rows: [".......m....m.......", "........mmmm........"] },
  flat:   { top: 12, rows: ["........mmmm........"] },
  /** A small, private one — one corner up. */
  smirk:  { top: 11, rows: ["............m.......", "........mmmm........"] },
  open:   { top: 12, rows: ["........mmmm........", "........mmmm........"] },
  frown:  { top: 12, rows: [".......mmmmmm.......", "......m......m......"] },
} satisfies Record<string, Layer>;

// ── Facial hair ──────────────────────────────────────────────────────────────

const FACIAL = {
  /** The full Motijheel moustache. */
  moustache: { top: 10, rows: ["......hhhhhhhh......"] },
  /** Two days of not deciding to. */
  stubble:   { top: 11, rows: ["....d.d......d.d....", ".....ddddddddd......"] },
  beard:     { top: 11, rows: ["....hh......hh......", ".....hhhhhhhh.......", "......hhhhhh........"] },
} satisfies Record<string, Layer>;

// ── Worn ─────────────────────────────────────────────────────────────────────

const WORN = {
  /** Round spectacles. The lenses frame columns 6-7 and 12-13 — where the eyes
      are — which is the whole point and was exactly what the first pass missed. */
  specs: {
    top: 7,
    rows: [
      ".....gggg..gggg.....",
      ".....g..gggg..g.....",
      ".....g..g..g..g.....",
      ".....gggg..gggg.....",
    ],
  },
  /** Half-rim spectacles — no bottom bar, so a moustache can share the face. */
  specsOpen: {
    top: 7,
    rows: [
      ".....gggg..gggg.....",
      ".....g..gggg..g.....",
      ".....g..g..g..g.....",
    ],
  },
  /** Cap, worn backwards — the strap shows at the front. */
  capBack: {
    top: 0,
    rows: [
      ".....cccccccccc.....",
      "....cccccccccccc....",
      "...cccccccccccccc...",
      "...cc.cccccccc.cc...",
    ],
  },
  /** Earbuds, at the edge of the head rather than floating beside it. */
  buds: { top: 8, rows: ["...c............c..."] },
  /** A chain, worn where it will be seen. */
  chain: { top: 17, rows: [".......gggggg.......", "......g......g......"] },
  /** Collared shirt, buttoned to the top. */
  collar: {
    top: 17,
    rows: [
      "..kkkkkkwwwkkkkkkk..",
      ".ktttwwttttttwwtttk.",
    ],
  },
} satisfies Record<string, Layer>;

export const PARTS = { HAIR, BROW, EYES, MOUTH, FACIAL, WORN };

// ── Palettes ─────────────────────────────────────────────────────────────────

const SKIN_WARM = { s: "#d9a273", d: "#b8804f", k: "#2a2233" };
const SKIN_DEEP = { s: "#b57a4d", d: "#8e5a33", k: "#241d2e" };
const SKIN_LIGHT = { s: "#e8bb8f", d: "#c4926a", k: "#2a2233" };

// `t` is the garment the base head's shoulders are drawn in. It had no entry
// here, so every torso rendered as nothing at all — and because the app's
// background is near-black and the shoulder OUTLINE is drawn in `k`, the result
// looked deliberate. A silent hole in every one of the eight faces.
const INK = { e: "#241d2e", m: "#8c4a4a", w: "#fdf6ec", b: "#3a2f24", t: "#2b2736" };

export function face(
  skin: Record<string, string>,
  extra: Record<string, string>,
  layers: Layer[],
): Face {
  return { palette: { ...skin, ...INK, ...extra }, layers };
}

export const SKINS = { warm: SKIN_WARM, deep: SKIN_DEEP, light: SKIN_LIGHT };
