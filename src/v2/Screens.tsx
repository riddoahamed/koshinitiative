import { KOSH_APP_URL } from "@/lib/links";
import { ArrowRight } from "lucide-react";

/* ── The actual product ───────────────────────────────────────────────────────
   Real screenshots of app.koshbd.com, taken in guest mode. Nothing here is
   drawn by hand or invented — the DSE prices, the company logos and the
   sparklines are what the app was showing when these were captured.

   The device frames are CSS, not mockup images: sharp at any DPI, a couple of
   kB instead of a couple of MB, and no licence to worry about.              */

const PHONES = [
  {
    src: "/img/app/home.webp",
    alt: "The Kosh app home screen: a welcome card reading “Nobody taught us money. Let's fix that.”, a Get started button, and live DSEX and Dow Jones prices",
    cap: "Open it and it asks a question, not for your money",
  },
  {
    src: "/img/app/practise.webp",
    alt: "The Kosh Practise screen: a ৳10,00,000 and $10,000 practice account, a pact to decide what you'll actually do, calculators, and the Hot or Not game",
    cap: "Real prices. Fake money. No damage.",
  },
  {
    src: "/img/app/analyse.webp",
    alt: "The Kosh Analyse screen: upload a screenshot of an investment offer and get back what it really pays and what it's hiding, with a note that nothing uploaded is saved",
    cap: "Screenshot an offer, find out what it's hiding",
  },
];

/* A browser capture has no status bar, so a bare dynamic island would just be
   a black blob sitting on top of the app header. Drawing the strip the phone
   would actually reserve makes the screenshot read as a phone screenshot. */
const StatusBar = () => (
  <span className="dev__status" aria-hidden="true">
    <span className="dev__time">9:41</span>
    <span className="dev__island" />
    <svg className="dev__icons" viewBox="0 0 62 12" fill="currentColor">
      {/* signal */}
      <rect x="0" y="7.5" width="2.6" height="4.5" rx="0.8" />
      <rect x="4" y="5.5" width="2.6" height="6.5" rx="0.8" />
      <rect x="8" y="3.2" width="2.6" height="8.8" rx="0.8" />
      <rect x="12" y="1" width="2.6" height="11" rx="0.8" />
      {/* wifi */}
      <path d="M23.4 4.1a7.6 7.6 0 0 1 9.2 0l-1.3 1.6a5.6 5.6 0 0 0-6.6 0z" />
      <path d="M25.6 6.9a4.2 4.2 0 0 1 4.8 0l-1.3 1.6a2.2 2.2 0 0 0-2.2 0z" />
      <circle cx="28" cy="10.6" r="1.4" />
      {/* battery */}
      <rect x="41" y="1.6" width="18" height="9" rx="2.8" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <rect x="42.6" y="3.1" width="12.5" height="6" rx="1.6" />
      <path d="M60.4 5.1v2.4a2 2 0 0 0 0-2.4z" opacity="0.5" />
    </svg>
  </span>
);

export const Screens = () => (
  <section className="sec screens" id="screens">
    <div className="blob m" style={{ width: 520, height: 520, left: "-14%", top: "6%" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>the actual product</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Not a mockup. This is <span className="grad-text">the app, today.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Live Dhaka and US prices, real listed companies, an AI coach that knows
        Bangladeshi products, and a practice account you can lose money in
        safely. Open it as a guest — no account until you actually want one.
      </p>

      <div className="showcase">
        <figure className="dev dev--mac" data-reveal="scale">
          <div className="dev__lid">
            <div className="dev__screen">
              <img
                src="/img/app/markets-desktop.webp"
                alt="The Kosh markets screen on a laptop: DSEX, DSE 30 and S&P 500 index cards, then a list of Bangladeshi stocks — Grameenphone, Square Pharmaceuticals, Robi Axiata, BRAC Bank — each with its live price, daily change and a sparkline"
                loading="lazy"
                decoding="async"
                width={1760}
                height={1100}
              />
            </div>
          </div>
          <div className="dev__base" aria-hidden="true" />
          <figcaption>Markets · every DSE stock, live, with nothing sold to you</figcaption>
        </figure>

        <div className="showcase__phones" data-stagger="120">
          {PHONES.map((p) => (
            <figure className="dev dev--phone" key={p.src} data-reveal="scale">
              <div className="dev__screen">
                <StatusBar />
                <img
                  src={p.src}
                  alt={p.alt}
                  loading="lazy"
                  decoding="async"
                  width={780}
                  height={1688}
                />
              </div>
              <figcaption>{p.cap}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="screens__cta" data-reveal="fade">
        <a className="btn btn-primary" href={KOSH_APP_URL} target="_blank" rel="noreferrer">
          Try Kosh <ArrowRight size={16} strokeWidth={2.4} />
        </a>
        <p>
          <span className="dot" /> in beta · explore as a guest · we never touch
          your money
        </p>
      </div>
    </div>
  </section>
);
