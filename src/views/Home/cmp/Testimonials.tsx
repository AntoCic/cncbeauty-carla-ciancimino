import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Testimonials.module.css';

gsap.registerPlugin(ScrollTrigger);

const REVIEWS = [
  { text: '"Da quando mi affido a Carla, la mia pelle è completamente trasformata. Professionalità, gentilezza e risultati veri. Il miglior centro estetico di Sciacca."', name: '— Giulia M., Sciacca'    },
  { text: '"Ambiente meraviglioso, sempre pulitissimo e accogliente. Ho fatto la radiofrequenza e i risultati sono stati incredibili già dopo tre sedute."',                name: '— Rossella A., Agrigento' },
  { text: '"Carla ha una mano delicata e un occhio clinico. Si vede che ama quello che fa. Consiglio CNC Beauty a tutte le amiche in tutta la Sicilia!"',                   name: '— Francesca T., Palermo'  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(headRef.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 86%' },
      }
    );

    // Alternating slide-in: left → centre → right
    const directions = [-70, 0, 70];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(card,
        { opacity: 0, x: directions[i], y: 30 },
        {
          opacity: 1, x: 0, y: 0, duration: 0.82, ease: 'power3.out',
          scrollTrigger: { trigger: headRef.current, start: 'top 82%' },
          delay: i * 0.12,
        }
      );
    });

    // Subtle scale pop on hover via GSAP
    cardRefs.current.forEach(card => {
      if (!card) return;
      card.addEventListener('mouseenter', () =>
        gsap.to(card, { y: -6, scale: 1.015, duration: 0.3, ease: 'power2.out' })
      );
      card.addEventListener('mouseleave', () =>
        gsap.to(card, { y: 0, scale: 1, duration: 0.45, ease: 'elastic.out(1, 0.6)' })
      );
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.vars.trigger === headRef.current)
        .forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="test" className={styles.section} aria-labelledby="test-h" ref={sectionRef}>
      <div ref={headRef} className={styles.head}>
        <span className="cnc-tag">Le nostre clienti</span>
        <h2 id="test-h">Cosa dicono di noi</h2>
      </div>
      <div className={styles.grid}>
        {REVIEWS.map((r, i) => (
          <div
            key={r.name}
            className={styles.card}
            ref={el => { cardRefs.current[i] = el; }}
          >
            <div className={styles.stars} aria-label="5 stelle">★★★★★</div>
            <p className={styles.quote}>{r.text}</p>
            <span className={styles.name}>{r.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
