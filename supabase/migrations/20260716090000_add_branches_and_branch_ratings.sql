create extension if not exists "pgcrypto";

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) > 0),
  slug text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint branches_slug_format_check check (
    slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  )
);

create unique index if not exists branches_slug_idx
  on public.branches (slug);

create index if not exists branches_is_active_idx
  on public.branches (is_active);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists branches_set_updated_at on public.branches;

create trigger branches_set_updated_at
  before update on public.branches
  for each row
  execute function public.set_updated_at();

insert into public.branches (name, slug, is_active)
values ('Main Branch', 'main-branch', true)
on conflict (slug) do nothing;

alter table public.ratings
  add column if not exists branch_id uuid;

update public.ratings
set branch_id = (
  select id from public.branches where slug = 'main-branch' limit 1
)
where branch_id is null;

alter table public.ratings
  alter column branch_id set not null;

alter table public.ratings
  drop constraint if exists ratings_branch_id_fkey;

alter table public.ratings
  add constraint ratings_branch_id_fkey
  foreign key (branch_id)
  references public.branches (id)
  on update cascade
  on delete restrict;

create index if not exists ratings_branch_id_idx
  on public.ratings (branch_id);

create index if not exists ratings_branch_created_at_idx
  on public.ratings (branch_id, created_at desc);

alter table public.branches enable row level security;

drop policy if exists "Anyone can read active branches" on public.branches;
drop policy if exists "Whitelisted admins can read branches" on public.branches;
drop policy if exists "Whitelisted admins can insert branches" on public.branches;
drop policy if exists "Whitelisted admins can update branches" on public.branches;
drop policy if exists "Whitelisted admins can delete branches" on public.branches;

create policy "Anyone can read active branches"
  on public.branches
  for select
  to anon
  using (is_active = true);

create policy "Whitelisted admins can read branches"
  on public.branches
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admin_whitelist
      where lower(trim(admin_whitelist.email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "Whitelisted admins can insert branches"
  on public.branches
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admin_whitelist
      where lower(trim(admin_whitelist.email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "Whitelisted admins can update branches"
  on public.branches
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_whitelist
      where lower(trim(admin_whitelist.email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  with check (
    exists (
      select 1
      from public.admin_whitelist
      where lower(trim(admin_whitelist.email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "Whitelisted admins can delete branches"
  on public.branches
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admin_whitelist
      where lower(trim(admin_whitelist.email)) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

grant select on table public.branches to anon;
grant select, insert, update, delete on table public.branches to authenticated;
grant all on table public.branches to service_role;
