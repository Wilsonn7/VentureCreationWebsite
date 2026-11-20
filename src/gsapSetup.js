import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { Flip } from 'gsap/Flip';

// Daftarkan plugin GSAP satu kali untuk seluruh aplikasi.
gsap.registerPlugin(ScrollTrigger, Draggable, Flip);

export { gsap, ScrollTrigger, Draggable, Flip };
