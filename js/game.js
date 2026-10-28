// Motor de una partida. Dos formas de presentar las preguntas:
// - Cable ('wire'): los pájaros entran por la derecha y caminan hacia la clave. Hay que responder
//   siempre al primero de la fila (el del halo). Sirve para notas, parejas, tríadas y figuras.
// - Cartel ('board'): una pregunta cada vez en el centro (compases, armaduras, escalas, símbolos,
//   melodías), sin prisa.
//
// Fases de un nivel (ver docs/diseno-niveles.md):
// - Calentamiento: las primeras preguntas llegan de una en una y esperan.
// - Desafío: en fila, y escapan si alcanzan la clave (si el nivel es "con tiempo").
// - Rescate: al terminar, lo fallado vuelve una vez para responderlo bien.
// No hay vidas: la ronda siempre termina y las estrellas dependen de precisión y rapidez.
// La primera vez que sale cada nota nueva llega presentada (con su nombre) y no puntúa.
// Tras un fallo se ve la respuesta: en lectura, con la nota guía más cercana; en teoría, con la
// regla aplicada a esa pregunta. Lo fallado vuelve a salir a los pocos turnos.

import { StaffSystem, makeBird, makeCluster, makeLabel, makeGhost, el } from './staff.js';
import { drawBoard, drawFigure } from './boards.js';
import { createPad } from './input.js';
import { isCorrect, midi, pitchClass, displayName, isLine, keyName, parseNote, staffPos } from './music.js';
import { makeSelector, median } from './adaptive.js';
import { LANDMARKS } from './curriculum.js';
import * as audio from './audio.js';

const MAX_SPACE_PX = 34;
const PIANO_FACTOR = 1.2; // con teclado se tarda algo más en responder
const EXACT_FACTOR = 1.3; // y más aún si hay que buscar la octava

export function starsFor({ accuracy, medianMs }, targetMs, passAcc = 0.9) {
  if (accuracy < passAcc) return 0;
  if (accuracy >= Math.max(0.95, passAcc) && medianMs !== null && medianMs <= targetMs) return 3;
  if (medianMs !== null && medianMs <= targetMs * 1.3) return 2;
  return 1;
}

export class Game {
  constructor(root, level, { settings, cards, help = false, resume = null, onSave = () => {}, onEnd, onExit }) {
    this.root = root;
    this.level = level;
    this.settings = settings;
    this.cards = cards;
    this.help = help;
    this.onEnd = onEnd;
    this.onExit = onExit;
    this.onSave = onSave;
    this.boardMode = level.present === 'board';
    const notesPad = level.pad?.type === 'notes' && !level.answer;
    const octave = settings.pianoOctave ?? 'auto';
    this.exact = notesPad && settings.input === 'piano' && (octave === 'exact' || (octave === 'auto' && level.exactOctave));
    this.midiExact = notesPad && settings.midi && (settings.midiExact || this.exact);
    this.pace = settings.pace * (notesPad && settings.input === 'piano' ? (this.exact ? EXACT_FACTOR : PIANO_FACTOR) : 1);
    this.targetMs = level.targetMs * this.pace;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.answers = [];
    this.spawned = 0;
    this.resolved = 0;
    this.birds = [];
    this.leaving = [];
    this.clock = 0;
    this.lastSpawn = -Infinity;
    this.lastResolve = 0;
    this.lockedUntil = 0;
    this.paused = false;
    this.ended = false;
    this.phase = 'main';
    this.rescueQueue = [];
    this.introduced = new Set();
    this.segments = level.segments ?? [{ key: level.key, pool: level.pool, newKeys: level.newKeys }];
    this.seg = 0;
    this.segLen = Math.ceil(level.count / this.segments.length);
    const parts = level.pool[0]?.parts ? level.pool.reduce((s, it) => s + it.parts.length, 0) / level.pool.length : 1;
    this.expected = Math.round(level.count * parts);
    this.useSegment(0);
    if (resume) this.restore(resume);
    this.build();
    this.listenMidi();
  }

  // Estado mínimo para continuar otro día (o en otro dispositivo): lo que estaba en pantalla no se
  // guarda; al volver salen preguntas nuevas hasta completar la ronda.
  snapshot() {
    return {
      answers: this.answers,
      score: this.score,
      streak: this.streak,
      bestStreak: this.bestStreak,
      resolved: this.resolved,
      seg: this.seg,
      introduced: [...this.introduced],
    };
  }

  restore(s) {
    Object.assign(this, {
      answers: s.answers ?? [],
      score: s.score ?? 0,
      streak: s.streak ?? 0,
      bestStreak: s.bestStreak ?? 0,
      resolved: Math.min(s.resolved ?? 0, this.level.count),
    });
    this.spawned = this.resolved;
    this.introduced = new Set(s.introduced ?? []);
    this.toldTimed = this.spawned >= this.level.warmup;
    if (s.seg) this.useSegment(Math.min(s.seg, this.segments.length - 1));
    this.resumed = true;
  }

  save() {
    if (!this.ended && !this.help && this.phase === 'main') this.onSave(this.snapshot());
  }

  useSegment(i) {
    const s = this.segments[i];
    this.seg = i;
    this.key = s.key;
    this.pool = s.pool;
    this.newKeys = s.newKeys;
    this.system = new StaffSystem(this.level.clefs, s.key);
    if (this.level.fixedOrder) {
      // Prueba de nivel: las preguntas elegidas, una vez cada una y en orden.
      let i = 0;
      this.selector = { next: () => s.pool[i++ % s.pool.length], reinforce() {} };
      return;
    }
    this.selector = makeSelector(s.pool, this.cards, {
      count: this.segLen,
      targetMs: this.targetMs,
      newKeys: s.newKeys,
    });
  }

  // Notas que pueden salir (para las filas de ♯/♭ y el rango del piano).
  allNotes() {
    return this.segments.flatMap((s) => s.pool).flatMap((p) => (p.parts ? p.parts.map((x) => x.note) : p.note ? [p.note] : []));
  }

  build() {
    const { level, settings } = this;
    this.root.innerHTML = `
      <div class="game ${settings.birds ? '' : 'classic'} ${this.help ? 'with-help' : ''} ${this.boardMode ? 'board-mode' : ''}">
        <header class="hud">
          <button class="icon-btn pause" type="button" aria-label="Pausa">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>
          </button>
          <div class="meter" aria-live="off"></div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${level.count}"><i></i></div>
          <div class="score"><b>0</b><span class="combo"></span></div>
        </header>
        <div class="stage">
          <p class="prompt" aria-live="polite"></p>
          <svg class="staff" role="img" aria-label="Pentagrama"></svg>
          <svg class="board" role="img" aria-label="Pregunta" preserveAspectRatio="xMidYMid meet"></svg>
          <p class="banner" hidden></p>
          <div class="explain" role="status" hidden></div>
          <p class="sr-only" aria-live="assertive"></p>
        </div>
        <div class="pad"></div>
        <div class="overlay pause-menu" hidden>
          <div class="sheet">
            <h2>Pausa</h2>
            <button class="btn primary" data-act="resume" type="button">Seguir</button>
            <button class="btn" data-act="restart" type="button">Empezar de nuevo</button>
            <button class="btn ghost" data-act="exit" type="button">Guardar y salir</button>
          </div>
        </div>
      </div>`;
    const q = (s) => this.root.querySelector(s);
    this.svg = q('.staff');
    this.boardSvg = q('.board');
    this.stage = q('.stage');
    this.promptEl = q('.prompt');
    this.banner = q('.banner');
    this.explainEl = q('.explain');
    this.liveEl = q('.sr-only');
    this.meterEl = q('.meter');
    this.progressEl = q('.progress');
    this.scoreEl = q('.score b');
    this.comboEl = q('.combo');
    this.pauseMenu = q('.pause-menu');

    const notes = this.allNotes();
    const alts = new Set(notes.map((n) => n.alt));
    const rare = new Set(
      notes.filter((n) => (n.alt === 1 && [2, 6].includes(n.step)) || (n.alt === -1 && [0, 3].includes(n.step))).map((n) => `${n.step}:${n.alt}`),
    );
    const pad = level.pad ?? { type: 'notes' };
    const common = { naming: settings.naming, labels: settings.pianoLabels, alts, rare, onAnswer: (a, node) => this.answer(a, node) };
    if (level.answer === 'linespace') {
      this.pad = createPad(q('.pad'), { ...common, mode: 'choices', choices: [{ label: 'Línea', value: 'line' }, { label: 'Espacio', value: 'space' }] });
    } else if (pad.type === 'choices') {
      this.pad = createPad(q('.pad'), { ...common, mode: 'choices', choices: pad.options });
    } else if (pad.type === 'twostep') {
      this.pad = createPad(q('.pad'), { ...common, mode: 'twostep', first: pad.first, second: pad.second });
    } else {
      const ms = notes.map(midi);
      const range = this.exact ? [Math.min(...ms), Math.max(...ms)] : null;
      this.pad = createPad(q('.pad'), { ...common, mode: settings.input, range });
    }

    q('.pause').addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.pause();
    });
    this.pauseMenu.addEventListener('click', (e) => {
      const act = e.target.closest('[data-act]')?.dataset.act;
      if (act === 'resume') this.resume();
      if (act === 'restart') this.onExit('restart');
      if (act === 'exit') this.onExit('exit');
    });

    this.onVisibility = () => {
      if (!document.hidden) return;
      this.pause();
      this.save();
    };
    document.addEventListener('visibilitychange', this.onVisibility);
    this.onResize = () => this.layout();
    window.addEventListener('resize', this.onResize);
    this.layout();
    this.renderHud();
  }

  // Teclado MIDI (Chrome y Edge, también en Android): cualquier octava vale salvo que se pida la exacta.
  listenMidi() {
    if (!this.settings.midi || !navigator.requestMIDIAccess || this.level.pad?.type !== 'notes' || this.level.answer) return;
    this.onMidi = (e) => {
      const [status, note, vel] = e.data;
      if ((status & 0xf0) !== 0x90 || !vel) return;
      this.answer(this.midiExact ? { midi: note } : { pc: note % 12 }, null);
    };
    navigator.requestMIDIAccess().then((access) => {
      if (!this.onMidi) return;
      this.midiAccess = access;
      const attach = () => access.inputs.forEach((input) => { input.onmidimessage = this.onMidi; });
      attach();
      access.onstatechange = attach;
    }, () => {});
  }

  // Posiciones verticales que ocupan las preguntas del cable (para encuadrar el pentagrama).
  positions() {
    return this.segments.flatMap((s) => s.pool).flatMap((p) => {
      if (p.notes) return p.notes.map((n) => ({ clef: n.clef, pos: n.pos }));
      if (p.figure) return [{ clef: p.clef, pos: p.figure.rest ? 0 : -1 }, { clef: p.clef, pos: p.figure.rest ? 8 : 12 }];
      return [{ clef: p.clef, pos: p.pos }];
    });
  }

  layout() {
    if (this.boardMode) return;
    const r = this.svg.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const ext = this.system.extent(this.positions());
    let unit = Math.min(r.height / (ext.max - ext.min), MAX_SPACE_PX / 10);
    unit = Math.min(unit, r.width / (this.system.noteStartX + 100));
    const vh = r.height / unit;
    const vw = r.width / unit;
    const cy = (ext.min + ext.max) / 2;
    this.width = vw;
    this.svg.setAttribute('viewBox', `0 ${cy - vh / 2} ${vw} ${vh}`);
    this.spawnX = vw - 16; // aparecen ya dentro, bajando hasta el cable
    this.endX = this.system.noteStartX + 10;
    this.calmX = this.system.noteStartX + Math.min(70, (vw - this.system.noteStartX) * 0.45);

    this.svg.innerHTML = '';
    this.system.draw(this.svg, vw);
    this.birdLayer = el('g', { class: 'birds' }, this.svg);
    this.fxLayer = el('g', { class: 'fx' }, this.svg);
    for (const b of [...this.birds, ...this.leaving]) this.birdLayer.appendChild(b.outer);
  }

  start() {
    if (this.resumed) this.say(`Sigues donde lo dejaste: ${this.resolved} de ${this.level.count}.`);
    if (this.resumed && this.resolved >= this.level.count) this.startRescue();
    this.last = performance.now();
    this.raf = requestAnimationFrame((t) => this.frame(t));
  }

  frame(t) {
    const dt = Math.min(64, t - this.last);
    this.last = t;
    if (!this.paused) {
      this.clock += dt;
      this.update(dt);
    }
    this.raf = requestAnimationFrame((tt) => this.frame(tt));
  }

  // ¿La siguiente pregunta llega sin prisa? Cartel, calentamiento, nivel sin tiempo o rescate.
  nextIsCalm() {
    return this.boardMode || this.phase === 'rescue' || this.level.mode === 'calm' || this.spawned < this.level.warmup;
  }

  update(dt) {
    const { level } = this;

    if (!this.ended) {
      if (this.phase === 'rescue') {
        if (!this.birds.length && this.rescueQueue.length && this.clock >= this.rescueAt && this.clock - this.lastResolve >= 380) {
          this.spawn(this.rescueQueue.shift(), true);
        }
      } else if (this.spawned < level.count) {
        const segDue = this.seg < this.segments.length - 1 && this.spawned >= (this.seg + 1) * this.segLen;
        if (segDue) {
          if (!this.birds.length && this.clock - this.lastResolve >= 300) this.changeKey();
        } else if (this.nextIsCalm()) {
          if (!this.birds.length && this.clock - this.lastResolve >= (this.boardMode ? 450 : 380) && this.clock >= (this.holdUntil ?? 0)) {
            this.spawn(this.selector.next(), true);
          }
        } else {
          if (this.spawned === level.warmup && level.warmup && !this.toldTimed) {
            this.toldTimed = true;
            this.say('¡Ahora con tiempo! Responde antes de que lleguen a la clave.');
            this.holdUntil = this.clock + 1400;
          }
          const lastBird = this.birds[this.birds.length - 1];
          const roomy = !lastBird || (!lastBird.calm && lastBird.x < this.spawnX - (lastBird.wide ? 50 : 24));
          const due = this.clock - this.lastSpawn >= level.spawnMs * this.pace;
          const idle = !this.birds.length && this.clock - this.lastResolve >= 250;
          if (roomy && (due || idle) && this.clock >= (this.holdUntil ?? 0)) this.spawn(this.selector.next(), false);
        }
      }
    }

    const speed = (this.spawnX - this.endX) / (level.travelMs * this.pace);
    for (const b of this.birds) {
      if (b.board) continue;
      if (b.landing !== undefined) {
        b.landing = Math.min(1, b.landing + dt / 260);
        const e = 1 - (1 - b.landing) ** 3;
        b.dy = -26 * (1 - e);
        b.x = b.homeX + 34 * (1 - e);
        if (b.landing === 1) {
          delete b.landing;
          b.dy = 0;
        }
      } else if (!b.calm) {
        b.x -= speed * dt;
        if (b.drop < 1) {
          b.drop = Math.min(1, b.drop + dt / 220);
          b.dy = -18 * (1 - b.drop) ** 2;
        }
      }
      b.outer.setAttribute('transform', `translate(${b.x.toFixed(2)} ${b.dy.toFixed(2)})`);
    }

    const target = this.birds[0];
    if (target && !target.isTarget && target.landing === undefined) this.makeTarget(target);
    if (target && !target.calm && !target.board && target.x <= this.endX && !this.ended) this.escape(target);

    for (const b of this.leaving) {
      b.t += dt;
      b.x += b.vx * dt;
      b.dy += b.vy * dt;
      b.outer.setAttribute('transform', `translate(${b.x.toFixed(2)} ${b.dy.toFixed(2)})`);
      b.outer.style.opacity = Math.max(0, 1 - b.t / 650);
    }
    this.leaving = this.leaving.filter((b) => {
      if (b.t < 650) return true;
      b.outer.remove();
      return false;
    });
  }

  // Cambio de armadura a mitad de nivel (niveles de armaduras mezcladas).
  changeKey() {
    this.useSegment(this.seg + 1);
    this.layout();
    this.say(`Cambio de armadura: ${keyName(this.key, this.settings.naming)}`);
    this.holdUntil = this.clock + 1600;
  }

  say(text, ms = 2200) {
    this.banner.textContent = text;
    this.banner.hidden = false;
    clearTimeout(this.bannerTimer);
    this.bannerTimer = setTimeout(() => { this.banner.hidden = true; }, ms);
  }

  // Aviso para lectores de pantalla (acierto o respuesta correcta).
  announce(text) {
    this.liveEl.textContent = '';
    requestAnimationFrame(() => { this.liveEl.textContent = text; });
  }

  // Explicación tras un fallo en teoría: la respuesta y la regla, hasta la siguiente pregunta.
  explain(item) {
    this.explainEl.innerHTML = `<b>${item.label ?? item.answer}</b><span>${item.explain}</span>`;
    this.explainEl.hidden = false;
  }

  makeTarget(b) {
    b.isTarget = true;
    b.targetSince = this.clock;
    b.outer.classList.add('target');
    this.explainEl.hidden = true;
    if (b.item.prompt) this.promptEl.textContent = b.item.prompt;
    if (b.item.options) this.pad.setChoices(b.item.options);
    if (this.help || b.intro) {
      this.pad.guide(this.correctAnswer(b));
      if (!b.board) this.nameLabel(b, b.intro ? 'label help intro' : 'label help');
    }
  }

  spawn(item, calm) {
    let b;
    if (this.boardMode) {
      const drawn = drawBoard(this.boardSvg, item, { birds: this.settings.birds });
      const [x, y, w, h] = drawn.box;
      this.boardSvg.setAttribute('viewBox', `${x - 8} ${y - 6} ${w + 16} ${h + 12}`);
      const g = this.boardSvg.firstElementChild;
      b = { item, board: true, calm: true, outer: g, inner: g, x: 0, y: 0, dy: 0, failed: false, cells: drawn.cells, cellExt: drawn.ext, part: 0 };
    } else {
      const top = this.system.topFor(item.clef);
      let made;
      let y;
      if (item.notes) {
        made = makeCluster(this.birdLayer, { notes: item.notes, arrangement: item.arrangement, birds: this.settings.birds, system: this.system });
        y = Math.min(...made.ys);
      } else if (item.figure) {
        const outer = el('g', { class: 'bird figure' }, this.birdLayer);
        const inner = el('g', { class: 'bird-inner' }, outer);
        el('circle', { cx: 0, cy: top + 18, r: 16, class: 'halo' }, inner);
        drawFigure(inner, item.figure, top, item.clef === 'rhythm' ? 1 : 5);
        made = { outer, inner };
        y = top - 6;
      } else {
        y = this.system.yFor(item.pos, item.clef);
        made = makeBird(this.birdLayer, { y, pos: item.pos, shownAlt: item.shownAlt, birds: this.settings.birds, topY: top });
      }
      b = {
        item,
        outer: made.outer,
        inner: made.inner,
        y,
        calm,
        wide: !!(item.notes && item.arrangement === 'melodic'),
        x: calm ? this.calmX : this.spawnX,
        dy: calm ? 0 : -18,
        drop: calm ? 1 : 0,
        failed: false,
      };
      if (calm) {
        b.homeX = this.calmX;
        b.landing = 0;
      }
      b.outer.setAttribute('transform', `translate(${b.x} 0)`);
    }
    if (this.phase === 'main' && !this.help && this.newKeys.includes(item.key) && !this.introduced.has(item.key)) {
      this.introduced.add(item.key);
      b.intro = true;
    }
    this.birds.push(b);
    if (this.phase === 'main') this.spawned++;
    this.lastSpawn = this.clock;
  }

  check(b, ans) {
    const { item } = b;
    if (item.parts) return this.noteMatches(item.parts[b.part].note, ans);
    if (item.answer !== undefined && item.answer !== null) return ans.choice === item.answer;
    if (this.level.answer === 'linespace') return ans.choice === (isLine(item.pos) ? 'line' : 'space');
    return this.noteMatches(item.note, ans);
  }

  noteMatches(note, ans) {
    if ('midi' in ans && !this.exact && !this.midiExact) return pitchClass(note) === ans.midi % 12;
    return isCorrect(note, ans);
  }

  correctAnswer(b) {
    const { item } = b;
    if (item.answer !== undefined && item.answer !== null) return { choice: item.answer };
    if (this.level.answer === 'linespace') return { choice: isLine(item.pos) ? 'line' : 'space' };
    const note = item.parts ? item.parts[b.part].note : item.note;
    if (this.exact) return { midi: midi(note) };
    return this.settings.input === 'piano' ? { pc: pitchClass(note) } : { step: note.step, alt: note.alt };
  }

  itemName(b) {
    const { item } = b;
    if (item.parts) return displayName(item.parts[b.part].note, this.settings.naming);
    if (item.answer !== undefined && item.answer !== null) return item.label ?? item.answer;
    if (this.level.answer === 'linespace') return isLine(item.pos) ? 'Línea' : 'Espacio';
    return displayName(item.note, this.settings.naming);
  }

  nameLabel(b, cls) {
    const ly = b.y - 18 < this.svg.viewBox.baseVal.y + 6 ? b.y + 30 : b.y - 18;
    makeLabel(b.outer, 0, ly, this.itemName(b), cls);
  }

  playItem(item) {
    const s = item.sound;
    if (s === null) return;
    if (!s) return audio.playMidi(midi(item.note));
    if (s.rhythm) return audio.playRhythm(s.rhythm);
    s.forEach((x, i) => {
      if (Array.isArray(x)) x.forEach((m) => audio.playMidi(m, { when: i * 0.32, gain: 0.22 }));
      else audio.playMidi(x, { when: i * 0.28, gain: 0.26, dur: 0.9 });
    });
  }

  // Nota guía más cercana (Do central, Sol de la clave...) dibujada en hueco junto al pájaro.
  landmarkHint(b) {
    if (this.level.answer || this.level.theory || !b.item.note) return;
    const { clef, pos } = b.item;
    let best = null;
    for (const id of LANDMARKS[clef] ?? []) {
      const n = parseNote(id);
      const p = staffPos(n, clef);
      if (p === pos) return;
      if (!best || Math.abs(p - pos) < Math.abs(best.p - pos)) best = { p, n };
    }
    if (!best || Math.abs(best.p - pos) > 4) return;
    const top = this.system.topFor(clef);
    const labelAbove = b.y - 18 >= this.svg.viewBox.baseVal.y + 6; // la etiqueta del pájaro va arriba
    makeGhost(b.outer, {
      x: b.item.shownAlt !== null && b.item.shownAlt !== undefined ? -32 : -22,
      y: this.system.yFor(best.p, clef),
      pos: best.p,
      topY: top,
      text: displayName(best.n, this.settings.naming),
      below: labelAbove,
    });
  }

  // Lo que respondió el jugador, como clave para la matriz de confusión.
  given(ans) {
    if ('choice' in ans) return ans.choice;
    if ('pc' in ans) return `pc:${ans.pc}`;
    if ('midi' in ans) return `pc:${ans.midi % 12}`;
    return `${ans.step}:${ans.alt}`;
  }

  confusedItem(ans) {
    if ('step' in ans) return this.pool.find((p) => p.note && p.note.step === ans.step && p.note.alt === ans.alt) ?? null;
    if ('choice' in ans && this.level.theory) return this.pool.find((p) => p.answer === ans.choice) ?? null;
    return null;
  }

  shake(node) {
    node.classList.remove('shake');
    void node.getBoundingClientRect();
    node.classList.add('shake');
  }

  answer(ans, node) {
    audio.unlock();
    if (this.paused || this.ended || this.clock < this.lockedUntil) return;
    const b = this.birds[0];
    if (!b || b.landing !== undefined || !b.isTarget) return;
    if (b.item.parts) return this.answerPart(b, ans, node);
    const ms = Math.round(this.clock - b.targetSince);
    const counts = this.phase === 'main' && !b.intro;
    const scored = counts && !this.help;

    if (this.check(b, ans)) {
      if (node) this.pad.flash(node, 'ok');
      this.announce(`Correcto: ${this.itemName(b)}`);
      this.playItem(b.item);
      if (counts && !b.failed) {
        this.answers.push({ key: b.item.key, correct: true, ms, idx: this.pool.indexOf(b.item) });
        if (scored) this.addPoints(b, ms);
      }
      this.pad.clearHints();
      this.resolve(b, 'fly');
    } else {
      if (node) this.pad.flash(node, 'bad');
      audio.sfx('wrong');
      this.announce(`No. Era ${this.itemName(b)}`);
      if (this.settings.haptics) navigator.vibrate?.(40);
      this.lockedUntil = this.clock + 350;
      this.shake(b.inner);
      const teach = (this.settings.showAnswer || this.phase === 'rescue') && !this.help && !b.intro;
      if (!b.failed) {
        b.failed = true;
        if (counts) {
          this.answers.push({ key: b.item.key, correct: false, ms, given: this.given(ans), idx: this.pool.indexOf(b.item) });
          this.selector.reinforce(b.item, this.confusedItem(ans));
          this.streak = 0;
        }
        if (teach) {
          if (this.level.theory) this.explain(b.item);
          else {
            this.nameLabel(b, 'label bad');
            this.landmarkHint(b);
            setTimeout(() => this.playItem(b.item), 260);
          }
        }
      }
      if (this.settings.showAnswer || this.phase === 'rescue') this.pad.hint(this.correctAnswer(b));
    }
    this.renderHud();
  }

  // Melodía: se nombran las notas en orden; cada nota cuenta como una respuesta.
  answerPart(b, ans, node) {
    const part = b.item.parts[b.part];
    const ms = Math.round(this.clock - (b.partSince ?? b.targetSince));
    const cell = b.cells?.[b.part];
    if (this.check(b, ans)) {
      if (node) this.pad.flash(node, 'ok');
      audio.playMidi(midi(part.note), { dur: 0.7 });
      if (this.phase === 'main' && !b.partFailed) {
        this.answers.push({ key: part.key, correct: true, ms });
        if (!this.help) this.addPoints(b, ms, 50);
      }
      cell?.classList.remove('current');
      cell?.classList.add('done');
      b.part++;
      b.partFailed = false;
      b.partSince = this.clock;
      this.pad.clearHints();
      if (b.part >= b.item.parts.length) {
        setTimeout(() => this.playItem(b.item), 250);
        this.resolve(b, 'fly');
      } else {
        b.cells?.[b.part]?.classList.add('current');
        if (this.help) this.pad.guide(this.correctAnswer(b));
      }
    } else {
      if (node) this.pad.flash(node, 'bad');
      audio.sfx('wrong');
      this.lockedUntil = this.clock + 350;
      if (cell) this.shake(cell);
      if (!b.partFailed) {
        b.partFailed = true;
        b.failed = true;
        if (this.phase === 'main') {
          this.answers.push({ key: part.key, correct: false, ms, given: this.given(ans) });
          this.streak = 0;
        }
        if (cell && this.settings.showAnswer) {
          const t = el('text', { x: 0, y: (b.cellExt?.max ?? 50) + 12, 'text-anchor': 'middle', class: 'cell-answer' }, cell);
          t.textContent = this.itemName(b);
        }
      }
      if (this.settings.showAnswer) this.pad.hint(this.correctAnswer(b));
    }
    this.renderHud();
  }

  addPoints(b, ms, base = 100) {
    this.streak++;
    this.bestStreak = Math.max(this.bestStreak, this.streak);
    const mult = Math.min(3, 1 + Math.floor(this.streak / 5) * 0.5);
    const speedBonus = Math.max(0, Math.round(base * (1 - ms / (this.targetMs * 2))));
    const pts = Math.round((base + speedBonus) * mult);
    this.score += pts;
    this.popup(b, `+${pts}`);
  }

  escape(b) {
    audio.sfx('escape');
    if (!b.failed && !b.intro) {
      b.failed = true;
      this.answers.push({ key: b.item.key, correct: false, ms: Math.round(this.clock - b.targetSince), given: 'timeout', idx: this.pool.indexOf(b.item) });
      this.selector.reinforce(b.item);
      this.streak = 0;
      if (this.settings.showAnswer) {
        if (this.level.theory) this.explain(b.item);
        else makeLabel(this.fxLayer, b.x + 4, b.y - 18, this.itemName(b), 'label bad float');
      }
    }
    this.pad.clearHints();
    this.resolve(b, 'escape');
    this.renderHud();
  }

  resolve(b, how) {
    this.birds.shift();
    b.outer.classList.remove('target');
    if (b.board) {
      b.outer.classList.add('board-out');
      setTimeout(() => b.outer.remove(), 300);
    } else {
      b.outer.classList.add(how === 'fly' ? 'flying' : 'escaping');
      Object.assign(b, how === 'fly' ? { vx: 0.05, vy: -0.16, t: 0 } : { vx: -0.07, vy: -0.11, t: 0 });
      this.leaving.push(b);
    }
    this.lastResolve = this.clock;
    if (this.ended) return;
    if (this.phase === 'main') {
      this.resolved++;
      if (this.resolved >= this.level.count) this.startRescue();
      else this.save();
    } else if (!this.rescueQueue.length && !this.birds.length) {
      this.finish();
    }
  }

  // Lo fallado vuelve, de uno en uno y sin prisa, para responderlo bien.
  startRescue() {
    const seen = new Set();
    const all = this.segments.flatMap((s) => s.pool);
    const missed = this.answers
      .filter((a) => !a.correct && !seen.has(a.idx ?? a.key) && seen.add(a.idx ?? a.key))
      .map((a) => (a.idx >= 0 ? this.pool[a.idx] : all.find((p) => p.key === a.key)))
      .filter((p) => p && !p.parts)
      .slice(0, 8);
    if (this.help || this.level.noRescue || !missed.length || this.segments.length > 1) return this.finish();
    this.phase = 'rescue';
    this.rescueQueue = missed;
    this.rescueAt = this.clock + 1500;
    const what = this.level.theory ? 'las preguntas' : 'los pájaros';
    this.say(missed.length === 1 ? 'Vuelve lo que fallaste: respóndelo bien.' : `Vuelven ${what} que fallaste (${missed.length}): respóndelas bien.`);
  }

  popup(b, text) {
    if (b.board) {
      const vb = this.boardSvg.viewBox.baseVal;
      const g = makeLabel(this.boardSvg, vb.x + vb.width / 2, vb.y + 10, text, 'label pts float');
      setTimeout(() => g.remove(), 900);
      return;
    }
    const g = makeLabel(this.fxLayer, b.x, b.y + b.dy - 14, text, 'label pts float');
    setTimeout(() => g.remove(), 900);
  }

  // Medidor de estrellas: se apagan cuando los fallos ya no permiten conseguirlas.
  renderHud() {
    const { level } = this;
    if (this.help) {
      this.meterEl.innerHTML = '<span class="endless">Con ayuda</span>';
    } else if (level.count > 500) {
      this.meterEl.innerHTML = '<span class="endless">Sin fin</span>';
    } else {
      const errors = this.answers.filter((a) => !a.correct).length;
      const counted = this.expected - this.introduced.size;
      const passErr = Math.floor(counted * (1 - level.passAcc) + 1e-9);
      const topErr = Math.floor(counted * (1 - Math.max(0.95, level.passAcc)) + 1e-9);
      const on = [errors <= passErr, errors <= passErr, errors <= topErr];
      this.meterEl.innerHTML = on
        .map((o) => `<svg class="${o ? 'on' : 'off'}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>`)
        .join('');
      this.meterEl.setAttribute('aria-label', `${errors} fallos`);
    }
    this.progressEl.querySelector('i').style.width = `${(100 * this.resolved) / level.count}%`;
    this.progressEl.setAttribute('aria-valuenow', this.resolved);
    this.scoreEl.textContent = this.score.toLocaleString('es-ES');
    const mult = Math.min(3, 1 + Math.floor(this.streak / 5) * 0.5);
    this.comboEl.textContent = mult > 1 ? `×${String(mult).replace('.', ',')}` : '';
  }

  pause() {
    if (this.ended || this.paused) return;
    this.paused = true;
    this.pauseMenu.hidden = false;
    this.save();
  }

  resume() {
    this.paused = false;
    this.pauseMenu.hidden = true;
  }

  finish() {
    this.ended = true;
    const n = this.answers.length;
    const ok = this.answers.filter((a) => a.correct).length;
    const accuracy = n ? ok / n : 0;
    const medianMs = median(this.answers.filter((a) => a.correct).map((a) => a.ms));
    const stars = this.help ? 0 : starsFor({ accuracy, medianMs }, this.targetMs, this.level.passAcc);
    audio.sfx(stars || this.help ? 'win' : 'lose');
    const result = {
      completed: true,
      help: this.help,
      accuracy,
      medianMs,
      targetMs: this.targetMs,
      score: this.score,
      bestStreak: this.bestStreak,
      answers: this.answers,
      stars,
    };
    setTimeout(() => this.onEnd(result), 900);
  }

  destroy() {
    this.ended = true;
    cancelAnimationFrame(this.raf);
    clearTimeout(this.bannerTimer);
    this.pad.destroy();
    if (this.midiAccess) {
      this.midiAccess.inputs.forEach((input) => { input.onmidimessage = null; });
      this.midiAccess.onstatechange = null;
    }
    this.onMidi = null;
    document.removeEventListener('visibilitychange', this.onVisibility);
    window.removeEventListener('resize', this.onResize);
  }
}
