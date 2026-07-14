import { useEffect } from "react";
import HeroMachine from "@/v2/HeroMachine";
import { About, Problem, Numbers, Product, Pillars, Who } from "@/v2/Sections";
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
    if (goto) {
      window.setTimeout(
        () => document.getElementById(goto)?.scrollIntoView(),
        80
      );
    }

    const cleanup = initFx();
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
