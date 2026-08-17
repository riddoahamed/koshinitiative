/* ============================================================================
   social-sync — pulls the Kosh Facebook Page and Instagram Business account
   into the `posts` table. Run it on a schedule (see README-social.md).

   Facebook and Instagram both go through the Meta Graph API with one
   long-lived Page token. LinkedIn is NOT here: retrieving an organisation's
   own posts needs an approved LinkedIn partner app, which you can't get by
   just registering. Push LinkedIn in through `social-ingest` instead.

   Deploy:  supabase functions deploy social-sync --no-verify-jwt
   Secrets: META_PAGE_ID, META_IG_USER_ID, META_ACCESS_TOKEN, SYNC_SECRET
   ============================================================================ */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PAGE_ID = Deno.env.get("META_PAGE_ID") ?? "";
const IG_USER_ID = Deno.env.get("META_IG_USER_ID") ?? "";
const TOKEN = Deno.env.get("META_ACCESS_TOKEN") ?? "";
const SYNC_SECRET = Deno.env.get("SYNC_SECRET") ?? "";

const GRAPH = "https://graph.facebook.com/v21.0";

interface Row {
  slug: string;
  title: string;
  dek: string;
  body: string;
  cover_url: string | null;
  tags: string[];
  source: "facebook" | "instagram";
  source_url: string | null;
  external_id: string;
  published_at: string;
  status: "published";
}

/* first sentence (or first line) becomes the title, capped so cards stay tidy */
const titleFrom = (text: string): string => {
  const first = text.split(/\n/)[0].trim() || text.trim();
  const sentence = first.split(/(?<=[.!?])\s/)[0].trim() || first;
  return sentence.length > 90 ? `${sentence.slice(0, 87).trimEnd()}…` : sentence;
};

const slugify = (s: string, id: string): string => {
  const base = s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/^-+|-+$/g, "");
  const tail = id.replace(/[^a-z0-9]/gi, "").slice(-6).toLowerCase();
  return base ? `${base}-${tail}` : `post-${tail}`;
};

const hashtags = (text: string): string[] =>
  [...new Set([...text.matchAll(/#(\p{Letter}[\p{Letter}\p{Number}_]{1,28})/gu)].map((m) => m[1].toLowerCase()))]
    .slice(0, 4);

/* strip the hashtag block off the end — it reads as noise in an article */
const cleanBody = (text: string): string =>
  text.replace(/(?:^|\n)(?:\s*#[\p{Letter}\p{Number}_]+\s*)+$/gu, "").trim();

async function graph<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const qs = new URLSearchParams({ ...params, access_token: TOKEN });
  const res = await fetch(`${GRAPH}/${path}?${qs}`);
  if (!res.ok) {
    console.error(`graph ${path} failed: ${res.status} ${await res.text()}`);
    return null;
  }
  return (await res.json()) as T;
}

async function facebookPosts(): Promise<Row[]> {
  if (!PAGE_ID) return [];
  const data = await graph<{
    data: { id: string; message?: string; created_time: string; permalink_url?: string; full_picture?: string }[];
  }>(`${PAGE_ID}/posts`, {
    fields: "id,message,created_time,permalink_url,full_picture",
    limit: "25",
  });
  if (!data?.data) return [];

  return data.data
    .filter((p) => (p.message ?? "").trim().length > 40)
    .map((p) => {
      const text = cleanBody(p.message!);
      const title = titleFrom(text);
      return {
        slug: slugify(title, p.id),
        title,
        dek: text.replace(/\s+/g, " ").slice(0, 200),
        body: text,
        cover_url: p.full_picture ?? null,
        tags: hashtags(p.message!),
        source: "facebook" as const,
        source_url: p.permalink_url ?? null,
        external_id: p.id,
        published_at: p.created_time,
        status: "published" as const,
      };
    });
}

async function instagramPosts(): Promise<Row[]> {
  if (!IG_USER_ID) return [];
  const data = await graph<{
    data: { id: string; caption?: string; timestamp: string; permalink?: string; media_url?: string; thumbnail_url?: string; media_type?: string }[];
  }>(`${IG_USER_ID}/media`, {
    fields: "id,caption,timestamp,permalink,media_url,thumbnail_url,media_type",
    limit: "25",
  });
  if (!data?.data) return [];

  return data.data
    .filter((m) => (m.caption ?? "").trim().length > 40)
    .map((m) => {
      const text = cleanBody(m.caption!);
      const title = titleFrom(text);
      return {
        slug: slugify(title, m.id),
        title,
        dek: text.replace(/\s+/g, " ").slice(0, 200),
        body: text,
        cover_url: (m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url) ?? null,
        tags: hashtags(m.caption!),
        source: "instagram" as const,
        source_url: m.permalink ?? null,
        external_id: m.id,
        published_at: m.timestamp,
        status: "published" as const,
      };
    });
}

/* upsert on (source, external_id) so re-running never duplicates */
async function upsert(rows: Row[]): Promise<number> {
  if (!rows.length) return 0;
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/posts?on_conflict=source,external_id`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify(rows),
    }
  );
  if (!res.ok) {
    console.error(`upsert failed: ${res.status} ${await res.text()}`);
    return 0;
  }
  return rows.length;
}

Deno.serve(async (req) => {
  /* the scheduler passes the shared secret; nothing else may trigger a sync */
  if (SYNC_SECRET && req.headers.get("x-sync-secret") !== SYNC_SECRET) {
    return new Response("forbidden", { status: 403 });
  }
  if (!TOKEN) {
    return Response.json({ ok: false, error: "META_ACCESS_TOKEN not set" }, { status: 500 });
  }

  const [fb, ig] = await Promise.all([facebookPosts(), instagramPosts()]);
  const written = await upsert([...fb, ...ig]);

  return Response.json({
    ok: true,
    facebook: fb.length,
    instagram: ig.length,
    written,
  });
});
