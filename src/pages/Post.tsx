import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { loadPost } from "@/v2/postsApi";
import { CATEGORY_LABEL, SOURCE_LABEL, type Post as TPost } from "@/v2/posts";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /blog/:slug ──────────────────────────────────────────────────────────────
   One article. Local posts may carry inline HTML because we wrote them;
   anything from the database renders as plain text, always. That split is
   enforced here rather than trusted from the data.

   LinkedIn posts are not copied. They render as LinkedIn's own embed, which
   keeps attribution and engagement where it belongs. `safeEmbedUrl` in
   postsApi has already checked the host before it reaches this component. */

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

/* ── IMAGES AND CHARTS IN A SUBMITTED PIECE ──────────────────────────────────

   A paragraph whose entire content is an https image URL renders as an image.
   That is the whole syntax, and it is deliberately the whole syntax.

   The obvious ask is "let contributors put pictures and charts in their posts",
   and the obvious implementation — turn on `allowHtml` for community posts —
   is a stored-XSS hole with a submit button on it: anybody on the internet can
   write to `posts`, and `dangerouslySetInnerHTML` on a stranger's text hands
   them the domain, the session and the ability to rewrite the page they are
   published on. `allowHtml` stays exactly where it is, gated on
   `source === "kosh"`.

   Here WE build the <img>. Nothing from the submission reaches the DOM as
   markup — only a URL that has been parsed, checked for https, and checked for
   an image extension. A chart is a picture of a chart, which is what a chart in
   an article always was. */
const isImageLine = (line: string): string | null => {
  const t = line.trim();
  // One token only. A URL with prose around it is prose.
  if (/\s/.test(t)) return null;
  try {
    const u = new URL(t);
    if (u.protocol !== "https:") return null;
    if (!/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(u.pathname)) return null;
    return u.toString();
  } catch {
    return null;
  }
};

/* ── BLOCKS, NOT JUST PARAGRAPHS ─────────────────────────────────────────────

   Every body entry used to be wrapped in a <p>, which is fine for prose and
   quietly broken for anything else. An SVG chart survives inside a paragraph;
   a <figure>, a <table> or a list does not — the HTML parser closes the <p>
   the moment a block element opens inside it, and React then reconciles
   against a tree the browser rearranged behind its back.

   So an entry whose first tag is a block element gets a <div> wrapper instead.
   THE SECURITY GATE IS UNCHANGED: this only ever applies where `html` is
   already true, which is still `allowHtml && source === "kosh"`. Nothing from
   the database gains a single new capability here — a submitted post is still
   plain text, and its one picture syntax is still a URL we parse ourselves. */
const BLOCK_START = /^\s*<(figure|div|table|ul|ol|h3|h4|blockquote|aside|svg|section)\b/i;

const Body = ({ post }: { post: TPost }) => {
  const html = post.allowHtml && post.source === "kosh";
  return (
    <>
      {post.body.map((p, i) => {
        const img = isImageLine(p);
        if (img) {
          return (
            <figure className="article__fig" key={i}>
              <img src={img} alt="" loading="lazy" decoding="async" />
            </figure>
          );
        }
        if (html) {
          return BLOCK_START.test(p)
            ? <div key={i} dangerouslySetInnerHTML={{ __html: p }} />
            : <p key={i} dangerouslySetInnerHTML={{ __html: p }} />;
        }
        return <p key={i}>{p}</p>;
      })}
    </>
  );
};

const Post = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<TPost | null | "missing">(null);

  useEffect(() => {
    let live = true;
    loadPost(slug).then((p) => live && setPost(p ?? "missing"));
    return () => {
      live = false;
    };
  }, [slug]);

  const found = post && post !== "missing" ? post : null;

  return (
    <PageShell
      title={found ? found.title : "Blog"}
      description={found ? found.dek : "Lessons, guides and how-tos about money in Bangladesh."}
      image={found?.cover}
      path={`/blog/${slug}`}
    >
      <article className="sec page-hero article">
        <div className="blob m" style={{ width: 420, height: 420, left: "-12%", top: "-8%" }} />
        <div className="wrap">
          <a className="article__back" href="/blog">
            <ArrowLeft size={15} strokeWidth={2.2} /> All posts
          </a>

          {post === null && <div className="article__skel" aria-hidden="true" />}

          {post === "missing" && (
            <>
              <h2 className="h-display">We couldn&rsquo;t find that one.</h2>
              <p className="h-sub">
                It may have moved. Everything we&rsquo;ve written is on the{" "}
                <a className="ilink" href="/blog">blog</a>.
              </p>
            </>
          )}

          {found && (
            <>
              <span className="article__meta">
                <b className={`cat cat--${found.category}`}>{CATEGORY_LABEL[found.category]}</b>
                <em>{fmt(found.date)}</em>
                <em>{found.readMins} min read</em>
                {found.source !== "kosh" && <i>via {SOURCE_LABEL[found.source]}</i>}
              </span>
              <h2 className="h-display article__h">{found.title}</h2>
              <p className="h-sub">{found.dek}</p>

              {found.author && (
                <p className="article__by">
                  By <b>{found.author}</b>
                  {found.authorNote && <span> · {found.authorNote}</span>}
                </p>
              )}

              {found.cover && !found.embedUrl && (
                <figure className="article__cover">
                  <img src={found.cover} alt="" loading="lazy" />
                </figure>
              )}

              {/* LinkedIn keeps its own frame — we link, we don't reproduce */}
              {found.embedUrl && (
                <div className="article__embed">
                  <iframe
                    src={found.embedUrl}
                    title={`${SOURCE_LABEL[found.source]} post`}
                    frameBorder="0"
                    allowFullScreen
                    scrolling="no"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}

              {found.body.length > 0 && (
                <div className="article__body">
                  <Body post={found} />
                </div>
              )}

              {/* ── The lesson half ───────────────────────────────────────
                  A post and its in-app lesson are two shapes of one argument:
                  the post has the charts and the room to argue, the lesson has
                  the checks, the game and the quiz that make it stick. Linking
                  them was the whole point of writing both, and the link only
                  ever appears where a lesson genuinely exists — this is a
                  field on the post, not a guess from the category. */}
              {found.lesson && (
                <a
                  className="article__lesson"
                  href={found.lesson.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="article__lesson__kicker">The lesson version</span>
                  <span className="article__lesson__title">{found.lesson.label}</span>
                  {found.lesson.note && (
                    <span className="article__lesson__note">{found.lesson.note}</span>
                  )}
                  <span className="article__lesson__go">
                    Open in the app <ArrowRight size={15} strokeWidth={2.4} />
                  </span>
                </a>
              )}

              {found.tags.length > 0 && (
                <div className="article__tags">
                  {found.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              )}

              {found.sourceUrl && (
                <a
                  className="article__origin"
                  href={found.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Read the original on {SOURCE_LABEL[found.source]}
                  <ExternalLink size={14} strokeWidth={2.2} />
                </a>
              )}

              <div className="page-cta">
                <h3>Now do it with money that isn&rsquo;t real.</h3>
                <p>
                  Paper investing on real market prices, an AI coach that knows
                  Bangladeshi products, and the games. Free to start.
                </p>
                <div className="page-cta__row">
                  <a className="btn btn-primary" href={KOSH_APP_URL} target="_blank" rel="noreferrer">
                    Try Kosh <ArrowRight size={16} strokeWidth={2.4} />
                  </a>
                  <a className="btn btn-glass" href="/start">See the starting path</a>
                </div>
              </div>

              <p className="disclaim">
                Educational only. Kosh is not a licensed financial adviser, we
                never take custody of your money, and nothing here is a
                recommendation to buy any specific product.
                {found.source === "community" && " Community posts are the author’s own view."}
              </p>
            </>
          )}
        </div>
      </article>
    </PageShell>
  );
};

export default Post;
