import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import styles from './SiteFooter.module.css';

const SiteFooter = () => {
  const cfg = useAppSelector(s => s.appConfig.data);

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.grid}>
        <div className={styles.brand}>
          <img src="/img/logo/logo.png" alt="CNC Beauty" height={48} />
          <p>Il centro estetico di {cfg.ownerName} a Sciacca, Agrigento. Trattamenti mirati, prodotti selezionati e tecnologie certificate in Sicilia.</p>
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
            <li><a href="/#faq">FAQ</a></li>
            <li><a href="/#contacts">Contatti</a></li>
            <li><a href="/#contacts">Prenota</a></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/cookie">Cookie Policy</Link></li>
            <li><Link to="/termini">Termini e Condizioni</Link></li>
          </ul>
        </div>
        <div className={styles.col}>
          <h4>Contatti</h4>
          <ul>
            <li><a href={`tel:${cfg.publicPhone}`}>{cfg.publicPhone}</a></li>
            <li><a href={`mailto:${cfg.privacyEmail}`}>{cfg.privacyEmail}</a></li>
            <li><span>{cfg.officeAddress}</span></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.bottomLeft}>
          <span>© 2026 {cfg.brandName}. Tutti i diritti riservati.</span>
          {cfg.vatOrTaxCode && <span>P.IVA {cfg.vatOrTaxCode}</span>}
        </div>
        <div className={styles.bottomRight}>
          <Link to="/privacy" className={styles.legalLink}>Privacy</Link>
          <Link to="/cookie" className={styles.legalLink}>Cookie</Link>
          <Link to="/termini" className={styles.legalLink}>Termini</Link>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
