import { useState } from "react";
import { ArrowRight } from "lucide-react";

// ── Funance — games + the live room, one section ─────────────────────────────
// These used to be two separate pitches: a "Games" grid mid-page and a
// "Let's democratize Funance" band buried at the bottom of Vision. They were
// arguing the same point — finance is easier to learn when you can play with
// it — so they're one section now, with the live room as the fourth tile.
//
// Posters are the same ones the app uses: one visual identity across both.

const APP = "https://app.koshbd.com";

interface Game {
  title: string;
  sub: string;
  blurb: string;
  image: string;
  /** Deep link into the app's game. */
  href: string;
  external?: boolean;
}

const GAMES: Game[] = [
  {
    title: "MonerPoly",
    sub: "জমির খেলা, জ্ঞানের খেলা",
    blurb: "Buy Dhaka property, survive registration, নামজারি and taxes — and learn why the paperwork is the investment.",
    image: "/games/monerpoly.webp",
    href: `${APP}/estate`,
    external: true,
  },
  {
    title: "Kosh Quest",
    sub: "Level up your money game",
    blurb: "A retro RPG about money, scams and the manipulation you'll actually meet in Bangladesh.",
    image: "/games/kosh-quest.webp",
    href: `${APP}/scam-spotter/quest`,
    external: true,
  },
  {
    title: "Grand Trade Auto",
    sub: "Bandar City · season one",
    blurb: "A full 3D city. Drive it, trade the DSE, buy property, run the story — investing as an open world.",
    image: "/games/grand-trade-auto.webp",
    href: `${APP}/gtm`,
    external: true,
  },
];

export const Funance = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="sec games" id="funance">
      <div className="blob p" style={{ width: 420, height: 420, left: "-8%", top: "12%" }} />
      <div className="wrap">
        <p className="eyebrow" data-reveal>funance</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          The fastest way to learn money is to <span className="grad-text">play with it.</span>
        </h2>
        <p className="games__lede" data-reveal style={{ ["--d" as string]: "140ms" }}>
          Nobody learns investing from a PDF. Three games and one live room —
          free, in your browser, no signup to start. Sign in with Google only
          when you want to keep your progress.
        </p>

        <div className="games__grid" data-stagger="120">
          {GAMES.map((g, i) => (
            <article
              key={g.title}
              className={`gcard${i === active ? " is-active" : ""}`}
              data-reveal="fade"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <a
                href={g.href}
                target="_blank"
                rel="noopener noreferrer"
                className="gcard__media"
                aria-label={`Play ${g.title}`}
              >
                <img src={g.image} alt="" loading="lazy" decoding="async" />
                <span className="gcard__play">Play now</span>
              </a>
              <div className="gcard__body">
                <h3>{g.title}</h3>
                <p className="gcard__sub">{g.sub}</p>
                <p className="gcard__blurb">{g.blurb}</p>
              </div>
            </article>
          ))}

          {/* the live room — same family, so it lives in the same grid */}
          <a
            className={`gcard gcard--live${active === GAMES.length ? " is-active" : ""}`}
            href="/vote"
            data-reveal="fade"
            onMouseEnter={() => setActive(GAMES.length)}
            onFocus={() => setActive(GAMES.length)}
          >
            <div className="gcard__media gcard__media--live">
              <span className="gcard__livedot" aria-hidden="true" />
              <span className="gcard__liveword shimmer">Kosh Live</span>
              <span className="gcard__play">Enter the room</span>
            </div>
            <div className="gcard__body">
              <h3>Kosh Live</h3>
              <p className="gcard__sub">played in a room, together</p>
              <p className="gcard__blurb">
                A live session game for classrooms, campuses and offices —
                everyone trades the same market from their own phone while the
                results go up on the screen.
              </p>
            </div>
          </a>
        </div>

        <div className="games__cta" data-reveal="fade">
          <a href={`${APP}/play`} target="_blank" rel="noopener noreferrer" className="games__btn">
            See all the games <ArrowRight size={16} strokeWidth={2.4} />
          </a>
          <p className="games__note">
            <span className="dot" /> free · plays in your browser · progress saves when you sign in
          </p>
        </div>
      </div>
    </section>
  );
};
