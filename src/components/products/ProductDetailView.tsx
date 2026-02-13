import { useState } from 'react';
import { Heart, Bookmark, ExternalLink, Star, Share2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPurrCount } from '../../lib/utils';

interface ProductDetailViewProps {
    product: Product;
    isModal?: boolean;
}

export default function ProductDetailView({ product, isModal = false }: ProductDetailViewProps) {
    const navigate = useNavigate();
    const [isPurred, setIsPurred] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [purrCount, setPurrCount] = useState(product.purrCount);

    const handlePurr = () => {
        if (isPurred) {
            setPurrCount(purrCount - 1);
        } else {
            setPurrCount(purrCount + 1);
        }
        setIsPurred(!isPurred);
    };

    return (
        <div className={`bg-card w-full ${isModal ? 'rounded-2xl overflow-hidden' : 'min-h-screen'}`}>
            <div className="flex flex-col md:flex-row h-full">

                {/* Left Column: Image */}
                <div className={`relative bg-black/5 flex items-center justify-center ${isModal ? 'md:w-1/2 min-h-[400px] md:min-h-[600px]' : 'w-full md:h-[80vh] md:sticky md:top-20'
                    }`}
                >
                    {isModal && (
                        <button
                            onClick={() => navigate(-1)}
                            className="absolute top-4 left-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur transition-colors md:hidden"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    )}

                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover object-center max-h-[80vh]"
                    />
                </div>

                {/* Right Column: Details */}
                <div className={`flex flex-col p-6 md:p-8 lg:p-12 ${isModal ? 'md:w-1/2' : 'w-full max-w-2xl mx-auto'}`}>
                    <div className="flex-1">
                        {/* Header / Meta */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map((tag) => (
                                    <span key={tag} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    className="p-2 hover:bg-secondary rounded-full transition-colors text-text-secondary"
                                    aria-label="Share"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                {isModal && (
                                    <button
                                        className="hidden md:flex p-2 hover:bg-secondary rounded-full transition-colors text-text-secondary"
                                        aria-label="More"
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="19" cy="12" r="1" />
                                            <circle cx="5" cy="12" r="1" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Title & Price */}
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-2 mb-6 text-yellow-500">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-5 h-5 ${star <= Math.round(product.starRating) ? 'fill-current' : 'text-gray-300 fill-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-text-secondary text-sm font-medium ml-1">
                                ({product.viewCount.toLocaleString()} views)
                            </span>
                        </div>

                        {/* Description */}
                        <div className="prose prose-stone dark:prose-invert max-w-none mb-8">
                            <p className="text-lg leading-relaxed text-text-secondary">
                                {product.description}
                            </p>
                        </div>

                        <div className="border-t border-border my-8" />

                        {/* Price & Affiliate */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-secondary/50 p-6 rounded-xl border border-border/50">
                            <div>
                                <span className="block text-sm text-text-secondary mb-1">Preis</span>
                                <span className="text-3xl font-bold text-foreground">
                                    {product.price.toFixed(2)} {product.currency === 'EUR' ? '€' : product.currency}
                                </span>
                            </div>
                            <a
                                href={product.affiliateUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-md shadow-primary/20"
                            >
                                Zum Produkt
                                <ExternalLink className="w-5 h-5" />
                            </a>
                        </div>
                        <p className="text-xs text-text-secondary text-center mt-3">
                            * Enthält Affiliate-Links
                        </p>
                    </div>

                    {/* Sticky Bottom Actions */}
                    <div className="sticky bottom-0 bg-card/80 backdrop-blur pt-4 pb-2 mt-8 flex gap-4 border-t border-border/50">
                        <button
                            onClick={handlePurr}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all group ${isPurred
                                    ? 'border-primary bg-primary/5 text-primary'
                                    : 'border-border hover:border-primary/50 text-text'
                                }`}
                        >
                            <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${isPurred ? 'fill-primary stroke-primary' : 'stroke-current'}`} />
                            <span className="font-bold text-lg">{formatPurrCount(purrCount)}</span>
                        </button>

                        <button
                            onClick={() => setIsSaved(!isSaved)}
                            className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all group ${isSaved
                                    ? 'border-foreground bg-foreground/5 text-foreground'
                                    : 'border-border hover:border-foreground/50 text-text'
                                }`}
                        >
                            <Bookmark className={`w-6 h-6 transition-transform group-hover:scale-110 ${isSaved ? 'fill-foreground stroke-foreground' : 'stroke-current'}`} />
                            <span className="font-bold text-lg">{isSaved ? 'Gespeichert' : 'Speichern'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
