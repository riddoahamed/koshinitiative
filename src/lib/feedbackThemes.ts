/* ── What people are asking for ────────────────────────────────────────────
   Reads `feedback_themes` — AI-grouped, paraphrased summaries of similar
   feedback submitted inside the app. Never the raw text: that table only
   holds themes an edge function (feedback-categorize) writes with the
   service role, and RLS only grants anon/authenticated SELECT. See
   supabase/migrations/20260818120000_feedback_public_layer.sql in the app
   repo (same Supabase project as this site).

   Same approach as postsApi.ts / live.ts: plain PostgREST over fetch, no
   SDK. Missing env vars or a network hiccup just means an empty list — the
   page never shows an error to a visitor for this.                        */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const feedbackReady = Boolean(URL && KEY);

export interface FeedbackTheme {
  id: string;
  title: string;
  summary: string;
  kind: "idea" | "problem" | "missing" | "other" | null;
  item_count: number;
  last_seen_at: string;
}

export async function loadFeedbackThemes(): Promise<FeedbackTheme[]> {
  if (!feedbackReady) return [];
  try {
    const res = await fetch(
      `${URL}/rest/v1/feedback_themes?select=id,title,summary,kind,item_count,last_seen_at&order=item_count.desc,last_seen_at.desc&limit=60`,
      { headers: { apikey: KEY as string, Authorization: `Bearer ${KEY}` } },
    );
    if (!res.ok) return [];
    const rows = (await res.json()) as FeedbackTheme[];
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}
