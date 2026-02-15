import type { Product } from '../types/product';

// Normalize Supabase rows (snake_case) to our UI-friendly Product shape
export const mapDbProductToProduct = (item: Record<string, unknown>): Product => {
  const images = Array.isArray(item.images)
    ? (item.images as string[])
    : item['featured_image_url']
      ? [item['featured_image_url'] as string]
      : [];

  const tags = Array.isArray(item.tags) ? (item.tags as string[]) : [];

  return {
    id: (item.id as string) ?? '',
    title: (item.title as string) ?? '',
    description: (item.description as string) ?? '',
    shortDescription:
      (item.shortDescription as string) ??
      (item['short_description'] as string) ??
      '',
    images,
    price: typeof item.price === 'number' ? item.price : Number(item.price ?? 0),
    currency: (item.currency as string) ?? 'EUR',
    affiliateUrl:
      (item.affiliateUrl as string) ??
      (item['affiliate_url'] as string) ??
      '',
    purrCount:
      typeof item['purr_count'] === 'number'
        ? (item['purr_count'] as number)
        : typeof item.purrCount === 'number'
          ? item.purrCount
          : 0,
    viewCount:
      typeof item['view_count'] === 'number'
        ? (item['view_count'] as number)
        : typeof item.viewCount === 'number'
          ? item.viewCount
          : 0,
    starRating:
      typeof item['star_rating'] === 'number'
        ? (item['star_rating'] as number)
        : typeof item.starRating === 'number'
          ? item.starRating
          : 0,
    tags,
    createdAt:
      (item.createdAt as string) ??
      (item['created_at'] as string) ??
      new Date().toISOString(),
    isActive:
      typeof item['is_active'] === 'boolean'
        ? (item['is_active'] as boolean)
        : typeof item.isActive === 'boolean'
          ? item.isActive
          : true,
  };
};
