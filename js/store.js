// Perfiles y progreso guardados en el navegador. Si el almacenamiento no está disponible
// (ventana privada, previsualizaciones) el juego sigue funcionando en memoria.

import { emptyCard, recordAnswer, updateBox } from './adaptive.js';

const KEY = 'pio.v1';

export const DEFAULT_SETTINGS = {
  naming: 'solfege', // 'solfege' (Do Re Mi) o 'letters' (C D E)
  input: 'names', // 'names' (botones) o 'piano' (teclado)
  pianoLabels: true, // nombres escritos en las teclas
  sound: true,
  volume: 0.8,
  birds: true, // pájaros o cabezas de nota clásicas
  showAnswer: true, // enseñar el nombre correcto tras un fallo
  pace: 1, // multiplicador de tiempo según la edad: 1.8 (5-7 años), 1.5, 1.25, 1 (adulto), 0.85 rápido
  haptics: true,
  theme: 'auto',
  midi: false, // teclado MIDI conectado (Chrome/Edge)
  midiExact: false, // con MIDI, exigir la octava escrita
};

export const BIRD_COLORS = ['#2338C4', '#E0457B', '#0F8B6E', '#D9822B', '#7A3FC2', '#1F7FB8'];

let memory = { activeId: null, profiles: {} };

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) memory = JSON.parse(raw);
  } catch {
    /* sin almacenamiento: seguimos en memoria */
  }
  return memory;
}

function write() {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* sin almacenamiento: seguimos en memoria */
  }
}

read();

const pad2 = (n) => String(n).padStart(2, '0');
const today = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export function profiles() {
  return Object.values(memory.profiles).sort((a, b) => a.created - b.created);
}

export function activeProfile() {
  return memory.profiles[memory.activeId] ?? null;
}

export function setActive(id) {
  memory.activeId = id;
  write();
}

export function createProfile(name, color) {
  const id = `p${Date.now().toString(36)}`;
  memory.profiles[id] = {
    id,
    name: name.trim().slice(0, 18) || 'Jugador',
    color,
    created: Date.now(),
    settings: { ...DEFAULT_SETTINGS },
    progress: {}, // levelId -> { stars, best, plays }
    cards: {}, // 'treble:G4' -> tarjeta
    history: [], // sesiones recientes
    streak: { last: null, count: 0 },
    totals: { notes: 0, correct: 0 },
  };
  memory.activeId = id;
  write();
  return memory.profiles[id];
}

export function deleteProfile(id) {
  delete memory.profiles[id];
  if (memory.activeId === id) memory.activeId = profiles()[0]?.id ?? null;
  write();
}

export function settings() {
  return { ...DEFAULT_SETTINGS, ...(activeProfile()?.settings ?? {}) };
}

export function updateSettings(patch) {
  const p = activeProfile();
  if (!p) return;
  p.settings = { ...settings(), ...patch };
  write();
}

export function levelProgress(levelId) {
  return activeProfile()?.progress[levelId] ?? null;
}

// Guarda una partida terminada: respuestas por tarjeta, estrellas, racha de días e historial.
// session = { levelId, mode, completed, stars, score, answers: [{ key, correct, ms }], targetMs }
export function recordSession(session) {
  const p = activeProfile();
  if (!p) return;
  const now = Date.now();
  const byKey = {};
  for (const a of session.answers) {
    p.totals.notes++;
    if (a.correct) p.totals.correct++;
    if (session.noCards) continue; // niveles de concepto (línea o espacio): no son notas con nombre
    const card = (p.cards[a.key] ??= emptyCard());
    recordAnswer(card, a.correct, a.ms, now, a.given);
    (byKey[a.key] ??= []).push(a);
  }
  for (const [key, results] of Object.entries(byKey)) updateBox(p.cards[key], results, session.targetMs, now);

  if (session.levelId) {
    const prev = p.progress[session.levelId] ?? { stars: 0, best: 0, plays: 0 };
    p.progress[session.levelId] = {
      stars: Math.max(prev.stars, session.completed ? session.stars : 0),
      best: Math.max(prev.best, session.score),
      plays: prev.plays + 1,
    };
  }

  // Racha de días. Un día sin jugar se perdona una vez por semana (la racha se "repara").
  const t = today();
  if (p.streak.last !== t) {
    const yesterday = today(new Date(now - 864e5));
    const twoDaysAgo = today(new Date(now - 2 * 864e5));
    const canRepair = !p.streak.repaired || now - p.streak.repaired > 7 * 864e5;
    if (p.streak.last === yesterday) p.streak = { ...p.streak, last: t, count: p.streak.count + 1 };
    else if (p.streak.last === twoDaysAgo && canRepair) p.streak = { last: t, count: p.streak.count + 1, repaired: now };
    else p.streak = { last: t, count: 1 };
  }

  const n = session.answers.length;
  const ok = session.answers.filter((a) => a.correct).length;
  p.history = [
    ...p.history,
    { date: now, levelId: session.levelId, mode: session.mode, n, ok, score: session.score, stars: session.stars },
  ].slice(-200);
  write();
}

export function notesToday() {
  const p = activeProfile();
  if (!p) return 0;
  const t = today();
  return p.history.filter((h) => today(new Date(h.date)) === t).reduce((s, h) => s + h.n, 0);
}

// Copia de seguridad de un jugador, para cambiar de móvil o enseñársela al profesor.
export function exportProfile() {
  const p = activeProfile();
  return p ? JSON.stringify({ app: 'pio', version: 1, profile: p }, null, 1) : null;
}

export function importProfile(json) {
  const data = JSON.parse(json);
  if (data?.app !== 'pio' || !data.profile?.id) throw new Error('El archivo no es una copia de Pío.');
  const p = data.profile;
  memory.profiles[p.id] = { ...p, settings: { ...DEFAULT_SETTINGS, ...p.settings } };
  memory.activeId = p.id;
  write();
  return p;
}
