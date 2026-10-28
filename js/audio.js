// Sonido sintetizado con Web Audio: un piano sencillo para las notas y efectos cortos.
// iOS solo deja sonar el audio después de un toque, por eso unlock() se llama en el primer pointerdown.

import { frequency } from './music.js';

let ctx = null;
let master = null;
let enabled = true;
let volume = 0.8;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = volume;
  const comp = ctx.createDynamicsCompressor();
  master.connect(comp).connect(ctx.destination);
  return ctx;
}

export function unlock() {
  const c = ensure();
  if (c && c.state === 'suspended') c.resume();
}

export function configure({ sound, volume: v }) {
  enabled = sound;
  volume = v;
  if (master) master.gain.value = v;
}

function voice(freq, t, { dur = 1.4, type = 'sine', gain = 0.3, attack = 0.004 } = {}) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master);
  osc.start(t);
  osc.stop(t + dur + 0.05);
  return osc;
}

// Nota de piano: parciales con algo de inarmonía y caída más rápida en los agudos.
export function playMidi(m, { when = 0, dur = 1.3, gain = 0.32 } = {}) {
  if (!enabled || !ensure()) return;
  const t = ctx.currentTime + when;
  const f = frequency(m);
  const d = dur * Math.max(0.45, 1 - (m - 60) / 60);
  const partials = [1, 2, 3, 4, 5];
  const amps = [1, 0.42, 0.2, 0.1, 0.05];
  partials.forEach((p, i) => {
    voice(f * p * (1 + 0.0004 * p * p), t, { dur: d / (1 + i * 0.5), gain: gain * amps[i], type: i ? 'sine' : 'triangle' });
  });
}

export function playSequence(midis, gap = 0.16) {
  midis.forEach((m, i) => playMidi(m, { when: i * gap, dur: 0.9, gain: 0.24 }));
}

// Ritmo con golpes cortos (negra = 0,55 s); los valores negativos son silencios.
export function playRhythm(values, beat = 0.55) {
  if (!enabled || !ensure()) return;
  let t = ctx.currentTime + 0.05;
  values.forEach((v, i) => {
    if (v > 0) {
      const osc = voice(i === 0 ? 1320 : 1046, t, { dur: Math.min(0.25, v * beat * 0.8), type: 'triangle', gain: 0.18, attack: 0.002 });
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.08);
    }
    t += Math.abs(v) * beat;
  });
}

export function sfx(kind) {
  if (!enabled || !ensure()) return;
  const t = ctx.currentTime;
  if (kind === 'wrong') {
    const osc = voice(220, t, { dur: 0.22, type: 'square', gain: 0.06 });
    osc.frequency.exponentialRampToValueAtTime(110, t + 0.2);
  } else if (kind === 'escape') {
    const osc = voice(1400, t, { dur: 0.35, type: 'sine', gain: 0.08 });
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.3);
  } else if (kind === 'chirp') {
    const osc = voice(2600, t, { dur: 0.09, type: 'sine', gain: 0.05 });
    osc.frequency.exponentialRampToValueAtTime(3400, t + 0.07);
  } else if (kind === 'win') {
    playSequence([72, 76, 79, 84], 0.11);
  } else if (kind === 'lose') {
    playSequence([67, 63, 60], 0.18);
  } else if (kind === 'star') {
    voice(1568, t, { dur: 0.5, gain: 0.08 });
    voice(2349, t + 0.04, { dur: 0.45, gain: 0.05 });
  }
}

// ---------- música de fondo de los menús ----------
// Acordes suaves (Do maj7, La m7, Fa maj7, Sol 6) que cambian cada 4 s y algún canto de pájaro lejano.
// Se para durante las partidas para no tapar las notas.

const CHORDS = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]];
let ambient = null;

export function startAmbient() {
  if (!enabled || ambient || !ensure()) return;
  const bus = ctx.createGain();
  bus.gain.value = 0;
  bus.gain.linearRampToValueAtTime(1, ctx.currentTime + 2);
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 1100;
  bus.connect(lp).connect(master);
  let i = 0;
  const pad = () => {
    const t = ctx.currentTime;
    for (const m of CHORDS[i % CHORDS.length]) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = frequency(m);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.022, t + 1.4);
      g.gain.linearRampToValueAtTime(0, t + 4.4);
      osc.connect(g).connect(bus);
      osc.start(t);
      osc.stop(t + 4.6);
    }
    i++;
  };
  const chirp = () => {
    const t = ctx.currentTime;
    const base = 2200 + Math.random() * 1400;
    for (let k = 0; k < 3; k++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.setValueAtTime(base, t + k * 0.12);
      osc.frequency.exponentialRampToValueAtTime(base * 1.35, t + k * 0.12 + 0.07);
      g.gain.setValueAtTime(0, t + k * 0.12);
      g.gain.linearRampToValueAtTime(0.012, t + k * 0.12 + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + k * 0.12 + 0.09);
      osc.connect(g).connect(bus);
      osc.start(t + k * 0.12);
      osc.stop(t + k * 0.12 + 0.1);
    }
  };
  pad();
  const padTimer = setInterval(pad, 4000);
  let chirpTimer;
  const nextChirp = () => { chirpTimer = setTimeout(() => { chirp(); nextChirp(); }, 6000 + Math.random() * 7000); };
  nextChirp();
  ambient = { bus, stop: () => { clearInterval(padTimer); clearTimeout(chirpTimer); } };
}

export function stopAmbient() {
  if (!ambient) return;
  const a = ambient;
  ambient = null;
  a.stop();
  a.bus.gain.cancelScheduledValues(ctx.currentTime);
  a.bus.gain.setValueAtTime(a.bus.gain.value, ctx.currentTime);
  a.bus.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  setTimeout(() => a.bus.disconnect(), 800);
}
