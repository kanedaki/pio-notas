// Servidor de Pío (Railway y local). Sin dependencias.
// - Sirve los archivos del juego; el resto del repositorio (tests, docs, dev) no se publica.
// - /api/sync/:código guarda y fusiona el progreso para jugar en varios dispositivos.
//   Un archivo JSON por código en DATA_DIR (en Railway, un volumen montado en /data).

import { createServer } from 'node:http';
import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeStores } from './js/merge.js';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 8080;
const DATA_DIR = process.env.DATA_DIR || join(ROOT, 'data');
const MAX_BODY = 4 * 1024 * 1024;
const CODE = /^[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/;
const PUBLIC = [/^\/index\.html$/, /^\/manifest\.webmanifest$/, /^\/sw\.js$/, /^\/(css|js|icons)\/[\w.-]+$/];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};

const send = (res, status, body, type = 'application/json; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
};

// Freno sencillo: como mucho 120 peticiones a la API por minuto y dirección.
const hits = new Map();
function limited(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 120;
}

// Las escrituras de un mismo código van en fila para no pisarse.
const queues = new Map();
function serialized(code, task) {
  const next = (queues.get(code) ?? Promise.resolve()).then(task, task);
  queues.set(code, next.catch(() => {}));
  return next;
}

async function load(code) {
  try {
    return JSON.parse(await readFile(join(DATA_DIR, `${code}.json`), 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

async function save(code, data) {
  await mkdir(DATA_DIR, { recursive: true });
  const file = join(DATA_DIR, `${code}.json`);
  await writeFile(`${file}.tmp`, JSON.stringify(data));
  await rename(`${file}.tmp`, file);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(Object.assign(new Error('demasiado grande'), { status: 413 }));
        req.destroy();
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function api(req, res, code) {
  if (limited(req)) return send(res, 429, { error: 'Demasiadas peticiones, espera un minuto.' });
  if (!CODE.test(code)) return send(res, 400, { error: 'Código no válido.' });
  if (req.method === 'GET') {
    const data = await load(code);
    return data ? send(res, 200, data) : send(res, 404, { error: 'No hay datos con ese código.' });
  }
  if (req.method === 'PUT') {
    let incoming;
    try {
      incoming = JSON.parse(await readBody(req));
    } catch (err) {
      return send(res, err.status ?? 400, { error: 'Datos no válidos.' });
    }
    if (typeof incoming?.profiles !== 'object') return send(res, 400, { error: 'Datos no válidos.' });
    const merged = await serialized(code, async () => {
      const result = mergeStores((await load(code)) ?? {}, incoming);
      await save(code, result);
      return result;
    });
    return send(res, 200, merged);
  }
  return send(res, 405, { error: 'Método no permitido.' });
}

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  try {
    const m = /^\/api\/sync\/([^/]+)$/.exec(url.pathname);
    if (m) return await api(req, res, decodeURIComponent(m[1]).toUpperCase());

    const path = normalize(decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!['GET', 'HEAD'].includes(req.method) || !PUBLIC.some((re) => re.test(path))) {
      return send(res, 404, 'No encontrado', 'text/plain; charset=utf-8');
    }
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, {
      'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream',
      // Sin huellas en los nombres de archivo: el navegador revalida siempre (respuesta 304 barata).
      'Cache-Control': path.startsWith('/icons/') ? 'public, max-age=86400' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch (err) {
    if (err.code === 'ENOENT') return send(res, 404, 'No encontrado', 'text/plain; charset=utf-8');
    console.error(err);
    send(res, 500, { error: 'Error del servidor.' });
  }
}).listen(PORT, () => console.log(`Pío en http://localhost:${PORT} (datos en ${DATA_DIR})`));
