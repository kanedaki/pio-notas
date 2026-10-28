// Preguntas de teoría musical. Cada generador devuelve ítems con la misma forma:
//   { key, kind, present: 'wire' | 'board', clef, notes?, arrangement?, answer, label, explain, sound,
//     options?, prompt?, stim? }
// - present 'wire': el ítem camina por el cable como los pájaros (notas sueltas, parejas, tríadas,
//   figuras y silencios). 'board': cartel fijo en el centro (compases, armaduras, escalas, símbolos).
// - explain: la regla aplicada a ese ítem, en una frase corta (se enseña tras un fallo).
// - stim: lo que hay que dibujar en un cartel (lo interpreta js/boards.js).
// Ver docs/investigacion-teoria.md para el currículo y los errores típicos que guían cada explicación.

import {
  parseNote, noteId, diatonic, fromDiatonic, midi, staffPos, displayName, naturalRange,
  intervalNumber, intervalQuality, semitones, tonesText, QUALITY_NAMES, keyName, minorKeyName,
  majorTonic, minorTonic, majorScale, keyAlters, triadQuality, beats, beatsText, LETTERS,
} from './music.js';

const pick = (xs, rnd = Math.random) => xs[Math.floor(rnd() * xs.length)];
const shuffle = (xs, rnd = Math.random) => {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const ord = (n) => `${n}.ª`;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const DEGREE_NAMES = ['tónica', 'supertónica', 'mediante', 'subdominante', 'dominante', 'superdominante', 'sensible'];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function noteSpec(note, clef, shownAlt = note.alt || null) {
  return { note, clef, pos: staffPos({ ...note, alt: 0 }, clef), shownAlt };
}

// ---------- melodía: sube, baja, paso y salto ----------

function direction(def, { nm }) {
  const clef = def.clef ?? 'treble';
  const ids = naturalRange(...def.range).map(parseNote);
  const groups = { up: [], down: [], same: [], paso: [], salto: [] };
  for (const a of ids) for (const b of ids) {
    const d = diatonic(b) - diatonic(a);
    if (Math.abs(d) > 4) continue;
    if (def.variant === 'stepskip') {
      if (d === 0) continue;
      groups[Math.abs(d) === 1 ? 'paso' : 'salto'].push([a, b, d]);
    } else {
      groups[d > 0 ? 'up' : d < 0 ? 'down' : 'same'].push([a, b, d]);
    }
  }
  const make = (answer) => ([a, b, d]) => {
    const skipped = Math.abs(d) - 1;
    const explain = {
      up: `${nm(b)} está más arriba que ${nm(a)}: la melodía sube.`,
      down: `${nm(b)} está más abajo que ${nm(a)}: la melodía baja.`,
      same: 'Los dos pájaros están a la misma altura: la nota se repite.',
      paso: `${nm(a)} y ${nm(b)} son vecinas, línea y espacio de al lado: es un paso.`,
      salto: `De ${nm(a)} a ${nm(b)} te saltas ${skipped} ${skipped === 1 ? 'nota' : 'notas'}: es un salto.`,
    }[answer];
    return {
      key: `dir:${answer}`,
      kind: 'direction',
      present: 'wire',
      clef,
      notes: [noteSpec(a, clef), noteSpec(b, clef)],
      arrangement: 'melodic',
      answer,
      explain,
      sound: [midi(a), midi(b)],
    };
  };
  const keys = def.variant === 'stepskip' ? ['paso', 'salto'] : ['up', 'down', 'same'];
  // Mismo peso para cada respuesta aunque haya más parejas de un tipo.
  return keys.flatMap((k) => {
    const list = groups[k].map(make(k));
    const reps = Math.max(1, Math.round(12 / list.length));
    return Array(reps).fill(list).flat();
  });
}

// ---------- intervalos ----------

function countNames(a, b, nm) {
  const step = diatonic(b) >= diatonic(a) ? 1 : -1;
  const names = [];
  for (let d = diatonic(a), i = 1; ; d += step, i++) {
    names.push(`${nm(fromDiatonic(d))} (${i})`);
    if (d === diatonic(b)) break;
  }
  return names.join(', ');
}

// Parejas de notas naturales dentro de un rango, para los tamaños pedidos.
function pairs(range, sizes, arrangement) {
  const ids = naturalRange(...range).map(parseNote);
  const lo = diatonic(ids[0]);
  const hi = diatonic(ids[ids.length - 1]);
  const out = [];
  for (const a of ids) for (const size of sizes) {
    const dirs = arrangement === 'harmonic' ? [1] : arrangement === 'mix' ? [1, -1, 1] : [1, -1];
    for (const dir of dirs) {
      const db = diatonic(a) + dir * (size - 1);
      if (db < lo || db > hi) continue;
      const harmonic = arrangement === 'harmonic' || (arrangement === 'mix' && dir === 1 && out.length % 2 === 0);
      out.push({ a, b: fromDiatonic(db), size, arrangement: harmonic ? 'harmonic' : 'melodic' });
    }
  }
  return out;
}

function clefRanges(def) {
  if (def.ranges) return Object.entries(def.ranges);
  return [[def.clef ?? 'treble', def.range]];
}

function intervalNum(def, { nm }) {
  return clefRanges(def).flatMap(([clef, range]) =>
    pairs(range, def.sizes, def.arrangement ?? 'melodic').map(({ a, b, size, arrangement }) => ({
      key: `int:${size}`,
      kind: 'interval',
      present: 'wire',
      clef,
      notes: [noteSpec(a, clef), noteSpec(b, clef)],
      arrangement,
      answer: String(size),
      label: ord(size),
      explain: `${countNames(a, b, nm)}: es una ${ord(size)}.`,
      sound: arrangement === 'harmonic' ? [[midi(a), midi(b)]] : [midi(a), midi(b)],
    })),
  );
}

function qualityExplain(a, b, size, q, nm) {
  const [lo, hi] = diatonic(a) <= diatonic(b) ? [a, b] : [b, a];
  const semis = semitones(lo, hi);
  if (size === 4 && q === 'A' && !lo.alt && !hi.alt) return `¡La trampa! ${nm(lo)}-${nm(hi)} tiene 3 tonos: es una 4.ª aumentada.`;
  if (size === 5 && q === 'd' && !lo.alt && !hi.alt) return `${nm(lo)}-${nm(hi)} tiene solo 3 tonos: es una 5.ª disminuida.`;
  if ([4, 5, 8].includes(size) && q === 'J') return `${nm(lo)}-${nm(hi)}: ${tonesText(semis)}. La ${ord(size)} no es mayor ni menor: es justa.`;
  return `${nm(lo)}-${nm(hi)}: ${tonesText(semis)}. Es una ${ord(size)} ${QUALITY_NAMES[q]}.`;
}

function intervalQual(def, { nm, rnd = Math.random }) {
  const items = [];
  for (const [clef, range] of clefRanges(def)) {
    for (const { a, b, size, arrangement } of pairs(range, def.sizes, def.arrangement ?? 'melodic')) {
      const variants = [[a, b]];
      if (def.alter) {
        // Una alteración en una de las dos notas, como en intc-5.
        for (const [which, d] of [[0, 1], [0, -1], [1, 1], [1, -1]]) {
          const x = which === 0 ? { ...a, alt: d } : a;
          const y = which === 1 ? { ...b, alt: d } : b;
          if ([x, y].some((n) => (n.alt === 1 && [2, 6].includes(n.step)) || (n.alt === -1 && [0, 3].includes(n.step)))) continue;
          variants.push([x, y]);
        }
      }
      for (const [x, y] of def.alter ? shuffle(variants, rnd).slice(0, 2) : variants) {
        const q = intervalQuality(x, y);
        if (!q || (def.qualities && !def.qualities.includes(q))) continue;
        items.push({
          key: `intq:${size}${q}`,
          kind: 'quality',
          present: 'wire',
          clef,
          notes: [noteSpec(x, clef), noteSpec(y, clef)],
          arrangement,
          answer: def.twoStep ? `${size}${q}` : q,
          label: `${ord(size)} ${QUALITY_NAMES[q]}`,
          explain: qualityExplain(x, y, size, q, nm),
          sound: arrangement === 'harmonic' ? [[midi(x), midi(y)]] : [midi(x), midi(y)],
        });
      }
    }
  }
  return items;
}

// ---------- tono y semitono ----------

function toneKind(a, b) {
  const semis = Math.abs(semitones(a, b));
  if (semis === 0) return 'E';
  if (semis === 2) return 'T';
  if (semis === 1) return a.step === b.step ? 'Sc' : 'Sd';
  return null;
}

function toneExplain(a, b, kind, nm) {
  const pair = `${nm(a)}-${nm(b)}`;
  if (kind === 'E') return `${nm(a)} y ${nm(b)} son la misma tecla con distinto nombre: enarmónicas.`;
  if (kind === 'Sc') return `Mismo nombre (${pair}) a un semitono: semitono cromático.`;
  if (kind === 'Sd') return `Distinto nombre (${pair}) a un semitono: semitono diatónico.`;
  if (kind === 'S') return a.alt || b.alt ? `${pair}: teclas vecinas, sin nada en medio. Semitono.` : `Entre ${nm(a)} y ${nm(b)} no hay tecla negra: es un semitono.`;
  return a.alt || b.alt ? `${pair}: hay una tecla en medio. Es un tono.` : `Entre ${nm(a)} y ${nm(b)} hay una tecla negra: es un tono.`;
}

function tone(def, { nm }) {
  const clef = def.clef ?? 'treble';
  const list = def.pairs
    ? def.pairs.map(([x, y]) => [parseNote(x), parseNote(y)])
    : pairs(def.range, [2], 'melodic').map(({ a, b }) => [a, b]);
  return list.map(([a, b]) => {
    let kind = toneKind(a, b);
    if (!def.four && (kind === 'Sc' || kind === 'Sd')) kind = 'S';
    return {
      key: `ts:${kind}`,
      kind: 'tone',
      present: 'wire',
      clef,
      notes: [noteSpec(a, clef), noteSpec(b, clef)],
      arrangement: 'melodic',
      answer: kind,
      explain: toneExplain(a, b, kind, nm),
      sound: [midi(a), midi(b)],
    };
  });
}

// Pareja de grados iluminada dentro de una escala dibujada (ts-2 y ton-1).
function scalePair(def, { nm }) {
  const items = [];
  for (const sc of def.scales) {
    const clef = sc.clef ?? 'treble';
    const notes = majorScale(sc.key, sc.oct ?? 4);
    for (let i = 0; i < 7; i++) {
      const a = notes[i];
      const b = notes[i + 1];
      const semis = semitones(a, b);
      const kind = semis === 1 ? 'S' : 'T';
      items.push({
        key: `ts:${kind}`,
        kind: 'tone',
        present: 'board',
        clef,
        prompt: `Grados ${i + 1}.º y ${i + 2}.º: ¿tono o semitono?`,
        stim: { type: 'scale', clef, notes: notes.map((n) => noteSpec(n, clef)), highlight: [i, i + 1] },
        answer: kind,
        explain: `Grados ${i + 1}.º y ${i + 2}.º (${nm(a)}-${nm(b)}): ${kind === 'S' ? 'sin tecla en medio, semitono' : 'con una tecla en medio, tono'}.`,
        sound: [midi(a), midi(b)],
      });
    }
  }
  return items;
}

// ---------- figuras, silencios y valores ----------

const FIG_NAMES = { 1: 'redonda', 2: 'blanca', 4: 'negra', 8: 'corchea', 16: 'semicorchea', 32: 'fusa' };
const FIG_EXPLAIN = {
  1: 'Cabeza blanca y sin plica: es una redonda.',
  2: 'Cabeza blanca con plica: es una blanca.',
  4: 'Cabeza negra con plica y sin corchetes: es una negra.',
  8: 'Un corchete o una barra: es una corchea.',
  16: 'Dos corchetes o dos barras: es una semicorchea.',
  32: 'Tres corchetes: es una fusa.',
};

function figureName(def) {
  const items = [];
  for (const dur of def.set) {
    const stems = dur === 1 ? ['none'] : ['up', 'down'];
    for (const stem of stems) {
      items.push({ dur, beamed: false, stem });
      if (def.beamed && (dur === 8 || dur === 16)) items.push({ dur, beamed: true, stem });
    }
  }
  return items.map(({ dur, beamed, stem }) => ({
    key: `fig:${dur}`,
    kind: 'figure',
    present: 'wire',
    clef: 'rhythm',
    figure: { dur, stem, group: beamed ? (dur === 8 ? 2 : 4) : 1 },
    answer: FIG_NAMES[dur],
    label: cap(FIG_NAMES[dur]),
    explain: FIG_EXPLAIN[dur],
    sound: { rhythm: Array(beamed ? (dur === 8 ? 2 : 4) : 1).fill(beats(dur)) },
  }));
}

function valueExplain(f) {
  if (f.tie) {
    const [x, y] = f.tie;
    return `La ligadura suma: ${FIG_NAMES[x.dur]} (${beatsText(beats(x.dur))}) + ${FIG_NAMES[y.dur]} (${beatsText(beats(y.dur))}) = ${beatsText(beats(x.dur) + beats(y.dur))}.`;
  }
  const base = beats(f.dur);
  if (f.dots) return `El puntillo suma la mitad: ${FIG_NAMES[f.dur]} (${beatsText(base)}) + ${beatsText(base / 2)} = ${beatsText(base * 1.5)}.`;
  if (f.rest) return `Un silencio dura lo mismo que su figura: ${beatsText(base)}.`;
  return {
    1: 'Si la negra vale 1, la redonda vale 4.',
    2: 'Si la negra vale 1, la blanca vale 2.',
    4: 'La negra es la unidad: vale 1 tiempo.',
    8: 'La corchea es la mitad de una negra: ½ tiempo.',
    16: 'La semicorchea es la mitad de una corchea: ¼ de tiempo.',
  }[f.dur];
}

function figureValue(def) {
  const list = [...(def.set ?? []), ...(def.ties ?? []).map(([x, y]) => ({ tie: [x, y] }))];
  return list.map((f) => {
    const value = f.tie ? beats(f.tie[0].dur) + beats(f.tie[1].dur) : beats(f.dur, f.dots ?? 0);
    return {
      key: `val:${f.tie ? `${f.tie[0].dur}~${f.tie[1].dur}` : `${f.rest ? 'r' : ''}${f.dur}${f.dots ? '.' : ''}`}`,
      kind: 'value',
      present: 'wire',
      clef: f.rest ? 'treble' : 'rhythm',
      figure: { dur: f.tie ? null : f.dur, dots: f.dots ?? 0, rest: !!f.rest, tie: f.tie ?? null, stem: 'up', group: 1 },
      answer: String(value),
      label: `${beatsText(value)} ${value === 1 ? 'tiempo' : 'tiempos'}`,
      explain: valueExplain(f),
      sound: { rhythm: f.tie ? [value] : [value] },
    };
  });
}

const REST_EXPLAIN = {
  1: 'El silencio de redonda cuelga de la 4.ª línea: pesa más.',
  2: 'El silencio de blanca se sienta sobre la 3.ª línea, como un sombrero.',
  4: 'El silencio de negra es la línea en zigzag.',
  8: 'Un corchete en el silencio: silencio de corchea.',
  16: 'Dos corchetes en el silencio: silencio de semicorchea.',
};

function restName(def) {
  return def.set.map((dur) => ({
    key: `rest:${dur}`,
    kind: 'rest',
    present: 'wire',
    clef: 'treble',
    figure: { dur, rest: true, dots: 0, group: 1 },
    answer: `r${dur}`,
    label: `Silencio de ${FIG_NAMES[dur]}`,
    explain: REST_EXPLAIN[dur],
    sound: null,
  }));
}

// ---------- compases ----------

// Fórmulas rítmicas por tiempo (valores en negras). d: figura, dots, rest.
const SIMPLE_BEAT = [
  { f: [{ d: 4 }], need: [4] },
  { f: [{ d: 8 }, { d: 8 }], need: [8] },
  { f: [{ d: 4, rest: true }], need: [4], rests: true },
  { f: [{ d: 16 }, { d: 16 }, { d: 16 }, { d: 16 }], need: [16] },
  { f: [{ d: 8 }, { d: 16 }, { d: 16 }], need: [8, 16] },
  { f: [{ d: 16 }, { d: 16 }, { d: 8 }], need: [8, 16] },
  { f: [{ d: 8, rest: true }, { d: 8 }], need: [8], rests: true },
];
const SIMPLE_MULTI = [
  { f: [{ d: 2 }], len: 2, need: [2] },
  { f: [{ d: 2, rest: true }], len: 2, need: [2], rests: true },
  { f: [{ d: 4, dots: 1 }, { d: 8 }], len: 2, need: [4, 8], dots: true },
  { f: [{ d: 2, dots: 1 }], len: 3, need: [2], dots: true },
  { f: [{ d: 1 }], len: 4, need: [1] },
];
const COMPOUND_BEAT = [
  { f: [{ d: 4, dots: 1 }], need: [4] },
  { f: [{ d: 8 }, { d: 8 }, { d: 8 }], need: [8] },
  { f: [{ d: 4 }, { d: 8 }], need: [4, 8] },
  { f: [{ d: 8 }, { d: 4 }], need: [4, 8] },
  { f: [{ d: 4, dots: 1, rest: true }], need: [4], rests: true },
];

function allowed(p, set) {
  return p.need.every((d) => set.figures.includes(d)) && (!p.rests || set.rests) && (!p.dots || set.dots);
}

// Rellena 'total' negras con fórmulas que respetan los tiempos del compás.
function fillBeats(total, meter, set, rnd) {
  const compound = meter[1] === 8;
  const beat = compound ? 1.5 : 1;
  const singles = (compound ? COMPOUND_BEAT : SIMPLE_BEAT).filter((p) => allowed(p, set));
  const multis = compound
    ? (set.figures.includes(2) && set.dots ? [{ f: [{ d: 2, dots: 1 }], len: 3 }] : [])
    : SIMPLE_MULTI.filter((p) => allowed(p, set));
  const out = [];
  let left = total;
  while (left > 1e-9) {
    if (left < beat - 1e-9) {
      // Resto de medio tiempo (o menos): se completa con una figura suelta.
      const d = { 0.25: 16, 0.5: 8, 1: 4 }[Math.round(left * 4) / 4];
      if (d) out.push({ d });
      break;
    }
    const fits = multis.filter((p) => p.len <= left + 1e-9 && rnd() < 0.35);
    const p = fits.length ? pick(fits, rnd) : pick(singles, rnd);
    out.push(...p.f.map((x) => ({ ...x })));
    left -= fits.length ? p.len : beat;
  }
  return out;
}

const figWord = (x) => `${x.rest ? 'silencio de ' : ''}${FIG_NAMES[x.d]}${x.dots ? ' con puntillo' : ''}`;
const valueOf = (x) => beats(x.d, x.dots ?? 0);

function sumText(figs) {
  if (figs.length > 5) return beatsText(figs.reduce((s, x) => s + valueOf(x), 0));
  return figs.map((x) => `${figWord(x)} (${beatsText(valueOf(x))})`).join(' + ');
}

function measure(def, { rnd = Math.random }) {
  const set = { figures: def.figures ?? [1, 2, 4, 8], rests: def.rests ?? false, dots: def.dots ?? false };
  const items = [];
  const meters = def.meters.map((m) => m.split('/').map(Number));
  const unit = def.unit ?? 'negra'; // en 6/8 se puede contar en corcheas
  let guard = 0;
  for (let i = 0; i < (def.samples ?? 24) && guard++ < 500; i++) {
    const meter = meters[i % meters.length];
    const total = (meter[0] * 4) / meter[1];
    const name = `${meter[0]}/${meter[1]}`;
    let figs;
    let answer;
    let explain;
    if (def.variant === 'which') {
      figs = fillBeats(total, meter, set, rnd);
      answer = name;
      explain = meter[1] === 8
        ? `Las corcheas van de 3 en 3: ${meter[0] / 3} tiempos de negra con puntillo. Es ${name}.`
        : `${sumText(figs)} = ${beatsText(total)} tiempos: es ${name}.`;
    } else if (def.variant === 'complete') {
      const r = rnd();
      const beat = meter[1] === 8 ? 1.5 : 1;
      if (r < 0.5) {
        figs = fillBeats(total, meter, set, rnd);
        answer = 'completo';
      } else if (r < 0.75) {
        figs = fillBeats(total - beat, meter, set, rnd);
        answer = 'falta';
      } else {
        figs = fillBeats(total + beat, meter, set, rnd);
        answer = 'sobra';
      }
      const sum = figs.reduce((s, x) => s + valueOf(x), 0);
      const verdict = { completo: 'completo', falta: 'falta', sobra: 'sobra' }[answer];
      explain = `Suman ${beatsText(sum)} y el compás pide ${beatsText(total)}: ${verdict}.`;
    } else {
      const options = def.missing ?? [0.5, 1, 1.5, 2, 3];
      const miss = pick(options.filter((m) => m < total), rnd);
      figs = miss ? fillBeats(total - miss, meter, set, rnd) : fillBeats(total, meter, set, rnd);
      // Lo que falta tiene que caber en tiempos enteros del compás: si no, se reintenta.
      const sum = figs.reduce((s, x) => s + valueOf(x), 0);
      if (Math.abs(sum - (total - miss)) > 1e-9) { i--; continue; }
      answer = String(miss);
      const shown = unit === 'corchea' ? `${miss * 2} ${miss * 2 === 1 ? 'corchea' : 'corcheas'}` : beatsText(miss);
      explain = miss
        ? `Hay ${beatsText(sum)} de ${beatsText(total)} tiempos: falta${miss > 1 ? 'n' : ''} ${shown}.`
        : `Ya suman ${beatsText(total)}: no falta nada.`;
    }
    items.push({
      key: `meas:${def.variant}:${def.variant === 'which' ? name : answer}`,
      kind: 'measure',
      present: 'board',
      prompt: { which: '¿Qué compás es?', complete: '¿Está completo?', missing: unit === 'corchea' ? '¿Cuántas corcheas faltan?' : '¿Cuántos tiempos faltan?' }[def.variant],
      stim: {
        type: 'measure',
        lines: def.lines ?? 1,
        timeSig: def.variant === 'which' ? null : meter,
        meter,
        items: figs.map((x) => ({ type: x.rest ? 'rest' : 'note', dur: x.d, dots: x.dots ?? 0, pos: 4 })),
      },
      answer,
      label: def.variant === 'missing' ? (Number(answer) ? (unit === 'corchea' ? `${Number(answer) * 2} corcheas` : `${beatsText(Number(answer))}`) : 'Nada') : answer.charAt(0).toUpperCase() + answer.slice(1),
      explain,
      sound: { rhythm: figs.map((x) => (x.rest ? -valueOf(x) : valueOf(x))) },
    });
  }
  return items;
}

// Fragmentos con nombre: anacrusa, síncopa, contratiempo, tresillo (comp-5).
const NAMED_RHYTHMS = {
  anacrusa: [
    { timeSig: [2, 4], measures: [[{ d: 4 }], [{ d: 8 }, { d: 8 }, { d: 4 }], [{ d: 4 }]] },
    { timeSig: [3, 4], measures: [[{ d: 8 }, { d: 8 }], [{ d: 2 }, { d: 4 }], [{ d: 2 }]] },
  ],
  síncopa: [
    { timeSig: [2, 4], measures: [[{ d: 8 }, { d: 4 }, { d: 8 }], [{ d: 2 }]] },
    { timeSig: [4, 4], measures: [[{ d: 4 }, { d: 2 }, { d: 4 }]] },
  ],
  contratiempo: [
    { timeSig: [2, 4], measures: [[{ d: 8, rest: true }, { d: 8 }, { d: 8, rest: true }, { d: 8 }]] },
    { timeSig: [3, 4], measures: [[{ d: 8, rest: true }, { d: 8 }, { d: 8, rest: true }, { d: 8 }, { d: 4 }]] },
  ],
  tresillo: [
    { timeSig: [2, 4], measures: [[{ d: 8, tuplet: 3 }, { d: 8, tuplet: 3 }, { d: 8, tuplet: 3 }, { d: 4 }]] },
    { timeSig: [3, 4], measures: [[{ d: 4 }, { d: 8, tuplet: 3 }, { d: 8, tuplet: 3 }, { d: 8, tuplet: 3 }, { d: 4 }]] },
  ],
};
const NAMED_EXPLAIN = {
  anacrusa: 'El primer compás está incompleto y el último lo completa: es una anacrusa.',
  síncopa: 'Empieza en parte débil y se alarga hasta la fuerte: es una síncopa.',
  contratiempo: 'Suena en la parte débil después de un silencio: es un contratiempo.',
  tresillo: 'Tres corcheas con un 3 encima ocupan el tiempo de dos: es un tresillo.',
};

function namedRhythm() {
  return Object.entries(NAMED_RHYTHMS).flatMap(([name, list]) =>
    list.map((r) => ({
      key: `rit:${name}`,
      kind: 'rhythm',
      present: 'board',
      prompt: '¿Cómo se llama este ritmo?',
      stim: { type: 'rhythm', timeSig: r.timeSig, measures: r.measures },
      answer: name,
      label: cap(name),
      explain: NAMED_EXPLAIN[name],
      sound: { rhythm: r.measures.flat().map((x) => (x.rest ? -1 : 1) * beats(x.d) * (x.tuplet ? 2 / 3 : 1)) },
    })),
  );
}

// ---------- símbolos y términos ----------

export const SYMBOLS = {
  pp: { draw: { glyph: 'dynamicPP' }, meaning: 'Muy suave', order: 0 },
  p: { draw: { glyph: 'dynamicPiano' }, meaning: 'Suave', order: 1 },
  mp: { draw: { glyph: 'dynamicMP' }, meaning: 'Medio suave', order: 2 },
  mf: { draw: { glyph: 'dynamicMF' }, meaning: 'Medio fuerte', order: 3 },
  f: { draw: { glyph: 'dynamicForte' }, meaning: 'Fuerte', order: 4 },
  ff: { draw: { glyph: 'dynamicFF' }, meaning: 'Muy fuerte', order: 5 },
  cresc: { draw: { hairpin: 'cresc' }, meaning: 'Cada vez más fuerte' },
  dim: { draw: { hairpin: 'dim' }, meaning: 'Cada vez más suave' },
  'cresc.': { draw: { text: 'cresc.' }, meaning: 'Cada vez más fuerte' },
  'dim.': { draw: { text: 'dim.' }, meaning: 'Cada vez más suave' },
  sfz: { draw: { glyph: 'dynamicSforzato' }, meaning: 'Un golpe fuerte de repente' },
  fp: { draw: { glyph: 'dynamicFortePiano' }, meaning: 'Fuerte y enseguida suave' },
  acento: { draw: { note: true, artic: 'articAccentAbove' }, meaning: 'Esa nota, más fuerte' },
  Largo: { draw: { text: 'Largo' }, meaning: 'Muy lento', order: 0 },
  Lento: { draw: { text: 'Lento' }, meaning: 'Lento', order: 1 },
  Adagio: { draw: { text: 'Adagio' }, meaning: 'Despacio, con calma', order: 2 },
  Andante: { draw: { text: 'Andante' }, meaning: 'Tranquilo, al paso', order: 3 },
  Moderato: { draw: { text: 'Moderato' }, meaning: 'Moderado', order: 4 },
  Allegro: { draw: { text: 'Allegro' }, meaning: 'Rápido y alegre', order: 5 },
  Presto: { draw: { text: 'Presto' }, meaning: 'Muy rápido', order: 6 },
  'rit.': { draw: { text: 'rit.' }, meaning: 'Cada vez más lento' },
  'accel.': { draw: { text: 'accel.' }, meaning: 'Cada vez más rápido' },
  'a tempo': { draw: { text: 'a tempo' }, meaning: 'Vuelve a la velocidad de antes' },
  picado: { draw: { note: true, artic: 'articStaccatoAbove' }, meaning: 'Corto y separado' },
  ligado: { draw: { slur: true }, meaning: 'Unido, sin cortar' },
  tenuto: { draw: { note: true, artic: 'articTenutoAbove' }, meaning: 'Mantén la nota todo su valor' },
  'picado-ligado': { draw: { note: true, artic: 'articTenutoStaccatoAbove' }, meaning: 'Un poco separado' },
  Ped: { draw: { glyph: 'keyboardPedalPed' }, meaning: 'Pisa el pedal' },
  'Ped-up': { draw: { glyph: 'keyboardPedalUp' }, meaning: 'Suelta el pedal' },
  '8va': { draw: { glyph: 'ottavaAlta' }, meaning: 'Una octava más agudo' },
  ritornello: { draw: { repeat: true }, meaning: 'Repite el trozo entre las barras' },
  'D.C.': { draw: { text: 'D.C.' }, meaning: 'Vuelve al principio' },
  'D.S.': { draw: { text: 'D.S.' }, meaning: 'Vuelve al signo' },
  segno: { draw: { glyph: 'segno' }, meaning: 'El signo al que vuelve el D.S.' },
  coda: { draw: { glyph: 'coda' }, meaning: 'Salta a la Coda' },
  Fine: { draw: { text: 'Fine' }, meaning: 'Aquí termina' },
  'D.C. al Fine': { draw: { text: 'D.C. al Fine' }, meaning: 'Vuelve al principio y acaba en Fine' },
  volta: { draw: { volta: true }, meaning: 'La 1.ª vez toca esto; la 2.ª, sáltatelo' },
  calderon: { draw: { note: true, artic: 'fermataAbove' }, meaning: 'Alarga la nota lo que quieras' },
};

const SYMBOL_EXPLAIN = {
  pp: 'pp es pianissimo: muy suave.',
  p: 'p es piano: suave.',
  mp: 'Mezzo es medio: mp es medio suave.',
  mf: 'Mezzo es medio: mf es medio fuerte.',
  f: 'f es forte: fuerte.',
  ff: 'ff es fortissimo: muy fuerte.',
  cresc: 'El regulador que se abre (<) es un crescendo: cada vez más fuerte.',
  dim: 'El regulador que se cierra (>) es un diminuendo: cada vez más suave.',
  Andante: 'Andante viene de andar: a paso tranquilo, no rápido.',
  ligado: 'La ligadura sobre notas distintas es de expresión: tócalas unidas.',
  'D.C.': 'D.C. es Da Capo: vuelve al principio.',
  'D.S.': 'D.S. es Dal Segno: vuelve al signo 𝄋.',
  calderon: 'El calderón detiene el tiempo: alarga la nota a tu gusto.',
};

function symbol(def, { rnd = Math.random }) {
  const ids = def.symbols;
  const meanings = [...new Set(ids.map((id) => SYMBOLS[id].meaning))];
  return ids.flatMap((id) => {
    const s = SYMBOLS[id];
    // Botones: la respuesta y 3 más; en matices y aire, los vecinos (los que más se confunden).
    const ordered = ids.filter((x) => SYMBOLS[x].order !== undefined && s.order !== undefined);
    let others = ordered.length
      ? ordered.filter((x) => SYMBOLS[x].meaning !== s.meaning).sort((a, b) => Math.abs(SYMBOLS[a].order - s.order) - Math.abs(SYMBOLS[b].order - s.order)).map((x) => SYMBOLS[x].meaning)
      : shuffle(meanings.filter((m) => m !== s.meaning), rnd);
    others = [...new Set(others)].slice(0, 3);
    const opts = shuffle([s.meaning, ...others], rnd).map((m) => ({ value: m, label: m }));
    if (s.order !== undefined) opts.sort((a, b) => meanings.indexOf(a.value) - meanings.indexOf(b.value));
    return [0, 1].map(() => ({
      key: `sym:${id}`,
      kind: 'symbol',
      present: 'board',
      prompt: '¿Qué significa?',
      stim: { type: 'symbol', id, ...s.draw },
      answer: s.meaning,
      label: s.meaning,
      explain: SYMBOL_EXPLAIN[id] ?? `${id.replace('-up', '')}: ${s.meaning.toLowerCase()}.`,
      options: opts,
      sound: null,
    }));
  });
}

// ---------- armaduras y tonalidades ----------

function keySig(def, { naming, rnd = Math.random }) {
  const clefs = def.clefs ?? ['treble'];
  const items = [];
  for (const fifths of def.keys) for (const clef of clefs) {
    const modes = def.mode === 'mix' ? ['major', 'minor'] : [def.mode ?? 'major'];
    for (const mode of modes) {
      const name = (f) => (mode === 'major' ? keyName(f, naming) : minorKeyName(f, naming));
      const answer = name(fifths);
      const alters = keyAlters(fifths);
      const order = fifths > 0 ? [3, 0, 4, 1, 5, 2, 6] : [6, 2, 5, 1, 4, 0, 3];
      const last = fifths ? { step: order[Math.abs(fifths) - 1], alt: Math.sign(fifths), oct: 4 } : null;
      const nm = (n) => displayName(n, naming);
      let explain;
      const distract = [];
      if (mode === 'major') {
        if (fifths > 0) {
          explain = `Último sostenido: ${nm(last)}. Sube un semitono: ${nm(majorTonic(fifths))} mayor.`;
          distract.push(`${nm(last)} mayor`);
        } else if (fifths === -1) {
          explain = 'Con un solo bemol, la tonalidad es Fa mayor.';
          distract.push(`${nm(last)} mayor`);
        } else if (fifths < 0) {
          const prev = { step: order[Math.abs(fifths) - 2], alt: -1, oct: 4 };
          explain = `Con bemoles, el penúltimo da el nombre: ${nm(prev)} mayor.`;
          distract.push(`${nm(last)} mayor`);
        } else {
          explain = 'Sin sostenidos ni bemoles: Do mayor (o La menor).';
        }
      } else {
        const tonic = minorTonic(fifths);
        explain = `La mayor es ${keyName(fifths, naming).replace(' mayor', '')}; una 3.ª menor más abajo: ${nm(tonic)} menor.`;
        distract.push(`${nm(majorTonic(fifths))} menor`); // homónimo
        const third = majorTonic(fifths);
        const up = { ...fromDiatonic(diatonic(third) + 2), alt: alters[(third.step + 2) % 7] };
        distract.push(`${nm(up)} menor`);
      }
      const pool = def.keys.filter((k) => k !== fifths).map(name);
      const others = [...new Set([...distract.filter((d) => d !== answer), ...shuffle(pool, rnd)])].slice(0, 3);
      items.push({
        key: `ks:${fifths}:${mode}`,
        kind: 'keysig',
        present: 'board',
        prompt: mode === 'major' ? '¿Qué tonalidad mayor es?' : '¿Y su relativa menor?',
        stim: { type: 'keysig', clef, fifths },
        answer,
        label: answer,
        explain,
        options: shuffle([answer, ...others], rnd).map((x) => ({ value: x, label: x })),
        sound: [midi(mode === 'major' ? majorTonic(fifths) : minorTonic(fifths))],
      });
    }
  }
  return items;
}

// Escalas mayores y menores (ton-5): las alteraciones van escritas en cada nota.
function scaleType(def, { nm }) {
  const items = [];
  const MINORS = def.minors ?? ['A3', 'E4', 'D4'];
  for (const t of MINORS) {
    const tonic = parseNote(t);
    for (const type of ['natural', 'armonica', 'melodica']) {
      const notes = Array.from({ length: 8 }, (_, i) => fromDiatonic(diatonic(tonic) + i));
      // Menor natural: intervalos T S T T S T T desde la tónica.
      const nat = [0, 2, 3, 5, 7, 8, 10, 12];
      const semis = [...nat];
      if (type !== 'natural') semis[6] = 11;
      if (type === 'melodica') semis[5] = 9;
      const spelled = notes.map((n, i) => ({ ...n, alt: midi(tonic) + semis[i] - midi({ ...n, alt: 0 }) }));
      items.push(scaleItem(spelled, type, nm));
    }
  }
  for (const k of def.majors ?? [0, 1, -1]) items.push(scaleItem(majorScale(k), 'mayor', nm));
  return items;
}

const SCALE_LABELS = { mayor: 'Mayor', natural: 'Menor natural', armonica: 'Menor armónica', melodica: 'Menor melódica' };
const SCALE_EXPLAIN = {
  mayor: 'Tono, tono, semitono, tono, tono, tono, semitono: escala mayor.',
  natural: 'Solo las notas de su armadura, sin alterar el VI ni el VII: menor natural.',
  armonica: 'Solo sube el VII grado (la sensible): menor armónica.',
  melodica: 'Al subir se alteran el VI y el VII: menor melódica.',
};

function scaleItem(notes, type, nm) {
  return {
    key: `scale:${type}`,
    kind: 'scale',
    present: 'board',
    prompt: '¿Qué escala es?',
    stim: { type: 'scale', clef: 'treble', notes: notes.map((n) => noteSpec(n, 'treble')), explicit: true },
    answer: type,
    label: SCALE_LABELS[type],
    explain: `${nm(notes[0])}: ${SCALE_EXPLAIN[type].charAt(0).toLowerCase()}${SCALE_EXPLAIN[type].slice(1)}`,
    sound: notes.map(midi),
  };
}

// ---------- grados ----------

function degree(def, { nm, naming }) {
  const items = [];
  for (const k of def.keys) {
    const minor = k.mode === 'minor';
    const fifths = k.fifths;
    const tonic = minor ? minorTonic(fifths) : majorTonic(fifths);
    const alters = keyAlters(fifths);
    const scale = Array.from({ length: 7 }, (_, i) => {
      const n = fromDiatonic(diatonic(tonic) + i);
      return { ...n, alt: alters[n.step] };
    });
    if (minor && def.harmonic) scale[6] = { ...scale[6], alt: scale[6].alt + 1 }; // sensible elevada
    const tonality = minor ? minorKeyName(fifths, naming) : keyName(fifths, naming);
    const weights = def.weights ?? [1, 1, 1, 1, 1, 1, 1];
    scale.forEach((n, i) => {
      for (let w = 0; w < weights[i]; w++) {
        const variant = def.variant === 'alternate' ? (w % 2 ? 'name' : 'number') : def.variant;
        const chord = def.chord;
        const notes = chord
          ? [0, 2, 4].map((s) => {
            const x = fromDiatonic(diatonic(n) + s);
            return noteSpec({ ...x, alt: alters[x.step] }, 'treble', null);
          })
          : [noteSpec(n, 'treble', null)];
        const counted = scale.slice(0, i + 1).map((x, j) => `${nm(x)} (${ROMAN[j]})`).join(', ');
        items.push({
          key: `${chord ? 'degc' : variant === 'name' ? 'degn' : 'deg'}:${i + 1}`,
          kind: 'degree',
          present: 'board',
          prompt: chord ? `${tonality}: ¿sobre qué grado está el acorde?` : `${tonality}: ¿qué grado es?`,
          stim: { type: 'degree', clef: 'treble', fifths, tonality, notes, chord: !!chord },
          answer: variant === 'name' ? DEGREE_NAMES[i] : ROMAN[i],
          label: variant === 'name' ? `${ROMAN[i]}, ${DEGREE_NAMES[i]}` : ROMAN[i],
          explain: variant === 'name'
            ? `${nm(n)} es el ${ROMAN[i]} de ${tonality}: la ${DEGREE_NAMES[i]}.`
            : `${counted}: es el ${ROMAN[i]}.`,
          options: variant === 'name' && def.variant === 'alternate'
            ? DEGREE_NAMES.map((x) => ({ value: x, label: cap(x) }))
            : def.variant === 'alternate' ? ROMAN.map((x) => ({ value: x, label: x })) : undefined,
          sound: chord ? [notes.map((x) => midi(x.note))] : [midi(n)],
        });
      }
    });
  }
  return items;
}

// ---------- acordes ----------

const TRIAD_LABELS = { M: 'Mayor', m: 'menor', dim: 'disminuido', aum: 'aumentado' };

function triad(def, { nm }) {
  const items = [];
  const specs = def.triads
    ? def.triads.map((t) => ({ clef: 'treble', notes: t.split(' ').map(parseNote) }))
    : clefRanges(def).flatMap(([clef, range]) =>
      naturalRange(...range).map(parseNote).filter((r) => diatonic(r) + 4 <= diatonic(parseNote(range[1])))
        .map((r) => ({ clef, notes: [0, 2, 4].map((s) => fromDiatonic(diatonic(r) + s)) })));
  for (const { clef, notes } of specs) {
    const [r, t, f] = notes;
    const q = triadQuality(r, t, f);
    if (!q) continue;
    const byName = def.variant === 'name';
    items.push({
      key: byName ? `tri:${LETTERS[r.step]}` : `triq:${q}`,
      kind: 'triad',
      present: 'wire',
      clef,
      notes: notes.map((n) => noteSpec(n, clef)),
      arrangement: 'harmonic',
      answer: byName ? String(r.step) : q,
      label: byName ? nm({ ...r, alt: 0 }) : TRIAD_LABELS[q],
      options: byName ? Array.from({ length: 7 }, (_, i) => ({ value: String(i), label: nm({ step: i, alt: 0 }) })) : undefined,
      explain: byName
        ? `La nota de abajo, ${nm(r)}, da nombre al acorde: ${nm(r)}.`
        : q === 'M' || q === 'm'
          ? `${nm(r)}-${nm(t)} es una 3.ª ${q === 'M' ? 'mayor' : 'menor'}: acorde ${TRIAD_LABELS[q]}.`
          : `${nm(r)}-${nm(t)} y ${nm(t)}-${nm(f)}: dos 3.ªs ${q === 'dim' ? 'menores, disminuido' : 'mayores, aumentado'}.`,
      sound: [notes.map(midi)],
    });
  }
  return items;
}

// ---------- melodías cortas ----------

function melodyKind(def, { nm, rnd = Math.random }) {
  const clef = def.clef ?? 'treble';
  const list = def.melodies.map((m) => m.split(' ').map(parseNote));
  return list.map((notes) => ({
    key: `mel:${notes.map(noteId).join('-')}`,
    kind: 'melody',
    present: 'board',
    prompt: 'Lee las notas en orden',
    stim: { type: 'melody', clef, key: def.key ?? 0, notes: notes.map((n) => noteSpec(n, clef, def.key ? null : n.alt || null)) },
    parts: notes.map((n) => {
      const sounding = def.key && n.alt === 0 ? { ...n, alt: keyAlters(def.key)[n.step] } : n;
      return { note: sounding, clef, pos: staffPos({ ...n, alt: 0 }, clef), key: `${clef}:${noteId(sounding)}` };
    }),
    answer: null,
    label: notes.map(nm).join(' '),
    explain: 'Fíjate en si sube o baja y si va por pasos o saltos: así adivinas la siguiente.',
    sound: notes.map(midi),
    _rnd: rnd,
  }));
}

const GENERATORS = {
  direction, interval: intervalNum, quality: intervalQual, tone, scalePair, figure: figureName,
  value: figureValue, rest: restName, measure, rhythm: namedRhythm, symbol, keysig: keySig,
  scale: scaleType, degree, triad, melody: melodyKind,
};

export const THEORY_KINDS = Object.keys(GENERATORS);

// Genera los ítems de un nivel de teoría. ctx = { naming, rnd }.
export function generateItems(def, ctx = {}) {
  const naming = ctx.naming ?? 'solfege';
  const full = { ...ctx, naming, nm: (n) => displayName(n, naming) };
  const gen = GENERATORS[def.kind];
  if (!gen) throw new Error(`Tipo de pregunta desconocido: ${def.kind}`);
  return gen(def, full);
}
