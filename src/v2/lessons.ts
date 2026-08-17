/* ── Quick lessons ────────────────────────────────────────────────────────────
   Six lessons a complete beginner can finish in a coffee break. They live on
   the marketing site on purpose: you should be able to learn something from
   Kosh before you trust Kosh with anything.

   Rules for this file: mechanics, never live rates (rates go stale, mechanics
   don't). Plain language. No product pushed. Educational only.               */

export interface Lesson {
  id: string;
  n: string;
  time: string;
  tag: string;
  title: string;
  hook: string;
  body: string[];
  takeaway: string;
}

export const LESSONS: Lesson[] = [
  {
    id: "what-investing-is",
    n: "01",
    time: "2 min",
    tag: "the basics",
    title: "What investing actually is",
    hook: "It isn’t gambling, and it isn’t a secret. It’s one boring idea.",
    body: [
      "Investing means you buy a piece of something that earns — a company, a fund, a government promise, a piece of land — and you let time do the work. That’s the whole concept. Everything else is detail.",
      "The reason it feels risky is that people skip the first half of the sentence. Buying a share because a Facebook group said it will “go up next week” isn’t investing. You didn’t buy a piece of something that earns. You bought a rumour.",
      "The difference between the two is one question you can always ask: <em>where does the money come from?</em> A company pays you from its profits. A fund pays you from what it owns. A Sanchaypatra pays you from the state budget. If nobody can tell you where your return comes from, that’s not an investment — and it’s usually a scam.",
    ],
    takeaway: "If you can’t explain where the return comes from, you’re not investing.",
  },
  {
    id: "emergency-fund",
    n: "02",
    time: "2 min",
    tag: "before you start",
    title: "The boring move that beats every tip",
    hook: "Three months of expenses, parked where you can reach it.",
    body: [
      "Before your first investment, you need money you can grab in a day without selling anything. Not because it earns well — it barely earns at all — but because it’s the thing that stops one bad month from undoing three good years.",
      "The number is simple: add up what you actually spend in a month — rent, food, transport, bills, the family contribution you never write down — and multiply by three. If your income is irregular (freelance, gig, commission), make it six.",
      "Keep it somewhere dull and reachable: a savings account, a wallet you don’t spend from, a short FDR you can break. It should be boring on purpose. This money’s job is to be there, not to grow.",
      "Almost everyone who lost money in a crash and never came back had one thing in common: they were forced to sell at the worst possible time, because they needed the cash.",
    ],
    takeaway: "Build the buffer first. It’s what lets you hold on when everyone else sells.",
  },
  {
    id: "safe-instruments",
    n: "03",
    time: "3 min",
    tag: "bangladesh",
    title: "Sanchaypatra, DPS and FDR — what they really do",
    hook: "The three things most Bangladeshi families already use, explained honestly.",
    body: [
      "<b>Sanchaypatra</b> is a government savings certificate. You hand money to the state, it pays you interest on a schedule, and you get your principal back at maturity. It’s among the safest things available here, there are purchase ceilings, and cashing out early costs you a chunk of the return.",
      "<b>DPS</b> (a deposit pension scheme) is a bank’s recurring deposit. You commit a fixed amount every month for a fixed number of years and get a lump sum at the end. Its real power isn’t the rate — it’s that it forces the habit. Miss instalments and the whole thing can lose its value to you.",
      "<b>FDR</b> is a fixed deposit. Money locked for a term at an agreed rate. Break it early and you drop to a much lower rate.",
      "All three share one honest weakness. If the rate you earn is lower than the rate prices rise, you are safely getting poorer. That’s not an argument against them — it’s an argument for knowing which part of your money should sit still and which part shouldn’t.",
    ],
    takeaway: "Safe doesn’t mean growing. Check your return against inflation, not against zero.",
  },
  {
    id: "mutual-funds",
    n: "04",
    time: "2 min",
    tag: "the market",
    title: "Mutual funds in two minutes",
    hook: "The cheapest way to stop betting on one company.",
    body: [
      "A mutual fund pools money from many people and buys a basket of things — usually shares and bonds. You own a slice of the whole basket. If one company in it collapses, you lose a slice of a slice instead of everything.",
      "Two numbers matter more than the marketing. <b>NAV</b> (net asset value) is what one unit of the basket is actually worth today. The <b>expense ratio</b> is what the manager charges you every year to run it, whether the fund goes up or down. A fund charging 2.5% a year has to beat the market by 2.5% just to draw level with it.",
      "In Bangladesh, some listed funds trade below their NAV and some above. Neither is automatically a bargain or a rip-off — it tells you what other buyers currently believe, not what the fund is worth.",
      "If you want Shariah-compliant options, check the fund’s own screening policy rather than the word “Islamic” in its name.",
    ],
    takeaway: "One fund spreads your risk. Its fee is the one cost you’re guaranteed to pay.",
  },
  {
    id: "spot-a-scam",
    n: "05",
    time: "2 min",
    tag: "protect yourself",
    title: "How a Bangladeshi scam actually sounds",
    hook: "Five tells. Any one of them is enough to walk away.",
    body: [
      "<b>1. A number with no source.</b> “15% monthly, guaranteed.” Real returns move. Guaranteed high returns are the oldest lie in finance.",
      "<b>2. The money comes from new joiners.</b> If your return depends on recruiting others, it isn’t an investment — it’s a queue, and you’re not near the front.",
      "<b>3. Urgency.</b> “Only today.” “Last 10 slots.” Real opportunities survive you thinking overnight. Pressure exists to stop you checking.",
      "<b>4. It’s only on a phone.</b> A Telegram group, a WhatsApp admin, a Facebook page with borrowed screenshots — and no licence number, no office, no name you can look up with the regulator.",
      "<b>5. Withdrawal gets complicated.</b> Deposits are instant; taking money out suddenly needs a fee, an upgrade, or “one more deposit”. That’s the moment it’s already gone.",
      "The uncomfortable part: most people who get caught aren’t careless. They’re under pressure, and someone offered them a way out that matched exactly how urgently they needed it.",
    ],
    takeaway: "Guaranteed + urgent + unverifiable = walk away. You lose nothing by being slow.",
  },
  {
    id: "first-1000",
    n: "06",
    time: "2 min",
    tag: "your first move",
    title: "Your first ৳1,000",
    hook: "Small enough that being wrong costs nothing. That’s the point.",
    body: [
      "Your first investment isn’t supposed to make you money. It’s supposed to teach you how you behave when the number moves — and you can learn that with an amount you’d spend on a dinner.",
      "Do it in this order. Put the amount somewhere it will sit untouched for a year. Write down, in one sentence, why you bought it and what would make you sell. Then don’t look at it for a month.",
      "That last instruction is the actual lesson. Most beginners don’t lose money because they picked badly — they lose it because they check the price eleven times a day, panic on a red week, sell, and never come back.",
      "If you want to run the whole thing at zero risk first, practise with paper money on real market prices until the decision feels obvious instead of scary. Then do it for real, at a size that can’t hurt you.",
    ],
    takeaway: "Start small, write down why, and leave it alone. Behaviour beats stock-picking.",
  },
];
