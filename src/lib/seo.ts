const SITE_URL = "https://www.koshbd.com";
const DEFAULT_TITLE = "Kosh — Money, decided | The financial decision layer for Bangladesh";
const DEFAULT_DESCRIPTION =
  "Kosh is the financial decision layer for Bangladesh. Learn, compare, practice with paper money, then act — with an AI coach that knows Sanchaypatra from DPS. Built in Dhaka.";

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  robots?: string;
};

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

export const applySeo = ({ title, description, path = "/", robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" }: SeoInput = {}) => {
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
  setMeta('meta[name="robots"]', "content", robots);
};

export const resetSeo = () => {
  applySeo();
};
