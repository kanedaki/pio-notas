// Modelo musical puro: notas, claves, posiciones en el pentagrama, armaduras y nombres.
// Una nota es { step: 0-6 (Do..Si), oct: número de octava científica (Do4 = Do central), alt: -1 | 0 | 1 }.

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const SOLFEGE = ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Si'];
const SEMITONES = [0, 2, 4, 5, 7, 9, 11];
const ALT_SIGN = { '-1': '♭', 0: '', 1: '♯' };

export function parseNote(id) {
  const m = /^([A-G])(#|b)?(-?\d)$/.exec(id);
  if (!m) throw new Error(`Nota no válida: ${id}`);
  return { step: LETTERS.indexOf(m[1]), alt: m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0, oct: Number(m[3]) };
}

export function noteId(n) {
  return LETTERS[n.step] + (n.alt === 1 ? '#' : n.alt === -1 ? 'b' : '') + n.oct;
}

export const diatonic = (n) => n.oct * 7 + n.step;

export function fromDiatonic(d, alt = 0) {
  const oct = Math.floor(d / 7);
  return { step: d - oct * 7, oct, alt };
}

export const midi = (n) => 12 * (n.oct + 1) + SEMITONES[n.step] + n.alt;
export const pitchClass = (n) => ((midi(n) % 12) + 12) % 12;
export const frequency = (m) => 440 * 2 ** ((m - 69) / 12);

// bottom: nota de la primera línea; refPos: posición de la línea de referencia de la clave
// (0 = primera línea, 1 = primer espacio, ... 8 = quinta línea).
export const CLEFS = {
  treble: { name: 'Sol', bottom: parseNote('E4'), glyph: 'gClef', refPos: 2 },
  bass: { name: 'Fa', bottom: parseNote('G2'), glyph: 'fClef', refPos: 6 },
  alto: { name: 'Do en 3.ª', bottom: parseNote('F3'), glyph: 'cClef', refPos: 4 },
  tenor: { name: 'Do en 4.ª', bottom: parseNote('D3'), glyph: 'cClef', refPos: 6 },
};

export const staffPos = (n, clef) => diatonic(n) - diatonic(CLEFS[clef].bottom);

export function noteAtPos(pos, clef, alt = 0) {
  return fromDiatonic(diatonic(CLEFS[clef].bottom) + pos, alt);
}

// Posiciones de las líneas adicionales que necesita una nota en la posición pos.
export function ledgerPositions(pos) {
  const out = [];
  for (let p = -2; p >= pos; p -= 2) out.push(p);
  for (let p = 10; p <= pos; p += 2) out.push(p);
  return out;
}

export const ledgerCount = (pos) => ledgerPositions(pos).length;
export const isLine = (pos) => ((pos % 2) + 2) % 2 === 0;

// Todas las notas naturales entre dos notas, ambas incluidas.
export function naturalRange(fromId, toId) {
  const a = diatonic(parseNote(fromId));
  const b = diatonic(parseNote(toId));
  const out = [];
  for (let d = Math.min(a, b); d <= Math.max(a, b); d++) out.push(noteId(fromDiatonic(d)));
  return out;
}

// Armaduras: fifths de -7 (7 bemoles) a 7 (7 sostenidos).
const SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6]; // Fa Do Sol Re La Mi Si
const FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3]; // Si Mi La Re Sol Do Fa

const KEY_SIG_PITCHES = {
  treble: { sharp: ['F5', 'C5', 'G5', 'D5', 'A4', 'E5', 'B4'], flat: ['B4', 'E5', 'A4', 'D5', 'G4', 'C5', 'F4'] },
  bass: { sharp: ['F3', 'C3', 'G3', 'D3', 'A2', 'E3', 'B2'], flat: ['B2', 'E3', 'A2', 'D3', 'G2', 'C3', 'F2'] },
  alto: { sharp: ['F4', 'C4', 'G4', 'D4', 'A3', 'E4', 'B3'], flat: ['B3', 'E4', 'A3', 'D4', 'G3', 'C4', 'F3'] },
  tenor: { sharp: ['F3', 'C4', 'G3', 'D4', 'A3', 'E4', 'B3'], flat: ['B3', 'E4', 'A3', 'D4', 'G3', 'C4', 'F3'] },
};

// Nombre de la tonalidad mayor de una armadura: la tónica avanza una quinta por cada sostenido.
export function keyName(fifths, naming = 'solfege') {
  const step = (((4 * fifths) % 7) + 7) % 7;
  const tonic = displayName({ step, alt: keyAlters(fifths)[step] }, naming);
  return naming === 'german' ? `${tonic}-Dur` : `${tonic} mayor`;
}

// Alteración que impone la armadura a cada grado (step -> -1/0/1).
export function keyAlters(fifths) {
  const alters = [0, 0, 0, 0, 0, 0, 0];
  const order = fifths >= 0 ? SHARP_ORDER : FLAT_ORDER;
  for (let i = 0; i < Math.abs(fifths); i++) alters[order[i]] = Math.sign(fifths);
  return alters;
}

// Accidentes de la armadura con su posición en el pentagrama, en orden de escritura.
export function keySignatureLayout(fifths, clef) {
  if (!fifths) return [];
  const kind = fifths > 0 ? 'sharp' : 'flat';
  return KEY_SIG_PITCHES[clef][kind]
    .slice(0, Math.abs(fifths))
    .map((id) => ({ kind, pos: staffPos(parseNote(id), clef) }));
}

// Nomenclatura alemana: H es Si natural y B es Si bemol.
const GERMAN = {
  0: ['C', 'D', 'E', 'F', 'G', 'A', 'H'],
  1: ['Cis', 'Dis', 'Eis', 'Fis', 'Gis', 'Ais', 'His'],
  '-1': ['Ces', 'Des', 'Es', 'Fes', 'Ges', 'As', 'B'],
};

export function displayName(n, naming = 'solfege') {
  if (naming === 'german') return GERMAN[n.alt][n.step];
  const sign = ALT_SIGN[n.alt];
  if (naming === 'letters') return LETTERS[n.step] + sign;
  return SOLFEGE[n.step] + sign;
}

export function secondaryName(n, naming = 'solfege') {
  return displayName(n, naming === 'solfege' ? 'letters' : 'solfege');
}

// ¿Es correcta la respuesta? answer = { step, alt } en modo nombres, { midi } o { pc } en modo teclado.
export function isCorrect(target, answer) {
  if ('midi' in answer) return midi(target) === answer.midi;
  if ('pc' in answer) return pitchClass(target) === answer.pc;
  return answer.step === target.step && answer.alt === target.alt;
}

// ---------- teoría: intervalos, tonalidades y acordes ----------

export const semitones = (a, b) => midi(b) - midi(a);

// Número del intervalo (2.ª, 3.ª…) contando las dos notas, sin importar el sentido.
export const intervalNumber = (a, b) => Math.abs(diatonic(b) - diatonic(a)) + 1;

const PERFECT = { 1: 0, 4: 5, 5: 7, 8: 12 };
const MAJOR = { 2: 2, 3: 4, 6: 9, 7: 11 };

// Calidad del intervalo: 'J' justa, 'M' mayor, 'm' menor, 'A' aumentada, 'd' disminuida (null si es rara).
export function intervalQuality(a, b) {
  const [lo, hi] = diatonic(a) <= diatonic(b) ? [a, b] : [b, a];
  let n = intervalNumber(lo, hi);
  let semis = semitones(lo, hi);
  while (n > 8) { n -= 7; semis -= 12; }
  if (n in PERFECT) {
    const d = semis - PERFECT[n];
    return { 0: 'J', 1: 'A', '-1': 'd' }[d] ?? null;
  }
  const d = semis - MAJOR[n];
  return { 0: 'M', '-1': 'm', 1: 'A', '-2': 'd' }[d] ?? null;
}

export const QUALITY_NAMES = { J: 'justa', M: 'mayor', m: 'menor', A: 'aumentada', d: 'disminuida' };

// «tono y medio», «2 tonos y medio»…
export function tonesText(semis) {
  const t = Math.floor(semis / 2);
  const half = semis % 2 === 1;
  if (t === 0) return half ? 'un semitono' : 'nada';
  const whole = t === 1 ? 'un tono' : `${t} tonos`;
  return half ? `${t === 1 ? 'tono' : whole} y medio` : whole;
}

// Tónica (en la octava 4) de la tonalidad mayor y de su relativa menor para una armadura.
export function majorTonic(fifths) {
  const step = (((4 * fifths) % 7) + 7) % 7;
  return { step, alt: keyAlters(fifths)[step], oct: 4 };
}

export function minorTonic(fifths) {
  const step = (majorTonic(fifths).step + 5) % 7;
  return { step, alt: keyAlters(fifths)[step], oct: 4 };
}

export function minorKeyName(fifths, naming = 'solfege') {
  const t = minorTonic(fifths);
  return naming === 'german' ? `${displayName(t, naming).toLowerCase()}-Moll` : `${displayName(t, naming)} menor`;
}

// Notas de la escala mayor de una armadura empezando en la tónica (octava indicada).
export function majorScale(fifths, oct = 4) {
  const t = majorTonic(fifths);
  const alters = keyAlters(fifths);
  return Array.from({ length: 8 }, (_, i) => {
    const n = fromDiatonic(t.step + oct * 7 + i);
    return { ...n, alt: alters[n.step] };
  });
}

// Calidad de una tríada en estado fundamental: 'M', 'm', 'dim', 'aum'.
export function triadQuality(root, third, fifth) {
  const a = semitones(root, third);
  const b = semitones(third, fifth);
  if (a === 4 && b === 3) return 'M';
  if (a === 3 && b === 4) return 'm';
  if (a === 3 && b === 3) return 'dim';
  if (a === 4 && b === 4) return 'aum';
  return null;
}

// Valor de una figura en negras: 1 redonda = 4, blanca 2, negra 1, corchea ½…; el puntillo suma la mitad.
export function beats(dur, dots = 0) {
  const base = 4 / dur;
  return base * (dots === 2 ? 1.75 : dots === 1 ? 1.5 : 1);
}

// 1.5 → '1½', 0.75 → '¾', 0.25 → '¼'
export function beatsText(x) {
  const whole = Math.floor(x + 1e-9);
  const frac = Math.round((x - whole) * 4);
  const f = ['', '¼', '½', '¾'][frac];
  return whole ? `${whole}${f}` : f || '0';
}
