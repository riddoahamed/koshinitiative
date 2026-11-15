import { Download, Maximize2, Mail } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { MAIL } from "@/v2/copy";

/* ── /investors ───────────────────────────────────────────────────────────────
   The pre-seed deck, live. The deck itself is a static page,
   public/investors/deck.html (its own fonts, transitions and the recorded app
   screens, assets beside it in public/investors/assets), so it is embedded
   rather than rebuilt in React. One deck, three ways to take it away: present
   it, or download the PDF or the PowerPoint.

   cleanUrls serves deck.html at /investors/deck, and a real file wins over the
   SPA catch-all rewrite. Kept out of search (noindex in pageMeta).          */

const DECK = "/investors/deck";

const Investors = () => (
  <PageShell path="/investors">
    <section className="sec page-hero">
      <div className="blob p" style={{ width: 440, height: 440, left: "-10%", top: "-4%" }} />
      <div className="wrap">
        <p className="eyebrow" data-reveal>investors</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
          Kosh is raising ৳25 lakh pre-seed.
        </h2>
        <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
          The money app for young Bangladesh: learn it, compare it, practise it, then invest
          for real. Here is the deck we present, with the app's real screens on slide 4.
        </p>
      </div>
    </section>

    <section className="sec" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <div
          className="glass"
          style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "16 / 9", width: "100%", background: "#050608" }}
        >
          <iframe
            src={DECK}
            title="Kosh pre-seed deck"
            style={{ width: "100%", height: "100%", border: 0, display: "block" }}
            allow="fullscreen; autoplay"
            allowFullScreen
          />
        </div>
        <p style={{ fontSize: 13.5, opacity: 0.6, marginTop: 10 }}>
          Click the right or left edge, or use the arrow keys, to move between slides.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 22 }}>
          <a className="btn btn-primary" href={DECK} target="_blank" rel="noreferrer">
            <Maximize2 size={16} style={{ marginRight: 8, verticalAlign: -3 }} />
            Present full screen
          </a>
          <a className="btn btn-glass" href="/investors/Kosh-NSU-PreSeed-Deck.pdf" download>
            <Download size={16} style={{ marginRight: 8, verticalAlign: -3 }} />
            PDF
          </a>
          <a className="btn btn-glass" href="/investors/Kosh-NSU-PreSeed-Deck.pptx" download>
            <Download size={16} style={{ marginRight: 8, verticalAlign: -3 }} />
            PowerPoint
          </a>
          <a className="btn btn-glass" href={`mailto:${MAIL}?subject=Kosh%20pre-seed`}>
            <Mail size={16} style={{ marginRight: 8, verticalAlign: -3 }} />
            {MAIL}
          </a>
        </div>
      </div>
    </section>
  </PageShell>
);

export default Investors;
