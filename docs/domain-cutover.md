# koshfinance.com cutover — prepared, not activated

Checked 11 November 2026 (Asia/Dhaka).

## Latest resumed work on 11 November

Namecheap's 3:47 AM support email confirms the profile issue was resolved.
Nevertheless, a fresh registry query still reports `client hold`, and the
authoritative .com nameserver returns NXDOMAIN. This is live delegation state,
not just a local DNS-cache result. Inspect the domain's current account notice
after sign-in before assuming the profile confirmation released the domain.

Edge's native control connection failed. The owner authorised Chrome instead.
Chrome is connected, but Namecheap rejected its saved login; manual sign-in is
pending. Supabase and Resend are also waiting on their existing GitHub sign-ins.
All three tabs are marked for handoff. No DNS, Auth URL, sender or live redirect
change has been made.

The migration now incorporates the exact deployed website source at `be32133`,
including October rates. Its 93 public pages get correct initial HTML metadata,
not only metadata applied after JavaScript loads. RSVP and TV keep their current
upstream services, with public canonical and app links translated to the new
addresses. Their documents and TV stylesheet were checked successfully on the
latest staged deployment:

https://koshinitiative-landing-aqd9qgmc6-riddoahamed-5267s-projects.vercel.app

The app migration is isolated at `/Users/riddo/Desktop/kosh-app-domain-cutover`,
branch `codex/app-domain-cutover`, based on the exact deployed app commit
`a1e773e1`. It updates public app/share/website URLs and prepares RSVP/team-admin
origin allowlists. It does not change ops account identifiers or existing
mailboxes. The app build and 17 preview tests pass, and its staged auth page,
web manifest and Android asset associations return HTTP 200:

https://kosh-6uzjddcxm-riddoahamed-5267s-projects.vercel.app

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

Backend deployment must retain existing gateway settings: `event-rsvp` has
`verify_jwt=false`, `team-admin` has `verify_jwt=true`. These source changes are
prepared, not yet deployed. Google sign-in is enabled, Apple is disabled. The
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
NXDOMAIN. Namecheap's account notice confirms an account lock and service
suspension after a contact-information deadline. The owner has emailed the
Namecheap Risk Management team. Namecheap must restore the account and release
the hold before DNS can serve the new domain.

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

1. After Namecheap restores access, inspect account notices, registrant contact
   status, expiration, privacy and renewal state for both domains. Preserve the
   existing mail records. koshfinance.com expires 18 October 2027 per registry.
2. Replace the new domain's parking records with the exact current Vercel domain
   recommendations. The CLI currently requests apex A `76.76.21.21`. Confirm
   www's record from the project dashboard. Verify DNS and HTTPS before any old
   domain redirects are made live.
3. Decide and prepare the app's destination, preferably app.koshfinance.com.
   Attach it to Vercel project `kosh`, update app canonical/share/PWA/Android
   associations, and verify Supabase email reset, confirmation and OAuth flows.
   Preserve existing callback URLs while old links can still be in flight.
   Changing only the Site URL is insufficient; inspect the full current auth
   configuration and exact provider callbacks before editing them.
4. Verify koshfinance.com in Resend with its generated SPF, DKIM and return-path
   records. Check DMARC and the actual mailbox/reply-to route. Change sender and
   email links only after verification. Do not replace working old mail DNS.
5. Reconcile this branch with the current production source and any concurrent
   website work; the source started from landing main at `dae2dfe`.
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

- Production Vite build and TypeScript check pass.
- 45 focused migration, preview, FDR and sitemap tests pass.
- Full suite: 55 passed, 2 failed. Both failures are existing cross-repository
  persona-game copy drift; reproduced unchanged in the original landing repo.
- Main market-selection and Global pages render in Edge locally.

## References

- https://rdap.verisign.com/com/v1/domain/koshfinance.com
- https://vercel.com/docs/domains/working-with-domains/deploying-and-redirecting
- https://supabase.com/docs/guides/auth/redirect-urls
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://support.google.com/webmasters/answer/9370220
