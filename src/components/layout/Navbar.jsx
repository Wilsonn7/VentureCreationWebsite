import PubliclesLogo from './PubliclesLogo';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <header>
      <nav className={styles.nav} aria-label="Navigasi utama">
        <div className={styles.inner}>
          <a className={styles.logoLink} href="#beranda" aria-label="Publicles, kembali ke beranda"><PubliclesLogo /></a>
          <div className={styles.links}>
            <a className={styles.link} href="#layanan">Layanan</a>
            <a className={styles.link} href="#update">Kabar</a>
            <a className={styles.link} href="#promosi">Promosi</a>
          </div>
        </div>
      </nav>
    </header>
  );
}
