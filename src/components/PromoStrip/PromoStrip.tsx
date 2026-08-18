import { useState } from 'react';
import { motion } from 'framer-motion';
import { useActivePromotions } from '../../db/promotion/usePromotions';
import { Modal } from '../Modal/Modal';
import type { PromotionData } from '../../models/Promotion';
import styles from './PromoStrip.module.css';

interface PromoStripProps {
  type: 'products' | 'treatments';
  categoryId?: string;
}

export const PromoStrip = ({ type, categoryId }: PromoStripProps) => {
  const { promotions } = useActivePromotions(type, categoryId);
  const [selected, setSelected] = useState<PromotionData | null>(null);

  if (promotions.length === 0) return null;

  return (
    <>
      <div className={styles.strip}>
        {promotions.map((promo, i) => (
          <motion.button
            key={promo.id}
            type="button"
            className={styles.card}
            onClick={() => setSelected(promo)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
          >
            <span className={styles.cardShine} aria-hidden="true" />
            <span className={styles.cardBody}>
              <span className={styles.cardBadge}>
                <span className="material-symbols-outlined" aria-hidden>local_offer</span>
                Promo
              </span>
              <span className={styles.cardTitle}>{promo.title}</span>
              <span className={styles.cardDescription}>{promo.description}</span>
            </span>
            <span className={styles.cardCta}>
              Scopri di più
              <span className="material-symbols-outlined" aria-hidden>arrow_forward</span>
            </span>
          </motion.button>
        ))}
      </div>

      <Modal show={!!selected} onClose={() => setSelected(null)} title={selected?.title} centered>
        {selected && (
          <div className={styles.detail}>
            <img src={selected.imageUrl} alt={selected.title} className={styles.detailImage} />
            <p className={styles.detailDescription}>{selected.description}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PromoStrip;
