import styles from './PromoFloatingButton.module.css';

interface PromoFloatingButtonProps {
  onClick: () => void;
}

export const PromoFloatingButton = ({ onClick }: PromoFloatingButtonProps) => (
  <button type="button" className={styles.fab} onClick={onClick} aria-label="Vedi le promozioni del giorno">
    <span className="material-symbols-outlined" aria-hidden="true">celebration</span>
  </button>
);

export default PromoFloatingButton;
