import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './CherryBlossomIntro.module.css';

interface Props { onDone: () => void; }

interface P3D {
  x: number; y: number; z: number;
  vx: number; vy: number;
  rot: number; vr: number;
  tilt: number; vtilt: number;
  hue: number; sat: number; lit: number;
  size: number; op: number;
}

const FOCAL   = 580;
const Z_NEAR  = 45;
const Z_FAR   = 2000;
const N       = 180;
const SPREAD  = 1100;

const CherryBlossomIntro = ({ onDone }: Props) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const logoRef     = useRef<HTMLDivElement>(null);
  const tagRef      = useRef<HTMLParagraphElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const dismissedRef = useRef(false);

  const dismiss = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    sessionStorage.setItem('cnc_intro', '1');
    gsap.to(wrapRef.current, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete: () => onDone(),
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const logo   = logoRef.current;
    const tag    = tagRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !logo || !tag || !wrap) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dismiss();
      return;
    }

    const ctx = canvas.getContext('2d')!;
    let W = 0, H = 0;
    let rafId = 0;
    const start = performance.now();
    let speed = 2.5;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const mkPetal = (z?: number): P3D => {
      const h = 328 + Math.random() * 32;
      return {
        x: (Math.random() - 0.5) * SPREAD * 2,
        y: (Math.random() - 0.5) * SPREAD * 1.4,
        z: z ?? Z_NEAR + Math.random() * (Z_FAR - Z_NEAR),
        vx: (Math.random() - 0.5) * 0.55,
        vy: 0.12 + Math.random() * 0.22,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.028,
        tilt: Math.random() * Math.PI,
        vtilt: (Math.random() - 0.5) * 0.009,
        hue: h,
        sat: 55 + Math.random() * 18,
        lit: 82 + Math.random() * 10,
        size: 7 + Math.random() * 13,
        op: 0.28 + Math.random() * 0.52,
      };
    };

    const petals: P3D[] = Array.from({ length: N }, () => mkPetal());

    const drawSakura = (p: P3D, ss: number, alpha: number) => {
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      const tiltFactor = 0.55 + 0.45 * Math.abs(Math.cos(p.tilt));

      for (let i = 0; i < 5; i++) {
        const a  = p.rot + (i * Math.PI * 2) / 5;
        const tx = Math.cos(a) * ss * 1.05;
        const ty = Math.sin(a) * ss * 1.05 * tiltFactor;
        const lx = Math.cos(a + 0.65) * ss * 0.62;
        const ly = Math.sin(a + 0.65) * ss * 0.62 * tiltFactor;
        const rx = Math.cos(a - 0.65) * ss * 0.62;
        const ry = Math.sin(a - 0.65) * ss * 0.62 * tiltFactor;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(lx, ly, tx * 1.18, ty * 1.18, tx, ty);
        ctx.bezierCurveTo(tx * 0.82, ty * 0.82, rx, ry, 0, 0);
        ctx.fillStyle = `hsl(${p.hue},${p.sat}%,${p.lit}%)`;
        ctx.fill();
      }
      // Stamen dot
      ctx.beginPath();
      ctx.arc(0, 0, ss * 0.22, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue + 12},${p.sat + 8}%,${p.lit - 14}%)`;
      ctx.fill();

      ctx.globalAlpha = 1;
    };

    // GSAP logo + tagline entrance
    gsap.set([logo, tag], { opacity: 0 });
    const tl = gsap.timeline();
    tl.to(logo, { opacity: 1, scale: 1, y: 0, duration: 1.1, delay: 0.5, ease: 'power3.out',
        from: { scale: 0.8, y: 20 } })
      .to(tag,  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.45');

    gsap.fromTo(logo, { scale: 0.8, y: 20 }, { scale: 1, y: 0, opacity: 1, duration: 1.1, delay: 0.5, ease: 'power3.out' });
    gsap.fromTo(tag,  { y: 14 },             { y: 0,   opacity: 1, duration: 0.8, delay: 0.95, ease: 'power2.out' });

    const loop = (ts: number) => {
      const elapsed = (ts - start) / 1000;

      // Speed curve: slow → rush → coast
      if      (elapsed < 0.45) speed = 2.5;
      else if (elapsed < 2.1)  speed = 2.5 + ((elapsed - 0.45) / 1.65) * 24;   // → 26.5
      else if (elapsed < 2.9)  speed = 26.5 - ((elapsed - 2.1) / 0.8)  * 24;   // → 2.5
      else                     speed = 2.5;

      if (elapsed >= 3.4) { dismiss(); return; }

      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;

      // Sort far-to-near (painter's algorithm)
      petals.sort((a, b) => b.z - a.z);

      petals.forEach(p => {
        p.x   += p.vx;
        p.y   += p.vy * 0.28;
        p.z   -= speed;
        p.rot  += p.vr;
        p.tilt += p.vtilt;

        // Gentle centripetal swirl
        const dx = p.x, dy = p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const sw = 0.0009;
        p.x += (-dy / dist) * sw * dist;
        p.y += ( dx / dist) * sw * dist;

        if (p.z <= Z_NEAR) {
          Object.assign(p, mkPetal(Z_FAR - Math.random() * 300));
          return;
        }

        const sc  = FOCAL / p.z;
        const sx  = cx + p.x * sc;
        const sy  = cy + p.y * sc;
        const ss  = p.size * sc;

        if (ss < 0.35) return;
        if (sx < -ss * 3 || sx > W + ss * 3) return;
        if (sy < -ss * 3 || sy > H + ss * 3) return;

        const proxFade = Math.min(1, (p.z - Z_NEAR) / 140);
        const distFade = Math.min(1, (Z_FAR * 0.88 - p.z) / (Z_FAR * 0.22));
        const rushFade = speed > 14 ? Math.max(0.15, 1 - (speed - 14) / 18) : 1;
        const alpha    = p.op * proxFade * Math.max(0, distFade) * rushFade;

        if (alpha < 0.015) return;

        ctx.save();
        ctx.translate(sx, sy);

        // Radial streak when rushing hard
        if (speed > 9) {
          const ang     = Math.atan2(sy - cy, sx - cx);
          const stretch = Math.min(3.8, 1 + (speed - 9) / 9);
          ctx.rotate(ang);
          ctx.scale(stretch, 1 / stretch * 0.75 + 0.25);
          ctx.rotate(-ang);
        }

        drawSakura(p, ss, alpha);
        ctx.restore();
      });

      // Soft vignette
      const vig = ctx.createRadialGradient(cx, cy, W * 0.18, cx, cy, W * 0.82);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(61,31,45,.16)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
      gsap.killTweensOf([logo, tag, wrap]);
    };
  }, []);

  return (
    <div ref={wrapRef} className={styles.intro} role="dialog" aria-label="Benvenuto in CNC Beauty">
      {/* Background */}
      <div className={styles.bg} aria-hidden="true" />

      {/* 3D canvas */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Centred logo + tagline */}
      <div className={styles.logoWrap}>
        <div ref={logoRef} className={styles.logoImg}>
          <img src="/img/logo/logo.png" alt="CNC Beauty" />
        </div>
        <p ref={tagRef} className={styles.tagline}>
          Centro Estetico · Sciacca, Agrigento
        </p>
      </div>

      {/* Skip */}
      <button
        className={styles.skip}
        onClick={() => {
          sessionStorage.setItem('cnc_intro', '1');
          gsap.to(wrapRef.current, { opacity: 0, duration: 0.4, onComplete: () => onDone() });
        }}
        aria-label="Salta introduzione"
      >
        esc · salta
      </button>
    </div>
  );
};

export default CherryBlossomIntro;
