import { test } from 'node:test';
import assert from 'node:assert/strict';
import { WORLDS, LEVELS, buildLevel, isUnlocked, nextToPlay, practiceLevel, reviewLevel, rangeFor } from '../js/curriculum.js';
import { ledgerCount, keyAlters } from '../js/music.js';

test('ids únicos y requisitos que existen', () => {
  const ids = LEVELS.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const l of LEVELS) for (const r of l.requires) assert.ok(ids.includes(r), `${l.id} requiere ${r}`);
  assert.ok(LEVELS.length >= 90, `hay ${LEVELS.length} niveles`);
  assert.ok(!LEVELS.some((l) => l.id.startsWith('alto') || l.id.startsWith('tenor')), 'solo piano: sin claves de do');
});

test('todos los niveles de lectura se construyen y tienen lección', () => {
  for (const def of LEVELS.filter((l) => !l.kind)) {
    const lvl = buildLevel(def);
    assert.ok(lvl.pool.length >= 2, def.id);
    assert.ok(lvl.lesson.title && lvl.lesson.text.length >= 1, `${def.id} sin lección`);
    assert.ok(lvl.lesson.show.length >= 1, `${def.id} sin notas en la lección`);
    for (const k of lvl.newKeys) assert.ok(lvl.pool.some((p) => p.key === k), `${def.id}: nota nueva ${k} fuera del conjunto`);
    for (const p of lvl.pool) assert.ok(ledgerCount(p.pos) <= 3, `${def.id}: ${p.key} con más de 3 líneas adicionales`);
  }
});

test('como mucho 3 notas nuevas por nivel (2 en la ruta principal salvo excepciones)', () => {
  for (const l of LEVELS) assert.ok((l.newNotes?.length ?? 0) <= 4, l.id);
});

test('la ruta principal se abre en orden', () => {
  const progress = {};
  assert.equal(nextToPlay(progress).id, 'p1');
  assert.ok(!isUnlocked('sol-1', progress));
  progress.p1 = { stars: 1 };
  assert.ok(isUnlocked('sol-1', progress));
  assert.equal(nextToPlay(progress).id, 'sol-1');
  for (const l of LEVELS.filter((x) => !x.optional)) progress[l.id] = { stars: 2 };
  assert.ok(isUnlocked('exp-1', progress));
  assert.ok(nextToPlay(progress).optional);
});

test('con armadura las notas afectadas suenan alteradas y salen más', () => {
  const lvl = buildLevel(LEVELS.find((l) => l.id === 'arm-1'));
  assert.equal(lvl.segments.length, 2);
  const g = lvl.segments[0];
  assert.equal(g.key, 1);
  const fs = g.pool.filter((p) => p.note.step === 3);
  assert.ok(fs.every((p) => p.note.alt === 1 && p.shownAlt === null));
  assert.ok(fs.length / g.pool.length >= 0.3, `${fs.length}/${g.pool.length}`);
  const f = lvl.segments[1];
  assert.ok(f.pool.filter((p) => p.note.step === 6).every((p) => p.note.alt === -1));
  assert.deepEqual(keyAlters(-1)[6], -1);
});

test('el becuadro se dibuja como alteración 0', () => {
  const lvl = buildLevel(LEVELS.find((l) => l.id === 'alt-3'));
  const nat = lvl.pool.find((p) => p.spec === 'F4♮');
  assert.equal(nat.shownAlt, 0);
  assert.equal(nat.note.alt, 0);
});

test('práctica y repaso', () => {
  assert.equal(rangeFor('treble', 0).length, 11);
  const p = practiceLevel({ clef: 'grand', ledgers: 1, accidentals: 'sharp', key: 0, mode: 'timed', travelMs: 6000, count: 20 });
  assert.deepEqual(p.clefs, ['treble', 'bass']);
  assert.ok(p.pool.some((x) => x.note.alt === 1));
  const r = reviewLevel(['treble:F#4', 'treble:C4'], 'treble');
  assert.equal(r.pool[0].shownAlt, 1);
});

test('cada mundo tiene niveles', () => {
  for (const w of WORLDS) assert.ok(w.levels.length, w.id);
});
