import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface SavedContextValue {
  savedIds: Set<string>;
  loading: boolean;
  toggleSave: (productId: string) => Promise<'saved' | 'removed' | 'auth_required' | 'error'>;
  isSaved: (productId: string) => boolean;
  refresh: () => Promise<void>;
}

const SavedProductsContext = createContext<SavedContextValue | undefined>(undefined);

export const SavedProductsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from('product_saves').select('product_id').eq('user_id', user.id);

    if (!error && data) {
      const ids = (data as { product_id: string }[]).map((entry) => entry.product_id);
      setSavedIds(new Set(ids));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const toggleSave = useCallback(
    async (productId: string) => {
      if (!user) return 'auth_required';

      const currentlySaved = savedIds.has(productId);

      if (currentlySaved) {
        const { error } = await supabase
          .from('product_saves')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) return 'error';
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        return 'removed';
      }

      const { error } = await supabase
        .from('product_saves')
        .insert({ user_id: user.id, product_id: productId });

      if (error) return 'error';
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.add(productId);
        return next;
      });
      return 'saved';
    },
    [user, savedIds]
  );

  const value = useMemo<SavedContextValue>(
    () => ({
      savedIds,
      loading,
      toggleSave,
      isSaved: (productId: string) => savedIds.has(productId),
      refresh: fetchSaved,
    }),
    [savedIds, loading, toggleSave, fetchSaved]
  );

  return <SavedProductsContext.Provider value={value}>{children}</SavedProductsContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSavedProductsContext = () => {
  const ctx = useContext(SavedProductsContext);
  if (!ctx) {
    throw new Error('useSavedProductsContext must be used within SavedProductsProvider');
  }
  return ctx;
};
