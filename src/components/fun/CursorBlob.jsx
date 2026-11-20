import { useEffect, useRef } from 'react';
import { gsap } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './CursorBlob.module.css';

export default function CursorBlob() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !ref.current || matchMedia('(pointer: coarse)').matches) return;

    const move = (event) => gsap.to(ref.current, { x: event.clientX, y: event.clientY, duration: .18, ease:'power2.out' });
    const update = (event) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const blocked = target.closest('input, textarea, [contenteditable="true"], [role="dialog"], .modal');
      const interactive = target.closest('button, a, [role="tab"]');
      ref.current.classList.toggle(styles.hidden, Boolean(blocked));
      ref.current.classList.toggle(styles.click, Boolean(interactive && !blocked));
    };

    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', update);
    document.addEventListener('pointerout', (event) => {
      if (!event.relatedTarget) ref.current?.classList.remove(styles.click, styles.hidden);
    });
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', update);
    };
  }, [reduced]);

  return <div ref={ref} className={styles.blob} aria-hidden="true" />;
}
