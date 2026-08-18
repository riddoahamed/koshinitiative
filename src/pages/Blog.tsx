import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Instagram, Facebook, Linkedin, PenLine, Users } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { loadPosts } from "@/v2/postsApi";
import {
  CATEGORIES,
  CATEGORY_LABEL,
  SOURCE_LABEL,
  type Category,
  type Post,
  type PostSource,
} from "@/v2/posts";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /blog ────────────────────────────────────────────────────────────────────
   The library: lessons, guides, how-tos and the questions people actually ask,
   shelved by category. Local articles render immediately; anything synced from
   social or approved from a submission is merged in on top.                 */

const SOURCE_ICON: Record<PostSource, typeof PenLine> = {
  kosh: PenLine,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  community: Users,
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const Card = ({ p }: { p: Post }) => {
  const Icon = SOURCE_ICON[p.source];
  return (
    <a className="post glass" href={`/blog/${p.slug}`} data-reveal="scale">
      {p.cover && (
        <div className="post__cover">
          <img src={p.cover} alt="" loading="lazy" decoding="async" />
        </div>
      )}
      <div className="post__body">
        <span className="post__meta">
          <b className={`cat cat--${p.category}`}>{CATEGORY_LABEL[p.category]}</b>
          <em>{p.readMins} min</em>
          {p.source !== "kosh" && (
            <i title={SOURCE_LABEL[p.source]}><Icon size={12} strokeWidth={2.2} /></i>
          )}
        </span>
        <h3>{p.title}</h3>
        <p>{p.dek}</p>
        <span className="post__foot">
          <span className="post__go">Read <ArrowRight size={14} strokeWidth={2.4} /></span>
          <em>{fmt(p.date)}</em>
        </span>
      </div>
    </a>
  );
};

const Blog = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [cat, setCat] = useState<Category | "all">("all");

  useEffect(() => {
    let live = true;
    loadPosts().then((p) => live && setPosts(p));
    return () => {
      live = false;
    };
  }, []);

  const all = useMemo(() => posts ?? [], [posts]);
  /* only offer shelves that actually have something on them */
  const shelves = useMemo(
    () => CATEGORIES.filter((c) => all.some((p) => p.category === c.key)),
    [all]
  );
  const shown = cat === "all" ? all : all.filter((p) => p.category === cat);
  const active = CATEGORIES.find((c) => c.key === cat);

  return (
    <PageShell
      title="Blog — money in Bangladesh, explained"
      description="Free lessons, guides, how-tos and straight answers about money and investing in Bangladesh. How to start, how to spot a scam, how much you need, what Sanchaypatra and DPS really pay, and how to use the Kosh app. No account needed."
      path="/blog"
    >
      <section className="sec page-hero">
        <div className="blob p" style={{ width: 440, height: 440, right: "-10%", top: "-6%" }} />
        <div className="wrap">
          <p className="eyebrow" data-reveal>blog</p>
          <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
            Money in Bangladesh, explained one short read at a time.
          </h2>
          <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
            Lessons, guides, how-tos and straight answers to the questions people
            actually ask us. Free, no account, no jargon — written for people who
            are starting out, not for people who already work in finance.
          </p>
          <p className="blog__who" data-reveal="fade">
            Written by the Kosh team, by readers, and by people who know a
            subject properly. <a href="/blog/submit">Send us yours</a> — we read
            everything and publish the good ones.
          </p>
        </div>
      </section>

      <section className="sec postlist">
        <div className="wrap">
          <div className="pfilter" data-reveal="fade">
            <button className={cat === "all" ? "on" : ""} onClick={() => setCat("all")}>
              Everything
            </button>
            {shelves.map((c) => (
              <button
                key={c.key}
                className={cat === c.key ? "on" : ""}
                onClick={() => setCat(c.key)}
              >
                {c.label}
              </button>
            ))}
          </div>

          {active && <p className="pfilter__blurb">{active.blurb}</p>}

          {posts === null ? (
            <div className="pgrid">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div className="pcard-skel" key={i} aria-hidden="true" />
              ))}
            </div>
          ) : (
            <div className="pgrid" data-stagger="80">
              {shown.map((p) => <Card key={p.slug} p={p} />)}
            </div>
          )}

          <div className="contrib" data-reveal="scale">
            <div>
              <p className="eyebrow">write for this page</p>
              <h3>Know something worth knowing?</h3>
              <p className="contrib__p">
                Anyone can write here — readers, students, accountants, brokers,
                anyone who has learned something the hard way. A human reads
                every submission and edits before it goes live.
              </p>
            </div>
            <a className="btn btn-glass" href="/blog/submit">
              Submit your writing <ArrowRight size={16} strokeWidth={2.4} />
            </a>
          </div>

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
              <a className="btn btn-glass" href="/learn">Take a 2-minute lesson</a>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Blog;
