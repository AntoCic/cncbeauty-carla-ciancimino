import { Link } from 'react-router-dom';
import styles from './SiteFooter.module.css';

const SiteFooter = () => (
  <footer className={styles.footer} role="contentinfo">
    <div className={styles.grid}>
      <div className={styles.brand}>
        <img src="/img/logo/logo.png" alt="CNC Beauty" height={48} />
        <p>Il centro estetico di Carla Ciancimino a Sciacca, Agrigento. Trattamenti mirati, prodotti selezionati e tecnologie certificate in Sicilia.</p>
      </div>
      <div className={styles.col}>
        <h4>Servizi</h4>
        <ul>
          <li><Link to="/trattamenti">Trattamenti viso</Link></li>
          <li><Link to="/trattamenti">Trattamenti corpo</Link></li>
          <li><Link to="/trattamenti">Tecnologie</Link></li>
          <li><Link to="/prodotti">Prodotti</Link></li>
        </ul>
      </div>
      <div className={styles.col}>
        <h4>Info</h4>
        <ul>
          <li><Link to="/chi-siamo">Chi siamo</Link></li>
          <li><a href="/#faq">FAQ</a></li>
          <li><a href="/#contacts">Contatti</a></li>
          <li><a href="/#contacts">Prenota</a></li>
        </ul>
      </div>
      <div className={styles.col}>
        <h4>Contatti</h4>
        <ul>
          <li><a href="tel:+393297094859">+39 329 709 4859</a></li>
          <li><a href="mailto:carla.ciancimino99@gmail.com">carla.ciancimino99@gmail.com</a></li>
          <li><span>Via Enrico de Nicola 16, Sciacca (AG)</span></li>
        </ul>
      </div>
    </div>
    <div className={styles.bottom}>
      <span>© 2025 CNC Beauty di Carla Ciancimino · P.IVA 03055730844 · Sciacca (AG), Sicilia</span>
      <div className={styles.social} aria-label="Social media CNC Beauty">
        <a href="#" aria-label="Instagram">IG</a>
        <a href="#" aria-label="Facebook">FB</a>
        <a href="#" aria-label="TikTok">TT</a>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
