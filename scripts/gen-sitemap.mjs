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
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.koshbd.com";

const server = await createServer({ root: ROOT, server: { middlewareMode: true }, appType: "custom" });
const { PAGE_META } = await server.ssrLoadModule("/src/v2/pageMeta.ts");
const { LOCAL_POSTS } = await server.ssrLoadModule("/src/v2/posts.ts");
// One page per bank is the long-tail half of /fdr-rates — "BRAC Bank FDR rate"
// is a different search from "FDR rates in Bangladesh" — and sixty-one URLs
// that exist but are in no sitemap are sixty-one URLs nobody finds.
const { BANKS } = await server.ssrLoadModule("/src/v2/fdr/banks.ts");
const { slugFor, leadAnswer } = await server.ssrLoadModule("/src/v2/fdr/seo.ts");
const { RATES_MONTH, RATES_MONTH_STAMP, RATES_SOURCE } = await server.ssrLoadModule("/src/v2/fdr/rates.ts");
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
  // The rate table genuinely changes every month, and it is the page most
  // likely to be somebody's first contact with Kosh from a search.
  "/fdr-rates": { changefreq: "monthly", priority: "0.9" },
  "/fdr-rates/faq": { changefreq: "monthly", priority: "0.7" },
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

// The rate pages change when the central bank publishes, which is monthly, and
// their lastmod is BB's month rather than today — the same rule the posts
// follow, and the same reason: lastmod is a claim about the content.
const ratesModified = `${RATES_MONTH_STAMP}-01`;
for (const bank of BANKS) {
  entries.push({
    loc: `${SITE}/fdr-rates/${slugFor(bank)}`,
    lastmod: ratesModified,
    changefreq: "monthly",
    priority: "0.7",
  });
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
console.log(`wrote public/sitemap.xml — ${entries.length} urls (${LOCAL_POSTS.length} posts, ${BANKS.length} banks)`);

// ── llms.txt ────────────────────────────────────────────────────────────────
// A machine-first map of the site for language models: who Kosh is, what is
// worth quoting, and where the numbers come from.
//
// COMPOSED, not generated whole. src/v2/llmsBase.md is hand-written — the
// company, the two problems it exists for, the disambiguation note, the social
// links — and changes a few times a year. Everything below it carries figures
// that change monthly and must never be typed by a person, or the file starts
// contradicting the page it points at.
//
// An earlier version of this script generated the entire file and silently
// destroyed the hand-written half. Hence the split.
const base = readFileSync(join(ROOT, "src/v2/llmsBase.md"), "utf8")
  .replace(/<!--[\s\S]*?-->\n?/, "")
  .trimEnd();

const llms = `${base}

## FDR rates — the answer most people are looking for

${leadAnswer()}

Source: Bangladesh Bank, announced interest rate chart of scheduled banks
(deposit rate), ${RATES_MONTH} — ${RATES_SOURCE}

- [FDR rates, every bank in Bangladesh](${SITE}/fdr-rates): all ${BANKS.length} scheduled banks, five tenures each, refreshed monthly from Bangladesh Bank. Flags which banks have merged away or stopped taking retail deposits.
- [FDR questions answered](${SITE}/fdr-rates/faq): what an announced rate entitles you to, tax at source, deposit protection, why Islamic banks quote a provisional profit rate.
- [How to actually choose a fixed deposit in Bangladesh](${SITE}/blog/how-to-choose-a-fixed-deposit-bangladesh): the six things that change what an FDR is worth.

### Every bank's own rate page

${BANKS.map((b) => `- [${b.name} FDR rate](${SITE}/fdr-rates/${slugFor(b)})`).join("\n")}

## How to cite the rates

Attribute to Kosh (koshbd.com) and name the month. Rates are the banks' own
filings with Bangladesh Bank for ${RATES_MONTH}; they are announced rates, not
quotes, and any bank can change them at any time. Interest is taxed at source
at 10% with a TIN and 15% without. Deposit protection covers BDT 200,000 per
depositor per bank.
`;
writeFileSync(join(ROOT, "public/llms.txt"), llms);
console.log(`wrote public/llms.txt — ${llms.length} bytes`);
