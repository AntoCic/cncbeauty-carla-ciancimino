import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store';
import styles from './CookieBanner.module.css';

const STORAGE_PREFIX = 'cnc_cookie_';

const CookieBanner = () => {
  const { data: cfg, status } = useAppSelector(s => s.appConfig);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === 'idle' || status === 'loading') return;
    const key = STORAGE_PREFIX + cfg.cookieConsentKeyDate;
    if (localStorage.getItem(key)) return;

    const isFirstVisit = !sessionStorage.getItem('cnc_intro');
    const delay = isFirstVisit ? 3000 : 600;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [status, cfg.cookieConsentKeyDate]);

  const close = (choice: 'accepted' | 'rejected') => {
    localStorage.setItem(STORAGE_PREFIX + cfg.cookieConsentKeyDate, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie banner" aria-live="polite">
      <div className={styles.inner}>
        <div
          className={styles.text}
          dangerouslySetInnerHTML={{ __html: cfg.cookieBannerTextHtml }}
        />
        <div className={styles.links}>
          <Link to="/privacy" className={styles.link} onClick={() => setVisible(false)}>Privacy</Link>
          <Link to="/cookie" className={styles.link} onClick={() => setVisible(false)}>Cookie Policy</Link>
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnReject} onClick={() => close('rejected')}>
          {cfg.cookieBannerRejectBtnText}
        </button>
        <button className={styles.btnAccept} onClick={() => close('accepted')}>
          {cfg.cookieBannerAcceptBtnText}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
