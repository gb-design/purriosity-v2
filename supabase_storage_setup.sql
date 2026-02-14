-- Create a bucket for blog and product media
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Set up Storage Policies (RLS for objects)
create policy "Media is publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'media' );

create policy "Admins can upload media"
  on storage.objects for insert
  with check (
    bucket_id = 'media' AND
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Admins can delete media"
  on storage.objects for delete
  using (
    bucket_id = 'media' AND
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

-- Ensure blog_posts has correct RLS for Admins (already done in previous plan, but double checking or adding missing)
-- (Assuming blog_posts table exists from previous phases)
