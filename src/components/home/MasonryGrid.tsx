import Masonry from 'react-masonry-css';
import { motion } from 'motion/react';
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

    const productIds = products.map((product) => product.id);
    const animationKey = productIds.join('|');

    return (
        <motion.div
            key={animationKey}
            id="product-grid"
            className="container mx-auto px-4 py-8"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: 0.04,
                    },
                },
            }}
        >
            <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
            >
                {products.map((product, index) => (
                    <motion.div
                        key={product.id}
                        variants={{
                            hidden: { opacity: 0, y: 24 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.45,
                                    ease: [0.22, 1, 0.36, 1],
                                },
                            },
                        }}
                    >
                        <ProductCard product={product} productIds={productIds} productIndex={index} />
                    </motion.div>
                ))}
            </Masonry>
        </motion.div>
    );
}
