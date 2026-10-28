import { test } from 'node:test';
import assert from 'node:assert/strict';
import { beatsOf, layoutMeasure } from '../js/notation.js';

const note = (dur, extra = {}) => ({ type: 'note', dur, pos: 4, ...extra });
const rest = (dur, extra = {}) => ({ type: 'rest', dur, ...extra });

test('beatsOf: valores en negras, con puntillo y doble puntillo', () => {
  assert.equal(beatsOf(1), 4);
  assert.equal(beatsOf(2), 2);
  assert.equal(beatsOf(4), 1);
  assert.equal(beatsOf(8), 0.5);
  assert.equal(beatsOf(16), 0.25);
  assert.equal(beatsOf(32), 0.125);
  assert.equal(beatsOf(4, 1), 1.5);
  assert.equal(beatsOf(2, 1), 3);
  assert.equal(beatsOf(8, 1), 0.75);
  assert.equal(beatsOf(4, 2), 1.75);
  assert.equal(beatsOf(2, 2), 3.5);
});

test('layoutMeasure: totales y tiempos esperados', () => {
  const a = layoutMeasure({ timeSig: [2, 4], items: [note(4), note(8), note(8)], width: 120 });
  assert.equal(a.totalBeats, 2);
  assert.equal(a.expectedBeats, 2);
  const b = layoutMeasure({ timeSig: [6, 8], items: [note(4, { dots: 1 }), note(8)], width: 120 });
  assert.equal(b.totalBeats, 2); // incompleto: falta una negra
  assert.equal(b.expectedBeats, 3);
  assert.equal(layoutMeasure({ timeSig: [12, 8], items: [], width: 100 }).expectedBeats, 6);
  assert.equal(layoutMeasure({ timeSig: [3, 4], items: [rest(4), note(2)], width: 100 }).totalBeats, 3);
});

test('layoutMeasure: el silencio de redonda solo llena cualquier compás', () => {
  const res = layoutMeasure({ timeSig: [3, 4], items: [rest(1)], width: 100 });
  assert.equal(res.totalBeats, 3);
  assert.equal(res.items[0].x, 50); // centrado
});

test('layoutMeasure 2/4: corcheas y semicorcheas se agrupan por negra', () => {
  const items = [note(8), note(8), note(16), note(16), note(16), note(16)];
  assert.deepEqual(layoutMeasure({ timeSig: [2, 4], items, width: 160 }).beams, [[0, 1], [2, 3, 4, 5]]);
  // corchea + dos semicorcheas en un tiempo; corchea con puntillo + semicorchea en el otro
  const mixed = [note(8), note(16), note(16), note(8, { dots: 1 }), note(16)];
  assert.deepEqual(layoutMeasure({ timeSig: [2, 4], items: mixed, width: 160 }).beams, [[0, 1, 2], [3, 4]]);
});

test('layoutMeasure 3/4: seis corcheas van de dos en dos; silencios y negras cortan', () => {
  const six = Array.from({ length: 6 }, () => note(8));
  assert.deepEqual(layoutMeasure({ timeSig: [3, 4], items: six, width: 200 }).beams, [[0, 1], [2, 3], [4, 5]]);
  const cut = [note(8), rest(8), note(4), note(8), note(8)];
  assert.deepEqual(layoutMeasure({ timeSig: [3, 4], items: cut, width: 200 }).beams, [[3, 4]]);
  // una corchea que empieza a contratiempo no se une a la del tiempo siguiente
  const sync = [note(8), note(4), note(4), note(8)];
  assert.deepEqual(layoutMeasure({ timeSig: [3, 4], items: sync, width: 200 }).beams, []);
});

test('layoutMeasure 6/8: grupos de tres corcheas (negra con puntillo)', () => {
  const six = Array.from({ length: 6 }, () => note(8));
  assert.deepEqual(layoutMeasure({ timeSig: [6, 8], items: six, width: 200 }).beams, [[0, 1, 2], [3, 4, 5]]);
  const mixed = [note(4), note(8), note(8, { dots: 1 }), note(16), note(8)];
  assert.deepEqual(layoutMeasure({ timeSig: [6, 8], items: mixed, width: 200 }).beams, [[2, 3, 4]]);
  const nine = Array.from({ length: 9 }, () => note(8));
  assert.deepEqual(layoutMeasure({ timeSig: [9, 8], items: nine, width: 260 }).beams, [[0, 1, 2], [3, 4, 5], [6, 7, 8]]);
});

test('layoutMeasure: x crecientes, más espacio para figuras largas y dentro del ancho', () => {
  const items = [note(2), note(8), note(8), note(4)];
  const res = layoutMeasure({ timeSig: [4, 4], items, width: 200 });
  const xs = res.items.map((it) => it.x);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] > xs[i - 1]);
  assert.ok(xs[1] - xs[0] > xs[2] - xs[1], 'la blanca ocupa más que la corchea');
  assert.ok(xs.at(-1) < 200);
  assert.equal(res.items[0].dur, 2); // conserva las propiedades de cada figura
});

test('layoutMeasure: respeta un hueco mínimo aunque el ancho no alcance', () => {
  const items = Array.from({ length: 8 }, () => note(16));
  const res = layoutMeasure({ timeSig: [2, 4], items, width: 40 });
  const xs = res.items.map((it) => it.x);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] >= 15);
  assert.ok(res.width > 40);
});

test('layoutMeasure: un compás incompleto deja el hueco al final', () => {
  const half = layoutMeasure({ timeSig: [4, 4], items: [note(4), note(4)], width: 200 });
  assert.ok(half.items[1].x < 100, 'las dos negras quedan en la primera mitad');
  assert.equal(half.totalBeats, 2);
});

test('layoutMeasure: sin ancho usa el natural', () => {
  const res = layoutMeasure({ timeSig: [3, 4], items: [note(4), note(4), note(4)] });
  assert.ok(res.width > 60);
  assert.ok(res.items[2].x < res.width);
});
