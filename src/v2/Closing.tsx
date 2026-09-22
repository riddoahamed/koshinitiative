import { useEffect, useState } from "react";
import { ArrowUpRight, GraduationCap, Landmark, BarChart3, Download } from "lucide-react";
import { KOSH_APP_URL, KOSH_DOWNLOAD_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";
import { AndroidGlyph } from "./AndroidGlyph";
import { MAIL, mailto, VP_SHORT } from "./copy";
import { setScrollLock } from "./scrollLock";
import ShaderBg from "./ShaderBg";
import Starfield from "./Starfield";
import QrCode from "./QrCode";

/* ---------------- ORGS — institutions + financial partners ---------------- */
export const Orgs = () => (
  <section className="sec paper-sec orgs" id="organizations">
    <div className="wrap">
      <div className="orgs__inner">
        <p className="eyebrow" data-reveal>for organizations</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          Bring Kosh to the people you serve.
        </h2>
        <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
          Learning stays free for everyone. Institutions run Kosh as a program, and
          financial partners meet people who arrive already informed.
        </p>
        <div className="orows" data-stagger="130">
          <div className="orow" data-reveal="left">
            <div className="orow__icon"><GraduationCap size={20} strokeWidth={1.9} /></div>
            <div>
              <h3>Campus &amp; workplace programs</h3>
              <p>
                Run a cohort at your university, factory, or office: a live session
                to start, then per-seat access for everyone who keeps going.
              </p>
            </div>
          </div>
          <div className="orow" data-reveal="left">
            <div className="orow__icon"><Landmark size={20} strokeWidth={1.9} /></div>
            <div>
              <h3>Financial partners</h3>
              <p>
                Brokers, asset managers, and banks reach people who arrive ready,
                with a pre-filled application. One flat fee per funded account,
                identical for every partner, disclosed on the card.
              </p>
            </div>
          </div>
          <div className="orow" data-reveal="left">
            <div className="orow__icon"><BarChart3 size={20} strokeWidth={1.9} /></div>
            <div>
              <h3>Outcomes you can audit</h3>
              <p>
                Every cohort is instrumented. See what people learned, practised,
                and actually did with their money. Not an attendance sheet.
              </p>
            </div>
          </div>
        </div>
        <p className="orgs__note" data-reveal="fade">
          We never hold anyone&rsquo;s money. Accounts are opened at a named
          institution on disclosed terms, and no verdict is ever purchasable.
        </p>
        <div className="orgs__cta" data-reveal>
          <a className="btn" href="/for-organizations">See the programmes</a>
          <a className="btn btn-glass" href={mailto("Kosh partnership")}>Work with us</a>
        </div>
      </div>
    </div>
  </section>
);

/* ---------------- VISION ---------------- */
export const Vision = () => (
  <section className="sec vision" id="vision">
    <ShaderBg intensity={0.7} />
    <div className="veil" aria-hidden="true" />
    <div className="wrap">
      <p className="eyebrow" data-reveal>the long game</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        The trusted decision layer for emerging markets.
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Starting in Bangladesh, Kosh connects financial uncertainty with real
        opportunity, helping people move safely from curiosity to confident
        action. The same gap exists across every emerging market we know.
      </p>

      <div className="vision__cols">
        <div className="vcol now" data-reveal>
          <span className="vcol__tag"><span className="vcol__led" /> now</span>
          <ul>
            <li>Bangladesh <span>· live in beta</span></li>
            <li>Discovery, learning, paper investing</li>
          </ul>
        </div>
        <div className="vcol" data-reveal style={{ ["--d" as string]: "120ms" }}>
          <span className="vcol__tag">next</span>
          <ul>
            <li>Campus &amp; workplace programs</li>
            <li>White-label decision engine</li>
          </ul>
        </div>
        <div className="vcol" data-reveal style={{ ["--d" as string]: "240ms" }}>
          <span className="vcol__tag">later</span>
          <ul>
            <li>Regulated investing</li>
            <li>Diaspora corridors <span>· Dubai, Toronto, London</span></li>
          </ul>
        </div>
      </div>

      <p className="vision__close" data-reveal>
        The future of finance isn&rsquo;t more information. It&rsquo;s{" "}
        <span className="shimmer">better decisions</span>, made possible for
        everyone.
      </p>
    </div>
  </section>
);

/* ---------------- FOUNDER ---------------- */
export const Founder = () => (
  <section className="sec paper-sec founder" id="story">
    <div className="wrap">
      <p className="eyebrow" data-reveal>why kosh exists</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        We watched people learn, and still freeze.
      </h2>

      <div className="founder__card" data-reveal>
        <div className="founder__letter">
          <p>
            Kosh began as a literacy project: workshops, posters, a small
            gamified app. It worked. People learned. Then, at the last step,
            almost everyone froze at the same question:{" "}
            <em>“Okay… but what should I do?”</em>
          </p>
          <p>
            More content wasn&rsquo;t the answer. A platform that helps you{" "}
            <em>decide</em> was. So we&rsquo;re building it, honestly, in public,
            from Dhaka.
          </p>
          <div className="founder__sig">
            <b>Sheikh Sajid Ahamed</b>
            <span>
              Founder, Kosh ·{" "}
              <a href="https://www.linkedin.com/in/sheikhsajid-riddo/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </span>
          </div>
        </div>
        <figure className="founder__poster">
          <img
            src="/img/poster-v1.webp"
            alt="The original Kosh V1 poster. Learn small. Grow big."
            loading="lazy"
          />
          <figcaption>where it started · v1</figcaption>
        </figure>
      </div>
    </div>
  </section>
);

/* ---------------- JOIN ---------------- */
const TRACKS = [
  { t: "Careers", p: "Small team, huge surface area. Ship things that matter.", s: "Careers at Kosh" },
  { t: "Internships", p: "Real product, real users, real responsibility, in weeks.", s: "Kosh internship" },
  { t: "Campus ambassadors", p: "Bring Kosh to your university. Lead the money conversation.", s: "Kosh campus ambassador" },
  { t: "Research", p: "Study financial confidence and inclusion with us.", s: "Kosh research collaboration" },
  { t: "Partnerships", p: "Banks, brokers, NGOs, employers. Build it with us.", s: "Kosh partnership" },
];

export const Join = () => (
  <section className="sec join" id="join">
    <Starfield density={0.8} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>join us</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Build the treasury with us.
      </h2>
      <div className="join__rows" data-stagger="90">
        {TRACKS.map((r) => (
          <a className="jrow" key={r.t} href={mailto(r.s)} data-reveal>
            <h3>{r.t}</h3>
            <p>{r.p}</p>
            <span className="go"><ArrowUpRight size={18} /></span>
          </a>
        ))}
      </div>
      <p className="join__mail" data-reveal>
        one inbox, read by humans · <a href={`mailto:${MAIL}`}>{MAIL}</a>
      </p>
    </div>
  </section>
);

/* ---------------- FOOTER ---------------- */
export const FootV2 = () => (
  <footer className="foot">
    <div className="foot__grid">
      <div className="foot__brand">
        <img src="/img/kosh-logo.png" alt="Kosh logo" />
        <div className="word">KOSH</div>
        <p className="foot__vp">{VP_SHORT}</p>
        <p className="foot__def">
          <span className="bn">কোষ</span> · a treasury; a cell. The smallest
          unit things grow from.
        </p>
        <div className="foot__qr">
          <QrCode value={KOSH_APP_URL} size={104} />
          <div>
            <b>Scan to open the beta</b>
            <span>app.koshbd.com</span>
          </div>
        </div>
      </div>
      <div>
        <h4>Free tools</h4>
        <ul>
          <li><a href="/start">Start here</a></li>
          <li><a href="/learn">Quick lessons</a></li>
          <li><a href="/quiz">What kind of investor am I?</a></li>
          <li><a href="/fdr-rates">FDR rates, every bank</a></li>
          <li><a href="/fdr-rates/faq">FDR questions</a></li>
          <li><a href="/investkorsi">InvestKorsi ledger</a></li>
          <li><a href="/vote">Kosh Live</a></li>
          {/* The footer is the site index, so the Bangla pages are listed here
              even though the menu offers them as a toggle on the page. */}
          <li className="foot__bn">
            <a href="/bn/fdr-rates" lang="bn">এফডিআর রেট</a>
            <a href="/bn/investkorsi" lang="bn">ইনভেস্টকরসি</a>
          </li>
        </ul>
      </div>
      <div>
        <h4>Products &amp; services</h4>
        <ul>
          <li><a href={KOSH_APP_URL}>The Kosh app</a></li>
          <li><a href={KOSH_DOWNLOAD_URL}>Get the Android app</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/for-organizations#education">Kosh for education</a></li>
          <li><a href="/for-organizations#workplace">Kosh for employee wellness</a></li>
          <li><a href="/for-organizations#csr">Kosh for CSR programmes</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/#story">Why Kosh</a></li>
          <li><a href="/#inclusion">Impact &amp; inclusion</a></li>
          <li><a href="/feedback">What people are asking for</a></li>
          <li><a href="/#join">Join us</a></li>
          <li><a href={KOSH_WAITLIST_EMAIL_URL}>Join the waitlist</a></li>
          <li><a href={`mailto:${MAIL}`}>Contact</a></li>
        </ul>
      </div>
      <div>
        <h4>Elsewhere</h4>
        <ul>
          <li><a href="https://instagram.com/kosh.initiative" target="_blank" rel="noreferrer">Instagram</a></li>
          <li><a href="https://facebook.com/KoshInitiative" target="_blank" rel="noreferrer">Facebook</a></li>
          <li><a href="https://www.linkedin.com/company/kosh-%E0%A6%95%E0%A7%8B%E0%A6%B7/" target="_blank" rel="noreferrer">LinkedIn</a></li>
          <li><a href="https://wa.me/8801607966000" target="_blank" rel="noreferrer">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div className="foot__base">
      <span>© 2026 Kosh · Dhaka, Bangladesh</span>
      <button className="foot__off" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v10" strokeLinecap="round" />
          <path d="M18.4 6.6a9 9 0 1 1-12.77.04" strokeLinecap="round" />
        </svg>
        power off
      </button>
    </div>
  </footer>
);

/* ---------------- NAV ----------------
   Grouped so the whole site is reachable from any page. The flat six-link
   row left /vote and half the homepage unreachable, and it was display:none
   below 860px, which meant phones had no navigation at all.

   `pinned` skips the scroll gate: sub-pages have no hero to clear, so their
   nav is visible from the first paint. */

/** `bn` is the Bangla twin of this destination, shown as a small link on the
    same row. One row per destination: listing the Bangla page separately made
    "Free tools" six rows for four things, which is the junk drawer this menu
    was reorganised to get rid of. */
interface NavItem { label: string; href: string; note?: string; bn?: string }
/** A group with `items` opens a menu. A group with a bare `href` and no items
    is a PLAIN TOP-LEVEL LINK — see the Blog entry for why that exists. */
interface NavGroup { label: string; href?: string; items: NavItem[] }

/* ── THE MENU, THIRD PASS ────────────────────────────────────────────────────

   Three groups and one standalone link, down from five groups. The shape is
   the question a visitor is actually asking:

     Start here          I want to be told what to do first
     Free tools          I want to use something right now, for nothing
     Products & services what does Kosh actually sell, and to whom
     Company             who are you

   WHAT MOVED AND WHY

   "The app" is gone as a heading. It described our org chart, not a visitor's
   need: nobody arrives wanting "the app", they arrive wanting a rate, a
   lesson or a programme for their school. The app now sits inside Products &
   services alongside the three things we sell to institutions, which is the
   honest list of what Kosh offers.

   Lessons, games and the quiz moved OUT of a learning group and INTO Free
   tools, because that is what they are to a stranger: things you can use
   today without paying or signing up. The group is the site's best front
   door and it should hold everything that needs no trust.

   FDR questions is no longer its own row. It is a section of the FDR page and
   the page links to it; a menu row for a sub-page of a page in the same menu
   is how a menu doubles in size without gaining a destination.

   The Bangla chips are gone from here too. A reader gets the switch ON the
   page, which is what a language toggle should be — a menu row per language
   makes two pages out of one and puts the machinery in front of the reader. */
interface NavItem { label: string; href: string; note?: string }
/** A group with `items` opens a menu. A group with a bare `href` and no items
    is a PLAIN TOP-LEVEL LINK — see the Blog entry for why that exists. */
/** `columns` splits a panel into labelled halves. A group of seven is a list
    you read top to bottom; the same seven under two headings is two lists of
    three you take in at a glance, and the headings do the sorting for you. */
interface NavCol { label: string; items: NavItem[] }
interface NavGroup { label: string; href?: string; items: NavItem[]; blurb?: string; columns?: NavCol[] }

const TOOLS_LEARN: NavItem[] = [
  { label: "Quick lessons", href: "/learn", note: "Two minutes each" },
  { label: "Games & simulators", href: "/#funance", note: "Practise with money that isn't real" },
  { label: "What kind of investor am I?", href: "/quiz", note: "Six questions, sixty seconds" },
];
const TOOLS_LOOKUP: NavItem[] = [
  { label: "FDR rates, every bank", href: "/fdr-rates", note: "Updated monthly, with the tax and the fine print" },
  /* The real thing, not a section about it: the app's Discover feed is
     browsable as a guest, which is what puts it in this group at all. */
  { label: "Discover investment options", href: `${KOSH_APP_URL}/invest`, note: "Savings, funds, gold, DSE. Browse as a guest" },
  { label: "InvestKorsi", href: "/investkorsi", note: "What actually happened to people's money" },
  { label: "Kosh Live", href: "/vote", note: "Run a live room" },
];
const PROD_APP: NavItem[] = [
  { label: "The Kosh app", href: "/#inside", note: "Real screens, markets, coach and games" },
  { label: "How it works", href: "/#product", note: "Agents find, humans check, you decide" },
];
const PROD_ORGS: NavItem[] = [
  { label: "Kosh for education", href: "/for-organizations#education", note: "Schools, colleges and campuses" },
  { label: "Kosh for employee wellness", href: "/for-organizations#workplace", note: "Offices, RMG and factory floors" },
  { label: "Kosh for CSR programmes", href: "/for-organizations#csr", note: "NGOs, community groups, banks" },
];

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Free tools",
    blurb: "Everything here works without an account.",
    items: [...TOOLS_LEARN, ...TOOLS_LOOKUP],
    columns: [
      { label: "Learn & practise", items: TOOLS_LEARN },
      { label: "Look it up", items: TOOLS_LOOKUP },
    ],
  },
  {
    label: "Products & services",
    items: [...PROD_APP, ...PROD_ORGS],
    columns: [
      { label: "For everyone", items: PROD_APP },
      { label: "For organisations", items: PROD_ORGS },
    ],
  },
  /* Blog stays a top-level link. It was buried in a dropdown once already and
     a blog nobody can find is a publishing programme with no readers. */
  { label: "Blog", href: "/blog", items: [] },
  {
    label: "Company",
    items: [
      { label: "Why Kosh exists", href: "/#story" },
      { label: "Impact & inclusion", href: "/#inclusion" },
      { label: "What people ask for", href: "/feedback", note: "Our open request board" },
      { label: "Join us", href: "/#join", note: "Careers, campus, research" },
    ],
  },
];

/* The landing hero gets a quieter navigation treatment than the application
   pages. These are direct section links: no dropdown chrome, no filled CTA,
   and no decorative effects competing with the machine below. */
const HERO_LINKS: NavItem[] = [
  { label: "About us", href: "/#story" },
  { label: "Product", href: "/#product" },
  { label: "Services", href: "/for-organizations" },
  { label: "Learn", href: "/learn" },
  { label: "Blog", href: "/blog" },
];

/** A `/#section` link should scroll, not reload, when we're already there. */
const useAnchorNav = () =>
  (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("/#")) return;
    const id = href.slice(2);
    if (window.location.pathname !== "/") return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth" });
    window.history.replaceState(null, "", href);
  };

/** Which group owns the page you are on, so the menu can say where you are.
 *  A menu that looks identical on every page is a menu you have to re-read
 *  every time; a marked one is the cheapest orientation there is. */
const groupForPath = (path: string): string | null => {
  const hit = NAV_GROUPS.find((g) =>
    (g.href && g.href !== "/" && path.startsWith(g.href)) ||
    g.items.some((i) => !i.href.startsWith("/#") && i.href !== "/" && path.startsWith(i.href))
  );
  return hit?.label ?? null;
};

export const NavV2 = ({ pinned = false }: { pinned?: boolean }) => {
  const [on, setOn] = useState(pinned);
  const here = typeof window === "undefined" ? null : groupForPath(window.location.pathname);
  const [open, setOpen] = useState<string | null>(null);
  const [sheet, setSheet] = useState(false);
  const go = useAnchorNav();

  useEffect(() => {
    if (pinned) return;
    const fn = () => setOn(window.scrollY > window.innerHeight * 1.6);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [pinned]);

  /* escape closes whatever is open; the sheet locks the page behind it */
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      setSheet(false);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!sheet) return;
    setScrollLock(true);
    return () => setScrollLock(false);
  }, [sheet]);

  const click = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    go(e, href);
    setOpen(null);
    setSheet(false);
  };

  if (!pinned) {
    return (
      <nav className="nav nav--hero on" aria-label="Main">
        <a className="nav__brand" href="/">
          <img src="/img/kosh-logo.png" alt="" />
          KOSH
        </a>
        <div className="nav__simple">
          {HERO_LINKS.map((item) => (
            <a key={item.href} href={item.href} onClick={(e) => click(e, item.href)}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav
        className={`nav${on ? " on" : ""}`}
        aria-label="Main"
        onMouseLeave={() => setOpen(null)}
      >
        <a className="nav__brand" href="/">
          <img src="/img/kosh-logo.png" alt="" />
          KOSH
        </a>

        <div className="nav__links">
          <a className="nav__start" href="/start">Start here</a>
          {NAV_GROUPS.map((g, i) => (
            <div
              className={`navg${open === g.label ? " open" : ""}${i === 0 ? " navg--go" : ""}${here === g.label ? " navg--here" : ""}`}
              key={g.label}
              onMouseEnter={() => setOpen(g.label)}
            >
              {g.items.length === 0 && g.href ? (
                <a
                  className="navg__btn"
                  href={g.href}
                  aria-current={here === g.label ? "page" : undefined}
                  onClick={(e) => click(e, g.href as string)}
                >
                  {g.label}
                </a>
              ) : (
              <button
                className="navg__btn"
                aria-expanded={open === g.label}
                onClick={() => setOpen(open === g.label ? null : g.label)}
              >
                {g.label}
                <svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
              )}
              <div className={`navg__menu${g.columns ? " navg__menu--wide" : ""}`}>
                {g.blurb && <p className="navg__blurb">{g.blurb}</p>}
                {g.columns ? (
                  <div className="navg__cols">
                    {g.columns.map((c) => (
                      <div className="navg__col" key={c.label}>
                        <p className="navg__collabel">{c.label}</p>
                        {c.items.map((i) => (
                          <a
                            key={i.href}
                            href={i.href}
                            {...(i.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                            onClick={(e) => click(e, i.href)}
                          >
                            <b>{i.label}</b>
                            {i.note && <span>{i.note}</span>}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  g.items.map((i) => (
                  /* Two sibling anchors, never one nested in the other: an
                     interactive element inside a link is invalid HTML and a
                     screen reader reads it as one confused control. */
                  <a
                    key={i.href}
                    href={i.href}
                    {...(i.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    onClick={(e) => click(e, i.href)}
                  >
                    <b>{i.label}</b>
                    {i.note && <span>{i.note}</span>}
                  </a>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="nav__right">
          {/* The label collapses under 560px so the row still fits a phone —
              the robot alone carries the meaning at that size. */}
          {/* The robot alone was not read as a download button on a phone —
              it says "Android", not "tap this to get a file". The arrow only
              appears where the label is hidden, so the desktop pill stays a
              clean mark-plus-words and the phone gets the universal symbol
              instead of a mystery. */}
          <a className="nav__dl" href={KOSH_DOWNLOAD_URL} aria-label="Download the Android app">
            <AndroidGlyph size={16} />
            <Download className="nav__dl-arrow" size={14} strokeWidth={2.6} aria-hidden />
            <span>Get the app</span>
          </a>
          <a className="btn btn-primary" href={KOSH_APP_URL}>Try Kosh</a>
          <button
            className={`nav__burger${sheet ? " x" : ""}`}
            aria-label={sheet ? "Close menu" : "Open menu"}
            aria-expanded={sheet}
            onClick={() => setSheet(!sheet)}
          >
            <i /><i /><i />
          </button>
        </div>
      </nav>

      {/* phones: the full map, because the desktop row can't fit */}
      {/* ── WHY data-lenis-prevent ──────────────────────────────────────
          The menu scrolled on every page except the homepage, which is the
          one page that runs Lenis. Lenis attaches to the window and calls
          preventDefault on wheel and touch so it can drive scrolling itself,
          and `lenis.stop()` only stops it MOVING the page — the listeners
          stay on and keep swallowing the gesture, so a scrollable panel above
          it gets nothing. Native scrolling inside the sheet then looks broken
          on precisely the page most people arrive on.

          This attribute is Lenis's own opt-out: any gesture whose composed
          path contains it is left alone. The lenis.stop() in Index.tsx still
          earns its place — it stops the page moving underneath — but it was
          never going to fix this on its own. */}
      <div
        className={`sheet${sheet ? " on" : ""}`}
        aria-hidden={!sheet}
        data-lenis-prevent
      >
        <div className="sheet__in">
          <a className="sheet__cta btn btn-primary" href="/start" onClick={() => setSheet(false)}>
            Start learning, free
          </a>
          {NAV_GROUPS.map((g) => (
            <div className="sheet__g" key={g.label}>
              {g.items.length === 0 && g.href ? (
                <a href={g.href} onClick={(e) => click(e, g.href as string)}>{g.label}</a>
              ) : (
                <h4>{g.label}</h4>
              )}
              {g.items.map((i) => (
                <a key={i.href} href={i.href} onClick={(e) => click(e, i.href)}>
                  {i.label}
                  {i.note && <span>{i.note}</span>}
                </a>
              ))}
            </div>
          ))}
          <a className="sheet__app" href={KOSH_APP_URL}>Try Kosh &rarr;</a>
          <a className="sheet__dl" href={KOSH_DOWNLOAD_URL} onClick={() => setSheet(false)}>
            <AndroidGlyph size={16} /> Get the Android app
          </a>
        </div>
      </div>
    </>
  );
};
