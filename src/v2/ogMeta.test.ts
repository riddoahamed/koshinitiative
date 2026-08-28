import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  metaForPath,
  ogDocument,
  isCrawler,
  blogSlug,
  normalisePath,
  absoluteImage,
  CRAWLERS,
  SITE,
  DEFAULT_IMAGE,
} from "./ogMeta";
import { PAGE_META, PATH_ALIASES } from "./pageMeta";
import { LOCAL_POSTS } from "./posts";

const ROOT = join(__dirname, "..", "..");

// ── Link previews ───────────────────────────────────────────────────────────
// The bug these exist for is silent by construction: a wrong preview looks
// completely fine to everyone except the person deciding whether to tap a link
// in a group chat, and they never tell you.

describe("path resolution", () => {
  it("ignores query strings, hashes and trailing slashes", () => {
    const slug = LOCAL_POSTS[0].slug;
    for (const p of [`/blog/${slug}`, `/blog/${slug}/`, `/blog/${slug}?fbclid=abc`, `/blog/${slug}#top`]) {
      expect(metaForPath(p).title, p).toBe(`${LOCAL_POSTS[0].title} | Kosh`);
    }
  });

  it("resolves the alias routes to what they actually render", () => {
    expect(normalisePath("/live")).toBe("/vote");
    expect(normalisePath("/investor-type")).toBe("/quiz");
    expect(metaForPath("/investor-type").title).toBe(metaForPath("/quiz").title);
  });

  it("does not treat /blog/submit as a post slug", () => {
    expect(blogSlug("/blog/submit")).toBeNull();
    expect(metaForPath("/blog/submit").title).toBe("Submit to the Kosh blog | Kosh");
  });

  it("treats /blog itself as the blog, not a slug", () => {
    expect(blogSlug("/blog")).toBeNull();
  });
});

describe("post previews", () => {
  it("gives every local post its own title and dek", () => {
    for (const p of LOCAL_POSTS) {
      const m = metaForPath(`/blog/${p.slug}`);
      expect(m.title, p.slug).toBe(`${p.title} | Kosh`);
      expect(m.description, p.slug).toBe(p.dek);
      expect(m.type, p.slug).toBe("article");
    }
  });

  it("makes every og:image absolute", () => {
    // A relative og:image is silently dropped by every scraper — the quietest
    // possible way to ship a broken card.
    for (const p of LOCAL_POSTS) {
      expect(metaForPath(`/blog/${p.slug}`).image, p.slug).toMatch(/^https:\/\//);
    }
    expect(absoluteImage("/posts/x.jpg")).toBe(`${SITE}/posts/x.jpg`);
    expect(absoluteImage("https://cdn.example.com/x.jpg")).toBe("https://cdn.example.com/x.jpg");
    expect(absoluteImage(undefined)).toBe(DEFAULT_IMAGE);
    expect(absoluteImage("  ")).toBe(DEFAULT_IMAGE);
  });

  it("uses a database post when one is passed in", () => {
    const m = metaForPath("/blog/a-reader-submission", {
      slug: "a-reader-submission",
      title: "What I learned losing money on a co-operative",
      dek: "A reader's account.",
      body: [],
      date: "2026-08-01",
      category: "story",
      tags: [],
      source: "community",
      readMins: 4,
    });
    expect(m.title).toBe("What I learned losing money on a co-operative | Kosh");
    expect(m.type).toBe("article");
  });

  it("falls back to the blog card, noindexed, for a slug that resolves to nothing", () => {
    const m = metaForPath("/blog/does-not-exist");
    expect(m.noindex).toBe(true);
    expect(m.title).toBe("Blog — money in Bangladesh, explained | Kosh");
  });

  it("never brands a title twice", () => {
    expect(metaForPath("/blog").title.match(/\| Kosh/g)).toHaveLength(1);
  });
});

describe("routes", () => {
  it("every route in App.tsx has copy, or is deliberately the site card", () => {
    const app = readFileSync(join(ROOT, "src", "App.tsx"), "utf8");
    const paths = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]);
    const unmapped = paths.filter(
      (p) =>
        p !== "*" &&
        !p.includes(":") &&
        !PAGE_META[p] &&
        !PATH_ALIASES[p]
    );
    expect(unmapped, "routes with no preview copy — add them to pageMeta.ts").toEqual([]);
  });
});

describe("the document", () => {
  it("escapes text going into attributes", () => {
    const html = ogDocument("/blog/x", {
      title: 'Quote " and <tag> & amp',
      description: "d",
      image: DEFAULT_IMAGE,
      type: "website",
    });
    expect(html).toContain("&quot;");
    expect(html).toContain("&lt;tag&gt;");
    expect(html).not.toMatch(/content="[^"]*<tag>/);
  });

  it("carries a canonical, an absolute image and a bounce to the real page", () => {
    const slug = LOCAL_POSTS[0].slug;
    const html = ogDocument(`/blog/${slug}`);
    expect(html).toContain(`<link rel="canonical" href="${SITE}/blog/${slug}">`);
    expect(html).toContain('property="og:image" content="https://');
    expect(html).toContain(`location.replace("${SITE}/blog/${slug}")`);
    expect(html).toContain('property="og:type" content="article"');
  });

  it("marks an unresolvable post noindex", () => {
    expect(ogDocument("/blog/nope")).toContain('name="robots" content="noindex"');
  });
});

describe("crawler detection", () => {
  it("catches the unfurlers that cannot run JavaScript", () => {
    for (const ua of [
      "facebookexternalhit/1.1",
      "WhatsApp/2.23",
      "Twitterbot/1.0",
      "TelegramBot (like TwitterBot)",
      "LinkedInBot/1.0",
      "Slackbot-LinkExpanding 1.0",
    ]) {
      expect(isCrawler(ua), ua).toBe(true);
    }
  });

  it("leaves humans and Googlebot alone", () => {
    // Googlebot renders the SPA and indexes the real page. Handing it a stub
    // would make every route look like a redirect shell.
    for (const ua of [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15",
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120",
    ]) {
      expect(isCrawler(ua), ua).toBe(false);
    }
    expect(isCrawler(null)).toBe(false);
    expect(isCrawler(undefined)).toBe(false);
    expect(isCrawler("")).toBe(false);
  });

  // ── Separate implementations, one contract ────────────────────────────────
  // app.koshbd.com owns its own ogMeta and should. But a link that unfurls on
  // one Kosh domain and stays blank on the other is a bug nobody reports —
  // they just stop sharing. The app repo runs the mirror of this test.
  it("matches the app's crawler list", () => {
    const appOg = join(ROOT, "..", "kosh", "src", "lib", "ogMeta.ts");
    let text = "";
    try {
      text = readFileSync(appOg, "utf8");
    } catch {
      return; // app repo not checked out beside this one
    }
    const theirs = text.match(/export const CRAWLERS\s*=\s*\n?\s*(\/.+\/i);/)?.[1];
    expect(theirs, "could not find CRAWLERS in the app's ogMeta").toBeTruthy();
    expect(theirs, "the two crawler lists have drifted apart").toBe(CRAWLERS.toString());
  });
});

describe("robots", () => {
  it("keeps /vote out of search, in the preview as well as the page", () => {
    // Vote.tsx has always sent robots: noindex. Before pageMeta carried that
    // decision, the middleware would have handed crawlers an indexable card
    // for it — the page and its preview disagreeing about the same URL.
    expect(metaForPath("/vote").noindex).toBe(true);
    expect(metaForPath("/live").noindex).toBe(true);
    expect(ogDocument("/vote")).toContain('name="robots" content="noindex"');
  });

  it("leaves the pages that should be found alone", () => {
    for (const p of ["/", "/blog", "/learn", "/start", "/quiz", "/investkorsi"]) {
      expect(metaForPath(p).noindex, p).toBeUndefined();
    }
  });
});

describe("image dimensions", () => {
  it("declares a size only for the site card, which we made and can measure", () => {
    // A wrong og:image:width is worse than none — Facebook lays the card out
    // from the declared size before it has the bytes, so a 1024x891 photo
    // announced as 1200x630 renders cropped or gets dropped entirely.
    const site = metaForPath("/blog");
    expect(site.image).toBe(DEFAULT_IMAGE);
    expect(site.imageWidth).toBe(1200);
    expect(site.imageHeight).toBe(630);
    expect(ogDocument("/blog")).toContain('property="og:image:width" content="1200"');
  });

  it("declares nothing for a post cover, whose size we do not know", () => {
    const withCover = LOCAL_POSTS.find((p) => p.cover);
    expect(withCover, "expected at least one local post with a cover").toBeTruthy();
    const m = metaForPath(`/blog/${withCover!.slug}`);
    expect(m.imageWidth).toBeUndefined();
    expect(m.imageHeight).toBeUndefined();
    expect(ogDocument(`/blog/${withCover!.slug}`)).not.toContain("og:image:width");
  });

  it("falls back to the site card, with its size, for a post with no cover", () => {
    const noCover = LOCAL_POSTS.find((p) => !p.cover);
    if (!noCover) return;
    const m = metaForPath(`/blog/${noCover.slug}`);
    expect(m.image).toBe(DEFAULT_IMAGE);
    expect(m.imageWidth).toBe(1200);
  });
});
