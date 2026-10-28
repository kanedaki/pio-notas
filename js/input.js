// Teclado de respuestas. Modos:
// - 'names': botones con nombres de nota (filas de ♯ y ♭ si el nivel las usa).
// - 'piano': una octava (vale cualquier octava) o varias (range: hay que tocar la octava escrita).
// - 'choices': botones con las opciones de una pregunta de teoría; pueden cambiar en cada pregunta.
// - 'twostep': dos filas (número y calidad del intervalo); la respuesta sale al tocar la segunda.
// Responde en pointerdown (sin el retardo del click) y también con el teclado físico.

import { displayName, secondaryName } from './music.js';

const BLACK_KEYS = [
  { pc: 1, after: 0, sharp: 0, flat: 1 },
  { pc: 3, after: 1, sharp: 1, flat: 2 },
  { pc: 6, after: 3, sharp: 3, flat: 4 },
  { pc: 8, after: 4, sharp: 4, flat: 5 },
  { pc: 10, after: 5, sharp: 5, flat: 6 },
];
const WHITE_PC = [0, 2, 4, 5, 7, 9, 11];
const RARE = { 1: [2, 6], '-1': [0, 3] }; // Mi♯ Si♯ / Do♭ Fa♭

function button(cls, html) {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.innerHTML = html;
  return b;
}

// alts: alteraciones que aparecen en el nivel (p. ej. new Set([0, 1])).
// rare: grados con Mi♯, Si♯, Do♭ o Fa♭ que el nivel sí necesita.
// range: [midiMin, midiMax] para el piano de octava exacta.
export function createPad(container, { mode, naming, labels, alts = new Set([0]), rare = new Set(), choices = [], first = [], second = [], range = null, onAnswer }) {
  container.innerHTML = '';
  container.classList.remove('pad-names', 'pad-piano', 'pad-choices', 'pad-twostep', 'pad-wide');
  container.classList.add('pad', `pad-${mode}`);
  let keys = [];
  let picked = null; // primer toque en el modo de dos pasos

  const press = (node, answer, { tap = false } = {}) => {
    if (tap) {
      // En el piano que se desplaza, un toque responde y un arrastre solo desplaza.
      let start = null;
      node.addEventListener('pointerdown', (e) => { start = { x: e.clientX, y: e.clientY }; });
      node.addEventListener('pointerup', (e) => {
        if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) < 10) onAnswer(answer, node);
        start = null;
      });
    } else {
      node.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        onAnswer(answer, node);
      });
    }
    keys.push({ node, answer });
  };

  function renderChoices(list) {
    container.querySelector('.choices')?.remove();
    keys = keys.filter((k) => !k.choice);
    const grid = document.createElement('div');
    const long = Math.max(...list.map((c) => c.label.length)) > 5;
    grid.className = `choices ${long ? 'long' : 'short'}`;
    grid.style.setProperty('--n', Math.min(list.length, long ? 2 : 7));
    list.forEach((c) => {
      const b = button('name-key choice', `<span class="main">${c.label}</span>${c.sub ? `<span class="sub">${c.sub}</span>` : ''}`);
      press(b, { choice: c.value });
      keys[keys.length - 1].choice = true;
      grid.appendChild(b);
    });
    container.appendChild(grid);
  }

  if (mode === 'choices') {
    renderChoices(choices);
  } else if (mode === 'twostep') {
    for (const [row, list] of [['first', first], ['second', second]]) {
      const grid = document.createElement('div');
      grid.className = `choices short twostep-${row}`;
      grid.style.setProperty('--n', Math.min(list.length, 7));
      list.forEach((c) => {
        const b = button('name-key choice', `<span class="main">${c.label}</span>${c.sub ? `<span class="sub">${c.sub}</span>` : ''}`);
        b.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          if (row === 'first') {
            picked = c.value;
            grid.querySelectorAll('.choice').forEach((x) => x.classList.toggle('sel', x === b));
          } else if (picked) {
            const answer = { choice: `${picked}${c.value}` };
            onAnswer(answer, b);
            picked = null;
            container.querySelectorAll('.sel').forEach((x) => x.classList.remove('sel'));
          } else {
            b.classList.remove('bad');
            void b.offsetWidth;
            container.querySelector('.twostep-first')?.classList.add('nudge');
            setTimeout(() => container.querySelector('.twostep-first')?.classList.remove('nudge'), 500);
          }
        });
        keys.push({ node: b, answer: { part: row, value: c.value } });
        grid.appendChild(b);
      });
      container.appendChild(grid);
    }
  } else if (mode === 'piano' && range) {
    // Varias octavas, de Do a Si; si no caben, se desplaza en horizontal.
    const lowC = Math.floor(range[0] / 12) * 12;
    const highB = Math.ceil((range[1] + 1) / 12) * 12 - 1;
    const octaves = (highB + 1 - lowC) / 12;
    container.classList.add('pad-wide');
    const scroller = document.createElement('div');
    scroller.className = 'piano-scroll';
    const piano = document.createElement('div');
    piano.className = 'piano wide';
    piano.style.setProperty('--whites', octaves * 7);
    for (let o = 0; o < octaves; o++) {
      WHITE_PC.forEach((pc, step) => {
        const m = lowC + o * 12 + pc;
        const name = displayName({ step, alt: 0 }, naming);
        const isMiddle = m === 60;
        const k = button(`key white${isMiddle ? ' middle-c' : ''}`, labels || step === 0 ? `<span>${name}${isMiddle ? '<i>central</i>' : ''}</span>` : '');
        k.setAttribute('aria-label', `${name}${isMiddle ? ' central' : ''}, octava ${o + 1}`);
        press(k, { midi: m }, { tap: true });
        piano.appendChild(k);
      });
      BLACK_KEYS.forEach((b) => {
        const k = button('key black', '');
        k.style.setProperty('--after', o * 7 + b.after);
        k.setAttribute('aria-label', `${displayName({ step: b.sharp, alt: 1 }, naming)} o ${displayName({ step: b.flat, alt: -1 }, naming)}`);
        press(k, { midi: lowC + o * 12 + b.pc }, { tap: true });
        piano.appendChild(k);
      });
    }
    scroller.appendChild(piano);
    container.appendChild(scroller);
    // Al empezar, el Do central en el centro de la vista.
    requestAnimationFrame(() => {
      const mid = piano.querySelector('.middle-c') ?? piano.children[Math.floor(octaves / 2) * 7];
      if (mid) scroller.scrollLeft = mid.offsetLeft - scroller.clientWidth / 2 + mid.offsetWidth / 2;
    });
  } else if (mode === 'piano') {
    const piano = document.createElement('div');
    piano.className = 'piano';
    WHITE_PC.forEach((pc, step) => {
      const k = button('key white', labels ? `<span>${displayName({ step, alt: 0 }, naming)}</span>` : '');
      k.setAttribute('aria-label', displayName({ step, alt: 0 }, naming));
      press(k, { pc });
      piano.appendChild(k);
    });
    BLACK_KEYS.forEach((b) => {
      const sharp = displayName({ step: b.sharp, alt: 1 }, naming);
      const flat = displayName({ step: b.flat, alt: -1 }, naming);
      const k = button('key black', labels && alts.size > 1 ? `<span>${sharp}<br>${flat}</span>` : '');
      k.style.setProperty('--after', b.after);
      k.setAttribute('aria-label', `${sharp} o ${flat}`);
      press(k, { pc: b.pc });
      piano.appendChild(k);
    });
    container.appendChild(piano);
  } else {
    const rows = [];
    if (alts.has(1)) rows.push(1);
    rows.push(0);
    if (alts.has(-1)) rows.push(-1);
    for (const alt of rows) {
      const row = document.createElement('div');
      row.className = `names-row alt${alt}`;
      for (let step = 0; step < 7; step++) {
        const hidden = alt !== 0 && RARE[alt].includes(step) && !rare.has(`${step}:${alt}`);
        const n = { step, alt };
        const b = button('name-key', hidden ? '' : `<span class="main">${displayName(n, naming)}</span><span class="sub">${secondaryName(n, naming)}</span>`);
        if (hidden) {
          b.classList.add('ghost');
          b.disabled = true;
          b.setAttribute('aria-hidden', 'true');
        } else {
          press(b, { step, alt });
        }
        row.appendChild(b);
      }
      container.appendChild(row);
    }
  }

  const letters = { KeyC: 0, KeyD: 1, KeyE: 2, KeyF: 3, KeyG: 4, KeyA: 5, KeyB: 6 };
  const onKey = (e) => {
    if (e.repeat || e.target.closest?.('input, textarea')) return;
    if (mode === 'choices' || mode === 'twostep') {
      const k = keys[Number(e.key) - 1];
      if (k && mode === 'choices') onAnswer(k.answer, k.node);
      return;
    }
    if (!(e.code in letters)) return;
    const step = letters[e.code];
    const alt = e.shiftKey ? 1 : e.altKey || e.ctrlKey ? -1 : 0;
    const want = mode === 'piano' ? { pc: (WHITE_PC[step] + alt + 12) % 12 } : { step, alt };
    const k = keys.find((x) => ('midi' in x.answer ? ((x.answer.midi % 12) === want.pc && x.answer.midi >= 60 && x.answer.midi < 72) : JSON.stringify(x.answer) === JSON.stringify(want)));
    if (k) {
      e.preventDefault();
      onAnswer(k.answer, k.node);
    }
  };
  window.addEventListener('keydown', onKey);

  const find = (target) =>
    keys.filter((x) => {
      if ('part' in x.answer) return 'choice' in target && (x.answer.part === 'first' ? target.choice.startsWith(x.answer.value) : target.choice.slice(1) === x.answer.value);
      if ('choice' in x.answer) return x.answer.choice === target.choice;
      if ('midi' in x.answer) return x.answer.midi === target.midi;
      if ('pc' in x.answer) return x.answer.pc === target.pc;
      return x.answer.step === target.step && x.answer.alt === target.alt;
    });

  return {
    // Marca la tecla correcta (tras un fallo) para que el jugador la encuentre.
    hint(target) {
      for (const k of find(target)) {
        k.node.classList.remove('hint');
        void k.node.offsetWidth;
        k.node.classList.add('hint');
        k.node.scrollIntoView?.({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    },
    // Modo con ayuda o nota nueva: la tecla correcta queda iluminada hasta acertar.
    guide(target) {
      for (const k of find(target)) k.node.classList.add('guide');
    },
    flash(node, kind) {
      node.classList.remove('ok', 'bad');
      void node.offsetWidth;
      node.classList.add(kind);
    },
    clearHints() {
      keys.forEach((k) => k.node.classList.remove('hint', 'guide'));
    },
    // Botones distintos para esta pregunta (p. ej. 4 significados posibles de un símbolo).
    setChoices(list) {
      if (mode === 'choices') renderChoices(list);
    },
    destroy() {
      window.removeEventListener('keydown', onKey);
    },
  };
}
