import { useEffect, useState } from 'react';
import PubliclesLogo from '../layout/PubliclesLogo';
import styles from './Loader.module.css';

export default function Loader() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem('publicles-loader-seen'));
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('publicles-loader-seen', '1');
      setVisible(false);
    }, 1100);
    return () => clearTimeout(timer);
  }, [visible]);
  if (!visible) return null;

  return (
    <div className={styles.loader} role="status" aria-label="Memuat Publicles">
      <button type="button" className={styles.skip} onClick={() => setVisible(false)}>Lewati</button>
      <PubliclesLogo inverse className={styles.logo} />
    </div>
  );
}
