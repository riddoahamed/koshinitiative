/* ============================================================
   Live tally for classroom sessions.

   Talks to Supabase over plain PostgREST — no SDK, no extra bundle.
   If the env vars aren't set the page runs in Solo mode instead:
   everything still works, results are just this device's own.

   Enable Live mode:
     1. run supabase/vote.sql on the Kosh project
     2. set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
   ============================================================ */

const URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const liveReady = Boolean(URL && KEY);

const TABLE = "live_votes";

const headers = () => ({
  apikey: KEY as string,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
});

/* stable anonymous id per browser, so a person can change their mind
   without inflating the count */
export const voterId = (() => {
  if (typeof localStorage === "undefined") return "anon";
  let v = localStorage.getItem("kosh_voter_id");
  if (!v) {
    v = `v_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    localStorage.setItem("kosh_voter_id", v);
  }
  return v;
})();

export async function castVote(room: string, optionId: string) {
  if (!liveReady) return false;
  try {
    const res = await fetch(`${URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: { ...headers(), Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ room, option_id: optionId, voter: voterId }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchTally(room: string): Promise<Record<string, number>> {
  if (!liveReady) return {};
  try {
    const res = await fetch(
      `${URL}/rest/v1/${TABLE}?room=eq.${encodeURIComponent(room)}&select=option_id`,
      { headers: headers() }
    );
    if (!res.ok) return {};
    const rows: { option_id: string }[] = await res.json();
    const out: Record<string, number> = {};
    rows.forEach((r) => {
      out[r.option_id] = (out[r.option_id] || 0) + 1;
    });
    return out;
  } catch {
    return {};
  }
}
