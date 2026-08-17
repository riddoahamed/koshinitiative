import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { submitPost, SUBMIT_LIMITS, type Submission } from "@/v2/postsApi";
import { CATEGORIES, type Category } from "@/v2/posts";
import { MAIL } from "@/v2/copy";

/* ── /blog/submit ─────────────────────────────────────────────────────────────
   Anyone can write for Kosh. Nothing goes live on its own — every submission
   lands in the moderation queue and a human publishes it. That rule is
   enforced by the database policy, not by this form. */

const EMPTY: Submission = {
  title: "",
  dek: "",
  body: "",
  category: "lesson",
  tags: [],
  author: "",
  authorNote: "",
};

const Submit = () => {
  const [f, setF] = useState<Submission>(EMPTY);
  const [tagText, setTagText] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof Submission>(k: K, v: Submission[K]) =>
    setF((prev) => ({ ...prev, [k]: v }));

  const bodyLen = f.body.trim().length;
  const enough = bodyLen >= SUBMIT_LIMITS.body[0] && f.title.trim().length >= SUBMIT_LIMITS.title[0];

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError(null);
    const res = await submitPost({
      ...f,
      tags: tagText
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 4),
    });
    if (res.ok === true) {
      setState("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setError(res.error);
    setState("idle");
  };

  return (
    <PageShell
      title="Write for Kosh"
      description="Submit a lesson, guide, how-to or answer for the Kosh blog. Everything is reviewed by a human before it goes live."
      path="/blog/submit"
    >
      <section className="sec page-hero">
        <div className="blob m" style={{ width: 420, height: 420, right: "-10%", top: "-6%" }} />
        <div className="wrap">
          <a className="article__back" href="/blog">Back to the blog</a>

          {state === "sent" ? (
            <div className="sent" data-reveal>
              <span className="sent__tick"><Check size={26} strokeWidth={2.6} /></span>
              <h2 className="h-display">Got it. Thank you.</h2>
              <p className="h-sub">
                It&rsquo;s in the queue. A human reads every submission before
                anything goes live, so give us a few days — if we publish it
                you&rsquo;ll see it on the blog with your name on it. If we
                won&rsquo;t, and you left a way to reach you, we&rsquo;ll tell
                you why.
              </p>
              <div className="page-cta__row" style={{ justifyContent: "flex-start" }}>
                <a className="btn btn-primary" href="/blog">Back to the blog</a>
                <button
                  className="btn btn-glass"
                  onClick={() => {
                    setF(EMPTY);
                    setTagText("");
                    setState("idle");
                  }}
                >
                  Write another
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="eyebrow" data-reveal>write for kosh</p>
              <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
                Know something worth knowing? Write it down.
              </h2>
              <p className="h-sub" data-reveal style={{ ["--d" as string]: "130ms" }}>
                Lessons, guides, how-tos, or an honest answer to a question
                people keep asking. Plain language, no hype, and nothing that
                tells anyone what to buy. A human reads every submission before
                it goes anywhere near the site.
              </p>

              <form className="wform" onSubmit={send} data-reveal="scale">
                <label className="wf">
                  <span>What kind of post is this?</span>
                  <div className="wf__cats">
                    {CATEGORIES.filter((c) => c.key !== "news").map((c) => (
                      <button
                        type="button"
                        key={c.key}
                        className={f.category === c.key ? "on" : ""}
                        onClick={() => set("category", c.key as Category)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="wf">
                  <span>Title</span>
                  <input
                    value={f.title}
                    onChange={(e) => set("title", e.target.value)}
                    maxLength={SUBMIT_LIMITS.title[1]}
                    placeholder="How I saved my first ৳50,000 on a freelancer's income"
                    required
                  />
                </label>

                <label className="wf">
                  <span>One-line summary <em>optional</em></span>
                  <input
                    value={f.dek}
                    onChange={(e) => set("dek", e.target.value)}
                    maxLength={SUBMIT_LIMITS.dek}
                    placeholder="What someone gets out of reading it."
                  />
                </label>

                <label className="wf">
                  <span>
                    The post
                    <em>
                      {bodyLen < SUBMIT_LIMITS.body[0]
                        ? `${SUBMIT_LIMITS.body[0] - bodyLen} more characters`
                        : `${bodyLen.toLocaleString()} characters`}
                    </em>
                  </span>
                  <textarea
                    value={f.body}
                    onChange={(e) => set("body", e.target.value)}
                    rows={14}
                    maxLength={SUBMIT_LIMITS.body[1]}
                    placeholder={"Leave a blank line between paragraphs.\n\nWrite the way you'd explain it to a friend who has never invested — short sentences, real numbers, and say plainly when something is your opinion rather than a fact."}
                    required
                  />
                </label>

                <div className="wf__row">
                  <label className="wf">
                    <span>Your name</span>
                    <input
                      value={f.author}
                      onChange={(e) => set("author", e.target.value)}
                      maxLength={80}
                      placeholder="How you want it credited"
                    />
                  </label>
                  <label className="wf">
                    <span>Tags <em>comma separated</em></span>
                    <input
                      value={tagText}
                      onChange={(e) => setTagText(e.target.value)}
                      placeholder="freelancing, saving"
                    />
                  </label>
                </div>

                <label className="wf">
                  <span>About you, or how to reach you <em>optional</em></span>
                  <input
                    value={f.authorNote}
                    onChange={(e) => set("authorNote", e.target.value)}
                    maxLength={300}
                    placeholder="Student at DU · riddo@example.com"
                  />
                </label>

                {error && <p className="wform__err">{error}</p>}

                <div className="wform__foot">
                  <button className="btn btn-primary" type="submit" disabled={!enough || state === "sending"}>
                    {state === "sending" ? (
                      <><Loader2 size={16} className="spin" /> Sending</>
                    ) : (
                      <>Submit for review <ArrowRight size={16} strokeWidth={2.4} /></>
                    )}
                  </button>
                  <p>
                    Nothing publishes automatically. We may edit for length and
                    clarity, and we&rsquo;ll never add a recommendation to buy
                    anything to your name. Questions:{" "}
                    <a href={`mailto:${MAIL}`}>{MAIL}</a>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </PageShell>
  );
};

export default Submit;
