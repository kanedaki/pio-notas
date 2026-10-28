// Sincronización entre dispositivos con un código familiar (sin cuentas ni contraseñas).
// Un dispositivo crea el código; en el otro se escribe y ambos comparten el progreso.
// Cada vez que algo cambia se envía (con un pequeño retraso) y el servidor devuelve la fusión.

import * as store from './store.js';

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'; // base 32 sin letras que se confunden
let timer = null;
let inFlight = null;
let onRemoteChange = () => {};

export function newCodeText() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const chars = [...bytes].map((b) => ALPHABET[b % 32]).join('');
  return `${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export function normalizeCode(text) {
  const clean = text.toUpperCase().replace(/[^0-9A-Z]/g, '').replace(/O/g, '0').replace(/[IL]/g, '1');
  return clean.length === 12 ? `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8)}` : null;
}

// Envía lo local y aplica lo que devuelve el servidor. Devuelve true si llegaron cambios.
export async function syncNow({ keepalive = false } = {}) {
  const code = store.syncCode();
  if (!code || !navigator.onLine) return false;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    const body = JSON.stringify(store.syncPayload());
    const res = await fetch(`/api/sync/${code}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: keepalive && body.length < 60000, // el navegador limita keepalive a 64 KB
    });
    if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? `Error ${res.status}`);
    const changed = store.applyRemote(await res.json());
    if (changed) onRemoteChange();
    return changed;
  })().finally(() => { inFlight = null; });
  return inFlight;
}

// Empieza a sincronizar con un código nuevo (este dispositivo sube sus datos).
export async function createCode() {
  store.setSyncCode(newCodeText());
  await syncNow();
  return store.syncCode();
}

// Se une a un código existente: trae los datos de allí y los fusiona con los de aquí.
export async function joinCode(text) {
  const code = normalizeCode(text);
  if (!code) throw new Error('El código tiene 12 letras o números, como 7KQ4-M2XD-9PRA.');
  const res = await fetch(`/api/sync/${code}`);
  if (res.status === 404) throw new Error('No hay ningún progreso guardado con ese código.');
  if (!res.ok) throw new Error('No se ha podido conectar. Prueba otra vez.');
  store.setSyncCode(code);
  store.applyRemote(await res.json());
  await syncNow();
  return code;
}

export function stop() {
  store.setSyncCode(null);
}

// Sincroniza al abrir, al volver a la app, al cambiar datos (con 4 s de margen) y al salir.
export function start(onChange) {
  onRemoteChange = onChange;
  const soon = (ms = 4000) => {
    clearTimeout(timer);
    timer = setTimeout(() => syncNow().catch(() => {}), ms);
  };
  store.onChange(() => soon());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) syncNow({ keepalive: true }).catch(() => {});
    else soon(300);
  });
  window.addEventListener('online', () => soon(300));
  soon(200);
}
