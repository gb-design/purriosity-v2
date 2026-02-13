import { useState, useMemo } from 'react';
import HeroSection from '../components/home/HeroSection';
import TagFilter from '../components/home/TagFilter';
import MasonryGrid from '../components/home/MasonryGrid';
import { mockProducts } from '../data/mockProducts';
import type { TagType } from '../types/product';

export default function HomePage() {
    const [selectedTag, setSelectedTag] = useState<TagType>('Alle');

    const filteredProducts = useMemo(() => {
        if (selectedTag === 'Alle') {
            return mockProducts;
        }
        return mockProducts.filter((product) => product.tags.includes(selectedTag));
    }, [selectedTag]);

    return (
        <div>
            <HeroSection />
            <TagFilter selectedTag={selectedTag} onTagChange={setSelectedTag} />
            <MasonryGrid products={filteredProducts} />
        </div>
    );
}
