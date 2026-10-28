// Fusión de datos entre dispositivos (la usan el navegador y el servidor) y valores derivados.
// Regla general: nada se pierde. Estrellas y récords, el máximo; historial, la unión; cada tarjeta,
// la más reciente; ajustes y partida guardada, lo último que se cambió. La racha y los totales no se
// guardan: se calculan a partir del historial, así que siempre cuadran tras fusionar.

const later = (a, b, field) => ((a?.[field] ?? 0) >= (b?.[field] ?? 0) ? a : b);

function mergeProgress(a = {}, b = {}) {
  const out = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id] ?? {};
    const y = b[id] ?? {};
    out[id] = {
      stars: Math.max(x.stars ?? 0, y.stars ?? 0),
      best: Math.max(x.best ?? 0, y.best ?? 0),
      plays: Math.max(x.plays ?? 0, y.plays ?? 0),
    };
    const passed = [x.passedDay, y.passedDay].filter(Boolean).sort();
    if (passed.length) out[id].passedDay = passed[0];
    if (x.consolidated || y.consolidated) out[id].consolidated = true;
  }
  return out;
}

function mergeCards(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, card] of Object.entries(b)) {
    const mine = out[k];
    if (!mine || (card.last ?? 0) > (mine.last ?? 0) || ((card.last ?? 0) === (mine.last ?? 0) && card.seen > mine.seen)) {
      out[k] = card;
    }
  }
  return out;
}

function mergeHistory(a = [], b = []) {
  const byKey = new Map();
  for (const h of [...a, ...b]) byKey.set(`${h.date}|${h.levelId}|${h.mode}`, h);
  return [...byKey.values()].sort((x, y) => x.date - y.date).slice(-5000);
}

// Conjuntos con fecha de alta (logros, objetos comprados, retos hechos): la unión, con la fecha más antigua.
function mergeDated(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, at] of Object.entries(b)) out[k] = out[k] ? Math.min(out[k], at) : at;
  return out;
}

export function mergeProfile(a, b) {
  if (!a) return b;
  if (!b) return a;
  const base = later(a, b, 'updatedAt');
  const set = later(a, b, 'settingsAt');
  const look = later(a, b, 'equippedAt');
  return {
    ...base,
    settings: set.settings,
    settingsAt: set.settingsAt ?? 0,
    progress: mergeProgress(a.progress, b.progress),
    cards: mergeCards(a.cards, b.cards),
    history: mergeHistory(a.history, b.history),
    saved: later(a.saved, b.saved, 'at') ?? null,
    achievements: mergeDated(a.achievements, b.achievements),
    owned: mergeDated(a.owned, b.owned),
    daily: mergeDated(a.daily, b.daily),
    equipped: look.equipped ?? {},
    equippedAt: look.equippedAt ?? 0,
  };
}

// a y b: { profiles: { id: perfil }, deleted: { id: fecha } }
export function mergeStores(a = {}, b = {}) {
  const deleted = mergeDated(a.deleted, b.deleted);
  const profiles = {};
  const ids = new Set([...Object.keys(a.profiles ?? {}), ...Object.keys(b.profiles ?? {})]);
  for (const id of ids) {
    if (deleted[id]) continue;
    profiles[id] = mergeProfile(a.profiles?.[id], b.profiles?.[id]);
  }
  return { profiles, deleted };
}

// ---------- valores derivados ----------

const pad2 = (n) => String(n).padStart(2, '0');
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const addDays = (key, n) => {
  const [y, m, d] = key.split('-').map(Number);
  return dayKey(new Date(y, m - 1, d + n));
};

// Días seguidos jugando hasta hoy (o hasta ayer, si hoy aún no ha jugado). Un día suelto sin jugar
// se perdona como mucho una vez por cada 7 días de racha.
export function computeStreak(history = [], now = new Date()) {
  const days = new Set(history.map((h) => dayKey(new Date(h.date))));
  const today = dayKey(now);
  let day = days.has(today) ? today : addDays(today, -1);
  if (!days.has(day)) {
    if (days.has(addDays(day, -1))) day = addDays(day, -1);
    else return 0;
  }
  let count = 0;
  let lastForgiven = -Infinity;
  while (true) {
    if (days.has(day)) {
      count++;
      day = addDays(day, -1);
    } else if (days.has(addDays(day, -1)) && count - lastForgiven >= 7) {
      lastForgiven = count;
      day = addDays(day, -1);
    } else {
      break;
    }
  }
  return count;
}

export function computeTotals(history = []) {
  return history.reduce((t, h) => ({ notes: t.notes + (h.n ?? 0), correct: t.correct + (h.ok ?? 0) }), { notes: 0, correct: 0 });
}
