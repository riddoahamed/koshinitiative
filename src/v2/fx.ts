/* Scroll reveals + count-ups.
   Deliberately not IntersectionObserver: IO rootMargin is ignored in
   cross-origin embeds and never fires for elements jumped past by
   instant scrolls. A cheap rAF-throttled position check is deterministic
   everywhere and stops listening once everything has revealed.

   Variants: data-reveal="" (up, default) | "left" | "right" | "scale" | "fade"
   Cascades: put data-stagger (optionally ="120") on a parent — its direct
   [data-reveal] children get incremental --d delays automatically. */
export function initFx(): () => void {
  /* ?still=1 renders everything final-state with no motion (QA + captures) */
  const still = new URLSearchParams(window.location.search).has("still");
  if (still) document.documentElement.classList.add("kosh-still");
  const reduced =
    still || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* auto-stagger groups. Re-runnable, because content that mounts later needs
     its delays assigned too — the `--d` guard makes it idempotent. */
  const applyStagger = () => {
    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      const step = parseInt(group.dataset.stagger || "", 10) || 90;
      group
        .querySelectorAll<HTMLElement>(":scope > [data-reveal], :scope > * > [data-reveal]")
        .forEach((el, i) => {
          if (!el.style.getPropertyValue("--d")) {
            el.style.setProperty("--d", `${i * step}ms`);
          }
        });
    });
  };
  applyStagger();

  const pending = new Set<HTMLElement>(
    Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
  );
  const counts = new Set<HTMLElement>(
    Array.from(document.querySelectorAll<HTMLElement>("[data-count]"))
  );

  const runCount = (el: HTMLElement) => {
    /* Marked so the MutationObserver below cannot re-queue an element that has
       already animated — without this, any later DOM change would restart every
       count-up on the page. */
    el.dataset.counted = "1";
    const target = parseFloat(el.dataset.count || "0");
    if (reduced) {
      el.textContent = String(target);
      return;
    }
    const t0 = performance.now();
    const dur = 1600;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = String(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (reduced) {
    pending.forEach((el) => el.classList.add("in"));
    counts.forEach(runCount);
    return () => undefined;
  }

  /* continuous rAF loop (not scroll events — some embeds never fire them),
     self-terminating once everything has revealed */
  let alive = true;
  let lastY = -1;
  let lastH = -1;
  let lastVH = -1;
  const loop = () => {
    if (!alive) return;
    /* Gating the reveal pass on scrollY alone meant anything that entered the
       viewport WITHOUT a scroll stayed at opacity 0 forever: a lazy image
       settling, an accordion opening above, a phone rotating, the mobile
       address bar collapsing. All of those change what is on screen while
       scrollY sits still, and the reader is left looking at a blank gap with
       no way to fix it short of scrolling away and back. Watching document
       height and viewport height too costs two reads a frame on a loop that
       already terminates once everything has revealed. */
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight;
    const winH = window.innerHeight;
    if (y !== lastY || docH !== lastH || winH !== lastVH) {
      lastY = y;
      lastH = docH;
      lastVH = winH;
      const vh = winH;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.92) {
          el.classList.add("in");
          pending.delete(el);
        }
      });
      counts.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.9) {
          counts.delete(el);
          runCount(el);
        }
      });
    }
    if (pending.size || counts.size) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* Anything rendered AFTER this ran — a fetch resolving, a route's data
     arriving — was never in `pending` and could therefore never reveal. It sat
     at opacity 0 permanently, which on /investkorsi meant the entire wall of
     reports was invisible: the heading rendered, the cards did not.

     The rAF loop also self-terminates once `pending` empties, so a rescan on
     its own is not enough; the loop has to be restarted when new work appears.
     Both are handled here. Reduced-motion returns before this point, so the
     observer only exists where there is animation to drive. */
  const observer = new MutationObserver(() => {
    let added = false;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (!el.classList.contains("in") && !pending.has(el)) {
        pending.add(el);
        added = true;
      }
    });
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      if (!el.dataset.counted && !counts.has(el)) counts.add(el);
    });
    if (!added && !counts.size) return;
    applyStagger();
    lastY = -1; // force the next frame to run the reveal pass
    requestAnimationFrame(loop);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return () => {
    alive = false;
    observer.disconnect();
  };
}
