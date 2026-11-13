import { migrationRedirect } from "./domainMigration";

/** RSVP and TV stay on their existing services behind the public country URLs. */
export function rehostHtml(html: string): string {
  return html.replace(/https:\/\/(?:www\.)?koshbd\.com[^\s"'<>]*/g, url => migrationRedirect(url) ?? url)
    .replace(/https:\/\/app\.koshbd\.com/g, "https://app.koshfinance.com")
    .replace(/https:\/\/instagram\.com\/kosh\.initiative\b/g, "https://instagram.com/kosh.finance")
    .replace(/https:\/\/facebook\.com\/KoshInitiative\b/g, "https://www.facebook.com/profile.php?id=61582151648664")
    .replace(/>koshbd\.com</g, ">koshfinance.com<");
}

export function upstreamPage(path: string): string | null {
  if (path === "/bd/rsvp") return "https://kosh-rsvp.vercel.app/";
  if (path === "/bd/tv/") return "https://kosh-live-tv.vercel.app/tv/";
  return null;
}
