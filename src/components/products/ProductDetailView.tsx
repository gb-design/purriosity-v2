import { useEffect, useState } from 'react';
import { Heart, Bookmark, ExternalLink, Share2, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { Product } from '../../types/product';
import { formatPurrCount } from '../../lib/utils';
import { useProductPurr } from '../../hooks/useProductPurr';
import { useSavedProducts } from '../../hooks/useSavedProducts';
import ProductCarousel from './ProductCarousel';

interface ProductDetailViewProps {
  product: Product;
  isModal?: boolean;
  relatedProducts?: Product[];
  relatedLoading?: boolean;
}

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=900&q=80';

const buildGalleryImages = (product: Product) => {
  const validImages = (product.images || []).filter((img): img is string => Boolean(img));
  const candidates = validImages.length > 0 ? validImages : [PLACEHOLDER_IMAGE];
  return candidates.slice(0, 5);
};

export default function ProductDetailView({
    product,
    isModal = false,
    relatedProducts = [],
    relatedLoading = false,
}: ProductDetailViewProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSaved, toggleSave } = useSavedProducts();
    const saved = isSaved(product.id);
    const { isPurred, purrCount, togglePurr } = useProductPurr(product.id, product.purrCount);
  const [galleryImages, setGalleryImages] = useState<string[]>(buildGalleryImages(product));
  const [activeImage, setActiveImage] = useState<string>(buildGalleryImages(product)[0]);

  useEffect(() => {
    const nextImages = buildGalleryImages(product);
        setGalleryImages(nextImages);
        setActiveImage(nextImages[0]);
    }, [product]);

  return (
    <div
      className={`bg-card w-full ${
        isModal ? 'rounded-xl overflow-hidden p-6 sm:p-8 lg:p-8' : 'min-h-screen'
      }`}
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Column: Image */}
        <div className={`flex flex-col ${isModal ? 'md:w-1/2' : 'w-full md:sticky md:top-20'}`}>
          <div
            className={`relative bg-black/5 flex items-center justify-center rounded-2xl overflow-hidden ${
              isModal ? 'min-h-[420px] max-h-[520px]' : 'w-full md:h-[70vh]'
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
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {galleryImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square rounded-2xl overflow-hidden border transition-all ${
                    activeImage === img
                      ? 'border-primary ring-2 ring-primary/40'
                      : 'border-transparent hover:border-border'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} Ansicht ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details */}
        <div
          className={`flex flex-col p-6 md:p-8 lg:p-12 ${isModal ? 'md:w-1/2' : 'w-full max-w-2xl mx-auto'}`}
        >
          <div className="flex-1">
            {/* Header / Meta */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-wrap gap-2" />
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
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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

            <div className="mb-6" />

            {/* Description */}
            <div className="prose prose-stone dark:prose-invert max-w-none mb-8">
              <p className="text-lg leading-relaxed text-text-secondary">{product.description}</p>
            </div>

            {(() => {
              const combined = Array.from(
                new Set([...(product.tags || []), ...(product.categories || [])])
              ).filter(Boolean);
              const limited = combined.slice(0, 10);
              if (limited.length === 0) return null;
              return (
                <div className="mb-8">
                  <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {limited.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-secondary text-text-secondary rounded-full border border-border/60 text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}

            <div className="border-t border-border my-8" />

            {/* Price & Affiliate */}
            <div className="bg-secondary/50 p-6 rounded-2xl border border-border/50 text-center space-y-4">
              <p className="text-sm text-text-secondary">
                Klick dich direkt zum Anbieter und entdecke alle Details rund um dieses Produkt.
              </p>
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-md shadow-primary/20"
              >
                Zum Produkt
                <ExternalLink className="w-5 h-5" />
              </a>
              <p className="text-xs text-text-secondary">* Enthält Affiliate-Links</p>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="sticky bottom-0 bg-card/80 backdrop-blur pt-4 pb-2 mt-8 flex gap-4 border-t border-border/50">
            <button
              onClick={async () => {
                const result = await togglePurr();
                if (result === 'auth_required') {
                  navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all group ${
                isPurred
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border hover:border-primary/50 text-text'
              }`}
            >
              <Heart
                className={`w-6 h-6 transition-transform group-hover:scale-110 ${isPurred ? 'fill-primary stroke-primary' : 'stroke-current'}`}
              />
              <span className="font-bold text-lg">{formatPurrCount(purrCount)}</span>
            </button>

            <button
              onClick={async () => {
                const result = await toggleSave(product.id);
                if (result === 'auth_required') {
                  navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`);
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 transition-all group ${
                saved ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-foreground/50 text-text'
              }`}
            >
              <Bookmark
                className={`w-6 h-6 transition-transform group-hover:scale-110 ${saved ? 'fill-primary stroke-primary' : 'stroke-current'}`}
              />
              <span className="font-bold text-lg">{saved ? 'Gespeichert' : 'Speichern'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {(relatedLoading || relatedProducts.length > 0) && (
        <div className="mt-10">
          <div className="w-2/3 max-w-lg h-px mx-auto bg-border/70" />
          <h2 className="font-display text-2xl md:text-3xl font-bold my-8 text-center">
            Mehr wie dieses 🐱
          </h2>
          {relatedLoading ? (
            <div className="flex justify-center py-10 text-muted-foreground">
              Lädt ähnliche Produkte...
            </div>
          ) : (
            <div className="px-2 sm:px-4">
              <ProductCarousel products={relatedProducts} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
