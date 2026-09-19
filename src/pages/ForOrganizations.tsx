import { useState } from "react";
import { Building2, Factory, GraduationCap, Landmark, School, Users } from "lucide-react";
import PageShell from "@/v2/PageShell";
import AllocationBoard from "@/v2/forg/AllocationBoard";
import ScamOrNot from "@/v2/forg/ScamOrNot";
import { MAIL } from "@/v2/copy";
import "@/v2/forg/forg.css";

/* ── /for-organizations ───────────────────────────────────────────────────────
   The page a curriculum head, an HR lead or a factory's compliance manager
   opens after a meeting. Two rules run through all of it:

   · No pricing, anywhere. Scope drives the number, so the page scopes.
   · No delivery format promised. "Shaped around your existing systems" is the
     only thing said about shape, and it is said once.

   Every statistic carries its source in visible small type, because the one
   number nobody can check is the one that gets the whole page dismissed.    */

const SEGMENTS = [
  {
    icon: School,
    lead: true,
    tag: "specified below",
    anchor: "education",
    name: "Schools & school groups",
    who: "Ages 8–18 · KoshTeen and KoshFam",
    does: "Weekly lessons in tutor time, mapped to your scheme of work, with a cohort dashboard for leadership.",
  },
  {
    icon: GraduationCap,
    name: "Universities & campuses",
    who: "Undergraduates, before the first salary",
    does: "Society-run cohorts, a scam-spotting tournament, and an inter-campus final.",
  },
  {
    icon: Building2,
    anchor: "workplace",
    name: "Offices & employers",
    who: "Salaried staff, first job to first flat",
    does: "Lunch-hour cohorts: the payslip, tax, DPS against a fund, and a first investment that cannot hurt them.",
  },
  {
    icon: Factory,
    name: "RMG & factory floors",
    who: "Paid monthly, often on a shared or basic phone",
    does: "Bangla-first and audio-led, run on payday: wage safety, mobile-wallet scams, and a savings group that holds.",
  },
  {
    icon: Users,
    anchor: "csr",
    name: "NGOs & community groups",
    who: "Women's groups, cooperatives, youth programmes",
    does: "Facilitator-led sessions with a printed pack, so a session never depends on a phone being in the room.",
  },
  {
    icon: Landmark,
    name: "Banks, brokers & AMCs",
    who: "Financial partners",
    does: "People arrive already informed. One flat fee per funded account, identical for every partner, disclosed on the card.",
  },
];

const STATS = [
  {
    n: "18%",
    l: "of 15-year-olds cannot apply financial knowledge to a real decision",
    s: "OECD PISA 2022, average across the 14 OECD countries assessed",
  },
  {
    n: "63%",
    l: "already hold an account at a bank or financial institution",
    s: "OECD PISA 2022, same 14-country average",
  },
  {
    n: "11%",
    l: "reach the level where a student can reliably identify and act on a scam message",
    s: "OECD PISA 2022, top performers (Level 5)",
  },
  {
    n: "7",
    l: "the age by which the foundations of money habits are largely in place",
    s: "Whitebread & Bingham, 2013",
  },
];

const FRAMEWORK: [string, string, string, string][] = [
  ["Earn", "Where money comes from; effort and value", "Side projects, pricing, first income", "Salaries, freelancing, taxes, contracts"],
  ["Save", "Delayed gratification, goals, saving jars", "Budgeting, emergency funds, inflation", "Saving for university, currency, remittances"],
  ["Spend", "Needs against wants, advertising, peer pressure", "Comparison, subscriptions, impulse control", "Rent, bills, big purchases, debt traps"],
  ["Protect", "Keeping money safe, secrets and PINs", "Scams, phishing, digital hygiene", "Insurance, credit, fraud, gambling risk"],
  ["Grow", "What compounding is", "Risk and return, what a company is", "Investing basics, diversification, speculation"],
];

const STEPS = [
  ["30 seconds", "Hook", "A real scenario. A message, a receipt, a decision due now."],
  ["5 minutes", "Card stack", "Six to ten short cards. Visual, few words, one idea each."],
  ["3 minutes", "Check", "Not multiple choice. They predict, sort, estimate, and rate how sure they are."],
  ["5 minutes", "Do", "One small real action. Track a spend, compare two prices, set a goal."],
];

const BEYOND = [
  ["Practitioner sessions", "Analysts, founders and bankers run 45-minute live sessions", "Termly"],
  ["Scam-spotting tournament", "Timed, competitive, whole-cohort leaderboard", "Termly"],
  ["Portfolio challenge", "Paper trading judged on reasoning, not returns", "One term"],
  ["Money challenge", "Teams manage a budget or run a mock venture", "Annual"],
  ["Inter-campus final", "Winning teams from each site compete", "Annual"],
  ["Parent or family evening", "Sixty minutes on money conversations at home", "Twice yearly"],
];

const TIMELINE = [
  ["Age 6", "Buys six-packs of Coca-Cola from his grandfather's shop and sells the bottles singly."],
  ["Age 11", "Buys three shares, sells early at a small profit, and watches the price climb far higher. He calls it his lesson in patience."],
  ["Age 13", "Files his own tax return, deducting his bicycle against his newspaper-route income."],
  ["Age 14", "Buys 40 acres of farmland with his savings and rents it to a tenant farmer."],
];

const FAQ: [string, string][] = [
  [
    "How much teaching time does this take?",
    "Fifteen minutes a week. One tutor-time slot, or the tail of a pastoral lesson. Nothing is added to the timetable.",
  ],
  [
    "Does it replace or supplement what we already teach?",
    "It sits underneath. Most run it in tutor time and leave existing economics or business teaching untouched.",
  ],
  [
    "Can it map to IB, Cambridge or a national curriculum?",
    "Every cell of the framework carries learning outcomes you can align to your scheme of work. We do that mapping with your curriculum lead during scoping, not afterwards.",
  ],
  [
    "What ages is it appropriate for?",
    "Eight to eighteen, in three stages. Below eight we would rather say no than sell you something.",
  ],
  [
    "How much work is it for our staff?",
    "One three-hour onboarding, then a one-page facilitator sheet per lesson. Lessons are student-led — staff run discussion prompts rather than teaching new content.",
  ],
  [
    "What if a student has no smartphone?",
    "Three routes, and we pick between them with you: shared-device mode, where a cohort rotates through a set of tablets; a browser version that runs on any school computer; and a printed pack for the Do step, so the weekly action never depends on hardware. In this market that question decides whether a programme reaches everyone or only the students who were already fine.",
  ],
  [
    "Is there a Shariah-aligned version?",
    "Yes, as a parallel pathway rather than a separate product. Zakat and sadaqah become first-class actions and the Grow strand uses screened options. Set per school.",
  ],
  [
    "How do you measure whether it works?",
    "Baseline and endline on the same instrument, plus confidence recorded against every check. You see what a cohort believes and how sure it is, not only what it scored.",
  ],
  [
    "Does the evidence on financial education actually hold up?",
    "Partly, and we would rather say where it does not. The largest meta-analysis of financial education finds real effects on knowledge that survive adjustment for publication bias — but effects on actual behaviour are consistently smaller, and for school-based programmes smaller again. That finding is the reason this programme is built on practice and assessed on decisions under pressure rather than on recall.",
  ],
  [
    "Do students handle real money?",
    "Not by default. Balances are simulated. Real rails stay optional and per family, and Kosh never holds anyone's money.",
  ],
  [
    "What do parents see, and what do they have to do?",
    "In KoshFam, a linked account where they approve every movement and agree tasks. In KoshTeen, a termly summary. Parents are never sold anything.",
  ],
  [
    "Who owns the student data, and where is it stored?",
    "The school does. Students appear in reporting as a cohort identifier, not a name. Data sits in a managed Postgres database behind row-level access control; the hosting region is named in the agreement, and we will host in-region where your policy requires it. Our default retention is deletion within thirty days of an engagement ending, and parental consent is collected by the school on its own form before any student account exists.",
  ],
];

const Gate = () => {
  const [f, setF] = useState({ name: "", org: "", role: "", email: "" });
  const ok = f.name.trim() && f.org.trim() && f.role.trim() && f.email.trim();

  /* Four fields, and they compose an email rather than posting to a store we
     have not built. A form that pretends to file a request it cannot file is
     worse than a mailto, and this page is read by people who check. */
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ok) return;
    const body = `Name: ${f.name}\nOrganisation: ${f.org}\nRole: ${f.role}\nEmail: ${f.email}\n\nPlease send the Kosh programme overview.`;
    window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(
      "Kosh programme overview request"
    )}&body=${encodeURIComponent(body)}`;
  };

  const field = (k: keyof typeof f, label: string, type = "text") => (
    <div className="fo-field">
      <label htmlFor={`fo-${k}`}>{label}</label>
      <input
        id={`fo-${k}`}
        type={type}
        value={f[k]}
        required
        onChange={(e) => setF({ ...f, [k]: e.target.value })}
      />
    </div>
  );

  return (
    <form className="fo-form" onSubmit={send}>
      {field("name", "Name")}
      {field("org", "Organisation")}
      {field("role", "Role")}
      {field("email", "Email", "email")}
      <div className="fo-form__actions">
        <button className="fo-btn fo-btn--lime" type="submit" disabled={!ok}>
          Request the overview
        </button>
        <a className="fo-btn fo-btn--ghost" href={`mailto:${MAIL}?subject=${encodeURIComponent("Kosh programme — proposal request")}`}>
          Just email us
        </a>
      </div>
      <p className="fo-form__note">
        Four fields, and they open your mail app — nothing is stored by this page. We reply with the
        overview and the framework mapping.
      </p>
    </form>
  );
};

const ForOrganizations = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <PageShell path="/for-organizations" backTo="/">
      <div className="fo">
        {/* ── 01 hero ─────────────────────────────────────────────────── */}
        <div className="fo-wrap">
          <div className="fo-hero">
            <div>
              <p className="fo-eyebrow">Kosh for organizations</p>
              <h1 className="fo-h1">
                Most financial literacy programmes lose the room in <em>four minutes</em>.
              </h1>
              <p className="fo-kicker">
                Ours is fifteen minutes a week, on a phone, and people finish it. Built for schools
                first — and run the same way on a campus, a factory floor and an office.
              </p>
              <div className="fo-cta">
                <a className="fo-btn" href="#fo-demo">
                  Try a lesson
                </a>
                <a className="fo-btn fo-btn--ghost" href="#fo-start">
                  Get the overview
                </a>
              </div>
            </div>
            <div>
              <div className="fo-phone" aria-hidden="true">
                <div className="fo-screen">
                  <div className="fo-notch" />
                  <div className="fo-smsfrom">bPay · +880 1XXX-XXXXXX</div>
                  <div className="fo-sms">
                    Your account will be <b>suspended today</b>. Verify your PIN within 30 minutes to
                    keep your balance safe.
                  </div>
                  <div className="fo-swipe" style={{ marginTop: "auto" }}>
                    <span className="fo-swipe__no" style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 8, fontSize: ".8rem", fontWeight: 700 }}>
                      Real
                    </span>
                    <span className="fo-swipe__yes" style={{ flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 8, fontSize: ".8rem", fontWeight: 700 }}>
                      Scam
                    </span>
                  </div>
                </div>
              </div>
              <div className="fo-phlabel">Round 1 of 3 · 40 seconds</div>
            </div>
          </div>
        </div>

        {/* ── 02 segments ─────────────────────────────────────────────── */}
        <section className="fo-sec">
          <div className="fo-wrap">
            <h2 className="fo-h2">Six rooms. The same fifteen minutes.</h2>
            <p className="fo-sub">
              The loop does not change. The reading level, the language and the device do.
            </p>
            <div className="fo-segs">
              {SEGMENTS.map((s) => (
                /* The menu offers Education, Employee wellness and CSR as three
                   propositions; each needs to land on the card that answers it
                   rather than at the top of a long page. */
                <div
                  className={`fo-seg ${s.lead ? "fo-seg--lead" : ""}`}
                  key={s.name}
                  id={"anchor" in s ? (s as { anchor?: string }).anchor : undefined}
                >
                  <s.icon className="fo-seg__icon" size={22} strokeWidth={1.8} />
                  {s.tag && <span className="fo-seg__tag">{s.tag}</span>}
                  <h3 className="fo-h3">{s.name}</h3>
                  <p className="fo-seg__who">{s.who}</p>
                  <p className="fo-seg__does">{s.does}</p>
                </div>
              ))}
            </div>
            <p className="fo-note">
              Schools is the programme specified on this page and the one running today. The other
              five run the same loop at a different reading level, and each is scoped with its first
              partner before it is sold. We would rather say that here than have you find it out in
              term two.
            </p>
          </div>
        </section>

        {/* ── 03 problem ──────────────────────────────────────────────── */}
        <section className="fo-sec fo-sec--wash">
          <div className="fo-wrap">
            <h2 className="fo-h2">People handle money before anyone teaches them how.</h2>
            <div className="fo-stats">
              {STATS.map((s) => (
                <div className="fo-stat" key={s.n + s.l}>
                  <div className="fo-stat__n fo-num">{s.n}</div>
                  <div className="fo-stat__l">{s.l}</div>
                  <div className="fo-stat__s">{s.s}</div>
                </div>
              ))}
            </div>
            <div className="fo-pull">The gap is not information. It is practice.</div>
            <p className="fo-note">
              Bangladesh did not take part in PISA. These are the participating countries, quoted as
              what they are — the closest measured picture there is, not a claim about your cohort.
            </p>
          </div>
        </section>

        {/* ── 04 demo ─────────────────────────────────────────────────── */}
        <section className="fo-sec fo-sec--dark" id="fo-demo">
          <div className="fo-wrap">
            <h2 className="fo-h2">Do the lesson before you read about it.</h2>
            <p className="fo-sub">
              Two exercises from the first term. No sign-up, nothing stored, ninety seconds each.
            </p>
            <div className="fo-demogrid">
              <AllocationBoard />
              <ScamOrNot />
            </div>
          </div>
        </section>

        {/* ── 05 programmes ───────────────────────────────────────────── */}
        <section className="fo-sec">
          <div className="fo-wrap">
            <h2 className="fo-h2">Two programmes, one framework.</h2>
            <div className="fo-prod">
              <div className="fo-pcard fo-pcard--lead">
                <div className="fo-pcard__range">KoshTeen · ages 13–18</div>
                <h3 className="fo-h3">Pre-adult money training, inside curriculum time.</h3>
                <p style={{ marginTop: 14 }}>
                  Students earn, allocate, invest and defend the decision. Every exercise ends in a
                  choice with a consequence attached.
                </p>
                <ul className="fo-plist">
                  <li>Fifteen-minute weekly lessons, phone or shared device</li>
                  <li>Simulated balances by default, real rails optional per family</li>
                  <li>Paper portfolio judged on reasoning, not returns</li>
                  <li>Confidence recorded on every check</li>
                </ul>
                <div className="fo-shariah">
                  A Shariah-aligned pathway runs in parallel: zakat and sadaqah as first-class
                  actions, screened options in the Grow strand.
                </div>
              </div>

              <div className="fo-pcard">
                <div className="fo-pcard__range">KoshFam · ages 8–14</div>
                <h3 className="fo-h3">A supervised family account, parent alongside.</h3>
                <p style={{ marginTop: 14 }}>
                  Younger students learn beside a parent rather than instead of one. The school sets
                  the curriculum; the family supplies the real decisions.
                </p>
                <ul className="fo-plist">
                  <li>Linked parent and child accounts, parent approves each movement</li>
                  <li>Money coach answering in plain Bangla or English</li>
                  <li>Tasks agreed between parent and child, fixed weekly pay day</li>
                  <li>Optional parent match on anything the child keeps</li>
                </ul>
                <div className="fo-shariah">
                  Paid work is negotiated and optional. Household contribution stays unpaid and
                  expected. The programme never pays for the second, and never blurs the two.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 06 framework ────────────────────────────────────────────── */}
        <section className="fo-sec fo-sec--wash">
          <div className="fo-wrap">
            <h2 className="fo-h2">Five strands, three stages.</h2>
            <div className="fo-tablewrap">
              <table className="fo-table">
                <thead>
                  <tr>
                    <th />
                    <th>Foundation · 8–11</th>
                    <th>Builder · 12–14</th>
                    <th>Launch · 15–18</th>
                  </tr>
                </thead>
                <tbody>
                  {FRAMEWORK.map(([strand, a, b, c]) => (
                    <tr key={strand}>
                      <th scope="row">{strand}</th>
                      <td>{a}</td>
                      <td>{b}</td>
                      <td>{c}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="fo-cross">
              <strong>Values and impact</strong> runs through every stage: giving, ethical finance,
              Shariah-aligned options, and using money well.
            </div>
          </div>
        </section>

        {/* ── 07 lesson ───────────────────────────────────────────────── */}
        <section className="fo-sec">
          <div className="fo-wrap">
            <h2 className="fo-h2">Fifteen minutes. Four parts.</h2>
            <div className="fo-steps">
              {STEPS.map(([t, h, p]) => (
                <div className="fo-step" key={h}>
                  <div className="fo-step__t">{t}</div>
                  <h3 className="fo-h3">{h}</h3>
                  <p>{p}</p>
                </div>
              ))}
            </div>
            <div className="fo-lessons">
              {[
                ["Spend · Builder", "Why the second bottle is cheaper"],
                ["Protect · Launch", "Your friend's cousin has a scheme"],
                ["Grow · Launch", "What ৳500 a month becomes"],
              ].map(([tag, title]) => (
                <div className="fo-lcard" key={title}>
                  <div className="fo-ltag">{tag}</div>
                  <h3 className="fo-h3">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 08 beyond ───────────────────────────────────────────────── */}
        <section className="fo-sec fo-sec--wash">
          <div className="fo-wrap">
            <h2 className="fo-h2">It does not live only on a screen.</h2>
            <div className="fo-rows">
              {BEYOND.map(([n, d, f]) => (
                <div className="fo-row" key={n}>
                  <div className="fo-row__n">{n}</div>
                  <div className="fo-row__d">{d}</div>
                  <div className="fo-row__f">{f}</div>
                </div>
              ))}
            </div>
            <p className="fo-note">
              Which of these runs in your first term is agreed at scoping. We would rather cut a row
              than put a name on a roster we cannot fill.
            </p>
          </div>
        </section>

        {/* ── 09 staff + dashboard ────────────────────────────────────── */}
        <section className="fo-sec">
          <div className="fo-wrap">
            <h2 className="fo-h2">Your people run it. We do not add a subject to the week.</h2>
            <div className="fo-two">
              <div>
                <ul className="fo-check">
                  <li>One three-hour onboarding per site, delivered in person</li>
                  <li>Facilitation, not instruction — lessons are learner-led</li>
                  <li>A one-page facilitator sheet with every lesson</li>
                  <li>A named Kosh contact for the whole engagement</li>
                  <li>Refresher at the start of each year</li>
                </ul>
                <p className="fo-sub">
                  Reporting is a dashboard leadership can open, not a spreadsheet emailed once a
                  term. It shows what a cohort believes, not only what it scored.
                </p>
              </div>
              <div>
                <div className="fo-dash">
                  <div className="fo-dash__head">
                    <span>Year 9 · Autumn term</span>
                    <span>214 students</span>
                  </div>
                  {[
                    ["Earn", 78, false],
                    ["Save", 71, false],
                    ["Spend", 64, false],
                    ["Protect", 41, true],
                    ["Grow", 37, true],
                  ].map(([name, v, warn]) => (
                    <div className="fo-drow" key={String(name)}>
                      <span className="fo-dname">{name}</span>
                      <span className="fo-dbar">
                        <i className={warn ? "fo-dbar--warn" : ""} style={{ width: `${v}%` }} />
                      </span>
                      <span className="fo-dnum fo-num">{v}</span>
                    </div>
                  ))}
                  <div className="fo-dfoot">
                    Confidence exceeds accuracy by 22 points in Protect. Flagged for the spring
                    scam-spotting unit.
                  </div>
                </div>
                <p className="fo-illus">Illustration of the leadership view, with sample figures.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 10 early ────────────────────────────────────────────────── */}
        <section className="fo-sec fo-sec--wash">
          <div className="fo-wrap">
            <h2 className="fo-h2">The people who understood money early did not learn it in a classroom.</h2>
            <div className="fo-tl">
              {TIMELINE.map(([age, text]) => (
                <div className="fo-tl__i" key={age}>
                  <div className="fo-tl__age">{age}</div>
                  <div className="fo-tl__t">{text}</div>
                </div>
              ))}
            </div>
            <div className="fo-closeline">
              None of it needed a trading account or an unusual family. It needed somebody letting a
              child handle real decisions early, and talking about them afterwards. That is what the
              programme reproduces, at scale, for the ones who will not get it at home.
            </div>
          </div>
        </section>

        {/* ── 11 engagements + faq ────────────────────────────────────── */}
        <section className="fo-sec" id="fo-start">
          <div className="fo-wrap">
            <h2 className="fo-h2">How engagements start.</h2>
            <div className="fo-eng">
              <div className="fo-ecard">
                <h3 className="fo-h3">Pilot</h3>
                <ul>
                  <li>One group, one site</li>
                  <li>A single term, with a defined start and end</li>
                  <li>Baseline and endline measurement</li>
                  <li>A written read-out to leadership</li>
                </ul>
              </div>
              <div className="fo-ecard">
                <h3 className="fo-h3">Full programme</h3>
                <ul>
                  <li>Multiple cohorts across one site</li>
                  <li>Full framework, mapped to your scheme of work</li>
                  <li>Onboarding and termly events included</li>
                  <li>Leadership dashboard across every cohort</li>
                </ul>
              </div>
              <div className="fo-ecard">
                <h3 className="fo-h3">Group programme</h3>
                <ul>
                  <li>Every site in a group, under one agreement</li>
                  <li>Cross-site competitions and comparative reporting</li>
                  <li>Shariah-aligned pathway available per site</li>
                  <li>Delivery shaped around your existing systems, agreed during scoping</li>
                </ul>
              </div>
            </div>
            <p className="fo-note">
              Scope drives the number, so we scope first. Tell us the groups, the time available and
              who inside your organisation would own it, and we come back with a written proposal.
            </p>

            <div className="fo-faq">
              {FAQ.map(([q, a], idx) => (
                <div className="fo-q" key={q}>
                  <button
                    className="fo-q__btn"
                    onClick={() => setOpen(open === idx ? null : idx)}
                    aria-expanded={open === idx}
                    aria-controls={`fo-a-${idx}`}
                  >
                    <span>{q}</span>
                    <i aria-hidden="true">{open === idx ? "−" : "+"}</i>
                  </button>
                  <div className="fo-q__a" id={`fo-a-${idx}`} hidden={open !== idx}>
                    {a}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 12 close ────────────────────────────────────────────────── */}
        <section className="fo-sec fo-sec--dark">
          <div className="fo-wrap">
            <h2 className="fo-h2">Start with one group and one term.</h2>
            <p className="fo-sub">
              We would rather prove it on a cohort than describe it in a meeting. Tell us which
              group, and we come back with a scoped proposal.
            </p>
            <Gate />
          </div>
        </section>
      </div>
    </PageShell>
  );
};

export default ForOrganizations;
