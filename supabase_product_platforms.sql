-- Add support for multiple affiliate platforms per product.
alter table if exists public.products
  add column if not exists affiliate_platforms text[] not null default '{}'::text[];

-- Optional backfill from legacy single-provider field.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'affiliate_provider'
  ) then
    update public.products
    set affiliate_platforms = array[trim(affiliate_provider)]
    where coalesce(array_length(affiliate_platforms, 1), 0) = 0
      and affiliate_provider is not null
      and trim(affiliate_provider) <> '';
  end if;
end $$;
