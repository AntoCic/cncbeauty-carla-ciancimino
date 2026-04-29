import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './WhyUs.module.css';

const CARDS = [
  { ico: '◇', title: 'Consulenza personalizzata', text: 'Ogni percorso parte dall\'ascolto delle tue esigenze. Nessun protocollo standard.' },
  { ico: '✦', title: 'Trattamenti mirati', text: 'Soluzioni specifiche per viso, corpo e benessere estetico, pensate per i tuoi obiettivi.' },
  { ico: '❀', title: 'Tecnologie selezionate', text: 'Macchinari certificati e conformi agli standard europei per risultati sicuri e visibili.' },
  { ico: '○', title: 'Ambiente curato', text: 'Uno spazio accogliente a Sciacca dove prenderti il tempo che meriti.' },
];

const WhyUs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <section id="why" className={styles.why} aria-labelledby="why-h">
      <div className={styles.wrap}>
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          ref={ref}
        >
          <span className="cnc-tag">La nostra promessa</span>
          <h2 id="why-h">Perché scegliere CNC Beauty</h2>
          <p>A Sciacca, un centro estetico che mette la persona al centro.</p>
        </motion.div>
        <div className={styles.grid}>
          {CARDS.map((c, i) => (
            <motion.div
              key={c.title}
              className={styles.card}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1 + i * 0.1 }}
            >
              <div className={styles.ico} aria-hidden="true">{c.ico}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
