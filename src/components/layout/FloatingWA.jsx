import { MessageCircle } from 'lucide-react';
import links from '../../data/links.json';
import styles from './FloatingWA.module.css';

export default function FloatingWA() {
  const text = encodeURIComponent('Halo Publicles, aku mau tanya layanan publik.');
  const href = `https://wa.me/${links.WA_NUMBER}?text=${text}`;
  return <a className={styles.button} href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat Publicles lewat WhatsApp"><MessageCircle size={24} aria-hidden="true" /><span className={styles.label}>Chat WA</span></a>;
}
