import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';

interface Petal {
  x: number; y: number; sz: number;
  vx: number; vy: number; rot: number; vr: number;
  op: number; sw: number; swS: number; hue: number;
}

const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;
    const N = Math.min(20, Math.floor(window.innerWidth / 60));
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
      op: .25 + Math.random() * .35,
      sw: Math.random() * Math.PI * 2,
      swS: .008 + Math.random() * .009,
      hue: 338 + Math.random() * 18,
    });

    for (let i = 0; i < N; i++) petals.push(spawn(true));

    const draw = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.op;
      ctx.beginPath();
      ctx.moveTo(0, -p.sz);
      ctx.bezierCurveTo(p.sz * .5, -p.sz * .65, p.sz * .65, p.sz * .2, 0, p.sz);
      ctx.bezierCurveTo(-p.sz * .65, p.sz * .2, -p.sz * .5, -p.sz * .65, 0, -p.sz);
      ctx.fillStyle = `hsl(${p.hue},58%,87%)`;
      ctx.fill();
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      petals.forEach(p => {
        p.sw += p.swS;
        p.x += p.vx + Math.sin(p.sw) * .28;
        p.y += p.vy;
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

  return (
    <section id="hero" className={styles.hero} aria-label="Benvenuto in CNC Beauty">
      <div className={styles.heroBg} role="img" aria-label="CNC Beauty centro estetico Sciacca" />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.petals} aria-hidden="true" />
      <div className={styles.content}>
        <h1>Il tuo momento di bellezza a Sciacca,<br /><em>pensato su misura per te.</em></h1>
        <p>Trattamenti professionali, prodotti selezionati e tecnologie certificate<br className="d-none d-md-inline" />nel cuore della Sicilia, ad Agrigento.</p>
        <div className={styles.btns}>
          <Link to="/trattamenti" className={styles.btnW}>Scopri i trattamenti</Link>
          <Link to="/prodotti" className={styles.btnGhost}>Scopri i prodotti</Link>
        </div>
      </div>
      <div className={styles.scrollHint} aria-hidden="true">scorri</div>
    </section>
  );
};

export default HeroSection;
