// ── Regenerate public/sitemap.xml ────────────────────────────────────────────
//
// The sitemap was written by hand next to a post list that is data. It rotted
// exactly the way that always goes: two guides published on 28 August were not
// in it, /investkorsi and /feedback had never been added, every lastmod still
// said 2026-08-18, and it listed /vote — a page that sends robots:noindex, so
// the sitemap was asking Google to index a page the page itself refuses.
//
// So it is generated now, from the two lists that already decide what this site
// is: PAGE_META for the routes and LOCAL_POSTS for the articles. `noindex` is
// honoured, so a page can never again be advertised and refused at once.
//
//   npm run sitemap
//
// SCOPE: local posts only. Rows in the `posts` table (a community submission, a
// synced social post) are runtime data and cannot be baked into a static file
// without going stale the moment one is approved — which is the bug this
// script exists to end, not repeat. If DB posts ever need to be in here it
// should become a rendered route, not a longer snapshot.
//
// Uses Vite's own SSR loader so TypeScript and the "@/" alias resolve exactly
// as they do in the app — no second module resolver to keep in step.
import { createServer } from "vite";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.koshbd.com";

const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: "custom" });
const { PAGE_META } = await server.ssrLoadModule("/src/v2/pageMeta.ts");
const { LOCAL_POSTS } = await server.ssrLoadModule("/src/v2/posts.ts");
await server.close();

// How often each route genuinely changes, and how much it matters. Both are
// hints Google mostly ignores, but a wrong one is still a wrong claim.
const ROUTE_HINTS = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/start": { changefreq: "monthly", priority: "0.9" },
  "/learn": { changefreq: "monthly", priority: "0.9" },
  "/quiz": { changefreq: "monthly", priority: "0.9" },
  "/blog": { changefreq: "weekly", priority: "0.8" },
  "/investkorsi": { changefreq: "weekly", priority: "0.8" },
  "/feedback": { changefreq: "monthly", priority: "0.5" },
  "/blog/submit": { changefreq: "yearly", priority: "0.4" },
};
const POST_HINTS = { changefreq: "yearly", priority: "0.7" };

const today = new Date().toISOString().slice(0, 10);

const entries = [];

for (const [path, meta] of Object.entries(PAGE_META)) {
  // A page that tells crawlers not to index it must not be advertised here.
  if (meta.noindex) continue;
  const hint = ROUTE_HINTS[path] ?? { changefreq: "monthly", priority: "0.6" };
  entries.push({ loc: `${SITE}${path === "/" ? "/" : path}`, lastmod: today, ...hint });
}

for (const post of LOCAL_POSTS) {
  entries.push({
    loc: `${SITE}/blog/${post.slug}`,
    // The article's own date, not today's — lastmod is a claim about the
    // content, and stamping every post with the build date is how a sitemap
    // stops carrying information.
    lastmod: String(post.date).slice(0, 10),
    ...POST_HINTS,
  });
}

// Newest first among posts, routes before posts — a stable order so a
// regeneration with no content change produces no diff.
entries.sort((a, b) => {
  const aPost = a.loc.includes("/blog/") && !a.loc.endsWith("/blog");
  const bPost = b.loc.includes("/blog/") && !b.loc.endsWith("/blog");
  if (aPost !== bPost) return aPost ? 1 : -1;
  if (aPost) return a.lastmod < b.lastmod ? 1 : a.lastmod > b.lastmod ? -1 : a.loc.localeCompare(b.loc);
  return Number(b.priority) - Number(a.priority) || a.loc.localeCompare(b.loc);
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- GENERATED FILE - do not edit by hand. Run \`npm run sitemap\`. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(join(ROOT, "public/sitemap.xml"), xml);
console.log(`wrote public/sitemap.xml — ${entries.length} urls (${LOCAL_POSTS.length} posts)`);
