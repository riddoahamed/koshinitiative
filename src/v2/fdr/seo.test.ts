import { describe, it, expect } from "vitest";

import { BANKS, opensToIndividuals } from "./banks";
import { FDR_ROWS, RATES_MONTH, bandAt } from "./rates";
import { bankBySlug, bankFdrDocument, fdrCrawlerDocument, jsonLd, leadAnswer, slugFor } from "./seo";

// ── The failure these guard ─────────────────────────────────────────────────
// Measured on 12 Sep 2026, before any of this existed: GPTBot asking for
// /fdr-rates received 13,777 bytes containing the HOMEPAGE description and not
// one rate. The page was invisible to every engine that answers questions.
//
// That failure is silent and it is invisible in a browser, which is exactly
// why it lasted. These tests fail loudly instead.

const doc = fdrCrawlerDocument("/fdr-rates", "FDR rates", "Every bank in Bangladesh");

describe("what a machine gets for /fdr-rates", () => {
  it("contains actual rates, not just meta tags", () => {
    // The bug was a document with a <title> and an empty body. A rate table
    // has a <table>, and it has numbers in it.
    expect(doc).toContain("<table");
    const percentages = doc.match(/\d{1,2}\.\d{2}%/g) ?? [];
    expect(percentages.length).toBeGreaterThan(100);
  });

  it("names every bank an individual can open a deposit at", () => {
    const retail = FDR_ROWS.filter((r) => opensToIndividuals(r.bank));
    expect(retail.length).toBeGreaterThan(40);
    for (const r of retail) expect(doc, `${r.bank.name} missing`).toContain(r.bank.name);
  });

  it("says which month the rates are from, and links the source", () => {
    // A rate with no date is a rumour, and a model quoting an undated rate
    // makes us the source of the rumour.
    expect(doc).toContain(RATES_MONTH);
    expect(doc).toContain("bb.org.bd");
  });

  it("answers the question people actually type, in the first paragraph", () => {
    const lead = leadAnswer();
    expect(lead).toMatch(/highest announced/i);
    expect(lead).toMatch(/\d{1,2}\.\d{2}%/);
    expect(lead).toContain(RATES_MONTH);
    // The caveat travels WITH the number or the number is misleading on its own.
    expect(lead).toMatch(/taxed at source/);
    expect(doc).toContain(lead);
  });

  it("carries Bangla, because a lot of the searching is in Bangla", () => {
    expect(doc).toContain("এফডিআর");
  });

  it("declares the non-sponsorship a model would otherwise have to assume", () => {
    expect(doc).toMatch(/No bank pays to appear/i);
  });
});

describe("structured data", () => {
  const ld = jsonLd("/fdr-rates");
  const blocks = [...ld.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => JSON.parse(m[1]),
  );

  it("parses, every block", () => {
    expect(blocks.length).toBeGreaterThanOrEqual(4);
    for (const b of blocks) expect(b["@context"]).toBe("https://schema.org");
  });

  it("describes itself as a dataset with a date and a source", () => {
    const ds = blocks.find((b) => b["@type"] === "Dataset");
    expect(ds).toBeDefined();
    expect(ds.dateModified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(ds.isBasedOn.creator.name).toBe("Bangladesh Bank");
  });

  it("publishes the FAQ as questions with answers", () => {
    const faq = blocks.find((b) => b["@type"] === "FAQPage");
    expect(faq.mainEntity.length).toBeGreaterThan(5);
    for (const q of faq.mainEntity) expect(q.acceptedAnswer.text.length).toBeGreaterThan(40);
  });
});

describe("one page per bank", () => {
  it("gives every bank a unique, readable slug", () => {
    const slugs = BANKS.map(slugFor);
    expect(new Set(slugs).size).toBe(BANKS.length);
    // Readable means it matches the search. /fdr-rates/tblbd does not.
    expect(slugFor(BANKS.find((b) => b.code === "TRUST BANK")!)).toBe("trust-bank");
    expect(slugFor(BANKS.find((b) => b.code === "BRAC")!)).toBe("brac-bank");
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("resolves a slug back to its bank", () => {
    for (const b of BANKS) expect(bankBySlug(slugFor(b))?.code).toBe(b.code);
  });

  it("renders that bank's own rates, not the whole table", () => {
    const brac = BANKS.find((b) => b.code === "BRAC")!;
    const page = bankFdrDocument(`/fdr-rates/${slugFor(brac)}`)!;
    expect(page).toContain("BRAC Bank");
    const band = bandAt(FDR_ROWS.find((r) => r.bank.code === "BRAC")!, 2)!;
    expect(page).toContain(band.max.toFixed(2));
    expect(page).toContain("application/ld+json");
  });

  it("flags a bank that has been merged away", () => {
    const exim = BANKS.find((b) => b.code === "EXIM")!;
    const page = bankFdrDocument(`/fdr-rates/${slugFor(exim)}`)!;
    expect(page).toContain("Sammilito Islami Bank PLC");
  });

  it("returns null for the table itself and for the FAQ", () => {
    expect(bankFdrDocument("/fdr-rates")).toBeNull();
    expect(bankFdrDocument("/fdr-rates/faq")).toBeNull();
    expect(bankFdrDocument("/fdr-rates/not-a-bank")).toBeNull();
  });
});
