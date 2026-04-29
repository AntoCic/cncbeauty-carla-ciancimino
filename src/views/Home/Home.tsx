import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../components/firebase/firebase';
import { APP_CONFIG_ID, APP_CONFIG_DEFAULTS } from '../../models/AppConfig';
import type { AppConfigData } from '../../models/AppConfig';
import { Btn } from '../../components/Btn/Btn';
import styles from './Home.module.css';

const Home = () => {
  const [config, setConfig] = useState<AppConfigData>({ id: APP_CONFIG_ID, ...APP_CONFIG_DEFAULTS });

  useEffect(() => {
    getDoc(doc(db, 'appConfig', APP_CONFIG_ID)).then((snap) => {
      if (snap.exists()) {
        setConfig({ id: snap.id, ...snap.data() } as AppConfigData);
      }
    });
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <h1 className={styles.brand}>{config.brandName}</h1>
        <p className={styles.tagline}>Centro Estetico</p>

        <div className="d-flex gap-3 mt-4">
          <Btn to="/trattamenti" color="dark">Trattamenti</Btn>
          <Btn to="/prodotti" color="dark" version="outline">Prodotti</Btn>
        </div>
      </header>

      <section className={`container py-5 ${styles.infoSection}`}>
        <div className="row justify-content-center g-4">
          <div className="col-12 col-md-6 col-lg-4">
            <div className={styles.infoCard}>
              <span className="material-symbols-outlined">location_on</span>
              <p>{config.officeAddress}</p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div className={styles.infoCard}>
              <span className="material-symbols-outlined">phone</span>
              <p>
                <a href={`tel:${config.publicPhone}`}>{config.publicPhone}</a>
              </p>
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-4">
            <div className={styles.infoCard}>
              <span className="material-symbols-outlined">schedule</span>
              <p>Lun–Ven: {config.dayStart} – {config.dayEnd}</p>
              {config.breakStart && config.breakEnd && (
                <p className={styles.breakNote}>Pausa: {config.breakStart} – {config.breakEnd}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
