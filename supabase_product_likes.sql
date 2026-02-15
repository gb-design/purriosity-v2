-- Product likes tracking (run in Supabase SQL editor)

-- 1) Create the likes table linking users and products
create table if not exists public.product_likes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    product_id uuid references public.products(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (user_id, product_id)
);

-- 2) Add a total-like counter to profiles (optional but handy for dashboards)
alter table public.profiles
    add column if not exists purr_given_count integer not null default 0;

-- 3) Trigger helpers to keep purr_given_count in sync
create or replace function public.increment_profile_purrs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.profiles
    set purr_given_count = purr_given_count + 1
    where id = new.user_id;
    return new;
end;
$$;

create or replace function public.decrement_profile_purrs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.profiles
    set purr_given_count = greatest(purr_given_count - 1, 0)
    where id = old.user_id;
    return old;
end;
$$;

drop trigger if exists product_likes_insert on public.product_likes;
drop trigger if exists product_likes_delete on public.product_likes;
drop trigger if exists product_likes_product_increment on public.product_likes;
drop trigger if exists product_likes_product_decrement on public.product_likes;

create trigger product_likes_insert
    after insert on public.product_likes
    for each row execute procedure public.increment_profile_purrs();

create trigger product_likes_delete
    after delete on public.product_likes
    for each row execute procedure public.decrement_profile_purrs();

create or replace function public.increment_product_purrs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.products
    set purr_count = coalesce(purr_count, 0) + 1
    where id = new.product_id;
    return new;
end;
$$;

create or replace function public.decrement_product_purrs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    update public.products
    set purr_count = greatest(coalesce(purr_count, 0) - 1, 0)
    where id = old.product_id;
    return old;
end;
$$;

create trigger product_likes_product_increment
    after insert on public.product_likes
    for each row execute procedure public.increment_product_purrs();

create trigger product_likes_product_decrement
    after delete on public.product_likes
    for each row execute procedure public.decrement_product_purrs();

-- 4) Enable RLS and policies
alter table public.product_likes enable row level security;

drop policy if exists "likes readable by everyone" on public.product_likes;
drop policy if exists "user can like" on public.product_likes;
drop policy if exists "user can unlike" on public.product_likes;

create policy "likes readable by everyone"
    on public.product_likes for select
    using (true);

create policy "user can like"
    on public.product_likes for insert
    with check (auth.uid() = user_id);

create policy "user can unlike"
    on public.product_likes for delete
    using (auth.uid() = user_id);

-- Done! Now product_likes tracks each heart and profiles.purr_given_count keeps totals per user.
