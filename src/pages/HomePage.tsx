import { useState, useMemo, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import TagFilter from '../components/home/TagFilter';
import MasonryGrid from '../components/home/MasonryGrid';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';
import { mapDbProductToProduct } from '../lib/productMapper';

const normalizeCategory = (value: string): string => {
  const base = value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ');

  const aliases: Record<string, string> = {
    futter: 'futterung',
    futterung: 'futterung',
    fuetterung: 'futterung',
    feeding: 'futterung',
    mensch: 'fur mensch',
    menschen: 'fur mensch',
    'fur mensch': 'fur mensch',
    human: 'fur mensch',
    people: 'fur mensch',
    tier: 'fur tier',
    tiere: 'fur tier',
    'fur tier': 'fur tier',
    'fur tiere': 'fur tier',
    pet: 'fur tier',
    animal: 'fur tier',
    moebel: 'mobel',
    mobel: 'mobel',
  };

  return aliases[base] ?? base;
};

export default function HomePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedProducts: Product[] = (data ?? []).map((item: Record<string, unknown>) =>
          mapDbProductToProduct(item)
        );
        setProducts(mappedProducts);
        setError(null);
      } catch (fetchError) {
        console.error('Error fetching products:', fetchError);
        setError('Produkte konnten nicht geladen werden.');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveProducts();
  }, []);


  const filteredProducts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return products;
    }

    const normalizedSelected = Array.from(
      new Set(selectedCategories.map((category) => normalizeCategory(category)))
    );

    return products.filter((product) => {
      const assignedCategories = product.categories || [];
      if (assignedCategories.length === 0) return false;

      const normalizedProductCategories = new Set(
        assignedCategories.map((category) => normalizeCategory(category))
      );
      return normalizedSelected.every((category) => normalizedProductCategories.has(category));
    });
  }, [selectedCategories, products]);

  const handleToggleCategory = (category: string) => {
    if (normalizeCategory(category) === normalizeCategory('Alle')) {
      setSelectedCategories([]);
      return;
    }

    const normalizedCategory = normalizeCategory(category);
    setSelectedCategories((prev) =>
      prev.some((tag) => normalizeCategory(tag) === normalizedCategory)
        ? prev.filter((tag) => normalizeCategory(tag) !== normalizedCategory)
        : [...prev, category]
    );
  };

  return (
    <div>
      <HeroSection />
      <TagFilter selectedCategories={selectedCategories} onToggle={handleToggleCategory} />
      {isLoading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-text-secondary">Lädt Produkte...</p>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-text-secondary">{error}</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div id="product-grid" className="container mx-auto px-4 py-16 text-center">
          <p className="text-2xl text-text-secondary">Keine Produkte gefunden 😿</p>
          <p className="text-text-secondary mt-2">Versuche einen anderen Filter!</p>
        </div>
      ) : (
        <MasonryGrid products={filteredProducts} />
      )}
    </div>
  );
}
