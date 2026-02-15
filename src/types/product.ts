export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  images: string[];
  price: number;
  currency: string;
  affiliateUrl: string;
  purrCount: number;
  viewCount: number;
  starRating: number;
  tags: string[];
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
