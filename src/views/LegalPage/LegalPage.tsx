import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import FloatingNav from '../../components/FloatingNav/FloatingNav';
import SiteFooter from '../../components/SiteFooter/SiteFooter';
import WaFab from '../../components/WaFab/WaFab';
import styles from './LegalPage.module.css';

interface Props {
  type: 'privacy' | 'cookie' | 'terms';
}

const META: Record<Props['type'], { title: string; heading: string; docTitle: string }> = {
  privacy: {
    title: 'Privacy Policy',
    heading: 'Privacy Policy',
    docTitle: 'Privacy Policy – CNC Beauty Sciacca',
  },
  cookie: {
    title: 'Cookie Policy',
    heading: 'Cookie Policy',
    docTitle: 'Cookie Policy – CNC Beauty Sciacca',
  },
  terms: {
    title: 'Termini e Condizioni',
    heading: 'Termini e Condizioni',
    docTitle: 'Termini e Condizioni – CNC Beauty Sciacca',
  },
};

const LegalPage = ({ type }: Props) => {
  const cfg = useAppSelector(s => s.appConfig.data);
  const meta = META[type];

  const bodyHtml =
    type === 'privacy' ? cfg.privacyPolicyBodyHtml
    : type === 'cookie' ? cfg.cookiePolicyBodyHtml
    : cfg.termsConditionsBodyHtml;

  useEffect(() => {
    document.title = meta.docTitle;
    window.scrollTo(0, 0);
  }, [meta.docTitle]);

  return (
    <>
      <FloatingNav />

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span aria-current="page">{meta.title}</span>
          </nav>
          <h1>{meta.heading}</h1>
          {cfg.legalLastUpdated && (
            <p className={styles.updated}>Ultimo aggiornamento: {cfg.legalLastUpdated}</p>
          )}
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className="material-symbols-outlined">business</span>
            <span>{cfg.legalEntity}</span>
          </div>
          {cfg.vatOrTaxCode && (
            <div className={styles.metaItem}>
              <span className="material-symbols-outlined">badge</span>
              <span>P.IVA {cfg.vatOrTaxCode}</span>
            </div>
          )}
          {cfg.officeAddress && (
            <div className={styles.metaItem}>
              <span className="material-symbols-outlined">location_on</span>
              <span>{cfg.officeAddress}</span>
            </div>
          )}
          {cfg.privacyEmail && (
            <div className={styles.metaItem}>
              <span className="material-symbols-outlined">mail</span>
              <a href={`mailto:${cfg.privacyEmail}`}>{cfg.privacyEmail}</a>
            </div>
          )}
        </div>

        {bodyHtml ? (
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        ) : (
          <p className={styles.empty}>Contenuto in aggiornamento.</p>
        )}
      </main>

      <SiteFooter />
      <WaFab />
    </>
  );
};

export default LegalPage;
