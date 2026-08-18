import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import type { PromotionData } from '../../models/Promotion';
import { filterActiveToday, matchesPage } from './activePromotions';

/** `pageType` omesso: nessun filtro per tipo/categoria, usato dal popup home (mostra tutte
 * le promo attive oggi, incluse quelle `general`). `pageType` presente: filtra per la pagina
 * corrente via `matchesPage` (vedi lì per la logica generale/categorie). */
export async function getActivePromotionsToday(
  pageType?: 'products' | 'treatments',
  categoryId?: string,
): Promise<PromotionData[]> {
  console.log(`[db] getActivePromotionsToday: fetching (pageType=${pageType ?? 'any'}, categoryId=${categoryId ?? 'none'})`);
  try {
    const q = query(collection(db, 'promotions'), where('active', '==', true));
    const snap = await getDocs(q);
    const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PromotionData));
    const today = filterActiveToday(all);
    const result = pageType ? today.filter((p) => matchesPage(p, pageType, categoryId)) : today;
    console.log(`[db] getActivePromotionsToday: ${result.length} active docs`, result);
    return result;
  } catch (err) {
    console.error('[promotionRepo] getActivePromotionsToday failed:', err);
    throw err;
  }
}
