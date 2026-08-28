const SITE_URL = "https://www.koshbd.com";
const DEFAULT_TITLE = "Kosh — AI-powered investment discovery & trust platform | Bangladesh";
const DEFAULT_DESCRIPTION =
  "Kosh is an AI-powered investment discovery and trust platform — a better way to learn, understand, and take action with money. Verified data, explainable AI, scam detection, paper investing and Shariah screening. Starting in Bangladesh.";

type SeoInput = {
  title?: string;
  description?: string;
  /** Site-relative or absolute. og:image must end up absolute — a relative one
      is silently ignored by every scraper, which is the quietest possible way
      to ship a broken card. */
  image?: string;
  path?: string;
  robots?: string;
};

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const absolute = (src?: string) => {
  const s = (src ?? "").trim();
  if (!s) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(s)) return s;
  return `${SITE_URL}${s.startsWith("/") ? s : `/${s}`}`;
};

export const applySeo = ({ title, description, image, path = "/", robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }: SeoInput = {}) => {
  const nextTitle = title ? `${title} | Kosh` : DEFAULT_TITLE;
  const nextDescription = description || DEFAULT_DESCRIPTION;
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  const canonical = `${SITE_URL}${canonicalPath}`;

  document.title = nextTitle;
  setMeta('meta[name="description"]', "content", nextDescription);
  setMeta('link[rel="canonical"]', "href", canonical);
  setMeta('meta[property="og:title"]', "content", nextTitle);
  setMeta('meta[property="og:description"]', "content", nextDescription);
  setMeta('meta[property="og:url"]', "content", canonical);
  setMeta('meta[name="twitter:title"]', "content", nextTitle);
  setMeta('meta[name="twitter:description"]', "content", nextDescription);
  // Kept in step with the edge middleware, which sets the same value for the
  // unfurlers that never run this code.
  setMeta('meta[property="og:image"]', "content", absolute(image));
  setMeta('meta[name="twitter:image"]', "content", absolute(image));
  setMeta('meta[name="robots"]', "content", robots);
};

export const resetSeo = () => {
  applySeo();
};
