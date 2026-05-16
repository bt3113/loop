-- Loop event editing policy fix
-- Run this in Supabase SQL Editor for the Loop project.
-- Without an UPDATE policy, Supabase returns zero updated rows from the public anon client,
-- which causes the app to show: "Update failed: no matching event was updated."

alter table public.loop_events enable row level security;

-- Existing rows must be readable by everyone using the shared Loop link.
drop policy if exists "loop_events_select_all" on public.loop_events;
create policy "loop_events_select_all"
  on public.loop_events for select
  using (true);

-- Anyone with the shared Loop page can add an event.
drop policy if exists "loop_events_insert_all" on public.loop_events;
create policy "loop_events_insert_all"
  on public.loop_events for insert
  with check (true);

-- Required for Edit Event to work.
drop policy if exists "loop_events_update_all" on public.loop_events;
create policy "loop_events_update_all"
  on public.loop_events for update
  using (true)
  with check (true);

-- Required for Remove Event to work from the app.
drop policy if exists "loop_events_delete_all" on public.loop_events;
create policy "loop_events_delete_all"
  on public.loop_events for delete
  using (true);

-- RSVP/status table policies, included for completeness.
alter table public.loop_event_entries enable row level security;

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

drop policy if exists "loop_event_entries_delete_all" on public.loop_event_entries;
create policy "loop_event_entries_delete_all"
  on public.loop_event_entries for delete
  using (true);
