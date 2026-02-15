import { supabase } from './supabase';
import { mapDbProductToProduct } from './productMapper';
import type { Product } from '../types/product';

export const fetchRelatedProducts = async (product: Product, limit = 6): Promise<Product[]> => {
  const fetchFallback = async () => {
    const { data: fallback, error: fallbackError } = await supabase
      .from('products')
      .select('*')
      .neq('id', product.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fallbackError) throw fallbackError;

    return (fallback ?? [])
      .map((item: Record<string, unknown>) => mapDbProductToProduct(item))
      .filter((item: Product) => item.isActive !== false);
  };

  if (!product?.tags || product.tags.length === 0) {
    try {
      return await fetchFallback();
    } catch (error) {
      console.warn('Unable to fetch fallback related products:', error);
      return [];
    }
  }

  const fetchWithQuery = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', product.id)
      .overlaps('tags', product.tags.slice(0, 3))
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  };

  try {
    const primary = await fetchWithQuery();
    const mappedPrimary = primary.map((item: Record<string, unknown>) => mapDbProductToProduct(item));
    const filteredPrimary = mappedPrimary.filter((item: Product) => item.isActive !== false);

    if (filteredPrimary.length > 0) {
      return filteredPrimary;
    }

    return await fetchFallback();
  } catch (error) {
    console.warn('Unable to fetch related products:', error);
    return [];
  }
};
