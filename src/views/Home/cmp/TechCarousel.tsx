import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './TechCarousel.module.css';

const TECHS = [
  { title: 'Radiofrequenza', use: 'Rassodamento cutaneo e riduzione della lassità tissutale.', benefit: 'Pelle più compatta e tonica già dalle prime sedute.', bg: 'linear-gradient(145deg,#D4A0B0,#C08898)', slug: 'radiofrequenza' },
  { title: 'Luce Pulsata IPL', use: 'Epilazione definitiva e trattamento delle macchie cutanee.', benefit: 'Pelle liscia e uniforme con risultati duraturi.', bg: 'linear-gradient(145deg,#C8A0C0,#B08898)', slug: 'luce-pulsata' },
  { title: 'Pressoterapia', use: 'Favorire il drenaggio linfatico e ridurre la ritenzione idrica.', benefit: 'Gambe leggere, riduzione della cellulite e benessere.', bg: 'linear-gradient(145deg,#B8A888,#D4C090)', slug: 'pressoterapia' },
  { title: 'Crioterapia Viso', use: 'Ridurre pori dilatati, rossori e stimolare la rigenerazione.', benefit: 'Viso più fresco, tono uniforme e pori minimizzati.', bg: 'linear-gradient(145deg,#A0B0C8,#8898B0)', slug: 'crioterapia' },
  { title: 'Microdermabrasione', use: 'Esfoliazione profonda per rinnovare lo strato superficiale della pelle.', benefit: 'Pelle levigata, luminosa e uniforme dopo ogni seduta.', bg: 'linear-gradient(145deg,#C0A8C8,#A890B0)', slug: 'microdermabrasione' },
];

const TechCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const scroll = (dir: 1 | -1) => {
    carouselRef.current?.scrollBy({ left: dir * 324, behavior: 'smooth' });
  };

  return (
    <section id="tech" className={styles.tech} aria-labelledby="tech-h">
      <motion.div
        className={styles.head}
        ref={ref}
        initial={{ opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65 }}
      >
        <span className="cnc-tag">Il nostro arsenale</span>
        <h2 id="tech-h">Tecnologie per trattamenti più mirati</h2>
        <p>Strumenti professionali disponibili nel nostro centro a Sciacca, Agrigento.</p>
      </motion.div>

      <div className={styles.scroll} ref={carouselRef} role="list" aria-label="Carosello tecnologie">
        {TECHS.map((t, i) => (
          <motion.article
            key={t.slug}
            className={styles.card}
            role="listitem"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: i * 0.08 }}
          >
            <div className={styles.img} style={{ background: t.bg }} />
            <div className={styles.body}>
              <h3>{t.title}</h3>
              <p className={styles.use}>A cosa serve: {t.use}</p>
              <p className={styles.benefit}>Beneficio percepito: {t.benefit}</p>
              <span className={styles.link}>Scopri la tecnologia →</span>
            </div>
          </motion.article>
        ))}
      </div>

      <div className={styles.hint} aria-hidden="true">
        <span>scorri per vedere tutte</span>
        <button className={styles.arrow} onClick={() => scroll(-1)} aria-label="Precedente">←</button>
        <button className={styles.arrow} onClick={() => scroll(1)} aria-label="Successivo">→</button>
      </div>
    </section>
  );
};

export default TechCarousel;
