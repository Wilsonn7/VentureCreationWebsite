import { useEffect } from 'react';
import { gsap } from '../../gsapSetup';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function Confetti({ trigger }){const reduced=useReducedMotion();useEffect(()=>{if(!trigger||reduced)return;const pieces=[];for(let i=0;i<48;i++){const el=document.createElement('span');Object.assign(el.style,{position:'fixed',zIndex:'3000',left:`${Math.random()*100}vw`,top:'-20px',width:`${6+Math.random()*8}px`,height:`${6+Math.random()*8}px`,borderRadius:'50%',background:i%3?'#FFD43B':'#FFFFFF',pointerEvents:'none'});document.body.appendChild(el);pieces.push(el)}gsap.to(pieces,{y:'110vh',x:'+=random(-120,120)',rotation:'random(-360,360)',duration:.9+Math.random(),ease:'power2.in',onComplete(){pieces.forEach(el=>el.remove())}})},[trigger,reduced]);return null}
