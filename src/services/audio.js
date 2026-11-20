const STORAGE_KEY = 'publicles-sound';

let context = null;
let enabled = localStorage.getItem(STORAGE_KEY) === 'true';
let lastPlayedAt = 0;

export function isClickSoundEnabled() {
  return enabled;
}

export function setClickSoundEnabled(next) {
  enabled = Boolean(next);
  localStorage.setItem(STORAGE_KEY, String(enabled));
}

async function getContext() {
  if (!context) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    context = new AudioContextClass();
  }
  if (context.state === 'suspended') {
    await context.resume();
  }
  return context;
}

export async function playClick(type = 'normal') {
  if (!enabled) return;

  const now = performance.now();
  if (now - lastPlayedAt < 60) return;
  lastPlayedAt = now;

  const ctx = await getContext();
  if (!ctx) return;

  const presets = {
    normal: { frequency: 440, duration: 0.055, volume: 0.12 },
    success: { frequency: 660, duration: 0.08, volume: 0.16 },
    titik: { frequency: 330, duration: 0.08, volume: 0.14 },
  };
  const preset = presets[type] || presets.normal;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const start = ctx.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(preset.frequency, start);
  gain.gain.setValueAtTime(preset.volume, start);
  gain.gain.exponentialRampToValueAtTime(0.001, start + preset.duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + preset.duration);
}
