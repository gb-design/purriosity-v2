import { useState, useMemo, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import TagFilter from '../components/home/TagFilter';
import MasonryGrid from '../components/home/MasonryGrid';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';
import { mapDbProductToProduct } from '../lib/productMapper';

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
    if (selectedCategories.length === 0) {
      return products;
    }

    const normalizedSelected = selectedCategories.map((category) => category.toLowerCase());

    return products.filter((product) => {
      const categories = product.categories && product.categories.length > 0 ? product.categories : product.tags;
      if (!categories || categories.length === 0) return false;

      const normalizedCategories = categories.map((category) => category.toLowerCase());
      return normalizedSelected.some((category) => normalizedCategories.includes(category));
    });
  }, [selectedCategories, products]);

  const handleToggleCategory = (category: string) => {
    if (category === 'Alle') {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((tag) => tag !== category) : [...prev, category]
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
      ) : (
        <MasonryGrid products={filteredProducts} />
      )}
    </div>
  );
}
