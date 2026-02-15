import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

type ToggleResult = 'liked' | 'unliked' | 'auth_required' | 'error';

const EVENT_NAME = 'purriosity:purr-updated';

interface PurrEventDetail {
  productId: string;
  liked: boolean;
  count: number;
}

const emitEvent = (detail: PurrEventDetail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
};

export const useProductPurr = (productId: string, initialCount: number) => {
  const { user } = useAuth();
  const [isPurred, setIsPurred] = useState(false);
  const [purrCount, setPurrCount] = useState(initialCount);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    setPurrCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    let cancelled = false;
    const fetchState = async () => {
      if (!user) {
        setIsPurred(false);
        return;
      }

      const { data, error } = await supabase
        .from('product_likes')
        .select('id')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cancelled && !error) {
        setIsPurred(Boolean(data));
      }
    };

    fetchState();

    return () => {
      cancelled = true;
    };
  }, [user, productId]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const handler = (event: Event) => {
      const detail = (event as CustomEvent<PurrEventDetail>).detail;
      if (detail?.productId === productId) {
        setPurrCount(detail.count);
        setIsPurred(detail.liked);
      }
    };

    window.addEventListener(EVENT_NAME, handler as EventListener);
    return () => window.removeEventListener(EVENT_NAME, handler as EventListener);
  }, [productId]);

  const togglePurr = useCallback(async (): Promise<ToggleResult> => {
    if (!user) return 'auth_required';
    if (isMutating) return 'error';

    setIsMutating(true);
    const nextLiked = !isPurred;
    setIsPurred(nextLiked);
    setPurrCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));

    const action = nextLiked
      ? supabase.from('product_likes').insert({ user_id: user.id, product_id: productId })
      : supabase.from('product_likes').delete().eq('user_id', user.id).eq('product_id', productId);

    const { error } = await action;
    if (error) {
      setIsPurred(!nextLiked);
      setPurrCount((prev) => Math.max(0, prev + (nextLiked ? -1 : 1)));
      setIsMutating(false);
      return 'error';
    }

    const { data: latestData, error: latestError } = await supabase
      .from('products')
      .select('purr_count')
      .eq('id', productId)
      .single();

    const latest = !latestError && latestData ? latestData.purr_count ?? 0 : Math.max(0, purrCount + (nextLiked ? 1 : -1));
    setPurrCount(latest);
    emitEvent({ productId, liked: nextLiked, count: latest });
    setIsMutating(false);
    return nextLiked ? 'liked' : 'unliked';
  }, [user, isPurred, isMutating, productId, purrCount]);

  return { isPurred, purrCount, togglePurr, isMutating };
};
