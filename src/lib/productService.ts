import { supabase } from './supabase';
import { mapDbProductToProduct } from './productMapper';
import type { Product } from '../types/product';

interface ScoredProduct {
  product: Product;
  score: number;
}

export const fetchRelatedProducts = async (product: Product, limit = 5): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .neq('id', product.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || data.length === 0) return [];

    const all: Product[] = data.map((item: Record<string, unknown>) => mapDbProductToProduct(item));

    const productTags = new Set((product.tags ?? []).map((t: string) => t.toLowerCase()));
    const productCategories = new Set((product.categories ?? []).map((c: string) => c.toLowerCase()));

    const scored: ScoredProduct[] = all.map((p: Product) => {
      let score = 0;
      (p.tags ?? []).forEach((t: string) => { if (productTags.has(t.toLowerCase())) score += 2; });
      (p.categories ?? []).forEach((c: string) => { if (productCategories.has(c.toLowerCase())) score += 1; });
      return { product: p, score };
    });

    scored.sort((a: ScoredProduct, b: ScoredProduct) => {
      if (b.score !== a.score) return b.score - a.score;
      return Math.random() - 0.5;
    });

    return scored.slice(0, limit).map((s: ScoredProduct) => s.product);
  } catch (error) {
    console.warn('Unable to fetch related products:', error);
    return [];
  }
};
