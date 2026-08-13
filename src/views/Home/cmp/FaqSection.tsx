import { useMemo, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useAppSelector } from '../../../store';
import styles from './FaqSection.module.css';

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const faqs = useAppSelector((s) => s.appConfig.data.faq ?? []);
  const sortedFaqs = useMemo(
    () => [...faqs].sort((a, b) => b.priority - a.priority),
    [faqs],
  );

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i);

  if (sortedFaqs.length === 0) return null;

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-h" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <span className="cnc-tag">Hai domande?</span>
          <h2 id="faq-h">Domande frequenti</h2>
        </motion.div>

        {sortedFaqs.map((f, i) => (
          <motion.div
            key={f.id}
            className={styles.item}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.07 }}
          >
            <button
              className={styles.btn}
              aria-expanded={open === i}
              onClick={() => toggle(i)}
            >
              {f.question}
              <span className={`${styles.ico} ${open === i ? styles.icoOpen : ''}`} aria-hidden="true">+</span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  className={styles.ans}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className={styles.ansInner}>{f.answer}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
