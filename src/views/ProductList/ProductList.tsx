import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getProductsByCategory } from '../../db/product/productRepo';
import { getProductCategoryById } from '../../db/productCategory/productCategoryRepo';
import type { ProductData } from '../../models/Product';
import type { ProductCategoryData } from '../../models/ProductCategory';
import FloatingNav from '../../components/FloatingNav/FloatingNav';
import SiteFooter from '../../components/SiteFooter/SiteFooter';
import WaFab from '../../components/WaFab/WaFab';
import { useAppSelector } from '../../store';
import styles from './ProductList.module.css';

const fmt = (price: number) =>
  new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);

const ProductList = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const cfg = useAppSelector(s => s.appConfig.data);
  const [category, setCategory] = useState<ProductCategoryData | null>(null);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const WA_URL = `https://wa.me/${cfg.publicPhone.replace(/\D/g, '')}?text=Ciao%21%20Vorrei%20sapere%20di%20pi%C3%B9%20sui%20prodotti`;

  useEffect(() => {
    if (!categoryId) return;
    Promise.all([
      getProductCategoryById(categoryId),
      getProductsByCategory(categoryId),
    ]).then(([cat, items]) => {
      if (cat) {
        setCategory(cat);
        document.title = `${cat.title} – CNC Beauty Sciacca (AG)`;
      }
      setProducts(items);
    }).finally(() => setLoading(false));
  }, [categoryId]);

  const categoryTitle = category?.title ?? 'Categoria';
  const categoryImg = category?.imgUrls?.[0] ?? '';

  return (
    <>
      <FloatingNav />

      <div className={styles.pageHero}>
        {categoryImg && (
          <div
            className={styles.pageHeroBg}
            style={{ backgroundImage: `url(${categoryImg})` }}
          />
        )}
        <div className={styles.pageHeroOv} />
        <div className={styles.pageHeroInner}>
          <div className={styles.heroText}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>›</span>
              <Link to="/prodotti">Prodotti</Link>
              <span>›</span>
              <span aria-current="page">{categoryTitle}</span>
            </nav>
            <h1>{categoryTitle}</h1>
            <p>Prodotti professionali selezionati da Carla Ciancimino per la tua beauty routine a Sciacca.</p>
            {!loading && (
              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <span className={styles.statN}>{products.length}</span>
                  <span className={styles.statL}>Prodotti</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statN}>✓</span>
                  <span className={styles.statL}>Selezionati</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.pageBody}>
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="cnc-tag">La nostra selezione</span>
            <h2 className={styles.sectionHeading}>{categoryTitle}</h2>
            <p className={styles.sectionSub}>
              Ogni prodotto è stato scelto personalmente da Carla per efficacia e qualità degli ingredienti.
            </p>
          </motion.div>

          {loading && (
            <div className={styles.loadingGrid}>
              {[1, 2, 3, 4].map(n => <div key={n} className={styles.skeleton} />)}
            </div>
          )}

          <div className={styles.grid}>
            {products.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.07 }}
              >
                <Link to={`/prodotti/${categoryId}/${p.id}`} className={styles.card}>
                  <div
                    className={styles.cardImg}
                    style={p.imgUrls?.[0]
                      ? { backgroundImage: `url(${p.imgUrls[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                      : { background: p.color || 'linear-gradient(145deg,#D4A0B0,#C08898)' }
                    }
                  >
                    {p.imgUrls && p.imgUrls.length > 1 && (
                      <div className={styles.imgCount}>+{p.imgUrls.length - 1}</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardTop}>
                      {p.tag?.slice(0, 2).map(tag => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                    <h3 className={styles.cardTitle}>{p.title}</h3>
                    {p.subtitle && <p className={styles.cardSub}>{p.subtitle}</p>}
                    <div className={styles.cardMeta}>
                      {typeof p.price === 'number' && (
                        <span className={styles.metaItem}>
                          <span className="material-symbols-outlined">euro</span>
                          {fmt(p.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.cardArrow}>→</div>
                </Link>
              </motion.div>
            ))}
            {!loading && products.length === 0 && (
              <p className={styles.empty}>Nessun prodotto disponibile in questa categoria.</p>
            )}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sideCard}>
            <h3>Chiedi consiglio</h3>
            <p>Non sai quale prodotto fa per te? Carla ti guida nella scelta giusta durante una consulenza a Sciacca.</p>
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

          <div className={styles.sideCard}>
            <h3>Altre categorie</h3>
            <div className={styles.backLink}>
              <Link to="/prodotti">← Tutti i prodotti</Link>
            </div>
          </div>
        </aside>
      </div>

      <SiteFooter />
      <WaFab />
    </>
  );
};

export default ProductList;
