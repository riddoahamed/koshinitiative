import { useEffect, useState } from "react";
import { ArrowRight, PenLine, ShieldCheck, Compass } from "lucide-react";
import PageShell from "@/v2/PageShell";
import { KOSH_APP_URL } from "@/lib/links";
import Starfield from "@/v2/Starfield";
import PlatformLogo from "@/v2/PlatformLogo";
import {
  fetchTotals,
  fetchIssues,
  fetchWall,
  taka,
  EMPTY_TOTALS,
  type Totals,
  type Issue,
  type PlatformRow,
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchTotals(), fetchIssues(), fetchWall()]).then(([t, i, w]) => {
      if (!alive) return;
      setTotals(t);
      setIssues(i);
      setWall(w);
      setLoaded(true);
    });
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

  return (
    <PageShell
      title="InvestKorsi — good or bad, how did it actually go?"
      description="Anonymous reports on the platforms, funds, brokers and groups Bangladeshis invest through. What people put in, what came back, and what didn't. Good experiences count as much as bad ones. Free to read, no account needed."
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
          <p className="eyebrow" data-reveal>
            InvestKorsi
          </p>
          <h2 className="h-display" data-reveal style={{ ["--d" as string]: "70ms" }}>
            Good or bad &mdash;{" "}
            <span className="grad-text">how did it actually go?</span>
          </h2>
          <p className="h-sub" data-reveal style={{ ["--d" as string]: "140ms" }}>
            You put money into a project, a fund, a broker, or something a Facebook
            group swore by. Read what really happened to other people &mdash; then tell
            them yours. Free, and nothing traces back to whoever wrote it.
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

      {/* ── What actually goes wrong ───────────────────────────────────── */}
      {ranked.length > 0 && (
        <section className="sec ikp-issues">
          <div className="wrap">
            <h3 className="ikp__h" data-reveal>
              What actually goes wrong
            </h3>
            <p className="ikp__lede" data-reveal="fade">
              Counted from the reports themselves, not from anything we assumed.
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

      {/* ── The wall ───────────────────────────────────────────────────── */}
      <section className="sec ikp-wall">
        <div className="wrap">
          <h3 className="ikp__h" data-reveal>
            What&rsquo;s reported till now
          </h3>
          <p className="ikp__lede" data-reveal="fade">
            A summary of every place someone has written about, and how it went.
          </p>

          {active.length > 0 ? (
            <div className="ikp__cards" data-stagger="80">
              {active.map((p) => (
                <a
                  className="ikp__card glass"
                  key={p.id}
                  href={`${APP_IK}/${p.slug}`}
                  data-reveal="fade"
                >
                  <span className="ikp__cardtop">
                    <PlatformLogo domain={p.domain} name={p.name} size={30} />
                    <span className="ikp__kind">{p.kind.replace(/_/g, " ")}</span>
                  </span>
                  <h4>{p.name}</h4>
                  <p className="ikp__counts">
                    {p.reports} report{p.reports === 1 ? "" : "s"}
                    {p.bad > 0 && <em className="is-bad"> · {p.bad} went badly</em>}
                    {p.good > 0 && <em className="is-good"> · {p.good} went fine</em>}
                  </p>
                  <span className="ikp__go">
                    Read them <ArrowRight size={13} strokeWidth={2.6} />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="ikp__lede" data-reveal="fade">
              {loaded
                ? "No reports yet. The first one is the useful one."
                : "Loading the wall…"}
            </p>
          )}

          {quiet.length > 0 && (
            <div className="ikp__quiet" data-reveal="fade">
              <p className="ikp__quiet-h">
                Listed, nothing reported yet &mdash; {quiet.length} more
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
