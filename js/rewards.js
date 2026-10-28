// Recompensas: alpiste (la moneda de la tienda), logros y reto del día.
// El alpiste no se guarda como saldo: se calcula con lo ganado en cada partida, los logros y lo
// comprado, así que siempre cuadra al sincronizar entre dispositivos.

import { LEVELS, levelById, isUnlocked, nextToPlay } from './curriculum.js';
import { priceOf } from './look.js';
import { dayKey } from './merge.js';

const passed = (p, ids) => ids.every((id) => (p.progress[id]?.stars ?? 0) > 0);
const worldLevels = (w) => LEVELS.filter((l) => l.world === w).map((l) => l.id);
const count = (p, fn) => Object.entries(p.progress).filter(([id, x]) => fn(x, id)).length;

export const ACHIEVEMENTS = [
  { id: 'primera-estrella', name: 'Primera estrella', text: 'Supera tu primer nivel.', reward: 20, test: (p) => count(p, (x) => x.stars > 0) >= 1 },
  { id: 'perfecto', name: 'Perfecto', text: 'Consigue 3 estrellas en un nivel.', reward: 30, test: (p) => count(p, (x) => x.stars === 3) >= 1 },
  { id: 'perfecto-10', name: 'Diez perfectos', text: '3 estrellas en 10 niveles.', reward: 80, test: (p) => count(p, (x) => x.stars === 3) >= 10 },
  { id: 'racha-3', name: 'Tres días seguidos', text: 'Juega 3 días seguidos.', reward: 30, test: (p) => p.streak.count >= 3 },
  { id: 'racha-7', name: 'Una semana', text: 'Juega 7 días seguidos.', reward: 70, test: (p) => p.streak.count >= 7 },
  { id: 'racha-30', name: 'Un mes de música', text: 'Juega 30 días seguidos.', reward: 200, test: (p) => p.streak.count >= 30 },
  { id: 'notas-100', name: '100 respuestas', text: 'Responde 100 preguntas.', reward: 20, test: (p) => p.totals.notes >= 100 },
  { id: 'notas-1000', name: '1000 respuestas', text: 'Responde 1000 preguntas.', reward: 80, test: (p) => p.totals.notes >= 1000 },
  { id: 'notas-5000', name: '5000 respuestas', text: 'Responde 5000 preguntas.', reward: 200, test: (p) => p.totals.notes >= 5000 },
  { id: 'clave-sol', name: 'Clave de sol', text: 'Supera todo el pentagrama de sol.', reward: 60, test: (p) => passed(p, [...worldLevels('sol1'), ...worldLevels('sol2')]) },
  { id: 'clave-fa', name: 'Clave de fa', text: 'Supera todo el pentagrama de fa.', reward: 60, test: (p) => passed(p, [...worldLevels('fa1'), ...worldLevels('fa2')]) },
  { id: 'gran-pentagrama', name: 'Gran pentagrama', text: 'Supera el mundo del gran pentagrama.', reward: 80, test: (p) => passed(p, worldLevels('gran1')) },
  { id: 'teoria-10', name: 'Teórica', text: 'Supera 10 niveles de teoría.', reward: 60, test: (p) => count(p, (x, id) => x.stars > 0 && levelById(id)?.area === 'teoria') >= 10 },
  { id: 'consolidados-10', name: 'Memoria de elefante', text: 'Consolida 10 niveles (superados en dos días).', reward: 80, test: (p) => count(p, (x) => x.consolidated) >= 10 },
  { id: 'colibri', name: 'Colibrí', text: 'Responde en menos de 1 segundo de media en un nivel con 3 estrellas.', reward: 60, test: (p) => p.history.some((h) => h.fast) },
  { id: 'reto-7', name: 'Siete retos', text: 'Completa 7 retos del día.', reward: 70, test: (p) => Object.keys(p.daily ?? {}).length >= 7 },
  { id: 'coleccion', name: 'Coleccionista', text: 'Consigue 5 cosas de la tienda.', reward: 50, test: (p) => Object.keys(p.owned ?? {}).length >= 5 },
];

export function seedsBalance(p) {
  const earned = p.history.reduce((s, h) => s + (h.seeds ?? 0), 0);
  const prizes = ACHIEVEMENTS.filter((a) => p.achievements?.[a.id]).reduce((s, a) => s + a.reward, 0);
  const spent = Object.keys(p.owned ?? {}).reduce((s, id) => s + priceOf(id), 0);
  return earned + prizes - spent;
}

// Alpiste de una partida: 1 por acierto, 10 por cada estrella nueva, 15 al consolidar, 30 por el reto.
export function seedsFor(p, { levelId, answers, stars, daily }) {
  const prev = levelId ? p.progress[levelId] : null;
  let seeds = answers.filter((a) => a.correct).length;
  seeds += 10 * Math.max(0, stars - (prev?.stars ?? 0));
  if (prev?.passedDay && prev.passedDay !== dayKey() && !prev.consolidated && stars > 0) seeds += 15;
  if (daily && stars > 0) seeds += 30;
  return seeds;
}

// Logros que se acaban de conseguir (aún no apuntados en el perfil).
export function newAchievements(p) {
  return ACHIEVEMENTS.filter((a) => !p.achievements?.[a.id] && a.test(p));
}

// Reto del día: un nivel ya superado (o el siguiente, si aún no hay), con un giro.
// Es el mismo todo el día, en cualquier dispositivo.
export function dailyChallenge(p, date = dayKey()) {
  let h = 2166136261;
  for (const c of `${date}:${p.id}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const done = LEVELS.filter((l) => (p.progress[l.id]?.stars ?? 0) > 0 && isUnlocked(l.id, p.progress));
  const level = done.length ? done[h % done.length] : nextToPlay(p.progress);
  const theory = level.area === 'teoria';
  return {
    date,
    levelId: level.id,
    twist: theory ? 'perfecto' : 'rapido',
    title: theory ? `${level.title}, sin fallos` : `${level.title}, a toda velocidad`,
    text: theory ? 'Acierta el 95 % para superarlo.' : 'Los pájaros van más deprisa de lo normal.',
    done: !!p.daily?.[date],
  };
}
