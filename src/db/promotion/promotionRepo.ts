import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { PromotionData } from '../../models/Promotion';
import { filterActiveToday } from './activePromotions';

export async function getActivePromotionsToday(type?: PromotionData['type']): Promise<PromotionData[]> {
  console.log(`[db] getActivePromotionsToday: fetching (type=${type ?? 'any'})`);
  try {
    const q = query(collection(db, 'promotions'), where('active', '==', true));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PromotionData));
    const today = filterActiveToday(all);
    const result = type ? today.filter((p) => p.type === type) : today;
    console.log(`[db] getActivePromotionsToday: ${result.length} active docs`, result);
    return result;
  } catch (err) {
    console.error('[promotionRepo] getActivePromotionsToday failed:', err);
    throw err;
  }
}
