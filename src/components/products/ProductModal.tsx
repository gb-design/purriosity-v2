import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Loader2 } from 'lucide-react';
import ProductDetailView from './ProductDetailView';
import { supabase } from '../../lib/supabase';
import { mapDbProductToProduct } from '../../lib/productMapper';
import type { Product } from '../../types/product';
import { fetchRelatedProducts } from '../../lib/productService';

export default function ProductModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

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
        const related = await fetchRelatedProducts(mapped, 6);
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-8 sm:p-14 lg:p-20 animate-in fade-in duration-200"
      onClick={() => navigate(-1)}
    >
      <div
        className="relative w-full max-w-5xl h-[90vh] bg-card rounded-2xl shadow-2xl overflow-y-auto overflow-x-hidden animate-in zoom-in-50 duration-300 slide-in-from-bottom-10 scrollbar-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-50 p-2 bg-background/50 hover:bg-background rounded-full transition-colors backdrop-blur text-foreground"
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
