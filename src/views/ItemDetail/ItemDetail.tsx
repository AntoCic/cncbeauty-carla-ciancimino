import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTreatmentBySlug } from '../../db/treatment/treatmentRepo';
import { getProductBySlug } from '../../db/product/productRepo';
import { getTreatmentCategoryBySlug } from '../../db/treatmentCategory/treatmentCategoryRepo';
import type { TreatmentData } from '../../models/Treatment';
import type { ProductData } from '../../models/Product';
import { useAppSelector } from '../../store';
import FloatingNav from '../../components/FloatingNav/FloatingNav';
import SiteFooter from '../../components/SiteFooter/SiteFooter';
import WaFab from '../../components/WaFab/WaFab';
import styles from './ItemDetail.module.css';

interface Props {
  type: 'treatment' | 'product';
}

const fmt = (price: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);

const ItemDetail = ({ type }: Props) => {
  const { categorySlug, slug } = useParams<{ categorySlug: string; slug: string }>();
  const cfg = useAppSelector(s => s.appConfig.data);
  const [item, setItem] = useState<TreatmentData | ProductData | null>(null);
  const [heroImg, setHeroImg] = useState('');
  const [allImgs, setAllImgs] = useState<string[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const backTo = type === 'treatment' ? `/trattamenti/${categorySlug}` : `/prodotti/${categorySlug}`;
  const backLabel = type === 'treatment' ? '← Trattamenti' : '← Prodotti';

  const WA_URL = `https://wa.me/${cfg.publicPhone.replace(/\D/g, '')}?text=Ciao%21%20Vorrei%20prenotare%20una%20consulenza`;

  useEffect(() => {
    if (!slug) return;

    if (type === 'treatment') {
      Promise.all([
        getTreatmentBySlug(slug),
        categorySlug ? getTreatmentCategoryBySlug(categorySlug) : Promise.resolve(null),
      ]).then(([data, cat]) => {
        if (!data) { setNotFound(true); return; }
        setItem(data);
        const catImg = cat?.imgUrls?.[0] ?? '';
        setHeroImg(catImg);
        setAllImgs(catImg ? [catImg] : []);
        document.title = `${data.title} – CNC Beauty Sciacca`;
      }).finally(() => setLoading(false));
    } else {
      getProductBySlug(slug).then(data => {
        if (!data) { setNotFound(true); return; }
        setItem(data);
        const imgs = (data as ProductData).imgUrls ?? [];
        setAllImgs(imgs);
        setHeroImg(imgs[0] ?? '');
        document.title = `${data.title} – CNC Beauty Sciacca`;
      }).finally(() => setLoading(false));
    }
  }, [slug, type, categorySlug]);

  if (loading) return (
    <>
      <FloatingNav />
      <div className={styles.loadingWrap}>
        <div className={styles.loadingHero} />
        <div className={styles.loadingContent}>
          <div className={styles.loadingLine} style={{ width: '60%', height: 36 }} />
          <div className={styles.loadingLine} style={{ width: '40%', height: 20 }} />
          <div className={styles.loadingLine} style={{ width: '100%', height: 80 }} />
        </div>
      </div>
      <WaFab />
    </>
  );

  if (notFound || !item) return (
    <>
      <FloatingNav />
      <div className={styles.notFound}>
        <Link to={backTo} className={styles.back}>{backLabel}</Link>
        <p>Elemento non trovato.</p>
      </div>
      <WaFab />
    </>
  );

  const isTreatment = type === 'treatment';
  const t = isTreatment ? item as TreatmentData : null;
  const p = !isTreatment ? item as ProductData : null;

  return (
    <>
      <FloatingNav />

      <div className={styles.pageHero}>
        {heroImg && (
          <div
            className={styles.pageHeroBg}
            style={{ backgroundImage: `url(${heroImg})` }}
          />
        )}
        <div className={styles.pageHeroOv} />
        <div className={styles.pageHeroInner}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <Link to={type === 'treatment' ? '/trattamenti' : '/prodotti'}>
              {type === 'treatment' ? 'Trattamenti' : 'Prodotti'}
            </Link>
            <span>›</span>
            <Link to={backTo}>{categorySlug}</Link>
            <span>›</span>
            <span aria-current="page">{item.title}</span>
          </nav>
          <h1>{item.title}</h1>
          {item.subtitle && <p className={styles.heroSub}>{item.subtitle}</p>}
          <div className={styles.heroBadges}>
            {typeof item.price === 'number' && (
              <span className={styles.badgePrice}>{fmt(item.price)}</span>
            )}
            {t?.duration && (
              <span className={styles.badgeDur}>
                <span className="material-symbols-outlined">schedule</span>
                {t.duration} min
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.pageBody}>
        <main className={styles.main}>
          {/* Product image gallery */}
          {type === 'product' && allImgs.length > 0 && (
            <motion.div
              className={styles.gallery}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div
                className={styles.galleryMain}
                style={{ backgroundImage: `url(${allImgs[activeImg]})` }}
              />
              {allImgs.length > 1 && (
                <div className={styles.galleryThumbs}>
                  {allImgs.map((img, i) => (
                    <button
                      key={i}
                      className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ''}`}
                      onClick={() => setActiveImg(i)}
                      aria-label={`Immagine ${i + 1}`}
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Description */}
          {item.description && (
            <motion.section
              className={styles.section}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2>Descrizione</h2>
              <p>{item.description}</p>
            </motion.section>
          )}

          {item.tipiDiPelle && (
            <motion.section
              className={styles.section}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2>Tipi di pelle</h2>
              <p>{item.tipiDiPelle}</p>
            </motion.section>
          )}

          {p?.ingredienti && (
            <motion.section
              className={styles.section}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2>Ingredienti</h2>
              <p>{p.ingredienti}</p>
            </motion.section>
          )}

          {p?.consigliUso && (
            <motion.section
              className={styles.section}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h2>Consigli d'uso</h2>
              <p>{p.consigliUso}</p>
            </motion.section>
          )}
        </main>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3>Prenota ora</h3>
            <p>Prenota una consulenza con Carla a Sciacca o chiedici direttamente informazioni.</p>
            <a href={WA_URL} className={styles.sideWa} target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.129.557 4.126 1.528 5.858L.057 23.856a.5.5 0 00.608.608l6.068-1.479A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.88a9.859 9.859 0 01-5.027-1.374l-.36-.213-3.732.909.934-3.64-.235-.374A9.86 9.86 0 012.12 12C2.12 6.533 6.533 2.12 12 2.12s9.88 4.413 9.88 9.88c0 5.467-4.413 9.88-9.88 9.88z"/>
              </svg>
              WhatsApp
            </a>
            <a href={`tel:${cfg.publicPhone}`} className={styles.sideCall}>
              📞 Chiama
            </a>
          </div>

          <div className={styles.sideBack}>
            <Link to={backTo} className={styles.backLink}>{backLabel}</Link>
          </div>
        </aside>
      </div>

      <SiteFooter />
      <WaFab />
    </>
  );
};

export default ItemDetail;
