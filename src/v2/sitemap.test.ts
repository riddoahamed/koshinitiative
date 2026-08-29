import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PAGE_META, PATH_ALIASES } from "./pageMeta";
import { LOCAL_POSTS } from "./posts";
import { metaForPath } from "./ogMeta";

const ROOT = join(__dirname, "..", "..");
const SITE = "https://www.koshbd.com";
const xml = readFileSync(join(ROOT, "public", "sitemap.xml"), "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// ── The sitemap ─────────────────────────────────────────────────────────────
// It was hand-written next to a post list that is data, and rotted the way
// that always goes: two guides missing, two routes never added, every lastmod
// frozen on one day, and /vote advertised to Google by a file sitting next to
// a page that sends robots:noindex. It is generated now — these are the checks
// that stop it drifting again.
//
// Run `npm run sitemap` when any of these fail.

describe("sitemap", () => {
  it("lists every local post", () => {
    const missing = LOCAL_POSTS.map((p) => `${SITE}/blog/${p.slug}`).filter((u) => !locs.includes(u));
    expect(missing, "posts missing from the sitemap — run `npm run sitemap`").toEqual([]);
  });

  it("lists every indexable route", () => {
    const missing = Object.entries(PAGE_META)
      .filter(([, m]) => !m.noindex)
      .map(([path]) => `${SITE}${path}`)
      .filter((u) => !locs.includes(u));
    expect(missing, "routes missing from the sitemap — run `npm run sitemap`").toEqual([]);
  });

  it("never advertises a page that tells crawlers not to index it", () => {
    // The contradiction the old file shipped: /vote sends robots:noindex and
    // was in the sitemap anyway.
    const contradictions = locs.filter((u) => {
      const path = u.replace(SITE, "") || "/";
      return metaForPath(path).noindex === true;
    });
    expect(contradictions, "noindexed pages advertised in the sitemap").toEqual([]);
  });

  it("has no alias, duplicate or stray entry", () => {
    expect(locs.length, "duplicate <loc> entries").toBe(new Set(locs).size);
    const aliases = Object.keys(PATH_ALIASES).map((p) => `${SITE}${p}`);
    expect(locs.filter((u) => aliases.includes(u)), "alias routes duplicate real ones").toEqual([]);

    const known = new Set([
      ...Object.keys(PAGE_META).map((p) => `${SITE}${p}`),
      ...LOCAL_POSTS.map((p) => `${SITE}/blog/${p.slug}`),
    ]);
    expect(locs.filter((u) => !known.has(u)), "urls in the sitemap that no longer exist").toEqual([]);
  });

  it("dates each post from the post, not from the build", () => {
    // A lastmod is a claim about the content. Stamping every entry with the
    // build date is how a sitemap stops carrying information.
    for (const p of LOCAL_POSTS) {
      const block = xml.match(
        new RegExp(`<loc>${SITE}/blog/${p.slug}</loc>\\s*<lastmod>([^<]+)</lastmod>`)
      );
      expect(block?.[1], p.slug).toBe(String(p.date).slice(0, 10));
    }
  });

  it("is well-formed and points where robots.txt says it does", () => {
    expect(locs.length).toBeGreaterThan(0);
    expect(xml.match(/<url>/g)?.length).toBe(locs.length);
    expect(xml.match(/<\/url>/g)?.length).toBe(locs.length);
    for (const u of locs) expect(u.startsWith(`${SITE}/`), u).toBe(true);

    const robots = readFileSync(join(ROOT, "public", "robots.txt"), "utf8");
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});
