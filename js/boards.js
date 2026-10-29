// Carteles de las preguntas de teoría: lo que se dibuja en el centro del escenario (compases,
// armaduras, escalas, símbolos, melodías) y las figuras que caminan por el cable.
// Usa js/notation.js para figuras, silencios, barras de compás y signos.

import { el, glyph, StaffSystem, makeBird, makeCluster, SPACE } from './staff.js';
import { GLYPHS } from './glyphs.js';
import {
  drawNote, drawRest, drawBeamGroup, drawTie, drawTimeSig, drawBarline, drawHairpin, drawSymbol, drawMeasure,
} from './notation.js';

// Figura, silencio, grupo con barra o dos figuras ligadas, centrados en x = 0
// (en notation.js, x es el centro de la cabeza o del silencio).
export function drawFigure(parent, fig, top, lines = 5) {
  if (fig.rest) return drawRest(parent, { x: 0, top, dur: fig.dur, dots: fig.dots ?? 0, lines });
  if (fig.tie) {
    const [a, b] = fig.tie;
    drawNote(parent, { x: -13, top, pos: 4, dur: a.dur, stem: 'up' });
    drawNote(parent, { x: 13, top, pos: 4, dur: b.dur, stem: 'up' });
    drawTie(parent, { x1: -9, x2: 9, y: top + 26, above: false });
    return null;
  }
  if (fig.group > 1) {
    const spacing = fig.group === 2 ? 14 : 11;
    return drawBeamGroup(parent, {
      x: (-(fig.group - 1) * spacing) / 2,
      top,
      notes: Array.from({ length: fig.group }, () => ({ pos: 4, dur: fig.dur, dots: 0 })),
      spacing,
      stem: fig.stem === 'down' ? 'down' : 'up',
    });
  }
  return drawNote(parent, { x: 0, top, pos: 4, dur: fig.dur, dots: fig.dots ?? 0, stem: fig.stem ?? 'up' });
}

const textEl = (parent, x, y, text, cls) => {
  const t = el('text', { x, y, 'text-anchor': 'middle', class: cls }, parent);
  t.textContent = text;
  return t;
};

function staffLines(parent, top, width, lines = 5) {
  if (lines === 1) {
    el('line', { x1: 0, x2: width, y1: top + 20, y2: top + 20, class: 'wire' }, parent);
    return;
  }
  for (let l = 0; l < 5; l++) el('line', { x1: 0, x2: width, y1: top + l * SPACE, y2: top + l * SPACE, class: 'wire' }, parent);
}

// Notas en fila sobre un pentagrama (escalas, melodías, grados). Devuelve las x de cada nota.
function notesRow(g, { clef, fifths = 0, notes, spacing = 20, birds, startPad = 6 }) {
  const sys = new StaffSystem([clef], fifths);
  const width = sys.noteStartX + startPad + notes.length * spacing + 6;
  sys.draw(g, width);
  const xs = notes.map((_, i) => sys.noteStartX + startPad + spacing * (i + 0.5));
  const groups = notes.map((n, i) => {
    const cell = el('g', { transform: `translate(${xs[i]} 0)`, class: 'cell', 'data-i': i }, g);
    makeBird(cell, { y: sys.yFor(n.pos, clef), pos: n.pos, shownAlt: n.shownAlt, birds, topY: sys.topFor(clef) });
    return cell;
  });
  const ext = sys.extent(notes.map((n) => ({ clef, pos: n.pos })));
  return { sys, width, xs, groups, ext };
}

// Comienzo de una canción en su pentagrama, con su ritmo (figuras reales, sin barras de compás).
// parts: [{ rest, dur, dots, pos, shownAlt }]. Devuelve la caja para el viewBox y la x de cada nota.
export function drawHook(svg, { clef, key = 0, parts }) {
  svg.innerHTML = '';
  const g = el('g', { class: 'board-in hook' }, svg);
  const sys = new StaffSystem([clef], key);
  const gap = (p) => 12 + 9 * Math.sqrt(p.beats ?? 4 / p.dur) + (p.shownAlt !== null && p.shownAlt !== undefined ? 7 : 0);
  let x = sys.noteStartX + 10;
  const xs = parts.map((p) => {
    const at = x + (p.shownAlt !== null && p.shownAlt !== undefined ? 7 : 0);
    x += gap(p);
    return at;
  });
  const width = x + 4;
  sys.draw(g, width);
  const top = sys.topFor(clef);
  const cells = []; // una por nota (sin silencios), para marcar las ya leídas
  parts.forEach((p, i) => {
    if (p.rest) return drawRest(g, { x: xs[i], top, dur: p.dur, dots: p.dots });
    const cell = el('g', { class: 'cell', 'data-i': cells.length }, g);
    if (p.shownAlt !== null && p.shownAlt !== undefined) {
      const kind = p.shownAlt === 1 ? 'sharp' : p.shownAlt === -1 ? 'flat' : 'natural';
      glyph(kind, xs[i] - 6 - GLYPHS[kind].adv * (10 / 250), sys.yFor(p.pos, clef), cell, 'accidental');
    }
    drawNote(cell, { x: xs[i], top, pos: p.pos, dur: p.dur, dots: p.dots });
    cell.setAttribute('transform', 'translate(0 0)');
    cell.dataset.x = xs[i];
    cells.push(cell);
  });
  const ext = sys.extent(parts.filter((p) => !p.rest).map((p) => ({ clef, pos: p.pos })));
  return { box: [-4, Math.min(ext.min, -22) - 4, width + 8, Math.max(ext.max, 62) - Math.min(ext.min, -22) + 14], xs, cells, ext };
}

function drawSymbolStim(g, s) {
  if (s.glyph) {
    drawSymbol(g, s.glyph, { x: 40, y: 28, size: 1.6 });
    return [0, -6, 80, 50];
  }
  if (s.text) {
    textEl(g, 60, 30, s.text, 'term');
    return [0, 0, 120, 46];
  }
  if (s.hairpin) {
    drawHairpin(g, { x1: 10, x2: 90, y: 24, kind: s.hairpin });
    return [0, 4, 100, 40];
  }
  // Signos que necesitan pentagrama: articulaciones, ligaduras, repeticiones y casillas.
  staffLines(g, 0, 120);
  if (s.note) {
    drawNote(g, { x: 60, top: 0, pos: 2, dur: 4, stem: 'down' });
    drawSymbol(g, s.artic, { x: 60, y: s.artic === 'fermataAbove' ? -5 : 21, size: 1 });
    return [0, -22, 120, 82];
  }
  if (s.slur) {
    [2, 3, 4].forEach((pos, i) => drawNote(g, { x: 34 + i * 26, top: 0, pos, dur: 4, stem: 'down' }));
    el('path', { d: 'M33 22 Q60 3 87 12 Q60 8 33 22 Z', class: 'slur' }, g);
    return [0, -10, 120, 84];
  }
  if (s.repeat) {
    drawBarline(g, { x: 10, top: 0, height: 40, kind: 'repeatLeft' });
    [4, 5, 6].forEach((pos, i) => drawNote(g, { x: 40 + i * 20, top: 0, pos, dur: 4, stem: 'up' }));
    drawBarline(g, { x: 110, top: 0, height: 40, kind: 'repeatRight' });
    return [0, -20, 120, 70];
  }
  if (s.volta) {
    [3, 4].forEach((pos, i) => drawNote(g, { x: 18 + i * 18, top: 0, pos, dur: 4, stem: 'up' }));
    drawBarline(g, { x: 58, top: 0, height: 40, kind: 'repeatRight' });
    [5, 2].forEach((pos, i) => drawNote(g, { x: 74 + i * 20, top: 0, pos, dur: 4, stem: 'up' }));
    el('path', { d: 'M6 -14 V-22 H54', class: 'volta' }, g);
    el('path', { d: 'M64 -14 V-22 H118', class: 'volta' }, g);
    textEl(g, 14, -25, '1.', 'volta-n');
    textEl(g, 72, -25, '2.', 'volta-n');
    return [0, -34, 120, 84];
  }
  return [0, 0, 100, 40];
}

// Fragmento rítmico de 1 a 3 compases (comp-5), con corchete de tresillo. x avanza de centro en centro.
function drawRhythmStim(g, stim) {
  const top = 0;
  const [num, den] = stim.timeSig;
  const tsW = drawTimeSig(g, { x: 6, top, num, den }) ?? 14;
  let x = 6 + tsW + 12;
  const start = 0;
  stim.measures.forEach((m, mi) => {
    let i = 0;
    while (i < m.length) {
      const f = m[i];
      if (f.tuplet) {
        const r = drawBeamGroup(g, { x, top, notes: [0, 1, 2].map(() => ({ pos: 4, dur: 8, dots: 0 })), spacing: 13, stem: 'up' });
        const x2 = x + 26;
        el('path', { d: `M${x - 4} -2 V-6 H${x2 + 4} V-2`, class: 'tuplet' }, g);
        textEl(g, x + 13, -8, '3', 'tuplet-n');
        x = (r?.right ?? x2) + 14;
        i += 3;
        continue;
      }
      if (f.d === 8 && m[i + 1]?.d === 8 && !f.rest && !m[i + 1].rest && !m[i + 1].tuplet) {
        const r = drawBeamGroup(g, { x, top, notes: [{ pos: 4, dur: 8 }, { pos: 4, dur: 8 }], spacing: 14, stem: 'up' });
        x = (r?.right ?? x + 14) + 14;
        i += 2;
        continue;
      }
      if (f.rest) drawRest(g, { x, top, dur: f.d, dots: f.dots ?? 0, lines: 1 });
      else drawNote(g, { x, top, pos: 4, dur: f.d, dots: f.dots ?? 0, stem: 'up' });
      x += 10 + 22 / Math.sqrt(f.d / 2);
      i++;
    }
    const last = mi === stim.measures.length - 1;
    el('line', { x1: x, x2: x, y1: 10, y2: 30, class: 'barline' }, g);
    if (last) el('rect', { x: x + 2, y: 10, width: 2.5, height: 20, class: 'barline-thick' }, g);
    x += 12;
  });
  el('line', { x1: start, x2: x - 8, y1: 20, y2: 20, class: 'wire' }, g);
  return [start - 4, -16, x - start, 60];
}

// Dibuja el estímulo de un ítem de cartel. Devuelve la caja [x, y, ancho, alto] para el viewBox
// y, en melodías, las celdas de cada nota (para marcar las ya leídas).
export function drawBoard(svg, item, { birds = true } = {}) {
  svg.innerHTML = '';
  const g = el('g', { class: 'board-in' }, svg);
  const s = item.stim;

  // Ítems del cable mostrados en cartel (niveles mixtos).
  if (!s) {
    const clefs = item.clef === 'rhythm' ? ['rhythm'] : [item.clef ?? 'treble'];
    const sys = new StaffSystem(clefs, 0);
    const width = sys.noteStartX + 60;
    sys.draw(g, width);
    const holder = el('g', { transform: `translate(${sys.noteStartX + 28} 0)` }, g);
    if (item.figure) drawFigure(holder, item.figure, sys.topFor(clefs[0]), clefs[0] === 'rhythm' ? 1 : 5);
    else makeCluster(holder, { notes: item.notes, arrangement: item.arrangement, birds, system: sys });
    const ext = item.notes ? sys.extent(item.notes.map((n) => ({ clef: n.clef, pos: n.pos }))) : { min: -26, max: 54 };
    return { box: [-2, ext.min - 6, width + 4, ext.max - ext.min + 12] };
  }

  if (s.type === 'measure') {
    const width = Math.max(110, s.items.length * 17 + (s.timeSig ? 40 : 24));
    // Sin cifra visible («¿qué compás es?») se sigue pasando el compás para agrupar las barras.
    const r = drawMeasure(g, { x: 0, top: 0, lines: s.lines ?? 1, timeSig: s.meter, showTimeSig: !!s.timeSig, items: s.items, width });
    const w = r?.width ?? width;
    return { box: [-6, -24, w + 12, 74] };
  }
  if (s.type === 'rhythm') return { box: drawRhythmStim(g, s) };
  if (s.type === 'symbol') return { box: drawSymbolStim(g, s) };
  if (s.type === 'keysig') {
    const sys = new StaffSystem([s.clef], s.fifths);
    const width = sys.noteStartX + 14;
    sys.draw(g, width);
    return { box: [-4, -16, width + 8, 72] };
  }
  if (s.type === 'scale') {
    const { width, xs, ext } = notesRow(g, { clef: s.clef, notes: s.notes, spacing: 16, birds: false });
    if (s.highlight) {
      const [a, b] = s.highlight;
      el('rect', { x: xs[a] - 9, y: ext.min - 2, width: xs[b] - xs[a] + 18, height: ext.max - ext.min + 4, rx: 9, class: 'pair-band' }, g, );
      g.insertBefore(g.lastChild, g.firstChild);
      textEl(g, (xs[a] + xs[b]) / 2, ext.max + 10, `${a + 1}.º – ${b + 1}.º`, 'degree-n');
    }
    return { box: [-4, ext.min - 6, width + 8, ext.max - ext.min + 24] };
  }
  if (s.type === 'degree') {
    const sys = new StaffSystem([s.clef], s.fifths);
    const width = sys.noteStartX + 50;
    sys.draw(g, width);
    const holder = el('g', { transform: `translate(${sys.noteStartX + 22} 0)` }, g);
    if (s.chord) makeCluster(holder, { notes: s.notes, arrangement: 'harmonic', birds: false, system: sys });
    else makeBird(holder, { y: sys.yFor(s.notes[0].pos, s.clef), pos: s.notes[0].pos, shownAlt: null, birds, topY: 0 });
    const ext = sys.extent(s.notes.map((n) => ({ clef: s.clef, pos: n.pos })));
    return { box: [-4, ext.min - 6, width + 8, ext.max - ext.min + 12] };
  }
  if (s.type === 'melody') {
    const { width, groups, ext } = notesRow(g, { clef: s.clef, fifths: s.key, notes: s.notes, spacing: 24, birds });
    groups.forEach((c, i) => c.classList.toggle('current', i === 0));
    return { box: [-4, ext.min - 6, width + 8, ext.max - ext.min + 26], cells: groups, ext };
  }
  return { box: [0, 0, 100, 50] };
}
