import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SONGS, parseHook, fitHook, songsForLevel, songMelodies, intervalKey, intervalSongs, songById } from '../js/songs.js';
import { INTERVAL_SONGS, RHYTHM_SONGS } from '../js/songs-data.js';
import { LEVELS, buildLevel } from '../js/curriculum.js';
import { noteId, naturalRange } from '../js/music.js';

test('los ganchos se leen y tienen como mucho 8 notas', () => {
  assert.ok(SONGS.length >= 20, `solo ${SONGS.length} canciones`);
  for (const s of SONGS) {
    const parts = parseHook(s.hook);
    assert.ok(parts.filter((p) => !p.rest).length <= 8, `${s.id}: más de 8 notas`);
    assert.ok(s.title && s.artist, s.id);
  }
  const p = parseHook('F#4/4. r/8 C5/83 Bb3/16');
  assert.deepEqual(p.map((x) => x.beats), [1.5, 0.5, 1 / 3, 0.25]);
  assert.equal(noteId(p[0].note), 'F#4');
  assert.ok(p[1].rest);
});

test('transportar mantiene los intervalos y respeta las notas permitidas', () => {
  const song = { id: 'x', hook: 'E4/8 E4/8 F4/4 G4/4 G4/4 F4/4 E4/4 D4/4' };
  const fit = fitHook(song, new Set(naturalRange('C4', 'G4')));
  assert.ok(fit);
  assert.deepEqual(fit.parts.map((p) => noteId(p.note)), ['E4', 'E4', 'F4', 'G4', 'G4', 'F4', 'E4', 'D4']);
  const up = fitHook(song, new Set(['A4', 'B4', 'C5', 'D5']));
  assert.deepEqual(up.parts.map((p) => noteId(p.note)), ['B4', 'B4', 'C5', 'D5', 'D5', 'C5', 'B4', 'A4']);
  assert.equal(fitHook(song, new Set(['C4', 'D4'])), null);
});

test('las canciones de un nivel de lectura solo usan sus notas', () => {
  let levelsWithSong = 0;
  for (const def of LEVELS.filter((l) => !l.kind && !l.answer)) {
    const level = buildLevel(def);
    const ids = new Set(level.pool.map((p) => `${p.clef}:${noteId(p.note)}`));
    const fits = songsForLevel(level);
    if (fits.length) levelsWithSong++;
    for (const f of fits) for (const p of f.parts.filter((x) => !x.rest)) assert.ok(ids.has(p.key), `${def.id}: ${f.song.id} usa ${p.key}`);
  }
  assert.ok(levelsWithSong >= 20, `solo ${levelsWithSong} niveles de lectura con canción`);
});

test('intervalos y ritmos remiten a canciones que existen y empiezan así', () => {
  for (const [key, list] of Object.entries(INTERVAL_SONGS)) {
    for (const x of list) {
      const s = songById(x.song);
      assert.ok(s, `${key}: no existe ${x.song}`);
      const [a, b] = parseHook(s.hook).filter((p) => !p.rest);
      const ik = intervalKey(a.note, b.note);
      assert.equal(ik?.key, key, `${s.id} empieza con ${ik?.key}, no con ${key}`);
      assert.equal(ik.dir, x.dir, `${s.id}: sentido`);
    }
  }
  for (const [tag, list] of Object.entries(RHYTHM_SONGS)) for (const x of list) assert.ok(songById(typeof x === 'string' ? x : x.song), `${tag}: ${JSON.stringify(x)}`);
  assert.ok(intervalSongs('5J').length || intervalSongs('8J').length, 'faltan ejemplos de 5.ª u 8.ª justa');
});

test('el nivel de melodías usa canciones y en teoría hay canciones para recordar intervalos', () => {
  assert.ok(songMelodies(naturalRange('C4', 'C5')).length >= 4);
  const int2 = buildLevel(LEVELS.find((l) => l.id === 'int-2'), {});
  assert.ok(int2.pool.some((it) => it.mnemonic), 'int-2 sin canciones');
});
