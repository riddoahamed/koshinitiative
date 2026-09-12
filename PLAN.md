# /for-organizations — build decisions

Built 8 September 2026 against `BUILD-PLAN-for-organizations.md`, the static
mockup, and `kosh-comparables-research.md`. This file logs the calls made where
the spec was silent, and the two places the page deliberately departs from it.

## Where it lives

`koshbd.com/for-organizations`, in the **landing repo** (`~/Desktop/koshlanding`),
not the app repo. `/for-schools` is an alias route onto the same page.

- Page: `src/pages/ForOrganizations.tsx`
- Modules: `src/v2/forg/AllocationBoard.tsx`, `src/v2/forg/ScamOrNot.tsx`
- Styles: `src/v2/forg/forg.css`

**Every class in `forg.css` is prefixed `fo-`.** Vite emits one stylesheet for
the whole site, so an unprefixed class here is global everywhere — this is the
bug that once rendered a 7px homepage dot 812px tall from inside `vote.css`.

## Departures from the spec

**1. One statistic was cut as unverifiable.** The mockup's fourth number — "1 in
4 cannot tell the difference between a want and a need" — could not be traced to
PISA 2022 or to any other source. It is replaced with a verified figure from the
same report: **11%** reach Level 5, the level at which a student can identify and
respond appropriately to a financial scam message. It is a stronger number for
this page anyway, because it points straight at the Protect strand and at the
Scam or Not? demo.

The other three are verified against PISA 2022 Volume IV:
- **18%** — low performers, below Level 2. OECD average across the **14 OECD
  countries assessed**. The page says exactly that; it never generalises to
  Bangladesh, which did not participate, and says so in visible type.
- **63%** — hold an account at a bank or financial institution. Same average.
  The mockup said "bank card or payment account"; the account figure is 63% and
  the card figure is 62%, so the label was tightened to the account.
- **7** — Whitebread & Bingham 2013, phrased as "the foundations of money habits
  are largely in place", never "habits are set by age 7".

**2. The Kaiser caveat is stated more precisely than the brief drafted it.** The
brief said later work found the behavioural effects smaller once publication bias
was accounted for. What the literature actually shows is that the knowledge
effects *survive* adjustment for publication bias, while the effects on behaviour
are consistently smaller — and smaller again for school-based programmes. FAQ 9
says that, because a curriculum head who knows the literature will know the
difference, and the honest version is still the humbler one.

## The organizations layer (added beyond the original spec)

The brief specified a schools page. The route is called `/for-organizations` and
the site's nav has always pointed at "For organizations", so the page now opens
with six segments rather than one: **schools** (the flagship, and the programme
the rest of the page specifies), universities, offices and employers, **RMG and
factory floors**, NGOs and community groups, and financial partners.

Each carries one concrete line about what the same fifteen-minute loop looks like
in that room — payday and wage safety on a factory floor, the payslip and DPS
against a fund in an office, a printed facilitator pack where there is no phone.

A note under the grid says plainly that schools is the programme running today
and that the other five are scoped with their first partner before they are sold.
That note is load-bearing: rule 7 of the brief says only list what can be
delivered, and this is the honest way to show breadth without promising a roster
that does not exist yet.

The segments reuse audiences the site already claims — `Sections.tsx` has listed
"Garment & factory workers" among Kosh's audience for months, and `llms.txt`
already describes revenue as programmes for universities, employers and NGOs.

## Constants used

- **Reference distribution** for the Grow allocation: a fixed ten-bin constant
  (`REFERENCE_GROW`) in `AllocationBoard.tsx`. **It is invented, not measured**,
  and it is labelled "a reference cohort" everywhere it appears — never "your
  class" or "your year group" — until real cohort data exists to replace it.
- **Roll-forward rate: 8% a year over 10 years.** Chosen to match the mockup's
  own worked example (৳1,500 → ৳3,240; the live figure is ৳3,238). The rate is
  printed on screen next to the number, and the copy calls it a long-run average,
  never a forecast or a promise.

## Decisions made where the spec was silent

- **Fonts.** The mockup specifies Montserrat + Inter. The site already loads
  Bricolage Grotesque, Manrope, Inter and IBM Plex Mono, and the brief forbids
  shipping a render-blocking font request. The page uses the site's existing
  families at the mockup's weights and sizes. The mockup wins on layout; it does
  not get to add a fourth family.
- **Shell.** The page renders through `PageShell`, so it inherits the site nav,
  footer, back control and SEO wiring rather than the mockup's standalone nav.
  Light sections inside the dark v2 shell are an established pattern
  (`paper-sec` on the homepage).
- **The gate is four fields and composes an email.** Name, organisation, role,
  email — then `mailto:`. There is no lead store on this site, and a form that
  silently files a request it cannot file is worse than one that opens a mail
  client. The note under the form says nothing is stored by the page.
- **The overview PDF is not generated yet.** It is Pass 3 in the brief. The gate
  requests it; the document itself still has to be written, and it must carry the
  same no-pricing and no-delivery-format rules as the page.
- **No-JavaScript degradation is not met, and cannot be in this stack.**
  koshbd.com is a client-rendered Vite SPA, so no page on it renders without JS.
  The edge middleware serves crawlers meta and link previews. Flagging rather
  than silently dropping it.
- **Nav and footer now point at the page** instead of the `/#organizations`
  homepage anchor, and that homepage section gained a "See the programmes" link.

## Needs founder sign-off before this is sent to a school

FAQ 12 makes commitments about student data that only Riddo can actually make:
**deletion within thirty days of an engagement ending**, the hosting region being
named in the agreement, and in-region hosting where a school's policy requires
it. These are stated as Kosh's defaults. Confirm or change them before the page
is used in a real conversation with a school handling minors' data.

## Verified in the browser

Both modules were driven end to end at 1280px and 375px:

- The board refuses to submit until the six sliders total exactly 100, and caps
  a slider at the room actually left (dragging Treat to 100 with 5% free set 5).
- All three result panels reveal in sequence; ৳1,500 → ৳3,238 at 8% over 10 years.
- The pressure test handles a bucket that cannot cover a cost: paying ৳4,000 out
  of a ৳2,000 Save bucket drains it, disables it, and says the rest has to come
  from somewhere else — then reports the true split, "৳2,000 from Save, ৳2,000
  from Spend", rather than naming only the last bucket.
- Scam or Not? returned 67% accurate against 87% confident, a +20 point gap, and
  correctly identified the one answer that was certain and wrong.
- No horizontal page overflow at either width; the framework table scrolls inside
  its own container.

**One bug found and fixed during verification:** the scam module's arrow-key
handler was bound to `window`, so moving the allocation sliders with the keyboard
next door silently answered the quiz. It is bound to the card now, which the card
announces.

## Still open

- The overview PDF and its twelve-page structure.
- Real cohort data to replace `REFERENCE_GROW`.
- Lighthouse has not been run; the page ships inside the site's existing bundle,
  which is already over the brief's 500KB budget for reasons that predate it.
