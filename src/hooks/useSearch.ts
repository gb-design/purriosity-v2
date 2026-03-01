import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';
import { useCategories } from './useCategories';
import { mapDbProductToProduct } from '../lib/productMapper';

const normalizeSearchValue = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const uniqueValues = (values: string[]) => Array.from(new Set(values));

export function useSearch() {
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveProducts = async () => {
      setError(null);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (!isMounted) return;

        const mappedProducts: Product[] = (data || []).map((item: Record<string, unknown>) =>
          mapDbProductToProduct(item)
        );
        setAllProducts(mappedProducts);
      } catch (err) {
        console.error('Search preload error:', err);
        if (isMounted) {
          setAllProducts([]);
          setError('Failed to fetch search results.');
        }
      }
    };

    fetchActiveProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Dynamic suggestions from categories + existing product tags/categories.
      const term = normalizeSearchValue(searchTerm);
      const categoryNames = categories.map((cat) => cat.name);
      const productLabels = allProducts.flatMap((product) => [
        ...(product.categories ?? []),
        ...(product.tags ?? []),
      ]);
      const searchableLabels = uniqueValues([...categoryNames, ...productLabels]);
      const matchingSuggestions = searchableLabels
        .filter((tag) => normalizeSearchValue(tag).includes(term))
        .slice(0, 5);
      setSuggestions(matchingSuggestions);

      const terms = searchTerm
        .trim()
        .split(/\s+/)
        .map(normalizeSearchValue)
        .filter(Boolean);

      const filtered = allProducts
        .filter((product) => {
          const title = normalizeSearchValue(product.title);
          const labels = uniqueValues([...(product.categories ?? []), ...(product.tags ?? [])]).map(
            normalizeSearchValue
          );
          return terms.some(
            (singleTerm) =>
              title.includes(singleTerm) ||
              labels.some((label) => label.includes(singleTerm))
          );
        })
        .slice(0, 10);

      setResults(filtered);
      setIsLoading(false);
    };

    // Debounce
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categories, allProducts]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    suggestions,
    isLoading,
    error,
  };
}
