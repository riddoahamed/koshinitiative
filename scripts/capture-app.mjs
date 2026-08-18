/**
 * Re-capture the app screenshots used on the landing page.
 *
 *   npm run shots
 *
 * Drives app.koshbd.com in guest mode (no login, no real user data), dismisses
 * the onboarding coach-marks so screens aren't dimmed, and writes webp into
 * public/img/app/. Re-run whenever the app's UI moves on — stale product
 * screenshots are worse than none.
 *
 * Needs `cwebp` and macOS `sips`:  brew install webp
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OUT = "public/img/app";
const APP = "https://app.koshbd.com";
const tmp = mkdtempSync(join(tmpdir(), "kosh-shots-"));

async function prep(page) {
  for (let i = 0; i < 8; i++) {
    const skip = page.locator("text=/^(Skip|Got it|Next|Done|Close)$/").first();
    if ((await skip.count()) && (await skip.isVisible().catch(() => false))) {
      await skip.click().catch(() => {});
      await page.waitForTimeout(450);
    } else break;
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(300);
}

const webp = (src, out, { height, width, q = 82 } = {}) => {
  const staged = join(tmp, "staged.png");
  execFileSync("cp", [src, staged]);
  if (height) execFileSync("sips", ["-Z", String(height), staged, "--out", staged], { stdio: "ignore" });
  if (width) execFileSync("sips", ["--resampleWidth", String(width), staged, "--out", staged], { stdio: "ignore" });
  execFileSync("cwebp", ["-q", String(q), "-m", "6", "-quiet", staged, "-o", out]);
  console.log("wrote", out);
};

const browser = await chromium.launch({ channel: "chrome" });
try {
  // ───────────────────────── phones ─────────────────────────
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await p.goto(APP, { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(2000);
  await p.locator("text=Yes, explore as guest").first().click();
  await p.waitForTimeout(4500);
  await prep(p);

  const shot = async (name, { height = 1688 } = {}) => {
    const raw = join(tmp, `${name}.png`);
    await p.screenshot({ path: raw });
    webp(raw, `${OUT}/${name}.webp`, { height });
  };

  // a listed company, explained
  await p.goto(`${APP}/markets/dse/GP`, { waitUntil: "networkidle" });
  await p.waitForTimeout(4200); await prep(p);
  await shot("stock");

  // a mutual fund
  await p.goto(`${APP}/markets/fund/edge-bangladesh-mutual-fund`, { waitUntil: "networkidle" });
  await p.waitForTimeout(4200); await prep(p);
  await shot("fund");

  // gold, at the local rate
  await p.goto(`${APP}/invest`, { waitUntil: "networkidle" });
  await p.waitForTimeout(4000); await prep(p);
  await p.locator("text=Gold").first().click().catch(() => {});
  await p.waitForTimeout(3500); await prep(p);
  await shot("gold");

  // practise + learn, from the tab bar
  for (const [name, tab] of [["practise", "Practise"], ["learn", "Learn"]]) {
    await p.locator(`text=${tab}`).last().click({ timeout: 9000 }).catch(() => {});
    await p.waitForTimeout(3800); await prep(p);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(700); await prep(p);
    await shot(name);
  }

  // The Discover feed, full length, so the landing page can scroll it inside a
  // phone frame instead of shipping a GIF. Filtered to DSE stocks so the first
  // card is always a recognisable company rather than whatever the personalised
  // feed happened to serve.
  await p.goto(`${APP}/invest`, { waitUntil: "networkidle" });
  await p.waitForTimeout(4000); await prep(p);
  await p.locator("text=DSE stocks").first().click().catch(() => {});
  await p.waitForTimeout(4000); await prep(p);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(1200);
  const tall = join(tmp, "feed.png");
  await p.screenshot({ path: tall, fullPage: true, clip: { x: 0, y: 0, width: 390, height: 2100 } });
  webp(tall, `${OUT}/feed.webp`, { height: 4200, q: 80 });

  // ───────────────────────── desktop ─────────────────────────
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await d.goto(APP, { waitUntil: "networkidle", timeout: 45000 });
  await d.waitForTimeout(2000);
  await d.locator("text=Yes, explore as guest").first().click().catch(() => {});
  await d.waitForTimeout(4500);

  await d.goto(`${APP}/markets/dse/GP`, { waitUntil: "networkidle" });
  await d.waitForTimeout(4200); await prep(d);
  const deskStock = join(tmp, "stock-desktop.png");
  await d.screenshot({ path: deskStock });
  webp(deskStock, `${OUT}/stock-desktop.webp`, { width: 1760, q: 84 });
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
