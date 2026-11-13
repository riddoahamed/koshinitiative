import { SITE_ORIGIN, alternateTags } from "./marketSeo";
import type { RouteMeta } from "../v2/ogMeta";

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Keep Vite's application scripts while giving every public page its own head. */
export function staticPageHtml(template: string, path: string, meta: RouteMeta): string {
  const canonical = `${SITE_ORIGIN}${path}`;
  let html = template.replace(/<html lang="[^"]*"/, `<html lang="${path.startsWith("/bd/bn/") ? "bn" : "en"}"`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  const values: Record<string, string> = {
    description: meta.description,
    robots: meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    "og:url": canonical, "og:title": meta.title, "og:description": meta.description,
    "og:image": meta.image, "og:image:secure_url": meta.image,
    "og:type": meta.type, "og:locale": path.startsWith("/bd/bn/") ? "bn_BD" : path.startsWith("/bd") ? "en_BD" : "en_US",
    "twitter:title": meta.title, "twitter:description": meta.description, "twitter:image": meta.image,
  };
  html = html.replace(/<meta\s+(name|property)="([^"]+)"\s+content="[^"]*"\s*\/?\s*>/g, (tag, kind, key) =>
    values[key] == null ? tag : `<meta ${kind}="${key}" content="${escapeHtml(values[key])}" />`);
  html = html.replace(/\s*<link rel="alternate"[^>]*hreflang[^>]*>/g, "");
  html = html.replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />\n${alternateTags(path)}`);
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (_, json) => {
    const data = JSON.parse(json);
    if (Array.isArray(data["@graph"])) {
      data["@graph"] = data["@graph"].filter((entry: Record<string, unknown>) =>
        path === "/bd" || !["FAQPage", "Service"].includes(String(entry["@type"])));
      for (const entry of data["@graph"]) if (entry["@type"] === "WebPage") {
        entry["@id"] = `${canonical}#webpage`;
        entry.url = canonical;
        entry.name = meta.title;
        entry.description = meta.description;
      }
    }
    return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
  });
  if (path !== "/bd") html = html.replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript><main><h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.description)}</p><nav><a href="/bd">Bangladesh</a> · <a href="/global">Global</a> · <a href="/learn">Lessons</a> · <a href="/blog">Library</a></nav></main></noscript>`);
  return html;
}
