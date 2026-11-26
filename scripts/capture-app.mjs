/**
 * Re-capture the app screenshots used on the landing page.
 *
 *   npm run shots
 *
 * Drives app.koshfinance.com in guest mode (no login, no real user data), dismisses
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
const APP = "https://app.koshfinance.com";
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
  // The site never shows the Season 1 ৳500 reward or the ৳500 referral draw
  // (they are being retired). Hide the card that carries either, so a
  // re-capture can't bring them back onto the landing page.
  await page.evaluate(() => {
    const bad = /season\s*1|৳\s?500\s*at the end|shot at ৳\s?500|draw for ৳\s?500/i;
    for (const el of document.querySelectorAll("body *")) {
      if (!el.isConnected || el.children.length > 12) continue;
      const t = el.innerText || "";
      if (!bad.test(t) || t.length > 260) continue;
      let card = el;
      while (card.parentElement && (card.parentElement.innerText || "").length < 320) card = card.parentElement;
      card.style.display = "none";
    }
  });
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

  const stillCtx = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true,
  });
  const still = await stillCtx.newPage();
  await openGuest(still);

  // Gold: "See the full story" opens a story with slides. The fourth is the
  // one worth showing — live BAJUS price, the chart, and the week's macro read
  // — so tap through to it. Taps need touch emulation; a wheel does nothing.
  await still.goto(`${APP}/invest`, { waitUntil: "networkidle" });
  await still.waitForTimeout(4000); await prep(still);
  await still.locator("text=Gold").first().click().catch(() => {});
  await still.waitForTimeout(3500); await prep(still);
  await still.locator("text=See the full story").first().click().catch(() => {});
  await still.waitForTimeout(4000); await prep(still);
  for (let i = 0; i < 3; i++) {
    await still.touchscreen.tap(195, 500).catch(() => {});
    await still.waitForTimeout(1400);
  }
  await still.waitForTimeout(1200);
  let raw = join(tmp, "gold.png");
  await still.screenshot({ path: raw });
  webp(raw, `${OUT}/gold.webp`, { height: 1688 });

  // The quick check behind "What kind of investor am I?", and the arcade.
  // The Practise tab now opens on the arcade; the practice account lives at /portfolio.
  for (const [name, path] of [["check", "/check"], ["arcade", "/play"], ["practise", "/portfolio"]]) {
    await still.goto(`${APP}${path}`, { waitUntil: "networkidle" });
    await still.waitForTimeout(3500); await prep(still);
    raw = join(tmp, `${name}.png`);
    await still.screenshot({ path: raw });
    webp(raw, `${OUT}/${name}.webp`, { height: 1688 });
  }

  for (const [name, tab] of [["learn", "Learn"]]) {
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
  // The learning path scrolls: XP, streak, lessons and the mini-games in it.
  await reel("learn-path", async () => {
    await tall.goto(`${APP}/learn`, { waitUntil: "networkidle" });
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
