import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPurrCount } from '../../lib/utils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isPurred, setIsPurred] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [purrCount, setPurrCount] = useState(product.purrCount);

    const handlePurr = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPurred) {
            setPurrCount(purrCount - 1);
        } else {
            setPurrCount(purrCount + 1);
        }
        setIsPurred(!isPurred);
    };

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSaved(!isSaved);
    };

    return (
        <Link to={`/product/${product.id}`}>
            <div className="group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-4">
                {/* Save Button - Top Right */}
                <button
                    onClick={handleSave}
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all"
                    aria-label="Speichern"
                >
                    <Bookmark
                        className={`h-5 w-5 transition-all ${isSaved ? 'fill-primary text-primary' : 'text-text-secondary'
                            }`}
                    />
                </button>

                {/* Product Image */}
                <div className="relative overflow-hidden aspect-[3/4]">
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {/* Title */}
                    <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-2">
                        {product.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                        {product.shortDescription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 2).map((tag) => (
                            <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Bottom Row: Purr Button + Price */}
                    <div className="flex items-center justify-between">
                        {/* Purr Button */}
                        <button
                            onClick={handlePurr}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-all group/purr"
                            aria-label="Purr"
                        >
                            <Heart
                                className={`h-4 w-4 transition-all group-hover/purr:scale-110 ${isPurred
                                        ? 'fill-primary text-primary animate-pulse'
                                        : 'text-primary'
                                    }`}
                            />
                            <span className="text-sm font-medium text-primary">
                                {formatPurrCount(purrCount)}
                            </span>
                        </button>

                        {/* Price */}
                        <span className="text-lg font-bold text-foreground">
                            {product.price.toFixed(2)} €
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
