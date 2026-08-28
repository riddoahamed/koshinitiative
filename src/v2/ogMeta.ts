/* ── Per-route link previews for koshbd.com ───────────────────────────────────

   vercel.json rewrites every path without a dot to /index.html. Correct for
   the SPA, fatal for link previews: a crawler asking for
   /blog/how-to-start-investing-in-us-markets-from-bangladesh received the
   site-level card, so every article anyone forwarded unfurled as the identical
   "Kosh: from 'where do I start?' to your first real investment". A reader
   being sent a guide in a WhatsApp group had no way to tell what it was, which
   is the entire reason anyone taps.

   applySeo() already sets the right tags — but it runs in React, and the
   unfurlers that matter here do not run JavaScript. So this is the same fix
   the app repo uses: a crawler-only branch (middleware.ts) that hands them a
   tiny document carrying the right tags.

   ── SEPARATE FROM THE APP'S COPY, DELIBERATELY ──────────────────────────────
   app.koshbd.com has its own src/lib/ogMeta.ts. The two are NOT shared, and
   should not be: they resolve completely different things (routes and posts
   here, 78 app surfaces and zones there), they have different canonical hosts,
   different site names and different default cards. Sharing would mean
   publishing a package to unify about sixty lines, and would drag this site's
   bundle through the app's zone data.

   What IS shared is the CONTRACT — the crawler list, the document shape and
   the cache headers — because a preview that behaves differently depending on
   which Kosh domain it came from is a bug. `ogMeta.test.ts` in both repos
   asserts the crawler lists stay identical, so the drift is caught rather than
   discovered in a group chat.

   ── EDGE BUNDLE RULES ───────────────────────────────────────────────────────
   Imports are relative, never "@/": middleware.ts is bundled by Vercel's edge
   builder, not by Vite, so the tsconfig path alias is not guaranteed to
   resolve. Every module reached from here must be pure data with no imports of
   its own — posts.ts and pageMeta.ts both qualify.                           */

import { LOCAL_POSTS, CATEGORY_LABEL, type Post } from "./posts";
import { PAGE_META, PATH_ALIASES } from "./pageMeta";

export const SITE = "https://www.koshbd.com";

/** The site card. Also the fallback for anything without a picture of its own.
    We made it, so we know its size — which is why it is the only image here
    that gets to declare one. */
export const DEFAULT_IMAGE = `${SITE}/og-image.jpg`;
export const DEFAULT_IMAGE_SIZE = { width: 1200, height: 630 } as const;

const DEFAULT_META: RouteMeta = {
  title: "Kosh: from “where do I start?” to your first real investment",
  description:
    "Kosh takes you from “I don't know where to start” to your first real investment. Free money lessons, a 60-second investor-type check, risk-free practice on real market prices, and honest answers. Starting in Bangladesh. We never touch your money.",
  image: DEFAULT_IMAGE,
  imageWidth: DEFAULT_IMAGE_SIZE.width,
  imageHeight: DEFAULT_IMAGE_SIZE.height,
  type: "website",
};

export interface RouteMeta {
  title: string;
  description: string;
  image: string;
  /** ── Only set where we actually know it ──────────────────────────────────
      og:image:width / height are a promise to the scraper, and a wrong one is
      worse than none: Facebook lays the card out from the declared size before
      it has the bytes, so a 1024×891 photo announced as 1200×630 renders
      cropped or gets dropped. Post covers are arbitrary photographs of unknown
      size, so they declare nothing and let the scraper measure. */
  imageWidth?: number;
  imageHeight?: number;
  /** "article" for a post — it is what gives a preview a date and a byline. */
  type: "website" | "article";
  publishedTime?: string;
  author?: string;
  section?: string;
  noindex?: boolean;
}

/** Suffix every title carries, so a preview is attributable at a glance.
    Matches applySeo()'s `${title} | Kosh` exactly — the two must agree, or a
    link looks like two different pages depending on who opened it. */
function brand(title: string): string {
  return /\|\s*Kosh$/.test(title) ? title : `${title} | Kosh`;
}

/** A cover may be a site-relative path ("/posts/x.jpg"). og:image must be
    absolute — a relative one is silently dropped by every scraper, which is
    the quietest possible way to ship a broken card. */
export function absoluteImage(src: string | undefined | null): string {
  const s = (src ?? "").trim();
  if (!s) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(s)) return s;
  return `${SITE}${s.startsWith("/") ? s : `/${s}`}`;
}

/** The card for one post, wherever it came from — local or the posts table. */
export function metaForPost(post: Post): RouteMeta {
  return {
    title: brand(post.title),
    // A dek is written to sit under a headline, which is exactly the job of a
    // preview description. Falling back to the first paragraph would risk
    // emitting raw HTML from a local post's body into an attribute.
    description: post.dek || "A lesson, guide or straight answer about money in Bangladesh.",
    // No width/height: a cover is a photograph of whatever size it happens to
    // be, and guessing is what breaks the card.
    image: absoluteImage(post.cover),
    ...(post.cover ? {} : DEFAULT_IMAGE_SIZE_META),
    type: "article",
    publishedTime: post.date,
    author: post.author,
    section: CATEGORY_LABEL[post.category],
  };
}

const DEFAULT_IMAGE_SIZE_META = {
  imageWidth: DEFAULT_IMAGE_SIZE.width,
  imageHeight: DEFAULT_IMAGE_SIZE.height,
};

const LOCAL_BY_SLUG = new Map(LOCAL_POSTS.map((p) => [p.slug, p]));

/** Normalise: drop the query, the hash and any trailing slash. A shared link
    routinely carries "?fbclid=…" and must not miss the map because of it. */
export function normalisePath(pathname: string): string {
  const path = pathname.split("?")[0].split("#")[0].replace(/\/+$/, "") || "/";
  return PATH_ALIASES[path] ?? path;
}

/** The slug a /blog/:slug path is asking for, or null. `/blog/submit` is a
    route, not a post, and resolving it as one would invent a card for it. */
export function blogSlug(pathname: string): string | null {
  const path = normalisePath(pathname);
  if (!path.startsWith("/blog/")) return null;
  const slug = path.slice("/blog/".length);
  if (!slug || slug.includes("/") || PAGE_META[path]) return null;
  return decodeURIComponent(slug);
}

/**
 * The preview for one path. Total function — every input yields a card, and an
 * unknown route yields the site-level one rather than an invented tag.
 *
 * `post` is the escape hatch for a post that is NOT in LOCAL_POSTS: rows in the
 * posts table (a community submission, a synced social post) only exist at
 * runtime, so middleware.ts fetches one and passes it in. Nothing else about
 * this function is asynchronous, and it stays pure so it can be tested.
 */
export function metaForPath(pathname: string, post?: Post | null): RouteMeta {
  const path = normalisePath(pathname);

  const slug = blogSlug(path);
  if (slug) {
    const found = LOCAL_BY_SLUG.get(slug) ?? post ?? null;
    if (found) return metaForPost(found);
    // A slug we cannot resolve is a 404 in the app. Give it the blog card and
    // keep it out of search rather than inventing a title from the URL.
    return { ...DEFAULT_META, ...pageCard("/blog"), noindex: true };
  }

  const page = PAGE_META[path];
  if (page) return pageCard(path);

  return DEFAULT_META;
}

function pageCard(path: string): RouteMeta {
  const page = PAGE_META[path] ?? { title: DEFAULT_META.title, description: DEFAULT_META.description };
  return {
    title: brand(page.title),
    description: page.description,
    image: DEFAULT_IMAGE,
    ...DEFAULT_IMAGE_SIZE_META,
    type: "website",
    ...(page.noindex ? { noindex: true } : {}),
  };
}

/** Minimal HTML escape for text going into an attribute. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * The document a crawler gets. Deliberately tiny — tags, a title, and an
 * immediate bounce to the real page.
 *
 * The bounce matters: user-agent detection is a heuristic and WILL misfire
 * eventually. When it does, a human must not be stranded on a stub. The script
 * replaces the location before anything paints, and the <noscript>-less <a> is
 * there for the case where even that fails. Nobody should ever see this page.
 */
export function ogDocument(pathname: string, meta: RouteMeta = metaForPath(pathname)): string {
  const url = `${SITE}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
  const t = esc(meta.title);
  const d = esc(meta.description);
  const u = esc(url);
  const img = esc(meta.image);
  const article =
    meta.type === "article"
      ? [
          meta.publishedTime ? `<meta property="article:published_time" content="${esc(meta.publishedTime)}">` : "",
          meta.author ? `<meta property="article:author" content="${esc(meta.author)}">` : "",
          meta.section ? `<meta property="article:section" content="${esc(meta.section)}">` : "",
        ]
          .filter(Boolean)
          .join("\n")
      : "";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${t}</title>
<meta name="description" content="${d}">
${meta.noindex ? '<meta name="robots" content="noindex">\n' : ""}<link rel="canonical" href="${u}">
<meta property="og:type" content="${meta.type}">
<meta property="og:site_name" content="Kosh">
<meta property="og:url" content="${u}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">
${meta.imageWidth && meta.imageHeight ? `<meta property="og:image:width" content="${meta.imageWidth}">\n<meta property="og:image:height" content="${meta.imageHeight}">\n` : ""}<meta property="og:locale" content="en_US">
${article}${article ? "\n" : ""}<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
<script>location.replace(${JSON.stringify(url)});</script>
</head>
<body><a href="${u}">${t}</a></body>
</html>`;
}

// ── Crawler detection ───────────────────────────────────────────────────────
// Only the unfurlers, and only ones that genuinely do not run JavaScript.
// Googlebot is NOT here on purpose: it renders the SPA and indexes the real
// page, so handing it a stub would make every route look like a redirect shell
// and cost more than the tags are worth.
//
// KEEP IDENTICAL TO app.koshbd.com's src/lib/ogMeta.ts. ogMeta.test.ts asserts
// it, in both repos — a link that unfurls on one Kosh domain and not the other
// is the kind of bug nobody reports, they just stop sharing.
export const CRAWLERS =
  /facebookexternalhit|facebookcatalog|WhatsApp|Twitterbot|Slackbot|LinkedInBot|TelegramBot|Discordbot|Pinterest|redditbot|SkypeUriPreview|vkShare|W3C_Validator|Applebot|embedly|quora link preview|outbrain|nuzzel|bitlybot|XING-contenttabreceiver|Google-InspectionTool|Iframely|viber|Line-ApacheHttpClient/i;

export function isCrawler(userAgent: string | null | undefined): boolean {
  return Boolean(userAgent) && CRAWLERS.test(userAgent as string);
}
