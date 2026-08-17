-- ============================================================================
-- Kosh — posts table (backs koshbd.com/blog)
--
-- Rows land here four ways:
--   1. `social-sync` edge function pulls Facebook Page + Instagram posts
--   2. `social-ingest` edge function accepts anything pushed at it
--   3. anyone submitting through /blog/submit — always as `pending`
--   4. written by hand in the Supabase Table Editor
--
-- Nothing a stranger writes goes live on its own. Anonymous visitors can read
-- `published` rows and insert `pending` ones, and that is the whole surface.
-- Publishing means flipping status to 'published', which only the dashboard
-- (or the service role) can do.
--
-- This project is shared with the Kosh app, so everything here is additive.
-- ============================================================================

create table if not exists public.posts (
  id            bigint generated always as identity primary key,
  slug          text        not null unique,
  title         text        not null,
  dek           text,
  body          text        not null default '',
  cover_url     text,

  -- what kind of writing this is — drives the filters on /blog
  category      text        not null default 'article'
                            check (category in ('lesson','guide','how-to','faq','story','news','article')),
  tags          text[]      not null default '{}',

  source        text        not null default 'kosh'
                            check (source in ('kosh','linkedin','instagram','facebook','community')),
  source_url    text,
  -- LinkedIn articles are embedded rather than copied: paste the post's
  -- embed URL and /blog/:slug renders LinkedIn's own iframe.
  embed_url     text,
  -- the platform's own id, so a re-sync updates instead of duplicating
  external_id   text,

  author_name   text,
  author_note   text,

  status        text        not null default 'pending'
                            check (status in ('published','pending','draft','hidden')),
  published_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Deliberately NOT a partial index: PostgREST's `on_conflict=source,external_id`
-- can only infer a non-partial unique index. Rows with a null external_id (a
-- hand-written post) never collide, because Postgres treats nulls as distinct.
create unique index if not exists posts_source_external_id_idx
  on public.posts (source, external_id);

create index if not exists posts_feed_idx
  on public.posts (status, published_at desc);

create index if not exists posts_category_idx
  on public.posts (category)
  where status = 'published';

-- keep updated_at honest
create or replace function public.posts_touch()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_touch_trg on public.posts;
create trigger posts_touch_trg
  before update on public.posts
  for each row execute function public.posts_touch();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.posts enable row level security;

drop policy if exists "posts are publicly readable when published" on public.posts;
create policy "posts are publicly readable when published"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

-- Anyone may submit, and every submission lands in the moderation queue.
-- The WITH CHECK is the whole security model here: a submitter cannot choose
-- their own status, cannot impersonate a synced source, and cannot post a
-- wall of text. Worst case is junk rows in a queue nobody has approved.
drop policy if exists "anyone may submit a pending post" on public.posts;
create policy "anyone may submit a pending post"
  on public.posts for insert
  to anon, authenticated
  with check (
    status = 'pending'
    and source = 'community'
    and external_id is null
    and embed_url is null
    and char_length(title) between 8 and 140
    and char_length(body) between 200 and 20000
    and char_length(coalesce(dek, '')) <= 300
    and char_length(coalesce(author_name, '')) <= 80
    and char_length(coalesce(author_note, '')) <= 300
    and coalesce(array_length(tags, 1), 0) <= 4
    and category in ('lesson','guide','how-to','faq','story','article')
  );

-- No update or delete policy on purpose. Approving a submission means setting
-- status = 'published' from the Supabase dashboard or the service role — see
-- README-social.md. The edge functions bypass RLS with the service role key.

comment on table public.posts is
  'Blog posts for koshbd.com/blog. status=pending is the moderation queue; nothing publishes without a human flipping it.';
