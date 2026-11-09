import { describe, expect, it } from "vitest";
import { migrationRedirect } from "./domainMigration";

describe("domain cutover", () => {
  it.each(["koshbd.com", "www.koshbd.com"])("moves %s directly to the new country home", host => {
    expect(migrationRedirect(`https://${host}/?utm_source=poster`)).toBe("https://koshfinance.com/bd?utm_source=poster");
    expect(migrationRedirect(`https://${host}/fdr-rates/brac?tenure=12`)).toBe("https://koshfinance.com/bd/fdr-rates/brac?tenure=12");
    expect(migrationRedirect(`https://${host}/blog/first-1000`)).toBe("https://koshfinance.com/blog/first-1000");
    expect(migrationRedirect(`https://${host}/img/poster-v1.webp`)).toBe("https://koshfinance.com/img/poster-v1.webp");
  });
  it("does not loop or duplicate country paths", () => {
    expect(migrationRedirect("https://koshfinance.com/bd/vote")).toBeNull();
    expect(migrationRedirect("https://koshfinance.com/global")).toBeNull();
    expect(migrationRedirect("https://koshfinance.com/")).toBeNull();
    expect(migrationRedirect("https://koshbd.com/bd/vote")).toBe("https://koshfinance.com/bd/vote");
  });
  it("canonicalises www and old country links on the new domain", () => {
    expect(migrationRedirect("https://www.koshfinance.com/fdr-rates")).toBe("https://koshfinance.com/bd/fdr-rates");
    expect(migrationRedirect("https://koshfinance.com/bd/learn")).toBe("https://koshfinance.com/learn");
  });
});
