import { describe, expect, it } from "vitest";
import { rehostHtml, upstreamPage } from "./rehostHtml";

describe("public RSVP and TV addresses", () => {
  it("updates canonicals, event queries and app links without changing mailboxes or assets", () => {
    const html = `<link rel="canonical" href="https://www.koshbd.com/rsvp"><a href="https://koshbd.com/rsvp?event=nsu">event</a><a href="https://app.koshbd.com/auth?signup=1">app</a><a href="mailto:hello@koshbd.com">mail</a><script src="newsroom.js"></script>`;
    const result = rehostHtml(html);
    expect(result).toContain('href="https://koshfinance.com/bd/rsvp"');
    expect(result).toContain('href="https://koshfinance.com/bd/rsvp?event=nsu"');
    expect(result).toContain('href="https://app.koshfinance.com/auth?signup=1"');
    expect(result).toContain('mailto:hello@koshbd.com');
    expect(result).toContain('src="newsroom.js"');
    expect(rehostHtml('<link href="https://www.koshbd.com/tv/">')).toContain('https://koshfinance.com/bd/tv/');
  });
  it("only transforms the document routes", () => {
    expect(upstreamPage("/bd/tv/")).toBe("https://kosh-live-tv.vercel.app/tv/");
    expect(upstreamPage("/bd/rsvp")).toBe("https://kosh-rsvp.vercel.app/");
    expect(upstreamPage("/bd/tv/newsroom.js")).toBeNull();
  });
});
