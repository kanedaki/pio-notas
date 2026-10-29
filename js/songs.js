// Canciones conocidas en el aprendizaje (datos en js/songs-data.js, investigación en
// docs/investigacion-canciones.md). Reglas que siguen las buenas prácticas:
// - La canción se descubre DESPUÉS de leer sus notas («canción secreta»): si se sabe antes, se toca de
//   memoria en vez de leer. Los ejercicios con notas al azar siguen siendo el núcleo.
// - Solo el comienzo de cada canción (como mucho 8 notas), transportado para que use las notas del nivel.
// - En teoría, la canción sirve para recordar cómo suena un intervalo o un ritmo.

import { diatonic, fromDiatonic, midi, noteId, keyAlters, staffPos, intervalNumber, intervalQuality } from './music.js';
import { SONGS, INTERVAL_SONGS, RHYTHM_SONGS } from './songs-data.js';

export { SONGS };

const BY_ID = new Map(SONGS.map((s) => [s.id, s]));
export const songById = (id) => BY_ID.get(id) ?? null;

// 'F#4/4.' → { note, dur: 4, dots: 1, triplet: false }; 'r/8' → silencio; 'C5/83' → tresillo de corcheas.
export function parseHook(hook) {
  return hook.trim().split(/\s+/).map((tok) => {
    const [name, len] = tok.split('/');
    const m = /^(16|1|2|4|8)(3?)(\.?)$/.exec(len ?? '');
    if (!m) throw new Error(`Duración no válida: ${tok}`);
    const dur = Number(m[1]);
    const triplet = m[2] === '3';
    const dots = m[3] ? 1 : 0;
    const beats = (4 / dur) * (dots ? 1.5 : 1) * (triplet ? 2 / 3 : 1);
    if (name === 'r') return { rest: true, dur, dots, triplet, beats };
    const nm = /^([A-G])(#|b)?(-?\d)$/.exec(name);
    if (!nm) throw new Error(`Nota no válida: ${tok}`);
    const note = { step: 'CDEFGAB'.indexOf(nm[1]), alt: nm[2] === '#' ? 1 : nm[2] === 'b' ? -1 : 0, oct: Number(nm[3]) };
    return { note, dur, dots, triplet, beats };
  });
}

// Transporta exactamente (mismos intervalos y misma ortografía relativa) para que todas las notas estén
// en el conjunto permitido (ids como 'F#4'). Entre las posibles, la más cercana a la altura original.
export function fitHook(song, allowed) {
  const parts = parseHook(song.hook);
  const notes = parts.filter((p) => !p.rest);
  if (notes.length < 3) return null;
  let best = null;
  const first = notes[0].note;
  for (let d = -21; d <= 21; d++) {
    // La primera nota fija el desplazamiento posible: el que la deja con -1, 0 o +1 de alteración.
    const base = midi(fromDiatonic(diatonic(first) + d)) - midi(first);
    for (let s = base - 1; s <= base + 1; s++) {
      let ok = true;
      const moved = parts.map((p) => {
        if (p.rest || !ok) return p;
        const nat = fromDiatonic(diatonic(p.note) + d);
        const alt = midi(p.note) + s - midi(nat);
        if (Math.abs(alt) > 1 || !allowed.has(noteId({ ...nat, alt }))) ok = false;
        return { ...p, note: { ...nat, alt } };
      });
      if (ok && (!best || Math.abs(s) < Math.abs(best.shift))) best = { parts: moved, shift: s };
    }
  }
  return best;
}

// Canciones que caben en un nivel de lectura, en una sola clave (para leerlas en un pentagrama).
// Primero las que usan las notas nuevas del nivel. Devuelve [{ song, clef, key, parts }] con la
// posición y la alteración escrita de cada nota.
export function songsForLevel(level, { max = 3 } = {}) {
  if (level.answer || level.theory) return [];
  const key = level.key ?? 0;
  const alters = keyAlters(key);
  const newIds = new Set((level.pool ?? []).filter((p) => level.newKeys?.includes(p.key)).map((p) => noteId(p.note)));
  const out = [];
  for (const clef of level.clefs) {
    const allowed = new Set((level.pool ?? []).filter((p) => p.clef === clef).map((p) => noteId(p.note)));
    if (allowed.size < 3) continue;
    for (const song of SONGS) {
      const fit = fitHook(song, allowed);
      if (!fit) continue;
      const distinct = new Set(fit.parts.filter((p) => !p.rest).map((p) => noteId(p.note)));
      if (distinct.size < 3) continue;
      const fresh = [...distinct].filter((id) => newIds.has(id)).length;
      const parts = fit.parts.map((p) => (p.rest ? p : {
        ...p,
        clef,
        pos: staffPos({ ...p.note, alt: 0 }, clef),
        shownAlt: p.note.alt !== alters[p.note.step] ? p.note.alt : null,
        key: `${clef}:${noteId(p.note)}`,
      }));
      out.push({ song, clef, key, parts, fresh, score: fresh * 10 + distinct.size + (song.confidence === 'alta' ? 2 : 0) });
    }
  }
  // Variedad: el orden cambia según el nivel, pero las que usan notas nuevas van primero.
  const salt = [...(level.id ?? '')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
  const tie = (x) => ((salt ^ [...x.song.id].reduce((h, c) => (h * 33 + c.charCodeAt(0)) >>> 0, 5)) % 97) / 100;
  return out.sort((a, b) => b.score + tie(b) - (a.score + tie(a))).slice(0, max);
}

// Melodías para los niveles de melodías: ganchos que caben en un rango de notas naturales.
export function songMelodies(allowedIds, max = 12) {
  const allowed = new Set(allowedIds);
  return SONGS.map((song) => ({ song, fit: fitHook(song, allowed) }))
    .filter((x) => x.fit && x.fit.parts.filter((p) => !p.rest).length >= 4)
    .slice(0, max)
    .map(({ song, fit }) => ({ notes: fit.parts.filter((p) => !p.rest).map((p) => noteId(p.note)).join(' '), song: song.id }));
}

// Clave de intervalo ('3M', '4J'…) y sentido de una pareja de notas.
export function intervalKey(a, b) {
  const q = intervalQuality(a, b);
  if (!q) return null;
  return { key: `${intervalNumber(a, b)}${q}`, dir: diatonic(b) > diatonic(a) || (diatonic(b) === diatonic(a) && midi(b) > midi(a)) ? 'asc' : 'desc' };
}

// Canciones que empiezan con un intervalo; si no hay en ese sentido, las del otro.
export function intervalSongs(key, dir = 'asc') {
  const list = INTERVAL_SONGS[key] ?? [];
  const same = list.filter((x) => x.dir === dir);
  return (same.length ? same : list).map((x) => ({ ...x, song: songById(x.song) })).filter((x) => x.song);
}

export function rhythmSongs(tag) {
  return (RHYTHM_SONGS[tag] ?? []).map((x) => songById(typeof x === 'string' ? x : x.song)).filter(Boolean);
}

// Para sonar: [{ midi | null, beats }] (null = silencio).
export function hookSound(parts) {
  return parts.map((p) => ({ midi: p.rest ? null : midi(p.note), beats: p.beats }));
}

// «Golden», de HUNTR/X · «Tetris», canción popular rusa
export const songLabel = (song) => (/^popular/i.test(song.artist)
  ? `«${song.title}», canción ${song.artist.replace(/^Popular/, 'popular')}`
  : `«${song.title}», de ${song.artist}`);
