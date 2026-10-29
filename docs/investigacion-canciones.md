# Investigación: canciones conocidas en Pío

Este informe justifica cómo usa Pío canciones conocidas (pop, rock, bandas sonoras, videojuegos y piezas de
dominio público) para enseñar a leer notas y teoría, y documenta cómo se verificó cada gancho de
[js/songs-data.js](../js/songs-data.js). Complementa a [investigacion-pedagogia.md](investigacion-pedagogia.md)
(recuperación, espaciado, intercalado, lectura multi-tonalidad) y a [investigacion-teoria.md](investigacion-teoria.md)
(intervalos, compases y figuras de Lenguaje Musical); lo que ya está justificado allí no se repite.

**Fecha:** 29-10-2026.

## Cómo leer este informe

- Las referencias entre corchetes ([P1], [P2]…) remiten a la lista de **Fuentes** del final. Las fuentes de cada
  canción están en su fila de las tablas del § 4.
- Etiquetas de evidencia, como en los otros informes:
  - **[Fuerte]**: metaanálisis o varios estudios sólidos coinciden.
  - **[Moderada]**: un estudio fiable o varios de calidad media, o un método docente muy asentado.
  - **[Débil]**: experiencia docente, fuentes divulgativas, tesis sin resultados visibles o inferencia mía.
  - **[Diseño]**: propuesta nuestra a partir de lo anterior; conviene comprobarla con el uso.
- Notas en Do fijo y octava científica (Do4 = Do central). Intervalos con la notación del juego: número + calidad
  (2m, 3M, 4J, 4A…).
- **Derechos de autor.** El repositorio es público: de cada canción se guarda solo el comienzo de un riff o de una
  frase (como mucho 8 notas), nunca la melodía entera ni la letra. Títulos y artistas sí.

---

## 0. Resumen

1. **Para qué sirven las canciones.** Motivan y conectan el símbolo con un sonido que la alumna ya tiene en la
   cabeza («sonido antes que símbolo»). También sirven para recordar cómo suena un intervalo o un ritmo [P1][P4][P9].
   La evidencia de que las «canciones de referencia» enseñan intervalos por sí solas es **débil**: se usan mucho,
   pero no hay un estudio que aísle su efecto [P10][P11][P12].
2. **El riesgo principal.** Si reconoce la canción, puede tocarla de memoria o adivinarla de oído en vez de leerla.
   Entonces el juego mide memoria, no lectura. La lectura a primera vista se practica con material que no conoce, y
   memorizar y leer son habilidades distintas [P15][P16][P17].
3. **Reglas** (§ 2): la canción es un premio que se descubre **después** de leer («canción secreta»), siempre
   transportada a las notas del nivel; el núcleo de la lectura sigue siendo material desconocido; en teoría, la
   canción llega después de contar el intervalo o el ritmo, como ayuda para recordarlo.
4. **Datos.** 64 ganchos verificados:
   - 27 de pop internacional, 11 de pop en español, 8 de rock;
   - 11 de cine, series y musicales, 2 de videojuegos, 2 de clásica y 3 tradicionales.

   De ellos, 55 tienen confianza alta y 9 media. Se dio prioridad a canciones y artistas actuales muy escuchados
   por chicas de 12 años en España (KPop Demon Hunters, Vaiana, Dua Lipa, Shakira, Sia, Taylor Swift, Coldplay,
   Imagine Dragons…), que son más de la mitad de la lista. Rock y clásicos completan la variedad.
5. **Intervalos.** Hay una canción que empieza con cada uno de los 12 intervalos ascendentes, de la 2m a la 8J
   (36 entradas en total). Faltan ejemplos descendentes de 4A, 6M, 7m, 7M y 8J: no hay canciones famosas que empiecen así.
6. **Ritmo.** Hay ejemplos de 3/4, 3/8, 4/4, 6/8, 12/8, anacrusa, síncopa, contratiempo, tresillo, corcheas,
   semicorcheas, negras, blancas y puntillo. **No hay ejemplo verificado de 2/4.**

---

## 1. Qué dice la evidencia

### 1.1 A favor: motivación y «sonido antes que símbolo»

- **Kodály.** Se trabaja primero el sonido con canciones, juegos y movimiento («preparar»), luego se le pone nombre
  y símbolo («presentar») y por último se practica en canciones nuevas [P2][P3]. Houlahan y Tacka proponen leer
  en el pentagrama canciones **conocidas** antes de empezar a leer a primera vista repertorio nuevo [P1].
  **[Moderada]**: es un método muy asentado, pero con poca evidencia experimental directa.
- **Gordon (Music Learning Theory).** Su principio es «el sonido antes que el signo»: leer notación sin haber oído
  antes el sonido deja a la notación un significado solo teórico [P4][P5]. **[Débil]-[Moderada]**: es una teoría con
  apoyo docente amplio y pocos experimentos controlados.
- **Oír la partitura por dentro.** En los estudios de Brodsky, músicos expertos leen en silencio una partitura con
  un tema famoso escondido entre adornos y después dicen si una melodía que oyen es ese tema [P6][P7]. Reconocer una
  canción conocida en el pentagrama ejercita justo esa imagen auditiva, que es lo que pide la «canción secreta».
  Pero es difícil incluso para expertos: en uno de los estudios solo uno de cada tres músicos con formación
  avanzada lo lograba [P7]. **[Moderada]**.
- **Tocar de oído y leer van juntos.** En un análisis de rutas con alumnos de instrumento, tocar de oído influía en
  la capacidad de leer a primera vista [P8]. **[Moderada]**.
- **Lo que mejora la lectura a primera vista.** Un metaanálisis de 92 estudios halló un efecto global pequeño de
  los tratamientos (d = 0,18). Funcionaban mejor el entrenamiento auditivo, la lectura controlada, las actividades
  creativas y el canto con solfeo [P9]. **[Fuerte]** para «el oído ayuda a leer»; no dice nada específico de
  canciones conocidas.
- **Motivación con música popular.** El enfoque de Lucy Green (aprender como los músicos de pop, con música que
  eligen los alumnos) se aplicó en Musical Futures. Su evaluación destaca la autonomía y la práctica como factores de
  éxito, con resultados en música por encima de la media nacional [P18][P19][P20]. **[Moderada]** para la
  motivación en clase; **[Débil]** para la lectura de notas, que no es lo que se medía.

### 1.2 Canciones para recordar intervalos

- **Uso muy extendido.** Hay tablas de «canciones de referencia» en la mayoría de los métodos de educación auditiva
  (EarMaster, la tabla de Wikipedia) [P12][P13].
- **Evidencia sobre su eficacia: débil.**
  - Wong, Chen y Lim (2021) enseñaron seis intervalos melódicos a principiantes. Con canciones de referencia y
    canto, practicar los intervalos por bloques o intercalados daba lo mismo; sin esas ayudas, intercalar era
    claramente mejor [P10]. El estudio no aísla el efecto de las canciones.
  - Una tesis de máster comparó un grupo con canciones familiares y otro sin ellas (60 por grupo), pero no he podido
    ver sus resultados [P11].
  - **[Débil]**.
- **Limitaciones conocidas** [P12][P14][P21]. **[Débil]**, porque vienen de fuentes divulgativas.
  - Cada canción fija unos grados concretos de la escala: «Cumpleaños feliz» enseña la 2M Sol-La en Do mayor, no
    cualquier 2M.
  - Casi todas las canciones famosas dan intervalos ascendentes, y un intervalo descendente no suena como el
    ascendente al revés.
  - Las canciones son una rampa de entrada; los músicos con experiencia oyen la función de cada nota en la
    tonalidad.

### 1.3 El riesgo: tocar de memoria en vez de leer

- **Definición.** Leer a primera vista es leer música que no se ha visto ni practicado. Con piezas conocidas es más
  fácil al principio, pero después hay que pasar a material nuevo [P15]. **[Débil]**.
- **Memoria y lectura son habilidades distintas.**
  - En un estudio con 11 pianistas, los errores al leer a primera vista no se correlacionaban con los errores al
    tocar de memoria [P16].
  - Una tesis con estudiantes de piano universitarios encontró que memorizaban mejor de lo que leían a primera vista
    [P17].
  - **[Moderada]**-**[Débil]**: las muestras son pequeñas.
- **Consecuencia para Pío.** Si la canción se anuncia antes, la alumna puede reconstruirla de oído (o con la mano,
  en el piano) sin leer el pentagrama, y su acierto ya no dice si sabe leer esas notas. **[Diseño]**, a partir
  de lo anterior.

---

## 2. Reglas para el juego

1. **El núcleo de la lectura sigue siendo material desconocido.** Las rondas normales (notas al azar, melodías
   generadas) no cambian. Las canciones son un extra: como mucho una por ronda o por nivel. **[Diseño]** (§ 1.3).
2. **«Canción secreta».** El fragmento se muestra en el pentagrama sin título, sin sonido y sin pista de ritmo. Solo
   cuando lo ha leído (o tocado) bien aparece «¡Era el comienzo de…!» y suena. Así se aprovecha la motivación y la
   imagen auditiva sin que la memoria sustituya a la lectura. **[Diseño]** (§ 1.1, § 1.3).
3. **Siempre transportada.** El gancho se transporta exactamente a las notas del nivel, con los mismos intervalos
   (como hace `fitHook` en `js/songs.js`), y conviene variar la tonalidad entre apariciones. Así no puede tirar de
   «dónde estaba en el piano», y practica la lectura por intervalos y en varias tonalidades
   ([investigacion-pedagogia.md](investigacion-pedagogia.md)). **[Diseño]**.
4. **Una canción ya descubierta cuenta como repaso, no como lectura nueva.** No se repite en la misma sesión. Si
   vuelve otro día, lo hace en otra tonalidad. **[Diseño]**.
5. **Intervalos: primero contar, después la canción.**
   - La receta de [investigacion-teoria.md](investigacion-teoria.md) va primero: contar las notas y luego mirar
     tonos y semitonos.
   - La canción llega después de responder, como ayuda para recordar: «la 4.ª justa ascendente es el comienzo de…».
   - Se usa en el sentido correcto (ascendente o descendente). Si no hay ejemplo en ese sentido, el juego no inventa
     uno y puede decirlo.
   - Conviene ofrecer más de una canción por intervalo y en tonalidades distintas, para que no se quede pegada a
     unos grados concretos (§ 1.2).
   - **[Débil]** para la eficacia; **[Diseño]** para el orden.
6. **Ritmo y compás: sonido, después símbolo.** En la lección se oye el gancho, luego se ve escrito y luego se
   cuenta (por ejemplo, la síncopa corchea-negra-corchea de «Cool Kids»). **[Moderada]** (Kodály, Gordon) y
   **[Diseño]** para el formato.
7. **Solo el comienzo y sin letra.** Como mucho 8 notas por canción. Es lo que permite tenerlas en un repositorio
   público. **[Diseño]**.
8. **Confianza.** Conviene usar primero las de confianza alta; las de media, como extra. Si alguien detecta una nota
   mal, se corrige el dato y se apunta aquí.
9. **Variedad.** Las canciones actuales que conoce motivan más, pero las clásicas (Star Wars, Para Elisa, Hey Jude…)
   son las que aparecen en los libros de Lenguaje Musical y en clase. Hay que mezclar las dos. **[Débil]**.

---

## 3. Cómo se verificó cada gancho

- **Fuente principal: Songsterr.** Sus transcripciones (de la comunidad) traen altura exacta (cuerda + traste +
  afinación) y ritmo, y tienen pistas de voz. Se leyeron con su API pública. Se detectaron errores puntuales: por
  ejemplo, la pista de trompeta de Star Wars pone Si♭ donde va Do. Por eso hace falta una segunda fuente.
- **Segundas fuentes:**
  - Piano Letter Notes y noobnotes: tutoriales que nombran las notas; Piano Letter Notes da también el ritmo por el
    espaciado. A menudo transportan la canción, a veces medio tono; se comparan los intervalos.
  - Partituras en LilyPond de Wikipedia.
  - Vistas previas legibles de partituras oficiales en Musicnotes.
  - Hooktheory, que da tonalidad, compás y tempo.
  - La tabla de intervalos de Wikipedia y EarMaster [P12][P13].
- **Confianza:**
  - **alta**: dos fuentes independientes coinciden en las alturas y el ritmo es coherente, o hay partitura publicada.
  - **media**: una sola fuente de notas fiable, con la tonalidad o el compás confirmados por otra.
  - Si no se pudo verificar, la canción se descartó (§ 8).
- **Normalización:**
  - **Tonalidad:** la original de la grabación, en sonido real. Excepciones:
    - Sweet Child O' Mine va en Re, la tonalidad escrita de las partituras; la grabación suena medio tono más
      grave.
    - Las piezas de dominio público van en la tonalidad de la partitura usada como fuente, salvo el Himno de la
      alegría, que va en el Re mayor de la 9.ª Sinfonía.
  - **Octava:** las voces masculinas y algunos riffs van una octava arriba, como en las partituras de piano. El juego
    transporta de todos modos.
  - **Sin ligaduras:** el formato no las admite, así que los fragmentos se cortan antes de una nota ligada. En Take On
    Me los valores van a la mitad, en proporción.
  - **Silencios:** ningún gancho empieza ni acaba con silencio. Si la frase entraba después de un silencio, ese
    silencio se quitó y la entrada se anotó como anacrusa (`pickup`, en negras).
- **Comprobación automática.** Un script carga `js/songs-data.js` y `js/music.js` y comprueba lo siguiente:
  - que cada gancho se puede leer, tiene de 3 a 8 notas y no empieza ni acaba en silencio;
  - que las dos primeras notas de cada entrada de `INTERVAL_SONGS` forman exactamente ese intervalo y en ese
    sentido;
  - que todos los ids existen;
  - que cada ejemplo de ritmo tiene la figura, el compás o la anacrusa que dice.

---

## 4. Canciones

«Empieza con» es el intervalo entre las dos primeras notas del gancho. En «Compás · anacrusa», la anacrusa va en
negras.

#### Pop internacional (27)

| id | Canción | Fragmento | Empieza con | Compás · anacrusa | Conf. | Fuentes |
|---|---|---|---|---|---|---|
| `golden` | Golden (HUNTR/X (KPop Demon Hunters), 2025) | preestribillo | 3m asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=2078031) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2025/07/golden-by-huntrx-kpop-demon-hunters.html) |
| `levitating` | Levitating (Dua Lipa, 2020) | estribillo (final de la primera frase) | 8J asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=6136927) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2020/10/levitating-by-dua-lipa.html) |
| `firework` | Firework (Katy Perry, 2010) | estribillo (primeras notas) | 8J asc | 4/4 · 2,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=72364) · [noobnotes.net](https://noobnotes.net/firework-katy-perry/) |
| `royals` | Royals (Lorde, 2013) | estribillo (primeras notas) | unísono | 4/4 · 1,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=477150) · [noobnotes.net](https://noobnotes.net/royals-lorde/) |
| `7-rings` | 7 rings (Ariana Grande, 2019) | estrofa (primeras notas) | 5J asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=3928915) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2019/02/7-rings-by-ariana-grande.html) |
| `good-4-u` | good 4 u (Olivia Rodrigo, 2021) | estrofa (primeras notas) | unísono | 4/4 · 3,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=487830) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2021/05/good-4-u-by-olivia-rodrigo.html) |
| `sweet-but-psycho` | Sweet but Psycho (Ava Max, 2018) | estribillo (primeras notas) | 6m desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=7458183) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2019/02/sweet-but-psycho-by-ava-max.html) |
| `cheap-thrills` | Cheap Thrills (Sia, 2016) | estribillo (primeras notas) | 4J asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=5398085) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/cheap-thrills-by-sia.html) |
| `chandelier` | Chandelier (Sia, 2014) | estribillo (final de la primera frase) | 2M desc | 4/4 · 2 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=4783988) · [noobnotes.net](https://noobnotes.net/chandelier-sia/) |
| `titanium` | Titanium (David Guetta ft. Sia, 2011) | estribillo (primeras notas) | 6m asc | 4/4 · 2,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=93136) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/titanium-by-david-guetta-ft-sia.html) |
| `shake-it-off` | Shake It Off (Taylor Swift, 2014) | estrofa (primeras notas) | 3m desc | 4/4 · 2 | alta | [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/shake-it-off-by-taylor-swift.html) · [noobnotes.net](https://noobnotes.net/shake-it-off-taylor-swift/) |
| `anti-hero` | Anti-Hero (Taylor Swift, 2022) | estrofa (primeras notas) | unísono | 4/4 · 3,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=613313) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2022/11/anti-hero-by-taylor-swift.html) |
| `blank-space` | Blank Space (Taylor Swift, 2014) | preestribillo | unísono | 4/4 · 3,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=5424635) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2018/04/blank-space-by-taylor-swift.html) |
| `cool-kids` | Cool Kids (Echosmith, 2013) | estribillo (frase del título) | unísono | 4/4 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=447077) · [hooktheory.com](https://www.hooktheory.com/theorytab/view/echosmith/cool-kids) |
| `complicated` | Complicated (Avril Lavigne, 2002) | estrofa (primeras notas) | 4J desc | 4/4 · 3,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=6735) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2024/05/complicated-by-avril-lavigne.html) |
| `shut-up-and-dance` | Shut Up and Dance (Walk the Moon, 2014) | estribillo (frase del título) | 3m desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=506018) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2022/06/shut-up-and-dance-by-walk-moon.html) |
| `cradles` | Cradles (Sub Urban, 2019) | riff (arpegio) | 3m asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=456807) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2019/07/cradles-by-sub-urban.html) |
| `clocks` | Clocks (Coldplay, 2002) | riff de piano | 4J desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=64435) · [piano-keyboard-guide.com](https://www.piano-keyboard-guide.com/how-to-play-clocks-by-coldplay-easy-piano-tutorial-chords-and-notes/) |
| `viva-la-vida` | Viva la Vida (Coldplay, 2008) | estrofa (primeras notas) | unísono | 4/4 · 2,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=10136) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/viva-la-vida-by-coldplay.html) |
| `a-sky-full-of-stars` | A Sky Full of Stars (Coldplay, 2014) | estrofa (frase del título) | 2m asc | 4/4 · 1,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=394751) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/11/a-sky-full-of-stars-by-coldplay.html) |
| `believer` | Believer (Imagine Dragons, 2017) | estrofa (primeras notas) | 5J asc | 12/8 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=435652) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/believer-by-imagine-dragons.html) |
| `around-the-world` | Around the World (Daft Punk, 1997) | línea de bajo | 2M desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=83791) · [melodics.com](https://melodics.com/blog/learn-how-to-play-around-the-world-on-piano-beginner-tutorial) |
| `get-lucky` | Get Lucky (Daft Punk ft. Pharrell Williams, 2013) | preestribillo (primeras notas) | 2m desc | 4/4 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=381654) · [en.wikipedia.org](https://en.wikipedia.org/wiki/Get_Lucky_(Daft_Punk_song)) |
| `one-more-time` | One More Time (Daft Punk, 2000) | voz (frase del título) | 2m desc | 4/4 · 2 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=32836) · [hooktheory.com](https://www.hooktheory.com/theorytab/view/daft-punk/one-more-time) |
| `take-on-me` | Take On Me (a-ha, 1985) | estribillo (primeras notas, valores a mitad de su duración) | 7M asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=357329) · [noobnotes.net](https://noobnotes.net/take-on-me-a-ha/) |
| `billie-jean` | Billie Jean (Michael Jackson, 1983) | línea de bajo | 4J desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=10586) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/11/billie-jean-by-michael-jackson.html) |
| `perfect` | Perfect (Ed Sheeran, 2017) | estribillo | 8J asc | 12/8 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=441137) · [noobnotes.net](https://noobnotes.net/perfect-ed-sheeran/) |

#### Pop en español (11)

| id | Canción | Fragmento | Empieza con | Compás · anacrusa | Conf. | Fuentes |
|---|---|---|---|---|---|---|
| `waka-waka` | Waka Waka (This Time for Africa) (Shakira, 2010) | estribillo (la frase del título) | unísono | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=61204) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/waka-waka-this-time-for-africa-by.html) |
| `bzrp-53-shakira` | Shakira: Bzrp Music Sessions, Vol. 53 (Bizarrap & Shakira, 2023) | riff de sintetizador (intro) | 2M asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=1933153) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2023/02/shakira-bzrp-music-sessions-53.html) |
| `dai-dai` | Dai Dai (Shakira & Burna Boy, 2026) | coro de la intro | 3m asc | 4/4 | alta | [musicnotes.com](https://www.musicnotes.com/sheetmusic/shakira-burna-boy/dai-dai-fifa-world-cup-2026/MN0310636) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=5335213) |
| `zoo` | Zoo (Zootopia 2) (Shakira, 2025) | motivo del título (intro) | 5J asc | 4/4 · 3,5 | alta | [musicnotes.com](https://www.musicnotes.com/sheetmusic/shakira/zoo/MN0306082) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=3156043) |
| `loba` | Loba (She Wolf) (Shakira, 2009) | línea descendente del estribillo | 2m desc | 4/4 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=3695231) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=7392940) |
| `mi-burrito-sabanero` | Mi burrito sabanero (David Bisbal (aguinaldo de Hugo Blanco), 2024) | primera frase de la estrofa | 4J asc | 4/4 · 1 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=567716) · [recursos.edu.xunta.gal](https://recursos.edu.xunta.gal/sites/default/files/recurso/1639064740/El_Burrito_Sabanero_no_lyrics.pdf) |
| `formentera` | Formentera (Aitana & Nicki Nicole, 2023) | frase vocal repetida | unísono | 4/4 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=3654129) · [musicnotes.com](https://www.musicnotes.com/sheetmusic/musichelp/formentera/MN0250652) |
| `carino` | Cariño (Arde Bogotá, 2021) | riff de guitarra | unísono | 4/4 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=725084) · [acordes.lacuerda.net](https://acordes.lacuerda.net/arde_bogota/carinio.shtml) |
| `despacito` | Despacito (Luis Fonsi ft. Daddy Yankee, 2017) | estribillo (primeras notas) | 2m desc | 4/4 · 2 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=435063) · [noobnotes.net](https://noobnotes.net/despacito-luis-fonsi-feat-justin-bieber/) |
| `dos-oruguitas` | Dos Oruguitas (Sebastián Yatra (Encanto), 2021) | primera frase cantada (estrofa) | 3m asc | 4/4 · 3,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=3833025) · [singing-bell.com](https://www.singing-bell.com/dos-oruguitas-piano-sheet-music-tutorial-notes-chords/) |
| `bailando` | Bailando (Enrique Iglesias ft. Descemer Bueno y Gente de Zona, 2014) | coro que repite el título (estribillo) | 4J asc | 4/4 · 3,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=416658) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/bailando-by-enrique-iglesias.html) |

#### Rock (8)

| id | Canción | Fragmento | Empieza con | Compás · anacrusa | Conf. | Fuentes |
|---|---|---|---|---|---|---|
| `radioactive` | Radioactive (Imagine Dragons, 2012) | estribillo (frase del título) | 7m asc | 4/4 · 1 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=381431) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/radioactive-by-imagine-dragons.html) |
| `smoke-on-the-water` | Smoke on the Water (Deep Purple, 1972) | riff de guitarra | 3m asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=329) · [thehighwaystar.com](https://thehighwaystar.com/rosas/tab/machine05.htm) |
| `seven-nation-army` | Seven Nation Army (The White Stripes, 2003) | riff de guitarra (con pedal de octava) | unísono | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=265) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/11/seven-nation-army-by-white-stripes.html) |
| `we-will-rock-you` | We Will Rock You (Queen, 1977) | estribillo (primeras notas) | 2m desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=16331) · [noobnotes.net](https://noobnotes.net/we-will-rock-you-queen/) |
| `hey-jude` | Hey Jude (The Beatles, 1968) | comienzo de la canción (voz) | 3m desc | 4/4 · 1 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=2573) · [noobnotes.net](https://noobnotes.net/hey-jude-the-beatles/) |
| `sweet-child-o-mine` | Sweet Child O' Mine (Guns N' Roses, 1987) | riff de guitarra | 8J asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=23) · [guitartabsexplorer.com](https://www.guitartabsexplorer.com/guns-n-roses/sweet-child-o-mine-tab) |
| `paint-it-black` | Paint It Black (The Rolling Stones, 1966) | melodía de la estrofa (voz y sitar) | 2M asc | 4/4 · 3 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=5) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2018/07/paint-it-black-by-rolling-stones.html) |
| `we-are-the-champions` | We Are the Champions (Queen, 1977) | estribillo (primeras notas) | 2m desc | 6/8 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=35507) · [noobnotes.net](https://noobnotes.net/we-are-the-champions-queen/) |

#### Cine, series y musicales (11)

| id | Canción | Fragmento | Empieza con | Compás · anacrusa | Conf. | Fuentes |
|---|---|---|---|---|---|---|
| `how-far-ill-go` | How Far I'll Go («¿Qué hay más allá?») (Vaiana (Moana), 2016) | estribillo (primeras notas) | 3M desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=5661464) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/how-far-ill-go-from-moana.html) |
| `where-you-are` | Where You Are (Vaiana (Moana), 2016) | comienzo de la canción | 6M asc | 4/4 · 0,5 | alta | [musicnotes.com](https://www.musicnotes.com/sheetmusic/moana/where-you-are/MN0170335) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=6714334) |
| `we-know-the-way` | We Know the Way (Vaiana (Moana), 2016) | grito del coro (estribillo) | unísono | 4/4 · 3,5 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=5689431) · [noobnotes.net](https://noobnotes.net/we-know-the-way-moana-disney/) |
| `a-million-dreams` | A Million Dreams (Ziv Zaifman, Hugh Jackman y Michelle Williams (El gran showman), 2017) | comienzo de la estrofa | unísono | 4/4 · 2,5 | alta | [musicnotes.com](https://www.musicnotes.com/sheetmusic/the-greatest-showman/a-million-dreams/MN0181027) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2018/01/a-million-dreams-greatest-showman.html) |
| `perfect-harmony` | Perfect Harmony (Madison Reyes y Charlie Gillespie (Julie and the Phantoms), 2020) | estribillo (primeras notas, voz aguda) | 5J asc | 4/4 · 2 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=3712484) · [musicnotes.com](https://www.musicnotes.com/sheetmusic/julie-and-the-phantoms/perfect-harmony/MN0222363) |
| `fright-song` | Fright Song (Monster High, 2010) | riff de sintetizador (intro) | 5J asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=7625063) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2026/04/fright-song-monster-high-theme-song.html) |
| `star-wars` | Star Wars (tema principal) (John Williams, 1977) | tema principal, desde la primera parte fuerte (sin el tresillo de anacrusa) | 5J asc | 4/4 | alta | [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2015/11/star-wars-main-theme.html) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=20562) |
| `hedwig` | El tema de Hedwig (Harry Potter) (John Williams, 2001) | tema de la celesta (comienzo) | 4J asc | 3/8 · 0,5 | alta | [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2015/11/hedwigs-theme-harry-potter.html) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=91340) |
| `los-simpson` | Los Simpson (sintonía) (Danny Elfman, 1989) | coro inicial (el título cantado) | 4A asc | 4/4 · 2 | alta | [en.wikipedia.org](https://en.wikipedia.org/wiki/The_Simpsons_Theme) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=12082) |
| `stranger-things` | Stranger Things (sintonía) (Kyle Dixon y Michael Stein, 2016) | arpegio de sintetizador | 3M asc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=435691) · [splice.com](https://splice.com/blog/recreating-stranger-things-theme) |
| `juego-de-tronos` | Juego de Tronos (tema principal) (Ramin Djawadi, 2011) | motivo principal (violonchelos) | 5J desc | 3/4 | media | [songsterr.com](https://www.songsterr.com/a/wa/song?id=436466) · [musicnotes.com](https://www.musicnotes.com/sheetmusic/game-of-thrones/game-of-thrones/MN0168678) |

#### Videojuegos (2)

| id | Canción | Fragmento | Empieza con | Compás · anacrusa | Conf. | Fuentes |
|---|---|---|---|---|---|---|
| `super-mario` | Super Mario Bros. (tema principal) (Koji Kondo, 1985) | comienzo del tema | unísono | 4/4 | alta | [en.wikipedia.org](https://en.wikipedia.org/wiki/Super_Mario_Bros._theme) · [songsterr.com](https://www.songsterr.com/a/wa/song?id=14064) |
| `tetris` | Tetris (tema A, Korobéiniki) (Popular rusa (arr. Hirokazu Tanaka), 1989) | comienzo del tema | 4J desc | 4/4 | alta | [songsterr.com](https://www.songsterr.com/a/wa/song?id=83633) · [pianoletternotes.blogspot.com](https://pianoletternotes.blogspot.com/2017/10/tetris-theme-by-korobeiniki.html) |

#### Clásica (2)

| id | Canción | Fragmento | Empieza con | Compás · anacrusa | Conf. | Fuentes |
|---|---|---|---|---|---|---|
| `himno-de-la-alegria` | Himno de la alegría (Ludwig van Beethoven, 1824) | primera frase del tema | unísono | 4/4 | alta | [en.wikipedia.org](https://en.wikipedia.org/wiki/Ode_to_Joy) · [imslp.org](https://imslp.org/wiki/Symphony_No.9,_Op.125_(Beethoven,_Ludwig_van)) |
| `para-elisa` | Para Elisa (Ludwig van Beethoven, 1810) | comienzo | 2m desc | 3/8 · 0,5 | alta | [en.wikipedia.org](https://en.wikipedia.org/wiki/F%C3%BCr_Elise) · [imslp.org](https://imslp.org/wiki/F%C3%BCr_Elise,_WoO_59_(Beethoven,_Ludwig_van)) |

#### Tradicionales y populares (3)

| id | Canción | Fragmento | Empieza con | Compás · anacrusa | Conf. | Fuentes |
|---|---|---|---|---|---|---|
| `cumpleanos-feliz` | Cumpleaños feliz (Mildred y Patty Hill, 1893) | primera frase | unísono | 3/4 · 1 | alta | [en.wikipedia.org](https://en.wikipedia.org/wiki/Happy_Birthday_to_You) · [en.wikipedia.org](https://en.wikipedia.org/wiki/Interval_recognition) |
| `estrellita` | Estrellita, ¿dónde estás? (Popular (Francia), 1761) | primera frase | unísono | 4/4 | alta | [en.wikipedia.org](https://en.wikipedia.org/wiki/Twinkle,_Twinkle,_Little_Star) · [en.wikipedia.org](https://en.wikipedia.org/wiki/Interval_recognition) |
| `jingle-bells` | Jingle Bells (James Lord Pierpont, 1857) | comienzo de la estrofa | 6M asc | 4/4 | alta | [noobnotes.net](https://noobnotes.net/jingle-bells-traditional/) · [en.wikipedia.org](https://en.wikipedia.org/wiki/Interval_recognition) |

---

## 5. Intervalos: canciones que empiezan con cada uno

Entre paréntesis, el id y las dos primeras notas tal como están guardadas (el juego las transporta). Primero van las
canciones actuales y después las clásicas.

| Intervalo | Ascendente | Descendente |
|---|---|---|
| 2.ª menor (semitono) | A Sky Full of Stars (`a-sky-full-of-stars`, Si♭3→Do♭4) | Loba (She Wolf) (`loba`, Re5→Do♯5); Despacito (`despacito`, Re5→Do♯5); Para Elisa (`para-elisa`, Mi5→Re♯5) |
| 2.ª mayor (tono) | Shakira: Bzrp Music Sessions, Vol. 53 (`bzrp-53-shakira`, Re4→Mi4); Paint It Black (`paint-it-black`, Mi4→Fa♯4) | Chandelier (`chandelier`, Si♭4→La♭4); Around the World (`around-the-world`, Fa♯3→Mi3) |
| 3.ª menor | Golden (`golden`, Mi4→Sol4); Cradles (`cradles`, Si♭4→Re♭5); Smoke on the Water (`smoke-on-the-water`, Sol4→Si♭4) | Shake It Off (`shake-it-off`, Re5→Si4); Shut Up and Dance (`shut-up-and-dance`, La♭4→Fa4); Hey Jude (`hey-jude`, Do4→La3) |
| 3.ª mayor | Stranger Things (sintonía) (`stranger-things`, Do3→Mi3) | How Far I'll Go (`how-far-ill-go`, Sol♯4→Mi4) |
| 4.ª justa | Cheap Thrills (`cheap-thrills`, Do♯4→Fa♯4); Mi burrito sabanero (`mi-burrito-sabanero`, Sol4→Do5); El tema de Hedwig (Harry Potter) (`hedwig`, Si3→Mi4) | Clocks (`clocks`, Mi♭5→Si♭4); Complicated (`complicated`, Fa4→Do4); Tetris (tema A, Korobéiniki) (`tetris`, Mi5→Si4) |
| 4.ª aumentada (tritono) | Los Simpson (sintonía) (`los-simpson`, Do4→Fa♯4) | — |
| 5.ª justa | Believer (`believer`, Si♭3→Fa4); Zoo (Zootopia 2) (`zoo`, La3→Mi4); Star Wars (tema principal) (`star-wars`, Si♭4→Fa5) | Juego de Tronos (tema principal) (`juego-de-tronos`, Sol4→Do4) |
| 6.ª menor | Titanium (`titanium`, Do4→La♭4) | Sweet but Psycho (`sweet-but-psycho`, Re♭5→Fa4) |
| 6.ª mayor | Where You Are (`where-you-are`, Si3→Sol♯4); Jingle Bells (`jingle-bells`, Re4→Si4) | — |
| 7.ª menor | Radioactive (`radioactive`, Si3→La4) | — |
| 7.ª mayor | Take On Me (`take-on-me`, La2→Sol♯3) | — |
| 8.ª justa | Firework (`firework`, Mi♭4→Mi♭5); Levitating (`levitating`, Si3→Si4); Sweet Child O' Mine (`sweet-child-o-mine`, Re4→Re5) | — |

**Clásicos que no entran en la tabla, y por qué:**

- **Tiburón (2m asc):** solo tiene dos alturas.
- **Cumpleaños feliz (2M asc) y Estrellita (5J asc):** el intervalo famoso está entre la 2.ª y la 3.ª nota, no al
  principio.
- **Over the Rainbow (8J asc):** no verificada.
- **The Final Countdown:** su 5J descendente está entre la 3.ª y la 4.ª nota.
- **Smoke on the Water:** el tritono está dentro del riff.
- **Perfect:** empieza con una 8J, pero con un silencio largo en medio.

---

## 6. Ritmo y compás

| Clave en RHYTHM_SONGS | Canciones |
|---|---|
| `3/4` (Compás 3/4) | Juego de Tronos (tema principal) (`juego-de-tronos`), Cumpleaños feliz (`cumpleanos-feliz`) |
| `3/8` (Compás 3/8) | El tema de Hedwig (Harry Potter) (`hedwig`), Para Elisa (`para-elisa`) |
| `4/4` (Compás 4/4) | Golden (`golden`), Levitating (`levitating`), Smoke on the Water (`smoke-on-the-water`) |
| `6/8` (Compás 6/8) | We Are the Champions (`we-are-the-champions`) |
| `12/8` (Compás 12/8) | Believer (`believer`), Perfect (`perfect`) |
| `anacrusa` (Anacrusa) | Firework (`firework`), Mi burrito sabanero (`mi-burrito-sabanero`), Hey Jude (`hey-jude`), El tema de Hedwig (Harry Potter) (`hedwig`), Cumpleaños feliz (`cumpleanos-feliz`) |
| `sincopa` (Síncopa) | Cool Kids (`cool-kids`), Shakira: Bzrp Music Sessions, Vol. 53 (`bzrp-53-shakira`), Loba (She Wolf) (`loba`), Sweet but Psycho (`sweet-but-psycho`), Seven Nation Army (`seven-nation-army`) |
| `contratiempo` (Contratiempo) | Super Mario Bros. (tema principal) (`super-mario`), Smoke on the Water (`smoke-on-the-water`), Get Lucky (`get-lucky`) |
| `tresillo` (Tresillo) | Star Wars (tema principal) (`star-wars`), 7 rings (`7-rings`), Fright Song (`fright-song`) |
| `corcheas` (Corcheas) | Billie Jean (`billie-jean`), Clocks (`clocks`), Cheap Thrills (`cheap-thrills`) |
| `semicorcheas` (Semicorcheas) | Para Elisa (`para-elisa`), Stranger Things (sintonía) (`stranger-things`), How Far I'll Go (`how-far-ill-go`) |
| `negras` (Negras) | Himno de la alegría (`himno-de-la-alegria`), Golden (`golden`), Cradles (`cradles`) |
| `blancas` (Blancas) | Star Wars (tema principal) (`star-wars`), Take On Me (`take-on-me`), Hey Jude (`hey-jude`) |
| `puntillo` (Puntillo) | Cumpleaños feliz (`cumpleanos-feliz`), El tema de Hedwig (Harry Potter) (`hedwig`), Mi burrito sabanero (`mi-burrito-sabanero`), Seven Nation Army (`seven-nation-army`) |

- La **síncopa** está comprobada en el gancho: una nota que empieza en parte débil y se alarga a la fuerte. Ejemplos:
  - Cool Kids: corchea-negra-corchea.
  - Bzrp 53: Fa-Do en corchea y negra.
  - Loba y Seven Nation Army.
  - Sweet but Psycho: corcheas con puntillo 3+3+2.
- El **contratiempo** también: un silencio en parte fuerte seguido de una nota en la débil.
- **Tresillo:**
  - Star Wars tiene corcheas de tresillo.
  - 7 rings tiene negras de tresillo (`/43`).
  - Fright Song tiene negra y corchea de tresillo (el «swing»).
- Dai Dai y Sweet but Psycho tienen el patrón 3+3+2 (el «tresillo cubano»), que **no** es un tresillo: se etiqueta
  como síncopa.

---

## 7. Huecos y dudas

- **2/4:** no hay ejemplo verificado.
  - El Can-can de Offenbach está en 2/4 según una edición para piano, pero sus transcripciones no coincidían en qué
    sección es la famosa.
  - Estrellita, Cumpleaños feliz y el Himno de la alegría aparecen en 4/4 o 3/4 en sus fuentes.
- **Intervalos descendentes sin ejemplo:** 4A, 6M, 7m, 7M y 8J. Los citados en las tablas habituales no encajan en
  la lista o no los conocerá: YYZ y Black Sabbath para el tritono; Nobody Knows the Trouble I've Seen para la 6M.
- **3M ascendente:** solo Stranger Things. No se encontró un pop actual verificado que empiece así.
- **Un silencio entre las dos primeras notas:** Shut Up and Dance (3m desc), Sweet but Psycho (6m desc) y
  Radioactive (7m asc). El intervalo es real, pero el motor debe tomar «las dos primeras notas sin contar silencios».
  En Radioactive, el Si3 es el final del «whoa» y el La4 empieza la frase del título.
- **Take On Me (7M):**
  - valores a la mitad para evitar ligaduras;
  - abarca 21 semitonos;
  - en la grabación cada sílaba dura un compás entero.
- **Ganchos de más de una octava** (en semitonos): Take On Me (21), Sweet Child O' Mine (17), Where You Are (17),
  Sweet but Psycho (15) y Golden (14). Caben en menos niveles de lectura.
- **Confianza media** (una sola fuente de notas): Chandelier, Cool Kids, Get Lucky, One More Time, Loba, Formentera,
  Cariño, Perfect Harmony y Juego de Tronos.
  - En Formentera no se pudo confirmar que la frase sea el estribillo.
  - Juego de Tronos aparece en 3/4 (Songsterr, Playground Sessions) y en 6/8 (Musicnotes, Skoove); se dejó en 3/4,
    que es como se agrupan sus figuras.
- **Tonalidades discutibles:**
  - Royals: Re mixolidio, escrito con un sostenido.
  - Sweet but Psycho: Re♭ mayor según la partitura; suena a Si♭ menor.
  - Radioactive: Si dórico, con tres sostenidos.
  - Stranger Things: Mi menor según Splice, Do mayor según Roland.
  - We Are the Champions: Fa mayor, la del estribillo; la canción empieza en Do menor.
  - Los Simpson: lidio de dominante, sin armadura.
- **Compás discutible:** Believer está en 12/8 según la partitura publicada y en 4/4 en Songsterr. Hooktheory da
  Golden en 12/8; aquí va en 4/4 porque sus negras suenan igual.
- **Variantes:**
  - Tetris: en Piano Letter Notes el Re lleva un adorno Mi-Re en semicorcheas.
  - Super Mario: escrito como en Wikipedia, en semicorcheas.
  - Star Wars: empieza en la primera parte fuerte, sin el tresillo de anacrusa, para que su 5J sea el primer
    intervalo.
- **Ganchos poco reconocibles por sí solos:**
  - Viva la Vida: cuatro Do repetidos.
  - We Know the Way y A Million Dreams: cuatro notas.
  - Formentera.

  Son útiles para leer, menos como «canción secreta».
- **Fechas y versiones:**
  - Dai Dai es la canción del Mundial de 2026.
  - De Mi burrito sabanero se usa la melodía tradicional (partitura escolar de la Xunta de Galicia); no se confirmó
    la tonalidad de la versión de Bisbal.

---

## 8. Canciones descartadas

Se descartaron por no poder verificarlas con el criterio del § 3, o porque su comienzo no cabe en el formato:

- **Sin una fuente de notas fiable, o con fuentes que no coinciden:**
  - One Kiss, Cold Heart, Roar, thank u next, Break Free, Party in the U.S.A., Let It Go (James Bay), Cruel Summer;
  - Beautiful Things, Birds of a Feather, Enemy, Flowers, bad guy;
  - You're Welcome, Shiny, Replay (Zendaya), Red (Los Descendientes), Wake Up (Julie and the Phantoms);
  - Mon Amour, Los Ángeles, Superestrella, Corazón sin vida y Lo malo (Aitana);
  - SloMo, Zorra, Esa diva, Morat, Zapatillas;
  - Los perros y Abajo (Arde Bogotá), Lady Madrid y Princesas (Pereza);
  - Quédate (Quevedo), Macarena, Hijo de la luna, Mi gente;
  - Demons (Songsterr y noobnotes no coinciden);
  - Thunder, Hymn for the Weekend.
- **Necesitan ligaduras o son casi todo una nota repetida:**
  - drivers license, vampire, Love Story, Die With a Smile, What Was I Made For?, Just the Way You Are, Green Light,
    Unstoppable;
  - Smells Like Teen Spirit, Wonderwall, Let It Be, Here Comes the Sun, It's My Life, Johnny B. Goode, Running Up
    That Hill, Africa, Don't Stop Believin', Satisfaction, Paradise, The Scientist, Yellow.
- **Otras razones:**
  - Yesterday: Songsterr empieza Fa-Fa-Fa en vez de Sol-Fa-Fa.
  - Eye of the Tiger y Thunderstruck: acordes o pedal de una sola nota.
  - Enter Sandman: la primera nota va ligada y el riff no tenía segunda fuente.
  - Yellow Submarine: grabación en Sol♭ por ralentizarla, y el estribillo pasa de 8 notas.
  - Nothing Else Matters: había que mover una nota de octava para que cupiera, y eso cambiaba el intervalo.
- **Verificadas pero fuera de la lista final, por equilibrio y para dar sitio a canciones más actuales:**
  - Shape of You, Blinding Lights, As It Was, Bad Romance, Espresso, el riff de Take On Me;
  - DtMF, Sofia, La camisa negra;
  - Iron Man, Starman, Livin' on a Prayer, Another One Bites the Dust, The Final Countdown, Harder Better Faster
    Stronger.

  Están en el material de trabajo y se pueden añadir.

---

## Fuentes

### Pedagogía y aprendizaje

- [P1] Houlahan, M. y Tacka, P. *Choral Sight-Reading* (leer canciones conocidas antes que repertorio nuevo).
  https://issuu.com/education_library/docs/23298
- [P2] «Prepare, Present, Practice: Developing Music Skills in Grades 2-4». https://lsnotes.d-e.org/?p=11310
- [P3] Método Kodály (Wikipedia). https://en.wikipedia.org/wiki/Kod%C3%A1ly_method
- [P4] Gordon, E. E. *Audiation* (ERIC ED380341). https://files.eric.ed.gov/fulltext/ED380341.pdf
- [P5] «Music Learning Theory in Collegiate Music Education», *College Music Symposium* 31.
  https://symposium.music.org/volume-31/forum-essays-1752877059/music-learning-theory-in-collegiate-music-education
- [P6] Brodsky, W. y Henik, A. (2003). Auditory imagery from musical notation in expert musicians. *Perception &
  Psychophysics*. https://pubmed.ncbi.nlm.nih.gov/12812282
- [P7] Brodsky, W., Kessler, Y., Rubinstein, B.-S., Ginsborg, J. y Henik, A. (2008). The mental representation of
  music notation: notational audiation. *JEP: Human Perception and Performance*.
  https://in.bgu.ac.il/humsos/art/DocLib/Pages/Scientific-Publications-warren/24_JEPHPP.pdf
- [P8] McPherson, G. E., Bailey, M. y Sinclair, K. E. (1997). Path analysis of a theoretical model to describe the
  relationship among five types of musical performance. *JRME*. https://journals.sagepub.com/doi/10.2307/3345469
- [P9] Mishra, J. (2014). Improving sightreading accuracy: a meta-analysis. *Psychology of Music* 42(2).
  https://journals.sagepub.com/doi/10.1177/0305735612463770
- [P10] Wong, S. S. H., Chen, S. y Lim, S. W. H. (2021). Learning melodic musical intervals: to block or to
  interleave? *Psychology of Music* 49(4). https://journals.sagepub.com/doi/10.1177/0305735620922595
- [P11] Anuar, N. L. (2015). *The effects of using familiar melodies in melodic interval identification in
  undergraduate music majors* (tesis de máster, Universiti Malaya). https://knova.um.edu.my/student_works_2010s/3035/
- [P12] «Interval recognition» (Wikipedia: tabla de canciones de referencia y sus límites).
  https://en.wikipedia.org/wiki/Interval_recognition
- [P13] EarMaster, «Songs to learn musical intervals».
  https://www.earmaster.com/products/free-tools/interval-song-chart-generator.html
- [P14] Music Theory Practice, «How to identify intervals by ear».
  https://music-theory-practice.com/guides/how-to-identify-intervals-by-ear
- [P15] *Fundamentals of Piano Practice*, «Sight reading».
  https://fundamentals-of-piano-practice.readthedocs.io/chapter1/ch1_topics/III.11.html
- [P16] The Violin Channel, «New study suggests sight reading ability does not help memorization ability».
  https://theviolinchannel.com/new-study-suggests-sight-reading-ability-does-not-help-memorization-ability/
- [P17] *Exploring memorisation and sight-reading and their inter-relationship in undergraduate piano students*
  (Universidad de Pretoria). https://repository.up.ac.za/handle/2263/65555
- [P18] Hallam, S. y Creech, A. Evaluación de Musical Futures (IOE, Research Briefing 16).
  https://discovery-pp.ucl.ac.uk/id/eprint/10018639/2/RB16_Musical_Futures_Hallam_Creech.pdf
- [P19] Green, L. (2008). *Music, Informal Learning and the School: A New Classroom Pedagogy*. Ashgate.
  https://www.routledge.com/products/isbn/9780754665229
- [P20] Musical Futures, «Our history». https://www.musicalfutures.org/history/
- [P21] Chromatone, «Reference songs» (sesgo ascendente). https://chromatone.center/theory/notes/ear-traning/reference-songs

### Fuentes de notas más usadas

- Songsterr (transcripciones con altura y ritmo, API pública): https://www.songsterr.com
- Piano Letter Notes: https://pianoletternotes.blogspot.com · noobnotes: https://noobnotes.net
- Hooktheory (tonalidad, compás, tempo): https://www.hooktheory.com · Musicnotes (tonalidad publicada y vistas
  previas oficiales): https://www.musicnotes.com
- Partituras de Wikipedia (LilyPond) e IMSLP (dominio público): https://imslp.org
