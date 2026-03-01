import { Link, useLocation, useNavigate, type Location } from 'react-router-dom';
import { Heart, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPurrCount } from '../../lib/utils';
import { useProductPurr } from '../../hooks/useProductPurr';
import { useSavedProducts } from '../../hooks/useSavedProducts';

interface ProductCardProps {
  product: Product;
  productIds?: string[];
  productIndex?: number;
}

export default function ProductCard({ product, productIds, productIndex }: ProductCardProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const backgroundLocation = (location.state as { background?: Location })?.background;
    const linkState = backgroundLocation ? { background: backgroundLocation } : { background: location };
    const modalState = { ...linkState } as Record<string, unknown>;
    if (productIds && typeof productIndex === 'number') {
        modalState.productSequence = productIds;
        modalState.productIndex = productIndex;
    }
    const { isPurred, purrCount, togglePurr } = useProductPurr(product.id, product.purrCount);
    const { isSaved, toggleSave } = useSavedProducts();
    const saved = isSaved(product.id);
    const platforms = (product.affiliatePlatforms || [])
      .map((platform) => platform.trim())
      .filter(Boolean)
      .slice(0, 2);

    const handlePurr = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const result = await togglePurr();
        if (result === 'auth_required') {
            navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
        }
    };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await toggleSave(product.id);
    if (result === 'auth_required') {
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
    }
  };

  return (
        <Link to={`/product/${product.id}`} state={modalState} replace={Boolean(backgroundLocation)}>
      <div className="group relative bg-card rounded-lg overflow-hidden shadow-md md:hover:shadow-xl transition-all duration-300 md:hover:-translate-y-1 mb-4 border border-transparent md:hover:border-primary/20">
        {/* Save Button - Top Right */}
        <button
          onClick={handleSave}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
            saved
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/20 text-white md:hover:bg-white md:hover:text-foreground opacity-0 md:group-hover:opacity-100'
          }`}
        >
          {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>

        {saved && (
          <span className="absolute top-3 left-3 text-[11px] uppercase tracking-wider bg-primary text-primary-foreground rounded-full px-2 py-0.5 shadow">
            Gespeichert
          </span>
        )}

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-background-secondary">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
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
            {(product.categories && product.categories.length > 0 ? product.categories : product.tags)
              .slice(0, 3)
              .map((category) => (
                <span
                  key={category}
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-background border border-border rounded-full text-muted-foreground"
                >
                  {category}
                </span>
              ))}
          </div>

          {platforms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {platforms.map((platform) => (
                <span
                  key={`${product.id}-${platform}`}
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold"
                >
                  {platform}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-end">
            <button
              onClick={handlePurr}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                isPurred
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105'
                  : 'bg-secondary text-text-secondary md:hover:bg-primary/10 md:hover:text-primary md:hover:scale-105'
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
