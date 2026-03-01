-- Optional: remove indexes currently reported as "Unused Index" by Supabase Advisor.
-- Run only if Advisor still flags these and your workload does not need them.

begin;

drop index if exists public.idx_blog_posts_published_at;
drop index if exists public.idx_products_is_active_created_at;
drop index if exists public.idx_products_tags_gin;

commit;
