import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSelector, updateBox, emptyCard, recordAnswer, masteryLevel, reviewKeys, BOX_INTERVALS } from '../js/adaptive.js';

const seeded = (seed = 1) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const pool = ['a', 'b', 'c', 'd'].map((key) => ({ key }));

test('el selector recorre todo el conjunto antes de elegir por peso', () => {
  const sel = makeSelector(pool, {}, { count: 20, targetMs: 2000, rnd: seeded(3) });
  const first = Array.from({ length: 4 }, () => sel.next().key);
  assert.deepEqual([...first].sort(), ['a', 'b', 'c', 'd']);
});

test('nunca repite la misma nota dos veces seguidas', () => {
  const sel = makeSelector(pool, {}, { count: 200, targetMs: 2000, rnd: seeded(7) });
  let last = null;
  for (let i = 0; i < 200; i++) {
    const k = sel.next().key;
    assert.notEqual(k, last);
    last = k;
  }
});

test('tras un fallo la nota vuelve a los 2-3 turnos y a los 6-8', () => {
  const big = Array.from({ length: 12 }, (_, i) => ({ key: `n${i}` }));
  const sel = makeSelector(big, {}, { count: 20, targetMs: 2000, rnd: seeded(11) });
  const first = sel.next();
  sel.reinforce(first);
  const seq = Array.from({ length: 9 }, () => sel.next().key);
  const hits = seq.map((k, i) => (k === first.key ? i + 2 : null)).filter(Boolean);
  assert.equal(hits.length, 2);
  assert.ok(hits[0] >= 2 && hits[0] <= 4, `primera vuelta en el turno ${hits[0]}`);
  assert.ok(hits[1] >= 6 && hits[1] <= 9, `segunda vuelta en el turno ${hits[1]}`);
});

test('las notas que se fallan salen más', () => {
  const cards = { a: { ...emptyCard(), seen: 10, recent: [false, false, true, false, false], times: [] } };
  for (const k of ['b', 'c', 'd']) cards[k] = { ...emptyCard(), seen: 10, recent: [true, true, true, true, true], times: [900] };
  const sel = makeSelector(pool, cards, { count: 4, targetMs: 2000, rnd: seeded(5) });
  const counts = {};
  for (let i = 0; i < 2000; i++) {
    const k = sel.next().key;
    counts[k] = (counts[k] ?? 0) + 1;
  }
  assert.ok(counts.a > counts.b, JSON.stringify(counts));
});

test('cajas de Leitner: sube si es perfecta y rápida, se queda si es lenta, baja si falla', () => {
  const now = 0;
  const c = { ...emptyCard(), box: 2 };
  updateBox(c, [{ correct: true, ms: 900 }, { correct: true, ms: 1100 }], 1500, now);
  assert.equal(c.box, 3);
  assert.equal(c.due, BOX_INTERVALS[3] * 864e5);
  updateBox(c, [{ correct: true, ms: 2500 }], 1500, now);
  assert.equal(c.box, 3);
  updateBox(c, [{ correct: false, ms: 900 }, { correct: true, ms: 900 }], 1500, now);
  assert.equal(c.box, 1);
});

test('confusiones y dominio', () => {
  const c = emptyCard();
  recordAnswer(c, false, 1000, 0, '4:0');
  recordAnswer(c, false, 1000, 0, '4:0');
  assert.equal(c.conf['4:0'], 2);
  for (let i = 0; i < 9; i++) recordAnswer(c, true, 1200, 0);
  assert.equal(masteryLevel(c, 1500), 3);
  assert.equal(masteryLevel(c, 1000), 2);
});

test('reviewKeys pone primero las vencidas de caja baja', () => {
  const cards = {
    'treble:G4': { ...emptyCard(), seen: 3, box: 4, due: 50 },
    'treble:C4': { ...emptyCard(), seen: 3, box: 1, due: 50 },
    'treble:E4': { ...emptyCard(), seen: 3, box: 2, due: 500 },
    'bass:F3': { ...emptyCard(), seen: 3, box: 1, due: 0 },
  };
  assert.deepEqual(reviewKeys(cards, 'treble', 20, 100), ['treble:C4', 'treble:G4', 'treble:E4']);
});
