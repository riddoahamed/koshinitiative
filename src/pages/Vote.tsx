import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import QrCode from "@/v2/QrCode";
import CrashGame from "@/v2/vote/CrashGame";
import TrailGame from "@/v2/vote/TrailGame";
import { OPTIONS, optionById, profileFor } from "@/v2/vote/data";
import { castVote, fetchTally, fetchPollTotals, fetchLiveStats, liveReady, type LiveStats } from "@/v2/vote/live";
import { useWallet, taka, START_BALANCE } from "@/v2/vote/wallet";
import { KOSH_APP_URL } from "@/lib/links";
import { applySeo } from "@/lib/seo";
import "@/v2/v2.css";
import "@/v2/vote/vote.css";

type Stage = "vote" | "reveal" | "analyse" | "play";

const CHOICE_KEY = "kosh_vote_choice";

/* donut segment */
const seg = (cx: number, cy: number, rO: number, rI: number, a0: number, a1: number) => {
  const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const big = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = p(rO, a0);
  const [x1, y1] = p(rO, a1);
  const [x2, y2] = p(rI, a1);
  const [x3, y3] = p(rI, a0);
  return `M${x0},${y0} A${rO},${rO} 0 ${big} 1 ${x1},${y1} L${x2},${y2} A${rI},${rI} 0 ${big} 0 ${x3},${y3} Z`;
};

const Vote = () => {
  const [stage, setStage] = useState<Stage>("vote");
  const [choice, setChoice] = useState<string | null>(null);
  const [tally, setTally] = useState<Record<string, number>>({});
  // ── THE PERPETUAL LAYER ───────────────────────────────────────────────────
  // Every session's answer used to be thrown away the moment the projector went
  // off. `totals` is every answer ever given, in every room, and `stats` is how
  // many sessions and answers that adds up to.
  //
  // Both are shown NEXT TO the room's own numbers rather than instead of them:
  // "6 of the 11 people here said land" is a fact about a room, "34% of
  // everyone who has ever answered said land" is a fact about Bangladesh, and
  // the first is much more interesting beside the second.
  const [totals, setTotals] = useState<Record<string, number>>({});
  const [live, setLive] = useState<LiveStats>({ rooms: 0, votes: 0, lastVoteAt: null });
  const [analyseId, setAnalyseId] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [left, setLeft] = useState<number | null>(null); // seconds on the clock
  const { wallet, stats, placeStake, settle, reset } = useWallet();

  /* host-set countdown: when it hits zero, the room moves to the reveal */
  useEffect(() => {
    if (left === null) return;
    if (left <= 0) {
      setLeft(null);
      setStage("reveal");
      return;
    }
    const t = setTimeout(() => setLeft((n) => (n === null ? null : n - 1)), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const room = useMemo(() => {
    if (typeof window === "undefined") return "live";
    return new URLSearchParams(window.location.search).get("room") || "live";
  }, []);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://www.koshbd.com/vote";
    const u = new URL(window.location.href);
    u.hash = "";
    return u.toString();
  }, []);

  useEffect(() => {
    applySeo({
      title: "Kosh Live, vote, reveal, decide",
      description:
        "A live session tool from Kosh: vote on what you'd do with ৳10 lakh, see the room's answer, then walk through how the decision actually gets made.",
      path: "/vote",
      robots: "noindex, follow",
    });
    setChoice(localStorage.getItem(CHOICE_KEY));
  }, []);

  /* live tally polling while the reveal is on screen */
  const refresh = useCallback(async () => {
    if (!liveReady) return;
    const [t, all, st] = await Promise.all([
      fetchTally(room),
      fetchPollTotals(),
      fetchLiveStats(),
    ]);
    setTally(t);
    setTotals(all);
    setLive(st);
  }, [room]);

  useEffect(() => {
    if (stage !== "reveal" || !liveReady) return;
    refresh();
    const t = setInterval(refresh, 3000);
    return () => clearInterval(t);
  }, [stage, refresh]);

  /* ── The ticker needs its numbers before the reveal ───────────────────────
     The polling effect above only runs on the reveal stage, which is correct —
     nothing else needs a 3-second refresh. But it meant the running total
     above the QUESTION had no data at first paint and simply never appeared:
     the one place the counts do persuasion work is the moment before somebody
     decides whether to answer.

     One fetch on mount, not a poll. It is a single aggregate row, and a number
     that is a few minutes stale is indistinguishable from a fresh one at this
     scale. */
  useEffect(() => {
    if (!liveReady) return;
    let alive = true;
    void fetchLiveStats().then((s) => { if (alive) setLive(s); });
    return () => { alive = false; };
  }, []);

  const pick = async (id: string) => {
    setChoice(id);
    localStorage.setItem(CHOICE_KEY, id);
    setAnalyseId(id);
    if (liveReady) {
      const ok = await castVote(room, id);
      setSent(ok);
    }
  };

  /* solo fallback: your own answer is the only data point, and we say so */
  const effectiveTally = useMemo(() => {
    if (liveReady && Object.keys(tally).length) return tally;
    return choice ? { [choice]: 1 } : {};
  }, [tally, choice]);

  const total = Object.values(effectiveTally).reduce((a, b) => a + b, 0);
  const ranked = useMemo(
    () =>
      OPTIONS.map((o) => ({ o, n: effectiveTally[o.id] || 0 }))
        .filter((r) => r.n > 0)
        .sort((a, b) => b.n - a.n),
    [effectiveTally]
  );

  /* The perpetual tally, ranked. Capped at eight rows: fifteen options with a
     long tail of ones is a list nobody reads to the end of, and the tail is
     exactly the part that says nothing. */
  const allTotal = Object.values(totals).reduce((a, b) => a + b, 0);
  const allRanked = useMemo(
    () =>
      OPTIONS.map((o) => ({ o, n: totals[o.id] || 0 }))
        .filter((r) => r.n > 0)
        .sort((a, b) => b.n - a.n)
        .slice(0, 8),
    [totals]
  );
  /* Bars scale to the top row, not to the total — against a total, everything
     below first place is an unreadable sliver on any realistic spread. */
  const allTop = allRanked[0]?.n ?? 1;

  const analysed = optionById(analyseId || choice || ranked[0]?.o.id || "dse");
  const profile = profileFor(stats);

  const NAV: [Stage, string][] = [
    ["vote", "Vote"],
    ["reveal", "Reveal"],
    ["analyse", "Analyse"],
    ["play", "Play"],
  ];

  return (
    <div className="v2 live">
      <header className="live__bar">
        <a className="live__brand" href="/">
          <img src="/img/kosh-logo.png" alt="" />
          <span>KOSH <b>LIVE</b></span>
        </a>
        <nav className="live__nav">
          {NAV.map(([s, label]) => (
            <button
              key={s}
              className={stage === s ? "on" : ""}
              onClick={() => setStage(s)}
            >
              {label}
            </button>
          ))}
        </nav>
        <a className="btn btn-primary live__cta" href={KOSH_APP_URL}>
          Open the app
        </a>
      </header>

      <main className="live__main">
        {/* ---------------- VOTE ---------------- */}
        {stage === "vote" && (
          <section className="live__stage">
            <div className="live__grid">
              <div>
                {/* ── THE RUNNING TOTAL, ABOVE THE QUESTION ────────────────
                    Kosh Live looked like a tool that had never been used: an
                    empty room, a question, and no evidence anyone had ever
                    answered it. The counts are the cheapest possible proof
                    that this is a thing people do — and they are the reason
                    to answer, because a vote that joins forty thousand others
                    is worth casting and a vote into a void is not.

                    Hidden until there is something to show. "0 sessions" is
                    worse than no strip at all. */}
                {live.votes > 0 && (
                  <p className="live__ticker">
                    <i aria-hidden />
                    <span>{live.votes.toLocaleString("en-IN")} answers</span>
                    <em>{live.rooms.toLocaleString("en-IN")} session{live.rooms === 1 ? "" : "s"} so far</em>
                  </p>
                )}
                <p className="eyebrow">the question</p>
                <h1 className="live__q">
                  You just got <span className="grad-text">৳10,00,000</span>.
                  What do you do with it right now?
                </h1>
                <p className="live__sub">
                  One tap. No wrong answer, that&rsquo;s the point. We&rsquo;ll
                  show the room in a moment.
                </p>

                <div className="timer">
                  {left === null ? (
                    <>
                      <span className="timer__label">Give the room a clock</span>
                      {[30, 60, 120].map((s) => (
                        <button key={s} onClick={() => setLeft(s)}>
                          {s < 60 ? `${s}s` : `${s / 60} min`}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      <span className={`timer__count${left <= 10 ? " hot" : ""}`}>
                        {Math.floor(left / 60)}:{String(left % 60).padStart(2, "0")}
                      </span>
                      <span className="timer__label">until the reveal</span>
                      <button onClick={() => setLeft(null)}>stop</button>
                    </>
                  )}
                </div>

                <div className="opts">
                  {OPTIONS.map((o) => (
                    <button
                      key={o.id}
                      className={`opt${choice === o.id ? " on" : ""}`}
                      style={{ ["--h" as string]: o.hue }}
                      onClick={() => pick(o.id)}
                    >
                      <b>{o.label}</b>
                      <span>{o.tag}</span>
                    </button>
                  ))}
                </div>

                {choice && (
                  <div className="live__locked">
                    <p>
                      Locked in: <b>{optionById(choice)?.label}</b>
                      {liveReady && sent && <em> · counted in the room</em>}
                      {!liveReady && <em> · solo mode</em>}
                    </p>
                    <button className="btn btn-primary" onClick={() => setStage("reveal")}>
                      See the room
                    </button>
                  </div>
                )}
              </div>

              <aside className="live__qr">
                <QrCode value={shareUrl} size={190} />
                <p>Scan to vote on your phone</p>
                <code>{shareUrl.replace(/^https?:\/\//, "")}</code>
              </aside>
            </div>
          </section>
        )}

        {/* ---------------- REVEAL ---------------- */}
        {stage === "reveal" && (
          <section className="live__stage">
            <p className="eyebrow">the room</p>
            <h1 className="live__q sm">
              {total === 0 ? "No votes yet." : `What ${total} ${total === 1 ? "person" : "people"} would do.`}
            </h1>

            {!liveReady && (
              <p className="live__mode">
                Solo mode, this device only. Add Supabase keys to aggregate a
                whole room live.
              </p>
            )}

            <div className="reveal">
              <svg viewBox="0 0 200 200" className="pie" role="img" aria-label="Vote distribution">
                {(() => {
                  let a = -Math.PI / 2;
                  return ranked.map(({ o, n }) => {
                    const frac = n / total;
                    const a1 = a + frac * Math.PI * 2;
                    const d = seg(100, 100, 92, 54, a, a1 - 0.012);
                    a = a1;
                    return (
                      <path
                        key={o.id}
                        d={d}
                        fill={`hsl(${o.hue} 80% 58%)`}
                        opacity={choice === o.id ? 1 : 0.82}
                      />
                    );
                  });
                })()}
                <text x="100" y="96" className="pie__n">{total}</text>
                <text x="100" y="116" className="pie__l">votes</text>
              </svg>

              <ol className="legend">
                {ranked.map(({ o, n }) => (
                  <li key={o.id} className={choice === o.id ? "mine" : ""}>
                    <i style={{ background: `hsl(${o.hue} 80% 58%)` }} />
                    <b>{o.label}</b>
                    <span>{((n / total) * 100).toFixed(0)}%</span>
                    <button onClick={() => { setAnalyseId(o.id); setStage("analyse"); }}>
                      analyse <ArrowUpRight size={13} />
                    </button>
                  </li>
                ))}
                {total === 0 && <li className="empty">Waiting for the first vote…</li>}
              </ol>
            </div>

            {/* ── AND WHAT EVERYONE EVER SAID ──────────────────────────
                The room's pie answers "what do the people in front of me
                think". This answers "what does the country think", which is the
                only nationally interesting number Kosh collects and was being
                discarded after every session.

                Bars, not a second pie: two pies side by side invite a
                shape-matching game between a sample of eleven and a sample of
                thousands, and that comparison is not one the numbers support.
                A ranked bar list reads as a reference, which is what it is. */}
            {allTotal > 0 && (
              <div className="live__all">
                <p className="live__all-h">
                  Everyone who has ever answered
                  <em>{allTotal.toLocaleString("en-IN")} answers · {live.rooms.toLocaleString("en-IN")} session{live.rooms === 1 ? "" : "s"}</em>
                </p>
                <ol className="live__all-list">
                  {allRanked.map(({ o, n }) => (
                    <li key={o.id} className={choice === o.id ? "mine" : ""}>
                      <span className="live__all-label">{o.label}</span>
                      <span className="live__all-bar">
                        <i
                          style={{
                            width: `${Math.max(3, (n / allTop) * 100)}%`,
                            background: `hsl(${o.hue} 80% 58%)`,
                          }}
                        />
                      </span>
                      <span className="live__all-pct">{((n / allTotal) * 100).toFixed(0)}%</span>
                    </li>
                  ))}
                </ol>
                <p className="live__all-n">
                  Every session ever run, added together. One answer per device
                  per session &mdash; nobody can vote twice in the same room.
                </p>
              </div>
            )}

            <div className="live__foot">
              {liveReady && (
                <button className="btn btn-glass" onClick={refresh}>
                  <RotateCcw size={15} /> Refresh
                </button>
              )}
              <button className="btn btn-primary" onClick={() => setStage("analyse")}>
                Now show them how to decide
              </button>
            </div>
          </section>
        )}

        {/* ---------------- ANALYSE ---------------- */}
        {stage === "analyse" && analysed && (
          <section className="live__stage">
            <p className="eyebrow">if kosh had analysed it for you</p>
            <h1 className="live__q sm">
              {analysed.label}
              <span className="an__tag">{analysed.tag}</span>
            </h1>

            <div className="an__pickrow">
              {OPTIONS.map((o) => (
                <button
                  key={o.id}
                  className={analysed.id === o.id ? "on" : ""}
                  onClick={() => setAnalyseId(o.id)}
                >
                  {o.label}
                </button>
              ))}
            </div>

            <div className="an">
              <div className="an__lede">
                <h3>What it actually is</h3>
                <p>{analysed.what}</p>
              </div>

              <div className="an__facts">
                <div>
                  <span>Horizon</span>
                  <b>{analysed.horizon}</b>
                </div>
                <div>
                  <span>Getting out</span>
                  <b>{analysed.liquidity}</b>
                </div>
                <div>
                  <span>Risk</span>
                  <b className="an__risk">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <i key={i} className={i <= analysed.risk ? "on" : ""} />
                    ))}
                    <em>{analysed.risk}/5</em>
                  </b>
                </div>
                <div>
                  <span>Shariah</span>
                  <b className={`an__halal ${analysed.halal}`}>
                    {analysed.halal === "yes"
                      ? "Generally permissible"
                      : analysed.halal === "screen"
                      ? "Needs screening"
                      : analysed.halal === "no"
                      ? "Interest-based"
                      : "—"}
                  </b>
                </div>
              </div>

              <div className="an__row">
                <h3>What it costs you</h3>
                <p>{analysed.costs}</p>
              </div>

              <div className="an__row warn">
                <h3>What we&rsquo;d flag</h3>
                <p>{analysed.watch}</p>
              </div>

              <div className="an__ask">
                <h3>The question we&rsquo;d ask you first</h3>
                <p>{analysed.ask}</p>
              </div>

              <p className="an__note">
                Kosh never says buy or sell. It shows the working, cites the
                source, and leaves the decision with you. Panel figures here are
                structural and illustrative, the live product pulls verified
                data per instrument.
              </p>
            </div>

            <div className="live__foot">
              <button className="btn btn-glass" onClick={() => setStage("reveal")}>
                Back to the room
              </button>
              <button className="btn btn-primary" onClick={() => setStage("play")}>
                Now find out what kind of investor you are
              </button>
            </div>
          </section>
        )}

        {/* ---------------- PLAY ---------------- */}
        {stage === "play" && (
          <section className="live__stage">
            <div className="wallet">
              <div>
                <span>Paper balance</span>
                <b>{taka(wallet.balance)}</b>
              </div>
              <div>
                <span>Rounds</span>
                <b>{wallet.rounds}</b>
              </div>
              <div>
                <span>Best round</span>
                <b>{taka(wallet.best)}</b>
              </div>
              <button className="wallet__reset" onClick={reset} title="Reset paper wallet">
                <RotateCcw size={14} /> reset
              </button>
            </div>

            <p className="live__mode play">
              Simulated taka. No real money, no deposits, nothing to win. These
              two games are built the way betting apps are built, so you can
              feel the pull, and then read exactly what it did to you.
            </p>

            <div className="games">
              <CrashGame balance={wallet.balance} onStake={placeStake} onSettle={settle} />
              <TrailGame balance={wallet.balance} onStake={placeStake} onSettle={settle} />
            </div>

            <div className={`profile ${profile.tone}`}>
              <p className="eyebrow">your read, so far</p>
              <h2>{profile.name}</h2>
              <p className="profile__p">{profile.p}</p>
              <div className="profile__stats">
                <div>
                  <span>Avg stake</span>
                  <b>{(stats.avgStakeFrac * 100).toFixed(0)}% of balance</b>
                </div>
                <div>
                  <span>Bigger bet after a loss</span>
                  <b>{(stats.chaseRate * 100).toFixed(0)}%</b>
                </div>
                <div>
                  <span>Rounds you banked</span>
                  <b>{(stats.bankedRate * 100).toFixed(0)}%</b>
                </div>
                <div>
                  <span>Wipeouts</span>
                  <b>{wallet.wipeouts}</b>
                </div>
              </div>
              <a
                className="btn btn-primary"
                href={`${KOSH_APP_URL}/?paper=${Math.round(wallet.balance)}&from=live`}
              >
                Take {taka(wallet.balance)} into Kosh and invest it properly
              </a>
              <p className="profile__note">
                In the app that balance buys real instruments at real prices —
                still simulated, but the market is not.
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="live__end">
        <span>
          Kosh Live · paper money only · starting balance {taka(START_BALANCE)}
        </span>
        <a href="/">← back to koshbd.com</a>
      </footer>
    </div>
  );
};

export default Vote;
