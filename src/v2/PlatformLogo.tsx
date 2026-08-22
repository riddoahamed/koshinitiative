import { useState } from "react";

/* ---------------- A company's own mark, at thumbnail size ----------------

   The wall listed thirty-odd real companies as text, and a directory whose
   entire job is "recognise the one you put money into" was making the reader
   parse names. A logo does that in a glance; a name does not.

   ── WHY THIS IS NOT THE APP'S LOGO CHAIN ─────────────────────────────────
   The app (src/lib/brandLogo.ts) walks a curated local file first, because it
   renders marks at 46–56px where a 32px favicon looks like a hole. Those files
   live in the app's /public and are mapped by DOMAIN, not by slug — idlc-amc
   resolves to idlc.png, city-brokerage to citybank.png — so the mapping cannot
   be reproduced here from the row alone, and guessing it would put the wrong
   company's mark next to a name.

   At 26px none of that matters: a favicon is plenty. So this uses only the two
   PUBLIC tiers, which need no mapping and work for any domain — unavatar first
   for quality, Google's favicon service second because it answers for
   practically everything.

   A row with no domain — every Facebook group, and any platform a reader added
   without a website — gets its initial. That is honest and it is common, so it
   is styled as a real state rather than as a broken image. */

const CHAIN = (domain: string) => [
  `https://unavatar.io/${encodeURIComponent(domain)}?fallback=false&size=128`,
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`,
];

export function PlatformLogo({
  domain,
  name,
  size = 26,
}: {
  domain: string | null;
  name: string;
  size?: number;
}) {
  const chain = domain ? CHAIN(domain) : [];
  const [step, setStep] = useState(0);
  const src = chain[step];

  if (!src) {
    return (
      <span className="ikp__logo ikp__logo--letter" style={{ width: size, height: size }} aria-hidden>
        {name.replace(/^(the|a)\s+/i, "").charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="ikp__logo" style={{ width: size, height: size }}>
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setStep((s) => s + 1)}
      />
    </span>
  );
}

export default PlatformLogo;
