-- Adds the missing is_active flag to the products table so the frontend
-- can hide inactive entries. Run this script once in Supabase SQL Editor.

ALTER TABLE public.products
    ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Backfill existing rows so they show up on the website immediately.
UPDATE public.products
SET is_active = true
WHERE is_active IS NULL;
