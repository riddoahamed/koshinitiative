/* ── Posts ────────────────────────────────────────────────────────────────────
   Two sources, one library:

   1. LOCAL:  the articles below. Ship with the site, no infra, always there.
   2. SYNCED: rows in the Supabase `posts` table: Facebook and Instagram
                arrive automatically, LinkedIn posts are embedded by hand, and
                community submissions land there once approved.

   Security note: only local posts may contain HTML, because we wrote them.
   Everything from the database is rendered as plain text no matter what
   arrives. A caption or a stranger's submission is untrusted input and never
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
  /** ── The in-app lesson this post is the long version of ────────────────
      Set only where the lesson actually exists. A link to a lesson that was
      "about to be written" is worse than no link: the reader spends a tap and
      lands on a zone list, and stops trusting the next one. */
  lesson?: { href: string; label: string; note?: string };
}

export const SOURCE_LABEL: Record<PostSource, string> = {
  kosh: "Kosh",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  community: "Community",
};

/* The shelves. Order matters: this is the order they appear on /blog. */
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
  // ── THE TWO US-MARKETS GUIDES ─────────────────────────────────────────────
  //
  // Longer and heavier than anything else on this shelf, and deliberately so.
  // "Can I buy Apple from Bangladesh" is the most-asked question the desk gets
  // after "how do I open a BO account", and the honest answer has a regulatory
  // half that no listicle anywhere covers. A four-paragraph FAQ answer would
  // have been a nicer-looking page and a worse one to have read.
  //
  // BOTH POSTS PUT THE FX RULES FIRST. Bangladesh runs a largely closed
  // capital account; the Capital Account Transaction (Equity Investment
  // Abroad) Rules 2022 are written for COMPANIES, and there is no individual
  // scheme comparable to India's LRS. A guide that opens with the fun part and
  // buries that is how a reader ends up funding a brokerage through a channel
  // they can't explain to their own bank later.
  //
  // Each has an in-app lesson (`lesson`), and each lesson links back here
  // (`readMore` in the app's src/data/modules/usMarkets.ts). Keep the pair in
  // step: if a number changes in one, it is wrong in the other.
  //
  // Charts are inline SVG so they inherit the theme and stay correctable —
  // classes live under "LONG-FORM ARTICLE FURNITURE" in v2.css.
  {
    slug: "how-to-start-investing-in-us-markets-from-bangladesh",
    title: "How to actually start investing in US markets from Bangladesh",
    dek: "Index funds first, single stocks last, and the currency question nobody puts at the top where it belongs.",
    date: "2026-08-28",
    category: "guide",
    tags: ["us markets", "etfs", "index funds", "beginner"],
    source: "kosh",
    cover: "/posts/post-usd-note.jpg",
    readMins: 12,
    allowHtml: true,
    lesson: {
      href: "https://app.koshbd.com/module/z6-7",
      label: "Your first share doesn't have to be a Dhaka one",
      note: "The same ladder as a 14-minute lesson, with the checks, the ordering game and a quiz that will catch you out on the W-8BEN.",
    },
    body: [
      "Somebody messages the desk about this most weeks. It is always some version of the same sentence: <em>everyone says just buy the S&amp;P 500, can I do that from here?</em>",
      "Yes. And that is genuinely the least interesting part of the answer, because the hard bit isn't buying — buying takes about ninety seconds on a phone. The hard bit is everything either side of it: where the dollars legally come from, which rung of the ladder you start on, and the two taxes that quietly take a bite before you ever see a taka.",
      "So let's do it in the order it actually bites, rather than the order that's fun.",

      "<h3>First: how does the money even get out?</h3>",
      "Here is the thing almost nobody leads with. Bangladesh runs what economists call a <b>closed capital account</b>. Translated: money coming in is welcome and lightly documented. Money going out to be invested is restricted, and heavily documented.",
      "India has the Liberalised Remittance Scheme — an annual allowance any resident can use to send money abroad and invest it. <b>We don't have one.</b> There's no Bangladeshi equivalent. The Capital Account Transaction (Equity Investment Abroad) Rules 2022 do exist, but read them and you'll find they define the applicant as a <em>company</em>, with Bangladesh Bank approval, credit-rating tests and export-earnings limits. An individual simply isn't in that document.",
      "Which means the honest question isn't \"which broker\". It's <b>where do my dollars come from?</b> Realistically there are three legitimate answers:",
      "<div class=\"artnote\"><span class=\"artnote__k\">The three real routes</span><p><b>1. You already earn in foreign currency.</b> Freelancer, remote worker, contractor, IT exporter — you can retain a share of what you earn in foreign currency through your bank's export-retention arrangements. You're not moving taka out; you're choosing not to convert dollars in. That's a completely different transaction, and it's the cleanest position anyone here can be in.</p><p><b>2. An RFCD account.</b> A Resident Foreign Currency Deposit account holds foreign currency you physically carried back from a trip abroad, and balances in it are freely transferable out again. Real, legal, and small. Specifically not for local business or export proceeds.</p><p><b>3. You live abroad, or used to.</b> NFCD accounts, a foreign salary, foreign residency — different rules entirely, and mostly easier ones.</p></div>",
      "And the ones that look normal in a Facebook group and are not routes: hundi, a friend's foreign card, buying crypto with taka to sell for dollars offshore, or a travel-quota card used for something that isn't travel.",
      "It's worth being precise about <em>why</em> those are a bad idea, because \"it's illegal\" isn't the argument that lands. The argument that lands is this: money that arrives in your investment account through a channel you can't describe is money you can't explain later. And later is exactly when it matters — when you want to bring a meaningful sum home, when a bank asks, when you're filling in a tax return that's supposed to include foreign assets.",
      "<p class=\"artpull\">The investing is the easy part. The funding is the regulated part.</p>",
      "So before anything else: go to an Authorised Dealer branch — a bank licensed to deal in foreign exchange — describe your actual income, and ask what channel applies to you. Get it in writing. That one conversation is worth more than any ticker anyone will ever send you.",

      "<h3>The platforms Bangladeshis actually use</h3>",
      "Naming them, because a guide that says \"use a platform\" and names none is a guide that helps nobody. These are ones our own team have opened accounts with and used. None of this is a recommendation, and none of them is us.",
      "<div class=\"arttable\"><div class=\"arttable__scroll\"><table><thead><tr><th>Platform</th><th>What it actually is</th><th>Where it fits</th></tr></thead><tbody><tr><td><b>Elevate Pay</b></td><td>A US-based USD account aimed at freelancers and remote workers. Clients pay in, you hold dollars, spend on a virtual Mastercard, or cash out to your bank or bKash. No monthly fee — but it only accepts money sent from <b>business</b> accounts, so a payment from a client's personal account bounces back.</td><td>The <b>earning</b> leg. It's where foreign income lands — not an investment account.</td></tr><tr><td><b>nsave</b></td><td>A USD/GBP/EUR account that opens from Bangladesh, with an Invest tab that buys funds and ETFs fractionally from about $1.</td><td>The <b>boring bottom rung</b>. Dollars and index funds in the same place.</td></tr><tr><td><b>Fasset</b></td><td>A regulated, Shariah-screened app for tokenized US stocks, gold and crypto. Fractional from about $1; roughly $0.54 per buy, $0.54 + 0.5% on a sale.</td><td><b>Single companies</b>, and the halal-screened route.</td></tr></tbody></table></div><div class=\"arttable__cap\">Fees and features checked August 2026 — all three change theirs, so check before you fund.</div></div>",
      "Two things people get wrong here, both worth a sentence.",
      "<b>nsave's own Bangladesh guide covers funds and ETFs — not individual US shares.</b> If you want one company, that's Fasset's lane. Don't assume a platform sells something because it sells something next to it. (We got this wrong ourselves once, from reading a homepage instead of a product page.)",
      "<b>\"Safeguarded\" is not \"insured\".</b> nsave holds balances at UK and EEA credit institutions and says plainly that this isn't FSCS cover — the protection a UK bank deposit gets. Fasset's shares are tokenized, meaning what you own is a claim backed 1:1 by a real share rather than the share sitting in your name on a US register. Neither of those is a scandal. Both are things you should be able to say out loud before you send money.",

      "<h3>The ladder</h3>",
      "Now the actual investing. Four rungs, and the entire discipline is refusing to skip.",
      "<div class=\"artsteps\"><div class=\"artstep\"><span class=\"artstep__n\">01</span><div class=\"artstep__b\"><h4>One line that owns 500 companies</h4><p>A broad US index fund. You're not picking a company, an industry or a moment — you're buying the average of the largest listed businesses in the world's biggest economy and letting time do the work. This is the rung with the long, boring, well-documented record. It's also the rung people skip, because it doesn't feel like doing anything.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">02</span><div class=\"artstep__b\"><h4>Widen out</h4><p>The US is a huge slice of the world's listed value. It is not the world. A global or ex-US fund sitting next to the first one means one country's bad decade doesn't have to be your bad decade.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">03</span><div class=\"artstep__b\"><h4>Tilt — with a slice, not the pot</h4><p>Sector funds (semiconductors, healthcare, energy) and growth funds. This is where you say <em>I think this industry matters more than average.</em> You can be completely right about the industry and still lose money on the timing, which is precisely why this rung gets a slice.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">04</span><div class=\"artstep__b\"><h4>Single companies — last, and smallest</h4><p>Only for a business you can explain to a friend in four sentences: what it sells, who pays for it, why they keep paying, and what would stop them. If you can't do the four, you don't have a thesis. You have a ticker.</p></div></div></div>",
      "People want to start at rung four. It's the rung with the stories, the screenshots and the podcast episodes. It's also the rung where being wrong is most expensive and where you learn the least, because a single stock going up teaches you nothing about whether you were right.",

      "<h3>Picking the fund: four numbers, and one of them is worth real money</h3>",
      "Once you're on rung one, the decision is narrow. It comes down to these.",
      "<b>1. The expense ratio.</b> The annual slice the fund keeps. On a broad index fund it should be tiny. The gap between 0.07% and 0.70% sounds like a rounding error and absolutely is not:",
      "<figure class=\"artchart\"><p class=\"artchart__t\">৳1,00,000, left alone for 30 years</p><p class=\"artchart__s\">Same index, same 7% a year before costs. The only difference is the fund's fee.</p><svg viewBox=\"0 0 700 300\" role=\"img\" aria-label=\"Bar chart: a 0.07 percent fund grows one lakh taka to about 7.47 lakh over thirty years, while a 0.70 percent fund reaches about 6.25 lakh.\"><line class=\"cg\" x1=\"60\" y1=\"250\" x2=\"680\" y2=\"250\" stroke-width=\"1\"/><rect x=\"120\" y=\"60\" width=\"150\" height=\"190\" rx=\"8\" fill=\"hsl(156 85% 62%)\" opacity=\"0.85\"/><rect x=\"400\" y=\"91\" width=\"150\" height=\"159\" rx=\"8\" fill=\"hsl(270 95% 65%)\" opacity=\"0.75\"/><text class=\"cv\" x=\"195\" y=\"46\" text-anchor=\"middle\">৳7,46,550</text><text class=\"cv\" x=\"475\" y=\"77\" text-anchor=\"middle\">৳6,25,170</text><text class=\"cl\" x=\"195\" y=\"272\" text-anchor=\"middle\">0.07% a year</text><text class=\"cl\" x=\"475\" y=\"272\" text-anchor=\"middle\">0.70% a year</text><line class=\"cg\" x1=\"580\" y1=\"60\" x2=\"580\" y2=\"91\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><text class=\"cl\" x=\"592\" y=\"79\" fill=\"hsl(85 95% 65%)\">৳1.21 lakh gone</text></svg><figcaption>Compounded arithmetic, not a projection — 7% before costs is an illustration, not a promise. <b>The difference is about a sixth of the final pot,</b> paid to nobody in particular.</figcaption></figure>",
      "<b>2. Domicile — and this is the one that surprises people.</b> A fund registered in the United States is a US asset. A fund registered in Ireland (you'll see \"UCITS\" in the name) is not, and it collects US dividends under Ireland's own tax treaty. For someone sitting in Dhaka that difference shows up twice, in withholding and in estate tax. More on both in a moment, because it's worth actual money.",
      "<b>3. Size and spread.</b> A big, heavily-traded fund has a narrow gap between the price you buy at and the price you could sell at. A tiny one doesn't — and you pay that gap on the way in and again on the way out.",
      "<b>4. What's actually inside it.</b> Open the top ten holdings before you buy. Broad US index funds have become genuinely concentrated:",
      "<figure class=\"artchart\"><p class=\"artchart__t\">\"500 companies\" is doing less work than it used to</p><p class=\"artchart__s\">Roughly how a broad US index fund's weight is distributed today.</p><svg viewBox=\"0 0 700 150\" role=\"img\" aria-label=\"Stacked bar: the ten largest companies are roughly 38 percent of a broad US index fund, the other 490 are roughly 62 percent.\"><rect x=\"40\" y=\"40\" width=\"235\" height=\"46\" rx=\"6\" fill=\"hsl(270 95% 65%)\" opacity=\"0.85\"/><rect x=\"277\" y=\"40\" width=\"383\" height=\"46\" rx=\"6\" fill=\"hsl(156 85% 62%)\" opacity=\"0.35\"/><text class=\"cv\" x=\"157\" y=\"69\" text-anchor=\"middle\" fill=\"#fff\">~38%</text><text class=\"cv\" x=\"468\" y=\"69\" text-anchor=\"middle\">~62%</text><text class=\"cl\" x=\"40\" y=\"110\">The 10 biggest companies</text><text class=\"cl\" x=\"660\" y=\"110\" text-anchor=\"end\">The other 490</text></svg><figcaption>Indicative — check your own fund's fact sheet, and note that <b>this number has been climbing for a decade.</b> Not a reason to avoid index funds. A reason not to then buy three more funds that all hold the same ten names and call it diversification.</figcaption></figure>",

      "<h3>The two taxes, and the one everyone forgets</h3>",
      "<b>Dividend withholding.</b> The default US rate on dividends paid to a foreigner is 30%. But the United States and Bangladesh have had an income tax treaty in force since 2006, and under it the ceiling on ordinary dividends is <b>15%</b>.",
      "That halving is not automatic. You claim it by filing a <b>W-8BEN</b> with your platform — a short form asking who you are, where you live, and which treaty you're claiming under. It takes five minutes. Most people either never file it or file it without ticking the treaty part, and quietly pay double for years.",
      "<div class=\"artnote artnote--warn\"><span class=\"artnote__k\">The one nobody mentions</span><p><b>US estate tax.</b> US-registered shares and US-registered funds are US-situs assets. If you're not an American, the exemption is <b>$60,000</b> — not the multi-million figure US citizens get — and the rate above it climbs steeply, up to 40%.</p><p>The income treaty doesn't fix this, because it isn't an estate treaty. Irish-domiciled UCITS funds aren't US-situs assets at all, which is the single biggest reason non-Americans with real money in the market hold the Irish version of the identical index.</p></div>",
      "And the Bangladeshi side doesn't vanish because the asset is abroad. Foreign assets and foreign income belong in your NBR return. Talk to someone who does this for a living — this is a blog post, not tax advice, and it can't be.",

      "<h3>The currency is half your return</h3>",
      "This is the part that gets left out of every \"how to buy the S&amp;P from Bangladesh\" post, and it's arguably the biggest term in the equation.",
      "<p class=\"artpull\">Your result in taka = what the index did + what the taka did − everything it cost you.</p>",
      "That middle term has been enormous:",
      "<figure class=\"artchart\"><p class=\"artchart__t\">Taka per US dollar</p><p class=\"artchart__s\">Roughly ৳86 in mid-2022, roughly ৳123 in August 2026.</p><svg viewBox=\"0 0 700 290\" role=\"img\" aria-label=\"Line chart showing the taka weakening against the dollar from about 86 in 2022 to about 123 in 2026.\"><line class=\"cg\" x1=\"60\" y1=\"50\" x2=\"680\" y2=\"50\" stroke-width=\"1\"/><line class=\"cg\" x1=\"60\" y1=\"145\" x2=\"680\" y2=\"145\" stroke-width=\"1\"/><line class=\"cg\" x1=\"60\" y1=\"240\" x2=\"680\" y2=\"240\" stroke-width=\"1\"/><text class=\"cl\" x=\"52\" y=\"54\" text-anchor=\"end\">৳130</text><text class=\"cl\" x=\"52\" y=\"149\" text-anchor=\"end\">৳105</text><text class=\"cl\" x=\"52\" y=\"244\" text-anchor=\"end\">৳80</text><polyline points=\"70,217 215,149 360,126 505,80 650,77\" fill=\"none\" stroke=\"hsl(85 95% 65%)\" stroke-width=\"3\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><circle cx=\"70\" cy=\"217\" r=\"5\" fill=\"hsl(85 95% 65%)\"/><circle cx=\"215\" cy=\"149\" r=\"5\" fill=\"hsl(85 95% 65%)\"/><circle cx=\"360\" cy=\"126\" r=\"5\" fill=\"hsl(85 95% 65%)\"/><circle cx=\"505\" cy=\"80\" r=\"5\" fill=\"hsl(85 95% 65%)\"/><circle cx=\"650\" cy=\"77\" r=\"6\" fill=\"hsl(85 95% 65%)\"/><text class=\"cv\" x=\"70\" y=\"205\" text-anchor=\"start\">86</text><text class=\"cv\" x=\"650\" y=\"64\" text-anchor=\"end\">123</text><text class=\"cl\" x=\"70\" y=\"266\" text-anchor=\"middle\">2022</text><text class=\"cl\" x=\"215\" y=\"266\" text-anchor=\"middle\">2023</text><text class=\"cl\" x=\"360\" y=\"266\" text-anchor=\"middle\">2024</text><text class=\"cl\" x=\"505\" y=\"266\" text-anchor=\"middle\">2025</text><text class=\"cl\" x=\"650\" y=\"266\" text-anchor=\"middle\">2026</text></svg><figcaption>Indicative interbank levels, not official rates — Bangladesh Bank publishes the real series. Roughly <b>9% a year of depreciation</b> across that stretch.</figcaption></figure>",
      "Read that in both directions, because most people only read it in one.",
      "It means dollar assets have <em>flattered</em> their taka returns lately. A 6% year in dollars arrived home looking like a 15% year. Over that window, simply holding dollars beat a lot of taka savings products before a single share was bought.",
      "It also means the reverse can happen. If the taka strengthens, a decent year in dollars lands as a flat one. And it means the exchange rate you actually get — on the way out and again on the way back — is a real cost worth writing down, not a detail the app quietly handles for you.",

      "<h3>The order to do it in</h3>",
      "<div class=\"artsteps\"><div class=\"artstep\"><span class=\"artstep__n\">01</span><div class=\"artstep__b\"><h4>Answer the funding question</h4><p>In one sentence: where do my dollars legally come from? If you can't finish that sentence, that — not the ticker — is your next task.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">02</span><div class=\"artstep__b\"><h4>Open and verify the account</h4><p>NID or passport, address, a selfie. Usually a day or two.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">03</span><div class=\"artstep__b\"><h4>File the W-8BEN, and claim the treaty</h4><p>Five minutes for a permanent halving of dividend withholding. The highest hourly rate you will ever earn.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">04</span><div class=\"artstep__b\"><h4>Move the money — and write down the rate you got</h4><p>Not the headline rate. The all-in one, after the spread. It's the number you'll want when you compare platforms later.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">05</span><div class=\"artstep__b\"><h4>Buy the boring one, in the smallest size that still feels real</h4><p>Small enough that being wrong costs nothing. Big enough that you actually watch it. That tension is the whole point of the first purchase — you're not buying returns, you're buying information about your own behaviour.</p></div></div></div>",

      "<h3>Then: learn how to learn</h3>",
      "Here's the uncomfortable truth about this stage. The information is free, abundant and mostly fine. Company filings, fund fact sheets, earnings calls — all public, all free, all sitting there. What's scarce isn't information. It's the ability to read it, and that only arrives after you've read a lot of it badly.",
      "Which is why collecting tips is such a trap. A tip has a shelf life of about a week and teaches you nothing you can reuse. A method — read the filing, check the number against last year, check it against a competitor, write down what would change your mind — works on every company for the rest of your life.",
      "<b>Find a community that argues.</b> The useful group is the one where somebody posts a thesis and three people immediately try to break it. The dangerous one is where somebody posts a screenshot of a gain and everyone says nice. You can tell them apart in about four minutes of scrolling.",
      "<div class=\"artnote artnote--stop\"><span class=\"artnote__k\">And the part we're obliged to say, and mean</span><p>Nothing here is a recommendation. Kosh is not a licensed financial adviser, we never take custody of your money, and we don't tell anyone what to buy. What we can do is show you the mechanism and the numbers and be honest about which questions still have no answer.</p><p>Do your own due diligence — and take that phrase literally. It means <em>you</em> check. Not that you find someone more confident to check for you.</p></div>",
      "If you want the same ground with the checks, a game and a quiz that will absolutely catch you out on the W-8BEN, the lesson version is below.",
    ],
  },
  {
    slug: "us-market-strategies-for-bangladeshi-investors",
    title: "US market strategies for Bangladeshi investors — and how we actually find ideas",
    dek: "Portfolio shapes, what the numbers mean, what price action can and can't tell you, and an honest look inside the AI analyst that does this every night.",
    date: "2026-08-27",
    category: "guide",
    tags: ["us markets", "research", "portfolio", "analysis"],
    source: "kosh",
    cover: "/posts/post-tradingscreen.jpg",
    readMins: 16,
    allowHtml: true,
    lesson: {
      href: "https://app.koshbd.com/module/z6-8",
      label: "Reading an American company: signal, noise and what the numbers mean",
      note: "The research method as a 16-minute lesson, with a signal-or-noise game and a quiz on the numbers that trip people up.",
    },
    body: [
      "There's a version of this article that is a list of tickers, and it would get read ten times more than this one. We're not writing that one, for a reason that will make more sense by the end: a ticker has a shelf life of about a week, and a method doesn't.",
      "This is the longer, less comfortable version. Where the money legally comes from, what shape a portfolio can take, what each number is actually asking, what price action honestly tells you, and — because people ask and we may as well be straight about it — exactly how the AI analyst inside Kosh puts a card together, including the parts it refuses to do.",
      "If you've never bought anything in dollars, start with <a class=\"ilink\" href=\"/blog/how-to-start-investing-in-us-markets-from-bangladesh\">the beginner guide</a> instead. This one assumes you're past that.",

      "<h3>The constraint that shapes everything: you can't just wire money out</h3>",
      "It's tempting to skip this because it isn't the fun part. Skip it and every strategy below is theoretical.",
      "Bangladesh runs a largely <b>closed capital account</b>. There's no local equivalent of India's Liberalised Remittance Scheme — no annual allowance that lets a resident individual send money abroad to invest. The Capital Account Transaction (Equity Investment Abroad) Rules 2022 exist, but they're written for <em>companies</em>, gated on Bangladesh Bank approval, credit ratings and export earnings. Individuals aren't in that document.",
      "So realistically, one of these describes you, and which one changes what's possible:",
      "<div class=\"arttable\"><div class=\"arttable__scroll\"><table><thead><tr><th>If you are…</th><th>Your dollar source</th><th>What that means in practice</th></tr></thead><tbody><tr><td><b>A freelancer, remote worker or IT exporter</b></td><td>Retention of a share of your own foreign earnings, through your bank</td><td>The cleanest position in the country. You aren't moving taka out — you're choosing not to convert dollars in. Documented, explainable, repeatable.</td></tr><tr><td><b>Salaried in taka, travelling occasionally</b></td><td>An RFCD account, funded by foreign currency you physically brought back</td><td>Real and legal, but small and lumpy. It won't fund a monthly plan.</td></tr><tr><td><b>Living abroad, or recently returned</b></td><td>NFCD, a foreign salary, foreign residency</td><td>Different rules, mostly easier ones.</td></tr><tr><td><b>Salaried in taka, no foreign income</b></td><td class=\"bad\">Genuinely constrained</td><td>This is the honest answer people don't publish. Ask an Authorised Dealer bank about your specific case before you assume a workaround exists.</td></tr></tbody></table></div><div class=\"arttable__cap\">Not legal advice. Rules change and banks interpret them differently — get your own answer in writing from an AD branch.</div></div>",
      "<div class=\"artnote artnote--stop\"><span class=\"artnote__k\">Why the workarounds aren't workarounds</span><p>Hundi, a friend's foreign card, taka-to-crypto-to-dollars, a travel-quota card used for something that isn't travel. The problem isn't only that they sit outside the rules. It's that they put money into your account that you cannot explain — and the day you most need to explain it is the day you want to bring a meaningful sum home.</p></div>",
      "The platforms our team have actually opened accounts with and used: <b>Elevate Pay</b> for receiving foreign income into a USD balance, <b>nsave</b> for a multi-currency account with an Invest tab that buys funds and ETFs fractionally, and <b>Fasset</b> for tokenized US shares with Shariah screening. Fees and features were checked in August 2026; all three move theirs, and the beginner guide has the current comparison table.",

      "<h3>Three shapes a portfolio can take</h3>",
      "\"Strategy\" usually gets sold as stock selection. It mostly isn't. It's shape — how much of your money is in what, and why — and shape does far more of the work than selection ever does.",
      "<figure class=\"artchart\"><p class=\"artchart__t\">The same money, three shapes</p><p class=\"artchart__s\">Illustrative proportions, not prescriptions. The point is the shape, not the exact percentages.</p><svg viewBox=\"0 0 700 330\" role=\"img\" aria-label=\"Three stacked bars comparing a core and satellite portfolio, a barbell portfolio, and an unplanned portfolio made entirely of individual stocks.\"><text class=\"cl\" x=\"40\" y=\"28\" fill=\"hsl(240 20% 96%)\" font-size=\"13\" font-weight=\"700\">Core &amp; satellite</text><rect x=\"40\" y=\"40\" width=\"450\" height=\"40\" rx=\"6\" fill=\"hsl(156 85% 62%)\" opacity=\"0.8\"/><rect x=\"492\" y=\"40\" width=\"90\" height=\"40\" rx=\"6\" fill=\"hsl(270 95% 65%)\" opacity=\"0.8\"/><rect x=\"584\" y=\"40\" width=\"56\" height=\"40\" rx=\"6\" fill=\"hsl(85 95% 65%)\" opacity=\"0.8\"/><text class=\"cv\" x=\"265\" y=\"66\" text-anchor=\"middle\" fill=\"#06281a\">75% broad index</text><text class=\"cl\" x=\"537\" y=\"66\" text-anchor=\"middle\" fill=\"#fff\">15% tilt</text><text class=\"cl\" x=\"612\" y=\"66\" text-anchor=\"middle\" fill=\"#1a2200\">10%</text><text class=\"cl\" x=\"40\" y=\"128\" fill=\"hsl(240 20% 96%)\" font-size=\"13\" font-weight=\"700\">Barbell</text><rect x=\"40\" y=\"140\" width=\"510\" height=\"40\" rx=\"6\" fill=\"hsl(210 60% 60%)\" opacity=\"0.7\"/><rect x=\"552\" y=\"140\" width=\"88\" height=\"40\" rx=\"6\" fill=\"hsl(85 95% 65%)\" opacity=\"0.8\"/><text class=\"cv\" x=\"295\" y=\"166\" text-anchor=\"middle\" fill=\"#fff\">85% very safe (bills, cash, deposits)</text><text class=\"cl\" x=\"596\" y=\"166\" text-anchor=\"middle\" fill=\"#1a2200\">15%</text><text class=\"cl\" x=\"40\" y=\"228\" fill=\"hsl(240 20% 96%)\" font-size=\"13\" font-weight=\"700\">No plan — what most people end up with</text><rect x=\"40\" y=\"240\" width=\"600\" height=\"40\" rx=\"6\" fill=\"#ff8f8f\" opacity=\"0.55\"/><text class=\"cv\" x=\"340\" y=\"266\" text-anchor=\"middle\" fill=\"#2a0d0d\">100% individual names, chosen one headline at a time</text><text class=\"cl\" x=\"40\" y=\"310\">Green: broad index · Purple: sector or growth tilt · Lime: single companies · Blue: cash and bills</text></svg><figcaption>Nobody sets out to build the third one. It's what accumulates when every purchase is a separate reaction to a separate story.</figcaption></figure>",
      "<b>Core and satellite</b> is the default for a reason. The core is the engine and it's dull on purpose; the satellites are where you're allowed to have opinions. Crucially, a satellite going to zero is survivable — which is what makes it possible to actually hold one long enough to learn from it.",
      "<b>The barbell</b> suits people who genuinely can't stomach volatility but don't want to be entirely out. Most of it is boring and safe, a small slice is deliberately aggressive, and there's nothing in the middle. It feels strange and it's psychologically much easier to hold than a portfolio that's uniformly medium-risk.",
      "<b>The third one</b> isn't a strategy. It's what accumulates. And it's worth naming because most people reading this are somewhere on the way to it without having decided to be.",
      "<p class=\"artpull\">Position size is the only risk control that works when you're wrong and don't know it yet.</p>",
      "The two rules that matter more than any pick: <b>size positions so that being completely wrong is boring</b>, and <b>decide the size before you're excited</b>, not after. Everything else — stops, targets, rules about averaging down — is downstream of those two.",

      "<h3>How we actually find ideas — the honest version</h3>",
      "People ask what the AI in Kosh does, usually expecting either much more or much less than the truth. Here it is, because the architecture is the interesting part and it's the bit you can steal for your own process.",
      "<figure class=\"artchart\"><p class=\"artchart__t\">One card, start to finish</p><p class=\"artchart__s\">The pipeline that runs nightly on the global names.</p><svg viewBox=\"0 0 700 400\" role=\"img\" aria-label=\"Flow diagram of six pipeline stages, from scouting real market data through to a scored publish gate.\"><g font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"8\" width=\"620\" height=\"46\" rx=\"12\" fill=\"rgba(255,255,255,0.05)\" stroke=\"rgba(255,255,255,0.12)\"/><text x=\"60\" y=\"30\" fill=\"hsl(156 85% 62%)\" font-size=\"11\" font-weight=\"700\">1 · SCOUT</text><text x=\"60\" y=\"46\" fill=\"rgba(242,242,247,0.75)\" font-size=\"12.5\">One cohort a day — last close, day %, 5-day %, 52-week range, plus that day's real news</text><path d=\"M350 58 l0 12 M344 66 l6 8 l6 -8\" stroke=\"rgba(255,255,255,0.3)\" stroke-width=\"1.5\" fill=\"none\"/><rect x=\"40\" y=\"78\" width=\"620\" height=\"46\" rx=\"12\" fill=\"rgba(98,245,132,0.08)\" stroke=\"rgba(98,245,132,0.28)\"/><text x=\"60\" y=\"100\" fill=\"hsl(156 85% 62%)\" font-size=\"11\" font-weight=\"700\">2 · ARITHMETIC — IN CODE</text><text x=\"60\" y=\"116\" fill=\"rgba(242,242,247,0.75)\" font-size=\"12.5\">Every figure computed from the raw data. The model never produces a number.</text><path d=\"M350 128 l0 12 M344 136 l6 8 l6 -8\" stroke=\"rgba(255,255,255,0.3)\" stroke-width=\"1.5\" fill=\"none\"/><rect x=\"40\" y=\"148\" width=\"620\" height=\"46\" rx=\"12\" fill=\"rgba(255,255,255,0.05)\" stroke=\"rgba(255,255,255,0.12)\"/><text x=\"60\" y=\"170\" fill=\"hsl(270 95% 70%)\" font-size=\"11\" font-weight=\"700\">3 · DRAFT</text><text x=\"60\" y=\"186\" fill=\"rgba(242,242,247,0.75)\" font-size=\"12.5\">The model writes prose only — the read, why it matters now, the case against</text><path d=\"M350 198 l0 12 M344 206 l6 8 l6 -8\" stroke=\"rgba(255,255,255,0.3)\" stroke-width=\"1.5\" fill=\"none\"/><rect x=\"40\" y=\"218\" width=\"620\" height=\"46\" rx=\"12\" fill=\"rgba(255,255,255,0.05)\" stroke=\"rgba(255,255,255,0.12)\"/><text x=\"60\" y=\"240\" fill=\"hsl(270 95% 70%)\" font-size=\"11\" font-weight=\"700\">4 · CRITIQUE</text><text x=\"60\" y=\"256\" fill=\"rgba(242,242,247,0.75)\" font-size=\"12.5\">A second pass attacks the first and lists what's unsupported</text><path d=\"M350 268 l0 12 M344 276 l6 8 l6 -8\" stroke=\"rgba(255,255,255,0.3)\" stroke-width=\"1.5\" fill=\"none\"/><rect x=\"40\" y=\"288\" width=\"620\" height=\"46\" rx=\"12\" fill=\"rgba(255,255,255,0.05)\" stroke=\"rgba(255,255,255,0.12)\"/><text x=\"60\" y=\"310\" fill=\"hsl(270 95% 70%)\" font-size=\"11\" font-weight=\"700\">5 · REWRITE</text><text x=\"60\" y=\"326\" fill=\"rgba(242,242,247,0.75)\" font-size=\"12.5\">A third pass answers the criticism — or the card is marked as unfixed</text><path d=\"M350 338 l0 12 M344 346 l6 8 l6 -8\" stroke=\"rgba(255,255,255,0.3)\" stroke-width=\"1.5\" fill=\"none\"/><rect x=\"40\" y=\"358\" width=\"620\" height=\"38\" rx=\"12\" fill=\"rgba(168,85,247,0.1)\" stroke=\"rgba(168,85,247,0.3)\"/><text x=\"60\" y=\"382\" fill=\"rgba(242,242,247,0.85)\" font-size=\"12.5\"><tspan fill=\"hsl(270 95% 70%)\" font-weight=\"700\">6 · GATE </tspan>Scores 5/10 or better and it publishes. Below, a human reads it before anyone else does.</text></g></svg><figcaption>Stage 2 is the one that matters. <b>A language model asked for a P/E will produce a plausible one</b> — so the arithmetic happens in code and the model is handed finished figures to explain.</figcaption></figure>",
      "That second stage is not a design flourish; it's a scar. Ask a model to analyse a company and it will hand you numbers with total fluency, and fluency is indistinguishable from accuracy at a glance. A wrong number in a clean interface is worse than no number at all, because the interface is doing the persuading.",
      "The other rule, written at the top of the file: <b>it never forecasts.</b> No price targets, no \"will reach\", no projections. It analyses fundamentals and news and presents them. If the data sources fail, the card ships with no price talk at all rather than guessing.",
      "That's the part worth stealing. The discipline isn't a cleverer model. It's being willing to publish <em>\"here's what's true and here's what we don't know\"</em> instead of a number that feels satisfying.",

      "<h3>What the numbers actually mean</h3>",
      "One rule sits underneath all of this, and it's the rule most analysis skips:",
      "<p class=\"artpull\">A number on its own means nothing. Every number needs at least two of its three comparisons: its own history, its peers, and the market.</p>",
      "A P/E of 40 is expensive next to a utility, ordinary next to software growing 30% a year, and cheap next to what the same company traded at last year. All three are true at once. Anyone who tells you \"40 is expensive\" full stop has skipped the only step that mattered.",
      "<div class=\"arttable\"><div class=\"arttable__scroll\"><table><thead><tr><th>Number</th><th>The question it's actually asking</th><th>The trap</th></tr></thead><tbody><tr><td><b>Revenue growth</b></td><td>Is the business getting bigger?</td><td>Ignoring deceleration because the number is still big. 30% → 24% → 19% is a slowing business, and slowing is what re-rates a stock.</td></tr><tr><td><b>Gross margin</b></td><td>What <em>kind</em> of business is this?</td><td>Comparing across industries. Software sits above 70% because the second copy costs nothing; retail sits at 25% because every sale has goods behind it.</td></tr><tr><td><b>Free cash flow</b></td><td>Is the profit real?</td><td>Reading net profit and stopping. Profit is an accounting opinion with judgement in it. Cash is a bank balance.</td></tr><tr><td><b>Share count</b></td><td>Is my slice shrinking?</td><td>Never checking. Two companies can grow profit identically and deliver opposite results per share.</td></tr><tr><td><b>Forward P/E</b></td><td>What am I paying?</td><td>Forgetting the \"forward\" is somebody's estimate — and estimates are optimistic. If nobody says which P/E they mean, assume forward.</td></tr><tr><td><b>Net debt / EBITDA</b></td><td>How fragile is this?</td><td>Judging the number without asking how steady the earnings underneath it are.</td></tr><tr><td><b>Dividend yield</b></td><td>What cash comes back?</td><td>Reading it with DSE reflexes. Many big US companies pay nothing and return cash by buying back shares instead — a zero yield there isn't the red flag it is in Dhaka.</td></tr></tbody></table></div></div>",
      "If you take one row from that table, take free cash flow. A company reporting rising profit and falling free cash flow is telling you two different things, and the cash is the one that has to be true.",

      "<h3>Price action: a good detector, a bad oracle</h3>",
      "Charts are honest about exactly one thing — what happened — and silent about everything people want them to say.",
      "<b>Where in the 52-week range</b> the price sits is genuinely useful context. Near the low isn't automatically cheap and near the high isn't automatically expensive, but it tells you what the past year has felt like for everyone already holding it.",
      "<b>Moving averages</b> are the average of the last N closes. That's the entire definition. \"It crossed the 50-day\" is a statement about arithmetic that has already happened.",
      "<b>Volume is the one worth watching</b>, because it's a measure of participation. A 6% move on ordinary volume is noise. A 6% move on four times normal volume means something <em>arrived</em> — and the job is to go and find out what, not to trade the candle. The news is upstream of the chart.",
      "<div class=\"artnote\"><span class=\"artnote__k\">A useful habit</span><p>When a name you follow moves hard, write down the reason <em>before</em> you look at anyone's commentary. If you can't find a reason, that's the finding. Half the moves that feel meaningful have no story behind them at all, and noticing that repeatedly is how you stop reacting to them.</p></div>",

      "<h3>Options — which you probably can't trade, and should still read</h3>",
      "Be clear on the constraint first: <b>neither Fasset nor nsave sells US options.</b> From Bangladesh this is almost always something you read, not something you trade. That doesn't make it useless — two things fall out of options prices that you can't get anywhere else.",
      "<b>Implied volatility</b> is the market's estimate of how much a stock will move. Not which way. Rising IV before an event means participants genuinely disagree about the outcome.",
      "<b>The earnings-implied move</b> is the practical version of that, and it's the single most useful thing options data gives someone who will never place an options trade:",
      "<figure class=\"artchart\"><p class=\"artchart__t\">\"Stock craters after earnings\"</p><p class=\"artchart__s\">An illustration of a completely ordinary reaction being reported as a disaster.</p><svg viewBox=\"0 0 700 200\" role=\"img\" aria-label=\"A range diagram: the options market priced a move of plus or minus 8 percent; the stock fell 6 percent, inside that range.\"><rect x=\"190\" y=\"58\" width=\"320\" height=\"46\" rx=\"8\" fill=\"hsl(270 95% 65%)\" opacity=\"0.18\"/><line class=\"cg\" x1=\"40\" y1=\"81\" x2=\"660\" y2=\"81\" stroke-width=\"1\"/><line x1=\"350\" y1=\"44\" x2=\"350\" y2=\"118\" stroke=\"rgba(255,255,255,0.25)\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/><line x1=\"190\" y1=\"52\" x2=\"190\" y2=\"110\" stroke=\"hsl(270 95% 70%)\" stroke-width=\"2\"/><line x1=\"510\" y1=\"52\" x2=\"510\" y2=\"110\" stroke=\"hsl(270 95% 70%)\" stroke-width=\"2\"/><text class=\"cl\" x=\"190\" y=\"40\" text-anchor=\"middle\" fill=\"hsl(270 95% 70%)\">−8%</text><text class=\"cl\" x=\"510\" y=\"40\" text-anchor=\"middle\" fill=\"hsl(270 95% 70%)\">+8%</text><text class=\"cl\" x=\"350\" y=\"136\" text-anchor=\"middle\">unchanged</text><circle cx=\"230\" cy=\"81\" r=\"8\" fill=\"hsl(85 95% 65%)\"/><text class=\"cv\" x=\"230\" y=\"165\" text-anchor=\"middle\" fill=\"hsl(85 95% 65%)\">actual: −6%</text><line x1=\"230\" y1=\"93\" x2=\"230\" y2=\"148\" stroke=\"hsl(85 95% 65%)\" stroke-width=\"1.5\"/><text class=\"cl\" x=\"350\" y=\"192\" text-anchor=\"middle\">Purple band: the move the options market had already priced in</text></svg><figcaption>Illustrative. A 6% fall against a ±8% expectation is a <b>within-expectations</b> reaction, however the headline reads. Knowing the expected size in advance is what stops a normal move feeling like a catastrophe.</figcaption></figure>",
      "And the honest counterweight: <b>put/call ratios and \"unusual options activity\"</b>, which fill an enormous amount of financial YouTube, are far weaker than they're presented. A large trade might be a hedge, one leg of a spread, or a market maker's inventory. \"Someone bought a million dollars of calls\" is one visible side of something you can't see.",

      "<h3>News: how to read it without being farmed by it</h3>",
      "Three questions, in order, for any headline about a company you hold:",
      "<div class=\"artsteps\"><div class=\"artstep\"><span class=\"artstep__n\">01</span><div class=\"artstep__b\"><h4>Is this new information, or new packaging?</h4><p>An enormous share of financial news is a restatement of a price move, written afterwards to explain it. \"Shares fall on inflation concerns\" is usually a journalist reverse-engineering a reason from a chart.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">02</span><div class=\"artstep__b\"><h4>Does it change the cash the business will earn?</h4><p>A lawsuit, a lost contract, a new regulation, a pricing change — those touch cash. A rating downgrade, an analyst's revised target and a CEO's tweet mostly don't.</p></div></div><div class=\"artstep\"><span class=\"artstep__n\">03</span><div class=\"artstep__b\"><h4>Was it already priced in?</h4><p>The uncomfortable one. If everybody knew it was coming, the price moved before the headline did. This is why good news is so often followed by a fall — and why that isn't irrational.</p></div></div></div>",

      "<h3>The four sentences</h3>",
      "Before any single company — and this is the whole method compressed — write down four sentences. If you can't, you're not ready to own it, and that's a completely respectable place to be.",
      "<div class=\"artnote\"><span class=\"artnote__k\">Write these before you buy, not after</span><p><b>1.</b> What does it sell, and who pays for it?</p><p><b>2.</b> Why do they keep paying? (What stops a competitor taking this?)</p><p><b>3.</b> What am I paying for that today? (The price numbers, with at least two comparisons.)</p><p><b>4.</b> What would tell me I'm wrong? Name the number. <em>\"Gross margin below 40% for two quarters\"</em> is a thesis. <em>\"If it drops a lot\"</em> is a feeling.</p></div>",
      "The fourth is the one nearly nobody writes and the only one that protects you. A thesis you can't disprove isn't research — it's loyalty. And loyalty to a company that doesn't know you exist is an expensive hobby.",

      "<h3>What we're not doing here</h3>",
      "No tickers, no targets, no \"our top five for 2027\". Partly because Kosh isn't a licensed adviser and doesn't take custody of anyone's money, so telling you what to buy would be both wrong and outside what we're allowed to do.",
      "Mostly, though, because it wouldn't help. The thing that compounds isn't a list. It's the habit of asking where the return comes from, checking the number against something, and writing down in advance what would change your mind.",
      "<b>Do your own due diligence</b>, and take the phrase literally: it means <em>you</em> check, not that you find someone more confident to check for you.",
    ],
  },
  {
    slug: "how-much-money-do-i-need-to-start-investing",
    title: "How much money do you need to start investing in Bangladesh?",
    dek: "Less than almost anyone tells you, and the number matters far less than what you do first.",
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
      "Before any of it, you want roughly three months of expenses somewhere you can reach in a day. Not because it earns (it barely does) but because it's the thing that stops one bad month from forcing you to sell an investment at the worst possible moment. Almost everyone who lost money in a crash and never came back has that story.",
      "<b>So the honest order is:</b> buffer first, then a small amount invested at a size where being wrong costs you nothing, then more once you've watched yourself behave through a red month.",
      "If you're starting with ৳1,000, that is genuinely enough. Not because ৳1,000 will grow into anything meaningful, but because it will teach you what you do when the number moves. That lesson is the expensive one, and this is the cheapest possible way to buy it.",
      "<b>What not to do.</b> Don't wait until you have a \"serious\" amount. People who wait for the round number tend to wait for years, and the habit never forms. And don't let a small balance push you toward something promising huge returns to make it worthwhile. Small balances are exactly who those schemes are built for.",
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
      "<b>First, what we are not.</b> Kosh does not issue religious rulings. We are not scholars and we won't pretend to be. What we can do is show you what an investment actually contains, so that you, or someone you trust to advise you, can judge it.",
      "<b>What screening usually means.</b> When a fund calls itself Shariah-compliant, it generally means it applies two kinds of filter. A <em>sector</em> filter excludes businesses whose income comes from things like conventional interest-based banking, alcohol, gambling, or tobacco. A <em>financial</em> filter excludes companies whose debt or interest income crosses a set threshold, even if the business itself is fine.",
      "<b>Where the honest complexity lives.</b> Different boards set those thresholds differently, and scholars genuinely disagree about how much incidental interest income is tolerable, about purification of dividends, and about specific instruments. Two funds can both be certified and still not screen identically. That isn't a scandal; it's a real difference of opinion, and you're allowed to have a view on it.",
      "<b>The one thing to actually check.</b> Don't go by the word \"Islamic\" in a fund's name. Look for the named Shariah board, the published screening policy, and whether they disclose purification amounts. A fund that won't tell you its methodology is asking for trust it hasn't earned.",
      "<b>The part nobody says out loud.</b> A great deal of what gets sold to religious communities as \"halal investment\" is simply fraud wearing a costume: halal forex schemes, guaranteed-return Islamic funds run out of a Telegram group, and \"Shariah-compliant\" MLMs. A promised fixed high return is a problem on both religious and financial grounds, and it should raise your suspicion, not lower it.",
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
      "<b>1. Find out what they claim to be.</b> A broker, an asset manager, a bank, a cooperative and a \"business partner\" are regulated by completely different bodies, or by nobody at all. If they can't name what kind of licensed entity they are, that is already your answer.",
      "<b>2. Match it to the right regulator.</b> Securities businesses, brokers, merchant banks, asset managers, mutual funds, sit under the Bangladesh Securities and Exchange Commission, and the exchanges publish their own member lists. Banks and financial institutions sit under Bangladesh Bank. Cooperatives sit under the cooperative department, which is a much lighter regime than most people assume. Each publishes lists you can search.",
      "<b>3. Check the name, not the logo.</b> Scams routinely use a real licensed firm's name, a near-identical name, or a genuine licence number belonging to somebody else. Search the regulator's own list for the exact legal entity, then confirm the office address and phone number from that listing rather than from their marketing.",
      "<b>4. Ask where the return comes from and who pays it.</b> A legitimate firm can answer this in one sentence. If the answer involves recruiting other people, trading you can't inspect, or a formula nobody will explain, stop there.",
      "<b>5. Test the exit before the entry.</b> Ask exactly how you withdraw, how long it takes, and what it costs. Deposits are always instant in these schemes; it's the withdrawal that suddenly needs a fee, an upgrade, or \"one more deposit\". Ask before you're in, and watch how they react to the question.",
      "<b>If it's already gone wrong.</b> Stop sending money immediately, the recovery fee is the second scam, run by the same people surprisingly often. Save every message, receipt and transaction id, then file with the police and the relevant regulator. It's slow and it's often unsatisfying, but it is documented, and it makes you visible to any wider case.",
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
      "Say your money sits somewhere earning a modest, guaranteed rate. Nothing can go wrong, the number never falls. Now say prices rise faster than that rate. Your balance goes up and what it buys goes down. You have been perfectly safe and you have still lost.",
      "<b>This is why \"safe\" needs a second question.</b> Not \"can this lose money?\" but \"can this keep up with what things cost?\" Those are different questions, and most people only ever ask the first.",
      "You can feel it without any maths. Think about what a plate of rice, a CNG ride, or a year of your child's school cost five years ago versus today. That gap is the rate your savings actually have to beat. Not zero.",
      "<b>What this does not mean.</b> It does not mean move everything into the market. Money you'll need this year belongs somewhere boring and reachable, and the fact that it slowly loses ground is simply the cost of it being available, that's a fair trade, made deliberately.",
      "It means the money you won't touch for years is a different decision, and leaving it all somewhere \"safe\" is itself a choice with a price. Nobody sends you a bill for it, which is exactly why it goes unnoticed for a decade.",
      "The point of learning any of this isn't to make you anxious about your savings account. It's so that when you decide to leave money there, you're deciding, not defaulting.",
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
      "<b>Minute 1–2 · The money check.</b> Six or seven questions about what comes in, what goes out, and what you already have parked somewhere. It isn't a credit score and nothing is shared with anyone, it exists so the rest of the app stops giving you generic advice. Answer honestly, including the uncomfortable one about debt.",
      "<b>Minute 3–5 · Ask the coach one real question.</b> Not \"how do I get rich.\" Ask the thing you actually wondered last week: <em>\"Is Sanchaypatra better than a DPS for me?\"</em> or <em>\"I have ৳20,000 sitting in bKash, is that stupid?\"</em> The coach knows Bangladeshi products, Sanchaypatra, DPS, FDR, DSE-listed funds, and it shows you where its answer came from. If it can't source something, it says so.",
      "<b>Minute 6–8 · Open paper investing.</b> You get a balance in taka that isn't real, on prices that are. Buy something. Anything. The point of this step is not the return, it's that a month from now you'll know what you personally do when a number goes red, and that will have cost you nothing to find out.",
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
      "Paper investing gets dismissed as a toy. It isn't, but it also isn't there for the reason most people assume.",
      "It is not there to prove you can pick winners. Anyone can pick winners with money that doesn't exist; there's no fear in the trade, so the result tells you almost nothing about skill.",
      "<b>It is there to show you your own behaviour.</b> When the number turns red, do you check it every hour? Do you sell? Do you go looking for someone on the internet to reassure you? That reaction is the single biggest determinant of what you'll end up with in twenty years, and it is far cheaper to discover it on paper than on your salary.",
      "<b>How to run it so it's worth something.</b> Pick three things and write one sentence for each: why you bought it, and what would make you sell. Then leave it alone for a month, genuinely alone. At the end of the month, read your three sentences back and mark which ones you actually followed.",
      "Most people find they followed none of them. That's not a failure; that's the lesson arriving early, for free.",
      "When you do move to real money, keep the same habit and shrink the amount. A first real investment small enough that being wrong costs you nothing is not timidity, it's the only version of the experiment that teaches you anything.",
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
      "<b>Before the session.</b> Open the room on the presenting machine and put the QR code on screen. Nobody installs anything and nobody makes an account, they scan, they're in. Twenty seconds for a room of forty.",
      "<b>During.</b> You pose a decision, a fund that just dipped, a \"guaranteed 15% monthly\" offer, a choice between paying off a loan and starting a DPS. Everyone answers on their phone. The tally builds live on the projector, and then you show what the room actually chose before you say a word about what's right.",
      "That gap, between what the room chose and what turns out to be true, is the whole teaching tool. It lands in a way a slide about diversification never will, because they committed first.",
      "<b>After.</b> Every cohort is instrumented, so you get more than an attendance sheet: what people chose, what changed after the explanation, and what they went on to do in the app. If you're running this as a program for a university, a factory floor, or a company, that's the report you can actually take to whoever approved the budget.",
      "If you want to try the format before booking anything, the live room is open, no account, no cost, and you can run it for two people or two hundred.",
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
      "Games fix that cheaply. In MonerPoly you buy Dhaka property and then discover the registration, the নামজারি and the taxes are the actual investment, which is exactly the surprise that ruins real first-time buyers. In Kosh Quest the scams talk to you the way scams here really talk: urgent, flattering, and just plausible enough. In Grand Trade Auto you run a whole city's worth of decisions and watch a portfolio behave over a season.",
      "You lose money in all three. That's the feature. A loss you felt at 11pm in a game is worth more than a warning slide, and it costs the player nothing but an evening.",
      "We call the whole idea Funance, which is a slightly ridiculous word we're keeping. Finance made playable, free, in a browser, with no signup before you've decided whether you like it.",
    ],
  },
];
