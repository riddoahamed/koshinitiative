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

  /* auto-stagger groups */
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

  const pending = new Set<HTMLElement>(
    Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
  );
  const counts = new Set<HTMLElement>(
    Array.from(document.querySelectorAll<HTMLElement>("[data-count]"))
  );

  const runCount = (el: HTMLElement) => {
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

  return () => {
    alive = false;
  };
}
