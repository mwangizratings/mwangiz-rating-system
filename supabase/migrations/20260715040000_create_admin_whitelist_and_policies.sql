create extension if not exists "pgcrypto";

create table if not exists public.admin_whitelist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamp with time zone not null default now(),
  constraint admin_whitelist_email_format_check check (
    position('@' in email) > 1
  )
);

create unique index if not exists admin_whitelist_email_lower_idx
  on public.admin_whitelist (lower(trim(email)));

alter table public.admin_whitelist enable row level security;

drop policy if exists "Whitelisted users can read their own admin row" on public.admin_whitelist;
drop policy if exists "Whitelisted admins can read ratings" on public.ratings;

create policy "Whitelisted users can read their own admin row"
  on public.admin_whitelist
  for select
  to authenticated
  using (lower(trim(email)) = lower(coalesce(auth.jwt() ->> 'email', '')));

create policy "Whitelisted admins can read ratings"
  on public.ratings
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admin_whitelist
      where lower(trim(admin_whitelist.email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

grant select on table public.admin_whitelist to authenticated;
grant select on table public.ratings to authenticated;
