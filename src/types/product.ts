export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  currency: string;
  affiliateUrl: string;
  productUrl?: string;
  linkType?: 'affiliate' | 'regular';
  affiliatePlatforms?: string[];
  purrCount: number;
  viewCount: number;
  tags: string[];
  categories?: string[];
  blogArticleUrl?: string;
  createdAt: string;
  isActive?: boolean;
}

export type TagType =
  | 'Alle'
  | 'Niedlich'
  | 'Skurril'
  | 'Lustig'
  | 'Geschenke'
  | 'für Mensch'
  | 'für Tier'
  | 'Pflege'
  | 'Spielzeug'
  | 'Kleidung'
  | 'Luxus'
  | 'Fütterung'
  | 'Nützliches';
