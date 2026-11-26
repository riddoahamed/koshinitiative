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
  /** Not shown: the picture says it. Kept as a note for whoever edits. */
  cap?: string;
  /** tall capture that scrolls inside the frame */
  reel?: boolean;
  /** stagger, so two reels never move in lockstep */
  speed?: number;
}

const Phone = ({ src, alt, reel, speed = 34 }: PhoneProps) => {
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
    </figure>
  );
};

export const Inside = () => (
  <section className="sec inside" id="inside">
    <div className="wrap">
      <p className="eyebrow" data-reveal>inside kosh</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Tap anything. It <span className="grad-text">explains itself.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Companies, funds and gold in Bangladesh, with the key numbers and a
        simple answer to &ldquo;what does this one do?&rdquo;
      </p>

      <div className="claim" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">your for-you feed</p>
          <h3>Our AI finds it. People check it. You decide.</h3>
          <p>
            Savings, Sanchaypatra, halal options, gold, funds, DSE and global
            stocks, in one feed. <b>Nobody pays to be listed.</b>
          </p>
          <ol className="claim__steps">
            <li><b>Discover</b> Every day our AI reads the filings and news, and picks out what matters.</li>
            <li><b>Verify</b> Numbers come straight from the source. If something looks off, a person checks it.</li>
            <li><b>Understand</b> Each card tells you, in simple words, why it&rsquo;s there.</li>
            <li><b>Practise</b> Try it with pretend money on real prices first.</li>
            <li><b>Invest</b> When you&rsquo;re ready, we show you where. We never touch your money.</li>
          </ol>
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
            Not the advertised rate. What your money would be now, after the
            fund&rsquo;s fees, over five years, three and one. <b>Plus the fee
            you pay either way.</b>
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
            The world gold price isn&rsquo;t what you pay in Dhaka. Kosh shows the
            BAJUS 22K rate next to it, six months of history, and <b>why it
            moved this week.</b>
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

      <figure className="browser inside__hero" data-reveal="scale">
        <div className="browser__bar" aria-hidden="true">
          <span className="browser__dots"><i /><i /><i /></span>
          <span className="browser__url">app.koshfinance.com/markets/dse/GP</span>
        </div>
        <div className="browser__view">
          <div>
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
      </figure>

      <div className="claim claim--flip" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">before any of it is real</p>
          <h3>Lose money safely first.</h3>
          <p>
            Get &#2547;10,00,000 and $10,000 in pretend money to trade at real
            prices. See how you handle a bad week before it costs you anything.
          </p>
        </div>
        <div className="claim__shot">
          <Phone
            src="/img/app/practise.webp"
            alt="The Kosh practice portfolio: practice money at market prices, a practice path to place your first order, and the account total in taka"
            cap="Real prices. Fake money. No damage."
          />
        </div>
      </div>

      <div className="claim" data-reveal>
        <div className="claim__text">
          <p className="claim__kicker">and the part that sticks</p>
          <h3>A path, not a library you&rsquo;ll never finish.</h3>
          <p>
            Short lessons in order, with XP, streaks and mini-games along the
            way, tuned to where you live and earn. <b>Start with Money basics:
            12 lessons, free.</b>
          </p>
        </div>
        <div className="claim__shot">
          <Phone
            src="/img/app/learn-path.webp"
            reel
            speed={36}
            alt="The Kosh learning path scrolling: level and streak, Unit 1 Understand how money works, lessons like Why your FDR is quietly losing, and the Scam Spotter and IPO Launch games along the path"
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
