/* ── Posts ────────────────────────────────────────────────────────────────────
   Two sources, one library:

   1. LOCAL   — the articles below. Ship with the site, no infra, always there.
   2. SYNCED  — rows in the Supabase `posts` table: Facebook and Instagram
                arrive automatically, LinkedIn posts are embedded by hand, and
                community submissions land there once approved.

   Security note: only local posts may contain HTML, because we wrote them.
   Everything from the database is rendered as plain text no matter what
   arrives — a caption or a stranger's submission is untrusted input and never
   becomes markup on our domain.                                             */

export type PostSource = "kosh" | "linkedin" | "instagram" | "facebook" | "community";

export type Category = "lesson" | "guide" | "how-to" | "faq" | "story" | "news" | "article";

export interface Post {
  slug: string;
  title: string;
  dek: string;
  /** Paragraphs. HTML is honoured only when `allowHtml` is true. */
  body: string[];
  /** ISO date. */
  date: string;
  category: Category;
  tags: string[];
  source: PostSource;
  /** Link back to the original social post, when there is one. */
  sourceUrl?: string;
  /** LinkedIn (and friends) render as the platform's own embed, not a copy. */
  embedUrl?: string;
  cover?: string;
  author?: string;
  authorNote?: string;
  readMins: number;
  /** Never set this on anything that came from the database. */
  allowHtml?: boolean;
}

export const SOURCE_LABEL: Record<PostSource, string> = {
  kosh: "Kosh",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  community: "Community",
};

/* The shelves. Order matters — this is the order they appear on /blog. */
export const CATEGORIES: { key: Category; label: string; blurb: string }[] = [
  { key: "lesson", label: "Lessons", blurb: "The concepts, two minutes at a time." },
  { key: "guide", label: "Guides", blurb: "Longer reads that go properly into one thing." },
  { key: "how-to", label: "How-tos", blurb: "Step by step, for something you're doing today." },
  { key: "faq", label: "Questions", blurb: "The things people actually ask us." },
  { key: "story", label: "Stories", blurb: "Why we build what we build." },
  { key: "news", label: "News", blurb: "What changed, and whether it affects you." },
  { key: "article", label: "Articles", blurb: "Everything else worth reading." },
];

export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label])
) as Record<Category, string>;

export const LOCAL_POSTS: Post[] = [
  {
    slug: "how-much-money-do-i-need-to-start-investing",
    title: "How much money do you need to start investing in Bangladesh?",
    dek: "Less than almost anyone tells you — and the number matters far less than what you do first.",
    date: "2026-08-16",
    category: "faq",
    tags: ["beginner", "first steps"],
    source: "kosh",
    readMins: 4,
    allowHtml: true,
    body: [
      "This is the question we get more than any other, usually phrased as an apology: <em>\"I only have a few thousand taka, is that even worth it?\"</em>",
      "<b>The short answer.</b> You can start a DPS at a few hundred taka a month at most banks. Mutual fund units trade in small lots. A BO account, which you need to buy anything listed on the DSE, costs a modest annual maintenance fee. None of these require the kind of money people imagine.",
      "<b>The real answer.</b> The amount is the wrong thing to be stuck on, because the first thing you should do with money isn't invest it anyway.",
      "Before any of it, you want roughly three months of expenses somewhere you can reach in a day. Not because it earns — it barely does — but because it's the thing that stops one bad month from forcing you to sell an investment at the worst possible moment. Almost everyone who lost money in a crash and never came back has that story.",
      "<b>So the honest order is:</b> buffer first, then a small amount invested at a size where being wrong costs you nothing, then more once you've watched yourself behave through a red month.",
      "If you're starting with ৳1,000, that is genuinely enough — not because ৳1,000 will grow into anything meaningful, but because it will teach you what you do when the number moves. That lesson is the expensive one, and this is the cheapest possible way to buy it.",
      "<b>What not to do.</b> Don't wait until you have a \"serious\" amount. People who wait for the round number tend to wait for years, and the habit never forms. And don't let a small balance push you toward something promising huge returns to make it worthwhile — small balances are exactly who those schemes are built for.",
    ],
  },
  {
    slug: "is-investing-haram-halal-questions",
    title: "Is investing haram? And the other questions we get asked",
    dek: "An honest answer about what Shariah screening does, what it doesn't, and who actually decides.",
    date: "2026-08-14",
    category: "faq",
    tags: ["halal", "shariah"],
    source: "kosh",
    readMins: 4,
    allowHtml: true,
    body: [
      "We get asked this a lot, and it deserves a straight answer rather than a marketing one.",
      "<b>First, what we are not.</b> Kosh does not issue religious rulings. We are not scholars and we won't pretend to be. What we can do is show you what an investment actually contains, so that you — or someone you trust to advise you — can judge it.",
      "<b>What screening usually means.</b> When a fund calls itself Shariah-compliant, it generally means it applies two kinds of filter. A <em>sector</em> filter excludes businesses whose income comes from things like conventional interest-based banking, alcohol, gambling, or tobacco. A <em>financial</em> filter excludes companies whose debt or interest income crosses a set threshold, even if the business itself is fine.",
      "<b>Where the honest complexity lives.</b> Different boards set those thresholds differently, and scholars genuinely disagree — about how much incidental interest income is tolerable, about purification of dividends, and about specific instruments. Two funds can both be certified and still not screen identically. That isn't a scandal; it's a real difference of opinion, and you're allowed to have a view on it.",
      "<b>The one thing to actually check.</b> Don't go by the word \"Islamic\" in a fund's name. Look for the named Shariah board, the published screening policy, and whether they disclose purification amounts. A fund that won't tell you its methodology is asking for trust it hasn't earned.",
      "<b>The part nobody says out loud.</b> A great deal of what gets sold to religious communities as \"halal investment\" is simply fraud wearing a costume — halal forex schemes, guaranteed-return Islamic funds run out of a Telegram group, and \"Shariah-compliant\" MLMs. A promised fixed high return is a problem on both religious and financial grounds, and it should raise your suspicion, not lower it.",
      "In Kosh, halal filters are built in rather than bolted on, and when a fund surfaces you can see its screening policy alongside its numbers. What you do with that is properly your decision.",
    ],
  },
  {
    slug: "how-to-check-a-scheme-is-registered",
    title: "How to check whether a scheme or company is actually registered",
    dek: "Ten minutes of checking has saved more money in Bangladesh than any investment tip ever has.",
    date: "2026-08-10",
    category: "how-to",
    tags: ["scams", "safety"],
    source: "kosh",
    readMins: 4,
    allowHtml: true,
    body: [
      "Almost every large loss starts the same way: the offer sounded good and nobody checked. Checking is boring, free, and takes about ten minutes.",
      "<b>1. Find out what they claim to be.</b> A broker, an asset manager, a bank, a cooperative and a \"business partner\" are regulated by completely different bodies — or by nobody at all. If they can't name what kind of licensed entity they are, that is already your answer.",
      "<b>2. Match it to the right regulator.</b> Securities businesses — brokers, merchant banks, asset managers, mutual funds — sit under the Bangladesh Securities and Exchange Commission, and the exchanges publish their own member lists. Banks and financial institutions sit under Bangladesh Bank. Cooperatives sit under the cooperative department, which is a much lighter regime than most people assume. Each publishes lists you can search.",
      "<b>3. Check the name, not the logo.</b> Scams routinely use a real licensed firm's name, a near-identical name, or a genuine licence number belonging to somebody else. Search the regulator's own list for the exact legal entity, then confirm the office address and phone number from that listing rather than from their marketing.",
      "<b>4. Ask where the return comes from and who pays it.</b> A legitimate firm can answer this in one sentence. If the answer involves recruiting other people, trading you can't inspect, or a formula nobody will explain, stop there.",
      "<b>5. Test the exit before the entry.</b> Ask exactly how you withdraw, how long it takes, and what it costs. Deposits are always instant in these schemes; it's the withdrawal that suddenly needs a fee, an upgrade, or \"one more deposit\". Ask before you're in, and watch how they react to the question.",
      "<b>If it's already gone wrong.</b> Stop sending money immediately — the recovery fee is the second scam, run by the same people surprisingly often. Save every message, receipt and transaction id, then file with the police and the relevant regulator. It's slow and it's often unsatisfying, but it is documented, and it makes you visible to any wider case.",
      "One more thing, because it matters: people who get caught are not stupid. They're usually under financial pressure, and someone offered them a way out that matched exactly how urgently they needed it. If it happened to you, the useful response is checking the next one, not being ashamed of the last one.",
    ],
  },
  {
    slug: "inflation-the-tax-nobody-votes-for",
    title: "Inflation is the tax nobody votes for",
    dek: "Why money in a savings account can be perfectly safe and still lose.",
    date: "2026-08-08",
    category: "lesson",
    tags: ["basics", "inflation"],
    source: "kosh",
    readMins: 3,
    allowHtml: true,
    body: [
      "Here is the uncomfortable arithmetic that makes investing worth understanding at all.",
      "Say your money sits somewhere earning a modest, guaranteed rate. Nothing can go wrong — the number never falls. Now say prices rise faster than that rate. Your balance goes up and what it buys goes down. You have been perfectly safe and you have still lost.",
      "<b>This is why \"safe\" needs a second question.</b> Not \"can this lose money?\" but \"can this keep up with what things cost?\" Those are different questions, and most people only ever ask the first.",
      "You can feel it without any maths. Think about what a plate of rice, a CNG ride, or a year of your child's school cost five years ago versus today. That gap is the rate your savings actually have to beat. Not zero.",
      "<b>What this does not mean.</b> It does not mean move everything into the market. Money you'll need this year belongs somewhere boring and reachable, and the fact that it slowly loses ground is simply the cost of it being available — that's a fair trade, made deliberately.",
      "It means the money you won't touch for years is a different decision, and leaving it all somewhere \"safe\" is itself a choice with a price. Nobody sends you a bill for it, which is exactly why it goes unnoticed for a decade.",
      "The point of learning any of this isn't to make you anxious about your savings account. It's so that when you decide to leave money there, you're deciding — not defaulting.",
    ],
  },
  {
    slug: "your-first-ten-minutes-on-kosh",
    title: "How to use Kosh: your first ten minutes",
    dek: "What to tap first, what to ignore for now, and what you should walk away knowing.",
    date: "2026-08-12",
    category: "how-to",
    tags: ["kosh app", "getting started"],
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
    category: "guide",
    tags: ["kosh app", "practice"],
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
    category: "how-to",
    tags: ["organizations", "kosh live"],
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
    category: "story",
    tags: ["funance", "behind the scenes"],
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
