import { useEffect, useState } from 'react';
import { X, CalendarDays } from 'lucide-react';
import styles from './EventBanner.module.css';

export default function EventBanner({ event, now: providedNow }) {
  const storageKey = `publicles-banner-${event.id}`;
  const [closed, setClosed] = useState(() => sessionStorage.getItem(storageKey) === '1');
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const sync = () => setIsMobile(query.matches);
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  let current = Date.now();
  if (import.meta.env.DEV) {
    const value = new URLSearchParams(window.location.search).get('now');
    if (value) {
      const parsed = new Date(value).getTime();
      if (!Number.isNaN(parsed)) current = parsed;
    }
  }
  const now = providedNow || current;
  const expired = now >= new Date(event.selesai).getTime();
  if (expired) return null;
  if (closed) {
    if (!isMobile) return null;
    return <aside className={`${styles.banner} ${styles.closed}`} aria-hidden="true" />;
  }

  const close = () => {
    sessionStorage.setItem(storageKey, '1');
    setClosed(true);
  };

  return (
    <aside className={styles.banner} aria-label="Informasi event BINUS Festival">
      <button className={styles.content} type="button" onClick={() => document.getElementById('event')?.scrollIntoView({ behavior: 'smooth' })}>
        <CalendarDays size={18} aria-hidden="true" />
        <span>BINUS Festival - 25 Nov - Meja 10, Lantai 2</span>
      </button>
      <button className={styles.close} type="button" aria-label="Tutup banner event" onClick={close}><X size={18} aria-hidden="true" /></button>
    </aside>
  );
}
