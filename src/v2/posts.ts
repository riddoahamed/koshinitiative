/* ── Posts ────────────────────────────────────────────────────────────────────
   Two sources, one feed:

   1. LOCAL   — the articles below. Ship with the site, no infra, always there.
   2. SYNCED  — rows in a Supabase `posts` table, filled by the social sync
                (see supabase/README-social.md). Anything posted on the Kosh
                LinkedIn / Instagram / Facebook lands there and shows up here.

   Security note: only local posts may contain HTML, because we wrote them.
   Synced posts are rendered as plain text no matter what arrives — a caption
   from a social platform is untrusted input and never becomes markup.       */

export type PostSource = "kosh" | "linkedin" | "instagram" | "facebook";

export interface Post {
  slug: string;
  title: string;
  dek: string;
  /** Paragraphs. HTML is honoured only when `allowHtml` is true. */
  body: string[];
  /** ISO date. */
  date: string;
  tags: string[];
  source: PostSource;
  /** Link back to the original social post, when there is one. */
  sourceUrl?: string;
  cover?: string;
  readMins: number;
  /** Never set this on synced content — see the note above. */
  allowHtml?: boolean;
}

export const SOURCE_LABEL: Record<PostSource, string> = {
  kosh: "Kosh",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
};

export const LOCAL_POSTS: Post[] = [
  {
    slug: "your-first-ten-minutes-on-kosh",
    title: "How to use Kosh: your first ten minutes",
    dek: "What to tap first, what to ignore for now, and what you should walk away knowing.",
    date: "2026-08-12",
    tags: ["how to", "getting started"],
    source: "kosh",
    readMins: 4,
    allowHtml: true,
    body: [
      "Most money apps open on a dashboard full of numbers you didn't ask for. Kosh opens on a question. Here's the order that gets you something useful in about ten minutes.",
      "<b>Minute 1–2 · The money check.</b> Six or seven questions about what comes in, what goes out, and what you already have parked somewhere. It isn't a credit score and nothing is shared with anyone — it exists so the rest of the app stops giving you generic advice. Answer honestly, including the uncomfortable one about debt.",
      "<b>Minute 3–5 · Ask the coach one real question.</b> Not \"how do I get rich.\" Ask the thing you actually wondered last week: <em>\"Is Sanchaypatra better than a DPS for me?\"</em> or <em>\"I have ৳20,000 sitting in bKash, is that stupid?\"</em> The coach knows Bangladeshi products — Sanchaypatra, DPS, FDR, DSE-listed funds — and it shows you where its answer came from. If it can't source something, it says so.",
      "<b>Minute 6–8 · Open paper investing.</b> You get a balance in taka that isn't real, on prices that are. Buy something. Anything. The point of this step is not the return — it's that a month from now you'll know what you personally do when a number goes red, and that will have cost you nothing to find out.",
      "<b>Minute 9–10 · Play one round of something.</b> Kosh Quest or MonerPoly. This sounds like a detour and it isn't: the scams and the paperwork traps in those games are the ones you will actually meet, and people remember a game they lost far better than a warning they scrolled past.",
      "<b>What to skip for now.</b> The screener, the calculators, and the portfolio tools are all there, and none of them help until you've done the check. Come back to them in week two.",
      "One thing that stays true across all of it: Kosh never holds your money. When you eventually act, you open an account at a named institution on disclosed terms, and you'll see the fee before you agree to anything.",
    ],
  },
  {
    slug: "paper-investing-practise-a-year-in-an-afternoon",
    title: "Paper investing: practise a year in an afternoon",
    dek: "Real market prices, fake money, and the one thing it's actually there to teach you.",
    date: "2026-08-05",
    tags: ["how to", "practice"],
    source: "kosh",
    readMins: 3,
    allowHtml: true,
    body: [
      "Paper investing gets dismissed as a toy. It isn't — but it also isn't there for the reason most people assume.",
      "It is not there to prove you can pick winners. Anyone can pick winners with money that doesn't exist; there's no fear in the trade, so the result tells you almost nothing about skill.",
      "<b>It is there to show you your own behaviour.</b> When the number turns red, do you check it every hour? Do you sell? Do you go looking for someone on the internet to reassure you? That reaction is the single biggest determinant of what you'll end up with in twenty years, and it is far cheaper to discover it on paper than on your salary.",
      "<b>How to run it so it's worth something.</b> Pick three things and write one sentence for each: why you bought it, and what would make you sell. Then leave it alone for a month — genuinely alone. At the end of the month, read your three sentences back and mark which ones you actually followed.",
      "Most people find they followed none of them. That's not a failure; that's the lesson arriving early, for free.",
      "When you do move to real money, keep the same habit and shrink the amount. A first real investment small enough that being wrong costs you nothing is not timidity — it's the only version of the experiment that teaches you anything.",
    ],
  },
  {
    slug: "run-kosh-live-in-your-classroom",
    title: "Running Kosh Live in a classroom or an office",
    dek: "A live session where forty people trade the same market from their own phones, and the results go up on the screen.",
    date: "2026-07-28",
    tags: ["organizations", "how to"],
    source: "kosh",
    readMins: 3,
    allowHtml: true,
    body: [
      "Kosh Live turns a lecture into a room full of people making decisions. You run it from one laptop and a projector; everyone else uses the phone already in their hand.",
      "<b>Before the session.</b> Open the room on the presenting machine and put the QR code on screen. Nobody installs anything and nobody makes an account — they scan, they're in. Twenty seconds for a room of forty.",
      "<b>During.</b> You pose a decision — a fund that just dipped, a \"guaranteed 15% monthly\" offer, a choice between paying off a loan and starting a DPS. Everyone answers on their phone. The tally builds live on the projector, and then you show what the room actually chose before you say a word about what's right.",
      "That gap — between what the room chose and what turns out to be true — is the whole teaching tool. It lands in a way a slide about diversification never will, because they committed first.",
      "<b>After.</b> Every cohort is instrumented, so you get more than an attendance sheet: what people chose, what changed after the explanation, and what they went on to do in the app. If you're running this as a program for a university, a factory floor, or a company, that's the report you can actually take to whoever approved the budget.",
      "If you want to try the format before booking anything, the live room is open — no account, no cost, and you can run it for two people or two hundred.",
    ],
  },
  {
    slug: "why-we-built-games",
    title: "Why a finance company built three video games",
    dek: "Nobody has ever learned to invest from a PDF. We stopped pretending otherwise.",
    date: "2026-07-19",
    tags: ["story", "funance"],
    source: "kosh",
    readMins: 3,
    allowHtml: true,
    body: [
      "Kosh started as a literacy project: workshops, posters, a small app. It worked, in the narrow sense. People sat through the session, answered the quiz correctly, and told us they'd learned something.",
      "Then almost none of them did anything.",
      "The gap wasn't knowledge. They could define compound interest. The gap was that nothing they'd been taught had cost them anything to get wrong, so none of it stuck to a decision.",
      "Games fix that cheaply. In MonerPoly you buy Dhaka property and then discover the registration, the নামজারি and the taxes are the actual investment — which is exactly the surprise that ruins real first-time buyers. In Kosh Quest the scams talk to you the way scams here really talk: urgent, flattering, and just plausible enough. In Grand Trade Auto you run a whole city's worth of decisions and watch a portfolio behave over a season.",
      "You lose money in all three. That's the feature. A loss you felt at 11pm in a game is worth more than a warning slide, and it costs the player nothing but an evening.",
      "We call the whole idea Funance, which is a slightly ridiculous word we're keeping. Finance made playable, free, in a browser, with no signup before you've decided whether you like it.",
    ],
  },
];
