import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CherryBlossomIntro.module.css';

interface Props { onDone: () => void; }

const CherryBlossomIntro = ({ onDone }: Props) => {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const plantRef = useRef<HTMLImageElement>(null);
  const logoRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('cnc_intro', '1');
        onDone();
      },
    });

    // Entrata: pianta parte grande e ruotata, si assesta
    tl.fromTo(plantRef.current,
      { opacity: 0, scale: 1.18, y: 28, rotation: -6 },
      { opacity: 1, scale: 1,    y: 0,  rotation: -4, duration: 0.9, ease: 'power3.out' }
    )
    // Logo appare mentre la pianta si assesta
    .fromTo(logoRef.current,
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0,  duration: 0.65, ease: 'power2.out' },
      0.28
    )
    // Uscita: logo fluttua verso l'alto e scompare
    .to(logoRef.current,
      { opacity: 0, y: -12, duration: 0.38, ease: 'power2.in' },
      1.5
    )
    // Pianta si espande leggermente e svanisce
    .to(plantRef.current,
      { opacity: 0, scale: 1.06, duration: 0.55, ease: 'power2.in' },
      1.62
    )
    // Sicurezza: fade finale del wrapper
    .to(wrapRef.current,
      { opacity: 0, duration: 0.2 },
      2.0
    );

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={wrapRef} className={styles.intro}>
      <div className={styles.plantContainer}>
        <img
          ref={plantRef}
          src="/img/intro/into_pianta.svg"
          alt=""
          aria-hidden="true"
          className={styles.plant}
        />
      </div>
      <div ref={logoRef} className={styles.logoWrap}>
        <img src="/img/logo/logo.png" alt="CNC Beauty" className={styles.logo} />
      </div>
    </div>
  );
};

export default CherryBlossomIntro;
