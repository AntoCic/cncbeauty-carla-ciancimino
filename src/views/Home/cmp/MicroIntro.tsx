import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MicroIntro.module.css';

interface Props {
  onDone: () => void;
}

const MicroIntro = ({ onDone }: Props) => {
  const [visible, setVisible] = useState(true);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('cnc_intro', '1');
    setTimeout(onDone, 560);
  };

  useEffect(() => {
    const timer = setTimeout(dismiss, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={styles.intro}
          role="dialog"
          aria-label="Benvenuto in CNC Beauty"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className={styles.bloom} aria-hidden="true" />
          <motion.div
            className={styles.logoWrap}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/img/logo/logo.png" alt="CNC Beauty – Centro Estetico Sciacca" />
          </motion.div>
          <button className={styles.skip} onClick={dismiss} aria-label="Salta intro">
            Salta
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MicroIntro;
