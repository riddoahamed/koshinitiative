import { createServer } from "vite";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const server = await createServer({ root, server: { middlewareMode: true }, appType: "custom" });
try {
  const { PAGE_META } = await server.ssrLoadModule("/src/v2/pageMeta.ts");
  const { LOCAL_POSTS } = await server.ssrLoadModule("/src/v2/posts.ts");
  const { BANKS } = await server.ssrLoadModule("/src/v2/fdr/banks.ts");
  const { slugFor } = await server.ssrLoadModule("/src/v2/fdr/seo.ts");
  const { metaForPath } = await server.ssrLoadModule("/src/v2/ogMeta.ts");
  const { staticPageHtml } = await server.ssrLoadModule("/src/lib/staticPageHtml.ts");
  const paths = new Set([
    ...Object.keys(PAGE_META).filter(path => !path.startsWith("/bd/tv")),
    ...LOCAL_POSTS.map(post => `/blog/${post.slug}`),
    ...BANKS.map(bank => `/bd/fdr-rates/${slugFor(bank)}`),
  ]);
  const template = await readFile(join(root, "dist/index.html"), "utf8");
  for (const path of paths) {
    const file = join(root, "dist", path === "/" ? "index.html" : `${path.slice(1)}.html`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, staticPageHtml(template, path, metaForPath(path)));
  }
  console.log(`Wrote initial HTML metadata for ${paths.size} pages.`);
} finally { await server.close(); }
