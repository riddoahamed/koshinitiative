# Kosh design refresh: what I'd change, 26 Nov 2026

For Riddo to approve before anything is built.

**Sites looked at (live, 26 Nov):** Robinhood, Public, Wealthsimple, Trading 212, Groww,
Zerodha Varsity, Lightyear, Freetrade, Stake, Sharesies, eToro, Acorns, Finary,
Scalable Capital, Kuvera and Revolut. For design trends: godly.website and 21st.dev.
Mobbin needs a login, so I skipped it.

Reference sheets are in `docs/design-refs/`: `heroes-1..3.jpg` show the first screen of
each site, and `sections-1..2.jpg` show one scroll down.

---

## Why Kosh looks about six months behind

The current look comes from the 2024–25 "dark AI startup" template:

| What Kosh does now | Where it shows up | What the best sites do instead |
|---|---|---|
| Headlines that shift from purple to mint | almost every H2 (`grad-text`) | Solid colour. At most one word picked out in one flat colour (Robinhood lime, Public black, Stake black) |
| Glowing outline icons in tinted squares | Start here doors, Kosh Learn cards, Free tools, chips | No stock icons. They use real product screens, photos, a mascot (Acorns' squirrel) or hand-drawn art (Varsity) |
| Starfield, shader gradient, blurred colour blobs behind sections | Pitch, Problem, How it works, Funance, Orgs | One quiet background per page. The only lighting effect is a single big product moment (Freetrade's horizon glow) |
| Glass cards everywhere | every grid | Solid cards with a hairline border, or no cards at all |
| Mono uppercase eyebrow with a leading dash on every section | all 14 sections | A plain label on a few key sections only |
| 14 sections, about 28,000px tall on a phone | homepage | 6–9 sections, each with one idea and one next step |

21st.dev is a good example of the soft blue-glow "component library" look. That's the
generic style to move away from.

## What's fresh right now (Nov 2026)

1. **Editorial serif headlines.** Robinhood, Public, Stake, Wealthsimple and Kuvera all
   pair big, calm serif headlines with a plain sans for body text. It reads as trustworthy
   and grown-up, which is the opposite of "crypto bro".
2. **The product is the hero.** Trading 212, Freetrade, Stake and Lightyear put a real
   app screen in a real device frame in the first screen. Trading 212's phone changes
   screen as you scroll: "Choose a company → Pick an amount → Get your shares".
3. **Big honest numbers as the pitch.** Lightyear shows "€0 · €0 · 2.50%". eToro shows
   "$1 · 0% · 0.3%". There are no adjectives, just the numbers.
4. **Flat brand colour used with confidence.** Robinhood uses lime on black. Sharesies
   uses one hot pink. Acorns uses one green. There are no gradients in the type.
5. **Character.** Acorns' squirrel, Varsity's line-drawn man with tea and Groww's
   isometric city all give the site a personality, not a template.
6. **Light and dark sections that alternate.** Robinhood and Sharesies switch between
   black and white bands, so the page has rhythm instead of one long dark scroll.
7. **Education as a first-class product.** Varsity says "Free and open… no signup, no
   paywall, no ads", then shows modules, videos, a certificate and a junior track as
   coloured tiles. That's the closest model for Kosh's courses.

## Recommendations, in order

### 1. Let people use the app inside the website (highest impact)
The web app has no `X-Frame-Options` header, so it can be embedded. Put a **live,
clickable Kosh app** on the homepage:
- **Phones:** a phone frame showing the app.
- **Desktop:** a laptop frame showing the app.
- Above it: "Try it right here. No sign-up."

This is the strongest funnel move. People touch the real Discover feed, a fund page and
practice money before anyone asks for anything.

The app needs two small changes first:
- A `?guest=1` URL that skips the "explore as guest?" prompt.
- A check that sign-in and storage still work when the app runs inside the website.

### 2. Replace the "How Kosh works" list with a scroll story
Use a Trading 212-style story: the phone stays fixed while the steps change.

**Learn → Understand → Practise → Invest**

Each step shows the real screen: a lesson, a "why this card" explanation, the ৳10,00,000
practice account, then the brokerage waitlist. This is where the mission lands: *we break
it down, you understand, then you invest.*

### 3. Strip the template look (cheap, big visual win)
- Remove `grad-text` from headlines. Use solid off-white, with at most one word in solid lime.
- Remove the Starfield, ShaderBg and blob backgrounds from content sections. The jungle
  CRT artwork stays as the one illustrated moment.
- Replace glowing icons with Kosh's own world:
  - small crops of the engraved navy and paper-ink collage plates you already own
    (`public/img/collage-navy.jpg`, `paper-ink.jpg`, `paper-lime.jpg`)
  - the tiger
  - Doggesh and Kitty from the Money 101 reels, as the guides through lessons
- Swap glass cards for solid cards with a hairline border.
- Keep mono eyebrow labels on two or three sections only.

### 4. Alternate dark and paper sections
Use the paper-ink plates as light "paper" bands, for example for the mission, the
courses and "what it costs". Then the site has rhythm, and the light sections become
where people do the reading.

### 5. A big-numbers bar right after the hero
> **৳0** to start · **12** free lessons · **৳10,00,000** practice money · **30** students per class, free

Every number is a fact from the current offer.

### 6. A mission band (copy from your notes)
> **Bangladesh's first generation of confident investors.**
> We break investing down until it makes sense, so you never have to trust blindly.
> We give you the analysis, tech and research the professionals use.
> We teach it free, or at the lowest price we can, with the best educators we can find.
> When enough of us invest with confidence, the market has to get better.

### 7. One funnel, one next step per section
The path: **Hero** (Explore the app / 1-min quiz) → **quiz result** (your level and one
lesson) → **free Money basics course** → **paid course** or **Kosh Plus** → **brokerage
waitlist**.

- Every section ends with one button that moves people one step along.
- Phones get a slim sticky bottom bar: "Explore the app free".

### 8. Cut the homepage to about 8 sections
Hero · Numbers bar · Live app preview · Scroll story · Courses & what it costs · Games
(compact) · Mission · Footer.

Problem, Who it's for, SDGs, For organisations, The long game and Join us move to `/about`
and `/bd/for-organizations`.

### 9. Typography (your call: this breaks the brand lock)
The brand rule says fonts and colours can't change. If you're open to it, a serif for H1
and H2 is the single biggest "2026" signal. Options: **Instrument Serif**, **Fraunces** or
**Newsreader**, with Manrope or Inter staying for body text.

If not, keep Bricolage and do 1–8, which already get most of the way there.

### 10. Trust strip
Show these as a quiet logo/text row under the hero:
- the licensed brokerage partner, once you can name it
- NSU Startups Next
- verified certificates
- "we never hold your money"

## What I'd build first (one pass, about a day)
1. Strip the template look (rec. 3).
2. Add the numbers bar (5) and the mission band on paper (4 + 6).
3. Make the homepage cut (8).
4. Add the sticky mobile CTA (7).

The live app embed (1) and the scroll story (2) come next. They need the app's `?guest=1`
change.

**Decisions needed from you:**
- Serif headlines, yes or no?
- Can Doggesh and Kitty appear on the site?
- Go ahead with the homepage cut?

---

## Built: pass 1 (26 Nov, Riddo approved)

Decisions: **serif headlines yes** (the brand rule is broken on purpose and can be reverted).
**Doggesh and Kitty** only where they earn a place, not repeated, so none were added in this
pass. **Homepage cut yes.**

- **Type:** Instrument Serif for H1/H2, the hero line and the "Inside Kosh" claims. A
  highlighted word is now *italic lime* instead of a purple→mint gradient. H3 and body text
  stay in Manrope and Inter.
- **Flat look:**
  - Lime buttons and outline buttons replace the gradient and glass ones.
  - Cards are solid with a hairline border and no glow.
  - The Starfield, WebGL shader, blur blobs and veils are gone from every content section.
  - Section labels are quiet grey, with no dash.
  - The tinted-square icons are gone.
- **Paper bands:** "What it costs" and the new mission band use the paper and ink colours.
- **New:**
  - A numbers bar under the hero: ৳0 · 12 · ৳10,00,000 · 30.
  - A mission band, "Bangladesh's first generation of confident investors", with five lines.
  - A sticky "Explore the app free · no sign-up" bar on phones.
- **Homepage, 14 sections to 9:** Hero · Numbers · Start here · Inside Kosh · How Kosh
  works · What it costs · Free tools · Games · Mission.
- **New `/about` page** (and `/bd/about`): Founder story · Mission · Problem · Who it's for
  and SDGs · The long game · For organisations · Join us. The old `#story`, `#inclusion` and
  `#join` anchors now point to `/about#…`. Pitch and the Kosh Learn teaser are off the
  homepage; Offer and the courses pages cover them.
- **Season 1 ৳500:** the app's Learn screenshot (`public/img/app/learn.webp`) showed the
  Season 1 "Spender to Investor ৳500" card. I cut it out of the image. The app still ships
  `src/data/season1.ts`, so re-running `npm run shots` would bring it back until the app
  drops it.

**How to revert:** delete the "NOV 2026 REFRESH" block at the end of `src/v2/v2.css` and the
`Instrument+Serif` family in `index.html`'s font link. The structural changes (sections,
`/about`) are plain JSX and can be reverted in git.

**Next pass:** live app embed (rec. 1, needs `?guest=1` in the app), scroll story (rec. 2),
collage art in place of the removed icons (rec. 3), trust strip (rec. 10).

## Built: pass 2 (26 Nov, Riddo's notes)

- **98% fact:** now a "did you know" message from Kosh that pops in over the artwork. The
  artwork fades into the black above and below instead of stopping at a hard edge.
- **CRT menu:** cut to four items (About · Courses · Learn · Blog). It's sized to the glass
  (`cqw`), so the spacing is the same on phone, tablet and desktop, and Try Kosh always fits.
- **Start here:** a taste of the gamified learning. Each door shows a real app screen and
  opens the app in guest mode on that feature:
  - the money check at `/check`
  - the learning path at `/learn`
  - the 10-game arcade at `/play`
- **Numbers bar:** "30 students a class" (the B2B2C Classroom) is replaced with "10 money
  games". Classroom is also off the consumer cost card.
- **How it works:** the separate section is gone. The five steps now sit beside the
  scrolling for-you feed, under "Our AI finds it. People check it. You decide." That saves
  a section.
- **Pictures:**
  - No captions under app screenshots any more.
  - The drawn laptop is now a real browser window (traffic lights plus the
    `app.koshfinance.com` URL bar).
  - New screenshots from the live app. The learning path is now a scrolling reel, and the
    practice shot is the Practice portfolio.
  - `npm run shots` now hides any Season 1 or ৳500 promo card before capturing.
- **Free tools:** retitled "Check before you put money anywhere." No more counting things.
- **Games:** now "The Kosh arcade: Ten games. Zero real money." It lists the arcade as it
  stands in the app (Candle Quest, Kalo Taka, Hot or Catfish, Which Investor Are You?, The
  Ledger Trail, IPO Launch, Scam Spotter, plus MonerPoly, Kosh Quest and Grand Trade Auto).
- **Not live in the app yet** (checked 26 Nov as a guest): `/course/money-basics` and a
  Money Lab route both return 404. The site's "Money basics: 12 lessons" and Money Lab lines
  describe the offer the app is about to ship. Hold the deploy until those are live, or
  soften the lines.
