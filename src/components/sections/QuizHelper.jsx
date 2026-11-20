import { useRef, useState } from 'react';
import { gsap } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './QuizHelper.module.css';

const questions=[
 {q:'Kamu mau urus apa?',options:[['KTP','ktp'],['KK','kk'],['SIM','sim'],['Paspor','paspor']]},
 {q:'Sudah berusia 17 tahun?',options:[['Sudah','ya'],['Belum','belum']]},
 {q:'Domisili sudah sesuai KK?',options:[['Sudah sesuai','sesuai'],['Masih perlu diperbarui','ubah']]},
];
export default function QuizHelper(){const [step,setStep]=useState(-1);const [answers,setAnswers]=useState([]);const card=useRef(null);const reduced=useReducedMotion();const next=(answer)=>{const values=[...answers,answer];setAnswers(values);if(!reduced&&card.current){gsap.timeline().to(card.current,{x:-80,rotate:-3,opacity:0,duration:.22,ease:'power2.in'}).call(()=>setStep(s=>s+1)).fromTo(card.current,{x:80,rotate:3,opacity:0},{x:0,rotate:0,opacity:1,duration:.45,ease:'back.out(1.4)'})}else setStep(v=>v+1)};const restart=()=>{setStep(-1);setAnswers([])};const started=step>=0;const result=step>=questions.length;
 return <section id="quiz" className={styles.section} aria-labelledby="quiz-title"><div className={styles.inner}><div ref={card} className={styles.card}>{step<0&&!started&&<><h2 id="quiz-title" className={styles.title}>Dokumenmu sudah lengkap belum?</h2><p>Ikuti kuis singkat untuk mendapatkan arah yang paling pas.</p><button className={styles.resultButton} type="button" onClick={()=>next(null)}>Mulai cek</button></>}{started&&step<questions.length&&<><h2 id="quiz-title" className={styles.title}>{questions[step].q}</h2><div className={styles.progress} aria-label={`Pertanyaan ${step+1} dari ${questions.length}`}><div style={{width:`${((step+1)/questions.length)*100}%`}} /></div><div className={styles.options}>{questions[step].options.map(([label,value])=><button key={value} type="button" className={styles.option} onClick={()=>next(value)}>{label}</button>)}</div></>}{result&&<><h2 id="quiz-title" className={styles.title}>Kamu perlu siapkan ini</h2><p>{answers.includes('belum')?'Untuk KTP, pastikan usia dan persyaratan sesuai ketentuan setempat.':answers.includes('ubah')?'Kamu disarankan memperbarui KK atau domisili terlebih dahulu.':'Bawa identitas, KK, dan dokumen pendukung sesuai layanan yang dipilih.'}</p><div className={styles.actions}><a className={styles.resultButton} href="#layanan">Buka panduan layanan</a><button className={styles.restart} type="button" onClick={restart}>Ulangi</button></div></>}</div></div></section>
}
