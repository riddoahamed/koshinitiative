import { useState } from "react";

// ── Games section ────────────────────────────────────────────────────────────
// The marketing site's "you can actually play this" moment. Each game shows its
// poster; the primary action opens the real game in the app, where an anonymous
// visitor can play a little before Kosh invites them to sign in with Google.
//
// Deliberately the same posters the app uses — one visual identity across the
// marketing site and the product.

const APP = "https://app.koshbd.com";

interface Game {
  title: string;
  sub: string;
  blurb: string;
  image: string;
  /** Deep link into the app's game. */
  href: string;
}

const GAMES: Game[] = [
  {
    title: "MonerPoly",
    sub: "জমির খেলা, জ্ঞানের খেলা",
    blurb: "Buy Dhaka property, survive registration, নামজারি and taxes — and learn why the paperwork is the investment.",
    image: "/games/monerpoly.webp",
    href: `${APP}/estate`,
  },
  {
    title: "Kosh Quest",
    sub: "Level up your money game",
    blurb: "A retro RPG about money, scams and the manipulation you'll actually meet in Bangladesh.",
    image: "/games/kosh-quest.webp",
    href: `${APP}/scam-spotter/quest`,
  },
  {
    title: "Grand Trade Auto",
    sub: "Bandar City · season one",
    blurb: "A full 3D city. Drive it, trade the DSE, buy property, run the story — investing as an open world.",
    image: "/games/grand-trade-auto.webp",
    href: `${APP}/gtm`,
  },
];

export const Games = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="sec games" id="games">
      <div className="blob p" style={{ width: 420, height: 420, left: "-8%", top: "12%" }} />
      <div className="wrap">
        <p className="eyebrow" data-reveal>learn by playing</p>
        <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
          Money games you can actually play right now.
        </h2>
        <p className="games__lede" data-reveal style={{ ["--d" as string]: "140ms" }}>
          No signup to start. Play a few minutes in the browser — sign in with Google when you want to keep your progress.
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
              <a href={g.href} target="_blank" rel="noopener noreferrer" className="gcard__media" aria-label={`Play ${g.title}`}>
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
        </div>

        <div className="games__cta" data-reveal="fade">
          <a href={`${APP}/play`} target="_blank" rel="noopener noreferrer" className="games__btn">
            See all the games
          </a>
          <p className="games__note">
            <span className="dot" /> free · plays in your browser · your progress saves when you sign in
          </p>
        </div>
      </div>
    </section>
  );
};
