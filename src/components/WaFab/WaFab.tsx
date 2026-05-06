import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store';
import styles from './WaFab.module.css';

const WaFab = () => {
  const cfg = useAppSelector(s => s.appConfig.data);
  const [topVisible, setTopVisible] = useState(false);

  const WA_URL = `https://wa.me/${cfg.publicPhone.replace(/\D/g, '')}?text=Ciao%21%20Vorrei%20prenotare%20una%20consulenza`;

  useEffect(() => {
    const onScroll = () => setTopVisible(window.scrollY > window.innerHeight * 0.75);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <a
        id="wa-fab"
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.waFab}
        aria-label="Scrivici su WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.129.557 4.126 1.528 5.858L.057 23.856a.5.5 0 00.608.608l6.068-1.479A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.88a9.859 9.859 0 01-5.027-1.374l-.36-.213-3.732.909.934-3.64-.235-.374A9.86 9.86 0 012.12 12C2.12 6.533 6.533 2.12 12 2.12s9.88 4.413 9.88 9.88c0 5.467-4.413 9.88-9.88 9.88z"/>
        </svg>
      </a>

      <button
        id="top-btn"
        className={`${styles.topBtn} ${topVisible ? styles.topBtnOn : ''}`}
        aria-label="Torna in cima"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ↑
      </button>
    </>
  );
};

export default WaFab;
