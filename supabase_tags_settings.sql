-- Create categories/tags settings table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    emoji TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Categories can be managed by authenticated users" ON public.categories;
DROP POLICY IF EXISTS "Categories admin insert" ON public.categories;
DROP POLICY IF EXISTS "Categories admin update" ON public.categories;
DROP POLICY IF EXISTS "Categories admin delete" ON public.categories;

-- RLS Policy: Public Read (for frontend)
CREATE POLICY "Categories are viewable by everyone"
    ON public.categories FOR SELECT
    USING (true);

-- RLS Policy: Admin Write (for admin panel)
CREATE POLICY "Categories admin insert"
    ON public.categories FOR INSERT
    TO authenticated
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = (SELECT auth.uid()) AND profiles.is_admin = true
      )
    );

CREATE POLICY "Categories admin update"
    ON public.categories FOR UPDATE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = (SELECT auth.uid()) AND profiles.is_admin = true
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = (SELECT auth.uid()) AND profiles.is_admin = true
      )
    );

CREATE POLICY "Categories admin delete"
    ON public.categories FOR DELETE
    TO authenticated
    USING (
      EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE profiles.id = (SELECT auth.uid()) AND profiles.is_admin = true
      )
    );

-- Insert default categories
INSERT INTO public.categories (name, emoji, display_order) VALUES
    ('Alle', '✨', 0),
    ('Fütterung', '🍽️', 1),
    ('Geschenke', '🎁', 2),
    ('für Mensch', '👤', 3),
    ('für Tier', '🐾', 4),
    ('Kleidung', '👕', 5),
    ('Lustig', '😂', 6),
    ('Luxus', '👑', 7),
    ('Niedlich', '🥰', 8),
    ('Nützliches', '🛠️', 9),
    ('Pflege', '🧴', 10),
    ('Skurril', '🤪', 11),
    ('Spielzeug', '🎾', 12)
ON CONFLICT (name) DO NOTHING;
