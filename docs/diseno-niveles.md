# Diseño de Pío: niveles, reglas y por qué

Este documento conecta cada decisión del juego con la investigación de
[investigacion-pedagogia.md](investigacion-pedagogia.md) (pedagogía y ciencia del aprendizaje) y de
[investigacion-noteworks.md](investigacion-noteworks.md) (inventario de funciones de Noteworks y Noteworks Lite).
Los parámetros viven en [js/curriculum.js](../js/curriculum.js) y [js/game.js](../js/game.js).

## La mecánica

Los pájaros son notas: su cuerpo es una cabeza de nota negra real (glifo SMuFL de Bravura), así que
la posición vertical se lee igual que en una partitura. Pico, ojo y cola son adornos horizontales que se
pueden quitar en Ajustes («Notas clásicas»).

Entran por la derecha, se posan en los cables y caminan hacia la clave. Siempre se responde al primero
de la fila, que lleva un halo amarillo. Se responde con botones de nombre (Do Re Mi, C D E o alemán con
H), con un piano de una octava o con un teclado MIDI.

## Cómo es un nivel

| Fase | Qué pasa | Por qué |
|---|---|---|
| Lección | Antes de jugar, los pájaros nuevos llegan volando al pentagrama con su nombre y su sonido, con su línea o espacio resaltado, y 1–3 frases explican el concepto | Petición expresa: cada nivel explica lo nuevo de forma breve e integrada en el juego |
| Pruébalo | 3–4 preguntas sobre lo nuevo, con el mismo teclado de la partida; si falla, ve la respuesta | Práctica de recuperación inmediata y feedback con la respuesta correcta (§ 1.3, § 2.4) |
| Calentamiento | Las 5 primeras notas llegan de una en una y esperan (sin tiempo) | «Al empezar un nivel, sin tiempo» (§ 0, § 2.5) |
| Presentación | La primera vez que sale cada nota nueva viene con su nombre y no cuenta | Aprendizaje sin errores en la primera exposición |
| Desafío | Los pájaros llegan en fila; si alcanzan la clave, escapan (fallo) | Límite por nota que baja de 4 s a 1,8 s a lo largo del currículo (Galvão, § 1.2) |
| Rescate | Al terminar, vuelven uno a uno los pájaros fallados para nombrarlos bien | Noteworks hace lo mismo (la lluvia que apaga las notas quemadas) y es corrección inmediata |

**Sin vidas.** La ronda siempre termina: el informe desaconseja «vidas que bloquean la práctica» (§ 2.6)
y Noteworks tampoco tiene vidas. La tensión la ponen las estrellas que se apagan en el marcador cuando los
fallos ya no permiten conseguirlas.

**Estrellas** (con el objetivo de tiempo ajustado por ritmo y modo de respuesta):

- ★ precisión ≥ 90 % a la primera (92 % en los niveles «desafío»): abre el siguiente nivel (§ 2.2).
- ★★ y mediana de respuesta ≤ objetivo × 1,3.
- ★★★ precisión ≥ 95 % y mediana ≤ objetivo.

**Tras un fallo:** nombre correcto sobre el pájaro, nota guía más cercana dibujada en verde junto a él,
suena la nota correcta y su botón parpadea (§ 2.4). La nota vuelve a salir a los 2–3 turnos y a los 6–8, y
la nota con la que se confundió sale en medio (§ 2.3). Se guarda la confusión para mostrarla en Progreso
(§ 2.7).

## Ritmo según la edad

Al crear el jugador se elige la edad, que fija el multiplicador de tiempo (§ 0, evidencia débil):
5–7 años ×1,8 · 8–10 ×1,5 · 11–13 ×1,25 · adulto ×1. Multiplica el tiempo para cruzar, el intervalo
entre pájaros y el objetivo de las estrellas. Con el piano se añade ×1,2. Se puede cambiar en Ajustes.

## Repaso espaciado

Cada nota en cada clave es una tarjeta con su historial (últimas 10 respuestas, últimos 8 tiempos,
confusiones). Dentro de una partida, la elección es aleatoria ponderada: más peso a lo que se falla, a lo
lento y a lo nuevo, y nunca la misma nota dos veces seguidas. Entre sesiones, cajas de Leitner con
intervalos de 0, 1, 2, 4, 8, 16 y 32 días: sube de caja si la sesión fue perfecta y rápida, se queda si
fue correcta pero lenta, vuelve a la 1 si baja del 75 % (§ 2.3). La pantalla «Repaso» junta las vencidas.

## Currículo

Ruta principal (37 niveles), en el orden del informe (§ 2.1 y § 2.8):

| Mundo | Niveles | Contenido |
|---|---|---|
| Primeros pasos | p1 | ¿Línea o espacio? (dos botones) |
| Clave de sol: primera octava | sol-1 … sol-5 | Do4 y Sol4 (guías), +2 notas por nivel hasta Do5; desafío |
| Clave de fa: primera octava | fa-1 … fa-5 | Fa3 y Do4 (guías), hasta Do3; desafío |
| Clave de sol: todo el pentagrama | sol-6 … sol-8 | Hasta Sol5; desafío |
| Clave de fa: todo el pentagrama | fa-6 … fa-8 | Hasta Fa2; desafío |
| Gran pentagrama | gran-1, gran-2 | Guías en las dos claves; alternancia de claves |
| Líneas adicionales | sol-9, fa-9, gran-3, sol-10, sol-11, fa-10, gran-4 | Por las guías Do6 y Do2; zona central en dos escrituras; máximo 2 líneas |
| Sostenidos y bemoles | alt-1 … alt-5 | Fa♯ y Si♭ primero; becuadro; clave de fa; enarmonías |
| Armaduras | arm-1 … arm-4 | 1 a 4 alteraciones, alternando ♯ y ♭ dentro del nivel; notas afectadas al ~35 % |
| Gran final | gran-5, arm-5 | Do2–Do6 a 1,3 s; armaduras mezcladas que cambian cada 10 notas |

Mundos opcionales (18 niveles): clave de do en 3.ª para viola (alto-1 … alto-7, se abre tras sol-5),
clave de do en 4.ª (tenor-1 … tenor-6, tras fa-8) y expertos (3 líneas adicionales, Mi♯/Si♯/Do♭/Fa♭,
armaduras de 5 a 7).

Diferencias con la tabla del informe:

- **P2 («¿sube o baja?»)** queda para una versión siguiente; necesita comparar dos pájaros a la vez.
- **K1–K4** se juegan con las dos armaduras en el mismo nivel (cambio a mitad), en vez de dos niveles.
- Rondas de 20 notas (30 en los desafíos) en lugar de 30; la consolidación entre días la hace el repaso.
- **G5** pasa al mundo final, junto a las armaduras mezcladas, para que llegue con más práctica.

## Funciones frente a Noteworks

| Noteworks (completo) | Pío |
|---|---|
| Notas que avanzan de derecha a izquierda; la actual, en azul | Igual, con halo amarillo; además hay un calentamiento sin prisa |
| Piano, letras (4 órdenes, alemán con H), Do-Re-Mi fijo, guitarra, MIDI | Botones Do-Re-Mi, C D E y alemán; piano; MIDI. Guitarra y Do móvil: pendiente |
| Lenta, media, rápida y sin límite (solo iPhone) | 5 ritmos ligados a la edad, niveles sin prisa y práctica sin fin |
| Modo con ayuda (tecla iluminada, sin puntos) | «Practicar con ayuda» en cada nivel |
| Puntos, bonus por velocidad, 3 estrellas | Igual, más combo y medidor de estrellas en directo |
| Lluvia final para repetir las notas falladas | Ronda de rescate |
| Sol, fa, do en 3.ª y 4.ª, gran pentagrama (solo iPad) | Todas, en todas las pantallas |
| Rango, alteraciones, 14 armaduras; 21 niveles | 55 niveles, práctica libre con rango, alteraciones y 15 armaduras |
| Perfiles ilimitados | Perfiles ilimitados con edad, color y ajustes propios |
| Tablas de notas de cada clave | «Tablas de notas» con notas guía resaltadas y sonido |
| Envío al profesor (portal) | Resumen para compartir y copia de seguridad en archivo |
| — (críticas de profesores) | Teclas grandes, nombre tras el error, lecciones, repaso espaciado, más líneas adicionales |

## Versión 2: teoría, piano exacto, ritmo automático y sincronización

**Teoría musical** (docs/investigacion-teoria.md): 12 mundos y 50 niveles de Lenguaje Musical de
enseñanzas elementales (figuras y silencios, compás, expresión, sube/baja y melodías, intervalos con su
número y su calidad, tonos y semitonos, grados, acordes, armaduras y escalas, compases compuestos y un gran
repaso). El camino tiene dos pestañas (Leer notas y Teoría) y «Seguir» recorre una ruta que intercala las
dos según el § 5.2 de la investigación. Los tipos de pregunta están en [js/theory.js](../js/theory.js):

- En el cable caminan las notas, las parejas (intervalos, tono/semitono, sube/baja), las tríadas y las
  figuras (sobre una sola línea, como en la lectura rítmica del conservatorio).
- En cartel, sin prisa: compases, ritmos con nombre, símbolos y términos, armaduras, escalas, grados y
  melodías (se leen nota a nota con el teclado de notas).
- Cada pregunta trae su explicación: tras un fallo aparece la respuesta y la regla aplicada a esa pregunta
  (feedback explicativo, mejor que solo la respuesta según la investigación).
- Los botones salen de los errores típicos (p. ej. «Sol♯ mayor» como trampa del último sostenido).

**Piano con octava exacta** desde el gran pentagrama (o siempre/nunca, en Ajustes): teclado de varias
octavas que se desplaza, centrado en el Do central; el objetivo de tiempo se multiplica por 1,3.

**Consolidación y ritmo automático:** un nivel queda consolidado al superarlo en dos días distintos (sello
verde en el mapa). Con «Ritmo automático», tras cada partida con tiempo el ritmo se acelera un 7 % si
acierta ≥ 92 % muy por debajo del objetivo y se frena un 8 % si baja del 80 %.

**Guardar y sincronizar:** la partida se guarda sola y se puede continuar otro día o en otro dispositivo
con un código familiar (sin cuentas). El servidor fusiona los datos sin perder nada (js/merge.js).

**Pruebas de nivel** (docs/investigacion-teoria.md § 2.2): cada mundo con más de un nivel tiene, en el
Camino, una prueba de 8 preguntas mezcladas, elegidas sobre todo de sus últimos niveles. Se ofrece desde el
principio en todo mundo sin terminar, aunque esté cerrado (el inicio enlaza a ellas mientras empieza). Con 7 aciertos o más, todos sus niveles quedan superados con una
estrella (y abren lo que venga después); si no, se recomienda empezar por su primer nivel. En los mundos de
lectura con varias claves se usa el gran pentagrama, y en los de armaduras la prueba cambia de armadura por
tramos. Las melodías y la respuesta en dos toques quedan fuera de la prueba.

**Canciones** (docs/investigacion-canciones.md): 64 comienzos de canciones conocidas (pop, rock, cine,
series y videojuegos), como mucho 8 notas cada uno. Se usan sin romper la regla principal: primero se lee
y después se descubre la canción, porque si se reconoce antes se toca de memoria en vez de leer.

- Lección de cada nivel de lectura: una canción escrita con las notas del nivel (transportada); se lee y,
  al escucharla, se descubre cuál es.
- Canción secreta al final de cada nivel de lectura: se leen sus notas en orden y al acabar se revela,
  suena y da 10 de alpiste. No cuenta para las estrellas.
- Melodías cortas: comienzos de canciones en Do4-Do5 (se dice cuál era al terminar cada una).
- Teoría: canciones que empiezan con cada intervalo (lección y explicación tras un fallo) y canciones
  de ejemplo para compases y ritmos.
- Los ejercicios con notas al azar siguen siendo el núcleo; las canciones son un añadido.
