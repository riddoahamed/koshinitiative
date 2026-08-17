-- ============================================================================
-- Kosh — posts table
--
-- Backs /blog. Rows land here two ways:
--   * the `social-sync` edge function pulls Facebook Page + Instagram posts
--   * the `social-ingest` edge function accepts anything pushed at it
--     (LinkedIn via Zapier/Make, or a manual POST)
--
-- Anonymous visitors can read published rows and nothing else. All writes go
-- through the service role, which only the edge functions hold.
-- ============================================================================

create table if not exists public.posts (
  id            bigint generated always as identity primary key,
  slug          text        not null unique,
  title         text        not null,
  dek           text,
  body          text        not null default '',
  cover_url     text,
  tags          text[]      not null default '{}',
  source        text        not null default 'kosh'
                            check (source in ('kosh','linkedin','instagram','facebook')),
  source_url    text,
  -- the platform's own id, so a re-sync updates instead of duplicating
  external_id   text,
  status        text        not null default 'published'
                            check (status in ('published','draft','hidden')),
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
-- Row level security: public reads published rows, nobody writes from the web
-- ---------------------------------------------------------------------------
alter table public.posts enable row level security;

drop policy if exists "posts are publicly readable when published" on public.posts;
create policy "posts are publicly readable when published"
  on public.posts for select
  to anon, authenticated
  using (status = 'published');

-- No insert/update/delete policy on purpose. The service role bypasses RLS,
-- so only the edge functions (which hold SUPABASE_SERVICE_ROLE_KEY) can write.
