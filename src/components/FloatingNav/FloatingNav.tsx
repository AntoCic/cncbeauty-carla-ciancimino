import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './FloatingNav.module.css';

const NAV_LINKS = [
  { label: 'Trattamenti', to: '/trattamenti' },
  { label: 'Prodotti', to: '/prodotti' },
  { label: 'Tecnologie', to: '/#tech' },
  { label: 'Contatti', to: '/#contacts' },
  { label: 'FAQ', to: '/#faq' },
];

const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setPillVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleNavClick = (to: string) => {
    setOpen(false);
    if (to.startsWith('/#')) {
      const id = to.slice(2);
      if (window.location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 400);
      }
    } else {
      window.scrollTo(0, 0);
      navigate(to);
    }
  };

  return (
    <>
      {/* Logo */}
      <Link to="/" id="nav-logo" className={styles.logo} aria-label="CNC Beauty">
        <img src="/img/logo/logo.png" alt="CNC Beauty" />
      </Link>

      {/* Prenota pill */}
      <button
        className={`${styles.prenotaPill} ${pillVisible ? styles.prenotaPillOn : ''}`}
        onClick={() => handleNavClick('/#contacts')}
      >
        Prenota
      </button>

      {/* Hamburger */}
      <button
        id="menu-btn"
        className={`${styles.menuBtn} ${open ? styles.menuBtnOpen : ''}`}
        aria-label={open ? 'Chiudi menu' : 'Apri menu'}
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
      >
        <span className={styles.ml} />
        <span className={styles.ml} />
        <span className={styles.ml} />
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <div className={styles.overlay} role="dialog" aria-label="Menu" aria-modal="true">
            {/* Backdrop */}
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              onClick={() => setOpen(false)}
            />
            {/* Panel */}
            <motion.nav
              className={styles.panel}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className={styles.npLogo}>
                <img src="/img/logo/logo.png" alt="CNC Beauty" />
              </div>

              <div className={styles.navLinks}>
                {NAV_LINKS.map((link, i) => (
                  <motion.button
                    key={link.to}
                    className={styles.navLink}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.18 + i * 0.05, duration: 0.4 }}
                    onClick={() => handleNavClick(link.to)}
                  >
                    {link.label}
                    <span className={styles.nlArr}>→</span>
                  </motion.button>
                ))}
              </div>

              <div className={styles.navFooter}>
                <button className={styles.navCta} onClick={() => handleNavClick('/#contacts')}>
                  Prenota consulenza →
                </button>
                <p className={styles.navInfo}>
                  <a href="tel:+393297094859">+39 329 709 4859</a><br />
                  Via Enrico de Nicola 16, Sciacca (AG)
                </p>
                <div className={styles.navSocial}>
                  <a href="#" aria-label="Instagram">IG</a>
                  <a href="#" aria-label="Facebook">FB</a>
                  <a href="#" aria-label="TikTok">TT</a>
                </div>
              </div>
            </motion.nav>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
