import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types/product';

export function useSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchTerm.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                // Split search term into individual words
                const terms = searchTerm.trim().split(/\s+/);

                // Build OR conditions for each term
                // Checks: Title (case-insensitive), Tag (exact), Tag (lower), Tag (capitalized)
                const orConditions = terms.map(term => {
                    const lower = term.toLowerCase();
                    const capitalized = term.charAt(0).toUpperCase() + term.slice(1).toLowerCase();
                    return `title.ilike.%${term}%,tags.cs.{${term}},tags.cs.{${lower}},tags.cs.{${capitalized}}`;
                }).join(',');

                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .or(orConditions)
                    .limit(10);

                if (error) {
                    throw error;
                }

                if (error) {
                    throw error;
                }

                // Map database columns (snake_case) to Product interface (camelCase)
                const mappedProducts: Product[] = (data || []).map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    shortDescription: item.short_description,
                    images: item.images || [],
                    price: item.price,
                    currency: item.currency,
                    affiliateUrl: item.affiliate_url,
                    purrCount: item.purr_count,
                    viewCount: item.view_count,
                    starRating: item.star_rating,
                    tags: item.tags || [],
                    createdAt: item.created_at
                }));

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
    }, [searchTerm]);

    return {
        searchTerm,
        setSearchTerm,
        results,
        isLoading,
        error
    };
}
