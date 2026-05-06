import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Testimonials.module.css';

gsap.registerPlugin(ScrollTrigger);

const GOOGLE_REVIEW_URL = 'https://g.page/r/CYoaAc0R-5D4EBM/review';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" aria-label="Google" className={styles.googleIcon}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const REVIEWS = [
  {
    text: '"Carla è straordinaria! Ho fatto il percorso di epilazione laser e sono rimasta senza parole. Dopo poche sedute ho visto risultati concreti. Centro pulito, accogliente e professionale. Lo consiglio a tutte!"',
    name: 'Marianna C.',
    location: 'Sciacca',
  },
  {
    text: '"Finalmente il centro estetico di fiducia che cercavo. Ho provato il microneedling e la mia pelle è completamente cambiata. Carla personalizza ogni percorso con professionalità e dedizione vera."',
    name: 'Roberta P.',
    location: 'Agrigento',
  },
  {
    text: '"Esperienza meravigliosa! La radiofrequenza viso ha dato risultati visibili già dalla prima seduta. Ambiente elegante, personale preparato e prezzi onesti. Cinque stelle assolutamente meritatissime!"',
    name: 'Giusy M.',
    location: 'Sciacca',
  },
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
        <p className={styles.headSub}>Recensioni verificate su Google</p>
      </div>
      <div className={styles.grid}>
        {REVIEWS.map((r, i) => (
          <div
            key={r.name}
            className={styles.card}
            ref={el => { cardRefs.current[i] = el; }}
          >
            <div className={styles.cardTop}>
              <div className={styles.stars} aria-label="5 stelle">★★★★★</div>
              <div className={styles.googleBadge}>
                <GoogleIcon />
                <span>Google</span>
              </div>
            </div>
            <p className={styles.quote}>{r.text}</p>
            <div className={styles.reviewer}>
              <div className={styles.avatar} aria-hidden="true">{r.name[0]}</div>
              <div>
                <span className={styles.name}>{r.name}</span>
                <span className={styles.location}>{r.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.cta}>
        <a
          href={GOOGLE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.ctaBtn}
        >
          <GoogleIcon />
          Lascia la tua recensione su Google
        </a>
      </div>
    </section>
  );
};

export default Testimonials;
