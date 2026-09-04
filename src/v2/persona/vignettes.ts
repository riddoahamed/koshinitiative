// ── Scene vignettes ──────────────────────────────────────────────────────────
// The five scene beats needed a picture. The first attempt sourced them from
// Openverse, the same keyless CC pipeline the product cards use, and the result
// is worth recording because it was not a tuning problem.
//
// "Two people whispering a secret" returned a photograph of a small blonde girl
// whispering to her father in a park — charming, and on a card that reads "your
// cousin works at a listed company", nonsense. It is the identical failure the
// sibling script has logged three times in its own comments: an 1880s Seattle
// railway share certificate on a Sanchayapatra card, a NatWest branch on
// Bangladeshi government securities, a pile of euros on a US dollar bond.
// General CC photo search cannot reliably return a specific scene, and it can
// never return a Bangladeshi one.
//
// So these are drawn, in the same text-grid technique as the portraits, which
// costs no image files, matches the payoff art exactly, and depicts the actual
// scene rather than something adjacent to it. 32x16, wide, to sit as a strip
// above the question.

export const VIG_W = 32;
export const VIG_H = 16;

export interface Vignette {
  palette: Record<string, string>;
  rows: string[];
}

const INK = "#2a2233";
const PAPER = "#efe7d8";

/** The cousin at the wedding: a laid table, a hanging light, three guests. */
const wedding: Vignette = {
  palette: { k: INK, g: "#c9a227", w: PAPER, r: "#a33a4a", s: "#d9a273", d: "#3a3040" },
  rows: [
    "................................",
    "..............gg................",
    "..............gg................",
    "............gggggg..............",
    "...........gggggggg.............",
    "................................",
    ".....ss.......ss.......ss.......",
    "....ssss.....ssss.....ssss......",
    "....dddd.....dddd.....dddd......",
    "...dddddd...dddddd...dddddd.....",
    "................................",
    "..wwwwwwwwwwwwwwwwwwwwwwwwwwww..",
    "..wwrrwwwwwwwwrrwwwwwwwwrrwwww..",
    "..wwwwwwwwwwwwwwwwwwwwwwwwwwww..",
    "...kkkkkkkkkkkkkkkkkkkkkkkkkk...",
    "....kk....................kk....",
  ],
};

/** The bonus: a banded stack of taka. */
const bonus: Vignette = {
  palette: { k: INK, g: "#4a7c59", w: "#cfe3d4", b: "#a33a4a", h: "#7fa88c" },
  rows: [
    "................................",
    "................................",
    ".......kkkkkkkkkkkkkkkkkk.......",
    ".......kwwwwwwwwwwwwwwwwk.......",
    ".......kwggggggggggggggwk.......",
    ".......kwgwwwwwwwwwwwwgwk.......",
    ".......kwgwhhhhhhhhhhwgwk.......",
    ".......bbbbbbbbbbbbbbbbbb.......",
    ".......kwgwhhhhhhhhhhwgwk.......",
    ".......kwgwwwwwwwwwwwwgwk.......",
    ".......kwggggggggggggggwk.......",
    ".......kwwwwwwwwwwwwwwwwk.......",
    ".......kkkkkkkkkkkkkkkkkk.......",
    "........kkkkkkkkkkkkkkkk........",
    ".........kkkkkkkkkkkkkk.........",
    "................................",
  ],
};

/** The guaranteed return: a document, an outsized promise, a wax seal. */
const guaranteed: Vignette = {
  palette: { k: INK, w: PAPER, t: "#8a8578", r: "#a33a4a", g: "#c9a227" },
  rows: [
    "................................",
    ".......kkkkkkkkkkkkkkkkkk.......",
    ".......kwwwwwwwwwwwwwwwwk.......",
    ".......kwttttttttttwwwwwk.......",
    ".......kwwwwwwwwwwwwwwwwk.......",
    ".......kwwwrrrwwrrrwwwwwk.......",
    ".......kwwrwwwrrwwwrwwwwk.......",
    ".......kwwrwwwrrwwwrwwwwk.......",
    ".......kwwwrrrwwrrrwwwwwk.......",
    ".......kwwwwwwwwwwwwwwwwk.......",
    ".......kwttttttwwttttwwwk.......",
    ".......kwwwwwwwwwwwwwwwwk.......",
    ".......kwwwwwwwwwwwggwwwk.......",
    ".......kwwwwwwwwwwgggggwk.......",
    ".......kkkkkkkkkkkkgggkkk.......",
    "....................gg..........",
  ],
};

/** The inside tip: one head leaning into another, and the words crossing. */
const tip: Vignette = {
  palette: { k: INK, s: "#d9a273", h: "#3b2f2a", w: PAPER, d: "#2b2736", a: "#c9a227" },
  rows: [
    "................................",
    ".......hhhhh..........hhhhh.....",
    "......hsssssh........hsssssh....",
    "......ssssssss......ssssssss....",
    "......ssksssks......sksssks.....",
    "......ssssssss......ssssssss....",
    ".......ssssss........ssssss.....",
    "........ssss..........ssss......",
    "......dddddddd......dddddddd....",
    ".....dddddddddd....dddddddddd...",
    "................................",
    "..........aa..aa..aa............",
    "................................",
    "...........wwwwwwww.............",
    "..........wwwwwwwwww............",
    "................................",
  ],
};

/** What you actually know: a glass over a chart that mostly is not there. */
const know: Vignette = {
  palette: { k: INK, g: "#8ab24a", c: "#5a6b8a", w: PAPER, d: "#3a3040" },
  rows: [
    "................................",
    "................................",
    ".....k..........................",
    ".....k................kkkk......",
    ".....k..............kk....kk....",
    ".....k.........gg...k......wk...",
    ".....k......gg.gg...k......wk...",
    ".....k...gg.gg.gg...k.......k...",
    ".....k...gg.gg.gg....kk....kk...",
    ".....k...gg.gg.gg......kkkk.....",
    ".....k...gg.gg.gg.........kk....",
    ".....k...gg.gg.gg..........kk...",
    ".....kkkkkkkkkkkkkkkkkkkkkkkk...",
    "................................",
    "................................",
    "................................",
  ],
};

export const VIGNETTES: Record<string, Vignette> = {
  wedding, bonus, guaranteed, tip, know,
};
