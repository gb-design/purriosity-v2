import { Link, useLocation, useNavigate, type Location } from 'react-router-dom';
import { Heart, Bookmark, BookmarkCheck } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPurrCount } from '../../lib/utils';
import { useProductPurr } from '../../hooks/useProductPurr';
import { useSavedProducts } from '../../hooks/useSavedProducts';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const backgroundLocation = (location.state as { background?: Location })?.background;
    const linkState = backgroundLocation ? { background: backgroundLocation } : { background: location };
    const { isPurred, purrCount, togglePurr } = useProductPurr(product.id, product.purrCount);
    const { isSaved, toggleSave } = useSavedProducts();
    const saved = isSaved(product.id);

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
        <Link to={`/product/${product.id}`} state={linkState} replace={Boolean(backgroundLocation)}>
      <div className="group relative bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 mb-4 border border-transparent hover:border-primary/20">
        {/* Save Button - Top Right */}
        <button
          onClick={handleSave}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all z-10 ${
            saved
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/20 text-white hover:bg-white hover:text-foreground opacity-0 group-hover:opacity-100'
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
              <span
                key={tag}
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-background border border-border rounded-full text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 gap-4">
            <span className="font-bold text-sm text-foreground">Details</span>

            <button
              onClick={handlePurr}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                isPurred
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
