import { KOSH_APP_URL } from "@/lib/links";
import { ArrowRight } from "lucide-react";

/* ── Inside Kosh ──────────────────────────────────────────────────────────────
   Real screens from app.koshbd.com, captured in guest mode (npm run shots).

   Structure on purpose: no "here is our product" gallery. Each row makes one
   claim and shows the screen that proves it, alternating side to side. The
   screens are evidence, not decoration.                                     */

/* A phone renders an app edge to edge with the clock and icons floating on
   top. Reserving a strip above the screenshot instead is what makes device
   mockups look fake, so this overlays. */
const Status = () => (
  <span className="dev__status" aria-hidden="true">
    <span className="dev__time">9:41</span>
    <span className="dev__island" />
    <svg className="dev__icons" viewBox="0 0 62 12" fill="currentColor">
      <rect x="0" y="7.5" width="2.6" height="4.5" rx="0.8" />
      <rect x="4" y="5.5" width="2.6" height="6.5" rx="0.8" />
      <rect x="8" y="3.2" width="2.6" height="8.8" rx="0.8" />
      <rect x="12" y="1" width="2.6" height="11" rx="0.8" />
      <path d="M23.4 4.1a7.6 7.6 0 0 1 9.2 0l-1.3 1.6a5.6 5.6 0 0 0-6.6 0z" />
      <path d="M25.6 6.9a4.2 4.2 0 0 1 4.8 0l-1.3 1.6a2.2 2.2 0 0 0-2.2 0z" />
      <circle cx="28" cy="10.6" r="1.4" />
      <rect x="41" y="1.6" width="18" height="9" rx="2.8" fill="none" stroke="currentColor" strokeWidth="1.1" opacity="0.5" />
      <rect x="42.6" y="3.1" width="12.5" height="6" rx="1.6" />
      <path d="M60.4 5.1v2.4a2 2 0 0 0 0-2.4z" opacity="0.5" />
    </svg>
  </span>
);

interface ShotProps {
  src: string;
  alt: string;
  cap: string;
  reel?: boolean;
}

const Phone = ({ src, alt, cap, reel }: ShotProps) => (
  <figure className={`dev dev--phone${reel ? " dev--reel" : ""}`}>
    <div className="dev__screen">
      <Status />
      <img src={src} alt={alt} loading="lazy" decoding="async" />
    </div>
    <figcaption>{cap}</figcaption>
  </figure>
);

export const Inside = () => (
  <section className="sec inside" id="inside">
    <div className="blob m" style={{ width: 520, height: 520, left: "-14%", top: "4%" }} />
    <div className="wrap">
      <p className="eyebrow" data-reveal>inside kosh</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Tap anything. It <span className="grad-text">explains itself.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Every listed company, fund and gold rate in Bangladesh, with the numbers
        that actually decide it and a plain answer to &ldquo;so what does this
        one do?&rdquo;
      </p>

      <figure className="dev dev--mac inside__hero" data-reveal="scale">
        <div className="dev__lid">
          <div className="dev__screen">
            <img
              src="/img/app/stock-desktop.webp"
              alt="Grameenphone's page in Kosh on a laptop: the share price, a one-month chart, how long it has been listed, eight years of cash dividends, and a plain-language note on what the company does"
              loading="lazy"
              decoding="async"
              width={1760}
              height={1100}
            />
          </div>
        </div>
        <div className="dev__base" aria-hidden="true" />
        <figcaption>
          Grameenphone, on the day this was taken. Eight years of dividends, what
          the company actually does, and a Buy button that spends practice money.
        </figcaption>
      </figure>

      <div className="claim" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">one feed</p>
          <h3>Everything you could put money into, in one place.</h3>
          <p>
            Savings, government-backed schemes, halal assets, gold, mutual funds,
            DSE and global stocks. Filter it to what fits you, or answer two
            questions and let it build the feed. <b>Nothing pays to appear.</b>
          </p>
        </div>
        <div className="claim__shots claim__shots--one">
          <Phone
            src="/img/app/feed.webp"
            reel
            alt="The Kosh Discover feed scrolling: a browse-by-type row for savings, government-backed, halal assets, alternative and gold, followed by cards for individual Bangladeshi listed companies"
            cap="Filtered to DSE stocks here. Every card opens into the full page."
          />
        </div>
      </div>

      <div className="claim claim--flip" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">the numbers that decide it</p>
          <h3>What it returned. What it costs. Who runs it.</h3>
          <p>
            A fund shows what ৳10,000 would actually have become, after its fees.
            Gold shows today&rsquo;s BAJUS 22K rate per bhori next to the world
            spot price, <b>because the world price is not the one you pay in
            Dhaka.</b>
          </p>
        </div>
        <div className="claim__shots">
          <Phone
            src="/img/app/fund.webp"
            alt="A mutual fund page in Kosh: EDGE Bangladesh Mutual Fund, showing that ৳10,000 in August 2023 would now be ৳14,223, a three-year chart, and annualised returns over five, three and one years"
            cap="৳10,000 in Aug 23 would be ৳14,223, after fees"
          />
          <Phone
            src="/img/app/gold.webp"
            alt="Gold in Kosh: a live BAJUS 22-karat price of ৳239,549 per bhori, the world spot price alongside it, and a six-month chart with the option to switch between taka and dollars"
            cap="Live BAJUS 22K per bhori, not a spot price you can't buy at"
          />
        </div>
      </div>

      <div className="claim" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">before any of it is real</p>
          <h3>Lose money safely first.</h3>
          <p>
            ৳10,00,000 and $10,000 of practice money at real market prices, so you
            find out what you do on a red week before it costs you anything. Then
            short lessons that unlock as you go.
          </p>
        </div>
        <div className="claim__shots">
          <Phone
            src="/img/app/practise.webp"
            alt="The Kosh Practise screen: a ৳10,00,000 and $10,000 practice account, a pact for deciding what you'll actually do, calculators, and the Hot or Not game"
            cap="Real prices. Fake money. No damage."
          />
          <Phone
            src="/img/app/learn.webp"
            alt="The Kosh Learn screen: a guided path, a Spender to Investor season you can race friends through, and lessons grouped by situation"
            cap="A path, not a library you'll never finish"
          />
        </div>
      </div>

      <div className="inside__cta" data-reveal="fade">
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
