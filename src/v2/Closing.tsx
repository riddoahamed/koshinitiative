import { useEffect, useState } from "react";
import { ArrowUpRight, GraduationCap, Search, Gamepad2 } from "lucide-react";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";
import ShaderBg from "./ShaderBg";
import Starfield from "./Starfield";

const MAIL = "koshinitiative@gmail.com";
const mailto = (subject: string) =>
  `mailto:${MAIL}?subject=${encodeURIComponent(subject)}`;

/* ---------------- ORGS — the app is free; this sustains it ---------------- */
export const Orgs = () => (
  <section className="sec paper-sec orgs" id="organizations">
    <div className="wrap">
      <div className="orgs__inner">
        <p className="eyebrow" data-reveal>for organizations</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          The app is free. This is how we sustain it.
        </h2>
        <div className="orows" data-stagger="130">
          <div className="orow" data-reveal="left">
            <div className="orow__icon"><GraduationCap size={20} strokeWidth={1.9} /></div>
            <div>
              <h3>Financial literacy, as a product</h3>
              <p>Programs for universities, employers, and NGOs — designed, delivered, and measured.</p>
            </div>
          </div>
          <div className="orow" data-reveal="left">
            <div className="orow__icon"><Search size={20} strokeWidth={1.9} /></div>
            <div>
              <h3>Research &amp; engagement</h3>
              <p>User research, acquisition, and engagement consulting for banks and fintechs.</p>
            </div>
          </div>
          <div className="orow" data-reveal="left">
            <div className="orow__icon"><Gamepad2 size={20} strokeWidth={1.9} /></div>
            <div>
              <h3>Games that teach</h3>
              <p>Playable simulations of investing, money habits, and scam defense — gamified user experiences people actually finish, built for classrooms, campaigns, and fintech products.</p>
            </div>
          </div>
        </div>
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
        A financial operating system for emerging markets.
      </h2>

      <div className="vision__cols">
        <div className="vcol now" data-reveal>
          <span className="vcol__tag"><span className="live" /> now</span>
          <ul>
            <li>Bangladesh <span>— live in beta</span></li>
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
            <li>Diaspora corridors <span>— Dubai, Toronto, London</span></li>
          </ul>
        </div>
      </div>

      <p className="vision__close" data-reveal>
        The future of finance isn&rsquo;t more information. It&rsquo;s{" "}
        <span className="shimmer">better decisions</span> — made possible for
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
        We watched people learn — and still freeze.
      </h2>

      <div className="founder__card" data-reveal>
        <div className="founder__letter">
          <p>
            Kosh began as a literacy project — workshops, posters, a small
            gamified app. It worked. People learned. Then, at the last step,
            almost everyone froze at the same question:{" "}
            <em>“Okay… but what should I do?”</em>
          </p>
          <p>
            More content wasn&rsquo;t the answer. A platform that helps you{" "}
            <em>decide</em> was. So we&rsquo;re building it — honestly, in
            public, from Dhaka.
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
            alt="The original Kosh V1 poster — Learn small. Grow big."
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
  { t: "Internships", p: "Real product, real users, real responsibility — in weeks.", s: "Kosh internship" },
  { t: "Campus ambassadors", p: "Bring Kosh to your university. Lead the money conversation.", s: "Kosh campus ambassador" },
  { t: "Research", p: "Study financial confidence and inclusion with us.", s: "Kosh research collaboration" },
  { t: "Partnerships", p: "Banks, brokers, NGOs, employers — build it with us.", s: "Kosh partnership" },
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
        one inbox, read by humans — <a href={`mailto:${MAIL}`}>{MAIL}</a>
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
        <p className="foot__def">
          <span className="bn">কোষ</span> — a treasury; a cell. The smallest
          unit things grow from.
        </p>
      </div>
      <div>
        <h4>Product</h4>
        <ul>
          <li><a href={KOSH_APP_URL}>Open the beta</a></li>
          <li><a href={KOSH_WAITLIST_EMAIL_URL}>Join the waitlist</a></li>
          <li><a href="/budget-planner">Budget planner</a></li>
          <li><a href="/sip-calculator">Goal-based SIP</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="#story">Why Kosh</a></li>
          <li><a href="#inclusion">Impact &amp; inclusion</a></li>
          <li><a href="#vision">The long game</a></li>
          <li><a href="#organizations">For organizations</a></li>
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

/* ---------------- NAV ---------------- */
export const NavV2 = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const fn = () => setOn(window.scrollY > window.innerHeight * 1.6);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`nav${on ? " on" : ""}`} aria-label="Main">
      <a className="nav__brand" href="#top">
        <img src="/img/kosh-logo.png" alt="" />
        KOSH
      </a>
      <div className="nav__links">
        <a href="#problem">The problem</a>
        <a href="#product">The product</a>
        <a href="#inclusion">Impact</a>
        <a href="#organizations">For organizations</a>
        <a href="#join">Join us</a>
      </div>
      <a className="btn btn-primary" href={KOSH_APP_URL}>
        Open the beta
      </a>
    </nav>
  );
};
