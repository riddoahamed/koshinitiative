const SITE_URL = "https://www.koshbd.com";
const DEFAULT_TITLE = "Kosh | Financial Literacy App & Workshops in Bangladesh";
const DEFAULT_DESCRIPTION =
  "Kosh is a Bangladesh-focused financial literacy initiative and app helping students, young professionals, and communities learn, save, invest, and grow with confidence.";

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
};

const setMeta = (selector: string, attr: "content" | "href", value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

export const applySeo = ({ title, description, path = "/" }: SeoInput = {}) => {
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
};

export const resetSeo = () => {
  applySeo();
};
