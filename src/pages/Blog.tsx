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
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/* ── A ROW, NOT A TILE ───────────────────────────────────────────────────────

   Every post used to be a bordered glass card carrying six things: a coloured
   category badge, a read time, a title, a two-line dek, a "Read →" chevron and
   a date. Two across, a dozen of them, five different badge colours down the
   grid — green for questions, purple for how-tos, teal for lessons, orange for
   stories. It looked like a portal from 2003, and none of those six things is
   why anybody clicks.

   THE TITLE IS WHY ANYBODY CLICKS. Every post here is already a question or a
   plain statement — "How much money do you need to start investing in
   Bangladesh?" — so the title alone does the entire job of the badge, the dek
   and the chevron put together. Everything else is set small, in one grey line
   underneath, and the category is a WORD rather than a coloured pill.

   The whole row is the link, the rule between rows is the only decoration, and
   a list of good questions reads faster than a grid of good cards. */
const Row = ({ p }: { p: Post }) => {
  const Icon = SOURCE_ICON[p.source];
  return (
    <a className="prow" href={`/blog/${p.slug}`} data-reveal="fade">
      <span className="prow__main">
        <h3>{p.title}</h3>
        <span className="prow__meta">
          <span>{CATEGORY_LABEL[p.category]}</span>
          <span>{p.readMins} min</span>
          <span>{fmt(p.date)}</span>
          {p.source !== "kosh" && (
            <span className="prow__src" title={SOURCE_LABEL[p.source]}>
              <Icon size={11} strokeWidth={2.2} /> {SOURCE_LABEL[p.source]}
            </span>
          )}
        </span>
      </span>
      {/* The cover survives, small and on the right. A picture is the one thing
          on the old card that carried information a title cannot — but at
          tile size it was the loudest element on a page of words. */}
      {p.cover && (
        <span className="prow__thumb">
          <img src={p.cover} alt="" loading="lazy" decoding="async" />
        </span>
      )}
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
            actually ask us. Free, no account, no jargon, written for people who are
            starting out, not for people who already work in finance.
          </p>
          <p className="blog__who" data-reveal="fade">
            Written by the Kosh team, by readers, and by people who know a
            subject properly. <a href="/blog/submit">Send us yours</a>, we read
            everything and publish the good ones.
          </p>
        </div>
      </section>

      <section className="sec postlist">
        <div className="wrap">
          {/* ── AN INDEX, NOT PILLS ──────────────────────────────────────
              A row of rounded outlined pills is the single most recognisable
              "this was generated" tell on the web right now, and it was sitting
              at the top of the one page whose whole claim is that a person
              wrote everything below it.

              Plain words instead, with a count beside each and a rule under the
              one you are reading. It is a table of contents — the oldest
              navigation there is for a page of writing, and the one nobody has
              to learn. */}
          <nav className="pindex" data-reveal="fade" aria-label="Filter by category">
            <button className={cat === "all" ? "on" : ""} onClick={() => setCat("all")}>
              Everything <em>{all.length}</em>
            </button>
            {shelves.map((c) => (
              <button
                key={c.key}
                className={cat === c.key ? "on" : ""}
                onClick={() => setCat(c.key)}
              >
                {c.label} <em>{all.filter((p) => p.category === c.key).length}</em>
              </button>
            ))}
          </nav>

          {active && <p className="pindex__blurb">{active.blurb}</p>}

          {posts === null ? (
            <div className="plist">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div className="prow-skel" key={i} aria-hidden="true" />
              ))}
            </div>
          ) : (
            <div className="plist" data-stagger="40">
              {shown.map((p) => <Row key={p.slug} p={p} />)}
            </div>
          )}

          <div className="contrib" data-reveal="scale">
            <div>
              <p className="eyebrow">write for this page</p>
              <h3>Know something worth knowing?</h3>
              <p className="contrib__p">
                Anyone can write here: readers, students, accountants, brokers, anyone
                who has learned something the hard way. A human reads every
                submission and edits before it goes live.
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
              free, and we never touch your money.
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
