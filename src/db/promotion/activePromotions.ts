import type { PromotionData } from '../../models/Promotion';

/** Tiene solo le promozioni con `active === true` e la cui finestra [startDate, endDate]
 * include `now`. Filtro client-side per evitare un indice Firestore composito nuovo. */
export function filterActiveToday(promotions: PromotionData[], now: Date = new Date()): PromotionData[] {
  return promotions.filter((p) => {
    if (!p.active) return false;
    return p.startDate.toDate() <= now && now <= p.endDate.toDate();
  });
}

/** Decide se `promo` va mostrata sulla pagina `pageType` (prodotti/trattamenti), opzionalmente
 * ristretta a una categoria specifica (`categoryId`, es. la pagina `/prodotti/pelle-grassa`):
 * - `categoryId` assente (pagina principale `/prodotti` o `/trattamenti`): mostra le promo
 *   `general` (visibili su entrambe le pagine principali) più quelle dello stesso tipo,
 *   indipendentemente dalle categorie selezionate su di esse.
 * - `categoryId` presente (pagina di una categoria specifica): mostra solo le promo dello
 *   stesso tipo che includono esplicitamente quella categoria in `categoryIds` — le promo
 *   `general` e quelle senza categorie non compaiono qui, solo sulle pagine principali. */
export function matchesPage(promo: PromotionData, pageType: 'products' | 'treatments', categoryId?: string): boolean {
  if (categoryId) {
    return promo.type === pageType && !!promo.categoryIds?.includes(categoryId);
  }
  return promo.type === 'general' || promo.type === pageType;
}
