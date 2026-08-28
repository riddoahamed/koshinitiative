import { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { loadFeedbackThemes, type FeedbackTheme } from "@/lib/feedbackThemes";
import { countVisitOnce } from "@/lib/siteVisits";

/* ── /feedback ────────────────────────────────────────────────────────────────
   "What people are asking for" — themes an AI grouped from feedback submitted
   inside the app, paraphrased and never verbatim. No names, no raw text, no
   way to trace a theme back to who said it. This page is the public half of a
   promise made inside the app: tell us, stay anonymous, and it still counts
   for something you can see.                                              */

const KIND_LABEL: Record<string, string> = {
  problem: "Confusing or broken",
  missing: "Something's missing",
  idea: "Idea",
  other: "Feedback",
};
const KIND_CLASS: Record<string, string> = {
  problem: "cat--news",
  missing: "cat--how-to",
  idea: "cat--lesson",
  other: "cat--article",
};

const ThemeCard = ({ t }: { t: FeedbackTheme }) => (
  <article className="glass" style={{ padding: "20px 22px", borderRadius: 18 }} data-reveal="scale">
    <span
      className={`cat ${KIND_CLASS[t.kind ?? "other"]}`}
      style={{ display: "inline-block", fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 999, marginBottom: 10 }}
    >
      {KIND_LABEL[t.kind ?? "other"]}
    </span>
    <h3 style={{ fontSize: 17, lineHeight: 1.3, margin: "0 0 6px" }}>{t.title}</h3>
    <p style={{ fontSize: 14.5, lineHeight: 1.55, opacity: 0.75, margin: 0 }}>{t.summary}</p>
    <p style={{ fontSize: 12.5, opacity: 0.5, marginTop: 12, marginBottom: 0 }}>
      {t.item_count} {t.item_count === 1 ? "person has" : "people have"} said this
    </p>
  </article>
);

const Feedback = () => {
  const [themes, setThemes] = useState<FeedbackTheme[] | null>(null);

  useEffect(() => {
    countVisitOnce();
    let live = true;
    loadFeedbackThemes().then((rows) => { if (live) setThemes(rows); });
    return () => { live = false; };
  }, []);

  return (
    <PageShell
      path="/feedback"
    >
      <section className="sec page-hero">
        <div className="blob p" style={{ width: 440, height: 440, left: "-10%", top: "-4%" }} />
        <div className="wrap">
          <p className="eyebrow" data-reveal>what people are telling us</p>
          <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
            Everyone who writes in stays anonymous. What they say doesn't disappear.
          </h2>
          <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
            Inside the app there's a box for feedback — no account required, no name
            attached. An AI groups the similar ones into themes below, paraphrased so
            nobody's actual words end up public. This is the same list the team reads.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          {themes === null && (
            <p style={{ opacity: 0.55, fontSize: 14.5 }}>Loading…</p>
          )}

          {themes !== null && themes.length === 0 && (
            <div className="glass" style={{ padding: "32px 24px", borderRadius: 18, textAlign: "center" }}>
              <MessageSquareText size={22} style={{ opacity: 0.5, marginBottom: 10 }} />
              <p style={{ fontSize: 14.5, opacity: 0.65, margin: 0 }}>
                Nothing grouped yet — check back soon.
              </p>
            </div>
          )}

          {themes !== null && themes.length > 0 && (
            <div
              data-stagger="60"
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}
            >
              {themes.map((t) => <ThemeCard key={t.id} t={t} />)}
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Feedback;
