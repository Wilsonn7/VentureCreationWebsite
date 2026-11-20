import { useEffect, useState } from 'react';
import { Bell, Share2 } from 'lucide-react';
import { getUpdates } from '../../services/api';
import { Flip } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './UpdateFeed.module.css';

export default function UpdateFeed() {
  const [items,setItems]=useState([]); const [filter,setFilter]=useState('Semua'); const reduced=useReducedMotion();
  useEffect(()=>{getUpdates().then(setItems)},[]);
  const shown=filter==='Semua'||filter==='Biaya'?items.filter(item=>filter==='Semua'||item.kategori===filter):items.filter(item=>item.kategori===filter);
  const changeFilter=(value)=>{const grid=document.querySelector('[data-update-grid]'); if(!reduced&&grid){const state=Flip.getState(grid.children,{props:'opacity,transform'}); setFilter(value); requestAnimationFrame(()=>Flip.from(state,{duration:.45,ease:'power3.out',stagger:.03,absolute:true}))}else setFilter(value)};
  const share=async(item)=>{const url=location.href+'#update'; if(navigator.share) await navigator.share({title:item.judul,text:item.ringkas,url}); else await navigator.clipboard?.writeText(url)};
  const remind=(id)=>{localStorage.setItem(`publicles-remind-${id}`,JSON.stringify(true))};
  return <section id="update" className={styles.section} aria-labelledby="update-title"><div className={styles.inner}><h2 id="update-title" className={styles.title}>Kabar Terbaru</h2><div className={styles.filters} aria-label="Filter kabar">{['Semua','KTP','KK','SIM','Paspor','Akta','Biaya'].map(value=><button key={value} type="button" className={`${styles.filter} ${filter===value?styles.active:''}`} aria-pressed={filter===value} onClick={()=>changeFilter(value)}>{value}</button>)}</div><div data-update-grid className={styles.grid}>{shown.map(item=><article key={item.id} className={styles.card}><div><span className={`${styles.badge} ${item.jenis==='Terverifikasi'?styles.verified:item.jenis==='Perubahan penting'?styles.danger:''}`}>{item.jenis}</span><h3>{item.judul}</h3><p>{item.ringkas}</p></div><div><a className={styles.source} href={item.sumber.url} target="_blank" rel="noreferrer">Sumber: {item.sumber.nama}</a><div className={styles.actions}><button type="button" onClick={()=>share(item)}><Share2 size={16} aria-hidden="true"/> Bagikan</button><button type="button" onClick={()=>remind(item.id)}><Bell size={16} aria-hidden="true"/> Ingatkan</button></div></div></article>)}</div></div></section>
}
