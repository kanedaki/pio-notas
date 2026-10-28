import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseNote, noteId, midi, staffPos, ledgerPositions, naturalRange, keyAlters,
  keySignatureLayout, displayName, isCorrect, noteAtPos, pitchClass, keyName,
} from '../js/music.js';

test('parseNote y noteId son inversos', () => {
  for (const id of ['C4', 'F#5', 'Bb3', 'E2', 'G-1']) assert.equal(noteId(parseNote(id)), id);
});

test('midi del Do central y La 440', () => {
  assert.equal(midi(parseNote('C4')), 60);
  assert.equal(midi(parseNote('A4')), 69);
  assert.equal(midi(parseNote('Bb3')), 58);
  assert.equal(pitchClass(parseNote('Cb4')), 11);
});

test('posiciones en clave de sol', () => {
  assert.equal(staffPos(parseNote('E4'), 'treble'), 0); // primera línea
  assert.equal(staffPos(parseNote('G4'), 'treble'), 2); // línea de Sol
  assert.equal(staffPos(parseNote('F5'), 'treble'), 8); // quinta línea
  assert.equal(staffPos(parseNote('C4'), 'treble'), -2); // Do central, 1 línea adicional
});

test('posiciones en claves de fa, do en 3.ª y do en 4.ª', () => {
  assert.equal(staffPos(parseNote('F3'), 'bass'), 6); // línea de Fa
  assert.equal(staffPos(parseNote('C4'), 'bass'), 10); // Do central arriba
  assert.equal(staffPos(parseNote('C4'), 'alto'), 4); // línea central
  assert.equal(staffPos(parseNote('C4'), 'tenor'), 6); // cuarta línea
});

test('líneas adicionales', () => {
  assert.deepEqual(ledgerPositions(4), []);
  assert.deepEqual(ledgerPositions(-1), []);
  assert.deepEqual(ledgerPositions(-2), [-2]);
  assert.deepEqual(ledgerPositions(-5), [-2, -4]);
  assert.deepEqual(ledgerPositions(9), []);
  assert.deepEqual(ledgerPositions(12), [10, 12]);
});

test('naturalRange y noteAtPos', () => {
  assert.deepEqual(naturalRange('C4', 'G4'), ['C4', 'D4', 'E4', 'F4', 'G4']);
  assert.equal(noteId(noteAtPos(-2, 'treble')), 'C4');
});

test('armaduras', () => {
  assert.deepEqual(keyAlters(2), [1, 0, 0, 1, 0, 0, 0]); // Re mayor: Fa♯ Do♯
  assert.deepEqual(keyAlters(-3), [0, 0, -1, 0, 0, -1, -1]); // Mi♭ mayor: Si♭ Mi♭ La♭
  assert.deepEqual(keySignatureLayout(1, 'treble'), [{ kind: 'sharp', pos: 8 }]);
  assert.deepEqual(keySignatureLayout(1, 'bass'), [{ kind: 'sharp', pos: 6 }]);
  assert.deepEqual(keySignatureLayout(-1, 'treble'), [{ kind: 'flat', pos: 4 }]);
  assert.equal(keySignatureLayout(7, 'alto').length, 7);
});

test('nombres', () => {
  assert.equal(displayName(parseNote('F#4')), 'Fa♯');
  assert.equal(displayName(parseNote('Bb4'), 'letters'), 'B♭');
});

test('corrección de respuestas', () => {
  const fs = parseNote('F#4');
  assert.ok(isCorrect(fs, { step: 3, alt: 1 }));
  assert.ok(!isCorrect(fs, { step: 4, alt: -1 })); // Sol♭ es otra grafía
  assert.ok(isCorrect(fs, { pc: 6 })); // en teclado la tecla es la misma
  assert.ok(isCorrect(fs, { midi: 66 }));
  assert.ok(!isCorrect(fs, { midi: 78 }));
});

test('nombres alemanes y de tonalidades', () => {
  assert.equal(displayName(parseNote('B4'), 'german'), 'H');
  assert.equal(displayName(parseNote('Bb4'), 'german'), 'B');
  assert.equal(displayName(parseNote('Eb4'), 'german'), 'Es');
  assert.equal(displayName(parseNote('F#4'), 'german'), 'Fis');
  assert.equal(keyName(0), 'Do mayor');
  assert.equal(keyName(2), 'Re mayor');
  assert.equal(keyName(-3, 'letters'), 'E♭ mayor');
  assert.equal(keyName(6), 'Fa♯ mayor');
  assert.equal(keyName(-7), 'Do♭ mayor');
  assert.equal(keyName(-2, 'german'), 'B-Dur');
});
