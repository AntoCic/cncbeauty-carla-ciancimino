import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './TechCarousel.module.css';

const TECHS = [
  {
    title: 'Laser Epilazione Progressiva',
    problem: 'Peli superflui, irritazione da rasatura e ricrescita rapida.',
    result: 'Riduzione progressiva dei peli e pelle più uniforme nel tempo.',
    approach: 'Percorso personalizzato con tecnologia laser e parametri calibrati.',
    img: '/img/home/laser.webp',
    slug: 'laser-epilazione',
  },
  {
    title: 'Microneedling',
    problem: 'Texture irregolare, segni post acne e perdita di luminosità.',
    result: 'Pelle più compatta, levigata e visibilmente più luminosa.',
    approach: 'Protocollo microneedling con supporto cosmetico mirato.',
    img: '/img/home/microneedling.webp',
    slug: 'microneedling',
  },
  {
    title: 'Luce Pulsata IPL',
    problem: 'Macchie cutanee, arrossamenti e peli superflui resistenti.',
    result: 'Pelle più uniforme, macchie ridotte e epilazione duratura.',
    approach: 'Trattamento con luce pulsata calibrata per tipo di pelle e obiettivo.',
    img: '/img/home/laser.webp',
    slug: 'luce-pulsata',
  },
  {
    title: 'Tecnologie Viso e Corpo',
    problem: 'Perdita di tono e necessità di trattamenti mirati per zone specifiche.',
    result: 'Miglioramento graduale di tonicità e definizione corporea.',
    approach: 'Combinazione di radiofrequenza, tecnologie estetiche avanzate e manualità in base agli obiettivi.',
    img: '/img/home/macchinario-viso-corpo.webp',
    slug: 'tecnologie-viso-corpo',
  },
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
            <div className={styles.img} style={{ backgroundImage: `url(${t.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div className={styles.body}>
              <h3>{t.title}</h3>
              <p className={styles.problem}>{t.problem}</p>
              <p className={styles.approach}>{t.approach}</p>
              <p className={styles.result}>{t.result}</p>
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
