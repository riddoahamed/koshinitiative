// ── Vercel Edge Middleware — crawler-only OG tags ────────────────────────────
//
// vercel.json rewrites every dot-less path to /index.html, which is correct for
// the SPA and fatal for link previews: every blog post unfurled as the same
// site-level card. This intercepts the handful of user agents that cannot run
// JavaScript and hands them a document with the right tags instead.
//
// EVERYTHING ELSE FALLS THROUGH UNTOUCHED. A real reader, Googlebot, an asset
// request — all get the normal rewrite and the normal site. The only behaviour
// change is for a request whose UA says it is an unfurler, and even that
// response bounces to the real URL on the first line of script it runs.
//
// Kept thin on purpose: the logic and the copy live in src/v2/ogMeta.ts and
// src/v2/pageMeta.ts, where they are unit-tested and shared with the pages
// themselves. This file is the platform binding plus the one thing that cannot
// be pure — reading a post that only exists in the database.
//
// Mirrors app.koshbd.com's middleware.ts. See the note in ogMeta.ts for why the
// two are separate implementations of one shared contract.

import { ogDocument, isCrawler, metaForPath, blogSlug } from "./src/v2/ogMeta";
import type { Post } from "./src/v2/posts";

// The edge runtime exposes the project's environment variables on `process`,
// but this project has no @types/node (nothing else here is server code) and
// pulling it in just to read two strings would widen the app's global types.
// One local declaration is the smaller change, and it keeps this file inside
// the typechecker — see the tsconfig note: `middleware.ts` was outside
// `include` in BOTH repos, which made the edge binding the one file whose
// mistakes could only ever be found in production.
declare const process: { env: Record<string, string | undefined> };

export const config = {
  // Skip assets and anything with an extension. The negative lookahead keeps
  // this off the hot path for every .js, .css, image and font — the middleware
  // should run on document requests only.
  matcher: ["/((?!api/|assets/|_vercel|.*\\.[a-zA-Z0-9]+$).*)"],
};

// ── Posts that are not in the bundle ────────────────────────────────────────
//
// LOCAL_POSTS ships with the site, so those resolve synchronously and for free.
// Rows in the `posts` table do not: a community submission approved from the
// ops desk, or a synced social post, exists only at runtime. Those are exactly
// the posts whose authors most deserve a real preview — somebody spent an
// evening writing one — so it is worth one fetch to get their title onto the
// card instead of ours.
//
// THIS IS BEST-EFFORT AND MUST STAY THAT WAY. No env vars at the edge, a slow
// database, a 404 because the table does not exist yet: every one of those
// falls through to the blog card. A link preview is never worth failing a
// request over, and a crawler that waits is a crawler that gives up.
//
// Explicit columns, never `select=*`: this response is built for anyone who
// asks, so it should carry the fields the card needs and nothing else.
const COLUMNS = "slug,title,dek,category,published_at,cover_url,author_name,source";
const TIMEOUT_MS = 1500;

async function postFromDb(slug: string): Promise<Post | null> {
  const base = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!base || !key) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `${base}/rest/v1/posts?select=${COLUMNS}` +
        `&status=eq.published&slug=eq.${encodeURIComponent(slug)}&limit=1`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: ctrl.signal }
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<Record<string, string | null>>;
    const r = rows?.[0];
    if (!r?.title || !r?.slug) return null;

    // Only the fields the card reads. A Post has more, and inventing the rest
    // here would mean two definitions of what a post is.
    return {
      slug: r.slug,
      title: r.title,
      dek: r.dek ?? "",
      body: [],
      date: r.published_at ?? new Date().toISOString(),
      category: (r.category as Post["category"]) ?? "article",
      tags: [],
      source: (r.source as Post["source"]) ?? "kosh",
      cover: r.cover_url ?? undefined,
      author: r.author_name ?? undefined,
      readMins: 1,
    };
  } catch {
    return null; // aborted, offline, malformed — the blog card is fine
  } finally {
    clearTimeout(timer);
  }
}

export default async function middleware(request: Request): Promise<Response | undefined> {
  const ua = request.headers.get("user-agent");
  if (!isCrawler(ua)) return undefined; // fall through to the SPA rewrite

  const { pathname } = new URL(request.url);

  // A blog slug that isn't in the bundle is the only case worth a round trip.
  // metaForPath resolves local posts itself, so this never runs for those.
  const slug = blogSlug(pathname);
  const dbPost = slug ? await postFromDb(slug) : null;

  return new Response(ogDocument(pathname, metaForPath(pathname, dbPost)), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Previews are re-fetched constantly once a link starts spreading, and
      // the tags only change when we deploy or approve a post. Let the edge
      // keep them — this is also what keeps the database fetch to roughly once
      // per post per day.
      "cache-control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
      // The response body differs by UA, so anything in front of us must key
      // its cache on that or it will serve the stub to a human.
      vary: "user-agent",
    },
  });
}
