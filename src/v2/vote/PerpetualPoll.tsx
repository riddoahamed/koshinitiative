import { useCallback, useEffect, useState } from "react";
import { OPTIONS } from "@/v2/vote/data";
import { castVote, fetchPollTotals, liveReady } from "@/v2/vote/live";

/* ── The ৳10 lakh question, as a perpetual public counter ────────────────────

   Kosh Live has always asked this, and always thrown the answer away: the
   question ran in a classroom, the room saw its own pie, the projector went off
   and the data went with it. This is the same question asked of everybody who
   ever lands on the site, added to the same pile, forever.

   ── WHY IT LIVES ON /investkorsi ────────────────────────────────────────────
   Because of what it sits next to. The rest of that page is what happened to
   people who ALREADY put money somewhere; this is what the reader would do
   before they know any of it. Answering costs one tap, and the answer is
   immediately worth something to them — you find out whether you are with the
   crowd or against it, which is the only genuinely interesting thing a poll can
   tell an individual.

   ── ONE ROOM, CALLED "public" ───────────────────────────────────────────────
   Reusing live_votes rather than building a second votes table, because it is
   the same question with the same options and it should land in the same pile —
   the totals on the Kosh Live reveal are supposed to include these. The room
   name gives it the unique (room, voter) index for free, so a device votes once
   and may change its mind, exactly like a classroom participant.

   ── AND IT SHOWS NOTHING RATHER THAN A WRONG NUMBER ────────────────────────
   Totals come from the `live_poll_totals` view. If that view is missing (the
   migration has not been pushed yet) the fetch returns empty and this renders
   the question with no results, which is honest. It deliberately does NOT fall
   back to counting rows client-side: PostgREST caps an unbounded select at 1000
   rows, so that fallback would freeze the percentages at vote 1001 with no
   error and no empty state. */

const ROOM = "public";
const CHOICE_KEY = "kosh_poll_choice_public";

/* EVERY option, in the order the Kosh Live board uses. An earlier pass showed
   six on the argument that a reader scrolling a data page will not weigh
   fifteen tiles — but cutting nine of them means somebody whose actual answer
   is "pay off a loan first" has no honest tile to press, and the poll stops
   measuring what people would do and starts measuring which of our six they
   dislike least. A wrong answer offered is worse than a long list. */

export default function PerpetualPoll() {
  const [choice, setChoice] = useState<string | null>(null);
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [busy, setBusy] = useState(false);

  const options = OPTIONS;

  const load = useCallback(async () => {
    setTotals(await fetchPollTotals());
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CHOICE_KEY);
      if (saved) setChoice(saved);
    } catch { /* private mode */ }
    void load();
  }, [load]);

  const pick = async (id: string) => {
    if (busy) return;
    setBusy(true);
    // Optimistic: the tap registers immediately whether or not the network is
    // having a good day. The real numbers arrive a moment later.
    setChoice(id);
    try { localStorage.setItem(CHOICE_KEY, id); } catch { /* private mode */ }
    if (liveReady) await castVote(ROOM, id);
    await load();
    setBusy(false);
  };

  /* The denominator is every answer ever given to this question, across every
     Kosh Live session as well as this page. Bars scale to the top option, not
     to the total — against a total, everything below first place is an
     unreadable sliver on any realistic spread. */
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  const top = Math.max(1, ...options.map((o) => totals[o.id] || 0));
  const revealed = choice !== null && total > 0;

  return (
    <section className="sec ikp-poll">
      <div className="wrap">
        <div className="poll" data-reveal="fade">
          <p className="poll__eyebrow">
            <i aria-hidden />
            Kosh Live
          </p>

          <h3 className="poll__q">
            You just got <span className="grad-text">৳10,00,000</span>. Where does it go?
          </h3>
          <p className="poll__sub">
            One tap, and you see what everyone else said. No account, nothing
            stored about you.
          </p>

          <div className="poll__opts">
            {options.map((o) => {
              const n = totals[o.id] || 0;
              const pct = total > 0 ? (n / total) * 100 : 0;
              const mine = choice === o.id;
              return (
                <button
                  key={o.id}
                  className={`poll__opt${mine ? " mine" : ""}${revealed ? " revealed" : ""}`}
                  onClick={() => pick(o.id)}
                  aria-pressed={mine}
                  style={{ ["--hue" as string]: String(o.hue) }}
                >
                  {/* The bar is INSIDE the button and grows from the left edge,
                      so the control becomes the chart rather than being
                      replaced by one. Nothing moves when the results land. */}
                  {revealed && (
                    <span
                      className="poll__fill"
                      style={{ width: `${Math.max(2, (n / top) * 100)}%` }}
                      aria-hidden
                    />
                  )}
                  <span className="poll__label">{o.label}</span>
                  {revealed && <span className="poll__pct">{pct.toFixed(0)}%</span>}
                </button>
              );
            })}
          </div>

          {revealed && (
            <p className="poll__n">
              <a href="/vote">Run this in your own room &rarr;</a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
