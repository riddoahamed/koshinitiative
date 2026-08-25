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

/* ── Counting happens in Postgres now ──────────────────────────────────────
   This used to SELECT every row for the room and tally them in JavaScript.
   Fine for a room of thirty, and silently wrong the moment Kosh Live became a
   perpetual poll: PostgREST caps an unbounded select at 1000 rows, so at vote
   1001 the percentages would have quietly frozen — no error, no empty state,
   just a number that stops being true.

   `live_room_tally` and `live_poll_totals` group in the database, which has no
   such ceiling. Both fall back to the old path when the views are missing, so
   this keeps working on a project where the migration has not been pushed yet
   — the same reasoning as the InvestKorsi `merged_into` decision. */

async function rows<T>(path: string): Promise<T[] | null> {
  if (!liveReady) return null;
  try {
    const res = await fetch(`${URL}/rest/v1/${path}`, { headers: headers() });
    if (!res.ok) return null;
    const json = await res.json();
    return Array.isArray(json) ? (json as T[]) : null;
  } catch {
    return null;
  }
}

type TallyRow = { option_id: string; votes: number };

export async function fetchTally(room: string): Promise<Record<string, number>> {
  if (!liveReady) return {};

  const agg = await rows<TallyRow>(
    `live_room_tally?room=eq.${encodeURIComponent(room)}&select=option_id,votes`,
  );
  if (agg) return Object.fromEntries(agg.map((r) => [r.option_id, Number(r.votes ?? 0)]));

  // Pre-migration fallback: the old row-by-row count.
  const raw = await rows<{ option_id: string }>(
    `${TABLE}?room=eq.${encodeURIComponent(room)}&select=option_id`,
  );
  if (!raw) return {};
  const out: Record<string, number> = {};
  raw.forEach((r) => { out[r.option_id] = (out[r.option_id] || 0) + 1; });
  return out;
}

/** Every answer ever given, in every session. The perpetual counter — this is
    the number a visitor who never sat in a classroom actually wants. */
export async function fetchPollTotals(): Promise<Record<string, number>> {
  const agg = await rows<TallyRow>("live_poll_totals?select=option_id,votes");
  if (!agg) return {};
  return Object.fromEntries(agg.map((r) => [r.option_id, Number(r.votes ?? 0)]));
}

export interface LiveStats {
  /** Distinct rooms that have at least one vote in them. */
  rooms: number;
  votes: number;
  lastVoteAt: string | null;
}

export async function fetchLiveStats(): Promise<LiveStats> {
  const agg = await rows<Record<string, unknown>>("live_stats?select=*");
  const r = agg?.[0];
  if (!r) return { rooms: 0, votes: 0, lastVoteAt: null };
  return {
    rooms: Number(r.rooms ?? 0),
    votes: Number(r.votes ?? 0),
    lastVoteAt: (r.last_vote_at as string | null) ?? null,
  };
}
