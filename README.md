# Pío · lectura de notas

Juego web para móvil para aprender a leer notas en el pentagrama. Las notas son pájaros que se posan
en los cables (las líneas) y caminan hacia la clave: hay que nombrarlos tocando la pantalla antes de que
lleguen. Funciona sin instalar nada, también sin conexión (PWA), en vertical y en horizontal.

## Jugar en local

```sh
npm start            # sirve la carpeta en http://localhost:8080
npm test             # tests del modelo musical, el algoritmo adaptativo y el currículo
```

Para probar en el móvil, abre `http://<IP-de-tu-ordenador>:8080` en la misma wifi (el sonido arranca con
el primer toque). Para ver el juego en marcos de móvil desde el ordenador: `dev/movil.html`.

No hay dependencias ni paso de compilación: HTML, CSS y módulos de JavaScript. `server.js` es un
servidor estático mínimo (Node ≥ 18) que solo publica los archivos del juego.

## Publicar

En producción en Railway (proyecto `pio-notas`, servicio `pio`): https://pios.up.railway.app

Cada push a `main` en [github.com/kanedaki/pio-notas](https://github.com/kanedaki/pio-notas) despliega
solo en Railway; GitHub Actions pasa los tests en cada push y pull request. Para desplegar sin hacer
commit (por ejemplo, probar algo): `railway up --service pio --detach`.

Al cambiar archivos del juego, sube `VERSION` en `sw.js` para que los móviles que lo tienen instalado
descarguen la versión nueva.

## Qué incluye

- **Leer notas:** 42 niveles en clave de sol, clave de fa y gran pentagrama, líneas adicionales,
  alteraciones y armaduras (y un mundo opcional para expertas).
- **Teoría musical:** 50 niveles de Lenguaje Musical de enseñanzas elementales: figuras y silencios,
  compases, matices y signos, intervalos (número y calidad), tonos y semitonos, grados, acordes,
  armaduras y escalas, compases compuestos. «Seguir» intercala lectura y teoría.
- Cada nivel empieza con una lección corta (lo nuevo, dibujado y con sonido) y una prueba; tras cada fallo
  se ve la respuesta y la regla que la explica.
- Respuesta con botones (Do Re Mi, C D E o alemán), piano (con la octava exacta desde el gran pentagrama)
  o teclado MIDI.
- Algoritmo adaptativo, repaso espaciado de notas y de teoría, niveles consolidados al superarlos en dos
  días, ritmo automático y ritmo según la edad.
- Partida guardada y sincronización entre dispositivos con un código familiar.
- Canciones conocidas: canción secreta al final de cada nivel, canciones con las notas de cada lección
  y canciones para recordar intervalos y ritmos (solo el comienzo de cada una).
- Su pájaro: temas de colores, colores y complementos que se compran con alpiste (se gana jugando),
  logros, reto del día y música de fondo en los menús.
- Accesibilidad: letra grande, contraste alto, avisos para lectores de pantalla y «reducir movimiento».

## Documentación

- [docs/investigacion-noteworks.md](docs/investigacion-noteworks.md): inventario de Noteworks y Noteworks Lite.
- [docs/investigacion-pedagogia.md](docs/investigacion-pedagogia.md): buenas prácticas para aprender a leer notas.
- [docs/investigacion-teoria.md](docs/investigacion-teoria.md): currículo de teoría (Lenguaje Musical) y errores típicos.
- [docs/diseno-niveles.md](docs/diseno-niveles.md): reglas del juego y currículo, con el porqué de cada decisión.
- [docs/investigacion-canciones.md](docs/investigacion-canciones.md): canciones elegidas, verificación y cómo usarlas sin dejar de leer.
- [docs/backlog.md](docs/backlog.md): lo que queda para más adelante.

## Estructura

| Archivo | Qué hace |
|---|---|
| `js/music.js` | Notas, claves, posiciones, armaduras y nombres |
| `js/curriculum.js` | Mundos de lectura, ruta, construcción de niveles, práctica y repasos |
| `js/curriculum-theory.js` | Mundos y niveles de teoría con sus lecciones |
| `js/theory.js` | Generadores de preguntas de teoría |
| `js/notation.js`, `js/boards.js` | Dibujo de figuras, compases y carteles de teoría |
| `js/look.js`, `js/rewards.js` | Temas, complementos, alpiste, logros y reto del día |
| `js/songs.js`, `js/songs-data.js` | Canciones: transporte a las notas del nivel, intervalos y ritmos |
| `js/merge.js`, `js/sync.js` | Fusión de datos y sincronización entre dispositivos |
| `js/adaptive.js` | Selección ponderada, refuerzo tras error y cajas de Leitner |
| `js/game.js` | Motor de la partida |
| `js/staff.js` | Dibujo SVG del pentagrama y de los pájaros |
| `js/input.js` | Botones, piano y teclado físico |
| `js/audio.js` | Piano y efectos sintetizados con Web Audio |
| `js/store.js` | Jugadores y progreso en el navegador |
| `js/main.js` | Pantallas y navegación |

Glifos musicales: [Bravura](https://github.com/steinbergmedia/bravura) (SIL Open Font License,
ver `docs/OFL-Bravura.txt`), convertidos a trazados SVG en `js/glyphs.js`.
