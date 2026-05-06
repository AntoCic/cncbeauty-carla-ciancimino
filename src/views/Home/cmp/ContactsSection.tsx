import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAppSelector } from '../../../store';
import styles from './ContactsSection.module.css';

const DAYS_IT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

const formatWorkingDays = (days: number[]): string => {
  if (!days?.length) return 'Lun – Ven';
  if (days.length === 1) return DAYS_IT[days[0]];
  const sorted = [...days].sort((a, b) => a - b);
  return `${DAYS_IT[sorted[0]]} – ${DAYS_IT[sorted[sorted.length - 1]]}`;
};

const ContactsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  const cfg = useAppSelector(s => s.appConfig.data);

  const WA_URL = `https://wa.me/${cfg.publicPhone.replace(/\D/g, '')}?text=Ciao%21%20Vorrei%20prenotare%20una%20consulenza`;
  const workDays = cfg.workingDays ?? [1, 2, 3, 4, 5];

  return (
    <section id="contacts" className={styles.section} aria-labelledby="cont-h" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.map}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=13.050,37.501,13.080,37.521&layer=mapnik&marker=37.51106,13.06517"
            title="CNC Beauty – Via Enrico de Nicola 16, Sciacca (AG)"
            loading="lazy"
            allowFullScreen
          />
        </motion.div>

        <motion.div
          className={styles.info}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <span className={styles.tag}>Vieni a trovarci</span>
          <h2 id="cont-h">Siamo a Sciacca</h2>

          <div className={styles.row}>
            <div className={styles.ico} aria-hidden="true">📍</div>
            <div className={styles.det}>
              <h4>Indirizzo</h4>
              <p>{cfg.officeAddress}<br />Sicilia, Italia</p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.ico} aria-hidden="true">📞</div>
            <div className={styles.det}>
              <h4>Telefono</h4>
              <a href={`tel:${cfg.publicPhone}`}>{cfg.publicPhone}</a>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.ico} aria-hidden="true">🕐</div>
            <div className={styles.det}>
              <h4>Orari</h4>
              <div className={styles.orari}>
                <span className={styles.day}>{formatWorkingDays(workDays)}</span>
                <span>{cfg.dayStart} – {cfg.dayEnd}</span>
              </div>
            </div>
          </div>

          <div className={styles.ctas}>
            <a href={WA_URL} className={styles.btnWa} target="_blank" rel="noopener" aria-label="Contattaci su WhatsApp">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.129.557 4.126 1.528 5.858L.057 23.856a.5.5 0 00.608.608l6.068-1.479A11.938 11.938 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.88a9.859 9.859 0 01-5.027-1.374l-.36-.213-3.732.909.934-3.64-.235-.374A9.86 9.86 0 012.12 12C2.12 6.533 6.533 2.12 12 2.12s9.88 4.413 9.88 9.88c0 5.467-4.413 9.88-9.88 9.88z"/>
              </svg>
              Scrivici su WhatsApp
            </a>
            <a
              href="https://www.instagram.com/_cnc_beauty_"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnIg}
              aria-label="Seguici su Instagram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Scrivici su Instagram
            </a>
            <a href={`tel:${cfg.publicPhone}`} className={styles.btnCall} aria-label="Chiama ora">
              📞 Chiama ora
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactsSection;
