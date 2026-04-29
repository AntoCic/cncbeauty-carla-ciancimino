import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import styles from './HeroSection.module.css';

interface Petal {
  x: number; y: number; sz: number;
  vx: number; vy: number; rot: number; vr: number;
  op: number; sw: number; swS: number; hue: number;
}

interface Props { animate?: boolean; }

const HeroSection = ({ animate = true }: Props) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number | null>(null);
  const contentRef  = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const animatedRef = useRef(false);

  /* ── canvas petals ─────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;
    const N = Math.min(22, Math.floor(window.innerWidth / 60));
    const petals: Petal[] = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const spawn = (randomY: boolean): Petal => ({
      x: Math.random() * W,
      y: randomY ? Math.random() * H : -20,
      sz: 6 + Math.random() * 10,
      vx: (Math.random() - .5) * .5,
      vy: .35 + Math.random() * .55,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - .5) * .022,
      op: .22 + Math.random() * .32,
      sw: Math.random() * Math.PI * 2,
      swS: .008 + Math.random() * .009,
      hue: 336 + Math.random() * 20,
    });

    for (let i = 0; i < N; i++) petals.push(spawn(true));

    const draw = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.op;
      ctx.beginPath();
      ctx.moveTo(0, -p.sz);
      ctx.bezierCurveTo( p.sz * .5, -p.sz * .65, p.sz * .65, p.sz * .2, 0, p.sz);
      ctx.bezierCurveTo(-p.sz * .65, p.sz * .2, -p.sz * .5, -p.sz * .65, 0, -p.sz);
      ctx.fillStyle = `hsl(${p.hue},56%,88%)`;
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      petals.forEach(p => {
        p.sw += p.swS;
        p.x  += p.vx + Math.sin(p.sw) * .3;
        p.y  += p.vy;
        p.rot += p.vr;
        if (p.y > H + 20) Object.assign(p, spawn(false));
        draw(p);
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (!rafRef.current) loop(); }
      else { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } }
    });
    io.observe(canvas.closest('section')!);

    return () => {
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      io.disconnect();
    };
  }, []);

  /* ── GSAP entrance — fires when animate becomes true ────── */
  useEffect(() => {
    if (!animate || animatedRef.current) return;
    if (!contentRef.current || !scrollRef.current) return;
    animatedRef.current = true;

    const el   = contentRef.current;
    const h1   = el.querySelector('h1');
    const p    = el.querySelector('p');
    const btns = el.querySelectorAll('a');
    const hint = scrollRef.current;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(h1,   { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 0.9 })
      .fromTo(p,    { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.8  }, '-=0.52')
      .fromTo(Array.from(btns), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.1 }, '-=0.48')
      .fromTo(hint, { opacity: 0 },         { opacity: 1, duration: 0.55 }, '-=0.2');

    return () => { gsap.killTweensOf([h1, p, ...Array.from(btns), hint]); };
  }, [animate]);

  return (
    <section id="hero" className={styles.hero} aria-label="Benvenuto in CNC Beauty">
      <div className={styles.heroBg} role="img" aria-label="CNC Beauty centro estetico Sciacca" />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.petals} aria-hidden="true" />
      <div ref={contentRef} className={styles.content}>
        <h1>Il tuo momento di bellezza a Sciacca,<br /><em>pensato su misura per te.</em></h1>
        <p>Trattamenti professionali, prodotti selezionati e tecnologie certificate<br className="d-none d-md-inline" />nel cuore della Sicilia, ad Agrigento.</p>
        <div className={styles.btns}>
          <Link to="/trattamenti" className={styles.btnW}>Scopri i trattamenti</Link>
          <Link to="/prodotti" className={styles.btnGhost}>Scopri i prodotti</Link>
        </div>
      </div>
      <div ref={scrollRef} className={styles.scrollHint} aria-hidden="true">scorri</div>
    </section>
  );
};

export default HeroSection;
