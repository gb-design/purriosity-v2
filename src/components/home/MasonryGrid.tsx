import Masonry from 'react-masonry-css';
import ProductCard from '../products/ProductCard';
import type { Product } from '../../types/product';

interface MasonryGridProps {
    products: Product[];
}

const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 4,
    1024: 3,
    768: 3,
    640: 2,
};

export default function MasonryGrid({ products }: MasonryGridProps) {
    if (products.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-2xl text-text-secondary">
                    Keine Produkte gefunden 😿
                </p>
                <p className="text-text-secondary mt-2">
                    Versuche einen anderen Filter!
                </p>
            </div>
        );
    }

    return (
        <div id="product-grid" className="container mx-auto px-4 py-8">
            <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
            >
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </Masonry>
        </div>
    );
}
