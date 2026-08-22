import { ArrowRight, EyeOff, ShieldCheck, Users } from "lucide-react";
import Starfield from "./Starfield";
import { KOSH_APP_URL } from "@/lib/links";

/* ---------------- INVESTKORSI — the wall, on the marketing site ----------------

   Why this section exists at all, and why it is not just a nav link:

   InvestKorsi is the one thing Kosh has that needs NO trust to be useful. Every
   other surface asks a sceptical Bangladeshi saver to believe an app about
   money before it pays out. This one asks nothing — no account, no email, no
   download — and hands over other people's real experiences immediately. That
   makes it the best front door the product has, and a front door deserves more
   than a menu item.

   The CTAs go straight to app.koshbd.com/investkorsi rather than to a signup.
   Anyone arriving is a stranger with a question, and a signup wall between them
   and the answer would waste the only advantage this page has. The app greets
   them as a guest and offers an account later, once it has been useful.

   Built entirely from the v2 primitives — .sec / .wrap / .eyebrow / .h-display /
   .grad-text / .glass / data-reveal / data-stagger / data-count / Starfield —
   so it inherits the site's motion, its reduced-motion handling and its ?still
   capture mode for free, and cannot drift from the rest of the page.

   ── THE COPY RULE, WHICH MATTERS MORE HERE THAN ANYWHERE ─────────────────────
   This section describes the DATA and never a company. No firm is named. "৳48
   lakh reported stuck" is a fact about a table; "X is dangerous" is a claim
   about a real business nobody at Kosh has investigated. Marketing copy is
   exactly where that line gets crossed, so it is drawn explicitly here. */

const PILLARS = [
  {
    icon: EyeOff,
    t: "Nothing traces back to you",
    d: "No account, no email, no phone number. Post in fifteen seconds and walk away.",
  },
  {
    icon: Users,
    t: "One report each, per investment",
    d: "Nobody can pile on a company, and nobody can pad their own. That is what makes the counts worth reading.",
  },
  {
    icon: ShieldCheck,
    t: "Or put your name to it",
    d: "Share as much as you want — your name, your socials, proof of what you invested. Your call, every time.",
  },
];

export const InvestKorsi = () => (
  <section className="sec investkorsi" id="investkorsi">
    <Starfield density={1.4} />

    <div className="wrap">
      <p className="eyebrow" data-reveal>
        InvestKorsi
      </p>

      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Before you put money in,
        <br />
        <span className="grad-text">see what happened to everyone else.</span>
      </h2>

      <p className="h-sub" data-reveal style={{ ["--d" as string]: "160ms" }}>
        Anonymous reports on the platforms, funds, brokers and Facebook groups
        Bangladeshis actually invest through. What people put in, what came
        back, and what didn&rsquo;t.
      </p>

      <div className="ik__pillars" data-stagger="120">
        {PILLARS.map((p) => {
          const Icon = p.icon;
          return (
            <div className="ik__pillar glass" key={p.t} data-reveal="fade">
              <Icon size={22} strokeWidth={1.6} aria-hidden />
              <h3>{p.t}</h3>
              <p>{p.d}</p>
            </div>
          );
        })}
      </div>

      {/* One number, and it is a fact about the wall rather than about any
          company. `data-count` animates it on reveal — the site's own count-up,
          not a second implementation. */}
      <p className="ik__punch" data-reveal="scale">
        <b className="grad-text" data-count="48">
          0
        </b>
        <span>
          lakh reported stuck, by people who told us what happened to their own
          money. Read every report free, without signing up.
        </span>
      </p>

      <div className="ik__cta" data-reveal style={{ ["--d" as string]: "120ms" }}>
        <a className="btn btn-primary" href={`${KOSH_APP_URL}/investkorsi`}>
          See the reports <ArrowRight size={16} aria-hidden />
        </a>
        <a className="btn btn-glass" href={`${KOSH_APP_URL}/investkorsi`}>
          Share your experience
        </a>
      </div>

      <p className="ik__fine" data-reveal="fade">
        These are people&rsquo;s own reports. Kosh has not investigated any
        company listed, and a count is what people said &mdash; nothing more.
      </p>
    </div>
  </section>
);

export default InvestKorsi;
