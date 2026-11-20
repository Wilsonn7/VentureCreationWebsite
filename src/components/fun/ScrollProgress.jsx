import { useEffect, useState } from 'react';
import styles from './ScrollProgress.module.css';

export default function ScrollProgress(){const [progress,setProgress]=useState(0);useEffect(()=>{const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;setProgress(max>0?scrollY/max*100:0)};addEventListener('scroll',update,{passive:true});update();return()=>removeEventListener('scroll',update)},[]);return <div className={styles.track} aria-hidden="true"><div className={styles.fill} style={{width:`${progress}%`}}><span /></div></div>}
