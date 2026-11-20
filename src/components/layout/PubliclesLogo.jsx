import styles from './PubliclesLogo.module.css';

export default function PubliclesLogo({ className = '', inverse = false }) {
  return (
    <span className={`${styles.logo} ${inverse ? styles.inverse : ''} ${className}`}>
      Publicles<span className={styles.dot} aria-hidden="true" />
    </span>
  );
}
