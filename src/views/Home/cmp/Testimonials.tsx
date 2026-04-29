import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './Testimonials.module.css';

const REVIEWS = [
  { text: '"Da quando mi affido a Carla, la mia pelle è completamente trasformata. Professionalità, gentilezza e risultati veri. Il miglior centro estetico di Sciacca."', name: '— Giulia M., Sciacca' },
  { text: '"Ambiente meraviglioso, sempre pulitissimo e accogliente. Ho fatto la radiofrequenza e i risultati sono stati incredibili già dopo tre sedute."', name: '— Rossella A., Agrigento' },
  { text: '"Carla ha una mano delicata e un occhio clinico. Si vede che ama quello che fa. Consiglio CNC Beauty a tutte le amiche in tutta la Sicilia!"', name: '— Francesca T., Palermo' },
];

const Testimonials = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <section id="test" className={styles.section} aria-labelledby="test-h" ref={ref}>
      <motion.div
        className={styles.head}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65 }}
      >
        <span className="cnc-tag">Le nostre clienti</span>
        <h2 id="test-h">Cosa dicono di noi</h2>
      </motion.div>
      <div className={styles.grid}>
        {REVIEWS.map((r, i) => (
          <motion.div
            key={r.name}
            className={styles.card}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: i * 0.1 }}
          >
            <div className={styles.stars} aria-label="5 stelle">★★★★★</div>
            <p className={styles.quote}>{r.text}</p>
            <span className={styles.name}>{r.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
