-- Supabase performance and policy hardening fixes for Purriosity
-- Run this once in Supabase SQL Editor.

-- 1) Foreign key helper indexes (fixes "Unindexed foreign keys" warnings)
create index if not exists idx_product_likes_user_id on public.product_likes(user_id);
create index if not exists idx_product_likes_product_id on public.product_likes(product_id);
create index if not exists idx_product_saves_user_id on public.product_saves(user_id);
create index if not exists idx_product_saves_product_id on public.product_saves(product_id);

-- 2) Query-path indexes for hot read paths
create index if not exists idx_products_is_active_created_at on public.products(is_active, created_at desc);
create index if not exists idx_blog_posts_published_at on public.blog_posts(published_at desc);
create index if not exists idx_products_tags_gin on public.products using gin(tags);

-- 3) Harden and simplify categories policies
alter table public.categories enable row level security;

drop policy if exists "Categories are viewable by everyone" on public.categories;
drop policy if exists "Categories can be managed by authenticated users" on public.categories;
drop policy if exists "Categories admin write" on public.categories;

create policy "Categories are viewable by everyone"
  on public.categories
  for select
  using (true);

create policy "Categories admin write"
  on public.categories
  for all
  using (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
