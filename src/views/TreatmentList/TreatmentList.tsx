import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getTreatmentsByCategory } from '../../db/treatment/treatmentRepo';
import { getTreatmentCategoryById } from '../../db/treatmentCategory/treatmentCategoryRepo';
import type { TreatmentData } from '../../models/Treatment';
import FloatingNav from '../../components/FloatingNav/FloatingNav';
import SiteFooter from '../../components/SiteFooter/SiteFooter';
import WaFab from '../../components/WaFab/WaFab';
import styles from './TreatmentList.module.css';

const WA_URL = 'https://wa.me/393297094859?text=Ciao%21%20Vorrei%20prenotare%20una%20consulenza';

const fmt = (price: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);

const TreatmentList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [categoryTitle, setCategoryTitle] = useState('');
  const [treatments, setTreatments] = useState<TreatmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  useEffect(() => {
    if (!categoryId) return;
    document.title = `Trattamenti – CNC Beauty Sciacca (AG)`;
    Promise.all([
      getTreatmentCategoryById(categoryId),
      getTreatmentsByCategory(categoryId),
    ]).then(([cat, items]) => {
      if (cat) {
        setCategoryTitle(cat.title);
        document.title = `${cat.title} – CNC Beauty Sciacca (AG)`;
      }
      setTreatments(items);
    }).finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <>
      <FloatingNav />

      {/* Page Hero */}
      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <div className={styles.heroText}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <Link to="/trattamenti">Trattamenti</Link>
              <span>›</span>
              <span aria-current="page">{categoryTitle || '…'}</span>
            </nav>
            <h1>{categoryTitle || 'Trattamenti'}</h1>
            <p>Percorsi professionali a Sciacca, Agrigento. Ogni trattamento nasce da una consulenza personalizzata con Carla Ciancimino.</p>
            {!loading && (
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statN}>{treatments.length}</span>
                  <span className={styles.statL}>Trattamenti</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statN}>✓</span>
                  <span className={styles.statL}>Certificati</span>
                </div>
              </div>
            )}
          </div>
          <div className={styles.heroImgWrap} aria-hidden="true">
            <div className={styles.heroImgBlob} />
            <div className={styles.heroImg}>
              <span>foto trattamento<br />{categoryTitle}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className={styles.pageBody}>
        {/* Main list */}
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="cnc-tag">I nostri trattamenti</span>
            <h2 className={styles.sectionHeading}>{categoryTitle}</h2>
            <p className={styles.sectionSub}>Scegli il trattamento più adatto a te, oppure prenota una consulenza gratuita per costruire insieme il tuo percorso.</p>
          </motion.div>

          {loading && (
            <div className={styles.loadingGrid}>
              {[1, 2, 3].map(n => <div key={n} className={styles.skeleton} />)}
            </div>
          )}

          <div className={styles.list}>
            {treatments.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.07 }}
              >
                <Link
                  to={`/trattamenti/${categoryId}/${t.id}`}
                  className={styles.card}
                >
                  <div className={styles.cardImg} style={{ background: t.color || 'linear-gradient(145deg,#D4A0B0,#C08898)' }}>
                    {t.imgUrls?.[0]
                      ? <img src={t.imgUrls[0]} alt={t.title} />
                      : null
                    }
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTop}>
                      {t.tag?.map(tag => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                    <h3 className={styles.cardTitle}>{t.title}</h3>
                    {t.subtitle && <p className={styles.cardSub}>{t.subtitle}</p>}
                    <div className={styles.cardMeta}>
                      {typeof t.duration === 'number' && (
                        <span className={styles.metaItem}>
                          <span className="material-symbols-outlined">schedule</span>
                          {t.duration} min
                        </span>
                      )}
                      {typeof t.price === 'number' && (
                        <span className={styles.metaItem}>
                          <span className="material-symbols-outlined">euro</span>
                          {fmt(t.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardArrow}>→</div>
                </Link>
              </motion.div>
            ))}
            {!loading && treatments.length === 0 && (
              <p className={styles.empty}>Nessun trattamento disponibile in questa categoria.</p>
            )}
          </div>
        </div>

        {/* Sticky sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3>Prenota ora</h3>
            <p>Scegli un trattamento e prenota direttamente via WhatsApp o telefono.</p>
            <a href={WA_URL} className={styles.sideWa} target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.129.557 4.126 1.528 5.858L.057 23.856a.5.5 0 00.608.608l6.068-1.479A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.88a9.859 9.859 0 01-5.027-1.374l-.36-.213-3.732.909.934-3.64-.235-.374A9.86 9.86 0 012.12 12C2.12 6.533 6.533 2.12 12 2.12s9.88 4.413 9.88 9.88c0 5.467-4.413 9.88-9.88 9.88z"/>
              </svg>
              WhatsApp
            </a>
            <a href="tel:+393297094859" className={styles.sideCall}>
              📞 Chiama
            </a>
          </div>

          <div className={styles.sideCard}>
            <h3>Categorie correlate</h3>
            <ul className={styles.sideLinks}>
              <li><Link to="/trattamenti/viso">Trattamenti Viso</Link></li>
              <li><Link to="/trattamenti/corpo">Trattamenti Corpo</Link></li>
              <li><Link to="/trattamenti/epilazione">Epilazione</Link></li>
              <li><Link to="/trattamenti/massaggi">Massaggi</Link></li>
            </ul>
          </div>

          <div className={styles.sideFirstTime}>
            <span className={styles.sideFirstTag}>Prima volta?</span>
            <p>Prenota una consulenza gratuita con Carla per costruire il percorso su misura per te.</p>
            <a href={WA_URL} className={styles.sideFirstCta} target="_blank" rel="noopener">
              Prenota consulenza →
            </a>
          </div>
        </aside>
      </div>

      <SiteFooter />
      <WaFab />
    </>
  );
};

export default TreatmentList;
