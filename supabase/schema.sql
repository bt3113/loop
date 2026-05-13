-- Loop shared database schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.loop_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  event_date date not null,
  event_time time not null,
  ticket_url text,
  price text not null default 'I don''t know',
  postcode text not null,
  added_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.loop_event_entries (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.loop_events(id) on delete cascade,
  initials text not null,
  status text not null check (status in ('Interested', 'Can''t Attend', 'Let''s Talk', 'Booked', 'Cancelled')),
  updated_at timestamptz not null default now(),
  unique(event_id, initials)
);

alter table public.loop_events enable row level security;
alter table public.loop_event_entries enable row level security;

-- Public read/write policies for the MVP.
-- This matches the current initials-only product. Do not store private data here.

drop policy if exists "loop_events_select_all" on public.loop_events;
create policy "loop_events_select_all"
  on public.loop_events for select
  using (true);

drop policy if exists "loop_events_insert_all" on public.loop_events;
create policy "loop_events_insert_all"
  on public.loop_events for insert
  with check (true);

drop policy if exists "loop_events_delete_all" on public.loop_events;
create policy "loop_events_delete_all"
  on public.loop_events for delete
  using (true);

drop policy if exists "loop_event_entries_select_all" on public.loop_event_entries;
create policy "loop_event_entries_select_all"
  on public.loop_event_entries for select
  using (true);

drop policy if exists "loop_event_entries_insert_all" on public.loop_event_entries;
create policy "loop_event_entries_insert_all"
  on public.loop_event_entries for insert
  with check (true);

drop policy if exists "loop_event_entries_update_all" on public.loop_event_entries;
create policy "loop_event_entries_update_all"
  on public.loop_event_entries for update
  using (true)
  with check (true);

-- Optional helper index for timeline sorting.
create index if not exists loop_events_event_datetime_idx
  on public.loop_events (event_date, event_time);

create index if not exists loop_event_entries_event_id_idx
  on public.loop_event_entries (event_id);
