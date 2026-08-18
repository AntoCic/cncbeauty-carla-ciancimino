import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PromotionData } from '../../models/Promotion';
import styles from './PromoModal.module.css';

interface PromoModalProps {
  promotions: PromotionData[];
  onClose: () => void;
}

const AUTOPLAY_MS = 5000;

export const PromoModal = ({ promotions, onClose }: PromoModalProps) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => document.body.classList.remove('overflow-hidden');
  }, []);

  useEffect(() => {
    if (promotions.length <= 1 || paused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % promotions.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [promotions.length, paused]);

  if (promotions.length === 0) return null;
  const current = promotions[index];

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.panel}
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        >
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Chiudi">
            ✕
          </button>

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              className={styles.slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <motion.div
                className={styles.imageWrap}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <img src={current.imageUrl} alt={current.title} className={styles.image} />
              </motion.div>
              <motion.h2
                className={styles.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                {current.title}
              </motion.h2>
              <motion.p
                className={styles.description}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                {current.description}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          {promotions.length > 1 && (
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => setIndex((i) => (i - 1 + promotions.length) % promotions.length)}
                aria-label="Promozione precedente"
              >
                ‹
              </button>
              <div className={styles.dots}>
                {promotions.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                    onClick={() => setIndex(i)}
                    aria-label={`Vai alla promozione ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => setIndex((i) => (i + 1) % promotions.length)}
                aria-label="Promozione successiva"
              >
                ›
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PromoModal;
