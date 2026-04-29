import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './AboutSection.module.css';

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  return (
    <section id="about" className={styles.about} aria-labelledby="about-h" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.imgCol}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <div className={styles.blob} aria-hidden="true" />
          <div className={styles.photo}>
            <span>foto ritratto<br />Carla Ciancimino<br />estetista professionista</span>
          </div>
        </motion.div>

        <motion.div
          className={styles.text}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1 }}
        >
          <span className="cnc-tag">La nostra storia</span>
          <h2 id="about-h">Conosci Carla</h2>
          <p>Con oltre vent'anni di esperienza nel mondo dell'estetica professionale, Carla Ciancimino ha fondato CNC Beauty con un obiettivo chiaro: portare a Sciacca, in provincia di Agrigento, un centro dove ogni trattamento nasce dall'ascolto.</p>
          <p>Formata tra i migliori istituti in Italia, Carla unisce tecnica raffinata e attenzione reale per ogni cliente. La cura che mette nel suo lavoro si sente fin dal primo appuntamento.</p>
          <a href="/chi-siamo" className={styles.btnOutline}>La nostra storia →</a>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
