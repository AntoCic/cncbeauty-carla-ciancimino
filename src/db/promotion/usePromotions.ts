import { useEffect, useState } from 'react';
import { getActivePromotionsToday } from './promotionRepo';
import type { PromotionData } from '../../models/Promotion';

export function useActivePromotions(type?: PromotionData['type']) {
  const [promotions, setPromotions] = useState<PromotionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getActivePromotionsToday(type)
      .then((items) => {
        if (!cancelled) setPromotions(items);
      })
      .catch((err) => console.error('[useActivePromotions] fetch failed:', err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [type]);

  return { promotions, loading };
}
