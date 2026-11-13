export const SITE_ORIGIN = "https://koshfinance.com";

export function marketAlternates(path: string): Array<[string, string]> {
  if (["/", "/bd", "/global"].includes(path)) return [
    ["en-BD", "/bd"], ["en", "/global"], ["x-default", "/"],
  ];
  if (["/bd/fdr-rates", "/bd/bn/fdr-rates", "/bd/investkorsi", "/bd/bn/investkorsi"].includes(path)) {
    const en = path.replace("/bd/bn/", "/bd/");
    return [["en-BD", en], ["bn-BD", en.replace("/bd/", "/bd/bn/")], ["x-default", en]];
  }
  return [];
}

export function alternateTags(path: string): string {
  return marketAlternates(path).map(([lang, url]) => `<link rel="alternate" hreflang="${lang}" href="${SITE_ORIGIN}${url}">`).join("\n");
}
