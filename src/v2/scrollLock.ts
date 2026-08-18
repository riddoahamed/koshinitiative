/* ── Locking the page behind an overlay ───────────────────────────────────────
   `body { overflow: hidden }` alone does not hold this site still. Two reasons:

     1. the scrolling element is <html>, not <body>, so the rule has to go on
        documentElement too;
     2. the homepage runs Lenis, which drives scrolling programmatically on its
        own rAF loop and happily keeps going regardless of overflow.

   So we do both: pin the document, and shout so Lenis stops. Index.tsx listens
   for the event — the nav can't reach the Lenis instance directly.           */

export const SCROLL_LOCK_EVENT = "kosh:scrolllock";

let depth = 0;
let prevHtml = "";
let prevBody = "";

export const setScrollLock = (locked: boolean) => {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  const body = document.body;

  if (locked) {
    if (depth++ === 0) {
      prevHtml = html.style.overflow;
      prevBody = body.style.overflow;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }
  } else {
    depth = Math.max(0, depth - 1);
    if (depth === 0) {
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    }
  }

  window.dispatchEvent(
    new CustomEvent(SCROLL_LOCK_EVENT, { detail: { locked: depth > 0 } })
  );
};
