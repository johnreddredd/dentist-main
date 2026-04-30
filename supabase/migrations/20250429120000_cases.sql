-- SmileAI: case library (run in Supabase SQL editor or via CLI)
-- Stores full Case JSON per row; RLS restricts access to the owning auth user.

create table if not exists public.cases (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists cases_user_updated_idx
  on public.cases (user_id, updated_at desc);

alter table public.cases enable row level security;

create policy "cases_select_own"
  on public.cases for select
  using (auth.uid() = user_id);

create policy "cases_insert_own"
  on public.cases for insert
  with check (auth.uid() = user_id);

create policy "cases_update_own"
  on public.cases for update
  using (auth.uid() = user_id);

create policy "cases_delete_own"
  on public.cases for delete
  using (auth.uid() = user_id);
