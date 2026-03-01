import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';
import { useCategories } from './useCategories';
import { mapDbProductToProduct } from '../lib/productMapper';

export function useSearch() {
  const { categories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      // Dynamic Category Suggestions from database
      const term = searchTerm.toLowerCase();
      const categoryNames = categories.map((cat) => cat.name);
      const matchingTags = categoryNames
        .filter((tag) => tag.toLowerCase().includes(term))
        .slice(0, 5);
      setSuggestions(matchingTags);

      try {
        // Split search term into individual words
        const terms = searchTerm.trim().split(/\s+/);

        // Build OR conditions for each term
        // Checks: Title (case-insensitive), Tag (exact), Tag (lower), Tag (capitalized)
        const orConditions = terms
          .map((term) => {
            const lower = term.toLowerCase();
            const capitalized = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
            return `title.ilike.%${term}%,tags.cs.{${term}},tags.cs.{${lower}},tags.cs.{${capitalized}}`;
          })
          .join(',');

        const { data, error } = await supabase
          .from('products')
          .select(
            'id,title,description,short_description,images,price,currency,affiliate_url,purr_count,view_count,tags,categories,created_at,is_active'
          )
          .eq('is_active', true)
          .or(orConditions)
          .limit(10);

        if (error) {
          throw error;
        }

        const mappedProducts: Product[] = (data || []).map((item: Record<string, unknown>) =>
          mapDbProductToProduct(item)
        );
        setResults(mappedProducts);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to fetch search results.');
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, categories]);

  return {
    searchTerm,
    setSearchTerm,
    results,
    suggestions,
    isLoading,
    error,
  };
}
