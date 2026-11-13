export const PRIMARY_ORIGIN = "https://koshfinance.com";
const LEGACY_HOSTS = new Set(["koshbd.com", "www.koshbd.com"]);
const COUNTRY_ROUTES = /^\/(start|vote|live|offerings|investkorsi|quiz|investor-type|for-organizations|for-schools|fdr-rates|fdr|bank-rates|bn|feedback|rsvp|tv)(\/|$)/;

/** Preserve the URL query; fragments are retained by the browser across redirects. */
export function migrationRedirect(input: string): string | null {
  const url = new URL(input);
  const old = LEGACY_HOSTS.has(url.hostname);
  let path = url.pathname;
  if (old) {
    // Shared library and static files retain their root paths. Existing public
    // assets must remain usable by old articles, emails and printed QR links.
    if (path === "/") path = "/bd";
    else if (/^\/bd\/(blog|learn)(\/|$)/.test(path)) path = path.slice(3);
    else if (!/^\/(blog|learn)(\/|$)/.test(path) && !/\.[a-zA-Z0-9]+$/.test(path) && !path.startsWith("/bd/") && path !== "/bd") path = `/bd${path}`;
    return `${PRIMARY_ORIGIN}${path}${url.search}`;
  }
  if (/^\/bd\/(blog|learn)(\/|$)/.test(path)) path = path.slice(3);
  else if (COUNTRY_ROUTES.test(path)) path = `/bd${path}`;
  if (url.hostname === "www.koshfinance.com" || path !== url.pathname) return `${PRIMARY_ORIGIN}${path}${url.search}`;
  return null;
}
