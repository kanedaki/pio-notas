// Pantallas y navegación (rutas con #/ para que el botón Atrás del móvil funcione).

import * as store from './store.js';
import * as audio from './audio.js';
import {
  WORLDS, LEVELS, levelById, buildLevel, practiceLevel, reviewLevel, isUnlocked, nextLevel, rangeFor,
  LANDMARKS, CHART_TIPS, nextToPlay,
} from './curriculum.js';
import { Game } from './game.js';
import { drawBoard } from './boards.js';
import { createPad } from './input.js';
import * as sync from './sync.js';
import { StaffSystem, makeBird, el } from './staff.js';
import { GLYPHS } from './glyphs.js';
import {
  displayName, keyName, CLEFS, midi, parseNote, staffPos, noteId, isCorrect, pitchClass, isLine,
} from './music.js';
import { masteryLevel, dueCount, reviewKeys, recentAccuracy, median } from './adaptive.js';

const app = document.getElementById('app');
const DAILY_GOAL = 60;
const MASTERY_MS = 2000;
let game = null;
let cleanups = [];
let timers = [];
// setTimeout que se cancela al cambiar de pantalla.
const later = (fn, ms) => timers.push(setTimeout(fn, ms));

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const go = (path) => { location.hash = `#/${path}`; };
const secs = (ms) => (ms === null ? '—' : `${(ms / 1000).toLocaleString('es-ES', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} s`);
const pct = (x) => `${Math.round(x * 100)} %`;
// Objetivo de tiempo según el ritmo elegido (edad) y el modo de respuesta.
const effTarget = (level, s) => {
  const piano = s.input === 'piano' && level.pad?.type === 'notes' && !level.answer;
  const exact = piano && (s.pianoOctave === 'exact' || (s.pianoOctave !== 'any' && level.exactOctave));
  return level.targetMs * s.pace * (piano ? (exact ? 1.3 : 1.2) : 1);
};

// ---------- piezas de interfaz ----------

const ICONS = {
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.7 5.3a1 1 0 0 1 0 1.4L9.4 12l5.3 5.3a1 1 0 0 1-1.4 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.4 0z"/></svg>',
  gear: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7.4 7.4 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.4 7.4 0 0 0-1.7 1l-2.4-1-2 3.4L6.6 11a7.5 7.5 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.4 7.4 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7.4 7.4 0 0 0 1.7-1l2.4 1 2-3.4zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/></svg>',
  arrow: '<svg class="arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M9.3 5.3a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 0 1-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 0 1 0-1.4z"/></svg>',
  flame: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5c1 3.3 5.5 5.7 5.5 11a5.5 5.5 0 0 1-11 0c0-2.4 1.2-3.9 2.3-5 .2 1.7 1 2.8 2 3.3C10.3 8.8 11 5.5 12 2.5z"/></svg>',
};

const star = (on) => `<svg class="${on ? 'on' : ''}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"/></svg>`;
const miniStars = (n) => `<span class="mini-stars" aria-label="${n} de 3 estrellas">${[1, 2, 3].map((i) => star(i <= n)).join('')}</span>`;

function avatar(color) {
  const g = GLYPHS.noteheadBlack;
  return `<svg class="avatar" viewBox="-14 -10 28 20" style="--c:${color}" aria-hidden="true">
    <path class="head" d="${g.d}" transform="translate(-9 0) scale(0.06 -0.06)"/>
    <path class="beak" d="M-7.8 -0.3 l-5.4 1.7 l5.1 2.4 z"/>
    <path class="head" d="M7 -2.7 l6.9 -4.5 l-1.8 6.1 z"/>
    <circle class="eye" cx="-3.2" cy="-2" r="1.6"/>
  </svg>`;
}

function clefIcon(clef) {
  const info = CLEFS[clef];
  const g = GLYPHS[info.glyph];
  return `<svg viewBox="-2 -50 34 70" aria-hidden="true"><path d="${g.d}" transform="translate(2 ${(info.refPos - 4) * -5}) scale(0.04 -0.04)"/></svg>`;
}

// Pentagrama pequeño con notas en fila. items: [{ clef, pos, shownAlt, label, cls, data }]
function miniStaff({ clefs, key = 0, items, bands = [], spacing = 22, birds = true, cls = 'intro-staff', labelCls = () => '' }) {
  const sys = new StaffSystem(clefs, key);
  const width = sys.noteStartX + items.length * spacing + 6;
  const ext = sys.extent(items);
  const labels = items.some((i) => i.label);
  const top = ext.min;
  const bottom = ext.max + (labels ? 12 : 0);
  const svg = el('svg', { viewBox: `-2 ${top} ${width + 4} ${bottom - top}`, class: cls, role: 'img', preserveAspectRatio: 'xMinYMid meet' });
  // Que un pentagrama con pocas notas no se estire hasta tener pájaros gigantes.
  svg.style.maxWidth = `${Math.round((width + 4) * 2.9)}px`;
  // Franja que resalta la línea o el espacio de las notas nuevas.
  for (const b of bands) {
    const y = sys.yFor(b.pos, b.clef);
    const h = isLine(b.pos) ? 5 : 9;
    el('rect', { x: sys.noteStartX - 4, y: y - h / 2, width: width - sys.noteStartX + 4, height: h, rx: h / 2, class: 'band' }, svg);
  }
  sys.draw(svg, width);
  items.forEach((it, i) => {
    const x = sys.noteStartX + spacing * (i + 0.5);
    const g = el('g', { transform: `translate(${x} 0)`, class: `note-hit ${it.cls ?? ''}` }, svg);
    if (it.data) g.dataset.note = it.data;
    el('rect', { x: -spacing / 2, y: top, width: spacing, height: bottom - top, fill: 'transparent' }, g);
    const { outer } = makeBird(g, {
      y: sys.yFor(it.pos, it.clef),
      pos: it.pos,
      shownAlt: it.shownAlt,
      birds,
      topY: sys.topFor(it.clef),
    });
    if (it.halo) outer.classList.add('target');
    if (it.label) {
      const t = el('text', { x: 0, y: bottom - 4, 'text-anchor': 'middle', class: `name ${labelCls(it)}` }, g);
      t.textContent = it.label;
    }
  });
  return svg;
}

function seg(name, options, value) {
  return `<div class="seg" data-seg="${name}" role="group">${options
    .map(([v, label]) => `<button type="button" data-v="${esc(v)}" aria-pressed="${String(v) === String(value)}">${label}</button>`)
    .join('')}</div>`;
}

function onSeg(root, handler) {
  root.querySelectorAll('[data-seg]').forEach((g) => {
    g.addEventListener('click', (e) => {
      const b = e.target.closest('button[data-v]');
      if (!b) return;
      g.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      handler(g.dataset.seg, b.dataset.v);
    });
  });
}

// El tema elegido en Ajustes manda; en «Automático» se respeta el que traiga la página que nos aloja.
const hostTheme = document.documentElement.dataset.theme;
function applyTheme() {
  const s = store.settings();
  const theme = s.theme === 'auto' ? hostTheme : s.theme;
  if (theme) document.documentElement.dataset.theme = theme;
  else delete document.documentElement.dataset.theme;
  audio.configure(s);
}

function render(html, cls = 'screen') {
  cls = `screen ${cls === 'screen' ? '' : cls}`.trim();
  app.innerHTML = `<div class="${cls}">${html}</div>`;
  window.scrollTo(0, 0);
  return app.firstElementChild;
}

const topbar = (title, back = 'home', extra = '') => `
  <header class="topbar">
    <button class="icon-btn" type="button" data-go="${back}" aria-label="Volver">${ICONS.back}</button>
    <h1>${title}</h1>${extra}
  </header>`;

function bindNav(root) {
  root.addEventListener('click', (e) => {
    const t = e.target.closest('[data-go]');
    if (t && !t.disabled) go(t.dataset.go);
  });
}

// ---------- jugadores ----------

function screenPlayers() {
  const list = store.profiles();
  let color = store.BIRD_COLORS[list.length % store.BIRD_COLORS.length];
  let pace = 1;
  const root = render(`
    ${list.length ? topbar('¿Quién juega?') : '<header class="topbar"><h1>¿Quién juega?</h1></header>'}
    <div class="players-list">
      ${list
        .map((p) => {
          const stars = Object.values(p.progress).reduce((s, x) => s + x.stars, 0);
          return `<button class="player" type="button" data-id="${p.id}">${avatar(p.color)}<b>${esc(p.name)}</b><span class="meta">${stars} ★</span></button>`;
        })
        .join('')}
    </div>
    <form class="group new-player" autocomplete="off">
      <h2>${list.length ? 'Nuevo jugador' : 'Crea tu jugador'}</h2>
      <div class="field">
        <label for="pname">Nombre</label>
        <input id="pname" type="text" maxlength="18" placeholder="Por ejemplo, Lucía" required>
      </div>
      <div class="field">
        <span class="lbl">Edad</span>
        ${seg('age', AGES, '1')}
        <p class="muted small">Sirve para ajustar el ritmo; se puede cambiar en Ajustes.</p>
      </div>
      <div class="field">
        <span class="lbl">Color de tu pájaro</span>
        <div class="swatches">${store.BIRD_COLORS.map((c) => `<button type="button" class="swatch" style="--c:${c}" data-c="${c}" aria-label="Color ${c}" aria-pressed="${c === color}"></button>`).join('')}</div>
      </div>
      <button class="btn primary" type="submit">Crear jugador</button>
    </form>
    <div class="group">
      <h2>¿Ya juegas en otro móvil o tablet?</h2>
      <div class="sync-slot"></div>
    </div>`);
  mountSync(root.querySelector('.sync-slot'), () => go('home'));
  bindNav(root);
  root.querySelectorAll('.player').forEach((b) =>
    b.addEventListener('click', () => {
      store.setActive(b.dataset.id);
      go('home');
    }),
  );
  root.querySelectorAll('.swatch').forEach((b) =>
    b.addEventListener('click', () => {
      color = b.dataset.c;
      root.querySelectorAll('.swatch').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    }),
  );
  onSeg(root, (_, v) => { pace = Number(v); });
  root.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = root.querySelector('#pname').value;
    if (!name.trim()) return;
    store.createProfile(name, color);
    store.updateSettings({ pace });
    go('home');
  });
}

// ---------- inicio ----------

function screenHome() {
  const p = store.activeProfile();
  const saved = store.savedGame();
  const today = store.notesToday();
  const next = nextToPlay(p.progress);
  const world = WORLDS.find((w) => w.id === next.world);
  const due = ['treble', 'bass'].reduce((s, c) => s + dueCount(p.cards, c), 0);
  const first = !Object.keys(p.progress).length;
  const root = render(`
    <header class="home-head">
      <button class="who" type="button" data-go="players" aria-label="Cambiar de jugador">${avatar(p.color)}<span>${esc(p.name)}</span></button>
      <span class="streak" title="Días seguidos jugando">${ICONS.flame}${p.streak.count} ${p.streak.count === 1 ? 'día' : 'días'}</span>
      <button class="icon-btn" type="button" data-go="settings" aria-label="Ajustes">${ICONS.gear}</button>
    </header>
    <section class="hero">
      <h1 class="wordmark">Pío</h1>
      <p class="tagline">Lee las notas antes de que los pájaros lleguen a la clave.</p>
      <div class="hero-slot"></div>
    </section>
    ${saved ? `<button class="btn primary continue resume" type="button" data-go="play/${saved.arg}/seguir">
      <span>Continuar partida<small>${esc(saved.title)} · ${saved.state.resolved} de ${saved.count}</small></span>${ICONS.arrow}
    </button>` : ''}
    <button class="btn ${saved ? '' : 'primary'} continue" type="button" data-go="level/${next.id}">
      <span>${first ? 'Empezar' : 'Seguir'}: ${levelTag(next).toLowerCase()}<small>${esc(world.title)} · ${esc(next.title)}</small></span>${ICONS.arrow}
    </button>
    <nav class="menu-grid" aria-label="Menú">
      <button class="menu-item" type="button" data-go="map"><b>Camino</b><span>Todos los niveles, de la clave de sol a las armaduras.</span></button>
      <button class="menu-item" type="button" data-go="review">${due ? `<i class="badge">${due}</i>` : ''}<b>Repaso</b><span>Las notas que te cuestan, en el momento justo.</span></button>
      <button class="menu-item" type="button" data-go="practice"><b>Práctica libre</b><span>Elige clave, notas, alteraciones y velocidad.</span></button>
      <button class="menu-item" type="button" data-go="progress"><b>Progreso</b><span>Qué notas dominas y cuáles no.</span></button>
      <button class="menu-item" type="button" data-go="chart"><b>Tablas de notas</b><span>Todas las notas de cada clave con su nombre.</span></button>
      <button class="menu-item" type="button" data-go="help"><b>Cómo se juega</b><span>Reglas, estrellas y consejos para leer más rápido.</span></button>
    </nav>
    <section class="goal" aria-label="Objetivo de hoy">
      <div class="row"><span>Objetivo de hoy</span><span>${Math.min(today, DAILY_GOAL)} de ${DAILY_GOAL} notas</span></div>
      <div class="goal-bar"><i style="width:${Math.min(100, (100 * today) / DAILY_GOAL)}%"></i></div>
    </section>`, 'home');
  bindNav(root);

  const melody = ['G4', 'A4', 'B4', 'D5', 'G5'].map((id) => ({ clef: 'treble', pos: staffPos(parseNote(id), 'treble'), data: id }));
  const hero = miniStaff({ clefs: ['treble'], items: melody, spacing: 30, cls: 'hero-staff', birds: store.settings().birds });
  hero.style.setProperty('--player', p.color);
  hero.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('[data-note]');
    if (!g) return;
    audio.unlock();
    audio.playMidi(midi(parseNote(g.dataset.note)));
    const inner = g.querySelector('.bird-inner');
    inner.classList.remove('shake');
    void inner.getBoundingClientRect();
    inner.classList.add('shake');
  });
  root.querySelector('.hero-slot').replaceWith(hero);
}

// ---------- camino ----------

// Mapa con dos pestañas: leer notas y teoría. Se abre en la del nivel que toca.
function screenMap(tab) {
  const p = store.activeProfile();
  const s = store.settings();
  const next = nextToPlay(p.progress);
  const area = ['lectura', 'teoria'].includes(tab) ? tab : next.area ?? 'lectura';
  const worlds = WORLDS.filter((w) => (w.area ?? 'lectura') === area);
  let n = 0;
  const root = render(`
    ${topbar('Camino')}
    ${seg('area', [['lectura', 'Leer notas'], ['teoria', 'Teoría']], area)}
    ${worlds.map((w) => {
      const got = w.levels.reduce((sum, l) => sum + (p.progress[l.id]?.stars ?? 0), 0);
      return `<section class="world" id="w-${w.id}">
        <div class="world-head">${clefIcon(w.clefIcon)}<div><h2>${esc(w.title)}</h2>${w.optional ? '<span class="opt">Opcional</span>' : ''}</div><span class="stars-count">${got} / ${w.levels.length * 3} ★</span></div>
        <p>${esc(w.description)}</p>
        <div class="wire-row">
          ${w.levels.map((l) => {
            n++;
            const open = isUnlocked(l.id, p.progress);
            const prog = p.progress[l.id];
            const cls = !open ? 'locked' : l.id === next.id ? 'current' : '';
            const seal = prog?.consolidated ? '<i class="seal" title="Consolidado: superado en dos días distintos"></i>' : '';
            return `<button class="lvl ${cls}" type="button" ${open ? `data-go="level/${l.id}"` : 'disabled'} aria-label="Nivel ${n}: ${esc(l.title)}${open ? '' : ' (bloqueado)'}"><span class="dot">${n}${seal}</span>${miniStars(prog?.stars ?? 0)}</button>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}`);
  bindNav(root);
  onSeg(root, (_, v) => go(`map/${v}`));
  root.querySelector('.lvl.current')?.scrollIntoView({ block: 'center' });
  void s;
}

// ---------- ficha de nivel ----------

// «Nivel 12» en lectura, «Teoría 5» en teoría.
const levelTag = (def) => `${def.area === 'teoria' ? 'Teoría' : 'Nivel'} ${levelNumber(def)}`;

// Número del nivel dentro de su pestaña (lectura o teoría).
function levelNumber(def) {
  return LEVELS.filter((l) => (l.area ?? 'lectura') === (def.area ?? 'lectura')).indexOf(def) + 1;
}

// Ficha del nivel: primero la lección (qué hay de nuevo, con los pájaros llegando al pentagrama o
// con ejemplos dibujados en teoría), luego «Pruébalo» con los mismos botones de la partida, y los objetivos.
function screenIntro(id) {
  const def = levelById(id);
  const p = store.activeProfile();
  if (!def || !isUnlocked(id, p.progress)) return go('map');
  const s = store.settings();
  const level = buildLevel(def, { naming: s.naming });
  const world = WORLDS.find((w) => w.id === def.world);
  const prog = p.progress[id];
  const travel = (level.travelMs * s.pace) / 1000;
  const firstOfWorld = world.levels[0].id === id;
  const { lesson } = level;
  const saved = store.savedGame()?.arg === id ? store.savedGame() : null;
  const unit = level.theory ? (level.pool[0]?.parts ? 'melodías' : 'preguntas') : 'notas';
  const root = render(`
    ${topbar(`${level.theory ? 'Teoría' : 'Nivel'} ${levelNumber(def)}`, `map/${def.area ?? 'lectura'}`)}
    <section class="lesson">
      <p class="muted">${esc(world.title)}${level.key ? ` · ${keyName(level.key, s.naming)}` : ''}</p>
      ${firstOfWorld && world.intro ? `<p class="world-intro">${esc(world.intro)}</p>` : ''}
      <h2 class="lesson-title">${esc(lesson.title)}</h2>
      <div class="lesson-slot"></div>
      <div class="lesson-text">${lesson.text.map((t) => `<p>${esc(t)}</p>`).join('')}</div>
      ${lesson.example ? `<p class="example"><b>Ejemplo</b>${esc(lesson.example)}</p>` : ''}
      ${level.theory ? '' : '<button class="btn ghost replay" type="button" data-act="replay">Ver y oír otra vez</button>'}
    </section>
    <section class="quiz group">
      <div class="quiz-head"><h2>Pruébalo</h2><span class="quiz-dots" aria-hidden="true"></span></div>
      <p class="muted small quiz-msg"></p>
      <div class="quiz-staff"></div>
      <div class="quiz-pad"></div>
    </section>
    <section class="group level-goals">
      <h2>Para ganar estrellas</h2>
      <div class="chips">
        <span class="chip">${level.count} ${unit}</span>
        <span class="chip">${level.mode === 'calm' ? 'Sin prisa' : `${level.warmup ? 'Empieza sin prisa, luego con tiempo' : 'Con tiempo'}: ${travel.toLocaleString('es-ES', { maximumFractionDigits: 1 })} s para cruzar`}</span>
        ${level.segments ? `<span class="chip">${level.segments.length} armaduras</span>` : ''}
        ${prog ? `<span class="chip">Récord ${prog.best.toLocaleString('es-ES')}</span>` : ''}
        ${prog?.consolidated ? '<span class="chip">Consolidado</span>' : prog?.stars ? '<span class="chip">Vuelve otro día para consolidarlo</span>' : ''}
      </div>
      <ul class="goals">
        <li>${miniStars(1)}<span>Acierta el ${pct(level.passAcc)} a la primera: abre lo siguiente.</span></li>
        <li>${miniStars(2)}<span>Y responde en ${secs(effTarget(level, s) * 1.3)} o menos de media.</span></li>
        <li>${miniStars(3)}<span>Acierta el ${pct(Math.max(0.95, level.passAcc))} y responde en ${secs(effTarget(level, s))} o menos.</span></li>
      </ul>
    </section>
    <div class="actions">
      ${saved ? `<button class="btn primary" type="button" data-go="play/${id}/seguir">Seguir donde lo dejaste (${saved.state.resolved} de ${level.count})</button>` : ''}
      <button class="btn ${saved ? '' : 'primary'} play-btn" type="button" data-go="play/${id}">${saved ? 'Empezar de nuevo' : 'Jugar'}</button>
      <button class="btn" type="button" data-go="play/${id}/ayuda">Practicar con ayuda</button>
    </div>
    <p class="muted small">Con ayuda se ilumina la respuesta correcta y no se ganan estrellas.</p>`);
  bindNav(root);

  if (level.theory) {
    // Ejemplos dibujados, uno por respuesta distinta, con la respuesta debajo.
    const wrap = document.createElement('div');
    wrap.className = 'samples';
    for (const it of lesson.samples) {
      const fig = document.createElement('figure');
      fig.className = 'sample';
      const svg = el('svg', { class: 'sample-board', role: 'img', preserveAspectRatio: 'xMidYMid meet' });
      const { box } = drawBoard(svg, it, { birds: s.birds });
      svg.setAttribute('viewBox', `${box[0] - 6} ${box[1] - 4} ${box[2] + 12} ${box[3] + 8}`);
      svg.style.setProperty('--player', p.color);
      fig.appendChild(svg);
      fig.insertAdjacentHTML('beforeend', `<figcaption>${esc(it.label ?? it.answer ?? '')}</figcaption>`);
      fig.addEventListener('pointerdown', () => { audio.unlock(); playSound(it); });
      wrap.appendChild(fig);
    }
    root.querySelector('.lesson-slot').replaceWith(wrap);
  } else {
    const showLesson = () => {
      const items = lesson.show.map((it, i) => ({
        clef: it.clef,
        pos: it.pos,
        shownAlt: it.shownAlt,
        label: level.answer === 'linespace' ? (isLine(it.pos) ? 'línea' : 'espacio') : displayName(it.note, s.naming),
        halo: level.newKeys.includes(it.key),
        isNew: level.newKeys.includes(it.key),
        data: noteId(it.note),
        i,
      }));
      const staff = miniStaff({
        clefs: level.clefs,
        key: level.key,
        items,
        bands: lesson.bands,
        spacing: items.length > 10 ? 17 : 24,
        birds: s.birds,
        cls: 'intro-staff lesson-staff',
        labelCls: (it) => (it.isNew ? 'new' : ''),
      });
      staff.style.setProperty('--player', p.color);
      staff.addEventListener('pointerdown', (e) => {
        const g = e.target.closest('[data-note]');
        if (!g) return;
        audio.unlock();
        audio.playMidi(midi(parseNote(g.dataset.note)));
      });
      root.querySelector('.lesson-slot').replaceChildren(staff);
      // Cada pájaro suena al posarse (la animación escalona su llegada).
      const step = items.length > 8 ? 0.22 : 0.45;
      staff.querySelectorAll('.note-hit').forEach((g, i) => g.style.setProperty('--d', `${i * step}s`));
      items.forEach((it, i) => later(() => audio.playMidi(midi(parseNote(it.data)), { dur: 0.8, gain: 0.22 }), (i * step + 0.4) * 1000));
    };
    showLesson();
    root.querySelector('[data-act="replay"]').addEventListener('click', () => { audio.unlock(); showLesson(); });
  }

  mountQuiz(root, level, s, p.color, () => {
    const btn = root.querySelector('.play-btn');
    btn.textContent = '¡Listo! Jugar';
    btn.classList.add('ready');
  });
}

// Sonido de un ítem de teoría (o de una nota suelta).
function playSound(item) {
  const snd = item.sound;
  if (snd === null) return;
  if (!snd) return audio.playMidi(midi(item.note));
  if (snd.rhythm) return audio.playRhythm(snd.rhythm);
  snd.forEach((x, i) => {
    if (Array.isArray(x)) x.forEach((m) => audio.playMidi(m, { when: i * 0.32, gain: 0.22 }));
    else audio.playMidi(x, { when: i * 0.28, gain: 0.26, dur: 0.9 });
  });
}

// Mini prueba de 3 o 4 preguntas sobre lo nuevo del nivel, con los mismos botones de la partida.
function mountQuiz(root, level, s, color, onDone) {
  const theory = level.theory;
  const keyOf = (p) => (theory ? p.answer ?? p.key : p.key);
  const unique = (arr) => arr.filter((p, i) => arr.findIndex((q) => keyOf(q) === keyOf(p)) === i);
  const focus = unique(level.newKeys.length ? level.pool.filter((p) => level.newKeys.includes(p.key)) : level.pool);
  const total = Math.min(4, Math.max(3, focus.length));
  const questions = [];
  while (questions.length < total) {
    const bag = [...focus].sort(() => Math.random() - 0.5);
    for (const q of bag) if (questions.length < total && keyOf(questions[questions.length - 1] ?? {}) !== keyOf(q)) questions.push(q);
    if (focus.length === 1) while (questions.length < total) questions.push(focus[0]);
  }
  let i = 0;
  let missed = false;
  const staffSlot = root.querySelector('.quiz-staff');
  const dots = root.querySelector('.quiz-dots');
  const msg = root.querySelector('.quiz-msg');
  const linespace = level.answer === 'linespace';
  const melody = !!level.pool[0]?.parts;
  msg.textContent = `${melody ? '¿Cuál es la primera nota?' : linespace ? '¿Línea o espacio?' : theory ? 'Responde como en la partida.' : 'Nombra el pájaro.'} Si fallas, verás la respuesta.`;
  const renderDots = () => {
    dots.innerHTML = questions.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"></i>`).join('');
  };
  const show = () => {
    const q = questions[i];
    missed = false;
    let svg;
    if (theory) {
      svg = el('svg', { class: 'intro-staff quiz-svg board-quiz', role: 'img', preserveAspectRatio: 'xMidYMid meet' });
      const { box } = drawBoard(svg, q, { birds: s.birds });
      svg.setAttribute('viewBox', `${box[0] - 6} ${box[1] - 4} ${box[2] + 12} ${box[3] + 8}`);
      if (q.prompt) msg.textContent = q.prompt;
      if (q.options) pad.setChoices(q.options);
    } else {
      svg = miniStaff({
        clefs: level.clefs,
        key: level.key,
        items: [{ clef: q.clef, pos: q.pos, shownAlt: q.shownAlt, halo: true, i: 0 }],
        spacing: 70,
        birds: s.birds,
        cls: 'intro-staff quiz-svg lesson-staff',
      });
    }
    svg.style.setProperty('--player', color);
    staffSlot.replaceChildren(svg);
    renderDots();
  };
  const notes = level.pool.flatMap((p) => (p.parts ? p.parts.map((x) => x.note) : p.note ? [p.note] : []));
  const alts = new Set(notes.map((n) => n.alt));
  const rare = new Set(notes.filter((n) => (n.alt === 1 && [2, 6].includes(n.step)) || (n.alt === -1 && [0, 3].includes(n.step))).map((n) => `${n.step}:${n.alt}`));
  const target = (q) => (melody ? q.parts[0].note : q.note);
  const check = (q, ans) => {
    if (linespace) return ans.choice === (isLine(q.pos) ? 'line' : 'space');
    if (theory && !melody) return ans.choice === q.answer;
    return isCorrect(target(q), ans);
  };
  const correct = (q) => {
    if (linespace) return { choice: isLine(q.pos) ? 'line' : 'space' };
    if (theory && !melody) return { choice: q.answer };
    const n = target(q);
    return s.input === 'piano' ? { pc: pitchClass(n) } : { step: n.step, alt: n.alt };
  };
  const answerText = (q) => {
    if (linespace) return isLine(q.pos) ? 'Línea' : 'Espacio';
    if (theory && !melody) return q.label ?? q.answer;
    return displayName(target(q), s.naming);
  };
  const padType = linespace ? 'choices' : level.pad?.type === 'notes' || !theory ? s.input : level.pad.type;
  const pad = createPad(root.querySelector('.quiz-pad'), {
    mode: padType,
    choices: linespace ? [{ label: 'Línea', value: 'line' }, { label: 'Espacio', value: 'space' }] : level.pad?.options ?? [],
    first: level.pad?.first,
    second: level.pad?.second,
    naming: s.naming,
    labels: s.pianoLabels,
    alts,
    rare,
    onAnswer: (ans, node) => {
      if (i >= total) return;
      audio.unlock();
      const q = questions[i];
      if (check(q, ans)) {
        pad.flash(node, 'ok');
        pad.clearHints();
        if (theory) playSound(melody ? { sound: [midi(target(q))] } : q);
        else audio.playMidi(midi(q.note));
        staffSlot.querySelector('.bird')?.classList.add('flying-away');
        i++;
        renderDots();
        if (i >= total) {
          msg.textContent = '¡Bien! Ya lo tienes. Ahora, a jugar.';
          msg.classList.add('ok-msg');
          staffSlot.querySelector('.quiz-explain')?.remove();
          onDone();
        } else {
          later(() => { staffSlot.querySelector('.quiz-explain')?.remove(); show(); }, 380);
        }
      } else {
        pad.flash(node, 'bad');
        audio.sfx('wrong');
        if (!missed) {
          missed = true;
          if (theory) {
            staffSlot.insertAdjacentHTML('beforeend', `<p class="quiz-explain"><b>${esc(answerText(q))}</b> ${esc(melody ? '' : q.explain ?? '')}</p>`);
          } else {
            const svg = staffSlot.querySelector('svg');
            const g = svg.querySelector('.note-hit');
            const sys = new StaffSystem(level.clefs, level.key);
            const y = sys.yFor(q.pos, q.clef);
            const t = el('text', { x: 13, y: y + 3.5, 'text-anchor': 'start', class: 'quiz-answer' }, g);
            t.textContent = answerText(q);
          }
        }
        pad.hint(correct(q));
      }
    },
  });
  cleanups.push(() => pad.destroy());
  show();
}

// ---------- partida y resultados ----------

function levelFor(arg) {
  const p = store.activeProfile();
  if (arg === 'practice') return practiceLevel(store.settings().practice ?? PRACTICE_DEFAULTS);
  if (arg?.startsWith('review-')) {
    const clef = arg.slice(7);
    const keys = reviewKeys(p.cards, clef);
    return keys.length ? reviewLevel(keys, clef) : null;
  }
  const def = levelById(arg);
  if (!def || !isUnlocked(arg, p.progress)) return null;
  return buildLevel(def, { naming: store.settings().naming });
}

function levelLabel(level) {
  return level.id ? `${levelTag(levelById(level.id))}: ${level.title}` : level.title;
}

function screenPlay(arg, help = false, resume = null) {
  const level = levelFor(arg);
  if (!level) return go('home');
  const p = store.activeProfile();
  const s = store.settings();
  audio.unlock();
  if (!resume && !help) store.clearSaved();
  const prevBest = level.id ? p.progress[level.id]?.best ?? 0 : 0;
  app.innerHTML = '<div class="play-root"></div>';
  const root = app.firstElementChild;
  root.style.setProperty('--player', p.color);
  game = new Game(root, level, {
    settings: s,
    cards: p.cards,
    help,
    resume,
    onSave: (state) => store.saveGame({ arg, title: levelLabel(level), count: level.count, state }),
    onEnd: (result) => {
      result.paceChange = result.help ? 0 : adjustPace(level, result);
      if (!result.help) store.recordSession({
        arg,
        noCards: !!level.answer,
        levelId: level.id,
        mode: level.world,
        stars: result.stars,
        score: result.score,
        answers: result.answers,
        targetMs: result.targetMs,
      });
      game?.destroy();
      game = null;
      screenResults(level, result, arg, prevBest);
    },
    onExit: (how) => {
      if (how === 'restart') {
        game.destroy();
        game = null;
        store.clearSaved();
        screenPlay(arg, help);
      } else {
        go(level.id ? 'map' : level.world === 'review' ? 'review' : 'practice');
      }
    },
  });
  game.start();
}

// Ritmo automático: tras una partida con tiempo, se acelera un poco si va sobrada y se frena si
// falla mucho, para rondar el 85 % de aciertos (docs/investigacion-pedagogia.md § 2.2).
function adjustPace(level, result) {
  const s = store.settings();
  if (!s.autoPace || level.mode !== 'timed' || result.answers.length < 10) return 0;
  let pace = s.pace;
  if (result.accuracy >= 0.92 && result.medianMs !== null && result.medianMs <= result.targetMs * 0.8) pace = Math.max(0.8, pace * 0.93);
  else if (result.accuracy < 0.8) pace = Math.min(2, pace * 1.08);
  pace = Math.round(pace * 100) / 100;
  if (pace === s.pace) return 0;
  store.updateSettings({ pace });
  return pace < s.pace ? -1 : 1;
}

// Qué le falta exactamente para la siguiente estrella.
function nextStarTip(result, level) {
  const top = Math.max(0.95, level.passAcc);
  const fast = result.medianMs !== null && result.medianMs <= result.targetMs;
  if (result.stars === 1 && !(result.medianMs <= result.targetMs * 1.3)) {
    return `Para la segunda estrella, gana velocidad: responde en ${secs(result.targetMs * 1.3)} de media.`;
  }
  if (fast) return `Ya eres rápido: para la tercera estrella acierta el ${pct(top)} a la primera.`;
  if (result.accuracy >= top) return `Ya aciertas mucho: para la tercera estrella responde en ${secs(result.targetMs)} de media.`;
  return `Para la tercera estrella: acierta el ${pct(top)} y responde en ${secs(result.targetMs)} de media.`;
}

function screenResults(level, result, arg, prevBest) {
  if (result.help) result.stars = 0;
  const s = store.settings();
  const next = level.id ? nextLevel(level.id, store.activeProfile().progress) : null;
  const record = level.id && result.score > prevBest && prevBest > 0;
  // Lo fallado: notas (por su tarjeta) o preguntas de teoría (por su posición en el conjunto).
  const wrong = result.answers.filter((a) => !a.correct);
  const missed = level.theory
    ? [...new Set(wrong.map((a) => a.idx))].map((i) => level.pool[i]).filter((it) => it && !it.parts)
    : [...new Set(wrong.map((a) => a.key))].map((k) => level.pool.find((p) => p.key === k)).filter(Boolean);
  const ok = result.answers.filter((a) => a.correct).length;
  const title = result.help ? 'Ya conoces estas notas' : !result.stars ? 'Casi lo tienes' : result.stars === 3 ? '¡Perfecto!' : level.id ? '¡Nivel superado!' : '¡Bien hecho!';
  const back = level.id ? 'map' : level.world === 'review' ? 'review' : 'practice';
  const root = render(`
    <div class="result-head">
      <div class="big-stars">${[1, 2, 3].map((i) => star(i <= result.stars)).join('')}</div>
      <h1>${title}</h1>
      ${result.help ? '<p class="muted">Ahora prueba sin ayuda para ganar estrellas.</p>' : !result.stars ? `<p class="muted">${level.id ? `Para abrir el siguiente nivel necesitas un ${pct(level.passAcc)} de aciertos. ` : ''}Lo que fallaste saldrá más a menudo hasta que lo domines.</p>` : result.stars < 3 ? `<p class="muted">${nextStarTip(result, level)}</p>` : ''}
    </div>
    ${result.paceChange ? `<p class="pace-note">${result.paceChange < 0 ? 'Vas sobrada: los pájaros irán un poco más deprisa.' : 'Los pájaros irán un poco más despacio la próxima vez.'}</p>` : ''}
    <dl class="stats">
      <div class="stat"><dt>Aciertos a la primera</dt><dd>${ok} / ${result.answers.length}</dd></div>
      <div class="stat"><dt>Precisión</dt><dd>${pct(result.accuracy)}</dd></div>
      <div class="stat"><dt>Tiempo medio</dt><dd>${secs(result.medianMs)}</dd></div>
      <div class="stat"><dt>Puntos</dt><dd>${result.score.toLocaleString('es-ES')}${record ? '<small>récord</small>' : ''}</dd></div>
    </dl>
    ${missed.length ? '<div class="group"><h2>Para repasar</h2><div class="missed-slot"></div></div>' : ''}
    ${!result.help && result.stars && next ? `<div class="teaser">
      <span class="muted small">${next.world !== level.world ? `Nuevo mundo: ${esc(WORLDS.find((w) => w.id === next.world).title)}` : `Lo siguiente: ${levelTag(next)}`}</span>
      <b>${esc(next.lesson?.title ?? next.title)}</b></div>` : ''}
    <div class="actions">
      ${result.help ? `<button class="btn primary" type="button" data-go="play/${arg}">Jugar sin ayuda</button>` : ''}
      ${!result.help && result.stars && next ? `<button class="btn primary" type="button" data-go="level/${next.id}">Siguiente nivel</button>` : ''}
      <button class="btn ${result.help || (result.stars && next) ? '' : 'primary'}" type="button" data-act="again">Jugar otra vez</button>
      <button class="btn ghost" type="button" data-go="${back}">${level.id ? 'Volver al camino' : 'Volver'}</button>
    </div>`);
  bindNav(root);
  root.querySelector('[data-act="again"]').addEventListener('click', () => screenPlay(arg, result.help));
  if (missed.length && level.theory) {
    // En teoría, cada fallo con su respuesta y la regla que la explica.
    const list = document.createElement('ul');
    list.className = 'missed-list';
    list.innerHTML = missed.slice(0, 6).map((it) => `<li><b>${esc(it.label ?? it.answer)}</b><span>${esc(it.explain)}</span></li>`).join('');
    root.querySelector('.missed-slot').replaceWith(list);
  } else if (missed.length) {
    const staff = miniStaff({
      clefs: level.clefs,
      key: level.key,
      items: missed.slice(0, 10).map((m) => ({ clef: m.clef, pos: m.pos, shownAlt: m.shownAlt, label: displayName(m.note, s.naming), data: noteId(m.note) })),
      birds: s.birds,
    });
    staff.style.setProperty('--player', store.activeProfile().color);
    staff.addEventListener('pointerdown', (e) => {
      const g = e.target.closest('[data-note]');
      if (g) audio.playMidi(midi(parseNote(g.dataset.note)));
    });
    root.querySelector('.missed-slot').replaceWith(staff);
  }
  if (result.stars) setTimeout(() => audio.sfx('star'), 300);
}

// ---------- repaso ----------

const CLEF_NAMES = { treble: 'Clave de sol', bass: 'Clave de fa', alto: 'Clave de do en 3.ª', tenor: 'Clave de do en 4.ª' };

function screenReview() {
  const p = store.activeProfile();
  const clefs = Object.keys(CLEF_NAMES).filter((c) => Object.keys(p.cards).some((k) => k.startsWith(`${c}:`)));
  const root = render(`
    ${topbar('Repaso')}
    <p class="muted">Cada nota vuelve cuando estás a punto de olvidarla: las que fallas, enseguida; las que dominas, cada vez más espaciadas.</p>
    ${clefs.length
      ? clefs.map((c) => {
          const due = dueCount(p.cards, c);
          return `<button class="btn ${due ? 'primary' : ''} continue" type="button" data-go="play/review-${c}">
            <span>${CLEF_NAMES[c]}<small>${due ? `${due} ${due === 1 ? 'nota toca' : 'notas tocan'} hoy` : 'Nada pendiente: repaso de las más flojas'}</small></span>${ICONS.arrow}</button>`;
        }).join('')
      : '<p class="empty">Juega algunos niveles del camino y aquí aparecerán las notas que te toca repasar.</p>'}`);
  bindNav(root);
}

// ---------- práctica libre ----------

const PACES = [['1.8', 'Muy tranquilo'], ['1.5', 'Tranquilo'], ['1.25', 'Medio'], ['1', 'Normal'], ['0.85', 'Rápido']];
const AGES = [['1.8', '5 a 7 años'], ['1.5', '8 a 10'], ['1.25', '11 a 13'], ['1', '14 o más']];

const PRACTICE_DEFAULTS = { clef: 'treble', ledgers: 0, accidentals: 'none', key: 0, mode: 'timed', travelMs: 6000, count: 20 };

function screenPractice() {
  const s = store.settings();
  const cfg = { ...PRACTICE_DEFAULTS, ...(s.practice ?? {}) };
  const keyOptions = [];
  for (let k = -7; k <= 7; k++) keyOptions.push(`<option value="${k}" ${k === cfg.key ? 'selected' : ''}>${k ? `${keyName(k, s.naming)} (${Math.abs(k)} ${k > 0 ? '♯' : '♭'})` : 'Sin armadura'}</option>`);
  const root = render(`
    ${topbar('Práctica libre')}
    <div class="group"><span class="lbl">Clave</span>
      ${seg('clef', [['treble', 'Sol'], ['bass', 'Fa'], ['grand', 'Sol y Fa'], ['alto', 'Do 3.ª'], ['tenor', 'Do 4.ª']], cfg.clef)}</div>
    <div class="group"><span class="lbl">Líneas adicionales</span>
      ${seg('ledgers', [[0, 'Ninguna'], [1, '1'], [2, '2'], [3, '3'], [4, '4']], cfg.ledgers)}</div>
    <div class="group"><span class="lbl">Armadura</span><select id="key">${keyOptions.join('')}</select></div>
    <div class="group acc-group" ${cfg.key ? 'hidden' : ''}><span class="lbl">Alteraciones sueltas</span>
      ${seg('accidentals', [['none', 'No'], ['sharp', '♯'], ['flat', '♭'], ['both', '♯ y ♭']], cfg.accidentals)}</div>
    <div class="group"><span class="lbl">Ritmo</span>
      ${seg('mode', [['calm', 'Sin prisa'], ['timed', 'Con tiempo']], cfg.mode)}</div>
    <div class="group speed-group" ${cfg.mode === 'calm' ? 'hidden' : ''}><span class="lbl">Tiempo para cruzar</span>
      <div class="range-row"><input id="speed" type="range" min="2000" max="10000" step="500" value="${cfg.travelMs}"><output>${secs(cfg.travelMs)}</output></div></div>
    <div class="group"><span class="lbl">Notas por partida</span>
      ${seg('count', [[10, '10'], [20, '20'], [40, '40'], [999, 'Sin fin']], cfg.count)}</div>
    <div class="actions"><button class="btn primary" type="button" data-act="start">Empezar</button></div>`);
  bindNav(root);
  const save = () => store.updateSettings({ practice: cfg });
  onSeg(root, (name, v) => {
    cfg[name] = ['ledgers', 'count'].includes(name) ? Number(v) : v;
    root.querySelector('.speed-group').hidden = cfg.mode === 'calm';
    save();
  });
  root.querySelector('#key').addEventListener('change', (e) => {
    cfg.key = Number(e.target.value);
    root.querySelector('.acc-group').hidden = !!cfg.key;
    save();
  });
  const speed = root.querySelector('#speed');
  speed.addEventListener('input', () => {
    cfg.travelMs = Number(speed.value);
    root.querySelector('output').textContent = secs(cfg.travelMs);
    save();
  });
  root.querySelector('[data-act="start"]').addEventListener('click', () => {
    save();
    go('play/practice');
  });
}

// ---------- progreso ----------

function screenProgress(tab) {
  const p = store.activeProfile();
  const s = store.settings();
  const clefs = Object.keys(CLEF_NAMES).filter((c) => Object.keys(p.cards).some((k) => k.startsWith(`${c}:`)));
  const clef = clefs.includes(tab) ? tab : clefs[0];
  const totalStars = Object.values(p.progress).reduce((a, x) => a + x.stars, 0);
  const acc = p.totals.notes ? p.totals.correct / p.totals.notes : 0;
  const root = render(`
    ${topbar('Progreso')}
    <div class="summary">
      <div class="stat"><dt>Notas leídas</dt><dd>${p.totals.notes.toLocaleString('es-ES')}</dd></div>
      <div class="stat"><dt>Precisión</dt><dd>${p.totals.notes ? pct(acc) : '—'}</dd></div>
      <div class="stat"><dt>Estrellas</dt><dd>${totalStars} / ${LEVELS.length * 3}</dd></div>
      <div class="stat"><dt>Racha</dt><dd>${p.streak.count} ${p.streak.count === 1 ? 'día' : 'días'}</dd></div>
    </div>
    ${clefs.length ? `
      <div class="group"><span class="lbl">Tus notas</span>
        ${seg('clef', clefs.map((c) => [c, CLEF_NAMES[c].replace('Clave de ', '')]), clef)}</div>
      <div class="mastery-slot"></div>
      <div class="legend"><span><i style="background:var(--ok)"></i>Dominada</span><span><i style="background:var(--sun)"></i>Casi</span><span><i style="background:var(--pink)"></i>Aprendiendo</span><span><i style="border:1.5px solid var(--muted)"></i>Sin ver</span></div>
      <p class="note-detail muted small">Toca una nota para ver sus datos. «Dominada» quiere decir un 90 % de aciertos y respuesta en ${secs(MASTERY_MS)} o menos.</p>`
      : '<p class="empty">Aún no has leído ninguna nota. Empieza por el camino y aquí verás cuáles dominas.</p>'}
    ${p.totals.notes ? '<button class="btn" type="button" data-act="share">Compartir el progreso con tu profe</button><p class="share-msg muted small" hidden></p>' : ''}
    ${p.history.length ? `<h2 class="section-title">Últimas partidas</h2><ul class="history">${[...p.history].reverse().slice(0, 8).map((h) => {
      const lvl = h.levelId ? levelById(h.levelId) : null;
      const name = lvl ? levelTag(lvl) : h.mode === 'review' ? 'Repaso' : 'Práctica';
      const d = new Date(h.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
      return `<li><span>${name} · ${d}</span><span>${h.ok}/${h.n} ${h.stars ? miniStars(h.stars) : ''}</span></li>`;
    }).join('')}</ul>` : ''}`);
  bindNav(root);
  onSeg(root, (_, v) => screenProgress(v));
  root.querySelector('[data-act="share"]')?.addEventListener('click', () => shareProgress(root));
  if (!clef) return;

  const range = rangeFor(clef, 2);
  const extra = Object.keys(p.cards).filter((k) => k.startsWith(`${clef}:`)).map((k) => k.split(':')[1]);
  const ids = [...new Set([...range, ...extra])]
    .map((id) => parseNote(id))
    .sort((a, b) => midi(a) - midi(b) || a.alt - b.alt);
  const items = ids.map((n) => {
    const key = `${clef}:${noteId(n)}`;
    const card = p.cards[key];
    return { clef, pos: staffPos(n, clef), shownAlt: n.alt || null, label: displayName(n, s.naming), cls: `m${masteryLevel(card, MASTERY_MS)}`, data: key };
  });
  const slot = root.querySelector('.mastery-slot');
  const half = Math.ceil(items.length / 2);
  const staves = (items.length > 14 ? [items.slice(0, half), items.slice(half)] : [items]).map((row) => {
    const staff = miniStaff({ clefs: [clef], items: row, spacing: 17, birds: false, cls: 'mastery-staff' });
    staff.style.marginBottom = '8px';
    slot.before(staff);
    return staff;
  });
  slot.remove();
  const detail = root.querySelector('.note-detail');
  for (const staff of staves) staff.addEventListener('pointerdown', (e) => {
    const g = e.target.closest('[data-note]');
    if (!g) return;
    const key = g.dataset.note;
    const n = parseNote(key.split(':')[1]);
    audio.unlock();
    audio.playMidi(midi(n));
    const card = p.cards[key];
    const conf = topConfusion(card, s.naming);
    detail.textContent = card?.seen
      ? `${displayName(n, s.naming)}: vista ${card.seen} ${card.seen === 1 ? 'vez' : 'veces'}, ${pct(recentAccuracy(card))} de aciertos recientes, ${secs(median(card.times))} de media.${conf ? ` La confundes sobre todo con ${conf}.` : ''}`
      : `${displayName(n, s.naming)}: todavía no ha salido.`;
  });
}

function progressSummary() {
  const p = store.activeProfile();
  const s = store.settings();
  const stars = Object.values(p.progress).reduce((a, x) => a + x.stars, 0);
  const next = nextToPlay(p.progress);
  const lines = [
    `Progreso de ${p.name} en Pío (lectura de notas)`,
    `Estrellas: ${stars} de ${LEVELS.length * 3}. Va por ${levelTag(next)}: ${next.title}.`,
    `Notas leídas: ${p.totals.notes}, con un ${pct(p.totals.notes ? p.totals.correct / p.totals.notes : 0)} de aciertos. Racha: ${p.streak.count} días.`,
  ];
  for (const clef of Object.keys(CLEF_NAMES)) {
    const cards = Object.entries(p.cards).filter(([k, c]) => k.startsWith(`${clef}:`) && c.seen);
    if (!cards.length) continue;
    const mastered = cards.filter(([, c]) => masteryLevel(c, MASTERY_MS) === 3).length;
    const weak = cards
      .filter(([, c]) => c.seen >= 3)
      .sort((a, b) => recentAccuracy(a[1]) - recentAccuracy(b[1]))
      .slice(0, 3)
      .filter(([, c]) => recentAccuracy(c) < 0.9)
      .map(([k]) => displayName(parseNote(k.split(':')[1]), s.naming) + parseNote(k.split(':')[1]).oct);
    lines.push(`${CLEF_NAMES[clef]}: ${mastered} de ${cards.length} notas dominadas.${weak.length ? ` Le cuestan: ${weak.join(', ')}.` : ''}`);
  }
  return lines.join('\n');
}

// Compartir con el menú del móvil; si no se puede, copiar; si tampoco, enseñar el texto.
async function shareProgress(root) {
  const text = progressSummary();
  const msg = root.querySelector('.share-msg');
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Progreso en Pío', text });
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(text);
    msg.textContent = 'Resumen copiado. Pégalo en un mensaje para tu profe.';
  } catch {
    msg.textContent = text;
  }
  msg.hidden = false;
}

// ---------- tablas de notas ----------

function screenChart(tab) {
  const s = store.settings();
  const clef = CLEF_NAMES[tab] ? tab : 'treble';
  const root = render(`
    ${topbar('Tablas de notas')}
    ${seg('clef', Object.keys(CLEF_NAMES).map((c) => [c, CLEF_NAMES[c].replace('Clave de ', '')]), clef)}
    <p class="muted">${CHART_TIPS[clef]}</p>
    <div class="chart-slot"></div>
    <p class="muted small">Las notas que brillan son notas guía: apréndelas primero y lee las demás contando desde la más cercana. Toca cualquier nota para oírla.</p>`);
  bindNav(root);
  onSeg(root, (_, v) => go(`chart/${v}`));
  const ids = rangeFor(clef, 3);
  const half = Math.ceil(ids.length / 2);
  const slot = root.querySelector('.chart-slot');
  for (const row of [ids.slice(0, half), ids.slice(half)]) {
    const staff = miniStaff({
      clefs: [clef],
      items: row.map((id) => {
        const n = parseNote(id);
        return { clef, pos: staffPos(n, clef), label: displayName(n, s.naming), halo: LANDMARKS[clef].includes(id), data: id };
      }),
      spacing: 19,
      birds: s.birds,
    });
    staff.style.setProperty('--player', store.activeProfile().color);
    staff.style.marginBottom = '10px';
    staff.addEventListener('pointerdown', (e) => {
      const g = e.target.closest('[data-note]');
      if (!g) return;
      audio.unlock();
      audio.playMidi(midi(parseNote(g.dataset.note)));
    });
    slot.before(staff);
  }
  slot.remove();
}

// ---------- cómo se juega ----------

function screenHelp() {
  const s = store.settings();
  const root = render(`
    ${topbar('Cómo se juega')}
    <div class="help-slot"></div>
    <div class="group"><h2>Nombra el pájaro que brilla</h2>
      <p>Los pájaros entran por la derecha y caminan por los cables hacia la clave. Cada uno es una nota: toca su nombre (o su tecla) antes de que llegue. Siempre se responde al primero de la fila, el que lleva el halo amarillo.</p></div>
    <div class="group"><h2>Sin prisa y con tiempo</h2>
      <p>Cada nivel empieza sin prisa: los pájaros llegan de uno en uno y esperan. Luego llegan en fila y, si alcanzan la clave, se escapan y cuenta como fallo. Si te resulta rápido, elige un ritmo más tranquilo en Ajustes.</p></div>
    <div class="group"><h2>Cuando fallas</h2>
      <p>Ves el nombre correcto sobre el pájaro, la nota guía más cercana dibujada en verde y el botón correcto parpadea: tócalo para que se vaya volando. Esa nota volverá a salir enseguida, y al final del nivel vuelven los pájaros que fallaste para que los nombres bien.</p></div>
    <div class="group"><h2>Notas nuevas</h2>
      <p>Antes de cada nivel verás lo nuevo: los pájaros llegan al pentagrama con su nombre y su sonido, y lo pruebas en «Pruébalo». Dentro del nivel, la primera vez que sale una nota nueva viene presentada y no cuenta como fallo.</p></div>
    <div class="group"><h2>Estrellas</h2>
      <ul class="goals">
        <li>${miniStars(1)}<span>Acertar el 90 % a la primera. Abre el siguiente nivel.</span></li>
        <li>${miniStars(2)}<span>Además, responder con soltura.</span></li>
        <li>${miniStars(3)}<span>Acertar el 95 % y responder rápido: ahí la lectura ya es casi automática.</span></li>
      </ul>
      <p>Las estrellas de arriba se apagan durante la partida cuando los fallos ya no permiten conseguirlas. No hay vidas: siempre terminas la ronda.</p></div>
    <div class="group"><h2>Repaso</h2>
      <p>Pío recuerda cada nota que has leído. Las que fallas vuelven pronto y las que dominas, cada vez más espaciadas. Cinco minutos de repaso al día rinden más que una hora a la semana.</p></div>
    <div class="group"><h2>Cómo leer más rápido</h2>
      <p>Fíjate primero en si la nota está en una línea o en un espacio. Luego cuenta desde la nota guía más cercana: en clave de sol, el Sol de la segunda línea y los Do; en clave de fa, el Fa de la cuarta línea y los Do. Evita contar siempre desde abajo.</p></div>
    <div class="group"><h2>Para familias y profes</h2>
      <p>Cada jugador tiene su progreso. En Progreso puedes compartir un resumen con el profe y en Ajustes guardar una copia para pasarla a otro móvil. Si tienes un teclado MIDI, actívalo en Ajustes y responde tocando.</p></div>
    <div class="actions"><button class="btn primary" type="button" data-go="home">Entendido</button></div>`);
  bindNav(root);
  const demo = miniStaff({
    clefs: ['treble'],
    items: ['B4', 'E5', 'G4'].map((id, i) => ({ clef: 'treble', pos: staffPos(parseNote(id), 'treble'), halo: i === 0, data: id })),
    spacing: 34,
    birds: s.birds,
  });
  demo.style.setProperty('--player', store.activeProfile().color);
  root.querySelector('.help-slot').replaceWith(demo);
}

// Nota con la que más se confunde una tarjeta (según lo que respondió al fallar).
const PC_SPELLING = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0]];
function topConfusion(card, naming) {
  const entries = Object.entries(card?.conf ?? {}).filter(([k]) => k !== 'timeout' && !['line', 'space'].includes(k));
  if (!entries.length) return null;
  const [given] = entries.sort((a, b) => b[1] - a[1])[0];
  const [step, alt] = given.startsWith('pc:') ? PC_SPELLING[Number(given.slice(3))] : given.split(':').map(Number);
  return displayName({ step, alt }, naming);
}

// Sincronización con código familiar. onJoined: qué hacer tras unirse a un código.
function mountSync(slot, onJoined = null) {
  const code = store.syncCode();
  const ago = (t) => {
    if (!t) return 'todavía no';
    const min = Math.round((Date.now() - t) / 60000);
    return min < 1 ? 'hace un momento' : min < 60 ? `hace ${min} min` : new Date(t).toLocaleString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };
  slot.innerHTML = code
    ? `<div class="sync-box">
        <p>Este dispositivo guarda el progreso en la nube con el código</p>
        <p class="sync-code" aria-label="Código de sincronización">${code}</p>
        <p class="muted small">Escríbelo en el otro dispositivo (Ajustes → Jugar en varios dispositivos). Última sincronización: ${ago(store.lastSync())}.</p>
        <div class="actions two">
          <button class="btn" type="button" data-sync="copy">Copiar código</button>
          <button class="btn" type="button" data-sync="now">Sincronizar ahora</button>
        </div>
        <button class="btn ghost" type="button" data-sync="stop">Dejar de sincronizar aquí</button>
      </div>`
    : `<div class="sync-box">
        <p class="muted">Con un código, el progreso y las partidas a medias se guardan en la nube y puedes seguir en otro dispositivo.</p>
        ${onJoined ? '' : '<button class="btn primary" type="button" data-sync="create">Crear un código para este dispositivo</button>'}
        <form class="field sync-join" autocomplete="off">
          <label for="sync-input">${onJoined ? 'Escribe el código que ves en el otro dispositivo' : '¿Ya tienes un código de otro dispositivo?'}</label>
          <input id="sync-input" type="text" inputmode="text" autocapitalize="characters" placeholder="7KQ4-M2XD-9PRA" maxlength="16">
          <button class="btn" type="submit">Usar este código</button>
        </form>
      </div>`;
  slot.insertAdjacentHTML('beforeend', '<p class="sync-msg small" role="status"></p>');
  const msg = slot.querySelector('.sync-msg');
  const say = (text, bad = false) => {
    msg.textContent = text;
    msg.classList.toggle('bad-msg', bad);
  };
  const refresh = () => mountSync(slot, onJoined);
  slot.querySelector('.sync-join')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    say('Conectando…');
    try {
      await sync.joinCode(slot.querySelector('#sync-input').value);
      if (onJoined) onJoined();
      else refresh();
    } catch (err) {
      say(err.message, true);
    }
  });
  slot.addEventListener('click', async (e) => {
    const act = e.target.closest('[data-sync]')?.dataset.sync;
    if (!act) return;
    try {
      if (act === 'create') {
        say('Creando código…');
        await sync.createCode();
        refresh();
      } else if (act === 'copy') {
        await navigator.clipboard.writeText(code).then(() => say('Código copiado.'), () => say(code));
      } else if (act === 'now') {
        say('Sincronizando…');
        await sync.syncNow();
        refresh();
      } else if (act === 'stop') {
        sync.stop();
        refresh();
      }
    } catch (err) {
      say(`No se ha podido sincronizar: ${err.message}`, true);
    }
  });
}

// ---------- ajustes ----------

function screenSettings() {
  const s = store.settings();
  const p = store.activeProfile();
  const toggle = (k, label, hint = '') => `
    <div class="toggle-row"><div><b>${label}</b>${hint ? `<p class="muted small">${hint}</p>` : ''}</div>
    <button class="switch" type="button" role="switch" data-k="${k}" aria-checked="${!!s[k]}" aria-label="${label}"></button></div>`;
  const root = render(`
    ${topbar('Ajustes')}
    <div class="group"><span class="lbl">Nombres de las notas</span>
      ${seg('naming', [['solfege', 'Do Re Mi'], ['letters', 'C D E'], ['german', 'C D … H']], s.naming)}
      <p class="hint">«C D … H» es la nomenclatura alemana: H es Si y B es Si♭.</p></div>
    <div class="group"><span class="lbl">Responder con</span>
      ${seg('input', [['names', 'Botones'], ['piano', 'Teclado de piano']], s.input)}
      <p class="hint">El teclado une cada nota con su tecla; los botones obligan a escribir bien las alteraciones (Fa♯ no es Sol♭).</p></div>
    ${toggle('pianoLabels', 'Nombres en las teclas del piano')}
    <div class="group"><span class="lbl">Con piano, tocar en la octava escrita</span>
      ${seg('pianoOctave', [['auto', 'Desde el gran pentagrama'], ['exact', 'Siempre'], ['any', 'Nunca']], s.pianoOctave ?? 'auto')}
      <p class="hint">Con la octava escrita, el teclado tiene varias octavas: hay que tocar la tecla exacta, como en el piano de verdad.</p></div>
    <div class="group"><span class="lbl">Aspecto de las notas</span>
      ${seg('birds', [['true', 'Pájaros'], ['false', 'Notas clásicas']], String(s.birds))}</div>
    ${toggle('autoPace', 'Ritmo automático', 'Pío ajusta la velocidad según cómo te va, para que no sea ni aburrido ni agobiante.')}
    <div class="group"><span class="lbl">Ritmo</span>
      ${seg('pace', PACES, String(PACES.reduce((best, [v]) => (Math.abs(v - s.pace) < Math.abs(best - s.pace) ? Number(v) : best), 1)))}
      <p class="hint">Ajusta el tiempo para cruzar y el objetivo de las estrellas. Para niños pequeños, «Muy tranquilo».</p></div>
    ${toggle('showAnswer', 'Enseñar la respuesta al fallar', 'Recomendado: ver el nombre correcto justo después del error ayuda a corregirlo.')}
    ${toggle('sound', 'Sonido')}
    <div class="range-row"><span>Volumen</span><input id="vol" type="range" min="0" max="1" step="0.05" value="${s.volume}"></div>
    ${toggle('haptics', 'Vibrar al fallar', 'Solo en móviles que lo admiten.')}
    ${navigator.requestMIDIAccess ? `${toggle('midi', 'Responder con un teclado MIDI', 'Conecta un teclado por USB o Bluetooth. Funciona en Chrome y Edge, también en Android.')}
    ${toggle('midiExact', 'Con MIDI, tocar en la octava escrita')}` : ''}
    <div class="group"><span class="lbl">Tema</span>
      ${seg('theme', [['auto', 'Automático'], ['light', 'Claro'], ['dark', 'Noche']], s.theme)}</div>
    <h2 class="section-title">Jugar en varios dispositivos</h2>
    <div class="sync-slot"></div>
    <h2 class="section-title">Jugador</h2>
    <button class="btn" type="button" data-go="players">Cambiar de jugador</button>
    <button class="btn" type="button" data-act="export">Guardar copia de ${esc(p.name)}</button>
    <div class="export-box group" hidden>
      <p class="muted small">Si no se ha descargado el archivo, copia este texto y guárdalo donde quieras.</p>
      <textarea id="export-text" class="backup" readonly></textarea>
      <button class="btn" type="button" data-act="copy-export">Copiar</button>
    </div>
    <label class="btn" for="import-file">Cargar una copia</label>
    <input id="import-file" type="file" accept="application/json,.json" hidden>
    <textarea id="import-text" class="backup" placeholder="…o pega aquí el texto de una copia"></textarea>
    <button class="btn" type="button" data-act="import-text">Cargar el texto pegado</button>
    <p class="import-msg muted small" hidden></p>
    <button class="btn danger" type="button" data-act="delete">Borrar a ${esc(p.name)}</button>
    <div class="confirm" hidden>
      <p>Se borrarán su progreso y sus estadísticas. No se puede deshacer.</p>
      <div class="actions two"><button class="btn" type="button" data-act="cancel">Cancelar</button><button class="btn danger" type="button" data-act="really">Borrar</button></div>
    </div>
    <p class="muted small" style="margin-top:12px">Glifos musicales: Bravura (SIL Open Font License).</p>`);
  bindNav(root);
  onSeg(root, (k, v) => {
    const val = k === 'birds' ? v === 'true' : k === 'pace' ? Number(v) : v;
    store.updateSettings({ [k]: val });
    applyTheme();
  });
  root.querySelectorAll('.switch').forEach((b) =>
    b.addEventListener('click', () => {
      const v = b.getAttribute('aria-checked') !== 'true';
      b.setAttribute('aria-checked', String(v));
      store.updateSettings({ [b.dataset.k]: v });
      applyTheme();
    }),
  );
  root.querySelector('#vol').addEventListener('change', (e) => {
    store.updateSettings({ volume: Number(e.target.value) });
    applyTheme();
    audio.unlock();
    audio.playMidi(67);
  });
  mountSync(root.querySelector('.sync-slot'));
  const confirm = root.querySelector('.confirm');
  root.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'delete') confirm.hidden = false;
    if (act === 'cancel') confirm.hidden = true;
    if (act === 'really') {
      store.deleteProfile(p.id);
      go(store.activeProfile() ? 'home' : 'players');
    }
    if (act === 'export') {
      const json = store.exportProfile();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
      a.download = `pio-${p.name.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      root.querySelector('#export-text').value = json;
      root.querySelector('.export-box').hidden = false;
    }
    if (act === 'copy-export') {
      const ta = root.querySelector('#export-text');
      navigator.clipboard?.writeText(ta.value).catch(() => ta.select());
    }
    if (act === 'import-text') loadBackup(root.querySelector('#import-text').value);
  });
  const loadBackup = (json) => {
    const msg = root.querySelector('.import-msg');
    try {
      const imported = store.importProfile(json);
      msg.textContent = `Copia de ${imported.name} cargada.`;
      msg.hidden = false;
      setTimeout(() => go('home'), 900);
    } catch (err) {
      msg.textContent = err instanceof SyntaxError ? 'Ese texto no es una copia de Pío.' : `No se ha podido cargar: ${err.message}`;
      msg.hidden = false;
    }
  };
  root.querySelector('#import-file').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) loadBackup(await file.text());
  });
}

// ---------- rutas ----------

function route() {
  game?.destroy();
  game = null;
  cleanups.forEach((fn) => fn());
  cleanups = [];
  timers.forEach(clearTimeout);
  timers = [];
  applyTheme();
  const [name, arg, extra] = location.hash.replace(/^#\/?/, '').split('/');
  if (!store.activeProfile() || name === 'players') return screenPlayers();
  switch (name) {
    case 'map': return screenMap(arg);
    case 'level': return screenIntro(arg);
    case 'play': {
      const saved = store.savedGame();
      if (extra === 'seguir') return saved?.arg === arg ? screenPlay(arg, false, saved.state) : go('home');
      return screenPlay(arg, extra === 'ayuda');
    }
    case 'chart': return screenChart(arg);
    case 'help': return screenHelp();
    case 'review': return screenReview();
    case 'practice': return screenPractice();
    case 'progress': return screenProgress(arg);
    case 'settings': return screenSettings();
    default: return screenHome();
  }
}

// Con ?dev la partida en curso queda accesible desde la consola (pruebas automáticas).
if (new URLSearchParams(location.search).has('dev')) window.__pio = { get game() { return game; } };

window.addEventListener('hashchange', route);
sync.start(() => {
  const name = location.hash.replace(/^#\/?/, '').split('/')[0];
  if (['', 'home', 'map', 'progress', 'review', 'players'].includes(name)) route();
});
window.addEventListener('pointerdown', () => audio.unlock(), { once: true });
route();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
