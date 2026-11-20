import { Instagram, MessageCircle, ExternalLink, BookOpen } from 'lucide-react';
import links from '../../data/links.json';
import styles from './LinkHub.module.css';

const icons = { instagram: Instagram, 'message-circle': MessageCircle, 'external-link': ExternalLink, 'book-open': BookOpen };

export default function LinkHub() {
  const qrPath = `${import.meta.env.BASE_URL}BarcodePublicles.jpeg`;
  const waMessage = encodeURIComponent('Halo Publicles, aku mau tanya layanan Publicles.');
  const waUrl = `https://wa.me/${links.WA_NUMBER}?text=${waMessage}`;

  return (
    <main id="links" className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.avatar} aria-hidden="true">P.</div>
        <h1 className={styles.name}>Publicles.</h1>
        <p className={styles.bio}>Update harian seputar layanan publik masyarakat.</p>
        <nav className={styles.links} aria-label="Tautan Publicles">
          {links.links.map((link) => {
            const Icon = icons[link.icon] || ExternalLink;
            const url = link.id === 'wa' ? waUrl : link.url;
            const external = url.startsWith('http');
            return (
              <a
                key={link.id}
                className={styles.link}
                href={url}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
              >
                <Icon size={20} aria-hidden="true" /> {link.label}{link.id === 'wa' ? ` · ${links.WA_DISPLAY}` : ''}
              </a>
            );
          })}
        </nav>

        <section className={styles.instagramCard} aria-label="QR Instagram Publicles">
          <h2>Scan untuk follow @publicles</h2>
          <div className={styles.qrFrame}>
            <img
              className={styles.qr}
              src={qrPath}
              alt="QR code Instagram @publicles"
              width="180"
              height="180"
              loading="lazy"
            />
          </div>
          <a href={links.instagram} target="_blank" rel="noopener noreferrer">Atau buka instagram.com/publicles</a>
          <a className={styles.download} href={qrPath} download="BarcodePublicles.jpeg" aria-label="Unduh QR Instagram Publicles">Unduh QR</a>
        </section>
      </div>
    </main>
  );
}
