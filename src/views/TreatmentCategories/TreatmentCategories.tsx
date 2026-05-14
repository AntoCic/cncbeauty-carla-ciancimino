import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getTreatmentCategories } from '../../db/treatmentCategory/treatmentCategoryRepo';
import FloatingNav from '../../components/FloatingNav/FloatingNav';
import SiteFooter from '../../components/SiteFooter/SiteFooter';
import WaFab from '../../components/WaFab/WaFab';
import styles from './TreatmentCategories.module.css';

const BG_PALETTE = [
  'linear-gradient(145deg,#D4A0B0,#C08898,#B07888)',
  'linear-gradient(145deg,#C8A888,#B89878,#A88868)',
  'linear-gradient(145deg,#B8A0C8,#A890B8,#9880A8)',
  'linear-gradient(145deg,#A0B8C0,#90A8B0,#8098A8)',
  'linear-gradient(145deg,#C8B090,#B8A080,#A89070)',
  'linear-gradient(145deg,#C490A0,#B48090,#A47080)',
];

type CatItem = { id: string; slug: string; title: string; subtitle: string; imgUrl: string; emoji: string; bg: string; num: string };

const WA_URL = 'https://wa.me/393297094859?text=Ciao%21+Vorrei+prenotare+una+consulenza+gratuita';

const TreatmentCategories = () => {
  const [cats, setCats] = useState<CatItem[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  useEffect(() => {
    document.title = 'Trattamenti – CNC Beauty Sciacca (AG)';
    getTreatmentCategories()
      .then(data => setCats(data.map((c, i) => ({
        id: c.id,
        slug: c.slug ?? c.id,
        title: c.title,
        subtitle: c.subtitle ?? '',
        imgUrl: c.imgUrls?.[0] ?? '',
        emoji: c.emoji ?? '',
        bg: BG_PALETTE[i % BG_PALETTE.length],
        num: String(i + 1).padStart(2, '0'),
      }))))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <FloatingNav />

      <div className={styles.pageHero}>
        <div className={styles.pageHeroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span aria-current="page">Trattamenti</span>
          </nav>
          <h1>Trattamenti</h1>
          <p>Percorsi estetici professionali a Sciacca, Agrigento. Ogni trattamento nasce da una consulenza personalizzata con Carla.</p>
        </div>
      </div>

      <main className={styles.main}>
        <motion.div
          className={styles.intro}
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="cnc-tag">Cosa offriamo</span>
          <h2>Scegli la tua categoria</h2>
          <p>Dal trattamento viso alla cura del corpo, dall'epilazione al massaggio: ogni percorso in CNC Beauty è costruito sulle tue esigenze reali.</p>
        </motion.div>

        {loading ? (
          <div className={styles.gridLoading}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div className={styles.grid}>
            {cats.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <Link to={`/trattamenti/${cat.slug}`} className={styles.card}>
                  <div
                    className={styles.cardBg}
                    style={cat.imgUrl
                      ? { backgroundImage: `url(${cat.imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: cat.bg }
                    }
                  />
                  <div className={styles.cardOv} />
                  <div className={styles.cardNum}>{cat.emoji && <span>{cat.emoji}</span>}{cat.num}</div>
                  <div className={styles.cardBody}>
                    <h2>{cat.title}</h2>
                    <p>{cat.subtitle}</p>
                    <div className={styles.cardLink}>Vedi trattamenti →</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          className={styles.ctaBanner}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div>
            <h2>Non sai da dove iniziare?<br />Inizia con una consulenza gratuita.</h2>
            <p>Carla analizzerà la tua pelle e costruirà il percorso su misura per te, a Sciacca.</p>
          </div>
          <a href={WA_URL} className={styles.btnWa} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.129.557 4.126 1.528 5.858L.057 23.856a.5.5 0 00.608.608l6.068-1.479A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.88a9.859 9.859 0 01-5.027-1.374l-.36-.213-3.732.909.934-3.64-.235-.374A9.86 9.86 0 012.12 12C2.12 6.533 6.533 2.12 12 2.12s9.88 4.413 9.88 9.88c0 5.467-4.413 9.88-9.88 9.88z"/>
            </svg>
            Scrivici su WhatsApp
          </a>
        </motion.div>
      </main>

      <SiteFooter />
      <WaFab />
    </>
  );
};

export default TreatmentCategories;
