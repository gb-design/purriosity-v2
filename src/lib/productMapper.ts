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

const normalizePlatforms = (input?: unknown): string[] => {
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((platform) => platform.trim().replace(/\s+/g, ' '))
      .filter(Boolean);
  }
  if (!Array.isArray(input)) return [];
  const seen = new Set<string>();
  const values: string[] = [];

  input.forEach((platform) => {
    if (typeof platform !== 'string') return;
    const normalized = platform.trim().replace(/\s+/g, ' ');
    if (!normalized) return;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    values.push(normalized);
  });

  return values;
};

const derivePlatformFromUrl = (url?: string): string | null => {
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    const host = hostname.replace(/^www\./, '').toLowerCase();
    if (!host) return null;
    const labels = host.split('.');
    if (labels.length === 0) return null;
    const base = labels[0];
    if (!base) return null;
    return base.charAt(0).toUpperCase() + base.slice(1);
  } catch {
    return null;
  }
};

// Normalize Supabase rows (snake_case) to our UI-friendly Product shape
export const mapDbProductToProduct = (item: Record<string, unknown>): Product => {
  const featuredImage =
    (item['featured_image_url'] as string) ??
    (item['featuredImageUrl'] as string) ??
    '';
  const normalizedFeaturedImage = featuredImage.trim();
  const rawImages = Array.isArray(item.images)
    ? (item.images as unknown[])
    : [];
  const normalizedImages = rawImages
    .filter((value): value is string => typeof value === 'string')
    .map((value) => value.trim())
    .filter(Boolean);
  const images = normalizedFeaturedImage
    ? [normalizedFeaturedImage, ...normalizedImages.filter((image) => image !== normalizedFeaturedImage)]
    : normalizedImages;

  const tagsArray = Array.isArray(item.tags) ? (item.tags as string[]) : [];
  const tags = normalizeTags(tagsArray);
  const categoriesArray = Array.isArray(item.categories) ? (item.categories as string[]) : [];
  const categories = categoriesArray.length > 0 ? normalizeTags(categoriesArray) : tags;
  const affiliateUrl =
    (item.affiliateUrl as string) ??
    (item['affiliate_url'] as string) ??
    '';

  const platformCandidates = [
    normalizePlatforms(item['affiliate_platforms']),
    normalizePlatforms(item['affiliateProviders']),
    normalizePlatforms(item['affiliate_providers']),
    normalizePlatforms(item['affiliate_provider']),
  ];
  const rawPlatforms = platformCandidates.find((platforms) => platforms.length > 0) || [];
  const fallbackPlatform = derivePlatformFromUrl(affiliateUrl);
  const affiliatePlatforms =
    rawPlatforms.length > 0
      ? rawPlatforms
      : fallbackPlatform
        ? [fallbackPlatform]
        : [];

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
    affiliateUrl,
    affiliatePlatforms,
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
