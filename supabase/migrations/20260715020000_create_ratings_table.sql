create extension if not exists "pgcrypto";

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  rating integer not null check (rating between 1 and 5),
  comment text,
  device_id text not null,
  ip_hash text not null,
  created_at timestamp with time zone not null default now()
);

create index if not exists ratings_created_at_idx
  on public.ratings (created_at desc);

create index if not exists ratings_device_id_idx
  on public.ratings (device_id);

create index if not exists ratings_ip_hash_idx
  on public.ratings (ip_hash);

alter table public.ratings enable row level security;

drop policy if exists "Anonymous users can insert ratings" on public.ratings;
drop policy if exists "Anonymous users cannot select ratings" on public.ratings;
drop policy if exists "Anonymous users cannot update ratings" on public.ratings;
drop policy if exists "Anonymous users cannot delete ratings" on public.ratings;

create policy "Anonymous users can insert ratings"
  on public.ratings
  for insert
  to anon
  with check (true);

create policy "Anonymous users cannot select ratings"
  on public.ratings
  as restrictive
  for select
  to anon
  using (false);

create policy "Anonymous users cannot update ratings"
  on public.ratings
  as restrictive
  for update
  to anon
  using (false)
  with check (false);

create policy "Anonymous users cannot delete ratings"
  on public.ratings
  as restrictive
  for delete
  to anon
  using (false);

grant usage on schema public to anon, authenticated, service_role;
grant insert on table public.ratings to anon;
grant all on table public.ratings to service_role;
