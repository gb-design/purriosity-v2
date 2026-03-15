import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, type Location } from 'react-router-dom';
import { X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductDetailView from './ProductDetailView';
import { supabase } from '../../lib/supabase';
import { mapDbProductToProduct } from '../../lib/productMapper';
import type { Product } from '../../types/product';
import { fetchRelatedProducts } from '../../lib/productService';

type ModalLocationState = {
  background?: Location;
  productSequence?: string[];
  productIndex?: number;
};

export default function ProductModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const modalState = (location.state as ModalLocationState) ?? {};
  const productSequence = modalState.productSequence ?? [];
  const sequenceIndex =
    typeof modalState.productIndex === 'number' ? modalState.productIndex : null;
  const hasPrevProduct = sequenceIndex !== null && sequenceIndex > 0;
  const hasNextProduct =
    sequenceIndex !== null && sequenceIndex < productSequence.length - 1;

  const handleSequenceNavigate = (direction: 1 | -1) => {
    if (sequenceIndex === null) return;
    const nextIndex = sequenceIndex + direction;
    if (nextIndex < 0 || nextIndex >= productSequence.length) return;
    const nextId = productSequence[nextIndex];
    navigate(`/product/${nextId}`, {
      replace: true,
      state: {
        ...modalState,
        productSequence,
        productIndex: nextIndex,
      },
    });
  };

  useEffect(() => {
    // Disable body scroll when modal is open
    document.body.style.overflow = 'hidden';

    // Handle Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        const mapped = mapDbProductToProduct(data as Record<string, unknown>);
        setProduct(mapped);
        setError(null);

        setRelatedLoading(true);
        const related = await fetchRelatedProducts(mapped, 5);
        setRelatedProducts(related);
        setRelatedLoading(false);
      } catch (err) {
        console.error('Error fetching product for modal:', err);
        setError('Produkt konnte nicht geladen werden.');
        setProduct(null);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
        setRelatedLoading(false);
      }
    };

    fetchProduct();
  }, [id]);


  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 lg:p-16 animate-in fade-in duration-200"
      onClick={() => navigate(-1)}
    >
      <div
        className="relative w-full max-w-5xl h-[95vh] sm:h-[90vh] bg-card rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-y-auto overflow-x-hidden animate-in zoom-in-50 duration-300 slide-in-from-bottom-10 scrollbar-soft"
        onClick={(e) => e.stopPropagation()}
      >
        {hasPrevProduct && (
          <button
            type="button"
            aria-label="Vorheriges Produkt"
            onClick={() => handleSequenceNavigate(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-background/80 text-foreground shadow md:left-4"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {hasNextProduct && (
          <button
            type="button"
            aria-label="Nächstes Produkt"
            onClick={() => handleSequenceNavigate(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-40 p-2 rounded-full bg-background/80 text-foreground shadow md:right-4"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex absolute top-4 right-4 z-50 p-2 bg-background/70 hover:bg-background rounded-full transition-colors backdrop-blur text-foreground"
        >
          <X className="w-6 h-6" />
        </button>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-lg font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Zurück
            </button>
          </div>
        ) : product ? (
          <ProductDetailView
            product={product}
            isModal={true}
            relatedProducts={relatedProducts}
            relatedLoading={relatedLoading}
          />
        ) : null}
      </div>
    </div>
  );
}
