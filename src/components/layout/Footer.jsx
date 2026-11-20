import PubliclesLogo from './PubliclesLogo';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <PubliclesLogo inverse className={styles.logo} />
        <p className={styles.note}>Update harian seputar layanan publik masyarakat.</p>
      </div>
    </footer>
  );
}
