import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LEVELS, buildLevel, ROUTE, isUnlocked, nextToPlay } from '../js/curriculum.js';
import { generateItems } from '../js/theory.js';

const theory = LEVELS.filter((l) => l.kind);

test('hay 50 niveles de teoría y todos están en la ruta', () => {
  assert.equal(theory.length, 50);
  for (const l of theory) assert.ok(ROUTE.includes(l.id), l.id);
});

test('cada nivel de teoría genera preguntas con respuesta entre los botones y explicación', () => {
  for (const def of theory) {
    const lvl = buildLevel(def, { naming: 'solfege' });
    assert.ok(lvl.pool.length >= 4, `${def.id}: solo ${lvl.pool.length} preguntas`);
    assert.ok(lvl.lesson.text.length && lvl.lesson.example, `${def.id} sin lección o ejemplo`);
    for (const it of lvl.pool) {
      assert.ok(it.key, `${def.id}: ítem sin clave`);
      assert.ok(it.explain, `${def.id}: ${it.key} sin explicación`);
      if (lvl.pad.type === 'choices') {
        const opts = it.options ?? lvl.pad.options;
        assert.ok(opts.some((o) => o.value === it.answer), `${def.id}: «${it.answer}» no está en ${opts.map((o) => o.value)}`);
        assert.equal(new Set(opts.map((o) => o.value)).size, opts.length, `${def.id}: botones repetidos`);
      } else if (lvl.pad.type === 'twostep') {
        assert.ok(lvl.pad.first.some((o) => it.answer.startsWith(o.value)), `${def.id}: ${it.answer}`);
        assert.ok(lvl.pad.second.some((o) => it.answer.endsWith(o.value)), `${def.id}: ${it.answer}`);
      } else {
        assert.ok(it.parts?.length >= 3, `${def.id}: melodía sin notas`);
      }
    }
  }
});

test('respuestas concretas', () => {
  const items = (id) => buildLevel(LEVELS.find((l) => l.id === id), { naming: 'solfege' }).pool;
  const third = items('int-1').find((it) => it.answer === '3');
  assert.match(third.explain, /\(3\): es una 3\.ª\./);
  const ks = items('ton-2').find((it) => it.key === 'ks:3:major');
  assert.equal(ks.answer, 'La mayor');
  assert.ok(ks.options.some((o) => o.value === 'Sol♯ mayor'), 'falta el distractor del último sostenido');
  const minor = items('ton-4').find((it) => it.key === 'ks:-2:minor');
  assert.equal(minor.answer, 'Sol menor');
  const tritone = items('intc-3').find((it) => it.answer === 'A');
  assert.match(tritone.explain, /4\.ª aumentada/);
  const dim = items('aco-3').find((it) => it.answer === 'dim');
  assert.ok(dim);
});

test('los compases generados suman lo que dicen', () => {
  const lvl = buildLevel(LEVELS.find((l) => l.id === 'comp-3'), {});
  for (const it of lvl.pool) {
    const [num, den] = it.stim.meter;
    const total = (num * 4) / den;
    const sum = it.stim.items.reduce((s, x) => s + (4 / x.dur) * (x.dots ? 1.5 : 1), 0);
    assert.ok(Math.abs(total - sum - Number(it.answer)) < 1e-9, `${it.stim.items.map((x) => x.dur).join(',')} en ${num}/${den} → ${it.answer}`);
  }
});

test('la ruta empieza por p1 y la teoría se abre tras su lectura', () => {
  const progress = {};
  assert.equal(nextToPlay(progress).id, 'p1');
  for (const id of ['p1', 'sol-1', 'sol-2']) progress[id] = { stars: 1 };
  assert.ok(isUnlocked('rit-1', progress));
  assert.equal(nextToPlay(progress).id, 'rit-1');
  assert.ok(!isUnlocked('int-1', progress));
});

test('generateItems rechaza tipos desconocidos', () => {
  assert.throws(() => generateItems({ kind: 'nope' }));
});
