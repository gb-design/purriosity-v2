-- Purriosity: Supabase cleanup for advisor warnings
-- Run once in Supabase SQL Editor (production-safe, idempotent where possible).

begin;

-- ============================================================================
-- 1) Remove legacy product rating artifacts (no longer used in app)
-- ============================================================================

do $$
declare
  r record;
begin
  for r in
    select tg.tgname as trigger_name, c.relname as table_name
    from pg_trigger tg
    join pg_class c on c.oid = tg.tgrelid
    join pg_proc p on p.oid = tg.tgfoid
    join pg_namespace n on n.oid = c.relnamespace
    where not tg.tgisinternal
      and n.nspname = 'public'
      and p.proname in ('refresh_product_rating', 'set_product_ratings_updated_at')
  loop
    execute format('drop trigger if exists %I on public.%I;', r.trigger_name, r.table_name);
  end loop;
end $$;

drop function if exists public.refresh_product_rating();
drop function if exists public.refresh_product_rating(uuid);
drop function if exists public.set_product_ratings_updated_at();
drop function if exists public.set_product_ratings_updated_at(uuid);

alter table if exists public.products
  drop column if exists star_rating;

-- ============================================================================
-- 2) RLS policy cleanup + auth.uid() init-plan optimization
-- ============================================================================

-- products
alter table if exists public.products enable row level security;
alter table if exists public.products force row level security;

drop policy if exists "Products are viewable by everyone" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

create policy "Products are viewable by everyone"
  on public.products
  for select
  using (true);

create policy "Admins can insert products"
  on public.products
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

create policy "Admins can update products"
  on public.products
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

create policy "Admins can delete products"
  on public.products
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

-- blog_posts
alter table if exists public.blog_posts enable row level security;
alter table if exists public.blog_posts force row level security;

drop policy if exists "Blog posts are viewable by everyone" on public.blog_posts;
drop policy if exists "Admins can insert blog_posts" on public.blog_posts;
drop policy if exists "Admins can update blog_posts" on public.blog_posts;
drop policy if exists "Admins can delete blog_posts" on public.blog_posts;

create policy "Blog posts are viewable by everyone"
  on public.blog_posts
  for select
  using (true);

create policy "Admins can insert blog_posts"
  on public.blog_posts
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

create policy "Admins can update blog_posts"
  on public.blog_posts
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

create policy "Admins can delete blog_posts"
  on public.blog_posts
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

-- categories (drop all existing policies first to avoid "multiple permissive policies")
alter table if exists public.categories enable row level security;
alter table if exists public.categories force row level security;

do $$
declare
  r record;
begin
  for r in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'categories'
  loop
    execute format('drop policy if exists %I on public.categories;', r.policyname);
  end loop;
end $$;

create policy "Categories are viewable by everyone"
  on public.categories
  for select
  using (true);

create policy "Categories admin insert"
  on public.categories
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

create policy "Categories admin update"
  on public.categories
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

create policy "Categories admin delete"
  on public.categories
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = (select auth.uid()) and profiles.is_admin = true
    )
  );

-- product_likes
alter table if exists public.product_likes enable row level security;
alter table if exists public.product_likes force row level security;

drop policy if exists "likes readable by everyone" on public.product_likes;
drop policy if exists "user can like" on public.product_likes;
drop policy if exists "user can unlike" on public.product_likes;

create policy "likes readable by everyone"
  on public.product_likes
  for select
  using (true);

create policy "user can like"
  on public.product_likes
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user can unlike"
  on public.product_likes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- product_saves
alter table if exists public.product_saves enable row level security;
alter table if exists public.product_saves force row level security;

drop policy if exists "saves readable by owner" on public.product_saves;
drop policy if exists "user can save" on public.product_saves;
drop policy if exists "user can unsave" on public.product_saves;

create policy "saves readable by owner"
  on public.product_saves
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "user can save"
  on public.product_saves
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user can unsave"
  on public.product_saves
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- profiles
alter table if exists public.profiles enable row level security;
alter table if exists public.profiles force row level security;

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;

create policy "Public profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

commit;
