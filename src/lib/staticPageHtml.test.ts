import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { staticPageHtml } from "./staticPageHtml";
import { metaForPath } from "../v2/ogMeta";

const template = readFileSync(join(__dirname, "../../index.html"), "utf8");
describe("initial page metadata", () => {
  it.each(["/", "/bd", "/global", "/learn", "/blog", "/bd/fdr-rates", "/bd/bn/fdr-rates"])("matches the requested page %s before JavaScript runs", path => {
    const html = staticPageHtml(template, path, metaForPath(path));
    expect(html).toContain(`rel="canonical" href="https://koshfinance.com${path}"`);
    expect(html).toContain(metaForPath(path).title.replace(/&/g, "&amp;"));
    expect(html).toContain('src="/src/main.tsx"');
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    if (path === "/bd/bn/fdr-rates") expect(html).toContain('<html lang="bn"');
  });
  it("does not advertise country home alternates on articles", () => {
    const html = staticPageHtml(template, "/blog/example", metaForPath("/blog/example"));
    expect(html).not.toContain('hreflang="en-BD"');
    expect(html).toContain('name="robots" content="noindex, follow"');
  });
});
