/* ============================================================
   KOSH LIVE — poll options, sample analysis, behavioural tips
   Used by /vote for classroom sessions, demos and user testing.
   ============================================================ */

export type Halal = "yes" | "screen" | "no" | "—";

export type Option = {
  id: string;
  label: string;
  tag: string;
  hue: string;
  /* sample analysis — structural facts, no invented returns */
  what: string;
  horizon: string;
  liquidity: string;
  risk: 1 | 2 | 3 | 4 | 5;
  halal: Halal;
  costs: string;
  watch: string;
  ask: string;
};

export const OPTIONS: Option[] = [
  {
    id: "dse",
    label: "DSE shares",
    tag: "capital market",
    hue: "156",
    what: "Part-ownership of listed Bangladeshi companies, traded on the Dhaka Stock Exchange.",
    horizon: "5+ years to ride out cycles",
    liquidity: "High for blue chips, thin for small caps",
    risk: 4,
    halal: "screen",
    costs: "Brokerage commission, BO account maintenance, capital gains rules by holder type",
    watch: "Concentration in a few names, floor-price episodes freezing exits, and buying on tips rather than filings.",
    ask: "Could you leave this money untouched through a 30% drawdown without needing it?",
  },
  {
    id: "mutual-fund",
    label: "Mutual fund",
    tag: "capital market",
    hue: "156",
    what: "A managed basket of securities — one purchase spreads you across many holdings.",
    horizon: "3–7 years",
    liquidity: "Open-end: redeem at NAV. Closed-end: sell on market, often below NAV",
    risk: 3,
    halal: "screen",
    costs: "Management fee, entry/exit load on some funds",
    watch: "Closed-end funds trading at a persistent discount, and fees quietly compounding against you.",
    ask: "Do you know whether yours is open-end or closed-end? It changes how you get out.",
  },
  {
    id: "sanchaypatra",
    label: "Sanchaypatra",
    tag: "government",
    hue: "85",
    what: "Government savings certificates paying a fixed profit on a set schedule.",
    horizon: "5 years, matching the instrument term",
    liquidity: "Encashable early with a penalty on the rate",
    risk: 1,
    halal: "no",
    costs: "Source tax on profit; purchase ceilings apply per person and scheme",
    watch: "Ceilings, eligibility rules, and rate revisions on new purchases.",
    ask: "Do you need this income monthly, or can it compound untouched?",
  },
  {
    id: "fdr",
    label: "Bank FDR",
    tag: "bank",
    hue: "200",
    what: "A fixed deposit: money locked with a bank for a set term at an agreed rate.",
    horizon: "3 months to 3 years",
    liquidity: "Breakable early, usually forfeiting most of the profit",
    risk: 2,
    halal: "no",
    costs: "Source tax on interest; excise duty by balance slab",
    watch: "Whether the rate actually beats inflation after tax — often the real question.",
    ask: "Is this your emergency fund, or money you're trying to grow? They need different homes.",
  },
  {
    id: "dps",
    label: "DPS / monthly scheme",
    tag: "bank",
    hue: "200",
    what: "A recurring deposit — a fixed amount every month for a fixed term.",
    horizon: "3–10 years",
    liquidity: "Low. Early closure usually drops you to savings-rate profit",
    risk: 2,
    halal: "no",
    costs: "Source tax; missed-instalment penalties on some schemes",
    watch: "Committing to a monthly figure your income can't sustain, then closing early.",
    ask: "Could you keep this instalment going through three bad months?",
  },
  {
    id: "gold",
    label: "Gold",
    tag: "commodity",
    hue: "45",
    what: "A physical store of value, priced globally and converted at local rates.",
    horizon: "Long, and lumpy",
    liquidity: "Sellable quickly, but you pay the spread twice",
    risk: 3,
    halal: "yes",
    costs: "Making charges on jewellery, purity loss on resale, storage and insurance",
    watch: "Buying jewellery as an investment — making charges can vanish the moment you leave the shop.",
    ask: "Are you buying gold, or buying jewellery? The two behave very differently.",
  },
  {
    id: "land",
    label: "Land or a plot",
    tag: "property",
    hue: "30",
    what: "Direct ownership of land, usually bought for long-horizon appreciation.",
    horizon: "10+ years",
    liquidity: "Very low. Selling can take months or years",
    risk: 4,
    halal: "yes",
    costs: "Registration, stamp duty, mutation, ongoing tax, and boundary upkeep",
    watch: "Title defects and disputed possession — the most common way money disappears here.",
    ask: "Have you personally verified the title chain, or are you trusting a relative's word?",
  },
  {
    id: "flat",
    label: "Flat / apartment",
    tag: "property",
    hue: "30",
    what: "A residential unit held to live in, or to rent out for yield.",
    horizon: "10+ years",
    liquidity: "Low, and slower when you most need to sell",
    risk: 4,
    halal: "screen",
    costs: "Registration, utility connections, service charge, maintenance, agent fees",
    watch: "Rental yield after service charge and vacancy is usually far below the headline.",
    ask: "৳10 lakh rarely buys a flat outright — is the rest a loan? Then this is a debt decision first.",
  },
  {
    id: "business",
    label: "Start a small business",
    tag: "enterprise",
    hue: "270",
    what: "Deploying capital into your own operation — the highest-control, highest-effort option.",
    horizon: "2–5 years to a stable return",
    liquidity: "Illiquid, and often needs more capital before it returns any",
    risk: 5,
    halal: "screen",
    costs: "Working capital, trade licence, rent, staff, and your own unpaid time",
    watch: "Under-capitalising: most small ventures die of cash-flow timing, not bad ideas.",
    ask: "Can you survive 12 months if it earns nothing?",
  },
  {
    id: "crypto",
    label: "Crypto",
    tag: "high risk",
    hue: "0",
    what: "Digital assets traded on global venues, with no local regulatory protection.",
    horizon: "Undefined — treat as speculation, not saving",
    liquidity: "High on major assets; on/off-ramps in Bangladesh are the real constraint",
    risk: 5,
    halal: "screen",
    costs: "Exchange fees, spreads, network fees, and total loss on custody mistakes",
    watch: "Bangladesh Bank has repeatedly warned against crypto transactions — legal exposure is a real cost, and there is no recourse if funds vanish.",
    ask: "If this went to zero tomorrow, would it change your life or just annoy you?",
  },
  {
    id: "global",
    label: "US stocks / global ETF",
    tag: "global",
    hue: "220",
    what: "Ownership of companies or index baskets listed outside Bangladesh.",
    horizon: "7+ years",
    liquidity: "High in the market — the constraint is moving money across the border",
    risk: 3,
    halal: "screen",
    costs: "FX spread, platform fees, and remittance rules that limit outward investment",
    watch: "Outward remittance for portfolio investment is tightly restricted for residents — check what's actually permitted before you plan around it.",
    ask: "Do you have a legal route to send and, more importantly, bring money back?",
  },
  {
    id: "savings",
    label: "Leave it in the bank",
    tag: "cash",
    hue: "200",
    what: "Money held in a savings account, fully available on demand.",
    horizon: "Any",
    liquidity: "Immediate",
    risk: 1,
    halal: "no",
    costs: "Account maintenance, source tax on interest — and inflation, the invisible fee",
    watch: "Safety and stagnation feel identical for the first year, then diverge badly.",
    ask: "How much of this do you genuinely need within 6 months? That part belongs here — the rest probably doesn't.",
  },
  {
    id: "cash",
    label: "Keep it as cash",
    tag: "cash",
    hue: "200",
    what: "Physical notes held outside the banking system.",
    horizon: "Any",
    liquidity: "Immediate",
    risk: 2,
    halal: "yes",
    costs: "No fee, and no protection — theft, loss, and full inflation exposure",
    watch: "Cash at home loses purchasing power every single day, silently.",
    ask: "What is this protecting you from that a bank account wouldn't?",
  },
  {
    id: "lend",
    label: "Lend it to family",
    tag: "informal",
    hue: "300",
    what: "An informal loan to someone you know, usually undocumented.",
    horizon: "Whenever they can",
    liquidity: "Socially locked — recall is a relationship decision, not a financial one",
    risk: 4,
    halal: "yes",
    costs: "No paperwork cost. The cost is the relationship if it goes wrong",
    watch: "Undocumented family lending is one of the most common ways savings quietly disappear.",
    ask: "If this were never repaid, would you still be on speaking terms? Answer honestly before lending.",
  },
  {
    id: "debt",
    label: "Pay off a loan first",
    tag: "debt",
    hue: "340",
    what: "Retiring existing debt instead of deploying new capital.",
    horizon: "Immediate",
    liquidity: "Not applicable — this removes a liability",
    risk: 1,
    halal: "yes",
    costs: "Early-settlement fee on some loans",
    watch: "Almost nothing on this list reliably out-earns credit-card or personal-loan interest.",
    ask: "What rate are you paying? If it's above what you'd realistically earn, this is the boring right answer.",
  },
];

export const optionById = (id: string) => OPTIONS.find((o) => o.id === id);

/* ---------------- behavioural finance tips ---------------- */
export type Tip = { t: string; p: string };

export const TIPS: Tip[] = [
  {
    t: "Loss aversion",
    p: "Losing ৳1,000 hurts about twice as much as winning ৳1,000 feels good. That asymmetry is why people hold losers far too long, hoping to get back to even.",
  },
  {
    t: "The gambler's fallacy",
    p: "It crashed early five times, so a big one is “due”. It isn't. Each round is independent — the game has no memory of what it owes you.",
  },
  {
    t: "Recency bias",
    p: "The last three rounds feel like a pattern. Three rounds is not a pattern. Your brain builds trends out of noise because trends are easier to act on.",
  },
  {
    t: "Sunk cost",
    p: "Money already lost cannot be recovered by the next bet. The only question that matters is whether this bet is good on its own.",
  },
  {
    t: "Risk of ruin",
    p: "Bet everything on something with a 10% chance of zero, repeat it enough times, and zero is the only destination. Survival beats speed.",
  },
  {
    t: "Overconfidence",
    p: "A winning streak feels like skill. In a game of chance it is variance wearing a costume — and it makes the next bet bigger.",
  },
  {
    t: "The disposition effect",
    p: "Taking small wins quickly while letting losses run is exactly backwards, and it is what almost everyone does by default.",
  },
  {
    t: "Herding &amp; FOMO",
    p: "Watching someone else cash out at 10x makes your own plan feel stupid. Their luck is not your strategy.",
  },
  {
    t: "Survivorship bias",
    p: "You hear about the one who hit 50x. You never hear from the hundred who didn't — so the odds look far better than they are.",
  },
  {
    t: "Anchoring",
    p: "The first number you see sticks. The “target” you invented at 2x was arbitrary, but now every decision is measured against it.",
  },
  {
    t: "The house edge",
    p: "Every round carries a built-in tilt against you. You can win a round, a night, even a week — time is still on the house's side.",
  },
  {
    t: "Position sizing",
    p: "How much you stake decides whether you survive far more than what you pick. Most blowups are sizing failures, not analysis failures.",
  },
];

export const randomTip = (exclude?: string) => {
  const pool = exclude ? TIPS.filter((t) => t.t !== exclude) : TIPS;
  return pool[Math.floor(Math.random() * pool.length)];
};

/* ---------------- investor profile from play behaviour ---------------- */
export type PlayStats = {
  rounds: number;
  wipeouts: number;
  /* average stake as a fraction of balance at the time */
  avgStakeFrac: number;
  /* how often the stake went UP right after a loss */
  chaseRate: number;
  /* rounds ended by choosing to bank, vs by busting */
  bankedRate: number;
};

export const profileFor = (s: PlayStats) => {
  if (s.rounds < 3)
    return {
      name: "Not enough data",
      p: "Play a few more rounds and we'll read your pattern.",
      tone: "neutral",
    };
  if (s.chaseRate > 0.5 && s.avgStakeFrac > 0.25)
    return {
      name: "The Chaser",
      p: "You raise your stake after losing. That instinct is the fastest route to zero — and it's the single most common pattern we see.",
      tone: "bad",
    };
  if (s.avgStakeFrac > 0.4 || s.bankedRate < 0.3)
    return {
      name: "The Gambler",
      p: "Big stakes, late exits. You'll have spectacular nights and one that ends the account. Real portfolios don't survive this.",
      tone: "bad",
    };
  if (s.avgStakeFrac < 0.08 && s.bankedRate > 0.8)
    return {
      name: "The Freezer",
      p: "You bank almost immediately and stake very little. Safe — but this is the profile that never actually starts investing either.",
      tone: "warn",
    };
  return {
    name: "The Disciplined",
    p: "Consistent sizing, planned exits, no chasing. This is the temperament that compounds — the boring one that wins.",
    tone: "good",
  };
};
