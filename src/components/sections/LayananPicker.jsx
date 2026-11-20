import { useEffect, useRef, useState } from 'react';
import { Check, ExternalLink } from 'lucide-react';
import { getLayanan } from '../../services/api';
import { gsap, Flip } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { playClick } from '../../services/audio';
import UpdatedBadge from './UpdatedBadge';
import styles from './LayananPicker.module.css';

export default function LayananPicker() {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState('ktp');
  const [tab, setTab] = useState('Syarat');
  const [step, setStep] = useState(0);
  const [checked, setChecked] = useState([]);
  const panelRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => { getLayanan().then(setItems); }, []);
  const active = items.find((item) => item.id === activeId) || items[0];
  useEffect(() => {
    if (!active) return;
    try { setChecked(JSON.parse(localStorage.getItem(`publicles-check-${active.id}`) || '[]')); } catch { setChecked([]); }
  }, [activeId, active]);

  const choose = (id) => {
    if (!reduced && panelRef.current) {
      const state = Flip.getState(panelRef.current);
      setActiveId(id); setTab('Syarat'); setStep(0);
      requestAnimationFrame(() => Flip.from(state, { duration: .55, ease: 'expo.out', scale: true }));
    } else { setActiveId(id); setTab('Syarat'); setStep(0); }
  };

  const toggleCheck = (index) => {
    if (!active) return;
    const next = checked.includes(index) ? checked.filter((value) => value !== index) : [...checked, index];
    setChecked(next);
    localStorage.setItem(`publicles-check-${active.id}`, JSON.stringify(next));
    if (next.length === active.syarat.length && active.syarat.length > 0) {
      playClick('success');
    }
  };

  const copyChecklist = async () => {
    if (!active) return;
    await navigator.clipboard?.writeText(`Checklist ${active.nama}:\n${active.syarat.map((item, i) => `${checked.includes(i) ? '✓' : '○'} ${item}`).join('\n')}`);
  };

  if (!active) return null;
  const progress = active.syarat.length ? Math.round((checked.length / active.syarat.length) * 100) : 0;

  return (
    <section id="layanan" className={styles.section} aria-labelledby="layanan-title">
      <div className={styles.inner}>
        <h2 id="layanan-title" className={styles.title}>Mau urus apa hari ini?</h2>
        <div className={styles.chips} role="tablist" aria-label="Pilih layanan">
          {items.map((item) => <button key={item.id} type="button" role="tab" aria-selected={item.id === activeId} className={`${styles.chip} ${item.id === activeId ? styles.chipActive : ''}`} onClick={() => choose(item.id)}>{item.nama}</button>)}
        </div>
        <div ref={panelRef} className={styles.card}>
          <article className={styles.panel}>
            <div className={styles.header}><div><h3>{active.nama}</h3><p>{active.ringkas}</p></div><UpdatedBadge dicekTanggal={active.dicekTanggal} status={active.status} sumber={active.sumber} /></div>
            <div className={styles.tabs} role="tablist" aria-label={`Detail ${active.nama}`}>
              {['Syarat','Langkah','Biaya','Kalau Ada Masalah'].map((name) => <button key={name} type="button" role="tab" aria-selected={tab === name} className={`${styles.tab} ${tab === name ? styles.tabActive : ''}`} onClick={() => setTab(name)}>{name}</button>)}
            </div>
            <div className={styles.content}>
              {tab === 'Syarat' && <div aria-live="polite">
                {active.syarat.map((item, index) => <label className={styles.check} key={item}><input type="checkbox" checked={checked.includes(index)} onChange={() => toggleCheck(index)} /><span>{item}</span></label>)}
                <div className={styles.progress} role="progressbar" aria-label="Dokumen siap" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><div className={styles.progressFill} style={{ width: `${progress}%` }} /></div>
                <strong>Dokumen siap: {checked.length}/{active.syarat.length}</strong>
                {progress === 100 && <div role="status"><p>Siap berangkat!</p><button data-sound="success" className={styles.next} type="button" onClick={copyChecklist}><Check size={18} /> Simpan/bagikan checklist</button></div>}
              </div>}
              {tab === 'Langkah' && <div>
                <div className={styles.stepper}>{active.langkah.map((item, index) => <article key={item.judul} className={`${styles.step} ${index === step ? styles.stepActive : ''}`}><span className={styles.number}>{index + 1}</span><h4>{item.judul}</h4><p>{item.detail}</p></article>)}</div>
                <button className={styles.next} type="button" onClick={() => setStep((value) => Math.min(value + 1, active.langkah.length - 1))}>Lanjut</button>
              </div>}
              {tab === 'Biaya' && <div><h4>Biaya</h4>{active.status === 'terverifikasi-sebagian' && !active.biaya.terverifikasi && <p className={styles.note}><strong>Biaya belum diverifikasi</strong></p>}<p>{active.biaya.teks}</p><p className={styles.note}><strong>Catatan:</strong> Biaya dan aturan bisa berubah. Cek sumber resmi sebelum berangkat.</p></div>}
              {tab === 'Kalau Ada Masalah' && <div>{active.masalah.map((item) => <article key={item.kasus}><h4>{item.kasus}</h4><p>{item.solusi}</p></article>)}</div>}
            </div>
            <div className={styles.sources}><strong>Sumber resmi:</strong>{active.sumber.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"> {source.nama} <ExternalLink size={14} aria-hidden="true" /></a>)}</div>
          </article>
        </div>
      </div>
    </section>
  );
}
