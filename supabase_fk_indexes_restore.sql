-- Rebalance indexes/constraints for likes + saves to avoid a warning ping-pong:
-- - keep FK coverage
-- - avoid redundant single-column indexes that show up as "unused"
-- - still support app queries by user_id for saved items

begin;

-- product_likes:
-- Use UNIQUE(product_id, user_id) so product_id FK is covered without extra index.
alter table public.product_likes
  drop constraint if exists product_likes_user_id_product_id_key;
alter table public.product_likes
  drop constraint if exists product_likes_product_id_user_id_key;
alter table public.product_likes
  add constraint product_likes_product_id_user_id_key unique (product_id, user_id);

-- Cleanup redundant helper indexes for likes.
drop index if exists public.idx_product_likes_product_id;
drop index if exists public.idx_product_likes_user_id;

-- product_saves:
-- Same pattern for FK coverage + keep fast "my saved products" lookup by user_id.
alter table public.product_saves
  drop constraint if exists product_saves_user_id_product_id_key;
alter table public.product_saves
  drop constraint if exists product_saves_product_id_user_id_key;
alter table public.product_saves
  add constraint product_saves_product_id_user_id_key unique (product_id, user_id);

create index if not exists idx_product_saves_user_id on public.product_saves(user_id);
drop index if exists public.idx_product_saves_product_id;

commit;
