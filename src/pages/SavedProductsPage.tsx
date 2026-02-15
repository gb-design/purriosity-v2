import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { mapDbProductToProduct } from '../lib/productMapper';
import type { Product } from '../types/product';
import MasonryGrid from '../components/home/MasonryGrid';
import { Loader2, Bookmark } from 'lucide-react';
import { useSavedProducts } from '../hooks/useSavedProducts';

export default function SavedProductsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { savedIds } = useSavedProducts();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=/favorites', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('product_saves')
        .select('product:products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = (data as { product: Record<string, unknown> }[])
          .map((entry) => entry.product)
          .filter((p): p is Record<string, unknown> => Boolean(p))
          .map((p) => mapDbProductToProduct(p));
        setSavedProducts(mapped);
      }
      setIsLoading(false);
    };

    fetchSaved();
  }, [user, savedIds]);

  if (!user && loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Bookmark className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold">Deine gespeicherten Produkte</h1>
          <p className="text-text-secondary">Alle Favoriten auf einen Blick – nur für dich sichtbar.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : savedProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-semibold text-text-secondary">Noch nichts gespeichert.</p>
          <p className="text-text-secondary mt-2">Tippe auf das Bookmark-Symbol, um Produkte zu sichern.</p>
        </div>
      ) : (
        <MasonryGrid products={savedProducts} />
      )}
    </div>
  );
}
