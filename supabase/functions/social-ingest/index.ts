/* ============================================================================
   social-ingest — one webhook that turns anything you push at it into a post.

   This is the LinkedIn path (and the escape hatch for everything else).
   LinkedIn will not let a normal app read an organisation's own posts, so
   instead you let something that CAN see the post push it here:

     * Zapier / Make / IFTTT  "new LinkedIn company post" → POST to this URL
     * a GitHub Action, a phone shortcut, or curl from your laptop
     * paste it by hand when you publish something you want mirrored

   Deploy:  supabase functions deploy social-ingest --no-verify-jwt
   Secrets: INGEST_SECRET
   ============================================================================ */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const INGEST_SECRET = Deno.env.get("INGEST_SECRET") ?? "";

const SOURCES = ["kosh", "linkedin", "instagram", "facebook"] as const;
type Source = (typeof SOURCES)[number];

interface Payload {
  text?: string;
  title?: string;
  dek?: string;
  source?: string;
  url?: string;
  image?: string;
  tags?: string[];
  id?: string;
  published_at?: string;
  status?: "published" | "draft" | "hidden";
}

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
  const tail = id.replace(/[^a-z0-9]/gi, "").slice(-6).toLowerCase() || Date.now().toString(36).slice(-6);
  return base ? `${base}-${tail}` : `post-${tail}`;
};

const hashtags = (text: string): string[] =>
  [...new Set([...text.matchAll(/#(\p{Letter}[\p{Letter}\p{Number}_]{1,28})/gu)].map((m) => m[1].toLowerCase()))]
    .slice(0, 4);

const cleanBody = (text: string): string =>
  text.replace(/(?:^|\n)(?:\s*#[\p{Letter}\p{Number}_]+\s*)+$/gu, "").trim();

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  if (!INGEST_SECRET || req.headers.get("x-ingest-secret") !== INGEST_SECRET) {
    return new Response("forbidden", { status: 403 });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const raw = (payload.text ?? "").trim();
  if (raw.length < 20) {
    return Response.json({ ok: false, error: "text is required (20+ chars)" }, { status: 400 });
  }

  const body = cleanBody(raw);
  const title = (payload.title ?? "").trim() || titleFrom(body);
  const source: Source = SOURCES.includes(payload.source as Source)
    ? (payload.source as Source)
    : "linkedin";
  const externalId = (payload.id ?? "").trim() || `${source}-${Date.now()}`;

  const row = {
    slug: slugify(title, externalId),
    title,
    dek: (payload.dek ?? body.replace(/\s+/g, " ")).slice(0, 200),
    body,
    cover_url: payload.image ?? null,
    tags: Array.isArray(payload.tags) && payload.tags.length
      ? payload.tags.slice(0, 4).map(String)
      : hashtags(raw),
    source,
    source_url: payload.url ?? null,
    external_id: externalId,
    published_at: payload.published_at ?? new Date().toISOString(),
    status: payload.status ?? "published",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?on_conflict=source,external_id`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify([row]),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error(`ingest upsert failed: ${res.status} ${detail}`);
    return Response.json({ ok: false, error: "write failed", detail }, { status: 500 });
  }

  return Response.json({ ok: true, slug: row.slug, url: `/blog/${row.slug}` });
});
