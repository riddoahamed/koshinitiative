/**
 * Re-capture the app screenshots used on the landing page.
 *
 *   node scripts/capture-app.mjs
 *
 * Shoots app.koshbd.com in guest mode (no login, no real user data), writes
 * webp into public/img/app/, and dismisses the onboarding coach-marks first so
 * the screens aren't dimmed. Re-run whenever the app's UI moves on — stale
 * screenshots are worse than none.
 *
 * Needs `cwebp` and `sips` (macOS): brew install webp
 */
import { chromium } from "playwright";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const OUT = "public/img/app";
const APP = "https://app.koshbd.com";
const tmp = mkdtempSync(join(tmpdir(), "kosh-shots-"));

/** Guest-mode onboarding tooltips dim the whole screen — clear them. */
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
  // ---- phones ----
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 });
  await p.goto(APP, { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(2000);
  await p.locator("text=Yes, explore as guest").first().click();
  await p.waitForTimeout(4500);
  await prep(p);

  for (const [file, tab] of [["home", "Home"], ["discover", "Discover"], ["practise", "Practise"], ["learn", "Learn"]]) {
    await p.locator(`text=${tab}`).last().click({ timeout: 9000 }).catch(() => {});
    await p.waitForTimeout(3800);
    await prep(p);
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(700);
    await prep(p);
    const raw = join(tmp, `${file}.png`);
    await p.screenshot({ path: raw });
    webp(raw, `${OUT}/${file}.webp`, { height: 1688 });
  }

  await p.goto(`${APP}/analyse`, { waitUntil: "networkidle", timeout: 45000 });
  await p.waitForTimeout(3500);
  await prep(p);
  const analyse = join(tmp, "analyse.png");
  await p.screenshot({ path: analyse });
  webp(analyse, `${OUT}/analyse.webp`, { height: 1688 });

  // ---- desktop ----
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  await d.goto(APP, { waitUntil: "networkidle", timeout: 45000 });
  await d.waitForTimeout(2000);
  await d.locator("text=Yes, explore as guest").first().click().catch(() => {});
  await d.waitForTimeout(4500);
  await d.goto(`${APP}/markets`, { waitUntil: "networkidle", timeout: 45000 });
  await d.waitForTimeout(3500);
  await prep(d);
  const markets = join(tmp, "markets.png");
  await d.screenshot({ path: markets });
  webp(markets, `${OUT}/markets-desktop.webp`, { width: 1760, q: 84 });
} finally {
  await browser.close();
  rmSync(tmp, { recursive: true, force: true });
}
