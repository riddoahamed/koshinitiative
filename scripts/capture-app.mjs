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
  // ── phones ────────────────────────────────────────────────────────────────
  // Two sizes on purpose. 844 tall = one screen, used for stills. 1800 tall
  // renders a long page in full without the app's lazy sections going blank,
  // which is what a `fullPage` shot gives you instead. Those tall ones become
  // the scrolling reels on the landing page.
  const openGuest = async (page) => {
    await page.goto(APP, { waitUntil: "networkidle", timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.locator("text=Yes, explore as guest").first().click().catch(() => {});
    await page.waitForTimeout(4500);
    await prep(page);
  };

  const still = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await openGuest(still);

  // gold: "See the full story" opens a single full-screen story, not a scroll
  await still.goto(`${APP}/invest`, { waitUntil: "networkidle" });
  await still.waitForTimeout(4000); await prep(still);
  await still.locator("text=Gold").first().click().catch(() => {});
  await still.waitForTimeout(3500); await prep(still);
  await still.locator("text=See the full story").first().click().catch(() => {});
  await still.waitForTimeout(4500); await prep(still);
  let raw = join(tmp, "gold.png");
  await still.screenshot({ path: raw });
  webp(raw, `${OUT}/gold.webp`, { height: 1688 });

  for (const [name, tab] of [["practise", "Practise"], ["learn", "Learn"]]) {
    await still.goto(`${APP}/dashboard`, { waitUntil: "networkidle" });
    await still.waitForTimeout(2500); await prep(still);
    await still.locator(`text=${tab}`).last().click({ timeout: 9000 }).catch(() => {});
    await still.waitForTimeout(3800); await prep(still);
    await still.evaluate(() => window.scrollTo(0, 0));
    await still.waitForTimeout(700); await prep(still);
    raw = join(tmp, `${name}.png`);
    await still.screenshot({ path: raw });
    webp(raw, `${OUT}/${name}.webp`, { height: 1688 });
  }

  // ── tall reels ────────────────────────────────────────────────────────────
  const tall = await browser.newPage({ viewport: { width: 390, height: 1800 }, deviceScaleFactor: 2 });
  await openGuest(tall);

  const reel = async (name, go) => {
    await go();
    await tall.evaluate(() => window.scrollTo(0, 0));
    await tall.waitForTimeout(1200);
    const r = join(tmp, `${name}.png`);
    await tall.screenshot({ path: r });
    webp(r, `${OUT}/${name}.webp`, { height: 3600, q: 80 });
  };

  await reel("feed", async () => {
    await tall.goto(`${APP}/invest`, { waitUntil: "networkidle" });
    await tall.waitForTimeout(4000); await prep(tall);
    await tall.locator("text=DSE stocks").first().click().catch(() => {});
    await tall.waitForTimeout(4000); await prep(tall);
  });
  await reel("stock", async () => {
    await tall.goto(`${APP}/markets/dse/GP`, { waitUntil: "networkidle" });
    await tall.waitForTimeout(4500); await prep(tall);
  });
  await reel("fund", async () => {
    await tall.goto(`${APP}/markets/fund/edge-bangladesh-mutual-fund`, { waitUntil: "networkidle" });
    await tall.waitForTimeout(4500); await prep(tall);
  });

  // ── desktop ───────────────────────────────────────────────────────────────
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await openGuest(d);
  await d.goto(`${APP}/markets/dse/GP`, { waitUntil: "networkidle" });
  await d.waitForTimeout(4500); await prep(d);
  const deskStock = join(tmp, "stock-desktop.png");
  await d.screenshot({ path: deskStock });
  webp(deskStock, `${OUT}/stock-desktop.webp`, { width: 1760, q: 84 });
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
