import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './WhyUs.module.css';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  { ico: '◇', title: 'Consulenza personalizzata', text: 'Ogni percorso parte dall\'ascolto delle tue esigenze. Nessun protocollo standard.' },
  { ico: '✦', title: 'Trattamenti mirati',         text: 'Soluzioni specifiche per viso, corpo e benessere estetico, pensate per i tuoi obiettivi.' },
  { ico: '❀', title: 'Tecnologie selezionate',     text: 'Macchinari certificati e conformi agli standard europei per risultati sicuri e visibili.' },
  { ico: '○', title: 'Ambiente curato',            text: 'Uno spazio accogliente a Sciacca dove prenderti il tempo che meriti.' },
];

const WhyUs = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headRef    = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Heading reveal
    gsap.fromTo(headRef.current,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: headRef.current, start: 'top 86%' },
      }
    );

    // Cards staggered from bottom
    gsap.fromTo(cardRefs.current,
      { opacity: 0, y: 48, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 0.75, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: gridRef.current, start: 'top 84%' },
      }
    );

    return () => { ScrollTrigger.getAll().filter(t => t.vars.trigger === headRef.current || t.vars.trigger === gridRef.current).forEach(t => t.kill()); };
  }, []);

  // 3D magnetic tilt on mouse move
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / rect.height) * 11;
    const ry   = ((e.clientX - cx) / rect.width)  * -11;
    gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.28, ease: 'power2.out', transformPerspective: 800 });
  };
  const onMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  };

  return (
    <section id="why" className={styles.why} aria-labelledby="why-h" ref={sectionRef}>
      <div className={styles.wrap}>
        <div className={styles.head} ref={headRef}>
          <span className="cnc-tag">La nostra promessa</span>
          <h2 id="why-h">Perché scegliere CNC Beauty</h2>
          <p>A Sciacca, un centro estetico che mette la persona al centro.</p>
        </div>
        <div className={styles.grid} ref={gridRef}>
          {CARDS.map((c, i) => (
            <div
              key={c.title}
              className={styles.card}
              ref={el => { cardRefs.current[i] = el; }}
              onMouseMove={onMouseMove}
              onMouseLeave={onMouseLeave}
            >
              <div className={styles.ico} aria-hidden="true">{c.ico}</div>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
