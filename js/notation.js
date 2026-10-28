// Dibujo de notación musical en SVG para los niveles de teoría y ritmo.
// Mismas unidades que staff.js: 1 espacio = 10, la línea superior del pentagrama en y = top,
// la posición p (0 = primera línea, 8 = quinta) en y = top + (8 - p) * 5.
// Todo se dibuja con rellenos (sin trazos): basta una regla CSS `.notation { fill: var(--wire); }`.
// Cada función crea un <g class="notation ..."> y devuelve su geometría.

import { GLYPHS, ANCHORS } from './glyphs.js';
import { el, glyph, posY, SPACE } from './staff.js';
import { CLEFS, ledgerPositions, isLine } from './music.js';

const GS = SPACE / 250; // escala de los glifos SMuFL

// Valores de grabado de Bravura (engravingDefaults), pasados a unidades.
const STEM_T = 0.12 * SPACE;
const BEAM_T = 0.5 * SPACE;
const BEAM_GAP = 0.25 * SPACE;
const LEDGER_EXT = 0.4 * SPACE;
const THIN_BAR = 0.16 * SPACE;
const THICK_BAR = 0.5 * SPACE;
const BAR_GAP = 0.4 * SPACE; // barlineSeparation y thinThickBarlineSeparation
const REPEAT_DOT_GAP = 0.16 * SPACE;
const HAIRPIN_T = 0.16 * SPACE;
const TIE_END = 0.1 * SPACE;
const TIE_MID = 0.22 * SPACE;

const STEM_LEN = 3.5 * SPACE;
const STAFF_LINE = 1; // igual que .wire en el juego, para que todos los pentagramas casen
const LEDGER_T = STAFF_LINE * (0.16 / 0.13); // misma proporción línea adicional / línea que en Bravura
const DIGIT_GAP = 0.1 * SPACE; // aire entre cifras (12/8) para que no se toquen en pantallas pequeñas
const DOT_GAP = 0.4 * SPACE; // cabeza → primer puntillo
const DOT_STEP = 0.6 * SPACE; // entre puntillos
const DOT_W = GLYPHS.augmentationDot.adv * GS;
const HAIRPIN_OPEN = 1.2 * SPACE;

const HEAD = { 1: 'noteheadWhole', 2: 'noteheadHalf' }; // el resto, cabeza negra
const FLAG = { 8: '8th', 16: '16th', 32: '32nd' };
const REST = { 1: 'restWhole', 2: 'restHalf', 4: 'restQuarter', 8: 'rest8th', 16: 'rest16th', 32: 'rest32nd' };
const BEAMS = { 8: 1, 16: 2, 32: 3 };

const r2 = (v) => Math.round(v * 100) / 100;
const headName = (dur) => HEAD[dur] ?? 'noteheadBlack';
const headWidth = (dur) => GLYPHS[headName(dur)].adv * GS;
const group = (parent, kind, cls) => el('g', { class: cls ? `notation ${kind} ${cls}` : `notation ${kind}` }, parent);

function rect(parent, x, y, w, h, cls) {
  // admite alto negativo para dibujar de abajo arriba
  return el('rect', { x: r2(x), y: r2(Math.min(y, y + h)), width: r2(w), height: r2(Math.abs(h)), class: cls }, parent);
}

function poly(parent, pts, cls) {
  return el('path', { d: `M${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L')}Z`, class: cls }, parent);
}

// Línea gruesa como polígono relleno (reguladores).
function thickLine(parent, x1, y1, x2, y2, w, cls) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * (w / 2);
  const ny = ((x2 - x1) / len) * (w / 2);
  return poly(parent, [[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]], cls);
}

// Valor en negras: la negra vale 1; cada puntillo añade la mitad del anterior.
export function beatsOf(dur, dots = 0) {
  return (4 / dur) * (2 - 0.5 ** dots);
}

const stemUp = (pos, stem) => (stem === 'up' ? true : stem === 'down' ? false : pos < 4);

// Dirección común de un grupo: manda la nota más alejada de la tercera línea.
function groupUp(notes, stem) {
  if (stem === 'up') return true;
  if (stem === 'down') return false;
  const ps = notes.map((n) => n.pos);
  const above = Math.max(...ps) - 4;
  const below = 4 - Math.min(...ps);
  if (above !== below) return below > above;
  return ps.reduce((a, b) => a + b, 0) / ps.length < 4;
}

function drawLedgers(g, x, top, pos, hw) {
  for (const lp of ledgerPositions(pos)) {
    rect(g, x - hw / 2 - LEDGER_EXT, posY(lp, top) - LEDGER_T / 2, hw + 2 * LEDGER_EXT, LEDGER_T, 'nt-ledger');
  }
}

// Puntillos: en el espacio de la nota o, si está en línea, en el espacio de encima.
function drawDots(g, x, y, dots) {
  for (let k = 0; k < dots; k++) glyph('augmentationDot', x + k * DOT_STEP, y, g, 'nt-dot');
  return dots ? x + (dots - 1) * DOT_STEP + DOT_W : x;
}

// Pentagrama de 5 líneas o línea única de ritmo (en la altura de la tercera línea).
export function drawStaff(parent, { x = 0, top, width, lines = 5, cls }) {
  const g = group(parent, 'staff-lines', cls);
  const ps = lines === 1 ? [4] : [0, 2, 4, 6, 8];
  for (const p of ps) rect(g, x, posY(p, top) - STAFF_LINE / 2, width, STAFF_LINE, 'nt-staffline');
  return g;
}

// Nota suelta. x es el centro de la cabeza.
export function drawNote(parent, { x, top, pos, dur, dots = 0, stem = 'auto', ledger = true, cls }) {
  const g = group(parent, 'note', cls);
  const y = posY(pos, top);
  const name = headName(dur);
  const hw = GLYPHS[name].adv * GS;
  const left = x - hw / 2;
  if (ledger) drawLedgers(g, x, top, pos, hw);
  glyph(name, left, y, g, 'nt-head');
  let right = left + hw;
  let dotX = right + DOT_GAP;
  let stemTip = null;
  const up = stemUp(pos, stem);
  if (dur >= 2 && stem !== 'none') {
    // la plica mide 3,5 espacios (4 en fusas, para que el tercer corchete no toque la cabeza)
    // y llega al menos a la tercera línea si la nota está muy lejos
    const len = dur >= 32 ? 8 : 7;
    let tipPos = up ? pos + len : pos - len;
    if (up && tipPos < 4) tipPos = 4;
    if (!up && tipPos > 4) tipPos = 4;
    const tipY = posY(tipPos, top);
    const a = ANCHORS[name][up ? 'stemUpSE' : 'stemDownNW'];
    const sx = up ? left + a[0] * SPACE - STEM_T : left + a[0] * SPACE; // borde izquierdo
    const base = y - a[1] * SPACE;
    let end = tipY;
    if (FLAG[dur]) {
      const fname = `flag${FLAG[dur]}${up ? 'Up' : 'Down'}`;
      const fa = ANCHORS[fname][up ? 'stemUpNW' : 'stemDownSW'];
      end = tipY - fa[1] * SPACE; // el anclaje alarga o acorta la plica para empalmar con el corchete
      glyph(fname, sx, tipY, g, 'nt-flag');
      if (up) {
        const fr = sx + GLYPHS[fname].adv * GS;
        right = Math.max(right, fr);
        dotX = Math.max(dotX, fr + 0.2 * SPACE); // el puntillo no puede tocar el corchete
      }
    }
    rect(g, sx, base, STEM_T, end - base, 'nt-stem');
    stemTip = { x: sx + STEM_T / 2, y: tipY };
  }
  if (dots) right = drawDots(g, dotX, posY(isLine(pos) ? pos + 1 : pos, top), dots);
  return { g, stemTip, right, up, left: ledger && ledgerPositions(pos).length ? left - LEDGER_EXT : left };
}

// Silencio. x es el centro del glifo. Con lines: 1 la redonda cuelga de la línea única.
export function drawRest(parent, { x, top, dur, dots = 0, lines = 5, cls }) {
  const g = group(parent, 'rest', cls);
  const name = REST[dur];
  const [x0, , x1] = GLYPHS[name].bbox;
  const left = x - ((x0 + x1) / 2) * GS;
  // origen SMuFL: la redonda cuelga de la 4.ª línea, la blanca se apoya en la 3.ª, el resto se centra en la 3.ª
  const pos = dur === 1 && lines === 5 ? 6 : 4;
  glyph(name, left, posY(pos, top), g, 'nt-rest');
  let right = left + x1 * GS;
  const dotPos = dur === 1 && lines === 1 ? 3 : 5;
  if (dots) right = drawDots(g, right + DOT_GAP, posY(dotPos, top), dots);
  return { g, left: left + x0 * GS, right };
}

// Grupo unido por barras (corcheas, semicorcheas, fusas).
// xs: centros de las cabezas; si no se da, x + i * spacing.
export function drawBeamGroup(parent, { x = 0, top, notes, spacing = 2 * SPACE, xs, stem = 'auto', cls }) {
  const g = group(parent, 'beam-group', cls);
  const X = xs ?? notes.map((_, i) => x + i * spacing);
  const up = groupUp(notes, stem);
  const n = notes.length;
  const anchor = ANCHORS.noteheadBlack[up ? 'stemUpSE' : 'stemDownNW'];
  const hw = headWidth(4);
  let right = -Infinity;
  notes.forEach((nt, i) => {
    const res = drawNote(g, { x: X[i], top, pos: nt.pos, dur: nt.dur, dots: nt.dots ?? 0, stem: 'none' });
    right = Math.max(right, res.right);
  });
  const ys = notes.map((nt) => posY(nt.pos, top));
  // centro de cada plica según el anclaje de la cabeza
  const sx = X.map((xi) => xi - hw / 2 + anchor[0] * SPACE + (up ? -STEM_T / 2 : STEM_T / 2));
  const levels = notes.map((nt) => BEAMS[nt.dur] ?? 1);
  const maxLevels = Math.max(...levels);
  // inclinación suave: 1/4 de espacio por grado, como mucho 1 espacio, y plana si una nota
  // interior sobresale de los extremos hacia las barras
  const first = notes[0].pos;
  const last = notes[n - 1].pos;
  const inner = notes.slice(1, -1).map((nt) => nt.pos);
  const concave = inner.some((p) => (up ? p > Math.max(first, last) : p < Math.min(first, last)));
  const dx = sx[n - 1] - sx[0];
  let slant = 0;
  if (!concave && last !== first && dx > 0) {
    slant = Math.sign(last - first) * Math.min(Math.abs(last - first) * 0.25 * SPACE, SPACE, dx * 0.25);
  }
  const slope = dx > 0 ? -slant / dx : 0;
  // plica mínima hasta el borde exterior de la barra; con 3 barras se alarga
  const minLen = STEM_LEN + Math.max(0, maxLevels - 2) * (BEAM_T + BEAM_GAP);
  const midY = posY(4, top);
  const fits = ys.map((y, i) =>
    up ? Math.min(y - minLen, midY) - slope * (sx[i] - sx[0]) : Math.max(y + minLen, midY) - slope * (sx[i] - sx[0]),
  );
  const b0 = up ? Math.min(...fits) : Math.max(...fits);
  const beamY = (xx) => b0 + slope * (xx - sx[0]);
  const attach = anchor[1] * SPACE;
  notes.forEach((_, i) => {
    const yb = beamY(sx[i]);
    const base = ys[i] - attach;
    rect(g, sx[i] - STEM_T / 2, base, STEM_T, yb - base, 'nt-stem');
  });
  const dir = up ? 1 : -1; // hacia las cabezas
  const seg = (xa, xb, level) => {
    const off = dir * (level - 1) * (BEAM_T + BEAM_GAP);
    const ya = beamY(xa) + off;
    const yb = beamY(xb) + off;
    poly(g, [[xa, ya], [xb, yb], [xb, yb + dir * BEAM_T], [xa, ya + dir * BEAM_T]], 'nt-beam');
  };
  const lx = (i) => sx[i] - STEM_T / 2;
  const rx = (i) => sx[i] + STEM_T / 2;
  seg(lx(0), rx(n - 1), 1);
  for (let L = 2; L <= maxLevels; L++) {
    let i = 0;
    while (i < n) {
      if (levels[i] < L) {
        i++;
        continue;
      }
      let j = i;
      while (j + 1 < n && levels[j + 1] >= L) j++;
      if (j > i) seg(lx(i), rx(j), L);
      else {
        // barra parcial: hacia la nota con la que forma el tiempo
        const toLeft = i === n - 1 || (i > 0 && notes[i - 1].dots);
        const gap = toLeft ? sx[i] - sx[i - 1] : sx[i + 1] - sx[i];
        const stub = Math.min(hw, gap * 0.5);
        if (toLeft) seg(rx(i) - stub, rx(i), L);
        else seg(lx(i), lx(i) + stub, L);
      }
      i = j + 1;
    }
  }
  right = Math.max(right, rx(n - 1));
  return { g, right, xs: X, up, stemTips: sx.map((s) => ({ x: s, y: beamY(s) })) };
}

// Ligadura de prolongación: media luna rellena (0,1 espacios en las puntas, 0,22 en el centro).
export function drawTie(parent, { x1, x2, y, above = false, cls }) {
  const g = group(parent, 'tie', cls);
  const len = x2 - x1;
  const h = Math.min(Math.max(len * 0.12 + 1.5, 0.3 * SPACE), 0.9 * SPACE); // altura de la línea media
  const b = above ? -1 : 1; // hacia dónde se curva
  // con los dos puntos de control a la misma altura c, la curva sube 0,75·c
  const co = h / 0.75 + (TIE_MID - TIE_END) / 1.5;
  const ci = h / 0.75 - (TIE_MID - TIE_END) / 1.5;
  const ca = x1 + len * 0.2;
  const cb = x2 - len * 0.2;
  const yo = y + (b * TIE_END) / 2;
  const yi = y - (b * TIE_END) / 2;
  const p = (xx, yy) => `${r2(xx)} ${r2(yy)}`;
  const d =
    `M${p(x1, yo)}C${p(ca, yo + b * co)} ${p(cb, yo + b * co)} ${p(x2, yo)}` +
    `L${p(x2, yi)}C${p(cb, yi + b * ci)} ${p(ca, yi + b * ci)} ${p(x1, yi)}Z`;
  el('path', { d, class: 'nt-tie' }, g);
  return { g };
}

function timeSigRowWidth(v) {
  const ds = String(v).split('');
  return ds.reduce((w, d) => w + GLYPHS[`timeSig${d}`].adv * GS, 0) + (ds.length - 1) * DIGIT_GAP;
}

// Cifra de compás apilada y centrada, o los símbolos C y C partida. Devuelve el ancho.
export function drawTimeSig(parent, { x, top, num, den, symbol, cls }) {
  const g = group(parent, 'timesig', cls);
  if (symbol) {
    const name = symbol === 'cut' ? 'timeSigCutCommon' : 'timeSigCommon';
    glyph(name, x, posY(4, top), g, 'nt-timesig');
    return GLYPHS[name].adv * GS;
  }
  const digits = (v) => String(v).split('').map((d) => `timeSig${d}`);
  const w = Math.max(timeSigRowWidth(num), timeSigRowWidth(den));
  const row = (v, y) => {
    let cx = x + (w - timeSigRowWidth(v)) / 2;
    for (const name of digits(v)) {
      glyph(name, cx, y, g, 'nt-timesig');
      cx += GLYPHS[name].adv * GS + DIGIT_GAP;
    }
  };
  row(num, posY(6, top));
  row(den, posY(2, top));
  return w;
}

// Barras de compás. x es el borde derecho, salvo en repeatLeft (borde izquierdo de la línea gruesa).
export function drawBarline(parent, { x, top, height = 4 * SPACE, kind = 'single', cls }) {
  const g = group(parent, 'barline-group', cls);
  const bar = (xl, w) => rect(g, xl, top, w, height, 'nt-bar');
  // los dos puntos de repeatDots están a 1,5 y 2,5 espacios de su origen: se centran en la barra
  const dots = (xl) => glyph('repeatDots', xl, top + height / 2 + 2 * SPACE, g, 'nt-dots');
  const dotW = GLYPHS.repeatDots.adv * GS;
  let left = x;
  let right = x;
  if (kind === 'single') {
    bar(x - THIN_BAR, THIN_BAR);
    left = x - THIN_BAR;
  } else if (kind === 'double') {
    bar(x - THIN_BAR, THIN_BAR);
    left = x - 2 * THIN_BAR - BAR_GAP;
    bar(left, THIN_BAR);
  } else if (kind === 'final' || kind === 'repeatRight') {
    bar(x - THICK_BAR, THICK_BAR);
    left = x - THICK_BAR - BAR_GAP - THIN_BAR;
    bar(left, THIN_BAR);
    if (kind === 'repeatRight') {
      left -= REPEAT_DOT_GAP + dotW;
      dots(left);
    }
  } else if (kind === 'repeatLeft') {
    bar(x, THICK_BAR);
    bar(x + THICK_BAR + BAR_GAP, THIN_BAR);
    right = x + THICK_BAR + BAR_GAP + THIN_BAR + REPEAT_DOT_GAP;
    dots(right);
    right += dotW;
  }
  return { g, left, right };
}

// Regulador: cresc se abre hacia la derecha, dim se cierra.
export function drawHairpin(parent, { x1, x2, y, kind = 'cresc', cls }) {
  const g = group(parent, 'hairpin', cls);
  const [ax, ox] = kind === 'dim' ? [x2, x1] : [x1, x2];
  const h = HAIRPIN_OPEN / 2;
  thickLine(g, ax, y, ox, y - h, HAIRPIN_T, 'nt-hairpin');
  thickLine(g, ax, y, ox, y + h, HAIRPIN_T, 'nt-hairpin');
  return { g };
}

// Cualquier glifo por nombre, centrado en x; y es su origen SMuFL (línea base).
export function drawSymbol(parent, name, { x, y, size = 1, cls } = {}) {
  const gl = GLYPHS[name];
  if (!gl) throw new Error(`Glifo desconocido: ${name}`);
  const g = group(parent, 'symbol', cls);
  const s = GS * size;
  const [x0, y0, x1, y1] = gl.bbox;
  const left = x - ((x1 - x0) / 2) * s;
  el('path', { d: gl.d, transform: `translate(${r2(left - x0 * s)} ${r2(y)}) scale(${s} ${-s})`, class: 'nt-symbol' }, g);
  return { g, left, right: left + (x1 - x0) * s, top: y - y1 * s, bottom: y - y0 * s };
}

// ---------- Maquetación (pura, sin DOM) ----------

const LAYOUT_PAD = 1.4 * SPACE; // del inicio de la zona de notas al centro de la primera figura
const MIN_GAP = 0.7 * SPACE; // hueco mínimo entre figuras
const UNIT = 3 * SPACE; // ancho natural de una negra cuando no se da ancho

const isNote = (it) => it.type !== 'rest';

// Pulso para agrupar barras: la negra en compases simples, la negra con puntillo en 6/8, 9/8, 12/8 (y 3/8).
const beamBeat = ([num, den]) => (den === 8 && num % 3 === 0 ? 1.5 : 1);

function beamGroups(items, timeSig) {
  const beat = beamBeat(timeSig);
  const groups = [];
  let cur = [];
  let curBeat = -1;
  const flush = () => {
    if (cur.length > 1) groups.push(cur);
    cur = [];
  };
  let t = 0;
  items.forEach((it, i) => {
    const b = beatsOf(it.dur, it.dots ?? 0);
    const k = Math.floor(t / beat + 1e-9);
    const inBeat = (t + b) / beat <= k + 1 + 1e-9;
    if (isNote(it) && it.dur >= 8 && inBeat) {
      if (cur.length && k !== curBeat) flush();
      cur.push(i);
      curBeat = k;
    } else flush();
    t += b;
  });
  flush();
  return groups;
}

// Hueco mínimo de centro a centro que necesita una figura (cabeza, puntillos, corchete).
function minSlot(it, beamed) {
  const dots = it.dots ?? 0;
  const dotsW = dots ? DOT_GAP + (dots - 1) * DOT_STEP + DOT_W : 0;
  if (!isNote(it)) {
    const [x0, , x1] = GLYPHS[REST[it.dur]].bbox;
    return (x1 - x0) * GS + dotsW + MIN_GAP;
  }
  const flagW = it.dur >= 8 && !beamed ? GLYPHS[`flag${FLAG[it.dur]}Up`].adv * GS - STEM_T : 0;
  return headWidth(it.dur) + Math.max(dotsW, flagW + (dots ? dotsW : 0)) + MIN_GAP;
}

// Reparte total entre pesos respetando mínimos (los que no llegan se fijan al mínimo).
function distribute(total, weights, mins) {
  const slots = weights.map(() => 0);
  const fixed = weights.map(() => false);
  for (;;) {
    const freeW = weights.reduce((a, w, i) => a + (fixed[i] ? 0 : w), 0);
    const freeTotal = total - mins.reduce((a, m, i) => a + (fixed[i] ? m : 0), 0);
    let changed = false;
    weights.forEach((w, i) => {
      if (fixed[i]) return;
      const s = freeW > 0 ? (freeTotal * w) / freeW : 0;
      if (s < mins[i]) {
        fixed[i] = true;
        changed = true;
      }
      slots[i] = fixed[i] ? mins[i] : s;
    });
    if (!changed) return slots;
  }
}

// Posiciones x (centro de cada figura, desde el inicio de la zona de notas) y grupos de barras.
// El espacio crece con la raíz de la duración; si faltan tiempos queda hueco al final.
export function layoutMeasure({ timeSig, items, width }) {
  const [num, den] = timeSig;
  const expectedBeats = (num * 4) / den;
  const beams = beamGroups(items, timeSig);
  const beamed = new Set(beams.flat());
  const beats = items.map((it) => beatsOf(it.dur, it.dots ?? 0));
  // un silencio de redonda solo vale el compás entero, sea cual sea la cifra
  const wholeRest = items.length === 1 && !isNote(items[0]) && items[0].dur === 1;
  const totalBeats = wholeRest ? expectedBeats : beats.reduce((a, b) => a + b, 0);
  const missing = Math.max(0, expectedBeats - totalBeats);
  const weights = beats.map((b) => Math.sqrt(b));
  const mins = items.map((it, i) => minSlot(it, beamed.has(i)));
  if (missing > 1e-9) {
    weights.push(missing);
    mins.push(0);
  }
  let slots;
  let w = width;
  if (w === undefined) {
    slots = weights.map((wt, i) => Math.max(mins[i], UNIT * wt));
    w = LAYOUT_PAD + slots.reduce((a, s) => a + s, 0);
  } else {
    slots = distribute(Math.max(0, w - LAYOUT_PAD), weights, mins);
    w = Math.max(w, LAYOUT_PAD + slots.reduce((a, s) => a + s, 0));
  }
  let x = LAYOUT_PAD;
  const out = items.map((it, i) => {
    const placed = { ...it, x };
    x += slots[i];
    return placed;
  });
  // silencio de compás entero: centrado
  if (items.length === 1 && !isNote(items[0]) && totalBeats >= expectedBeats) out[0].x = w / 2;
  return { items: out, beams, totalBeats, expectedBeats, width: w };
}

// ---------- Compás completo ----------

// Compás con clave y cifra opcionales, figuras maquetadas, ligaduras y barra final.
// width es el ancho total (cabecera incluida); si no se da, se usa el natural.
// Ligadura entre compases: si la última figura lleva tie, se dibuja hasta la barra y se devuelve
// openTie; pasándolo como tieIn al compás siguiente, se sustituye por una ligadura completa.
export function drawMeasure(parent, {
  x = 0, top, lines = 5, timeSig, showTimeSig = true, items, width, clef = null, barline = 'single', tieIn = null, cls,
}) {
  const g = group(parent, 'measure', cls);
  const single = lines === 1;
  // cabecera: clave y cifra
  let head = 0.6 * SPACE;
  const clefInfo = clef && !single ? CLEFS[clef] : null;
  const clefX = x + head;
  if (clefInfo) head += GLYPHS[clefInfo.glyph].adv * GS + 0.8 * SPACE;
  const tsX = x + head;
  if (showTimeSig) head += Math.max(timeSigRowWidth(timeSig[0]), timeSigRowWidth(timeSig[1]));
  const norm = items.map((it) => ({ ...it, pos: single ? 4 : it.pos ?? 4 }));
  const lay = layoutMeasure({ timeSig, items: norm, width: width === undefined ? undefined : width - head });
  const total = head + lay.width;
  drawStaff(g, { x, top, width: total, lines });
  if (clefInfo) glyph(clefInfo.glyph, clefX, posY(clefInfo.refPos, top), g, 'nt-clef');
  if (showTimeSig) drawTimeSig(g, { x: tsX, top, num: timeSig[0], den: timeSig[1] });

  const ox = x + head;
  const placed = lay.items.map((it) => ({ ...it, x: ox + it.x }));
  const stem = single ? 'up' : 'auto';
  const groupOf = new Map();
  lay.beams.forEach((b) => b.forEach((i) => groupOf.set(i, b)));
  const upOf = [];
  placed.forEach((it, i) => {
    if (!isNote(it)) {
      drawRest(g, { x: it.x, top, dur: it.dur, dots: it.dots ?? 0, lines });
      return;
    }
    const b = groupOf.get(i);
    if (b) {
      if (b[0] !== i) return;
      const res = drawBeamGroup(g, { top, notes: b.map((k) => placed[k]), xs: b.map((k) => placed[k].x), stem });
      b.forEach((k) => (upOf[k] = res.up));
      return;
    }
    upOf[i] = drawNote(g, { x: it.x, top, pos: it.pos, dur: it.dur, dots: it.dots ?? 0, stem }).up;
  });
  const barX = x + total;
  let openTie = null;
  // ligaduras: debajo si las dos plicas van arriba, encima en otro caso (con plicas mezcladas,
  // por debajo chocaría con la plica de la segunda); de cabeza a cabeza o hasta la barra
  placed.forEach((it, i) => {
    if (!it.tie || !isNote(it)) return;
    const next = placed[i + 1];
    if (next && !isNote(next)) return;
    const upA = upOf[i] ?? stemUp(it.pos, stem);
    const upB = next ? upOf[i + 1] ?? stemUp(next.pos, stem) : upA;
    const above = !(upA && upB);
    const y = posY(it.pos, top) + (above ? -1 : 1) * 0.6 * SPACE;
    const hw = headWidth(it.dur);
    // encima de una plica hacia arriba: arranca pasada la plica
    const x1 = above && upA && it.dur >= 2 ? it.x + hw / 2 + 0.2 * SPACE : it.x + hw * 0.3;
    const x2 = next ? next.x - headWidth(next.dur) * 0.3 : barX - 0.6 * SPACE;
    const tie = drawTie(g, { x1, x2, y, above });
    if (!next) openTie = { g: tie.g, x1, y, above };
  });
  if (tieIn && placed.length && isNote(placed[0])) {
    tieIn.g?.remove();
    drawTie(g, { x1: tieIn.x1, x2: placed[0].x - headWidth(placed[0].dur) * 0.3, y: tieIn.y, above: tieIn.above });
  }
  drawBarline(g, single ? { x: barX, top: top + SPACE, height: 2 * SPACE, kind: barline } : { x: barX, top, kind: barline });
  return { g, width: total, items: placed, totalBeats: lay.totalBeats, expectedBeats: lay.expectedBeats, openTie };
}
