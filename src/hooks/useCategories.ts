import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Category } from './useSettings';

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

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (error) {
          console.warn('Using default categories:', error.message);
          setCategories(DEFAULT_CATEGORIES);
        } else if (data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch (err) {
        console.warn('Error fetching categories, using defaults:', err);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading };
};
