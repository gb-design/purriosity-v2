-- Create the products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  short_description text,
  images text[] default '{}',
  price numeric,
  currency text default 'EUR',
  affiliate_url text,
  purr_count integer default 0,
  view_count integer default 0,
  star_rating numeric default 0,
  tags text[] default '{}',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;

-- Create a policy that allows anyone to view products (Public Read)
create policy "Products are viewable by everyone"
  on public.products for select
  using ( true );

-- Insert some dummy data for testing
insert into public.products (title, description, short_description, price, tags, images, affiliate_url)
values
  (
    'Telepathisches Katzen-Klavier',
    'Erzeugt Musik basierend auf den Gedanken deiner Katze. Ein musikalisches Meisterwerk! Oder Lärm. Meistens Lärm.',
    'Musik aus Gedanken.',
    199.99,
    ARRAY['Weird', 'Smart', 'Funny'],
    ARRAY['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    'https://example.com/buy/piano'
  ),
  (
    'Self-Cleaning Litter Box 3000',
    'The classic automated solution. Never scoop again.',
    'Automated scooping.',
    499.00,
    ARRAY['Practical', 'Smart', 'Budget'], -- Budget is ironic here
    ARRAY['https://images.unsplash.com/photo-1513245543132-31f507417b26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    'https://example.com/buy/litterbox'
  ),
  (
    'Catnip Banana',
    'The legendary banana that drives cats crazy. Durable and potent.',
    'Potent catnip toy.',
    5.99,
    ARRAY['Cute', 'Budget', 'Funny'],
    ARRAY['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    'https://example.com/buy/banana'
  ),
  (
    'Laser Robot Friend',
    'Automated laser pointer that keeps your cat busy while you work.',
    'Endless laser fun.',
    29.99,
    ARRAY['Smart', 'Practical', 'Gift'],
    ARRAY['https://images.unsplash.com/photo-1561948955-570b270e7c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    'https://example.com/buy/laser'
  ),
  (
    'Sushi Cat Costume',
    'Turn your cat into a delicious shrimp nigiri. They will hate it, you will love it.',
    'Hilarious costume.',
    14.50,
    ARRAY['Weird', 'Cute', 'Funny'],
    ARRAY['https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'],
    'https://example.com/buy/sushi'
  );
