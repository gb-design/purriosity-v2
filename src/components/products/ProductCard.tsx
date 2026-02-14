import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Bookmark } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPurrCount } from '../../lib/utils';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const location = useLocation();
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
        <Link to={`/product/${product.id}`} state={{ background: location }}>
            <div className="group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-4 border border-transparent hover:border-primary/20">
                {/* Save Button - Top Right */}
                <button
                    onClick={handleSave}
                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${isSaved
                        ? 'bg-foreground/10 text-foreground'
                        : 'bg-black/20 text-white hover:bg-white hover:text-foreground opacity-0 group-hover:opacity-100'
                        }`}
                >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-foreground' : ''}`} />
                </button>

                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-background-secondary">
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-display font-bold text-lg mb-1 line-clamp-2 leading-tight">
                        {product.title}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                        {product.shortDescription}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {product.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-background border border-border rounded-full text-muted-foreground">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-foreground">
                            Mehr Infos
                        </span>

                        <button
                            onClick={handlePurr}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isPurred
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                                : 'bg-secondary text-text-secondary hover:bg-primary/10 hover:text-primary hover:scale-105'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isPurred ? 'fill-current animate-pulse' : ''}`} />
                            <span>{formatPurrCount(purrCount)}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
