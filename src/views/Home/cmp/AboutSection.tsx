import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './AboutSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imgColRef  = useRef<HTMLDivElement>(null);
  const photoRef   = useRef<HTMLDivElement>(null);
  const blobRef    = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const section = sectionRef.current;
    if (!section) return;

    // Photo column: slide from left + parallax float
    gsap.fromTo(imgColRef.current,
      { opacity: 0, x: -60 },
      {
        opacity: 1, x: 0, duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      }
    );

    // Subtle parallax on the photo itself while scrolling
    gsap.to(photoRef.current, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    // Blob rotates slowly on scroll
    gsap.to(blobRef.current, {
      rotate: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    // Text column: slide from right
    gsap.fromTo(textRef.current,
      { opacity: 0, x: 50 },
      {
        opacity: 1, x: 0, duration: 0.95, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      }
    );

    // Stagger individual text children
    const children = Array.from(textRef.current?.children ?? []);
    gsap.fromTo(children,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.11, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 78%' },
      }
    );

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.vars.trigger === section || t.vars.trigger === photoRef.current || t.vars.trigger === blobRef.current)
        .forEach(t => t.kill());
    };
  }, []);

  return (
    <section id="about" className={styles.about} aria-labelledby="about-h" ref={sectionRef}>
      <div className={styles.inner}>
        <div className={styles.imgCol} ref={imgColRef}>
          <div className={styles.blob} ref={blobRef} aria-hidden="true" />
          <div className={styles.photo} ref={photoRef} />
        </div>

        <div className={styles.text} ref={textRef}>
          <span className="cnc-tag">La nostra storia</span>
          <h2 id="about-h">Conosci Carla</h2>
          <p>Con oltre vent'anni di esperienza nel mondo dell'estetica professionale, Carla Ciancimino ha fondato CNC Beauty con un obiettivo chiaro: portare a Sciacca, in provincia di Agrigento, un centro dove ogni trattamento nasce dall'ascolto.</p>
          <p>Formata tra i migliori istituti in Italia, Carla unisce tecnica raffinata e attenzione reale per ogni cliente. La cura che mette nel suo lavoro si sente fin dal primo appuntamento.</p>
          <a href="/chi-siamo" className={styles.btnOutline}>La nostra storia →</a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
