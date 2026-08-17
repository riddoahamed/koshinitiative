/* ── Talking to the posts table ───────────────────────────────────────────────
   Same approach as the live vote tally: plain PostgREST over fetch, no SDK,
   no extra bundle weight. If the env vars are missing, the table doesn't
   exist, or the network is down, we quietly fall back to the local posts —
   the blog is never empty and never shows an error to a visitor.

   See supabase/README-social.md for how rows get in here.                   */

import {
  LOCAL_POSTS,
  type Category,
  type Post,
  type PostSource,
} from "./posts";

const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const syncReady = Boolean(URL_BASE && KEY);

const SOURCES: PostSource[] = ["kosh", "linkedin", "instagram", "facebook", "community"];
const CATEGORY_KEYS: Category[] = ["lesson", "guide", "how-to", "faq", "story", "news", "article"];

/* Only these hosts may be put in an iframe on our domain. An embed URL is
   attacker-controlled the moment anyone but us can write a row, so this is a
   whitelist rather than a sanity check. */
const EMBED_HOSTS = ["www.linkedin.com", "linkedin.com"];

/** Accepts a bare embed URL or a pasted `<iframe src="…">`; returns null if it
 *  isn't an https URL on an allowed host. */
export const safeEmbedUrl = (raw: string | null | undefined): string | undefined => {
  if (!raw) return undefined;
  const match = raw.match(/src=["']([^"']+)["']/i);
  const candidate = (match ? match[1] : raw).trim();
  try {
    const u = new URL(candidate);
    if (u.protocol !== "https:") return undefined;
    if (!EMBED_HOSTS.includes(u.hostname)) return undefined;
    return u.toString();
  } catch {
    return undefined;
  }
};

interface Row {
  slug?: string | null;
  title?: string | null;
  dek?: string | null;
  body?: string | null;
  published_at?: string | null;
  category?: string | null;
  tags?: string[] | null;
  source?: string | null;
  source_url?: string | null;
  embed_url?: string | null;
  cover_url?: string | null;
  author_name?: string | null;
  author_note?: string | null;
}

const WORDS_PER_MIN = 210;

/* A caption written by whoever runs the Instagram account — or a submission
   from a stranger — is untrusted input. It becomes paragraphs of text and
   never markup, so `allowHtml` is deliberately absent here. */
const toPost = (r: Row): Post | null => {
  const title = (r.title || "").trim();
  const bodyRaw = (r.body || "").trim();
  if (!title || !r.slug) return null;

  const body = bodyRaw
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const words = bodyRaw.split(/\s+/).length;

  return {
    slug: r.slug,
    title,
    dek: (r.dek || body[0] || "").slice(0, 220),
    body: body.length ? body : [title],
    date: r.published_at || new Date().toISOString(),
    category: CATEGORY_KEYS.includes(r.category as Category)
      ? (r.category as Category)
      : "article",
    tags: Array.isArray(r.tags) ? r.tags.slice(0, 4) : [],
    source: SOURCES.includes(r.source as PostSource)
      ? (r.source as PostSource)
      : "kosh",
    sourceUrl: r.source_url || undefined,
    embedUrl: safeEmbedUrl(r.embed_url),
    cover: r.cover_url || undefined,
    author: r.author_name || undefined,
    authorNote: r.author_note || undefined,
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
      `${URL_BASE}/rest/v1/posts?select=*&status=eq.published&order=published_at.desc&limit=100`,
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

/* ---------------------------------------------------------------------------
   Submitting a post

   Goes straight to PostgREST as the anon role. The database is what enforces
   the rules — the RLS policy pins status to 'pending' and source to
   'community', so nothing here can publish itself no matter what we send.
   --------------------------------------------------------------------------- */

export interface Submission {
  title: string;
  dek: string;
  body: string;
  category: Category;
  tags: string[];
  author: string;
  authorNote: string;
}

export const SUBMIT_LIMITS = {
  title: [8, 140],
  body: [200, 20000],
  dek: 300,
} as const;

const slugify = (s: string) =>
  `${s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "") || "post"}-${Math.random().toString(36).slice(2, 8)}`;

export async function submitPost(
  s: Submission
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!syncReady) {
    return { ok: false, error: "Submissions aren't switched on yet. Email us instead." };
  }
  const title = s.title.trim();
  const body = s.body.trim();
  if (title.length < SUBMIT_LIMITS.title[0] || title.length > SUBMIT_LIMITS.title[1]) {
    return { ok: false, error: `The title needs to be ${SUBMIT_LIMITS.title[0]}–${SUBMIT_LIMITS.title[1]} characters.` };
  }
  if (body.length < SUBMIT_LIMITS.body[0]) {
    return { ok: false, error: `Write a bit more — at least ${SUBMIT_LIMITS.body[0]} characters.` };
  }
  if (body.length > SUBMIT_LIMITS.body[1]) {
    return { ok: false, error: "That's longer than we can take. Trim it a little." };
  }

  try {
    const res = await fetch(`${URL_BASE}/rest/v1/posts`, {
      method: "POST",
      headers: {
        apikey: KEY as string,
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        slug: slugify(title),
        title,
        dek: s.dek.trim().slice(0, SUBMIT_LIMITS.dek) || null,
        body,
        category: s.category,
        tags: s.tags.slice(0, 4),
        source: "community",
        status: "pending",
        author_name: s.author.trim().slice(0, 80) || null,
        author_note: s.authorNote.trim().slice(0, 300) || null,
      }),
    });
    if (!res.ok) {
      return { ok: false, error: "That didn't go through. Check the fields and try again." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Couldn't reach the server. Try again in a moment." };
  }
}
