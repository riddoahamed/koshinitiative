import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroMachine from "@/v2/HeroMachine";
import { About, Problem, Numbers, Product, Pillars, Who, Inclusion } from "@/v2/Sections";
import { Orgs, Vision, Founder, Join, FootV2, NavV2 } from "@/v2/Closing";
import { initFx } from "@/v2/fx";
import { applySeo } from "@/lib/seo";
import "@/v2/v2.css";

const Index = () => {
  useEffect(() => {
    applySeo({
      title: "Kosh — Better decisions, not more information",
      description:
        "Kosh is an AI-native financial decision and investment discovery platform for emerging markets, starting with Bangladesh. Agents find it. Humans check it. You decide.",
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
        <About />
        <Problem />
        <Numbers />
        <Product />
        <Pillars />
        <Who />
        <Inclusion />
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
