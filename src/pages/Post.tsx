import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { loadPost } from "@/v2/postsApi";
import { SOURCE_LABEL, type Post as TPost } from "@/v2/posts";
import { KOSH_APP_URL } from "@/lib/links";

/* ── /blog/:slug ──────────────────────────────────────────────────────────────
   One article. Local posts may carry inline HTML because we wrote them;
   synced social posts are rendered as plain text, always. That split is
   enforced here rather than trusted from the data. */

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const Body = ({ post }: { post: TPost }) =>
  post.allowHtml && post.source === "kosh" ? (
    <>
      {post.body.map((p, i) => (
        <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
      ))}
    </>
  ) : (
    <>
      {post.body.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );

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
      title={found ? found.title : "Writing"}
      description={found ? found.dek : "Guides, explainers and posts from Kosh."}
      path={`/blog/${slug}`}
    >
      <article className="sec page-hero article">
        <div className="blob m" style={{ width: 420, height: 420, left: "-12%", top: "-8%" }} />
        <div className="wrap">
          <a className="article__back" href="/blog">
            <ArrowLeft size={15} strokeWidth={2.2} /> All writing
          </a>

          {post === null && <div className="article__skel" aria-hidden="true" />}

          {post === "missing" && (
            <>
              <h2 className="h-display">We couldn&rsquo;t find that one.</h2>
              <p className="h-sub">
                It may have moved. Everything we&rsquo;ve written is on the{" "}
                <a className="ilink" href="/blog">writing page</a>.
              </p>
            </>
          )}

          {found && (
            <>
              <span className="article__meta">
                <i>{SOURCE_LABEL[found.source]}</i>
                <em>{fmt(found.date)}</em>
                <em>{found.readMins} min read</em>
              </span>
              <h2 className="h-display article__h">{found.title}</h2>
              <p className="h-sub">{found.dek}</p>

              {found.cover && (
                <figure className="article__cover">
                  <img src={found.cover} alt="" loading="lazy" />
                </figure>
              )}

              <div className="article__body">
                <Body post={found} />
              </div>

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
                  Originally posted on {SOURCE_LABEL[found.source]}
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
              </p>
            </>
          )}
        </div>
      </article>
    </PageShell>
  );
};

export default Post;
