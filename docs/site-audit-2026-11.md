# koshfinance.com audit, 26 Nov 2026

Checked live at 375px and 1440px with Chrome (Playwright), on `/`, `/bd`, `/bd/start`,
`/learn`, `/bd/offerings` and `/investors`. `/bd/courses`, `/bd/teach` and `/verify` are
not live yet; they sit on the uncommitted `hamid/courses-site` branch.
Screenshots: `docs/audit-shots/before/` (live site), `docs/audit-shots/after4/` and the `compare*.jpg` files
(this branch).

The question I tested: can a first-time visitor from Bangladesh tell, in about five
seconds, **what Kosh is, who it's for and what to do next**?

**Before:** no. The first screen showed a tiger, a computer, "98% of Bangladeshis don't
invest formally", and the half-sentence "Since you were never taught about money, let
us". There was no button on the first screen. The only next step was "power on",
which most people won't press. On a phone, 10 nav links took up two rows, and a
"Switch to Kosh Bangladesh" banner covered the bottom of the hero.

**After (this branch):** the boot screen says what Kosh is ("Kosh teaches you money and
investing. Free to start."). Below it are two buttons, **Start here, free** and **Get the
app**, with the source for the 98% figure. The phone nav is now **Start here** and
**Menu**.

---

## P0: fix now (done on this branch unless marked)

| # | Lens | Problem | Fix | Status |
|---|---|---|---|---|
| 1 | Understanding | The hero had no next step. All buttons were behind the power button. | Added **Start here, free** (`/bd/start`) and **Get the app** to the hero strap. | Done |
| 2 | Copy | The boot-screen line was a fragment: "Since you were never taught about money, let us". | Changed it to "Kosh teaches you money and investing. Free to start." | Done |
| 3 | Design, mobile | The hero nav showed 10 links in a 5×2 grid at 11.5px on phones and pushed the hero down. | Phones now see **Start here** and **Menu**. Menu opens the same 10 links in two columns at 14px. | Done |
| 4 | Understanding | The homepage never said what anything costs. Money basics, paid courses, Kosh Plus, the Money Lab, Classroom and verified investors were not mentioned anywhere. | Added a **"Most of Kosh is free"** section after "Start here", in `src/v2/Offer.tsx`, with three cards: Free, In the app, Paid. All prices match the brief. | Done |
| 5 | Design | The geo banner ("Looks like you're in Bangladesh…") showed on `/investors`, `/bd/start`, `/bd/offerings` and other pages. It covered the deck and CTAs and sent people to `/bd`, which they hadn't asked for. | The banner now shows only on `/` and `/global`. | Done |
| 6 | Copy | A number had no source: the hero's 98%. | Added a source line under the hero buttons: "CDBL BO accounts against the adult population". | Done, **date still needed** (see P1-1) |

## P1: next

| # | Lens | Problem | Suggested fix |
|---|---|---|---|
| 1 | Copy | The CDBL stat ("<2% invest", "~98% don't") has no date. I didn't guess one. | Riddo: add the CDBL month and year in `src/v2/copy.ts` (`STAT_HOOK`), in the Problem `STATS`, and in the hero source line. |
| 2 | Copy | Stat dates. | Done: S&P FinLit Survey now says 2014. Findex already said 2021. Consider switching to Findex 2025 if Bangladesh's figure is out. |
| 3 | Copy | "gurus selling the basics as masterclasses" went after paid courses right next to Kosh's own paid courses, and used a banned word. | Done: changed to "gurus with something to sell". |
| 4 | Copy | Inside: "with a season you can race your friends through. **Nobody finishes a course they downloaded.**" This contradicts the paid courses and brings back the Season framing. | Done: changed to "**Start with Money basics: 12 lessons, free.**" |
| 5 | Copy | "Explainable AI tells you why it surfaced". This is buzzword-heavy. | Done: changed to "Each card says why it showed up, in plain language, with the numbers shown." |
| 6 | Design, mobile | Sub-pages had about 140px of empty space between the nav and the Back button. On `/bd/offerings` at 375px, Back overlapped the "KOSH LEARN · COURSES…" label. | Done: on phones, Back now sits 14px under the nav, and the overlap is gone. |
| 7 | Understanding | The nav has three overlapping words: **Offerings**, **Product** and **Services**. It also has **Bangladesh** and **Global** next to **About us**. That's 10 links, and a newcomer can't tell Offerings from Product. | Cut it to about 5: Start here · Learn · Courses · For organisations · About. **Needs Riddo's OK:** this changes the information architecture. |
| 8 | Understanding | The homepage is about 28,000px tall on a phone and has 14 sections. The NSU sign-up form (dates "to be announced") sits third, above the problem statement. | Move NSU into a slim banner or `/bd/rsvp` only. Merge Problem + Who-it's-for. **Needs Riddo's OK** (it reorders the page and removes a section). |
| 9 | Copy | Two contact emails: `hello@koshbd.com` (NSU form) and `koshinitiative@gmail.com` (everywhere else). | Pick one. If koshbd.com mail isn't monitored, that's a privacy-promise problem on the form. |
| 10 | Copy | "Kosh Courses" in the CRT menu and the Learn teaser still point to `/bd/offerings/courses`, and the copy still says "live webinar cohorts". | Already fixed on `hamid/courses-site` (it points to `/bd/courses`). After that branch merges, point the new Offer section's course line at `/bd/courses` too. |
| 11 | Understanding | `/investors` at 375px: the deck's keyboard hint ("← → to move · N notes · F fullscreen") overlaps the slide on phones, where there's no keyboard. | Hide the hint under 640px and show "Swipe" instead. |
| 12 | Copy | `/learn` opens with a lime line, "Market context: Bangladesh · Product examples and rules are local.", which reads like a debug label. | Delete it, or change it to "Written for Bangladesh." |

## P2: polish

- **Light mode:** `v2.css` has no `prefers-color-scheme` rule, so the site is dark-only. Contrast is fine in dark. Muted mono labels at 10–11px (for example "CDBL · BO ACCOUNTS" at about 45% white) are below 4.5:1. Raise to 0.6 alpha.
- **Hero, desktop:** the strap (sub-line, buttons) sits over the keyboard artwork. I gave the second button a solid backing so it stays readable. A cleaner fix is to move the strap to the dark band under the tiger, but that's a design call.
- **Promise chips:** "Scam detection · Personalised guidance · Portfolio tools · Shariah screening" are features with no link or proof. Either link each one or drop the row.
- **"How Kosh works":** "AI agents read … every day" is fine and factual. Keep "AI" to that one place.
- **Footer:** "power off" at the very bottom is an in-joke that newcomers won't get. It's harmless.
- **Screenshot testing:** Playwright's full-page capture repeats sections because of the pinned hero and Lenis. Walk the page in viewport-sized steps instead (see `fx.ts` note).

## Fact check against the current offer

| Fact | On the live site | After this branch |
|---|---|---|
| Money basics: free learning journey in the app, paid course on the website | missing | Offer section + Inside |
| Courses ৳999 / ৳499 founding (account + full-app waitlist with licensed broker) | missing | Offer section |
| Kosh Plus ৳99/mo, ৳594/6 mo, ৳1,188/12 mo, bKash/Nagad/bank, contact us | missing | Offer section (mailto "Kosh Plus") |
| Money Lab: Compare, Asset Battle, Time Machine presets free; Time Machine any stock/date + Money X-ray in Plus (decided 25 Nov) | missing | Offer section, split free / Plus |
| Kosh Classroom: free for educators, up to 30 students/class | missing | Offer section |
| Verified investors | missing | Offer section, "Coming soon" while onboarding |
| No Season 1 ৳500 reward | none found (`৳500` only appears in a fake scam SMS in a game, and in "what ৳500 a month becomes") | unchanged |
| Banned words (guaranteed / best / AI-powered / master) | "masterclasses" | removed |

## Open for Riddo

1. The CDBL figure's date (P1-1).
2. The nav cut to 5 links (P1-7) and the homepage trim (P1-8). Both are larger IA changes, so I haven't made them.
3. Whether verified investors are free or Plus. The Offer card lists them under "In the app" without a price on purpose. (The Money Lab split is settled and applied.)

---

## Round 2: Riddo's notes, 26 Nov (applied)

| Note | What changed |
|---|---|
| Hero said the 98% twice and the source took space | The boot screen keeps the 98%. On phones, the chip under it now appears only after power-on. The source is now 9px at the bottom-left, opposite SKIP INTRO: "98% · source: CDBL BO accounts". No date needed; it's a public figure. |
| "Kosh teaches you money and investing" | Changed to "Kosh makes you money-smart. Then you invest, knowing why." I didn't say "invest in one place": investing in the app is still on the waitlist. |
| Fake gurus | Problem copy now reads: trading "gurus" who don't understand how markets work, selling the basics for ৳4,000–5,000 and calling it a masterclass. |
| Courses: self-paced, low prices, help if you can't pay | The Offer intro says every course is self-paced so you finish it, and paid ones are priced as low as possible. New line: "Want to learn but can't afford it? Email us and we'll try to sort it out." |
| "Each card says why…" too wordy | Changed to "Each card tells you, in simple words, why it's there." |
| Simplify the whole site | Plain-English pass on Pitch, Start here doors, Problem, Free tools, How Kosh works, Inside, Funance, For organisations and The long game. Shorter sentences, everyday words ("pretend money", "fees and all"), same punch. Jargon gone: "instrumented", "white-label decision engine", "connects financial uncertainty with real opportunity", "red week", "headline rate". |
| P1-7 nav | Hero nav is now 5 links: **Start here · Learn · Courses · For organisations · About**. "Start here" is lime. The sticky nav dropped the Markets menu. Global moved to the footer; TV, live sessions and Blog were already there. |
| P1-8 NSU | The NSU sign-up block is off the homepage. It lives at `/bd/rsvp` (still linked from the footer and the Offerings menu). |
| P1-9 email | Every address on the site is now **hello@koshfinance.com**. That covers `MAIL`, the waitlist and contact mailtos, the NSU privacy line, `index.html` JSON-LD and `llms.txt`. **Done 26 Nov:** `hello@` is a Mailbux mailbox (MX, SPF and DKIM on Namecheap DNS) that keeps a copy and forwards to koshinitiative@gmail.com and riddo.sk@gmail.com. |
| P1-11 deck hint | On phones the deck says "Swipe to move". The page caption now mentions swiping. |
| P1-12 /learn | The "Market context…" line is deleted. |
| /bd/offerings "what changed?" | The first fix was too small to notice. Now, on phones, Back sits right under the nav and the hero starts right after it. About 190px of empty screen is gone, along with the overlap. |

Still waiting on Riddo: whether verified investors is free or Plus.
