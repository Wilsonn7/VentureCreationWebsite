import { useEffect, useRef } from 'react';
import { Draggable, gsap } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './StickerBoard.module.css';

const stickers = [['KTP','KTP elektronik','-3deg'],['KK','Kartu Keluarga','4deg'],['SIM','Surat Izin Mengemudi','-6deg'],['PASPOR','Dokumen perjalanan','5deg'],['AKTA','Akta kelahiran','-2deg']];
const patterns = ['scatter','grid','orbit','diagonal','wave','stack'];
export default function StickerBoard() {
  const board = useRef(null);
  const previousPattern = useRef(-1);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || !board.current) return;
    const list = Draggable.create(board.current.querySelectorAll('[data-sticker]'), {
      type:'x,y', bounds:board.current, inertia:true,
      onPress:function(){ this.target.dataset.dragging='true'; gsap.to(this.target,{scale:1.06,zIndex:20,duration:.15}); },
      onRelease:function(){ delete this.target.dataset.dragging; gsap.to(this.target,{scale:1,zIndex:1,duration:.25}); },
    });
    return () => list.forEach((item) => item.kill());
  }, [reduced]);

  const randomize = () => {
    if (!board.current) return;
    let index;
    do index = Math.floor(Math.random() * patterns.length); while (index === previousPattern.current);
    previousPattern.current = index;
    const pattern = patterns[index];
    const items = [...board.current.querySelectorAll('[data-sticker]')];
    const rect = board.current.getBoundingClientRect();
    const cardW = rect.width < 420 ? 130 : 160;
    const cardH = rect.width < 420 ? 94 : 110;
    const cx = rect.width / 2 - cardW / 2;
    const cy = rect.height / 2 - cardH / 2;
    const placed = [];

    items.forEach((item, itemIndex) => {
      if (item.dataset.dragging === 'true') return;
      let position;
      if (pattern === 'scatter') {
        let accepted = null;
        for (let tries = 0; tries < 100; tries++) {
          const candidate = { x: 8 + Math.random() * Math.max(20, rect.width - cardW - 16), y: 28 + Math.random() * Math.max(30, rect.height - cardH - 36) };
          accepted = candidate;
          const overlapOk = placed.every((other) => {
            const w = Math.max(0, Math.min(candidate.x + cardW, other.x + cardW) - Math.max(candidate.x, other.x));
            const h = Math.max(0, Math.min(candidate.y + cardH, other.y + cardH) - Math.max(candidate.y, other.y));
            return (w * h) / (cardW * cardH) <= .25;
          });
          if (overlapOk) break;
        }
        position = accepted;
        placed.push(position);
      } else if (pattern === 'grid') {
        const col = itemIndex % 3; const row = Math.floor(itemIndex / 3);
        position = { x: cx - 170 + col * 170, y: cy - 65 + row * 130 }; 
      } else if (pattern === 'orbit') {
        const angle = itemIndex / items.length * Math.PI * 2 - Math.PI / 2;
        position = { x: cx + Math.cos(angle) * Math.min(rect.width * .29, 150), y: cy + Math.sin(angle) * Math.min(rect.height * .28, 120) };
      } else if (pattern === 'diagonal') {
        position = { x: 20 + itemIndex * 72, y: 28 + itemIndex * 58 };
      } else if (pattern === 'wave') {
        position = { x: 20 + itemIndex * (rect.width - cardW - 40) / (items.length - 1), y: cy + Math.sin(itemIndex * 1.4) * 85 };
      } else {
        position = { x: cx + (itemIndex - 2) * 10, y: cy + (itemIndex - 2) * 12 };
      }

      position.x = Math.max(4, Math.min(rect.width - cardW - 4, position.x + (Math.random() - .5) * 24));
      position.y = Math.max(24, Math.min(rect.height - cardH - 4, position.y + (Math.random() - .5) * 24));
      const rotation = Math.round((Math.random() * 16 - 8) * 10) / 10;
      const scale = .92 + Math.random() * .16;
      const dx = position.x - (item.offsetLeft || 0);
      const dy = position.y - (item.offsetTop || 0);
      gsap.to(item, { x: dx, y: dy, rotation, scale, duration: reduced ? 0 : .55, delay: reduced ? 0 : itemIndex * .05, ease:'back.out(1.5)' });
    });
  };

  return <div ref={board} className={styles.board} aria-label="Stiker dokumen yang bisa diseret"><button type="button" className={styles.random} onClick={randomize}>Acak posisi</button>{stickers.map(([title,subtitle,rotation]) => <button key={title} data-sticker type="button" className={styles.sticker} style={{'--rotation':rotation}} aria-label={`Geser ${title}; tekan untuk membaca nama dokumen`} onDoubleClick={(event)=>{event.currentTarget.querySelector('small').textContent=subtitle}}><strong>{title}</strong><small>{subtitle}</small></button>)}</div>;
}
