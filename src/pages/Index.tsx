import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroMachine from "@/v2/HeroMachine";
import { Pitch, Paths, Problem, Product, Impact } from "@/v2/Sections";
import { Orgs, Vision, Founder, Join, FootV2, NavV2 } from "@/v2/Closing";
import { Funance } from "@/v2/Funance";
import { Inside } from "@/v2/Inside";
import { InvestKorsi } from "@/v2/InvestKorsi";
import { initFx } from "@/v2/fx";
import { VP_LONG } from "@/v2/copy";
import { SCROLL_LOCK_EVENT } from "@/v2/scrollLock";
import { applySeo } from "@/lib/seo";
import "@/v2/v2.css";

const Index = () => {
  useEffect(() => {
    applySeo({
      title: "From “where do I start?” to your first real investment",
      description: VP_LONG,
      path: "/",
    });

    window.history.scrollRestoration = "manual";

    /* Deep links. Two spellings, because both are in the wild: /?goto=section
       (what this page has always used) and /#section (what a normal person
       writes, what the nav menu uses, and what a "back to where I was" link
       from a sub-page produces).

       Only ?goto= was handled, so every /#section link fell through to the
       scrollTo(0,0) below and dumped the reader on the hero machine. That is
       what made Back from /investkorsi feel broken — it returned to the
       homepage and then threw away the position. */
    const params = new URLSearchParams(window.location.search);
    const goto = params.get("goto") ?? (window.location.hash ? window.location.hash.slice(1) : null);
    /* always start at the sleeping machine (no browser scroll restore) */
    if (!goto && !params.has("crt")) {
      window.scrollTo(0, 0);
    }
    if (goto) {
      window.setTimeout(
        () => document.getElementById(goto)?.scrollIntoView(),
        80
      );
    }

    const cleanup = initFx();

    /* premium inertia scroll — one flick glides sections in slowly */
    let lenis: Lenis | null = null;
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      new URLSearchParams(window.location.search).has("still");
    if (!reduced) {
      lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.9,
        smoothWheel: true,
      });
      /* start at the sleeping machine — beat any browser scroll restore */
      if (!goto) lenis.scrollTo(0, { immediate: true, force: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      /* an overlay is open — Lenis would otherwise keep scrolling the page
         underneath it, since it never consults overflow */
      const onLock = (e: Event) => {
        const { locked } = (e as CustomEvent<{ locked: boolean }>).detail;
        if (locked) lenis?.stop();
        else lenis?.start();
      };
      window.addEventListener(SCROLL_LOCK_EVENT, onLock);

      return () => {
        window.removeEventListener(SCROLL_LOCK_EVENT, onLock);
        gsap.ticker.remove(raf);
        lenis?.destroy();
        cleanup();
      };
    }

    return cleanup;
  }, []);

  return (
    <div className="v2">
      <NavV2 />
      <main>
        <HeroMachine />
        <Pitch />
        <Paths />
        <Problem />
        <Product />
        <Inside />
        <InvestKorsi />
        <Funance />
        <Impact />
        <Orgs />
        <Vision />
        <Founder />
        <Join />
      </main>
      <FootV2 />
    </div>
  );
};

export default Index;
