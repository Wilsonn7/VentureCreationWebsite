import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isClickSoundEnabled, setClickSoundEnabled, playClick } from '../../services/audio';
import styles from './SoundToggle.module.css';

export default function SoundToggle() {
  const [on, setOn] = useState(isClickSoundEnabled);

  const toggle = () => {
    const next = !on;
    setOn(next);
    setClickSoundEnabled(next);
    if (next) playClick('normal');
  };

  return (
    <button
      type="button"
      className={styles.button}
      aria-pressed={on}
      aria-label={on ? 'Matikan suara klik' : 'Nyalakan suara klik'}
      title={on ? 'Suara nyala' : 'Suara mati'}
      onClick={toggle}
    >
      {on ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
      Suara: {on ? 'nyala' : 'mati'}
    </button>
  );
}
