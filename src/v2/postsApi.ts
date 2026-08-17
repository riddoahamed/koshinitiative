/* ── Reading the synced feed ──────────────────────────────────────────────────
   Same approach as the live vote tally: plain PostgREST over fetch, no SDK,
   no extra bundle weight. If the env vars are missing, the table doesn't
   exist, or the network is down, we quietly fall back to the local posts —
   the blog is never empty and never shows an error to a visitor.

   See supabase/README-social.md for how rows get in here.                   */

import { LOCAL_POSTS, type Post, type PostSource } from "./posts";

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const syncReady = Boolean(URL && KEY);

const SOURCES: PostSource[] = ["kosh", "linkedin", "instagram", "facebook"];

interface Row {
  slug?: string | null;
  title?: string | null;
  dek?: string | null;
  body?: string | null;
  published_at?: string | null;
  tags?: string[] | null;
  source?: string | null;
  source_url?: string | null;
  cover_url?: string | null;
}

const WORDS_PER_MIN = 210;

/* A caption written by whoever runs the Instagram account is untrusted input.
   It becomes paragraphs of text and never markup — `allowHtml` stays unset. */
const toPost = (r: Row): Post | null => {
  const title = (r.title || "").trim();
  const bodyRaw = (r.body || "").trim();
  if (!title || !r.slug) return null;

  const body = bodyRaw
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const words = bodyRaw.split(/\s+/).length;
  const source = SOURCES.includes(r.source as PostSource)
    ? (r.source as PostSource)
    : "kosh";

  return {
    slug: r.slug,
    title,
    dek: (r.dek || body[0] || "").slice(0, 220),
    body: body.length ? body : [title],
    date: r.published_at || new Date().toISOString(),
    tags: Array.isArray(r.tags) ? r.tags.slice(0, 4) : [],
    source,
    sourceUrl: r.source_url || undefined,
    cover: r.cover_url || undefined,
    readMins: Math.max(1, Math.round(words / WORDS_PER_MIN)),
  };
};

const byNewest = (a: Post, b: Post) => (a.date < b.date ? 1 : -1);

/** Local posts win on slug collisions — we control those. */
const merge = (synced: Post[]): Post[] => {
  const seen = new Set(LOCAL_POSTS.map((p) => p.slug));
  return [...LOCAL_POSTS, ...synced.filter((p) => !seen.has(p.slug))].sort(byNewest);
};

/* Until `posts.sql` has been run the table 404s. Remember that for the rest of
   the session so we ask once instead of on every navigation — a new tab picks
   the table up as soon as it exists. */
const OFF_KEY = "kosh_posts_sync_off";
const syncOff = () => {
  try {
    return sessionStorage.getItem(OFF_KEY) === "1";
  } catch {
    return false;
  }
};
const markSyncOff = () => {
  try {
    sessionStorage.setItem(OFF_KEY, "1");
  } catch {
    /* private mode — just try again next navigation */
  }
};

export async function loadPosts(): Promise<Post[]> {
  if (!syncReady || syncOff()) return [...LOCAL_POSTS].sort(byNewest);
  try {
    const res = await fetch(
      `${URL}/rest/v1/posts?select=*&status=eq.published&order=published_at.desc&limit=60`,
      { headers: { apikey: KEY as string, Authorization: `Bearer ${KEY}` } }
    );
    if (!res.ok) {
      if (res.status === 404) markSyncOff();
      return merge([]);
    }
    const rows = (await res.json()) as Row[];
    return merge(rows.map(toPost).filter((p): p is Post => p !== null));
  } catch {
    return merge([]);
  }
}

export async function loadPost(slug: string): Promise<Post | null> {
  const local = LOCAL_POSTS.find((p) => p.slug === slug);
  if (local) return local;
  const all = await loadPosts();
  return all.find((p) => p.slug === slug) ?? null;
}
