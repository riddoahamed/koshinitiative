# koshfinance.com website/app cutover — live

Checked 13 November 2026 (Asia/Dhaka).

## Live cutover on 13 November

Namecheap confirmed services unlocked at 08:19. Verisign no longer reports
clientHold, and authoritative .com delegation is restored. Nine prepared DNS
records are saved: two apex A records, www/app CNAMEs, Google verification TXT,
and Resend's DKIM, return-path CNAMEs and DMARC. Existing mail MX/SPF remain.
The parking redirect was removed. Public Cloudflare and both Google resolvers
return the new Vercel A records. Vercel issued a valid certificate for all three
new public hosts; HTTPS succeeds without bypassing certificate validation.

Both checked releases are promoted, and their migration branches are merged:

- Website: [PR 6](https://github.com/riddoahamed/koshinitiative/pull/6),
  merge `b54b02e2ef25796fe062ed73eb60659e16154dda`. Follow-up route fixes were
  promoted as `dpl_GTWE4ZCxFtQ4MiYF43PNKUWSpCvk` before their source follow-up.
- App: `dpl_GhcSWJFySbosJXWz1ggtFPyAqbRc`, stage 4ezq1fesz. It incorporates
  current production data at `aa5b7dfb`; build and 17 app tests pass again.
  [PR 53](https://github.com/riddoahamed/kosh-web/pull/53) is merged, with
  Vercel and Netlify checks passing; merge `ef8c13fa75a9861e1c32bd88efb357fe22a30d8a`.

Live checks confirm the new root, /bd and app /auth return 200; koshbd.com root
returns 301 to https://koshfinance.com/bd; an old www FDR link returns 301 to
the matching /bd path with its query preserved. App manifest, assetlinks and
PNG preview endpoint passed on the promoted stage. Existing Android launch
origins remain compatible through the same app deployment.

Supabase Site URL is now https://app.koshfinance.com; eight existing/new exact
callback entries are retained. Backend APP_URL and SITE_URL are switched to
https://app.koshfinance.com and https://koshfinance.com respectively. Resend
reports the new domain verified and ready. Only after this verification,
RESEND_FROM was set to `Kosh <hello@koshfinance.com>`. A receiving forwarder
hello@koshfinance.com -> koshinitiative@gmail.com is saved in Namecheap.
Google Search Console verified the new domain through its DNS record. The
new sitemap reports Success and 93 discovered URLs. Change of Address is filed
for both https://koshbd.com/ and https://www.koshbd.com/; both show a move to
koshfinance.com starting 13 November 2026.

All four Namecheap domain-contact roles were saved using the already approved
Primary Address; the dashboard confirmed "Domain contacts updated." Private
profile details are intentionally omitted here. The new domain expires
18 October 2027; auto-renew is currently off. koshbd.com expires 11 May 2027,
belongs to another registrar login, and must continue to be renewed indefinitely.

### Legacy QR routing override

The project-level Vercel route `Kosh session RSVP`
(`b717c0b2-7451-4e76-b3ff-09a10772a676`, pattern `^/rsvp/?$`) intercepted
requests before deployment middleware and rewrote them directly to the old
service with HTTP 200. It is now disabled and that change is published. Keep
it disabled. Explicit /rsvp and /tv redirects in vercel.json retain HTTP 301
and query strings. The old QR event URL now reaches
https://koshfinance.com/bd/rsvp?event=nsu-learn-investing.

### Verification and monitoring

Run `python3 scripts/check-domain-cutover.py` for 24 read-only live assertions,
including TLS validation, old/new host redirects, query preservation, initial
HTML canonicals, sitemap hosts, app auth/assets, RSVP/TV and RSVP CORS. All 24
passed on 13 November. Both builds and 72 focused migration/metadata/app tests
passed. Two historical full-suite persona-copy failures predate this migration.

The active local heartbeat `monitor-kosh-domain-cutover` checks every six hours
through 27 November 2026 at 12:00 Asia/Dhaka. It stays quiet when healthy and
reports meaningful regressions, required action or completion. Codex and the
computer must be running for local monitoring. It performs read-only checks;
no signups, RSVP submissions or test emails are created.

Instagram's website editor is mobile-only. The owner explicitly deferred that
bio-link edit; its old domain link remains functional through the permanent
redirect. Website footer and rehosted event/TV social links now use the verified
@kosh.finance Instagram account and the owned Kosh Finance Facebook page
(profile ID 61582151648664), replacing the dead KoshInitiative Facebook URL.
Facebook's page website is saved as https://koshfinance.com, and its existing
bio now uses app.koshfinance.com. Other bio wording and links are preserved.
Public website app buttons, new QR generation, lesson/game deep links, app
structured data and llms references use app.koshfinance.com. The old app host
remains an installed-Android compatibility alias to the same deployment.

Earlier entries below are historical checkpoints, not current blockers.

## Latest resumed work on 12 November

The owner signed in to Namecheap again. A refreshed, authenticated inspection
still shows “Please contact Risk Management,” and all four domain-contact Edit
links retain their disabled class. The registrant data still contains the old
placeholders. The account is accessible; its domain controls remain restricted.

At 11:00, a fresh Verisign RDAP query reports `client hold` and `client transfer
prohibited`. Direct, non-recursive NS lookup against a.gtld-servers.net returns
authoritative NXDOMAIN. The domain release has not taken effect. No DNS or live
website/app routing change was made.

The owner explicitly approved sending the prepared support reply. Gmail
confirmed “Message sent” at 11:02 to `tos@namecheap.com` from
`koshinitiative@gmail.com`, in existing ticket `NC-QSR-2595`. It asks Namecheap
to remove the remaining domain-level hold, restore DNS and domain-contact
editing, and specify any further verification needed. No private identity
documents or profile details were included.

Proof: `/tmp/kosh-namecheap-support-sent-2026-11-12.png`.
Current restriction: `/tmp/kosh-namecheap-hold-2026-11-12.png`.

Provider release remains necessary before applying the prepared DNS, verifying
HTTPS and email, and promoting both checked migration deployments together.
The records and staged deployments below remain prepared, not live. Compare
production source again immediately before promotion to preserve later updates.

## Preparation and observations from 11 November

Namecheap's 3:47 AM support email confirms the profile issue was resolved.
Nevertheless, the signed-in domain dashboard still says “Blocked / Please
contact Risk Management.” A registry query reports `client hold`, and the
authoritative .com nameserver returns NXDOMAIN. Account access has returned,
but release of the domain-level restriction has not taken effect in the live
registry. The latest Risk Management message in the Kosh mailbox remains the
03:47 profile-resolution message. Refreshing Namecheap now requires another
sign-in, which the owner has been asked to complete before its current controls
can be inspected.

Edge's native control connection failed. The owner authorised Chrome instead
and completed sign-in to Namecheap, Supabase and Resend. Namecheap's session has
since expired. At the last authenticated inspection, domain-contact Edit
controls were disabled.
A test Google TXT save in Advanced DNS did not persist: reloading still shows
only the original parking CNAME and root URL redirect. No DNS change is applied.
The support reply requesting release of the remaining domain block is awaiting
the owner's explicit email-sending authorization; it has not been sent.

Supabase now has eight redirect allow-list entries. Existing entries were kept,
and these exact HTTPS callbacks were added for both app.koshfinance.com and
app.koshbd.com: `/auth`, `/auth?reset=1`, and `/auth?reset=1&next=/ops`.
Site URL remains `https://app.koshbd.com` until the new DNS and TLS work.
Proof: `/tmp/kosh-auth-redirects-added.png`.

Resend now contains the new koshfinance.com domain, ID
`490030b2-f605-4adb-9f16-38051a09ef4b`, region Tokyo. Its actual generated DKIM,
SPF-related CNAME and DMARC records are saved in `resend-dns-records.json`.
DNS verification is “not started”; Forge is disabled. No new from-address was
enabled in the application, and the existing verified sender remains active.
Proof: `/tmp/koshfinance-resend-dns-pending.png`.

The migration now incorporates the exact deployed website source at `be32133`,
including October rates. Its 93 public pages get correct initial HTML metadata,
not only metadata applied after JavaScript loads. RSVP and TV keep their current
upstream services, with public canonical and app links translated to the new
addresses. Their documents and TV stylesheet were checked successfully on the
latest staged deployment:

https://koshinitiative-landing-aqd9qgmc6-riddoahamed-5267s-projects.vercel.app

The app migration is isolated at `/Users/riddo/Desktop/kosh-app-domain-cutover`,
branch `codex/app-domain-cutover`, originally based on deployed app `a1e773e1`.
At 15:27 it incorporated the now-live `da511e11` source, including today's data
ingestion, without conflicts. It updates public app/share/website URLs and RSVP/team-admin
origin allowlists. It does not change ops account identifiers or existing
mailboxes. The app build and 17 preview tests pass, and its staged auth page,
web manifest, Android asset associations and PNG link-preview endpoint return
HTTP 200 on the replacement stage:

https://kosh-h84n4xl7x-riddoahamed-5267s-projects.vercel.app

The previous app stage is superseded. Vercel reports this deployment READY;
its serverless bundler emits NodeNext import diagnostics, while the local
production build passes and `/api/og` serves a PNG successfully.

Website: 55 focused migration/metadata/sitemap checks pass. App: 17 pass. Both
production builds pass. Both stages were deployed with `--skip-domain`; neither
has replaced the existing live deployment. app.koshfinance.com is now attached
to Vercel project `kosh`, with DNS pending.

Search Console already verifies koshbd.com and app.koshbd.com in the Kosh Google
account. Verification for koshfinance.com is prepared but not completed. The
current Vercel and Google DNS records are saved in `domain-dns-records.json`.
Do not file Change of Address or submit the new sitemap until DNS/HTTPS and the
actual old-domain 301s have passed live checks.

Preserve the installed Android app's old launch host as a compatibility alias
to the same application during this website cutover. Existing APKs trust that
host. The public app's canonical URLs move to app.koshfinance.com; do not silently
redirect the installed shell to an origin absent from its trusted-origin list.
An Android binary update is a separate release task.

The backend origin additions have been deployed: `event-rsvp` version 6 has
`verify_jwt=false`, and `team-admin` version 3 has `verify_jwt=true`, preserving
the previous gateway settings. OPTIONS requests from koshfinance.com,
app.koshfinance.com and www.koshbd.com return 204 with the correct allowed
origin. An unrelated origin returns 403. No RSVP submission or email was sent.
Google sign-in is enabled, Apple is disabled. The
Google provider still calls the same Supabase callback host; do not replace that
provider callback with an app URL.

The historical entries below record earlier observations; the summary above is
the latest status.

Update: Namecheap support has temporarily unlocked the account and requires
accurate legal-name and address details in the account profile within 24 hours
of its email. The owner supplied that support reply in chat. A fresh registry
check still reports `client hold`. Edge is at Namecheap sign-in; the existing
prefilled login did not open the account. Waiting for the owner to sign in and
confirm the exact profile details, or enter those private details directly.
No profile information or DNS has been changed.

Later on 11 November, the owner signed in and updated the profile directly.
Namecheap displays “Success! Your Primary Address has been updated.” The saved
legal name and street/apartment fields are present. The phone still appears
incomplete; the owner has been asked to correct or confirm the complete number.
The domain list still shows ALERT with only Contact Support, and a fresh registry
check still reports `client hold`. Risk Management must review and release it.
No DNS or production routing was changed during these checks.

The owner then confirmed the missing final phone digit. The agent corrected
the phone field, saved it, and verified Namecheap's success confirmation and
the complete formatted number on the profile summary. Profile correction is
now saved; Risk Management review and release of the domain remain pending.
Confirmation screenshot: `/tmp/kosh-namecheap-profile-updated.png`.

## Current blocker

The registry reports `client hold` for koshfinance.com. Public DNS returns
NXDOMAIN. The signed-in Namecheap domain page still says to contact Risk
Management even after its profile-resolution email. Namecheap must release the
remaining domain block and enable its contact/DNS controls. The current domain
contacts still contain the former placeholders, and their Edit links are
disabled; they must be corrected once enabled. Domain privacy is on, expiration
is 18 October 2027, and renewal controls are also disabled while blocked.
Proof: `/tmp/koshfinance-namecheap-still-blocked.png`.

Both koshfinance.com and www.koshfinance.com have been added to the existing
Vercel project `koshinitiative-landing`. DNS verification is pending. No live
domain has been promoted to the migration build. The current website and app
continue to serve their existing production deployments.

## Prepared website changes

- `/` is the Kosh Finance market-selection home.
- `/bd` contains the existing Bangladesh website; country pages move beneath it.
- `/global` is an education preview, without a claim that investing, remittance
  or credit services are available. `/au` and `/ae` are not invented as live markets.
- `/learn` and `/blog` remain a single shared library. Existing material is
  explicitly labelled as Bangladesh context.
- Coarse Vercel country detection suggests a market in a dismissible banner.
  It never redirects the visitor automatically.
- Both old website hosts return HTTP 301 to matching new URLs, retaining
  queries. Their home moves to `/bd`. Shared library links go directly to their
  canonical root paths, and static files retain their root paths.
- Canonical URLs, the 93-entry sitemap, robots.txt, link previews, FDR structured
  data, internal navigation and real language/country alternates are updated.

This is a prepared website migration, not a completed operational cutover.
The learner app still uses app.koshbd.com, and the email sender has not changed.

## Required before promotion

1. Have Namecheap Risk Management release the remaining domain-level hold.
   Correct the domain's registrant contacts using the owner's verified profile
   once Edit is enabled. Confirm renewal state; keep both domains renewed.
   The current Namecheap account contains only koshfinance.com; koshbd.com is
   registered in a different account. Preserve existing mail records.
2. Replace the new domain's parking records with the exact current Vercel domain
   recommendations from `domain-dns-records.json`: apex rank-1 A records are
   `216.198.79.1` and `64.29.17.1`; www and app use their saved project CNAMEs.
   Verify DNS and HTTPS before any old-domain redirects are made live.
3. The app destination and exact callback allow-list entries are prepared.
   When DNS/TLS works, switch Supabase Site URL to https://app.koshfinance.com,
   update the backend APP_URL/SITE_URL values, and verify login, confirmation,
   recovery and Google OAuth. Keep old callbacks for existing installations.
4. Apply the saved actual Resend DNS records, verify the new sender and confirm
   the receiving/reply-to route. Change email from-addresses only afterward.
5. Compare the current production source again before promotion in case other
   work shipped after the checked website `be32133` / app `da511e11` baselines.
6. Verify apex/www permanent redirects, deep paths, UTM queries, Bangla pages,
   external RSVP/TV rewrites, downloads, login and recovery in a staged build.
   Review initial HTML metadata as well as client-rendered metadata.
7. Promote the checked deployment once, with the old-domain 301s in the same
   release. Do not promote this branch automatically when DNS recovers.
8. Verify both domains in Google Search Console, submit the new sitemap, and
   file Change of Address for applicable old hosts after redirects are live.
   Update social bios using the owner's authorised accounts.
9. Monitor errors, auth/email delivery, redirect chains and Search Console for
   the following two weeks. Keep old-domain renewal and redirects indefinitely.

## Validation so far

- Website production Vite build and TypeScript check pass; app build passes.
- 55 focused website migration, metadata, rehosting and sitemap checks pass;
  17 app preview checks pass (72 focused checks total).
- Earlier full website suite: 55 passed, 2 failed. Both failures are existing cross-repository
  persona-game copy drift; reproduced unchanged in the original landing repo.
- Main market-selection and Global pages render in Edge locally.

## References

- https://rdap.verisign.com/com/v1/domain/koshfinance.com
- https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- https://supabase.com/docs/guides/auth/redirect-urls
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://support.google.com/webmasters/answer/9370220
