import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseNote as n, intervalNumber, intervalQuality, tonesText, majorTonic, minorTonic, minorKeyName,
  keyName, majorScale, triadQuality, beats, beatsText, noteId, semitones,
} from '../js/music.js';

test('número y calidad de intervalos', () => {
  assert.equal(intervalNumber(n('C4'), n('E4')), 3);
  assert.equal(intervalNumber(n('A4'), n('F4')), 3); // descendente
  const q = (a, b) => intervalQuality(n(a), n(b));
  assert.equal(q('C4', 'E4'), 'M');
  assert.equal(q('D4', 'F4'), 'm');
  assert.equal(q('E4', 'F4'), 'm');
  assert.equal(q('F4', 'B4'), 'A'); // tritono
  assert.equal(q('B4', 'F5'), 'd');
  assert.equal(q('D4', 'A4'), 'J');
  assert.equal(q('C4', 'C5'), 'J');
  assert.equal(q('C4', 'B4'), 'M');
  assert.equal(q('D4', 'C5'), 'm');
  assert.equal(q('E4', 'C5'), 'm'); // 6.ª menor
  assert.equal(q('D4', 'F#4'), 'M');
  assert.equal(q('C#4', 'E4'), 'm');
  assert.equal(q('C4', 'G#4'), 'A');
  assert.equal(q('G4', 'C4'), 'J'); // 4.ª descendente
});

test('tonos en palabras', () => {
  assert.equal(tonesText(1), 'un semitono');
  assert.equal(tonesText(2), 'un tono');
  assert.equal(tonesText(3), 'tono y medio');
  assert.equal(tonesText(4), '2 tonos');
  assert.equal(tonesText(5), '2 tonos y medio');
  assert.equal(semitones(n('E4'), n('F4')), 1);
});

test('tonalidades mayores y relativas menores', () => {
  assert.equal(noteId(majorTonic(3)), 'A4');
  assert.equal(noteId(minorTonic(0)), 'A4');
  assert.equal(noteId(minorTonic(1)), 'E4');
  assert.equal(noteId(minorTonic(-2)), 'G4');
  assert.equal(noteId(minorTonic(3)), 'F#4');
  assert.equal(minorKeyName(-3), 'Do menor');
  assert.equal(keyName(-4), 'La♭ mayor');
  assert.deepEqual(majorScale(1).map(noteId), ['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F#5', 'G5']);
});

test('tríadas', () => {
  const t = (a, b, c) => triadQuality(n(a), n(b), n(c));
  assert.equal(t('C4', 'E4', 'G4'), 'M');
  assert.equal(t('A4', 'C5', 'E5'), 'm');
  assert.equal(t('B4', 'D5', 'F5'), 'dim');
  assert.equal(t('C4', 'E4', 'G#4'), 'aum');
});

test('valores de figuras', () => {
  assert.equal(beats(2, 1), 3);
  assert.equal(beats(4, 1), 1.5);
  assert.equal(beats(8, 1), 0.75);
  assert.equal(beats(1, 1), 6);
  assert.equal(beatsText(1.5), '1½');
  assert.equal(beatsText(0.25), '¼');
  assert.equal(beatsText(3), '3');
});
