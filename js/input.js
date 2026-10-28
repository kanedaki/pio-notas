// Teclado de respuestas: botones con nombres de nota o un piano de una octava.
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

// alts: alteraciones que aparecen en el nivel (p. ej. new Set([0, 1])).
// rareSteps: grados con Mi♯, Si♯, Do♭ o Fa♭ que el nivel sí necesita.
export function createPad(container, { mode, naming, labels, alts, rare = new Set(), choices = [], onAnswer }) {
  container.innerHTML = '';
  container.classList.remove('pad-names', 'pad-piano');
  container.classList.add('pad', `pad-${mode}`);
  const keys = [];

  const press = (node, answer) => {
    node.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      onAnswer(answer, node);
    });
    keys.push({ node, answer });
  };

  if (mode === 'choices') {
    const row = document.createElement('div');
    row.className = 'choices-row';
    choices.forEach((c) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'name-key choice';
      b.innerHTML = `<span class="main">${c.label}</span>`;
      press(b, { choice: c.value });
      row.appendChild(b);
    });
    container.appendChild(row);
  } else if (mode === 'piano') {
    const piano = document.createElement('div');
    piano.className = 'piano';
    WHITE_PC.forEach((pc, step) => {
      const k = document.createElement('button');
      k.className = 'key white';
      k.type = 'button';
      k.setAttribute('aria-label', displayName({ step, alt: 0 }, naming));
      if (labels) k.innerHTML = `<span>${displayName({ step, alt: 0 }, naming)}</span>`;
      press(k, { pc });
      piano.appendChild(k);
    });
    BLACK_KEYS.forEach((b) => {
      const k = document.createElement('button');
      k.className = 'key black';
      k.type = 'button';
      k.style.setProperty('--after', b.after);
      const sharp = displayName({ step: b.sharp, alt: 1 }, naming);
      const flat = displayName({ step: b.flat, alt: -1 }, naming);
      k.setAttribute('aria-label', `${sharp} o ${flat}`);
      if (labels && alts.size > 1) k.innerHTML = `<span>${sharp}<br>${flat}</span>`;
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
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'name-key';
        if (hidden) {
          b.classList.add('ghost');
          b.disabled = true;
          b.setAttribute('aria-hidden', 'true');
        } else {
          const n = { step, alt };
          b.innerHTML = `<span class="main">${displayName(n, naming)}</span><span class="sub">${secondaryName(n, naming)}</span>`;
          press(b, { step, alt });
        }
        row.appendChild(b);
      }
      container.appendChild(row);
    }
  }

  const letters = { KeyC: 0, KeyD: 1, KeyE: 2, KeyF: 3, KeyG: 4, KeyA: 5, KeyB: 6 };
  const onKey = (e) => {
    if (mode === 'choices') {
      const k = keys[Number(e.key) - 1];
      if (k && !e.repeat) onAnswer(k.answer, k.node);
      return;
    }
    if (e.repeat || !(e.code in letters)) return;
    const step = letters[e.code];
    const alt = e.shiftKey ? 1 : e.altKey || e.ctrlKey ? -1 : 0;
    const want = mode === 'piano' ? { pc: (WHITE_PC[step] + alt + 12) % 12 } : { step, alt };
    const k = keys.find((x) => JSON.stringify(x.answer) === JSON.stringify(want));
    if (k) {
      e.preventDefault();
      onAnswer(k.answer, k.node);
    }
  };
  window.addEventListener('keydown', onKey);

  const find = (target) =>
    keys.find((x) => {
      if ('choice' in x.answer) return x.answer.choice === target.choice;
      if ('pc' in x.answer) return x.answer.pc === target.pc;
      return x.answer.step === target.step && x.answer.alt === target.alt;
    });

  return {
    // Marca la tecla correcta (tras un fallo) para que el jugador la encuentre.
    hint(target) {
      const k = find(target);
      if (!k) return;
      k.node.classList.remove('hint');
      void k.node.offsetWidth;
      k.node.classList.add('hint');
    },
    // Modo con ayuda: la tecla correcta queda iluminada hasta acertar.
    guide(target) {
      find(target)?.node.classList.add('guide');
    },
    flash(node, kind) {
      node.classList.remove('ok', 'bad');
      void node.offsetWidth;
      node.classList.add(kind);
    },
    clearHints() {
      keys.forEach((k) => k.node.classList.remove('hint', 'guide'));
    },
    destroy() {
      window.removeEventListener('keydown', onKey);
    },
  };
}

