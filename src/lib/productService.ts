import { supabase } from './supabase';
import { mapDbProductToProduct } from './productMapper';
import type { Product } from '../types/product';

export const fetchRelatedProducts = async (product: Product, limit = 6): Promise<Product[]> => {
  const fetchFallback = async () => {
    const { data: fallback, error: fallbackError } = await supabase
      .from('products')
      .select(
        'id,title,description,short_description,images,price,currency,affiliate_url,purr_count,view_count,tags,categories,created_at,is_active'
      )
      .neq('id', product.id)
      .eq('is_active', true)
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
      .select(
        'id,title,description,short_description,images,price,currency,affiliate_url,purr_count,view_count,tags,categories,created_at,is_active'
      )
      .neq('id', product.id)
      .eq('is_active', true)
      .overlaps('tags', product.tags.slice(0, 3))
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  };

  try {
    const primary = await fetchWithQuery();
    const mappedPrimary = primary.map((item: Record<string, unknown>) => mapDbProductToProduct(item));
    if (mappedPrimary.length > 0) {
      return mappedPrimary;
    }

    return await fetchFallback();
  } catch (error) {
    console.warn('Unable to fetch related products:', error);
    return [];
  }
};
