import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroMachine from "@/v2/HeroMachine";
import { Pitch, Paths, Problem, Product, Impact } from "@/v2/Sections";
import { Orgs, Vision, Founder, Join, FootV2, NavV2 } from "@/v2/Closing";
import { Funance } from "@/v2/Funance";
import { initFx } from "@/v2/fx";
import { VP_LONG } from "@/v2/copy";
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

    /* deep links: /?goto=organizations scrolls to that section */
    const goto = new URLSearchParams(window.location.search).get("goto");
    /* always start at the sleeping machine (no browser scroll restore) */
    if (!goto && !new URLSearchParams(window.location.search).has("crt")) {
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
      return () => {
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
