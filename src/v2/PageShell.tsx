import { useEffect, type ReactNode } from "react";
import { NavV2, FootV2 } from "./Closing";
import { initFx } from "./fx";
import { applySeo } from "@/lib/seo";
import "./v2.css";

/* ── Shell for the sub-pages ──────────────────────────────────────────────────
   Same brand system as the homepage, minus the CRT hero: pinned nav, reveals,
   footer. No Lenis here on purpose — these are short read-and-act pages and
   inertia scroll gets in the way of jumping to a #lesson anchor.            */

interface PageShellProps {
  title: string;
  description: string;
  path: string;
  children: ReactNode;
}

const PageShell = ({ title, description, path, children }: PageShellProps) => {
  useEffect(() => {
    applySeo({ title, description, path });
    /* deep links land on the right lesson instead of the top of the page */
    const hash = window.location.hash.slice(1);
    if (hash) {
      window.setTimeout(
        () => document.getElementById(hash)?.scrollIntoView({ block: "start" }),
        60
      );
    } else {
      window.scrollTo(0, 0);
    }
    return initFx();
  }, [title, description, path]);

  return (
    <div className="v2 v2-page">
      <NavV2 pinned />
      <main>{children}</main>
      <FootV2 />
    </div>
  );
};

export default PageShell;
