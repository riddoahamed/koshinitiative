/* Scroll reveals + count-ups.
   Deliberately not IntersectionObserver: IO rootMargin is ignored in
   cross-origin embeds and never fires for elements jumped past by
   instant scrolls. A cheap rAF-throttled position check is deterministic
   everywhere and stops listening once everything has revealed. */
export function initFx(): () => void {
  /* ?still=1 renders everything final-state with no motion (QA + captures) */
  const still = new URLSearchParams(window.location.search).has("still");
  if (still) document.documentElement.classList.add("kosh-still");
  const reduced =
    still || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    const dur = 1500;
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
  const loop = () => {
    if (!alive) return;
    if (window.scrollY !== lastY) {
      lastY = window.scrollY;
      const vh = window.innerHeight;
      pending.forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.94) {
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
