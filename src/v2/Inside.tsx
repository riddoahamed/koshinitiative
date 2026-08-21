import { useEffect, useRef, useState } from "react";
import { KOSH_APP_URL, KOSH_DOWNLOAD_URL } from "@/lib/links";
import { AndroidGlyph } from "@/v2/AndroidGlyph";
import { ArrowRight } from "lucide-react";

/* ── Inside Kosh ──────────────────────────────────────────────────────────────
   Real screens from app.koshbd.com, captured in guest mode (npm run shots).

   One claim per row, one device per row. Pairs of phones side by side are the
   stock-mockup look; a single larger screen with air around it reads as a
   company showing its product rather than filling a grid.

   No clock or battery painted on the frames. This is a web app, so there is no
   iOS status bar in the capture, and drawing one covered the Back button. The
   island stays, because that part is hardware.                              */

/** Long pages scroll for real: one tall screenshot moved inside the frame.
 *  Sharper and far lighter than a GIF, and it only runs while on screen, so
 *  the page isn't animating things nobody is looking at. */
const useInView = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      rootMargin: "-10% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, live };
};

interface PhoneProps {
  src: string;
  alt: string;
  cap: string;
  /** tall capture that scrolls inside the frame */
  reel?: boolean;
  /** stagger, so two reels never move in lockstep */
  speed?: number;
}

const Phone = ({ src, alt, cap, reel, speed = 34 }: PhoneProps) => {
  const { ref, live } = useInView<HTMLElement>();
  return (
    <figure
      ref={ref}
      className={`dev dev--phone${reel ? " dev--reel" : ""}${reel && live ? " is-live" : ""}`}
    >
      <div className="dev__screen">
        <span className="dev__island" aria-hidden="true" />
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={reel ? { animationDuration: `${speed}s` } : undefined}
        />
      </div>
      <figcaption>{cap}</figcaption>
    </figure>
  );
};

export const Inside = () => (
  <section className="sec inside" id="inside">
    <div className="blob m" style={{ width: 520, height: 520, left: "-14%", top: "3%" }} />
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
        <div className="claim__shot">
          <Phone
            src="/img/app/feed.webp"
            reel
            speed={38}
            alt="The Kosh Discover feed scrolling: a browse-by-type row for savings, government-backed, halal assets, alternative and gold, then cards for individual Bangladeshi listed companies"
            cap="Filtered to DSE stocks here. Every card opens into the full page."
          />
        </div>
      </div>

      <div className="claim claim--flip" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">what it actually returned</p>
          <h3>&#2547;10,000 in 2023 would be &#2547;14,223 today.</h3>
          <p>
            Not a headline rate. What the money would have become after the
            fund&rsquo;s own fees, with the yearly figure over five years, three
            years and one. <b>Then the fee that gets taken either way.</b>
          </p>
        </div>
        <div className="claim__shot">
          <Phone
            src="/img/app/fund.webp"
            reel
            speed={30}
            alt="EDGE Bangladesh Mutual Fund in Kosh: an explanation of what open-end means, what ৳10,000 invested in August 2023 would now be worth, a three-year chart, and annualised returns over five, three and one years"
            cap="EDGE Bangladesh Mutual Fund, after fees, dividends reinvested"
          />
        </div>
      </div>

      <div className="claim" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">priced how bangladesh buys it</p>
          <h3>Gold at the BAJUS rate, per bhori.</h3>
          <p>
            The world spot price is not the one you pay in Dhaka, so Kosh shows
            the live 22K rate beside it, six months of history in taka or
            dollars, and a written read on <b>why it moved this week.</b>
          </p>
        </div>
        <div className="claim__shot">
          <Phone
            src="/img/app/gold.webp"
            alt="Gold in the Kosh app: a live 22-karat price of ৳239,500 per bhori next to the world spot rate, a six-month chart switchable between taka and dollars, and a macro read headed “Gold is catching its breath after a huge run”"
            cap="Live 22K against world spot, and the week&rsquo;s read on why it moved"
          />
        </div>
      </div>

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
          Grameenphone on the desktop. Eight years of dividends, what the company
          actually does, and a Buy button that spends practice money.
        </figcaption>
      </figure>

      <div className="claim claim--flip" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">before any of it is real</p>
          <h3>Lose money safely first.</h3>
          <p>
            &#2547;10,00,000 and $10,000 of practice money at real market prices,
            so you find out what you do on a red week before it costs you
            anything.
          </p>
        </div>
        <div className="claim__shot">
          <Phone
            src="/img/app/practise.webp"
            alt="The Kosh Practise screen: a ৳10,00,000 and $10,000 practice account, a pact for deciding what you'll actually do, calculators, and the Hot or Not game"
            cap="Real prices. Fake money. No damage."
          />
        </div>
      </div>

      <div className="claim" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">and the part that sticks</p>
          <h3>A path, not a library you&rsquo;ll never finish.</h3>
          <p>
            Short lessons in an order, tuned to where you actually live and earn,
            with a season you can race your friends through. <b>Nobody finishes
            a course they downloaded.</b>
          </p>
        </div>
        <div className="claim__shot">
          <Phone
            src="/img/app/learn.webp"
            alt="The Kosh Learn screen: a prompt to answer a couple of questions and be pointed at the right zone, a Spender to Investor season, and lessons grouped by where you live"
            cap="Bangladesh, Gulf, UK, US, SE Asia. The lessons move with you."
          />
        </div>
      </div>

      <div className="inside__cta" data-reveal="fade">
        <a className="btn btn-primary" href={KOSH_APP_URL} target="_blank" rel="noreferrer">
          Try Kosh <ArrowRight size={16} strokeWidth={2.4} />
        </a>
        <a className="btn btn-glass" href={KOSH_DOWNLOAD_URL} target="_blank" rel="noreferrer">
          <AndroidGlyph size={17} /> Get the Android app
        </a>
        <p>
          <span className="dot" /> in beta · explore as a guest · we never touch
          your money
        </p>
      </div>
    </div>
  </section>
);
