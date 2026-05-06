import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './TechCarousel.module.css';

const TECHS = [
  {
    title: 'Laser Diodo — Epilazione Indolore',
    problem: 'Peli superflui, irritazione da rasatura e ricrescita frequente.',
    approach: 'Laser diodo di ultima generazione con manipolo a raffreddamento criogenico integrato: la testina raffredda la cute in tempo reale, azzerando quasi completamente il dolore. Parametri calibrati per zona, fototipo e spessore del pelo.',
    result: 'Riduzione permanente progressiva dei peli fino all\'80–90% in 6–8 sedute. Pelle liscia, uniforme e senza irritazioni.',
    img: '/img/home/laser.webp',
    slug: 'laser-epilazione',
  },
  {
    title: 'Microneedling — Collagene e Anti-Aging',
    problem: 'Texture irregolare, cicatrici da acne, rughe superficiali e perdita di elasticità.',
    approach: 'Dispositivo a microaghi a profondità regolabile che stimola la produzione naturale di collagene ed elastina. Combinato con sieri attivi specifici per amplificare i risultati su viso e collo.',
    result: 'Pelle più compatta, levigata e luminosa. Miglioramento visibile di rughe, pori dilatati e segni post-acne già dalla seconda seduta.',
    img: '/img/home/microneedling.webp',
    slug: 'microneedling',
  },
  {
    title: 'Luce Pulsata IPL — Macchie e Uniformità',
    problem: 'Macchie solari, arrossamenti, couperose e peli superflui resistenti.',
    approach: 'Luce pulsata ad ampio spettro calibrata per fototipo e obiettivo. Agisce selettivamente su melanina e capillari senza ledere i tessuti circostanti, per un trattamento preciso e non invasivo.',
    result: 'Tono della pelle più uniforme, macchie ridotte, arrossamenti e couperose attenuati. Efficace anche per l\'epilazione di completamento.',
    img: '/img/home/laser.webp',
    slug: 'luce-pulsata',
  },
  {
    title: 'Suite Tecnologica Viso e Corpo',
    problem: 'Perdita di tono, gonfiori, accumuli adiposi, acne, pelle spenta o invecchiata.',
    approach: 'Fotobiostimolazione LED per anti-aging e rigenerazione cellulare, Renewskin a microcorrenti per rinnovamento della pelle, radiofrequenza per compattezza e rimodellamento corporeo, spatola ultrasonica per pulizia profonda e purificazione. Ogni protocollo è costruito su misura.',
    result: 'Viso più giovane e compatto, pelle purificata, corpo ridefinito e drenato. Risultati visibili già dopo le prime sedute.',
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
