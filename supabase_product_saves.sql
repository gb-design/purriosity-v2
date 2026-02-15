-- Product saves (favorites) tracking for Purriosity
-- Run in Supabase SQL editor

create table if not exists public.product_saves (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade,
    product_id uuid references public.products(id) on delete cascade,
    created_at timestamptz not null default now(),
    unique (user_id, product_id)
);

alter table public.product_saves enable row level security;

drop policy if exists "saves readable by owner" on public.product_saves;
drop policy if exists "user can save" on public.product_saves;
drop policy if exists "user can unsave" on public.product_saves;

create policy "saves readable by owner"
    on public.product_saves for select
    using (auth.uid() = user_id);

create policy "user can save"
    on public.product_saves for insert
    with check (auth.uid() = user_id);

create policy "user can unsave"
    on public.product_saves for delete
    using (auth.uid() = user_id);
