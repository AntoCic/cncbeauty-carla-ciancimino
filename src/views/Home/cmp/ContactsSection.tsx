import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './ContactsSection.module.css';

const WA_URL = 'https://wa.me/393297094859?text=Ciao%21%20Vorrei%20prenotare%20una%20consulenza';

const ContactsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

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
            src="https://www.openstreetmap.org/export/embed.html?bbox=13.055,37.493,13.095,37.513&layer=mapnik&marker=37.503,13.075"
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
              <p>Via Enrico de Nicola 16, 92019 Sciacca (AG)<br />Sicilia, Italia</p>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.ico} aria-hidden="true">📞</div>
            <div className={styles.det}>
              <h4>Telefono</h4>
              <a href="tel:+393297094859">+39 329 709 4859</a>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.ico} aria-hidden="true">✉</div>
            <div className={styles.det}>
              <h4>Email</h4>
              <a href="mailto:carla.ciancimino99@gmail.com">carla.ciancimino99@gmail.com</a>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.ico} aria-hidden="true">🕐</div>
            <div className={styles.det}>
              <h4>Orari</h4>
              <div className={styles.orari}>
                <span className={styles.day}>Lun – Ven</span><span>09:00 – 19:00</span>
                <span className={styles.day}>Sabato</span><span>09:00 – 17:00</span>
                <span className={styles.day}>Domenica</span><span>Chiuso</span>
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
            <a href="tel:+393297094859" className={styles.btnCall} aria-label="Chiama ora">
              📞 Chiama ora
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactsSection;
