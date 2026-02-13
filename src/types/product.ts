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
}

export type TagType = 'Alle' | 'Cute' | 'Weird' | 'Gift' | 'Budget' | 'Minimal' | 'Luxury' | 'Funny' | 'Practical';
