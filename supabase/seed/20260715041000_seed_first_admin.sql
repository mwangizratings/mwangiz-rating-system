-- Replace this placeholder before running the seed.
-- Example: 'owner@mwangizbeauty.com'

insert into public.admin_whitelist (email)
select 'CHANGE_ME_ADMIN_EMAIL@example.com'
where not exists (
  select 1
  from public.admin_whitelist
  where lower(trim(email)) = lower(trim('CHANGE_ME_ADMIN_EMAIL@example.com'))
);
