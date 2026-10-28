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

- 55 niveles en 13 mundos, de «¿línea o espacio?» a armaduras de 7 alteraciones, con claves de sol, fa,
  do en 3.ª y do en 4.ª y gran pentagrama. Cada nivel empieza con una lección corta (los pájaros nuevos
  llegan con su nombre y su sonido) y una prueba de 3–4 preguntas.
- Respuesta con botones (Do Re Mi, C D E o alemán con H), piano de una octava o teclado MIDI.
- Algoritmo adaptativo: más práctica de lo que se falla y de lo lento, refuerzo a los pocos turnos tras un
  error, repaso espaciado entre días (cajas de Leitner) y registro de con qué nota se confunde cada una.
- Ritmo ajustado a la edad, modo con ayuda, práctica libre (clave, líneas adicionales, alteraciones,
  armadura, velocidad, sin fin), tablas de notas, progreso por nota, varios jugadores, resumen para el
  profe y copia de seguridad.

## Documentación

- [docs/investigacion-noteworks.md](docs/investigacion-noteworks.md): inventario de Noteworks y Noteworks Lite.
- [docs/investigacion-pedagogia.md](docs/investigacion-pedagogia.md): buenas prácticas para aprender a leer notas.
- [docs/diseno-niveles.md](docs/diseno-niveles.md): reglas del juego y currículo, con el porqué de cada decisión.

## Estructura

| Archivo | Qué hace |
|---|---|
| `js/music.js` | Notas, claves, posiciones, armaduras y nombres |
| `js/curriculum.js` | Mundos, niveles, lecciones, práctica libre y repaso |
| `js/adaptive.js` | Selección ponderada, refuerzo tras error y cajas de Leitner |
| `js/game.js` | Motor de la partida |
| `js/staff.js` | Dibujo SVG del pentagrama y de los pájaros |
| `js/input.js` | Botones, piano y teclado físico |
| `js/audio.js` | Piano y efectos sintetizados con Web Audio |
| `js/store.js` | Jugadores y progreso en el navegador |
| `js/main.js` | Pantallas y navegación |

Glifos musicales: [Bravura](https://github.com/steinbergmedia/bravura) (SIL Open Font License,
ver `docs/OFL-Bravura.txt`), convertidos a trazados SVG en `js/glyphs.js`.
