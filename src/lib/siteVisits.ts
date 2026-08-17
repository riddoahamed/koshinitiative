/* ── Visit counter ────────────────────────────────────────────────────────────
   Bumps `kosh_counters.koshbd_visits` via the increment_counter() RPC (same
   Supabase project as the app — see the app repo's
   supabase/migrations/20260818120000_feedback_public_layer.sql). RLS only lets
   the client ADD one, never set the number directly, and sessionStorage keeps
   a reload from counting as a second visit.                                */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const SESSION_KEY = "kosh_counted_visit";

export function countVisitOnce(): void {
  if (!URL || !KEY) return;
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode — worst case this fires again next reload */
  }
  fetch(`${URL}/rest/v1/rpc/increment_counter`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ p_key: "koshbd_visits" }),
  }).catch(() => { /* a missed count matters far less than a broken page */ });
}
