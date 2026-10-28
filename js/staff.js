// Dibujo del pentagrama en SVG. Unidades: 1 espacio = 10, media línea = 5.
// La línea superior de cada pentagrama está en y = top; la posición 0 es la primera línea.

import { GLYPHS } from './glyphs.js';
import { CLEFS, ledgerPositions, keySignatureLayout } from './music.js';

const NS = 'http://www.w3.org/2000/svg';
export const SPACE = 10;
const GS = SPACE / 250; // escala de los glifos SMuFL
export const GRAND_GAP = 100; // distancia entre la línea superior de cada pentagrama del sistema doble
const HEAD_W = GLYPHS.noteheadBlack.adv * GS;

export function el(name, attrs = {}, parent = null) {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== null) node.setAttribute(k, v);
  if (parent) parent.appendChild(node);
  return node;
}

export function glyph(name, x, y, parent, cls) {
  return el('path', { d: GLYPHS[name].d, transform: `translate(${x} ${y}) scale(${GS} ${-GS})`, class: cls }, parent);
}

export const posY = (pos, top = 0) => top + (8 - pos) * (SPACE / 2);

// Sistema de uno o dos pentagramas con clave y armadura. La «clave» 'rhythm' es una sola línea
// sin clave, como en la lectura rítmica del conservatorio (las figuras se apoyan en ella).
export class StaffSystem {
  constructor(clefs, key = 0) {
    this.clefs = clefs;
    this.key = key;
    this.tops = clefs.map((_, i) => i * GRAND_GAP);
    const rhythm = clefs.every((c) => c === 'rhythm');
    const keyWidth = rhythm ? 0 : Math.max(...clefs.map((c) => keySignatureLayout(key, c).length)) * 10;
    this.lineX = clefs.length > 1 ? 7.5 : 0;
    this.clefX = this.lineX + 4;
    this.noteStartX = rhythm ? 16 : this.clefX + 32 + keyWidth + 6; // donde empieza la zona de notas
  }

  topFor(clef) {
    return this.tops[this.clefs.indexOf(clef)];
  }

  yFor(pos, clef) {
    return posY(pos, this.topFor(clef));
  }

  // Extensión vertical necesaria para un conjunto de posiciones [{ clef, pos }].
  extent(items) {
    let min = 0;
    let max = this.tops[this.tops.length - 1] + 4 * SPACE;
    for (const { clef, pos } of items) {
      const y = this.yFor(pos, clef);
      min = Math.min(min, y - 9);
      max = Math.max(max, y + 9);
    }
    return { min: min - 4, max: max + 4 };
  }

  draw(parent, width) {
    const g = el('g', { class: 'system' }, parent);
    this.clefs.forEach((clef, i) => {
      const top = this.tops[i];
      if (clef === 'rhythm') {
        el('line', { x1: this.lineX, x2: width, y1: top + 2 * SPACE, y2: top + 2 * SPACE, class: 'wire' }, g);
        return;
      }
      for (let l = 0; l < 5; l++) {
        el('line', { x1: this.lineX, x2: width, y1: top + l * SPACE, y2: top + l * SPACE, class: 'wire' }, g);
      }
      const info = CLEFS[clef];
      glyph(info.glyph, this.clefX, posY(info.refPos, top), g, 'clef');
      const keyX = this.clefX + 32;
      keySignatureLayout(this.key, clef).forEach((acc, j) => {
        glyph(acc.kind, keyX + j * 10, posY(acc.pos, top), g, 'keysig');
      });
    });
    if (this.clefs.length > 1) {
      const h = this.tops[1] + 4 * SPACE;
      el('line', { x1: this.lineX, x2: this.lineX, y1: 0, y2: h, class: 'barline' }, g);
      // la llave mide 1 em (4 espacios); se estira a la altura del sistema
      el('path', { d: GLYPHS.brace.d, transform: `translate(1 ${h}) scale(${GS * 1.9} ${-h / 1000})`, class: 'brace' }, g);
    }
    return g;
  }
}

// Pájaro-nota. El cuerpo es una cabeza de nota negra real, así que la lectura no cambia.
// Pico, ojo y cola son adornos horizontales que se pueden quitar en Ajustes.
export function makeBird(parent, { y, pos, shownAlt, birds, topY }) {
  const outer = el('g', { class: 'bird' }, parent);
  const inner = el('g', { class: 'bird-inner' }, outer);
  el('circle', { cx: 0, cy: y, r: 11, class: 'halo' }, inner);
  makeBirdBody(inner, { y, pos, shownAlt, birds, topY });
  return { outer, inner };
}

// Cabeza de nota con líneas adicionales, alteración y, si se quiere, adornos de pájaro.
function makeBirdBody(inner, { y, pos, shownAlt, birds, topY, offsetAcc = 0 }) {
  for (const lp of ledgerPositions(pos)) {
    const ly = topY + (8 - lp) * (SPACE / 2);
    el('line', { x1: -10, x2: 10, y1: ly, y2: ly, class: 'ledger' }, inner);
  }
  const body = el('g', { class: 'body' }, inner);
  glyph('noteheadBlack', -HEAD_W / 2, y, body, 'head');
  if (birds) {
    el('path', { d: `M${-HEAD_W / 2 + 0.8} ${y - 0.2} l-3.6 1.1 l3.4 1.6 z`, class: 'beak' }, body);
    el('path', { d: `M${HEAD_W / 2 - 1.2} ${y - 1.8} l4.6 -3 l-1.2 4.1 z`, class: 'tail' }, body);
    el('circle', { cx: -2.1, cy: y - 1.3, r: 1.05, class: 'eye' }, body);
    el('path', { d: `M-1.2 ${y + 1.6} q2.4 1.6 4.6 -1.2`, class: 'wing' }, body);
  }
  if (shownAlt !== null && shownAlt !== undefined) {
    const kind = shownAlt === 1 ? 'sharp' : shownAlt === -1 ? 'flat' : 'natural';
    glyph(kind, -HEAD_W / 2 - 3 - GLYPHS[kind].adv * GS - offsetAcc, y, inner, 'accidental');
  }
}

// Nota guía en hueco (pista tras un fallo), con su nombre debajo o encima.
export function makeGhost(parent, { x, y, pos, topY, text, below = true }) {
  const g = el('g', { class: 'ghost', transform: `translate(${x} 0)` }, parent);
  for (const lp of ledgerPositions(pos)) {
    const ly = topY + (8 - lp) * (SPACE / 2);
    el('line', { x1: -8, x2: 8, y1: ly, y2: ly, class: 'ledger' }, g);
  }
  el('ellipse', { cx: 0, cy: y, rx: 5.4, ry: 4.1, transform: `rotate(-20 0 ${y})`, class: 'ghost-head' }, g);
  const t = el('text', { x: 0, y: below ? y + 13 : y - 9, 'text-anchor': 'middle', class: 'ghost-name' }, g);
  t.textContent = text;
  return g;
}

// Dos o tres pájaros juntos (intervalos y acordes). melodic: uno detrás de otro, unidos por una
// ramita; harmonic: apilados (si están a una 2.ª, el de arriba se aparta a la derecha, como en la partitura).
export function makeCluster(parent, { notes, arrangement, birds, system }) {
  const outer = el('g', { class: 'bird cluster' }, parent);
  const inner = el('g', { class: 'bird-inner' }, outer);
  const ys = notes.map((n) => system.yFor(n.pos, n.clef));
  el('circle', { cx: 0, cy: (Math.min(...ys) + Math.max(...ys)) / 2, r: 12 + (Math.max(...ys) - Math.min(...ys)) / 2, class: 'halo' }, inner);
  const xs = notes.map((n, i) => {
    if (arrangement === 'melodic') return (i - (notes.length - 1) / 2) * 22;
    const prev = notes[i - 1];
    const second = prev && prev.clef === n.clef && Math.abs(prev.pos - n.pos) === 1;
    return second ? HEAD_W - 0.6 : 0;
  });
  if (arrangement === 'melodic' && notes.length > 1) {
    el('path', { d: `M${xs[0]} ${ys[0] + 6} Q${(xs[0] + xs[xs.length - 1]) / 2} ${Math.max(...ys) + 12} ${xs[xs.length - 1]} ${ys[ys.length - 1] + 6}`, class: 'twig' }, inner);
  }
  notes.forEach((n, i) => {
    const g = el('g', { transform: `translate(${xs[i]} 0)` }, inner);
    makeBirdBody(g, { y: ys[i], pos: n.pos, shownAlt: n.shownAlt, birds: birds && arrangement === 'melodic', topY: system.topFor(n.clef), offsetAcc: arrangement === 'harmonic' ? i * 9 : 0 });
  });
  return { outer, inner, ys, xs };
}

// Etiqueta con el nombre de la nota sobre un pájaro (tras un fallo o al escaparse).
export function makeLabel(parent, x, y, text, cls = 'label') {
  const g = el('g', { class: cls, transform: `translate(${x} ${y})` }, parent);
  const t = el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
  t.textContent = text;
  return g;
}
