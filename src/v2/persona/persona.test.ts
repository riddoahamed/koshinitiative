import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { FACE_W, FACE_H, BASE, PARTS } from "./faces";
import { ALL_ARCHETYPES, ARCHETYPES } from "./archetypes";
import { SCENARIOS } from "./scenarios";
import { classify } from "./engine";

// ── Two repos, one deck ──────────────────────────────────────────────────────
// The app and this site each hold a copy of the persona files. There is no
// package between them and there isn't going to be one for three data modules,
// so the risk is silent drift: someone edits a scene in the app, the site keeps
// asking the old one, and two people comparing results get different answers
// from what looks like the same quiz.
//
// This pins them. It only runs where the app is checked out beside this repo —
// on CI, where it isn't, the rest of the file still does its job.
const HERE = resolve(process.cwd(), "src/v2");
const APP = resolve(process.cwd(), "../kosh/src");

describe("the copies stay identical", () => {
  const pairs: Array<[string, string]> = [
    ["faces.ts", "data/persona/faces.ts"],
    ["scenarios.ts", "data/persona/scenarios.ts"],
    ["engine.ts", "lib/persona/engine.ts"],
  ];

  for (const [mine, theirs] of pairs) {
    it(`${mine} matches the app's`, () => {
      const appFile = resolve(APP, theirs);
      if (!existsSync(appFile)) return; // app not checked out beside us
      const a = readFileSync(resolve(HERE, "persona", mine), "utf8");
      const b = readFileSync(appFile, "utf8")
        // The only licensed differences are the import paths.
        .replace(/@\/data\/persona\/(\w+)/g, "./$1")
        .replace(/@\/lib\/persona\/(\w+)/g, "./$1")
        .replace(/@\/data\/persona\/faces/g, "./faces");
      expect(a.trim()).toBe(b.trim());
    });
  }

  it("asks the same scenes, in the same order", () => {
    const appFile = resolve(APP, "data/persona/scenarios.ts");
    if (!existsSync(appFile)) return;
    const ids = (src: string) => [...src.matchAll(/^\s{4}id: "([a-z-]+)",$/gm)].map((m) => m[1]);
    expect(ids(readFileSync(appFile, "utf8"))).toEqual(SCENARIOS.map((s) => s.id));
  });
});

describe("the art", () => {
  const layers = [
    ["BASE", BASE] as const,
    ...Object.entries(PARTS).flatMap(([g, set]) =>
      Object.entries(set).map(([n, l]) => [`${g}.${n}`, l] as const),
    ),
  ];

  it("draws every row exactly 20 wide and inside the canvas", () => {
    for (const [name, layer] of layers) {
      layer.rows.forEach((row, i) => expect(row.length, `${name} row ${i}`).toBe(FACE_W));
      expect(layer.top + layer.rows.length, name).toBeLessThanOrEqual(FACE_H);
    }
  });

  it("gives every face a colour for every character it draws", () => {
    for (const a of ALL_ARCHETYPES) {
      for (const layer of a.face.layers) {
        for (const row of layer.rows) {
          for (const ch of row) {
            if (ch === ".") continue;
            expect(a.face.palette[ch], `${a.id} has no colour for "${ch}"`).toBeTruthy();
          }
        }
      }
    }
  });
});

describe("this site's own wiring", () => {
  it("uses one of the four accents this stylesheet knows", () => {
    const css = readFileSync(resolve(HERE, "v2.css"), "utf8");
    for (const a of ALL_ARCHETYPES) {
      expect(["mint", "lime", "purple", "teal"], a.id).toContain(a.accent);
      expect(css, `no .acc-${a.accent} rule for the axis bars`)
        .toContain(`.acc-${a.accent} .persona-axis__track b`);
    }
  });

  it("sends every result into the app, never to a page this site lacks", () => {
    for (const a of ALL_ARCHETYPES) expect(a.next.href, a.id).toMatch(/^\//);
  });

  it("keeps all eight reachable", () => {
    const reached = new Set<string>();
    const walk = (i: number, acc: Record<string, string>) => {
      if (i === SCENARIOS.length) { reached.add(classify(acc).archetype.id); return; }
      for (const c of SCENARIOS[i].choices) walk(i + 1, { ...acc, [SCENARIOS[i].id]: c.id });
    };
    walk(0, {});
    expect([...Object.keys(ARCHETYPES)].filter((id) => !reached.has(id))).toEqual([]);
  });
});
