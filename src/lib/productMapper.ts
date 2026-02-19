import type { Product, TagType } from '../types/product';

const TAG_REMAP: Record<string, TagType> = {
  alle: 'Alle',
  cute: 'Niedlich',
  niedlich: 'Niedlich',
  weird: 'Skurril',
  skurril: 'Skurril',
  funny: 'Lustig',
  lustig: 'Lustig',
  gift: 'Geschenke',
  geschenke: 'Geschenke',
  human: 'für Mensch',
  'für mensch': 'für Mensch',
  people: 'für Mensch',
  pet: 'für Tier',
  animal: 'für Tier',
  'für tier': 'für Tier',
  care: 'Pflege',
  pflege: 'Pflege',
  toy: 'Spielzeug',
  spielzeug: 'Spielzeug',
  clothing: 'Kleidung',
  kleidung: 'Kleidung',
  luxury: 'Luxus',
  luxus: 'Luxus',
  feeding: 'Fütterung',
  fütterung: 'Fütterung',
  useful: 'Nützliches',
  nützliches: 'Nützliches',
  budget: 'Nützliches',
  smart: 'Nützliches',
  practical: 'Nützliches',
};

const normalizeTags = (input: string[]): string[] => {
  const normalized = new Set<string>();
  input.forEach((tag) => {
    const key = tag.toLowerCase().trim();
    normalized.add(TAG_REMAP[key] ?? tag);
  });
  return Array.from(normalized);
};

// Normalize Supabase rows (snake_case) to our UI-friendly Product shape
export const mapDbProductToProduct = (item: Record<string, unknown>): Product => {
  const images = Array.isArray(item.images)
    ? (item.images as string[])
    : item['featured_image_url']
      ? [item['featured_image_url'] as string]
      : [];

  const tagsArray = Array.isArray(item.tags) ? (item.tags as string[]) : [];
  const tags = normalizeTags(tagsArray);
  const categoriesArray = Array.isArray(item.categories) ? (item.categories as string[]) : [];
  const categories = categoriesArray.length > 0 ? normalizeTags(categoriesArray) : tags;

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
    tags,
    categories,
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
