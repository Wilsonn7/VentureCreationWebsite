import { useEffect, useRef, useState } from 'react';
import { gsap, Draggable } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import TitikAccessories, { getSavedAccessories } from './TitikAccessories';
import styles from './TitikMascot.module.css';

const speeches = ['Ada yang bisa Titik bantu urus?', 'KTP-mu sudah e-KTP belum?', 'Jangan lupa bawa fotokopi!'];

export default function TitikMascot() {
  const root = useRef(null);
  const pupilRefs = useRef([]);
  const eyeRefs = useRef([]);
  const [speech, setSpeech] = useState('');
  const [clicks, setClicks] = useState(0);
  const [mouth, setMouth] = useState('normal');
  const [accessories, setAccessories] = useState(getSavedAccessories);
  const [eyeGeometry, setEyeGeometry] = useState(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!root.current || reduced) return;
    gsap.to(root.current, { y: -8, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }, [reduced]);

  useEffect(() => {
    const sync = (event) => setAccessories(event.detail || getSavedAccessories());
    window.addEventListener('publicles-accessories', sync);
    return () => window.removeEventListener('publicles-accessories', sync);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setMouth('bored'), 8000);
    return () => clearTimeout(timer);
  }, [mouth]);

  useEffect(() => {
    if (reduced) return;
    const moveEyes = (event) => {
      pupilRefs.current.forEach((pupil) => {
        if (!pupil || !root.current) return;
        const rect = root.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(event.clientY - cy, event.clientX - cx);
        gsap.to(pupil, { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5, duration: 0.12 });
      });
    };
    window.addEventListener('pointermove', moveEyes);
    window.addEventListener('pointerdown', moveEyes);
    return () => {
      window.removeEventListener('pointermove', moveEyes);
      window.removeEventListener('pointerdown', moveEyes);
    };
  }, [reduced]);

  useEffect(() => {
    if (!root.current || reduced) return;
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    let instance = Draggable.create(root.current, {
      type: 'x,y',
      inertia: true,
      bounds: '.heroPlayground',
      onPress: () => setMouth('o'),
      onDragEnd: function () {
        setMouth('normal');
        gsap.to(root.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.45)' });
      },
    });
    const setup = () => {
      instance.forEach((item) => item.kill());
      instance = Draggable.create(root.current, {
        type: 'x,y',
        inertia: true,
        bounds: '.heroPlayground',
        onPress: () => setMouth('o'),
        onDragEnd: function () {
          setMouth('normal');
          gsap.to(root.current, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1,0.45)' });
        },
      });
    };
    setup();
    window.addEventListener('resize', setup, { passive: true });
    mobileQuery.addEventListener?.('change', setup);
    return () => {
      instance.forEach((item) => item.kill());
      window.removeEventListener('resize', setup);
      mobileQuery.removeEventListener?.('change', setup);
    };
  }, [reduced]);

  const handleClick = () => {
    setMouth('wide');
    setTimeout(() => setMouth('normal'), 900);
    setSpeech(speeches[Math.floor(Math.random() * speeches.length)]);
    const next = clicks + 1;
    setClicks(next);
    if (!reduced) gsap.fromTo(root.current, { scaleX: 1.25, scaleY: 0.75 }, { scaleX: 1, scaleY: 1, duration: 0.5, ease: 'elastic.out(1,0.35)' });
    if (next === 7) {
      window.dispatchEvent(new CustomEvent('publicles-confetti'));
      setClicks(0);
    }
  };

  useEffect(() => {
    if (!speech) return;
    const timer = setTimeout(() => setSpeech(''), 3200);
    return () => clearTimeout(timer);
  }, [speech]);

  useEffect(() => {
    const measure = () => {
      if (!root.current || eyeRefs.current.length < 2) return;
      const rootRect = root.current.getBoundingClientRect();
      const leftRect = eyeRefs.current[0]?.getBoundingClientRect();
      const rightRect = eyeRefs.current[1]?.getBoundingClientRect();
      if (!leftRect || !rightRect || !rootRect.width || !rootRect.height) return;
      const cxL = ((leftRect.left + leftRect.width / 2 - rootRect.left) / rootRect.width) * 220;
      const cxR = ((rightRect.left + rightRect.width / 2 - rootRect.left) / rootRect.width) * 220;
      const cyL = ((leftRect.top + leftRect.height / 2 - rootRect.top) / rootRect.height) * 220;
      const cyR = ((rightRect.top + rightRect.height / 2 - rootRect.top) / rootRect.height) * 220;
      const cy = (cyL + cyR) / 2;
      const rx = (leftRect.width / rootRect.width) * 220 / 2;
      const ry = (leftRect.height / rootRect.height) * 220 / 2;
      setEyeGeometry({ cxL, cxR, cy, rx, ry });
    };

    measure();
    window.addEventListener('resize', measure);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (root.current) observer?.observe(root.current);
    return () => {
      window.removeEventListener('resize', measure);
      observer?.disconnect();
    };
  }, []);

  return (
    <button data-sound="titik" ref={root} type="button" className={`${styles.titik}`} aria-label="Geser atau tap Titik, maskot Publicles" onClick={handleClick}>
      <span className={styles.ear} aria-hidden="true" />
      <span className={styles.face} aria-hidden="true">
        <span ref={(el) => { eyeRefs.current[0] = el; pupilRefs.current[0] = el?.querySelector('span') || null; }} className={styles.eye}><span /></span>
        <span ref={(el) => { eyeRefs.current[1] = el; pupilRefs.current[1] = el?.querySelector('span') || null; }} className={styles.eye}><span /></span>
      </span>
      <svg className={styles.mouth} viewBox="0 0 80 40" aria-hidden="true">
        {mouth === 'o' ? <ellipse cx="40" cy="20" rx="9" ry="12" /> : mouth === 'bored' ? <path d="M24 22H56" /> : mouth === 'wide' ? <path d="M18 18 Q40 38 62 18 Q40 42 18 18Z" /> : <path d="M20 16 Q40 32 60 16" />}
      </svg>
      <TitikAccessories items={accessories} eyeGeometry={eyeGeometry} />
      {speech && <span className={styles.speech} role="status">{speech}</span>}
    </button>
  );
}
