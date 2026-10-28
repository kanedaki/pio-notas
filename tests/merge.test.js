import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mergeStores, mergeProfile, computeStreak, computeTotals, dayKey } from '../js/merge.js';

const base = (over = {}) => ({
  id: 'p1', name: 'Lucía', updatedAt: 1, settings: { pace: 1 }, settingsAt: 1,
  progress: {}, cards: {}, history: [], saved: null, ...over,
});

test('estrellas y récords se quedan con el máximo', () => {
  const a = base({ progress: { 'sol-1': { stars: 2, best: 900, plays: 3 } } });
  const b = base({ progress: { 'sol-1': { stars: 3, best: 700, plays: 1 }, 'sol-2': { stars: 1, best: 100, plays: 1 } } });
  const m = mergeProfile(a, b);
  assert.deepEqual(m.progress['sol-1'], { stars: 3, best: 900, plays: 3 });
  assert.equal(m.progress['sol-2'].stars, 1);
});

test('el historial se une sin duplicados y las tarjetas se quedan con la más reciente', () => {
  const h1 = { date: 10, levelId: 'a', mode: 'x', n: 20, ok: 18 };
  const h2 = { date: 20, levelId: 'b', mode: 'x', n: 20, ok: 20 };
  const a = base({ history: [h1], cards: { 'treble:G4': { seen: 5, last: 100 } } });
  const b = base({ history: [h1, h2], cards: { 'treble:G4': { seen: 3, last: 200 }, 'bass:F3': { seen: 1, last: 5 } } });
  const m = mergeProfile(a, b);
  assert.equal(m.history.length, 2);
  assert.equal(m.cards['treble:G4'].last, 200);
  assert.ok(m.cards['bass:F3']);
  assert.deepEqual(computeTotals(m.history), { notes: 40, correct: 38 });
});

test('ajustes y partida guardada: gana lo último', () => {
  const a = base({ settings: { pace: 1.5 }, settingsAt: 50, saved: { at: 10, arg: 'sol-3' } });
  const b = base({ settings: { pace: 1 }, settingsAt: 40, saved: { at: 30, cleared: true } });
  const m = mergeProfile(a, b);
  assert.equal(m.settings.pace, 1.5);
  assert.equal(m.saved.cleared, true);
});

test('perfiles borrados no vuelven', () => {
  const m = mergeStores({ profiles: { p1: base(), p2: base({ id: 'p2' }) } }, { profiles: { p1: base() }, deleted: { p2: 99 } });
  assert.deepEqual(Object.keys(m.profiles), ['p1']);
  assert.equal(m.deleted.p2, 99);
});

test('racha de días con un día perdonado', () => {
  const now = new Date(2026, 9, 28, 18);
  const at = (d) => ({ date: new Date(2026, 9, d, 17).getTime() });
  assert.equal(computeStreak([at(26), at(27), at(28)], now), 3);
  assert.equal(computeStreak([at(26), at(27)], now), 2); // hoy aún no ha jugado
  assert.equal(computeStreak([at(24), at(25), at(27), at(28)], now), 4); // falta el 26: se perdona
  assert.equal(computeStreak([at(20)], now), 0);
  assert.equal(dayKey(now), '2026-10-28');
});
