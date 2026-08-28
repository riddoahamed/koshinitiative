import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { NavV2, FootV2 } from "./Closing";
import { initFx } from "./fx";
import { applySeo } from "@/lib/seo";
import { PAGE_META } from "./pageMeta";
import { normalisePath } from "./ogMeta";
import "./v2.css";

/* ── Shell for the sub-pages ──────────────────────────────────────────────────
   Same brand system as the homepage, minus the CRT hero: pinned nav, reveals,
   footer. No Lenis here on purpose — these are short read-and-act pages and
   inertia scroll gets in the way of jumping to a #lesson anchor.            */

interface PageShellProps {
  /** Omit on a fixed page — the copy comes from pageMeta, keyed by `path`.
      Pass it only where the title is genuinely dynamic, like one blog post. */
  title?: string;
  description?: string;
  /** Absolute or site-relative. Only worth passing where the page has a
      picture of its own; everything else uses the site card. */
  image?: string;
  path: string;
  /** Where Back should go, when the page knows better than history does. */
  backTo?: string;
  children: ReactNode;
}

/* ── Where a page's title and description come from ───────────────────────────
   They used to be written inline at each call site, which was fine while the
   only consumer was applySeo in the browser. It stopped being fine when the
   edge middleware needed the same strings for link previews — code that runs
   before React exists cannot read a string inside a component.

   So the fixed pages no longer pass them: PAGE_META is keyed by path and is
   read by BOTH this component and ogMeta. One set of words, two consumers,
   nothing to keep in step by hand.                                          */
const PageShell = ({ title, description, image, path, backTo, children }: PageShellProps) => {
  useEffect(() => {
    const fallback = PAGE_META[normalisePath(path)];
    applySeo({
      title: title ?? fallback?.title,
      description: description ?? fallback?.description,
      image,
      path,
    });
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
  }, [title, description, image, path]);

  /* Back, not just the logo. These pages are reached from the homepage, from
     the app, and from shared links, and until now the only way out was the
     KOSH wordmark — which reads as "go to the homepage", not "go back", and
     which nobody looks for on a phone. history.back() keeps the reader's
     place on the page they came from; the fallback matters because a shared
     /learn link has no history to return to. */
  /* `backTo` overrides history for pages that know where they belong.
     history.back() is right when the reader came from somewhere — but it is
     wrong when they came from the homepage, because Index.tsx sets
     scrollRestoration to manual and scrolls to the top on mount, so "back"
     returned them to the hero rather than to the section they left. A page
     that has a home section on the landing page should say so. */
  const goBack = () => {
    if (backTo) { window.location.href = backTo; return; }
    if (window.history.length > 1) window.history.back();
    else window.location.href = "/";
  };

  return (
    <div className="v2 v2-page">
      <NavV2 pinned />
      <main>
        <div className="wrap">
          <button className="pageback" onClick={goBack} type="button">
            <ArrowLeft size={15} strokeWidth={2.4} />
            Back
          </button>
        </div>
        {children}
      </main>
      <FootV2 />
    </div>
  );
};

export default PageShell;
