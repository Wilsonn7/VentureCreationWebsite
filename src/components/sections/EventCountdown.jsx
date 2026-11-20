import { useEffect, useRef, useState } from 'react';
import { CalendarPlus, MapPin, Share2, Instagram, ArrowRight } from 'lucide-react';
import { gsap } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import links from '../../data/links.json';
import TitikAccessories, { getSavedAccessories } from '../fun/TitikAccessories';
import styles from './EventCountdown.module.css';

function getTestNow() {
  if (!import.meta.env.DEV) return Date.now();
  const value = new URLSearchParams(window.location.search).get('now');
  if (!value) return Date.now();
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? Date.now() : parsed;
}

function splitDuration(ms) {
  const total = Math.max(0, ms);
  return {
    days: Math.floor(total / 86400000),
    hours: Math.floor(total / 3600000) % 24,
    minutes: Math.floor(total / 60000) % 60,
    seconds: Math.floor(total / 1000) % 60,
  };
}

export default function EventCountdown({ event }) {
  const reduced = useReducedMotion();
  const mascotRef = useRef(null);
  const unitRefs = useRef([]);
  const previousSeconds = useRef(null);
  const [now, setNow] = useState(getTestNow);
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState('');
  const [tableNumbers, setTableNumbers] = useState(() => [1,2,3,4,5,6,7,8,9,10,11,12].sort(() => Math.random() - .5));
  const [gameFeedback, setGameFeedback] = useState('Pilih meja untuk mencari Meja 10.');
  const [gameWon, setGameWon] = useState(false);
  const [wrongTable, setWrongTable] = useState(null);
  const [eventAccessories,setEventAccessories]=useState(getSavedAccessories);
  const eventEyeRefs=useRef([]);
  const [eventEyeGeometry,setEventEyeGeometry]=useState(null);

  useEffect(() => {
    let timer = null;

    const tick = () => setNow(getTestNow());
    const sync = () => {
      if (document.hidden) {
        if (timer) clearInterval(timer);
        timer = null;
      } else if (!timer) {
        tick();
        timer = setInterval(tick, 1000);
      }
    };

    sync();
    document.addEventListener('visibilitychange', sync);
    return () => {
      if (timer) clearInterval(timer);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(()=>{const sync=(event)=>setEventAccessories(event.detail||getSavedAccessories());window.addEventListener('publicles-accessories',sync);return()=>window.removeEventListener('publicles-accessories',sync)},[]);

  const start = new Date(event.mulai).getTime();
  const end = new Date(event.selesai).getTime();
  const eventDate = event.mulai.slice(0, 10);
  const wibDayStart = new Date(`${eventDate}T00:00:00+07:00`).getTime();
  const state = now < start
    ? (now >= wibDayStart ? 'today' : 'long')
    : now < end ? 'live' : 'ended';

  const remaining = state === 'live' ? end - now : start - now;
  const duration = splitDuration(remaining);
  const count = state === 'live' || state === 'today'
    ? [['Jam', duration.hours], ['Menit', duration.minutes], ['Detik', duration.seconds]]
    : [['Hari', duration.days], ['Jam', duration.hours], ['Menit', duration.minutes], ['Detik', duration.seconds]];

  useEffect(() => {
    if (reduced || state === 'ended') return;
    if (previousSeconds.current !== null && previousSeconds.current !== duration.seconds && mascotRef.current) {
      gsap.fromTo(mascotRef.current, { y: 0, scaleY: 1 }, { y: -10, scaleY: 0.92, duration: 0.18, yoyo: true, repeat: 1, ease: 'power2.out' });
      const unit = unitRefs.current[count.length - 1];
      if (unit) gsap.fromTo(unit, { rotationX: -75, opacity: 0.35 }, { rotationX: 0, opacity: 1, duration: 0.32, ease: 'back.out(1.4)' });
    }
    previousSeconds.current = duration.seconds;
  }, [duration.seconds, reduced, state, count.length]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const locationText = `${event.lokasi.tempat} - ${event.lokasi.gedung} - ${event.lokasi.lantai} - ${event.lokasi.meja}`;

  const addCalendar = () => {
    const summary = event.nama;
    const description = `${event.tagline} Lokasi: ${locationText}`;
    const location = `${event.lokasi.tempat}, ${event.lokasi.gedung}, ${event.lokasi.lantai}, ${event.lokasi.meja}`;
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Publicles//Event//ID',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:binus-festival-2026@publicles',
      'DTSTAMP:20261120T000000Z',
      'DTSTART;TZID=Asia/Jakarta:20261125T130000',
      'DTEND;TZID=Asia/Jakarta:20261125T160000',
      `SUMMARY:${summary}`,
      `LOCATION:${location}`,
      `DESCRIPTION:${description}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'publicles-binus-festival.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    const text = `${event.nama} — Rabu, 25 November 2026, 13.00-16.00 WIB. ${locationText}. ${event.tagline}`;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: event.nama, text, url }); return; } catch (error) { if (error?.name === 'AbortError') return; }
    }
    await navigator.clipboard?.writeText(`${text} ${url}`);
    setToast('Tersalin!');
  };

  const liveSummary = state === 'live'
    ? `Berlangsung sekarang. Berakhir dalam ${duration.hours} jam ${duration.minutes} menit ${duration.seconds} detik.`
    : state === 'today'
      ? `Hari ini mulai 13.00 WIB. ${duration.hours} jam ${duration.minutes} menit lagi.`
      : state === 'long'
        ? `${duration.days} hari ${duration.hours} jam ${duration.minutes} menit lagi.`
        : 'Event sudah selesai.';

  const advance = () => setStep((value) => Math.min(value + 1, 2));

  const restartGame = () => {
    setTableNumbers([1,2,3,4,5,6,7,8,9,10,11,12].sort(() => Math.random() - .5));
    setGameFeedback('Pilih meja untuk mencari Meja 10.');
    setGameWon(false);
    setWrongTable(null);
  };

  const chooseTable = (number, index) => {
    const targetIndex = tableNumbers.indexOf(10);
    if (number === 10) {
      setGameWon(true);
      setWrongTable(null);
      setGameFeedback('Ketemu! Sampai jumpa di Meja 10 hari Rabu.');
      if (!reduced) {
        if (mascotRef.current) gsap.fromTo(mascotRef.current, { y: 0 }, { y: -22, duration:.28, yoyo:true, repeat:1, ease:'power2.out' });
        window.dispatchEvent(new CustomEvent('publicles-confetti'));
      }
      return;
    }

    setWrongTable(number);
    const distance = Math.abs(index - targetIndex);
    setGameFeedback(distance <= 1 ? 'Hampir!' : index < targetIndex ? 'Kurang ke atas' : 'Lebih jauh');
    if (!reduced) {
      const button = document.querySelector(`[data-table="${number}"]`);
      if (button) gsap.fromTo(button, { x: -5 }, { x: 5, duration:.06, repeat:5, yoyo:true, clearProps:'x' });
    }
  };

  useEffect(()=>{
    const measure=()=>{
      if(!mascotRef.current||eventEyeRefs.current.length<2)return;
      const root=mascotRef.current.getBoundingClientRect();
      const left=eventEyeRefs.current[0]?.getBoundingClientRect();
      const right=eventEyeRefs.current[1]?.getBoundingClientRect();
      if(!left||!right||!root.width||!root.height)return;
      const cxL=((left.left+left.width/2-root.left)/root.width)*220;
      const cxR=((right.left+right.width/2-root.left)/root.width)*220;
      const cy=((left.top+left.height/2-root.top)/root.height*220+(right.top+right.height/2-root.top)/root.height*220)/2;
      const rx=(left.width/root.width)*220/2;
      const ry=(left.height/root.height)*220/2;
      setEventEyeGeometry({cxL,cxR,cy,rx,ry});
    };
    measure();window.addEventListener('resize',measure);const observer=new ResizeObserver(measure);if(mascotRef.current)observer.observe(mascotRef.current);
    return()=>{window.removeEventListener('resize',measure);observer.disconnect()};
  },[]);

  return (
    <section id="event" className={styles.section} aria-labelledby="event-title">
      <div className={styles.inner}>
        <article className={`${styles.ticket} ${state === 'today' ? styles.pulse : ''}`}>
          <div>
            <div className={styles.badges}>
              <span className={styles.badge}>Event pertama Publicles</span>
              {state === 'live' && <span className={`${styles.badge} ${styles.live}`}>SEDANG BERLANGSUNG</span>}
            </div>
            <div className={styles.copy}>
              <h2 id="event-title">{event.nama}</h2>
              {state === 'ended' ? (
                <><p><strong>Terima kasih sudah mampir ke BINUS Festival!</strong></p><p className={styles.tagline}>{event.tagline}</p></>
              ) : (
                <><p className={styles.tagline}>{state === 'live' ? 'Kami sedang ada di lokasi!' : state === 'today' ? 'Hari ini! Mulai 13.00 WIB' : 'Sampai jumpa di meja 10!'}</p><p className={styles.staticInfo}>Rabu, 25 November 2026 · 13.00–16.00 WIB</p><p className={styles.staticInfo}>Lokasi: {locationText}</p></>
              )}
            </div>

            {state !== 'ended' && (
              <>
                <p className={styles.summary} aria-live="polite" role="status" aria-atomic="true">{liveSummary}</p>
                <div className={styles.countdown} aria-label="Hitung mundur event">
                  {count.map(([label, value], index) => (
                    <div className={styles.unit} key={label} ref={(element) => (unitRefs.current[index] = element)} aria-hidden="true">
                      <strong>{String(value).padStart(2, '0')}</strong><span>{label}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className={styles.actions}>
              {state === 'live' ? (
                <a className={`${styles.action} ${styles.primaryAction}`} href="#cara-menemukan-kami">Kami di Lantai 2, Meja 10!</a>
              ) : state === 'ended' ? (
                <><a className={styles.action} href={links.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} aria-hidden="true" />Follow @publicles</a><a className={styles.action} href="#layanan">Lihat info layanan <ArrowRight size={18} aria-hidden="true" /></a></>
              ) : (
                <><button className={styles.action} type="button" onClick={addCalendar}><CalendarPlus size={18} aria-hidden="true" />Tambah ke kalender</button><a className={styles.action} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.lokasi.mapsQuery)}`} target="_blank" rel="noopener noreferrer"><MapPin size={18} aria-hidden="true" />Lihat lokasi</a><button className={styles.action} type="button" onClick={share}><Share2 size={18} aria-hidden="true" />Bagikan</button></>
              )}
              {state !== 'ended' && (
                <a className={`${styles.action} ${styles.mobileFollow}`} href={links.instagram} target="_blank" rel="noopener noreferrer"><Instagram size={18} aria-hidden="true" />Follow @publicles</a>
              )}
            </div>
          </div>

          <aside className={styles.side} aria-label="Titik maskot dan meja Publicles">
            <div ref={mascotRef} className={styles.mascot} aria-hidden="true"><span ref={(el)=>eventEyeRefs.current[0]=el} className={styles.eventEye}/><span ref={(el)=>eventEyeRefs.current[1]=el} className={styles.eventEye}/><TitikAccessories items={eventAccessories} eyeGeometry={eventEyeGeometry}/></div>
            <div className={styles.tableBoard}>Meja 10</div>
          </aside>
        </article>

        {state !== 'ended' && (
          <div id="cara-menemukan-kami" className={styles.find}>
            <h3>Cara menemukan kami</h3>
            <div className={styles.stepper}>
              {['Masuk ke Kampus Anggrek, BINUS Kemanggisan.', 'Naik ke Lantai 2.', 'Cari Meja 10, ada Publicles di sana.'].map((text, index) => (
                <article className={`${styles.step} ${step === index ? styles.stepActive : ''}`} key={text} onMouseEnter={() => setStep(index)}>
                  <span className={styles.stepNumber}>{index + 1}</span><p>{text}</p>
                </article>
              ))}
            </div>
            <div className={styles.stepControls}>
              <button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))}>Langkah sebelumnya</button>
              <button type="button" onClick={advance}>Titik lompat ke langkah berikutnya</button>
            </div>
          </div>
        )}
        {toast && <div className={styles.toast} role="status">{toast}</div>}

        {state !== 'ended' && (
          <div className={styles.game}>
            <p className={styles.gameDisclaimer}>Ilustrasi permainan, bukan denah asli.</p>
            <div className={styles.tableGrid} role="group" aria-label="Permainan Cari Meja 10">
              {tableNumbers.map((number, index) => (
                <button
                  type="button"
                  data-table={number}
                  key={`${number}-${index}`}
                  className={`${styles.tableCard} ${gameWon && number === 10 ? styles.tableFound : ''} ${wrongTable === number ? styles.tableWrong : ''}`}
                  onClick={() => chooseTable(number, index)}
                  aria-label={`Meja ${number}`}
                >
                  {number}
                </button>
              ))}
            </div>
            <p className={styles.gameFeedback} aria-live="polite" role="status">{gameFeedback}</p>
            <button type="button" className={styles.gameRestart} onClick={restartGame}>Main lagi</button>
          </div>
        )}
      </div>
    </section>
  );
}
