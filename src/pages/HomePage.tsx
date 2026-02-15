import { useState, useMemo, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import TagFilter from '../components/home/TagFilter';
import MasonryGrid from '../components/home/MasonryGrid';
import { supabase } from '../lib/supabase';
import type { TagType } from '../types/product';
import type { Product } from '../types/product';
import { mapDbProductToProduct } from '../lib/productMapper';

export default function HomePage() {
  const [selectedTag, setSelectedTag] = useState<TagType>('Alle');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const mappedProducts: Product[] = (data ?? []).map((item: Record<string, unknown>) =>
          mapDbProductToProduct(item)
        );
        const activeProducts = mappedProducts.filter((product) => product.isActive !== false);
        setProducts(activeProducts);
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
    if (selectedTag === 'Alle') {
      return products;
    }
    return products.filter((product) => product.tags.includes(selectedTag));
  }, [selectedTag, products]);

  return (
    <div>
      <HeroSection />
      <TagFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
      {isLoading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-text-secondary">Lädt Produkte...</p>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-text-secondary">{error}</p>
        </div>
      ) : (
        <MasonryGrid products={filteredProducts} />
      )}
    </div>
  );
}
