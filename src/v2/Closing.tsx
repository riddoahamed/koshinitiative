import { useEffect, useState } from "react";
import { ArrowUpRight, GraduationCap, Landmark, BarChart3 } from "lucide-react";
import { KOSH_APP_URL, KOSH_DOWNLOAD_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";
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
          <a className="btn" href={mailto("Kosh partnership")}>Work with us</a>
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
          <span className="vcol__tag"><span className="live" /> now</span>
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
            src="/img/poster-v1.jpg"
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
        <h4>Start here</h4>
        <ul>
          <li><a href="/start">If I started today</a></li>
          <li><a href="/quiz">What kind of investor am I?</a></li>
          <li><a href="/learn">Quick lessons</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/vote">Kosh Live</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href={KOSH_APP_URL}>Try Kosh</a></li>
          <li><a href={KOSH_DOWNLOAD_URL}>Get the Android app</a></li>
          <li><a href={KOSH_WAITLIST_EMAIL_URL}>Join the waitlist</a></li>
          <li><a href="/#story">Why Kosh</a></li>
          <li><a href="/#organizations">For organizations</a></li>
          <li><a href="/feedback">What people are asking for</a></li>
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

interface NavItem { label: string; href: string; note?: string }
interface NavGroup { label: string; items: NavItem[] }

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Start learning",
    items: [
      { label: "If I started today", href: "/start", note: "The five-step path" },
      { label: "Quick lessons", href: "/learn", note: "Two minutes each" },
      { label: "What kind of investor am I?", href: "/quiz", note: "60 seconds" },
      { label: "Blog", href: "/blog", note: "Guides, how-tos, questions" },
    ],
  },
  {
    label: "Product",
    items: [
      { label: "Inside the app", href: "/#inside", note: "Real screens" },
      { label: "How it works", href: "/#product", note: "Agents find, humans check" },
      { label: "Games", href: "/#funance", note: "Finance, made playable" },
      { label: "Kosh Live", href: "/vote", note: "Run a live room" },
      // Points at the SECTION, not at /investkorsi. The section explains what
      // the wall is before sending anyone to it, and useAnchorNav scrolls
      // smoothly when we are already on the homepage. koshbd.com/investkorsi
      // still redirects to the app for anyone who types or shares that URL.
      { label: "InvestKorsi", href: "/#investkorsi", note: "What happened to people's money" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "Why Kosh exists", href: "/#story" },
      { label: "Impact & inclusion", href: "/#inclusion" },
      { label: "For organizations", href: "/#organizations", note: "Programs & partners" },
      { label: "Join us", href: "/#join", note: "Careers, campus, research" },
    ],
  },
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

export const NavV2 = ({ pinned = false }: { pinned?: boolean }) => {
  const [on, setOn] = useState(pinned);
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
          {NAV_GROUPS.map((g, i) => (
            <div
              className={`navg${open === g.label ? " open" : ""}${i === 0 ? " navg--go" : ""}`}
              key={g.label}
              onMouseEnter={() => setOpen(g.label)}
            >
              <button
                className="navg__btn"
                aria-expanded={open === g.label}
                onClick={() => setOpen(open === g.label ? null : g.label)}
              >
                {g.label}
                <svg viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </button>
              <div className="navg__menu">
                {g.items.map((i) => (
                  <a key={i.href} href={i.href} onClick={(e) => click(e, i.href)}>
                    <b>{i.label}</b>
                    {i.note && <span>{i.note}</span>}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="nav__right">
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
      <div className={`sheet${sheet ? " on" : ""}`} aria-hidden={!sheet}>
        <div className="sheet__in">
          <a className="sheet__cta btn btn-primary" href="/start" onClick={() => setSheet(false)}>
            Start learning, free
          </a>
          {NAV_GROUPS.map((g) => (
            <div className="sheet__g" key={g.label}>
              <h4>{g.label}</h4>
              {g.items.map((i) => (
                <a key={i.href} href={i.href} onClick={(e) => click(e, i.href)}>
                  {i.label}
                  {i.note && <span>{i.note}</span>}
                </a>
              ))}
            </div>
          ))}
          <a className="sheet__app" href={KOSH_APP_URL}>Try Kosh &rarr;</a>
        </div>
      </div>
    </>
  );
};
