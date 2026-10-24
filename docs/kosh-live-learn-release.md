# Kosh Live TV and Learn release

The homepage now links to `/tv/`, the approved-only animated financial channel. A separate Vercel TV project serves it through narrow rewrites, allowing news updates without rebuilding the landing site. News manifests use no-store headers; cached voices are immutable. Producer/research access stays separate.

`/offerings` and its courses, live, kids and workplace pages introduce the approved learning programmes and launch prices. Join actions open email enquiries; this release does not claim an online checkout, automated enrolment or immediate course access. Homepage learning cards and navigation are added alongside the existing NSU sessions section and registration links.

Validation: 53 landing tests, application type checking, production Vercel build, desktop/mobile page review, route and sitemap checks. The separate channel additionally passes 19 producer and two public-output checks. Existing public content was matched to the deployed baseline before this release; unrelated app changes are excluded.
