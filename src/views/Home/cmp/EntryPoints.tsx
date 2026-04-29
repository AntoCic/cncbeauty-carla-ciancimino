import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import styles from './EntryPoints.module.css';

const EntryPoints = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <section id="entries" ref={ref} className={styles.entries} aria-label="Trattamenti e Prodotti">
      <Link to="/trattamenti" className={styles.entry} aria-label="Vai ai Trattamenti">
        <div className={`${styles.entryBg} ${styles.ebgT}`} />
        <div className={styles.entryOv} />
        <motion.div
          className={styles.entryBody}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0 }}
        >
          <h2>Trattamenti</h2>
          <p>Percorsi viso e corpo pensati per valorizzare la tua bellezza e rispondere alle tue esigenze, con protocolli personalizzati.</p>
          <div className={styles.entryBtn}>Vedi trattamenti <span className={styles.arr}>→</span></div>
        </motion.div>
      </Link>

      <Link to="/prodotti" className={styles.entry} aria-label="Vai ai Prodotti">
        <div className={`${styles.entryBg} ${styles.ebgP}`} />
        <div className={styles.entryOv} />
        <motion.div
          className={styles.entryBody}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <h2>Prodotti</h2>
          <p>Scopri i cosmetici selezionati dal centro per continuare la tua beauty routine anche a casa, in modo efficace.</p>
          <div className={styles.entryBtn}>Vedi prodotti <span className={styles.arr}>→</span></div>
        </motion.div>
      </Link>
    </section>
  );
};

export default EntryPoints;
