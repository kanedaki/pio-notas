// Jugadores y progreso guardados en el navegador. Si el almacenamiento no está disponible
// (ventana privada, previsualizaciones) el juego sigue funcionando en memoria.
// Con un código de sincronización, los datos se fusionan con los del servidor (ver sync.js y merge.js).

import { emptyCard, recordAnswer, updateBox } from './adaptive.js';
import { mergeStores, computeStreak, computeTotals, dayKey } from './merge.js';

const KEY = 'pio.v1';

export const DEFAULT_SETTINGS = {
  naming: 'solfege', // 'solfege' (Do Re Mi), 'letters' (C D E) o 'german' (C D … H)
  input: 'names', // 'names' (botones) o 'piano' (teclado)
  pianoLabels: true, // nombres escritos en las teclas
  pianoOctave: 'auto', // 'auto' (octava escrita desde el gran pentagrama), 'exact' o 'any'
  sound: true,
  volume: 0.8,
  music: true, // música de fondo en los menús
  birds: true, // pájaros o cabezas de nota clásicas
  showAnswer: true, // enseñar el nombre correcto tras un fallo
  pace: 1, // multiplicador de tiempo: 1.8 (5-7 años), 1.5, 1.25, 1 (adulto), 0.85 rápido
  autoPace: true, // ajustar el ritmo solo para rondar el 85 % de aciertos
  haptics: true,
  theme: 'auto', // (antiguo) claro/oscuro; ahora manda el tema equipado
  skin: 'auto', // tema de color: 'auto' (Amanecer o Noche según el sistema) o uno de look.js
  largeText: false,
  highContrast: false,
  midi: false, // teclado MIDI conectado (Chrome/Edge)
  midiExact: false, // con MIDI, exigir la octava escrita
};

export const BIRD_COLORS = ['#2338C4', '#E0457B', '#0F8B6E', '#D9822B', '#7A3FC2', '#1F7FB8'];

let memory = { activeId: null, profiles: {}, deleted: {}, sync: null };
const listeners = new Set();

// Racha y totales salen del historial; baseTotals guarda lo contado antes de que existiera el historial completo.
function derive(p) {
  const t = computeTotals(p.history);
  p.totals = { notes: t.notes + (p.baseTotals?.notes ?? 0), correct: t.correct + (p.baseTotals?.correct ?? 0) };
  p.streak = { count: computeStreak(p.history) };
  return p;
}

function migrate(p) {
  if (p.v2) return p;
  const t = computeTotals(p.history ?? []);
  p.baseTotals = {
    notes: Math.max(0, (p.totals?.notes ?? 0) - t.notes),
    correct: Math.max(0, (p.totals?.correct ?? 0) - t.correct),
  };
  p.updatedAt ??= p.created ?? Date.now();
  p.settingsAt ??= 0;
  p.history ??= [];
  p.v2 = true;
  return p;
}

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) memory = { deleted: {}, sync: null, ...JSON.parse(raw) };
  } catch {
    /* sin almacenamiento: seguimos en memoria */
  }
  for (const p of Object.values(memory.profiles)) derive(migrate(p));
}

function write({ silent = false } = {}) {
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* sin almacenamiento: seguimos en memoria */
  }
  if (!silent) listeners.forEach((fn) => fn());
}

read();

// Avisa cuando cambian los datos por algo que hace la jugadora (para sincronizar).
export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function profiles() {
  return Object.values(memory.profiles).sort((a, b) => a.created - b.created);
}

export function activeProfile() {
  return memory.profiles[memory.activeId] ?? null;
}

export function setActive(id) {
  memory.activeId = id;
  write({ silent: true });
}

export function createProfile(name, color) {
  const id = `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  const now = Date.now();
  memory.profiles[id] = derive({
    id,
    v2: true,
    name: name.trim().slice(0, 18) || 'Jugadora',
    color,
    created: now,
    updatedAt: now,
    settings: { ...DEFAULT_SETTINGS },
    settingsAt: now,
    progress: {}, // levelId -> { stars, best, plays, passedDay, consolidated }
    cards: {}, // 'treble:G4' -> tarjeta
    history: [], // partidas jugadas
    saved: null, // partida a medias
    achievements: {}, // id -> fecha
    owned: {}, // objeto de la tienda -> fecha de compra
    daily: {}, // 'AAAA-MM-DD' -> fecha del reto hecho
    equipped: {},
    equippedAt: now,
  });
  memory.activeId = id;
  write();
  return memory.profiles[id];
}

export function deleteProfile(id) {
  delete memory.profiles[id];
  memory.deleted[id] = Date.now();
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
  p.settingsAt = Date.now();
  write();
}

// Cambios del perfil que no son ajustes (aspecto del pájaro, compras...).
export function updateProfile(fn) {
  const p = activeProfile();
  if (!p) return;
  fn(p);
  derive(p);
  write();
}

export function levelProgress(levelId) {
  return activeProfile()?.progress[levelId] ?? null;
}

// Guarda una partida terminada: respuestas por tarjeta, estrellas e historial.
// Un nivel queda «consolidado» al volver a superarlo otro día distinto del primero.
// session = { levelId, mode, stars, score, seeds, answers: [{ key, correct, ms, given }], targetMs, noCards }
export function recordSession(session) {
  const p = activeProfile();
  if (!p) return null;
  const now = Date.now();
  const today = dayKey();
  const byKey = {};
  for (const a of session.answers) {
    if (session.noCards) continue; // niveles de concepto (línea o espacio): no son notas con nombre
    const card = (p.cards[a.key] ??= emptyCard());
    recordAnswer(card, a.correct, a.ms, now, a.given);
    (byKey[a.key] ??= []).push(a);
  }
  for (const [key, results] of Object.entries(byKey)) updateBox(p.cards[key], results, session.targetMs, now);

  let consolidatedNow = false;
  if (session.levelId) {
    const prev = p.progress[session.levelId] ?? { stars: 0, best: 0, plays: 0 };
    const next = {
      ...prev,
      stars: Math.max(prev.stars, session.stars),
      best: Math.max(prev.best, session.score),
      plays: prev.plays + 1,
    };
    if (session.stars > 0) {
      if (!prev.passedDay) next.passedDay = today;
      else if (prev.passedDay !== today && !prev.consolidated) {
        next.consolidated = true;
        consolidatedNow = true;
      }
    }
    p.progress[session.levelId] = next;
  }

  const n = session.answers.length;
  const ok = session.answers.filter((a) => a.correct).length;
  p.history = [
    ...p.history,
    { date: now, levelId: session.levelId, mode: session.mode, n, ok, score: session.score, stars: session.stars, seeds: session.seeds ?? 0, fast: !!session.fast },
  ].slice(-5000);
  if (session.daily && session.stars > 0) p.daily = { ...(p.daily ?? {}), [today]: now };
  if (p.saved && !p.saved.cleared && p.saved.arg === session.arg) p.saved = { at: now, cleared: true };
  derive(p);
  write();
  return { consolidatedNow };
}

export function notesToday() {
  const p = activeProfile();
  if (!p) return 0;
  const t = dayKey();
  return p.history.filter((h) => dayKey(new Date(h.date)) === t).reduce((s, h) => s + h.n, 0);
}

// Prueba de nivel aprobada: todos los niveles del mundo quedan superados con al menos una estrella.
export function applyPlacement(levelIds) {
  const p = activeProfile();
  if (!p) return;
  const today = dayKey();
  for (const id of levelIds) {
    const prev = p.progress[id] ?? { stars: 0, best: 0, plays: 0 };
    p.progress[id] = { ...prev, stars: Math.max(1, prev.stars), passedDay: prev.passedDay ?? today, tested: true };
  }
  write();
}

// ---------- partida a medias ----------

export function saveGame(snapshot) {
  const p = activeProfile();
  if (!p) return;
  p.saved = { ...snapshot, at: Date.now() };
  write();
}

export function clearSaved() {
  const p = activeProfile();
  if (!p?.saved || p.saved.cleared) return;
  p.saved = { at: Date.now(), cleared: true };
  write();
}

export function savedGame() {
  const s = activeProfile()?.saved;
  return s && !s.cleared ? s : null;
}

// ---------- sincronización ----------

export const syncCode = () => memory.sync?.code ?? null;
export const lastSync = () => memory.sync?.last ?? null;

export function setSyncCode(code) {
  memory.sync = code ? { code, last: null } : null;
  write({ silent: true });
}

export const syncPayload = () => ({ profiles: memory.profiles, deleted: memory.deleted });

// Fusiona lo que llega del servidor con lo local. Devuelve true si algo cambió aquí.
export function applyRemote(remote) {
  const before = JSON.stringify(memory.profiles);
  const merged = mergeStores(syncPayload(), remote);
  for (const p of Object.values(merged.profiles)) derive(migrate(p));
  memory.profiles = merged.profiles;
  memory.deleted = merged.deleted;
  if (!memory.profiles[memory.activeId]) memory.activeId = profiles()[0]?.id ?? null;
  memory.sync = { ...(memory.sync ?? {}), last: Date.now() };
  write({ silent: true });
  return JSON.stringify(memory.profiles) !== before;
}

// ---------- copia de seguridad ----------

export function exportProfile() {
  const p = activeProfile();
  return p ? JSON.stringify({ app: 'pio', version: 2, profile: p }, null, 1) : null;
}

export function importProfile(json) {
  const data = JSON.parse(json);
  if (data?.app !== 'pio' || !data.profile?.id) throw new Error('El archivo no es una copia de Pío.');
  const p = migrate(data.profile);
  const merged = mergeStores(syncPayload(), { profiles: { [p.id]: { ...p, settings: { ...DEFAULT_SETTINGS, ...p.settings } } } });
  memory.profiles = merged.profiles;
  for (const q of Object.values(memory.profiles)) derive(q);
  memory.activeId = p.id;
  write();
  return memory.profiles[p.id];
}
