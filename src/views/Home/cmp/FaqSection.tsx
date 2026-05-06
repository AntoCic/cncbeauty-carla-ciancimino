import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import styles from './FaqSection.module.css';

const FAQS = [
  { q: 'Devo prenotare in anticipo?', a: 'Sì, è sempre consigliato prenotare in anticipo per garantire disponibilità. Puoi farlo via telefono, WhatsApp o tramite il form sul sito, anche solo il giorno prima. Il numero è +39 329 709 4859.' },
  { q: 'Come posso contattarvi?', a: 'Puoi chiamarci o scriverci su WhatsApp al +39 329 709 4859, oppure via email a carla.ciancimino99@gmail.com. Rispondiamo di solito entro poche ore negli orari di apertura.' },
  { q: 'Dove si trova il centro?', a: 'CNC Beauty si trova in Via Enrico de Nicola 16, nel centro di Sciacca (AG), Sicilia. Siamo facilmente raggiungibili da tutta la provincia di Agrigento.' },
  { q: 'Come scelgo il trattamento più adatto a me?', a: 'La consulenza viso gratuita con Carla è il punto di partenza ideale: insieme analizzerete il tipo di pelle, le esigenze e gli obiettivi, costruendo un percorso su misura. Completamente gratuita e senza impegno.' },
  { q: 'Quali trattamenti offrite?', a: 'Offriamo oltre 50 trattamenti professionali in 7 categorie: trattamenti viso avanzati (microneedling, fotobiostimolazione, renewskin, peeling, pulizia profonda), trattamenti corpo, massaggi, epilazione laser (22 zone disponibili), ceretta, manicure e pedicure, laminazione ciglia e sopracciglia. Ogni trattamento è eseguito da Carla Ciancimino con oltre 20 anni di esperienza.' },
  { q: 'Quanto costa l\'epilazione laser?', a: 'I prezzi dell\'epilazione laser partono da 15 € per zone ridotte (baffetto, mento). Zone più richieste: ascelle donna 25 €, inguine donna 35 €, mezza gamba 40 €, gamba completa donna 60 €. Tutti i trattamenti sono eseguiti con macchinari certificati conformi agli standard europei.' },
  { q: 'Siete aperti il sabato?', a: 'Sì, il centro è aperto con orario continuato dalle 9:00 alle 19:00. Per prenotare è sufficiente contattarci con almeno un giorno di anticipo al +39 329 709 4859.' },
  { q: 'L\'epilazione laser fa male?', a: 'No, grazie al manipolo a raffreddamento criogenico integrato nel nostro laser diodo di ultima generazione. La testina raffredda la cute in tempo reale durante ogni impulso, riducendo quasi completamente la sensazione di dolore. La maggior parte delle clienti descrive la sensazione come un leggero calore tollerabile — nulla a che vedere con i laser di vecchia generazione. Il trattamento è sicuro per tutti i fototipi e viene eseguito con parametri personalizzati per zona e spessore del pelo.' },
  { q: 'Quali macchinari usate per i trattamenti viso e corpo?', a: 'CNC Beauty è dotata di tecnologie certificate conformi agli standard europei, selezionate per trattare problematiche specifiche: laser diodo di ultima generazione con manipolo a freddo per l\'epilazione, luce pulsata IPL per macchie e uniformità del tono, microneedling a profondità regolabile per stimolare collagene ed elastina (anti-aging, cicatrici, rughe), fotobiostimolazione LED per rivitalizzazione e rigenerazione cellulare, Renewskin a microcorrenti per il rinnovamento cutaneo, spatola ultrasonica per pulizia profonda e trattamento acne, e radiofrequenza per tono e rimodellamento corporeo. Ogni tecnologia è abbinata a un protocollo personalizzato dalla consulenza iniziale.' },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i);

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-h" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.head}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
        >
          <span className="cnc-tag">Hai domande?</span>
          <h2 id="faq-h">Domande frequenti</h2>
        </motion.div>

        {FAQS.map((f, i) => (
          <motion.div
            key={f.q}
            className={styles.item}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.07 }}
          >
            <button
              className={styles.btn}
              aria-expanded={open === i}
              onClick={() => toggle(i)}
            >
              {f.q}
              <span className={`${styles.ico} ${open === i ? styles.icoOpen : ''}`} aria-hidden="true">+</span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  className={styles.ans}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className={styles.ansInner}>{f.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FaqSection;
