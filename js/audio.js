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
