import { useEffect, useState } from "react";
import { ArrowRight, PenLine, ShieldCheck, Compass } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { KOSH_APP_URL } from "@/lib/links";
import Starfield from "@/v2/Starfield";
import PlatformLogo from "@/v2/PlatformLogo";
import PerpetualPoll from "@/v2/vote/PerpetualPoll";
import {
  fetchTotals,
  fetchIssues,
  fetchWall,
  fetchClasses,
  taka,
  EMPTY_TOTALS,
  type Totals,
  type Issue,
  type PlatformRow,
  type ClassRow,
} from "@/lib/investkorsiData";

/* ── /investkorsi ─────────────────────────────────────────────────────────────

   The dashboard, on the marketing domain. This page used to be a 307 to the
   app; it is a real page now because "see what people reported" is the single
   thing Kosh can offer a total stranger that costs them nothing and requires
   believing nothing. Sending that stranger to an app domain first was asking
   for the trust before doing the work.

   IT IS A FUNNEL, IN THIS ORDER, AND THE ORDER IS THE POINT:

     1. SEE      — real numbers, what goes wrong, who has been reported on.
     2. LEARN    — now you know it happens, learn to spot it yourself.
     3. DISCOVER — then go find something actually worth your money.

   Reading happens here. WRITING happens in the app: the report form is an
   anonymous RPC keyed on a localStorage uuid with rate limits and a
   one-report-per-investment unique index, and duplicating that here would mean
   two implementations of the promise "this cannot be traced to you". One.

   ── WHAT THIS PAGE MAY AND MAY NOT SAY ──────────────────────────────────────
   It shows aggregates and links out to the app for the reports themselves.
   That is not squeamishness, it is the honest split: the app's platform pages
   carry the full disclosure and, where there is one, the company's verbatim
   denial. Re-publishing an allegation on a second domain stripped of the
   response is how a data page turns into a claim.

   "Stuck" is only ever said of `amountBad` — the sum over reports whose
   sentiment is bad. `amount_total` includes money that came back perfectly
   fine, and that distinction is defamatory to get wrong, not cosmetic. */

const APP_IK = `${KOSH_APP_URL}/investkorsi`;

function Stat({ figure, label }: { figure: string; label: string }) {
  return (
    <div className="ikp__stat" data-reveal="fade">
      <b className="grad-text">{figure}</b>
      <span>{label}</span>
    </div>
  );
}

export default function InvestKorsiPage() {
  const [totals, setTotals] = useState<Totals>(EMPTY_TOTALS);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [wall, setWall] = useState<PlatformRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchTotals(), fetchIssues(), fetchWall(), fetchClasses()]).then(
      ([t, i, w, c]) => {
        if (!alive) return;
        setTotals(t);
        setIssues(i);
        setWall(w);
        setClasses(c);
        setLoaded(true);
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  /* Reported-on platforms lead. The rest become a dense name list rather than
     rows of "no reports yet" — 28 identical empty rows read as an abandoned
     site, and nobody files the first report on one of those. */
  const active = wall.filter((p) => p.reports > 0).sort((a, b) => b.reports - a.reports);
  const quiet = wall.filter((p) => p.reports === 0);

  /* Bars scale to the biggest issue, not to the total: against the total,
     everything on a young wall is an unreadable sliver. */
  const ranked = issues.filter((i) => i.reportCount > 0).slice(0, 6);
  const topIssue = ranked[0]?.reportCount ?? 1;

  /* ── NO FLOOR ON THE ASSET-CLASS LEDGER ──────────────────────────────────
     There was one — five classified reports — on the argument that a ledger
     built from one answer is a statistic-shaped nothing. The gate is gone at
     the user's instruction, and the honesty it was protecting is done by the
     line that was always there instead: this section states, in the same
     breath as its numbers, exactly how many reports it is counting and that
     the rest skipped the question.

     That is the better instrument anyway. A gate hides a small number; a
     stated denominator lets the reader size it themselves, which is the rule
     the whole page runs on ("3 of 4 said" beats "75%"). */
  const classified = classes.reduce((n, c) => n + c.reports, 0);
  const showClasses = classified > 0;
  const topClass = classes[0]?.reports ?? 1;

  /* The registry: every platform someone has written about, ranked, with the
     figure attached. Modelled on the public-ledger pattern — a ranked table
     with a proportion bar reads as a record, where the same numbers scattered
     across cards read as a set of opinions. */
  const registryTop = active[0]?.reports ?? 1;

  return (
    <PageShell
      path="/investkorsi"
      // Back to the section that sent them, not to the top of the homepage.
      backTo="/#investkorsi"
    >
      {/* ── 1. SEE ─────────────────────────────────────────────────────── */}
      <section className="sec ikp-hero">
        {/* The same field the homepage teaser and the app's own /investkorsi
            carry, so all three surfaces read as one product. Bounded to the
            opening section on purpose — drifting particles behind the scrolling
            wall of company logos below would be motion competing with the
            content instead of framing it. */}
        <Starfield density={1.5} />
        <div className="wrap">
          {/* ── The ledger strip ────────────────────────────────────────
              What the page IS, in one line, above what it says. A stranger
              arriving from a forwarded link needs to know they are looking at a
              running public record and not at an article about one — and the
              live counts are the cheapest possible proof of it. */}
          <p className="ikp__live" data-reveal>
            <i aria-hidden />
            <span>Live public ledger</span>
            {loaded && (
              <>
                <em>{totals.reports} report{totals.reports === 1 ? "" : "s"}</em>
                <em>{totals.platforms} platforms</em>
              </>
            )}
          </p>
          <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
            Scams, frauds, and the ones that paid.{" "}
            <span className="grad-text">Put yours on the record.</span>
          </h2>
          <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
            Platforms, companies, ventures &mdash; anywhere in Bangladesh money goes in.
            Read what really happened to other people, then tell them yours. Free, and
            nothing traces back to whoever wrote it.
          </p>
          <p className="ikp__thesis" data-reveal="fade" style={{ ["--d" as string]: "190ms" }}>
            One story is one complaint. Enough of them is knowledge a market can be
            built on.
          </p>

          <div className="ikp__stats" data-stagger="90">
            <Stat figure={loaded ? String(totals.reports) : "—"} label="reports filed" />
            <Stat figure={loaded ? String(totals.platforms) : "—"} label="platforms covered" />
            <Stat
              figure={loaded && totals.amountBad > 0 ? taka(totals.amountBad) : "—"}
              label={
                totals.amountBadReports > 0
                  ? `reported stuck, across ${totals.amountBadReports} report${totals.amountBadReports === 1 ? "" : "s"} that named a figure`
                  : "reported stuck so far"
              }
            />
          </div>

          <div className="ikp__cta" data-reveal>
            <a className="btn btn-primary" href={APP_IK}>
              <PenLine size={16} strokeWidth={2.2} /> Add your report
            </a>
            <a className="btn btn-glass" href={APP_IK}>
              Read every report <ArrowRight size={16} strokeWidth={2.4} />
            </a>
          </div>
          <p className="ikp__note" data-reveal="fade">
            Fifteen seconds, no account, no email. One report per investment, so nobody can pile
            on a company and nobody can pad their own.
          </p>
        </div>
      </section>

      {/* ── The two outcomes, as two stickers ───────────────────────────
          A joke, doing a job. Everything above and below this is a number
          about somebody's lost money, and a page that is only that gets closed
          — but the reason to lighten it HERE specifically is that this is the
          exact point where the reader has to be told the thing they are least
          likely to believe: that good reports matter as much as bad ones. A
          wall built only out of anger measures the wrong thing and gets
          dismissed as a complaints board. Two frogs land that in a second,
          which no amount of earnest copy was doing.

          ── STICKERS, NOT CARDS ────────────────────────────────────────────
          No border, no plate, no figure box. An earlier pass put each one in a
          bordered card with a caption panel, which turned a reaction image
          into a thumbnail of a reaction image — the frame announces "here is
          an illustration we have placed" where a sticker just IS on the page.
          Transparent SVG straight on the background, one nudged off-axis, is
          the whole treatment.

          ── AND WHY THEY ARE DRAWN AND NOT SOURCED ─────────────────────────
          The tea-sipping frog everybody pictures is Kermit (Disney) and the
          panicking one is Pepe. Neither is available to a commercial finance
          site. Photographs of real frogs were tried and were wrong in register:
          the format being borrowed is a reaction sticker, and a photo of a frog
          is a photo of a frog. These are one original character in two states,
          which also means no attribution line and nothing to re-source.
          See public/img/ik/credits.json. */}
      <section className="sec ikp-frogs">
        <div className="wrap">
          <div className="ikp__frogs">
            <div className="ikp__frog" data-reveal="scale">
              <img src="/img/ik/frog-calm.svg" alt="" aria-hidden width={240} height={200} />
              <p><b>It paid.</b> Money came back, on time, like they said it would.</p>
            </div>
            <div className="ikp__frog ikp__frog--tilt" data-reveal="scale">
              <img src="/img/ik/frog-panic.svg" alt="" aria-hidden width={240} height={200} />
              <p><b>It didn&rsquo;t.</b> Went quiet, went late, or went nowhere at all.</p>
            </div>
          </div>
          <p className="ikp__frogs-n" data-reveal="fade">
            Both belong here. Which places actually paid is most of what the next
            person came to find out.
          </p>
        </div>
      </section>

      {/* ── The ৳10 lakh question ───────────────────────────────────────
          Placed straight after the two frogs on purpose. The reader has just
          been shown the two things that can happen to money; "so what would you
          do with yours?" is the natural next beat, and it is the one moment on
          this page where they are asked to put something IN rather than take
          something out. Everything above it is other people's money. */}
      <PerpetualPoll />

      {/* ── What actually goes wrong ───────────────────────────────────── */}
      {ranked.length > 0 && (
        <section className="sec ikp-issues">
          <div className="wrap">
            <h3 className="ikp__h" data-reveal>
              What actually goes wrong
            </h3>
            <p className="ikp__lede" data-reveal="fade">
              Counted from the reports themselves, not from anything we assumed.
              People pick from a list or write their own words, and we group
              answers that mean the same thing so they can be counted together.
            </p>
            <div className="ikp__issues" data-stagger="70">
              {ranked.map((i) => (
                <div className="ikp__issue" key={i.slug} data-reveal="fade">
                  <div className="ikp__issue-row">
                    <span>{i.label}</span>
                    <b>{i.reportCount}</b>
                  </div>
                  <div className="ikp__bar">
                    <i style={{ width: `${Math.max(6, (i.reportCount / topIssue) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── What kind of investment ────────────────────────────────────
          The more useful question than "which platform", because a stranger
          can act on it before they have picked a company. */}
      {showClasses && (
        <section className="sec ikp-classes">
          <div className="wrap">
            <h3 className="ikp__h" data-reveal>
              And what kind of investment it was
            </h3>
            <p className="ikp__lede" data-reveal="fade">
              Counted from the {classified} report{classified === 1 ? "" : "s"} that said
              what they put money into. The rest skipped the question, and a skipped
              question is never counted as an answer.
            </p>
            <div className="ikp__issues" data-stagger="70">
              {classes.map((c) => (
                <div className="ikp__issue" key={c.key} data-reveal="fade">
                  <div className="ikp__issue-row">
                    <span>{c.label}</span>
                    <b>
                      {c.reports}
                      {c.bad > 0 && <i className="ikp__bad"> · {c.bad} badly</i>}
                    </b>
                  </div>
                  <div className="ikp__bar">
                    <i style={{ width: `${Math.max(6, (c.reports / topClass) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── The register ────────────────────────────────────────────────
          A ranked table, numbered, with the figure and a proportion bar. The
          same facts were already on this page as a grid of cards; a card grid
          reads as a set of opinions somebody collected, and a numbered register
          reads as a record that is being kept. That difference is most of what
          makes a public ledger persuasive, and none of the underlying numbers
          change.

          Kept honest by the same rules as everywhere else: only `amountBad` is
          ever printed next to the word stuck, and the bar is scaled to the top
          row rather than to the total — against a total, everything on a young
          ledger is an unreadable sliver. */}
      {active.length > 0 && (
        <section className="sec ikp-registry">
          <div className="wrap">
            <h3 className="ikp__h" data-reveal>
              The register
            </h3>
            <p className="ikp__lede" data-reveal="fade">
              Every platform, company or venture someone has written about, ranked by
              how much has been said. Not by how bad it was &mdash; we have not judged
              any of them.
            </p>
            <ol className="ikp__reg" data-stagger="60">
              {active.map((p, i) => (
                <li key={p.id} data-reveal="fade">
                  <a href={`${APP_IK}/${p.slug}`}>
                    <span className="ikp__reg-n">{String(i + 1).padStart(2, "0")}</span>
                    <PlatformLogo domain={p.domain} name={p.name} size={26} />
                    <span className="ikp__reg-main">
                      <b>{p.name}</b>
                      <span className="ikp__reg-sub">
                        {p.reports} report{p.reports === 1 ? "" : "s"}
                        {p.bad > 0 && <em className="is-bad"> · {p.bad} went badly</em>}
                        {p.good > 0 && <em className="is-good"> · {p.good} went fine</em>}
                      </span>
                      <span className="ikp__bar">
                        <i style={{ width: `${Math.max(6, (p.reports / registryTop) * 100)}%` }} />
                      </span>
                    </span>
                    <span className="ikp__reg-amt">
                      {p.amountBadReports > 0 ? (
                        <>
                          <b>{taka(p.amountBad)}</b>
                          <span>reported stuck</span>
                        </>
                      ) : (
                        <span className="ikp__reg-none">no figure given</span>
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
            <p className="ikp__quiet-n">
              Every entry is one person&rsquo;s unverified account. A figure appears only
              where somebody chose to name one.
            </p>
          </div>
        </section>
      )}

      {/* ── The rest of the directory ────────────────────────────────────
          The card grid that used to sit here showed the same platforms the
          register above now lists, twice over. The register won: it carries the
          rank, the figure and the proportion, which the cards did not, and two
          renderings of one list is how a page stops looking like it knows what
          it is saying.

          What is left here is the half the register cannot show — the places
          nobody has written about yet, which is a call to action rather than a
          record. */}
      <section className="sec ikp-wall">
        <div className="wrap">
          {quiet.length > 0 && (
            <div className="ikp__quiet" data-reveal="fade">
              <h3 className="ikp__h">Listed, nothing reported yet</h3>
              <p className="ikp__quiet-h" style={{ marginTop: 10 }}>
                {quiet.length} place{quiet.length === 1 ? "" : "s"} nobody has written about
              </p>
              <div className="ikp__quiet-list">
                {quiet.map((p) => (
                  <a key={p.id} href={`${APP_IK}/${p.slug}`}>
                    <PlatformLogo domain={p.domain} name={p.name} size={22} />
                    {p.name}
                  </a>
                ))}
              </div>
              <p className="ikp__quiet-n">
                An empty row is not a clean record. It means nobody has said anything yet.
              </p>
            </div>
          )}

          <div className="ikp__missing" data-reveal="fade">
            <p className="ikp__missing-h">Not seeing yours?</p>
            <p className="ikp__missing-p">
              Any platform, firm, brokerage, collective or Facebook group can be
              added &mdash; and it is listed the moment you add it.
            </p>
            <a className="btn btn-glass" href={`${APP_IK}?add=1`}>
              Add a platform <ArrowRight size={14} strokeWidth={2.6} />
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. LEARN  ·  3. DISCOVER ───────────────────────────────────── */}
      <section className="sec ikp-next">
        <div className="wrap">
          <h3 className="ikp__h" data-reveal>
            Reading this is step one
          </h3>
          <p className="ikp__lede" data-reveal="fade">
            Knowing it happens is not the same as being able to see it coming.
          </p>

          <div className="ikp__steps" data-stagger="110">
            <a className="ikp__step glass" href={`${KOSH_APP_URL}/learn`} data-reveal="fade">
              <ShieldCheck size={22} strokeWidth={1.7} />
              <b>Learn to spot it yourself</b>
              <p>
                The five tells every one of these shares, and why the paperwork matters more than
                the promised return.
              </p>
              <span className="ikp__go">
                Start a lesson <ArrowRight size={13} strokeWidth={2.6} />
              </span>
            </a>

            <a className="ikp__step glass" href={`${KOSH_APP_URL}/invest`} data-reveal="fade">
              <Compass size={22} strokeWidth={1.7} />
              <b>Then find what is worth it</b>
              <p>
                Sanchaypatra, DPS, FDR, funds and shares &mdash; what each one really pays after
                tax, with the numbers shown.
              </p>
              <span className="ikp__go">
                Explore options <ArrowRight size={13} strokeWidth={2.6} />
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="sec ikp-fine">
        <div className="wrap">
          <p className="disclaim" data-reveal="fade">
            Every figure here is a count of what people reported about their own money. Kosh has
            not investigated any company listed and takes no position on any of them. A report is
            one person&rsquo;s account, and the platform pages carry the full context, including
            any response the company has given.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
