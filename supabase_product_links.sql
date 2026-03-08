-- Purriosity: Product link type support (affiliate vs regular URL)
-- Run in Supabase SQL editor. Safe to run multiple times.

begin;

alter table if exists public.products
  add column if not exists product_url text,
  add column if not exists link_type text;

-- Backfill for existing rows
update public.products
set product_url = coalesce(nullif(product_url, ''), affiliate_url)
where coalesce(product_url, '') = '';

update public.products
set link_type = coalesce(nullif(link_type, ''), 'affiliate')
where coalesce(link_type, '') = '';

-- Constraints and defaults
alter table if exists public.products
  alter column link_type set default 'affiliate';

alter table if exists public.products
  drop constraint if exists products_link_type_check;

alter table if exists public.products
  add constraint products_link_type_check
  check (link_type in ('affiliate', 'regular'));

commit;
