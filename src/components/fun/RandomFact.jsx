import { useEffect, useState } from 'react';
import layanan from '../../data/layanan.json';
import styles from './RandomFact.module.css';

export default function RandomFact() {
  const [fact, setFact] = useState('Fakta acak siap diputar!');
  const [hiddenOnHero, setHiddenOnHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('beranda');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHiddenOnHero(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const random = () => {
    const item = layanan[Math.floor(Math.random() * layanan.length)];
    setFact(`${item.nama}: ${item.ringkas}. Cek sumber resmi sebelum berangkat.`);
  };

  return <aside className={`${styles.wrap} ${hiddenOnHero ? styles.hidden : ''}`} aria-live="polite"><span className={styles.sticker}>{fact}</span><button type="button" onClick={random}>Acak fakta</button></aside>;
}
