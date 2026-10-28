// Motor de una partida. Los pájaros entran por la derecha y caminan por el cable hacia la clave.
// Hay que nombrar siempre el primero de la fila (el que lleva el halo).
//
// Fases de un nivel (ver docs/diseno-niveles.md):
// - Calentamiento: las primeras notas llegan de una en una y esperan (sin prisa).
// - Desafío: llegan en fila y escapan si alcanzan la clave (si el nivel es "con tiempo").
// - Rescate: al terminar, los pájaros fallados vuelven uno a uno para nombrarlos bien.
// No hay vidas: la ronda siempre termina y las estrellas dependen de precisión y rapidez.
// La primera vez que sale cada nota nueva llega presentada (con su nombre) y no puntúa.
// Tras un fallo se ve el nombre correcto, la nota guía más cercana y suena la nota; además
// la nota vuelve a salir a los pocos turnos junto con la nota con la que se confundió.

import { StaffSystem, makeBird, makeLabel, makeGhost, el } from './staff.js';
import { createPad } from './input.js';
import { isCorrect, midi, pitchClass, displayName, isLine, keyName, parseNote, staffPos } from './music.js';
import { makeSelector, median } from './adaptive.js';
import { LANDMARKS } from './curriculum.js';
import * as audio from './audio.js';

const MAX_SPACE_PX = 34;
const PIANO_FACTOR = 1.2; // con teclado se tarda algo más en responder

export function starsFor({ accuracy, medianMs }, targetMs, passAcc = 0.9) {
  if (accuracy < passAcc) return 0;
  if (accuracy >= Math.max(0.95, passAcc) && medianMs !== null && medianMs <= targetMs) return 3;
  if (medianMs !== null && medianMs <= targetMs * 1.3) return 2;
  return 1;
}

export class Game {
  constructor(root, level, { settings, cards, help = false, onEnd, onExit }) {
    this.root = root;
    this.level = level;
    this.settings = settings;
    this.cards = cards;
    this.help = help;
    this.onEnd = onEnd;
    this.onExit = onExit;
    this.pace = settings.pace * (settings.input === 'piano' && !level.answer ? PIANO_FACTOR : 1);
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
    this.useSegment(0);
    this.build();
    this.listenMidi();
  }

  useSegment(i) {
    const s = this.segments[i];
    this.seg = i;
    this.key = s.key;
    this.pool = s.pool;
    this.newKeys = s.newKeys;
    this.system = new StaffSystem(this.level.clefs, s.key);
    this.selector = makeSelector(s.pool, this.cards, {
      count: this.segLen,
      targetMs: this.targetMs,
      newKeys: s.newKeys,
    });
  }

  build() {
    const { level, settings } = this;
    this.root.innerHTML = `
      <div class="game ${settings.birds ? '' : 'classic'} ${this.help ? 'with-help' : ''}">
        <header class="hud">
          <button class="icon-btn pause" type="button" aria-label="Pausa">
            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1.5"/><rect x="14" y="5" width="4" height="14" rx="1.5"/></svg>
          </button>
          <div class="meter" aria-live="off"></div>
          <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${level.count}"><i></i></div>
          <div class="score"><b>0</b><span class="combo"></span></div>
        </header>
        <div class="stage">
          <svg class="staff" role="img" aria-label="Pentagrama"></svg>
          <p class="banner" hidden></p>
        </div>
        <div class="pad"></div>
        <div class="overlay pause-menu" hidden>
          <div class="sheet">
            <h2>Pausa</h2>
            <button class="btn primary" data-act="resume" type="button">Seguir</button>
            <button class="btn" data-act="restart" type="button">Empezar de nuevo</button>
            <button class="btn ghost" data-act="exit" type="button">Salir del nivel</button>
          </div>
        </div>
      </div>`;
    const q = (s) => this.root.querySelector(s);
    this.svg = q('.staff');
    this.stage = q('.stage');
    this.banner = q('.banner');
    this.meterEl = q('.meter');
    this.progressEl = q('.progress');
    this.scoreEl = q('.score b');
    this.comboEl = q('.combo');
    this.pauseMenu = q('.pause-menu');

    const allPools = this.segments.flatMap((s) => s.pool);
    const alts = new Set(allPools.map((p) => p.note.alt));
    const rare = new Set(
      allPools
        .filter((p) => (p.note.alt === 1 && [2, 6].includes(p.note.step)) || (p.note.alt === -1 && [0, 3].includes(p.note.step)))
        .map((p) => `${p.note.step}:${p.note.alt}`),
    );
    this.pad = createPad(q('.pad'), {
      mode: level.answer === 'linespace' ? 'choices' : settings.input,
      choices: [{ label: 'Línea', value: 'line' }, { label: 'Espacio', value: 'space' }],
      naming: settings.naming,
      labels: settings.pianoLabels,
      alts,
      rare,
      onAnswer: (a, node) => this.answer(a, node),
    });

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

    this.onVisibility = () => document.hidden && this.pause();
    document.addEventListener('visibilitychange', this.onVisibility);
    this.onResize = () => this.layout();
    window.addEventListener('resize', this.onResize);
    this.layout();
    this.renderHud();
  }

  // Teclado MIDI (Chrome y Edge, también en Android): cualquier octava vale salvo que se pida la exacta.
  listenMidi() {
    if (!this.settings.midi || !navigator.requestMIDIAccess || this.level.answer) return;
    this.onMidi = (e) => {
      const [status, note, vel] = e.data;
      if ((status & 0xf0) !== 0x90 || !vel) return;
      this.answer(this.settings.midiExact ? { midi: note } : { pc: note % 12 }, null);
    };
    navigator.requestMIDIAccess().then((access) => {
      if (!this.onMidi) return;
      this.midiAccess = access;
      const attach = () => access.inputs.forEach((input) => { input.onmidimessage = this.onMidi; });
      attach();
      access.onstatechange = attach;
    }, () => {});
  }

  layout() {
    const r = this.stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const ext = this.system.extent(this.segments.flatMap((s) => s.pool).map((p) => ({ clef: p.clef, pos: p.pos })));
    let unit = Math.min(r.height / (ext.max - ext.min), MAX_SPACE_PX / 10);
    unit = Math.min(unit, r.width / (this.system.noteStartX + 100));
    const vh = r.height / unit;
    const vw = r.width / unit;
    const cy = (ext.min + ext.max) / 2;
    this.width = vw;
    this.svg.setAttribute('viewBox', `0 ${cy - vh / 2} ${vw} ${vh}`);
    this.spawnX = vw - 14; // aparecen ya dentro, bajando hasta el cable
    this.endX = this.system.noteStartX + 8;
    this.calmX = this.system.noteStartX + Math.min(70, (vw - this.system.noteStartX) * 0.45);

    this.svg.innerHTML = '';
    this.system.draw(this.svg, vw);
    this.birdLayer = el('g', { class: 'birds' }, this.svg);
    this.fxLayer = el('g', { class: 'fx' }, this.svg);
    for (const b of [...this.birds, ...this.leaving]) this.birdLayer.appendChild(b.outer);
  }

  start() {
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

  // ¿El siguiente pájaro llega sin prisa? Calentamiento, nivel sin tiempo o ronda de rescate.
  nextIsCalm() {
    return this.phase === 'rescue' || this.level.mode === 'calm' || this.spawned < this.level.warmup;
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
          if (!this.birds.length && this.clock - this.lastResolve >= 380 && this.clock >= (this.holdUntil ?? 0)) {
            this.spawn(this.selector.next(), true);
          }
        } else {
          if (this.spawned === level.warmup && level.warmup && !this.toldTimed) {
            this.toldTimed = true;
            this.say('¡Ahora con tiempo! Nómbralos antes de que lleguen a la clave.');
            this.holdUntil = this.clock + 1400;
          }
          const lastBird = this.birds[this.birds.length - 1];
          const roomy = !lastBird || (!lastBird.calm && lastBird.x < this.spawnX - 24);
          const due = this.clock - this.lastSpawn >= level.spawnMs * this.pace;
          const idle = !this.birds.length && this.clock - this.lastResolve >= 250;
          if (roomy && (due || idle) && this.clock >= (this.holdUntil ?? 0)) this.spawn(this.selector.next(), false);
        }
      }
    }

    const speed = (this.spawnX - this.endX) / (level.travelMs * this.pace);
    for (const b of this.birds) {
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
    if (target && !target.calm && target.x <= this.endX && !this.ended) this.escape(target);

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

  makeTarget(b) {
    b.isTarget = true;
    b.targetSince = this.clock;
    b.outer.classList.add('target');
    if (this.help || b.intro) {
      this.pad.guide(this.correctAnswer(b.item));
      this.nameLabel(b, b.intro ? 'label help intro' : 'label help');
    }
  }

  spawn(item, calm) {
    const top = this.system.topFor(item.clef);
    const y = this.system.yFor(item.pos, item.clef);
    const { outer, inner } = makeBird(this.birdLayer, {
      y,
      pos: item.pos,
      shownAlt: item.shownAlt,
      birds: this.settings.birds,
      topY: top,
    });
    const b = { item, outer, inner, y, calm, x: calm ? this.calmX : this.spawnX, dy: calm ? 0 : -18, drop: calm ? 1 : 0, failed: false };
    if (this.phase === 'main' && !this.help && this.newKeys.includes(item.key) && !this.introduced.has(item.key)) {
      this.introduced.add(item.key);
      b.intro = true;
    }
    if (calm) {
      b.homeX = this.calmX;
      b.landing = 0;
    }
    outer.setAttribute('transform', `translate(${b.x} 0)`);
    this.birds.push(b);
    if (this.phase === 'main') this.spawned++;
    this.lastSpawn = this.clock;
  }

  check(item, ans) {
    if (this.level.answer === 'linespace') return ans.choice === (isLine(item.pos) ? 'line' : 'space');
    return isCorrect(item.note, ans);
  }

  correctAnswer(item) {
    if (this.level.answer === 'linespace') return { choice: isLine(item.pos) ? 'line' : 'space' };
    const { note } = item;
    return this.settings.input === 'piano' ? { pc: pitchClass(note) } : { step: note.step, alt: note.alt };
  }

  itemName(item) {
    if (this.level.answer === 'linespace') return isLine(item.pos) ? 'Línea' : 'Espacio';
    return displayName(item.note, this.settings.naming);
  }

  nameLabel(b, cls) {
    const ly = b.y - 18 < this.svg.viewBox.baseVal.y + 6 ? b.y + 20 : b.y - 18;
    makeLabel(b.outer, 0, ly, this.itemName(b.item), cls);
  }

  // Nota guía más cercana (Do central, Sol de la clave...) dibujada en hueco junto al pájaro.
  landmarkHint(b) {
    if (this.level.answer) return;
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
    if (!('step' in ans)) return null;
    return this.pool.find((p) => p.note.step === ans.step && p.note.alt === ans.alt) ?? null;
  }

  answer(ans, node) {
    audio.unlock();
    if (this.paused || this.ended || this.clock < this.lockedUntil) return;
    const b = this.birds[0];
    if (!b || b.landing !== undefined) return;
    const { note } = b.item;
    const ms = Math.round(this.clock - b.targetSince);
    const counts = this.phase === 'main' && !b.intro;
    const scored = counts && !this.help;

    if (this.check(b.item, ans)) {
      if (node) this.pad.flash(node, 'ok');
      audio.playMidi(midi(note));
      if (counts && !b.failed) {
        this.answers.push({ key: b.item.key, correct: true, ms });
        if (scored) {
          this.streak++;
          this.bestStreak = Math.max(this.bestStreak, this.streak);
          const mult = Math.min(3, 1 + Math.floor(this.streak / 5) * 0.5);
          const speedBonus = Math.max(0, Math.round(100 * (1 - ms / (this.targetMs * 2))));
          const pts = Math.round((100 + speedBonus) * mult);
          this.score += pts;
          this.popup(b, `+${pts}`);
        }
      }
      this.pad.clearHints();
      this.resolve(b, 'fly');
    } else {
      if (node) this.pad.flash(node, 'bad');
      audio.sfx('wrong');
      if (this.settings.haptics) navigator.vibrate?.(40);
      this.lockedUntil = this.clock + 350;
      b.inner.classList.remove('shake');
      void b.inner.getBoundingClientRect();
      b.inner.classList.add('shake');
      const teach = (this.settings.showAnswer || this.phase === 'rescue') && !this.help && !b.intro;
      if (!b.failed) {
        b.failed = true;
        if (counts) {
          this.answers.push({ key: b.item.key, correct: false, ms, given: this.given(ans) });
          this.selector.reinforce(b.item, this.confusedItem(ans));
          this.streak = 0;
        }
        if (teach) {
          this.nameLabel(b, 'label bad');
          this.landmarkHint(b);
          setTimeout(() => audio.playMidi(midi(note), { gain: 0.2 }), 260);
        }
      }
      if (this.settings.showAnswer || this.phase === 'rescue') this.pad.hint(this.correctAnswer(b.item));
    }
    this.renderHud();
  }

  escape(b) {
    audio.sfx('escape');
    if (!b.failed && !b.intro) {
      b.failed = true;
      this.answers.push({ key: b.item.key, correct: false, ms: Math.round(this.clock - b.targetSince), given: 'timeout' });
      this.selector.reinforce(b.item);
      this.streak = 0;
      if (this.settings.showAnswer) {
        makeLabel(this.fxLayer, b.x + 4, b.y - 18, this.itemName(b.item), 'label bad float');
      }
    }
    this.pad.clearHints();
    this.resolve(b, 'escape');
    this.renderHud();
  }

  resolve(b, how) {
    this.birds.shift();
    b.outer.classList.remove('target');
    b.outer.classList.add(how === 'fly' ? 'flying' : 'escaping');
    Object.assign(b, how === 'fly' ? { vx: 0.05, vy: -0.16, t: 0 } : { vx: -0.07, vy: -0.11, t: 0 });
    this.leaving.push(b);
    this.lastResolve = this.clock;
    if (this.ended) return;
    if (this.phase === 'main') {
      this.resolved++;
      if (this.resolved >= this.level.count) this.startRescue();
    } else if (!this.rescueQueue.length && !this.birds.length) {
      this.finish();
    }
  }

  // Los pájaros fallados vuelven, de uno en uno y sin prisa, para nombrarlos bien.
  startRescue() {
    const seen = new Set();
    const all = this.segments.flatMap((s) => s.pool);
    const missed = this.answers
      .filter((a) => !a.correct && !seen.has(a.key) && seen.add(a.key))
      .map((a) => all.find((p) => p.key === a.key))
      .filter(Boolean)
      .slice(0, 8);
    if (this.help || !missed.length || this.segments.length > 1) return this.finish();
    this.phase = 'rescue';
    this.rescueQueue = missed;
    this.rescueAt = this.clock + 1500;
    this.say(missed.length === 1
      ? 'Vuelve el pájaro que fallaste: nómbralo bien.'
      : `Vuelven los ${missed.length} pájaros que fallaste: nómbralos bien.`);
  }

  popup(b, text) {
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
      const counted = level.count - this.introduced.size;
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
