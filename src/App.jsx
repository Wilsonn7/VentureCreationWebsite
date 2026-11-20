import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWA from './components/layout/FloatingWA';
import './gsapSetup';
import Hero from './components/sections/Hero';
import LayananPicker from './components/sections/LayananPicker';
import UpdateFeed from './components/sections/UpdateFeed';
import QuizHelper from './components/sections/QuizHelper';
import EventCountdown from './components/sections/EventCountdown';
import Promosi from './components/sections/Promosi';
import LinkHub from './components/sections/LinkHub';
import Loader from './components/fun/Loader';
import CursorBlob from './components/fun/CursorBlob';
import ScrollProgress from './components/fun/ScrollProgress';
import RandomFact from './components/fun/RandomFact';
import SoundToggle from './components/fun/SoundToggle';
import Confetti from './components/fun/Confetti';
import DressTitik from './components/fun/DressTitik';
import { getEvents } from './services/api';
import EventBanner from './components/sections/EventBanner';
import { playClick } from './services/audio';

export default function App() {
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const celebrate = () => setConfettiTrigger(Date.now());
    window.addEventListener('publicles-confetti', celebrate);
    return () => window.removeEventListener('publicles-confetti', celebrate);
  }, []);

  useEffect(() => { getEvents().then(setEvents); }, []);

  const firstEvent = events[0];

  useEffect(() => {
    const handleClick = (event) => {
      const control = event.target.closest?.('button, a[href], [role="tab"]');
      if (!control) return;

      if (control.closest('[data-sound="titik"]')) {
        playClick('titik');
      } else if (control.matches('[data-sound="success"]') || control.closest('[data-sound="success"]')) {
        playClick('success');
      } else {
        playClick('normal');
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Lewati ke konten</a>
      {window.location.pathname !== '/links' && <Navbar />}
      {window.location.pathname !== '/links' && firstEvent && <EventBanner event={firstEvent} />}
      {window.location.pathname === '/links' ? <LinkHub /> : <><main id="main-content"><Hero /><LayananPicker /><UpdateFeed /><QuizHelper />{firstEvent && <EventCountdown event={firstEvent} />}<Promosi /></main><Footer /></>}
      {window.location.pathname !== '/links' && <><FloatingWA /><RandomFact /><SoundToggle /><DressTitik /></>}
      <Loader />
      <ScrollProgress />
      <CursorBlob />
      <Confetti trigger={confettiTrigger} />
    </>
  );
}
