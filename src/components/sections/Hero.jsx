import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import StickerBoard from '../fun/StickerBoard';
import TitikMascot from '../fun/TitikMascot';
import styles from './Hero.module.css';

export default function Hero() {
  const marqueeRef = useRef(null);
  useEffect(() => {
    let previousY = window.scrollY;
    const updateDirection = () => {
      const movingUp = window.scrollY < previousY;
      if (marqueeRef.current) marqueeRef.current.dataset.direction = movingUp ? 'reverse' : 'forward';
      previousY = window.scrollY;
    };
    window.addEventListener('scroll', updateDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateDirection);
  }, []);

  return (
    <section id="beranda" className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.orbitTwo} aria-hidden="true" />
      <div className={`${styles.inner} heroPlayground`}>
        <div className={styles.copy}>
          <h1 id="hero-title">Bingung ngurus <span className={styles.document}>dokumen</span>?</h1>
          <div className={styles.brand}>Publicles<span className={styles.logoDot}>.</span></div>
          <div className={styles.actions}>
            <a className={styles.primary} href="#layanan">Cari layanan <ArrowRight size={20} aria-hidden="true" /></a>
            <a className={styles.secondary} href="#promosi">Pasang promosi</a>
          </div>
        </div>
        <div className={styles.playground}>
          <TitikMascot />
          <StickerBoard />
        </div>
      </div>
      <div className={styles.marquee} ref={marqueeRef} aria-label="Layanan populer">
        <div className={`${styles.marqueeRow} ${styles.rowTop}`}>
          {[0,1,2,3].map((copy) => <div className={styles.marqueeTrack} key={`top-${copy}`} aria-hidden={copy > 0}><span>KTP</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1z"/></svg><span>KK</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1z"/></svg><span>SIM</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1z"/></svg><span>PASPOR</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1z"/></svg><span>AKTA LAHIR</span></div>)}
        </div>
        <div className={`${styles.marqueeRow} ${styles.rowBottom}`}>
          {[0,1,2,3].map((copy) => <div className={styles.marqueeTrack} key={`bottom-${copy}`} aria-hidden={copy > 0}><span>BPJS</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1z"/></svg><span>KTP</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1z"/></svg><span>SIM</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1l1.6 5.4L15 8l-5.4 1.6L8 15l-1.6-5.4L1 8l5.4-1.6L8 1z"/></svg><span>PASPOR</span></div>)}
        </div>
      </div>
    </section>
  );
}
