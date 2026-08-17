# Mirroring social posts onto koshbd.com/blog

`/blog` reads two things and merges them:

1. **Local articles** in `src/v2/posts.ts` — ship with the site, always there, no setup.
2. **Synced rows** in the Supabase `posts` table — whatever we post on Facebook, Instagram and LinkedIn.

If Supabase isn't configured, the page silently shows the local articles only. Nothing breaks and no visitor sees an error. So you can ship the blog today and connect the sync whenever.

---

## Step 1 — create the table

Run `supabase/posts.sql` on the Kosh Supabase project (SQL Editor → paste → run).

Public visitors can read rows where `status = 'published'` and nothing else. Every write goes through the service role, which only the edge functions hold.

---

## Step 2 — Facebook + Instagram (automatic)

Both go through the Meta Graph API on **one** long-lived Page access token.

**What you need first:**
- The Kosh Facebook **Page**.
- The Kosh Instagram account converted to a **Business** account and linked to that Page. (A personal Instagram account cannot be read by the API — this is a Meta rule, not a Kosh limitation.)
- A Meta app at [developers.facebook.com](https://developers.facebook.com) with `pages_read_engagement`, `pages_show_list` and `instagram_basic` permissions. Reading your *own* Page does not need App Review while the app is in development mode with you as an admin; going live for other admins does.

**Get the ids and the token** in Graph API Explorer:
- `GET /me/accounts` → your Page `id` and a page `access_token`
- `GET /{page-id}?fields=instagram_business_account` → your `META_IG_USER_ID`
- Exchange the short-lived token for a long-lived one (~60 days) — see Meta's "long-lived tokens" doc. Set a calendar reminder to refresh it.

**Deploy:**

```bash
supabase secrets set META_PAGE_ID=... META_IG_USER_ID=... META_ACCESS_TOKEN=... SYNC_SECRET=$(openssl rand -hex 24)
```

```bash
supabase functions deploy social-sync --no-verify-jwt
```

**Test it once:**

```bash
curl -X POST -H "x-sync-secret: $SYNC_SECRET" https://<project-ref>.supabase.co/functions/v1/social-sync
```

It returns `{ ok: true, facebook: n, instagram: n, written: n }`. Re-running is safe — rows upsert on `(source, external_id)`, so nothing duplicates.

**Put it on a schedule** (Supabase SQL Editor, needs `pg_cron` + `pg_net`):

```sql
select cron.schedule('kosh-social-sync', '0 */6 * * *', $$
  select net.http_post(
    url     := 'https://<project-ref>.supabase.co/functions/v1/social-sync',
    headers := '{"x-sync-secret":"<SYNC_SECRET>"}'::jsonb
  );
$$);
```

Every six hours is plenty. Anything we post shows up on the site within a few hours, with the caption as the article and a link back to the original.

---

## Step 3 — LinkedIn (push, not pull)

**Be aware:** LinkedIn does not let an ordinary app read an organisation's own posts. `r_organization_social` is gated behind the Community Management API, which requires an approved LinkedIn partnership. You cannot self-serve it. Anyone who tells you otherwise is describing scraping, which will get the page actioned.

So LinkedIn goes the other way — something that can already see the post pushes it to us:

```bash
supabase secrets set INGEST_SECRET=$(openssl rand -hex 24)
supabase functions deploy social-ingest --no-verify-jwt
```

Then wire up **one** of these:

- **Zapier / Make** — trigger "New LinkedIn company post" → action "Webhook POST" to the URL below. This is the closest thing to true automation and takes about five minutes.
- **A phone shortcut or a bookmarklet** — paste the text, hit send.
- **curl**, when publishing something you want mirrored:

```bash
curl -X POST https://<project-ref>.supabase.co/functions/v1/social-ingest -H "x-ingest-secret: $INGEST_SECRET" -H "content-type: application/json" -d '{"source":"linkedin","text":"Full post text here.\n\nSecond paragraph.","url":"https://www.linkedin.com/posts/...","image":"https://.../cover.jpg"}'
```

Accepted fields: `text` (required, 20+ chars), `source` (`linkedin` | `instagram` | `facebook` | `kosh`), `title`, `dek`, `url`, `image`, `tags`, `id`, `published_at`, `status`. Anything omitted is derived — the first sentence becomes the title, hashtags become tags, and the slug is generated.

The same endpoint works for any platform, so if we add YouTube or a newsletter later, nothing new needs building.

---

## Writing a proper article instead

Social captions make thin articles. For real how-to pieces — app walkthroughs, explainers — add an entry to `LOCAL_POSTS` in `src/v2/posts.ts` and deploy. Those are the only posts allowed to contain HTML.

**This matters:** synced posts are rendered as plain text no matter what arrives, because a caption is untrusted input and must never become markup on our domain. `Post.tsx` enforces that in code — don't relax it by setting `allowHtml` on a synced row.

---

## Checklist

- [ ] `posts.sql` run on the project
- [ ] Instagram converted to Business and linked to the Facebook Page
- [ ] `META_*` secrets set, `social-sync` deployed, one manual run returns `ok: true`
- [ ] `cron.schedule` created
- [ ] `INGEST_SECRET` set, `social-ingest` deployed
- [ ] Zapier (or a shortcut) pointed at `social-ingest` for LinkedIn
- [ ] Reminder set to refresh the Meta long-lived token before it expires
