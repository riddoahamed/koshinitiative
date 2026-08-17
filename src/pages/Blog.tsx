import { useEffect, useState } from "react";
import { ArrowRight, Instagram, Facebook, Linkedin, PenLine } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { loadPosts } from "@/v2/postsApi";
import { SOURCE_LABEL, type Post, type PostSource } from "@/v2/posts";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /blog ────────────────────────────────────────────────────────────────────
   Everything Kosh writes, in one place: the how-to guides written here, plus
   whatever went out on LinkedIn, Instagram and Facebook once the sync is
   connected. Renders from local content first so the page is never empty. */

const SOURCE_ICON: Record<PostSource, typeof PenLine> = {
  kosh: PenLine,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Blog = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [filter, setFilter] = useState<PostSource | "all">("all");

  useEffect(() => {
    let live = true;
    loadPosts().then((p) => live && setPosts(p));
    return () => {
      live = false;
    };
  }, []);

  const all = posts ?? [];
  const sources = [...new Set(all.map((p) => p.source))];
  const shown = filter === "all" ? all : all.filter((p) => p.source === filter);

  return (
    <PageShell
      title="Writing"
      description="How-to guides for the Kosh app, plain-language money explainers for Bangladesh, and everything Kosh posts on LinkedIn, Instagram and Facebook — in one place."
      path="/blog"
    >
      <section className="sec page-hero">
        <div className="blob p" style={{ width: 440, height: 440, right: "-10%", top: "-6%" }} />
        <div className="wrap">
          <p className="eyebrow" data-reveal>writing</p>
          <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
            How to use Kosh, and what we&rsquo;re thinking about.
          </h2>
          <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
            Guides for the app, plain-language money explainers for Bangladesh,
            and everything we post on LinkedIn, Instagram and Facebook —
            collected here so you don&rsquo;t have to follow us anywhere to read
            it.
          </p>
        </div>
      </section>

      <section className="sec postlist">
        <div className="wrap">
          {sources.length > 1 && (
            <div className="pfilter" data-reveal="fade">
              <button
                className={filter === "all" ? "on" : ""}
                onClick={() => setFilter("all")}
              >
                Everything
              </button>
              {sources.map((s) => (
                <button
                  key={s}
                  className={filter === s ? "on" : ""}
                  onClick={() => setFilter(s)}
                >
                  {SOURCE_LABEL[s]}
                </button>
              ))}
            </div>
          )}

          {posts === null ? (
            <div className="pgrid">
              {[0, 1, 2, 3].map((i) => (
                <div className="pcard-skel" key={i} aria-hidden="true" />
              ))}
            </div>
          ) : (
            <div className="pgrid" data-stagger="90">
              {shown.map((p) => {
                const Icon = SOURCE_ICON[p.source];
                return (
                  <a className="post glass" key={p.slug} href={`/blog/${p.slug}`} data-reveal="scale">
                    {p.cover && (
                      <div className="post__cover">
                        <img src={p.cover} alt="" loading="lazy" decoding="async" />
                      </div>
                    )}
                    <div className="post__body">
                      <span className="post__meta">
                        <i><Icon size={12} strokeWidth={2.2} /> {SOURCE_LABEL[p.source]}</i>
                        <em>{fmt(p.date)}</em>
                        <em>{p.readMins} min</em>
                      </span>
                      <h3>{p.title}</h3>
                      <p>{p.dek}</p>
                      <span className="post__go">
                        Read <ArrowRight size={14} strokeWidth={2.4} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          )}

          <div className="page-cta" data-reveal="scale">
            <h3>Reading about it only gets you so far.</h3>
            <p>
              The money check, the coach, paper investing and the games are all
              free — and we never touch your money.
            </p>
            <div className="page-cta__row">
              <a className="btn btn-primary" href={KOSH_APP_URL} target="_blank" rel="noreferrer">
                Try Kosh <ArrowRight size={16} strokeWidth={2.4} />
              </a>
              <a className="btn btn-glass" href="/learn">Read a 2-minute lesson</a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Blog;
