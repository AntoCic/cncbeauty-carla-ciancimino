import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CherryBlossomIntro.module.css';

interface Props { onDone: () => void; }

const CherryBlossomIntro = ({ onDone }: Props) => {
  const wrapRef = useRef<HTMLDivElement>(null);

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

    tl.to(wrapRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut', delay: 1.2 });

    return () => { tl.kill(); };
  }, []);

  return (
    <div ref={wrapRef} className={styles.intro}>
      <img src="/img/logo/logo.png" alt="CNC Beauty" className={styles.logo} />
    </div>
  );
};

export default CherryBlossomIntro;
