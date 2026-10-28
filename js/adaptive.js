// Selección adaptativa de notas y repaso espaciado (cajas de Leitner).
// Una "tarjeta" es una nota concreta en una clave concreta: 'treble:F#4'.

export const cardKey = (clef, id) => `${clef}:${id}`;

const DAY = 24 * 60 * 60 * 1000;
// Días hasta el siguiente repaso según la caja de Leitner (0 = nunca vista, 1 = vuelve hoy).
export const BOX_INTERVALS = [0, 0, 1, 2, 4, 8, 16, 32];
const MAX_BOX = BOX_INTERVALS.length - 1;

export function emptyCard() {
  return { seen: 0, correct: 0, recent: [], times: [], box: 0, due: 0, last: 0, conf: {} };
}

export function median(xs) {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function recentAccuracy(card) {
  if (!card || !card.recent.length) return null;
  return card.recent.filter(Boolean).length / card.recent.length;
}

// 0 sin ver, 1 aprendiendo, 2 casi, 3 dominada.
export function masteryLevel(card, targetMs) {
  if (!card || !card.seen) return 0;
  const acc = recentAccuracy(card);
  const med = median(card.times);
  if (card.recent.length >= 5 && acc >= 0.9 && med !== null && med <= targetMs) return 3;
  if (acc >= 0.75) return 2;
  return 1;
}

// Registra una respuesta (primer intento de esa aparición). given: lo que respondió si falló,
// para saber con qué nota se confunde.
export function recordAnswer(card, correct, ms, now = Date.now(), given = null) {
  card.seen++;
  if (correct) card.correct++;
  else if (given) {
    card.conf ??= {};
    card.conf[given] = (card.conf[given] ?? 0) + 1;
  }
  card.recent = [...card.recent, correct].slice(-10);
  if (correct) card.times = [...card.times, ms].slice(-8);
  card.last = now;
  return card;
}

// Al final de la sesión, cada tarjeta usada sube, se queda o vuelve a la caja 1.
// Acertar pero despacio no sube de caja: la meta es leer con fluidez.
export function updateBox(card, sessionResults, targetMs, now = Date.now()) {
  const n = sessionResults.length;
  if (!n) return card;
  const acc = sessionResults.filter((r) => r.correct).length / n;
  const med = median(sessionResults.filter((r) => r.correct).map((r) => r.ms));
  if (acc === 1 && med !== null && med <= targetMs) card.box = Math.min(MAX_BOX, Math.max(1, card.box) + 1);
  else if (acc < 0.75) card.box = 1;
  else card.box = Math.max(1, card.box);
  card.due = now + BOX_INTERVALS[card.box] * DAY;
  return card;
}

function shuffle(xs, rnd) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Peso de una tarjeta: más si falla, si es lenta o si es nueva en este nivel.
export function cardWeight(card, { targetMs, isNew }) {
  let w = 1;
  if (!card || !card.seen) w += 1.5;
  else {
    const acc = recentAccuracy(card) ?? 1;
    w += (1 - acc) * 4;
    const med = median(card.times);
    if (med !== null && med > targetMs) w += Math.min(2, (med - targetMs) / targetMs);
  }
  if (isNew) w *= 1.6;
  return w;
}

// Crea el generador de notas de una partida. pool: [{ key, ... }], cards: mapa key -> tarjeta.
// Primero recorre todo el conjunto barajado (si cabe en la mitad de la partida) y luego elige
// por peso, sin repetir la misma nota dos veces seguidas. Tras un fallo, reinforce() programa
// la nota otra vez a los 2-3 turnos y a los 6-8, y la nota confundida en medio.
export function makeSelector(pool, cards, { count, targetMs, newKeys = [], rnd = Math.random }) {
  const coverage = pool.length <= count / 2 ? shuffle(pool, rnd) : [];
  const history = [];
  const scheduled = []; // { item, at }
  const isNew = new Set(newKeys);
  const between = (a, b) => a + Math.floor(rnd() * (b - a + 1));

  function weighted() {
    const last = history[history.length - 1];
    const weights = pool.map((p) => {
      if (pool.length > 1 && p.key === last) return 0;
      return cardWeight(cards[p.key], { targetMs, isNew: isNew.has(p.key) });
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let r = rnd() * total;
    for (let i = 0; i < pool.length; i++) {
      r -= weights[i];
      if (r < 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  function next() {
    const turn = history.length;
    const last = history[history.length - 1];
    let item;
    const due = scheduled.findIndex((s) => s.at <= turn && s.item.key !== last);
    if (due >= 0) {
      item = scheduled.splice(due, 1)[0].item;
    } else if (coverage.length) {
      item = coverage.shift();
      if (item.key === last && coverage.length) {
        coverage.push(item);
        item = coverage.shift();
      }
    } else {
      item = weighted();
    }
    history.push(item.key);
    return item;
  }

  function reinforce(item, confused = null) {
    const turn = history.length;
    scheduled.push({ item, at: turn + between(2, 3) }, { item, at: turn + between(6, 8) });
    if (confused && confused.key !== item.key) scheduled.push({ item: confused, at: turn + between(4, 5) });
  }

  return { next, reinforce };
}

// Tarjetas para el repaso de hoy en una clave: las vencidas primero (caja baja antes),
// luego las de peor precisión, hasta llenar la sesión.
export function reviewKeys(cards, clef, size = 20, now = Date.now()) {
  const mine = Object.entries(cards).filter(([k, c]) => k.startsWith(`${clef}:`) && c.seen > 0);
  const due = mine.filter(([, c]) => c.due <= now).sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due);
  const rest = mine
    .filter(([, c]) => c.due > now)
    .sort((a, b) => (recentAccuracy(a[1]) ?? 1) - (recentAccuracy(b[1]) ?? 1));
  return [...due, ...rest].slice(0, size).map(([k]) => k);
}

export function dueCount(cards, clef, now = Date.now()) {
  return Object.entries(cards).filter(([k, c]) => k.startsWith(`${clef}:`) && c.seen > 0 && c.due <= now).length;
}
