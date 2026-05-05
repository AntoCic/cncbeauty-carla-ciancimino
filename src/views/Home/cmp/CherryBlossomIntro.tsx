import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CherryBlossomIntro.module.css';

interface Petal {
  x: number; y: number; sz: number;
  vx: number; vy: number; rot: number; vr: number;
  op: number; sw: number; swS: number; hue: number;
}

interface Props { onDone: () => void; }

const CherryBlossomIntro = ({ onDone }: Props) => {
  const wrapRef     = useRef<HTMLDivElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const plantRef    = useRef<HTMLImageElement>(null);
  const logoPillRef = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone();
      return;
    }

    // ── petali ────────────────────────────────────────────────
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext('2d')!;
    let W = 0, H = 0;
    const N = Math.min(28, Math.floor(window.innerWidth / 48));
    const petals: Petal[] = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const spawn = (randomY: boolean): Petal => ({
      x:   Math.random() * W,
      y:   randomY ? Math.random() * H : -20,
      sz:  6 + Math.random() * 10,
      vx:  (Math.random() - .5) * .5,
      vy:  .35 + Math.random() * .55,
      rot: Math.random() * Math.PI * 2,
      vr:  (Math.random() - .5) * .022,
      op:  .22 + Math.random() * .32,
      sw:  Math.random() * Math.PI * 2,
      swS: .008 + Math.random() * .009,
      hue: 336 + Math.random() * 20,
    });

    for (let i = 0; i < N; i++) petals.push(spawn(true));

    const drawPetal = (p: Petal) => {
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
        p.sw  += p.swS;
        p.x   += p.vx + Math.sin(p.sw) * .3;
        p.y   += p.vy;
        p.rot += p.vr;
        if (p.y > H + 20) Object.assign(p, spawn(false));
        drawPetal(p);
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();

    // ── GSAP ──────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem('cnc_intro', '1');
        onDone();
      },
    });

    // Pianta: sfuma rapidamente da 0.5 a 1
    tl.fromTo(plantRef.current,
      { opacity: 0.5 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );

    // Logo pill appare
    tl.fromTo(logoPillRef.current,
      { opacity: 0, scale: 0.93, y: 8 },
      { opacity: 1, scale: 1.0,  y: 0, duration: 0.5, ease: 'power2.out' },
      0.4
    )
    // Uscita
    .addLabel('exit', 1.75)
    // Logo: esplode dal centro riempiendo tutto lo schermo e schiarendosi → svanisce
    .to(logoPillRef.current,
      { opacity: 0, scale: 18, filter: 'brightness(6)', duration: 0.7, ease: 'power1.in' },
      'exit'
    )
    // Pianta: esce verso basso-destra
    .to(plantRef.current,
      { opacity: 0, scale: 0.78, xPercent: 65, yPercent: 65, duration: 0.7, ease: 'power2.in' },
      'exit+=0.08'
    )
    .to(wrapRef.current,
      { opacity: 0, duration: 0.18 },
      'exit+=0.65'
    );

    return () => {
      tl.kill();
      window.removeEventListener('resize', resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.intro}>
      <canvas ref={canvasRef} className={styles.petals} aria-hidden="true" />
      <div className={styles.plantContainer}>
        <img
          ref={plantRef}
          src="/img/intro/into_pianta.svg"
          alt=""
          aria-hidden="true"
          className={styles.plant}
        />
      </div>
      <div className={styles.logoWrap}>
        <div ref={logoPillRef} className={styles.logoPill}>
          <img src="/img/logo/logo.png" alt="CNC Beauty" className={styles.logo} />
        </div>
      </div>
    </div>
  );
};

export default CherryBlossomIntro;
