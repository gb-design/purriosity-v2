import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Category {
  id: string;
  name: string;
  emoji: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Default fallback categories if table doesn't exist yet
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Alle',
    emoji: '✨',
    display_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Fütterung',
    emoji: '🍽️',
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Geschenke',
    emoji: '🎁',
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'für Mensch',
    emoji: '👤',
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'für Tier',
    emoji: '🐾',
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Kleidung',
    emoji: '👕',
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Lustig',
    emoji: '😂',
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Luxus',
    emoji: '👑',
    display_order: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '9',
    name: 'Niedlich',
    emoji: '🥰',
    display_order: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10',
    name: 'Nützliches',
    emoji: '🛠️',
    display_order: 9,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '11',
    name: 'Pflege',
    emoji: '🧴',
    display_order: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '12',
    name: 'Skurril',
    emoji: '🤪',
    display_order: 11,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '13',
    name: 'Spielzeug',
    emoji: '🎾',
    display_order: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const useSettings = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchError) {
        console.warn('Categories table not found, using default categories:', fetchError.message);
        setIsUsingFallback(true);
        setCategories(DEFAULT_CATEGORIES);
        setError(null);
        return;
      }

      if (data && data.length > 0) {
        setCategories(data);
        setIsUsingFallback(false);
        setError(null);
      } else {
        setCategories(DEFAULT_CATEGORIES);
        setIsUsingFallback(false);
      }
    } catch (err) {
      console.warn('Error fetching categories, using defaults:', err);
      setCategories(DEFAULT_CATEGORIES);
      setIsUsingFallback(true);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Add category
  const addCategory = async (name: string, emoji: string) => {
    try {
      const maxOrder =
        categories.length > 0 ? Math.max(...categories.map((c) => c.display_order)) : -1;

      const { data, error: addError } = await supabase
        .from('categories')
        .insert([{ name, emoji, display_order: maxOrder + 1 }])
        .select();

      if (addError) throw addError;
      setCategories([...categories, data[0]]);
      return { success: true, data: data[0] };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error adding category';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update category
  const updateCategory = async (id: string, name: string, emoji: string) => {
    try {
      const { data, error: updateError } = await supabase
        .from('categories')
        .update({ name, emoji, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;
      setCategories(categories.map((c) => (c.id === id ? data[0] : c)));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating category';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Delete category
  const deleteCategory = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('categories').delete().eq('id', id);

      if (deleteError) throw deleteError;
      setCategories(categories.filter((c) => c.id !== id));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting category';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Reorder categories
  const reorderCategories = async (orderedCategories: Category[]) => {
    try {
      const updates = orderedCategories.map((cat, index) => ({
        id: cat.id,
        display_order: index,
      }));

      for (const update of updates) {
        const { error: updateError } = await supabase
          .from('categories')
          .update({ display_order: update.display_order, updated_at: new Date().toISOString() })
          .eq('id', update.id);

        if (updateError) throw updateError;
      }

      setCategories(orderedCategories);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error reordering categories';
      setError(message);
      return { success: false, error: message };
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    isUsingFallback,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
  };
};
