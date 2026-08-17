# The blog, submissions, and mirroring social posts

`/blog` reads two things and merges them:

1. **Local articles** in `src/v2/posts.ts` — ship with the site, always there, no setup.
2. **Rows in the Supabase `posts` table** — social posts, community submissions, and anything you write in the dashboard.

If Supabase is unreachable the page silently shows the local articles only. Nothing breaks and no visitor sees an error.

---

## Status

| | State |
|---|---|
| `posts` table + RLS | ✅ **live** on project `uitdqikuodlrhrfjcnsz` |
| `social-sync` function (Facebook + Instagram) | ✅ **deployed**, ⚠️ needs your Meta token |
| `social-ingest` function (webhook) | ✅ **deployed** and secured |
| `SYNC_SECRET` / `INGEST_SECRET` | ✅ generated and set |
| Submissions at `/blog/submit` | ✅ **live** — verified end to end |
| Scheduled sync (cron) | ⬜ add once the Meta token is in |

The two secrets were generated for you. Read them with:

```bash
supabase secrets list
```

---

## Approving a submission

Anyone can submit at `/blog/submit`. Every submission lands as `status = 'pending'` and **nothing publishes on its own** — that's enforced by the database policy, not by the form.

To publish one: Supabase dashboard → **Table Editor** → `posts` → filter `status = pending` → read it, edit anything you want, set `status` to `published`. It appears on `/blog` immediately.

Or from the CLI:

```bash
supabase db query --linked "update public.posts set status='published' where slug='the-slug'"
```

The dashboard is the right tool here on purpose. A custom admin page would mean putting a publishing credential in a browser; the dashboard already has real auth, shows every field, and lets you edit before approving.

To see what's waiting:

```bash
supabase db query --linked "select slug, title, author_name, created_at from public.posts where status='pending' order by created_at desc"
```

---

## LinkedIn — embed, don't copy

LinkedIn does not let an ordinary app read an organisation's own posts. `r_organization_social` sits behind the Community Management API and needs an approved LinkedIn partnership; you cannot self-serve it, and anything claiming otherwise is scraping, which gets pages actioned.

So LinkedIn articles are **embedded**, which is better anyway — attribution and engagement stay on the post.

1. Open the post on LinkedIn → **⋯** menu → **Embed this post**.
2. Copy the URL out of the `src="…"` (or paste the whole `<iframe>` — the site pulls the `src` out itself).
3. Insert a row:

```bash
supabase db query --linked "insert into public.posts (slug, title, dek, body, category, source, status, embed_url, source_url) values ('why-nobody-invests-here', 'Why almost nobody here invests', 'A short thread on the trust gap.', '', 'news', 'linkedin', 'published', 'https://www.linkedin.com/embed/feed/update/urn:li:share:1234567890', 'https://www.linkedin.com/posts/...')"
```

Or add the row in the Table Editor, which is easier.

**Only `linkedin.com` URLs are ever put in an iframe.** `safeEmbedUrl` in `src/v2/postsApi.ts` whitelists the host and drops anything else — a row with an embed pointing somewhere else renders as plain text instead. Don't widen that list without thinking about it; an iframe on our domain is a real trust boundary.

You can leave `body` empty for a pure embed, or write a paragraph of your own context above it.

---

## Facebook + Instagram — automatic

Both go through the Meta Graph API on **one** long-lived Page access token. The function is already deployed; it just needs the token.

**What you need first:**
- The Kosh Facebook **Page**.
- The Kosh Instagram account converted to a **Business** account and linked to that Page. A personal Instagram account cannot be read by the API — that's a Meta rule, not a Kosh limitation.
- A Meta app at [developers.facebook.com](https://developers.facebook.com) with `pages_read_engagement`, `pages_show_list` and `instagram_basic`. Reading your *own* Page doesn't need App Review while the app is in development mode with you as an admin.

**Get the ids and token** in Graph API Explorer:
- `GET /me/accounts` → your Page `id` and a page `access_token`
- `GET /{page-id}?fields=instagram_business_account` → your `META_IG_USER_ID`
- Exchange the short-lived token for a long-lived one (~60 days). **Set a calendar reminder to refresh it** — the sync goes quiet when it expires.

**Then:**

```bash
supabase secrets set META_PAGE_ID=... META_IG_USER_ID=... META_ACCESS_TOKEN=...
```

**Test it** (get `SYNC_SECRET` from `supabase secrets list`):

```bash
curl -X POST -H "x-sync-secret: <SYNC_SECRET>" https://uitdqikuodlrhrfjcnsz.supabase.co/functions/v1/social-sync
```

It returns `{ ok: true, facebook: n, instagram: n, written: n }`. Re-running is safe — rows upsert on `(source, external_id)`, so nothing duplicates. Right now it correctly returns `META_ACCESS_TOKEN not set`.

**Put it on a schedule** (SQL Editor, needs `pg_cron` + `pg_net`):

```sql
select cron.schedule('kosh-social-sync', '0 */6 * * *', $$
  select net.http_post(
    url     := 'https://uitdqikuodlrhrfjcnsz.supabase.co/functions/v1/social-sync',
    headers := '{"x-sync-secret":"<SYNC_SECRET>"}'::jsonb
  );
$$);
```

Synced posts arrive as `status='published'`. If you'd rather review them first, change the `status` field in `social-sync/index.ts` to `'pending'` and redeploy.

---

## The generic webhook

`social-ingest` turns anything pushed at it into a post — useful for Zapier, a phone shortcut, or a platform we haven't thought of yet:

```bash
curl -X POST https://uitdqikuodlrhrfjcnsz.supabase.co/functions/v1/social-ingest -H "x-ingest-secret: <INGEST_SECRET>" -H "content-type: application/json" -d '{"source":"linkedin","text":"Full post text.\n\nSecond paragraph.","url":"https://www.linkedin.com/posts/..."}'
```

Fields: `text` (required, 20+ chars), `source`, `title`, `dek`, `url`, `image`, `tags`, `id`, `published_at`, `status`. Anything omitted is derived — first sentence becomes the title, hashtags become tags, slug is generated.

---

## Writing a proper article

Social captions make thin articles, and community submissions vary. For the pieces that should rank — app walkthroughs, explainers, FAQs — add an entry to `LOCAL_POSTS` in `src/v2/posts.ts` and deploy. Those get a `category` (`lesson` / `guide` / `how-to` / `faq` / `story` / `news`), which drives the filters on `/blog`.

**Local posts are the only ones allowed to contain HTML.** Everything from the database renders as plain text no matter what arrives, because a caption or a stranger's submission is untrusted input and must never become markup on our domain. `Post.tsx` enforces that in code — don't relax it by setting `allowHtml` on a database row.

Remember to add new local articles to `public/sitemap.xml`.
