// Servidor estático mínimo para producción (Railway) y para jugar en local. Sin dependencias.
// Solo sirve los archivos del juego; el resto del repositorio (tests, docs, dev) no se publica.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PORT) || 8080;
const PUBLIC = [/^\/index\.html$/, /^\/manifest\.webmanifest$/, /^\/sw\.js$/, /^\/(css|js|icons)\/[\w.-]+$/];
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
};

createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const path = normalize(decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
  if (!['GET', 'HEAD'].includes(req.method) || !PUBLIC.some((re) => re.test(path))) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No encontrado');
    return;
  }
  try {
    const body = await readFile(join(ROOT, path));
    res.writeHead(200, {
      'Content-Type': TYPES[extname(path)] ?? 'application/octet-stream',
      // Sin huellas en los nombres de archivo: el navegador revalida siempre (respuesta 304 barata).
      'Cache-Control': path.startsWith('/icons/') ? 'public, max-age=86400' : 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('No encontrado');
  }
}).listen(PORT, () => console.log(`Pío en http://localhost:${PORT}`));
