-- KOSH LIVE — vote tally for classroom sessions / demos
-- Run once on the Kosh Supabase project, then set
-- VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY on the landing site.

create table if not exists public.live_votes (
  id          uuid primary key default gen_random_uuid(),
  room        text not null,
  option_id   text not null,
  voter       text not null,
  created_at  timestamptz not null default now(),
  unique (room, voter)
);

create index if not exists live_votes_room_idx on public.live_votes (room);

alter table public.live_votes enable row level security;

-- Anonymous participants may cast (and change) their own vote, and may read
-- the room's votes so the reveal chart works on every device.
-- No personal data is stored: `voter` is a random browser-local id.
drop policy if exists "live_votes anon insert" on public.live_votes;
create policy "live_votes anon insert"
  on public.live_votes for insert to anon with check (true);

drop policy if exists "live_votes anon update" on public.live_votes;
create policy "live_votes anon update"
  on public.live_votes for update to anon using (true) with check (true);

drop policy if exists "live_votes anon read" on public.live_votes;
create policy "live_votes anon read"
  on public.live_votes for select to anon using (true);
