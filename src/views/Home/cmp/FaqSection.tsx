import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './FaqSection.module.css';

const FAQS = [
  { q: 'Devo prenotare in anticipo?', a: 'Sì, consigliamo sempre di prenotare per garantire disponibilità. Puoi farlo via telefono, WhatsApp o tramite il nostro form online, anche il giorno prima.' },
  { q: 'Come posso contattarvi?', a: 'Puoi chiamarci al +39 329 709 4859, scriverci su WhatsApp o mandarci un\'email. Rispondiamo di solito entro poche ore.' },
  { q: 'Dove si trova il centro?', a: 'CNC Beauty si trova in Via Enrico de Nicola 16, nel centro di Sciacca (AG), facilmente raggiungibile da tutta la provincia di Agrigento.' },
  { q: 'Posso acquistare i prodotti direttamente in centro?', a: 'Sì, una selezione di cosmetici professionali è disponibile direttamente presso il centro. Puoi anche chiedere una consulenza per scegliere i prodotti più adatti alla tua pelle.' },
  { q: 'Come scelgo il trattamento più adatto a me?', a: 'Il modo migliore è una consulenza gratuita con Carla: insieme analizzerete la tua pelle, le tue esigenze e gli obiettivi, e costruirete il percorso più adatto.' },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i);

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

        {FAQS.map((f, i) => (
          <motion.div
            key={f.q}
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
              {f.q}
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
                  <div className={styles.ansInner}>{f.a}</div>
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
