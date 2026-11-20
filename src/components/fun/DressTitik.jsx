import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { accessoryKeys, getSavedAccessories } from './TitikAccessories';
import styles from './DressTitik.module.css';

const labels = { topi: 'Topi', kacamata: 'Kacamata', bando: 'Bando', dasi: 'Dasi kupu-kupu', mahkota: 'Mahkota' };

export default function DressTitik() {
  const wrapRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(getSavedAccessories);
  const reduced = useReducedMotion();

  useEffect(() => {
    localStorage.setItem('publicles-titik-accessories', JSON.stringify(selected));
    window.dispatchEvent(new CustomEvent('publicles-accessories', { detail: selected }));
  }, [selected]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    const onPointer = (event) => { if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  const toggle = (key) => {
    const active = selected.includes(key);
    setSelected((current) => active ? current.filter((item) => item !== key) : [...current, key]);
    if (!active && !reduced) window.dispatchEvent(new CustomEvent('publicles-confetti'));
  };

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <button type="button" className={styles.trigger} aria-expanded={open} aria-controls="dandani-titik" aria-label="Dandani Titik" onClick={() => setOpen((value) => !value)}>Dandani Titik</button>
      {open && (
        <div id="dandani-titik" className={styles.panel} role="dialog" aria-label="Pilihan aksesori Titik">
          {accessoryKeys.map((key) => {
            const active = selected.includes(key);
            return <button type="button" key={key} className={`${styles.option} ${active ? styles.active : ''}`} aria-pressed={active} onClick={() => toggle(key)}><span>{labels[key]}</span><strong>{active ? 'Lepas' : 'Pasang'}</strong></button>;
          })}
        </div>
      )}
    </div>
  );
}
