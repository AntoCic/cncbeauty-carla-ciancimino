import type { PromotionData } from '../../models/Promotion';

/** Tiene solo le promozioni con `active === true` e la cui finestra [startDate, endDate]
 * include `now`. Filtro client-side per evitare un indice Firestore composito nuovo. */
export function filterActiveToday(promotions: PromotionData[], now: Date = new Date()): PromotionData[] {
  return promotions.filter((p) => {
    if (!p.active) return false;
    return p.startDate.toDate() <= now && now <= p.endDate.toDate();
  });
}
