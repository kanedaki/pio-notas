# Investigación: NoteWorks (DoReMiWorld / Azati Corporation)

> Inventario funcional del juego móvil de lectura de notas **NoteWorks** y su versión gratuita (**NoteWorks Lite** en iOS, **NoteWorks Free** en Android), como referencia de alcance para un juego web **original** del mismo género.
>
> Fecha de la investigación: 27-10-2026.
>
> **Convenciones**
> - Sin marca: dato comprobado en una fuente primaria (ficha de la App Store o Google Play, web oficial del desarrollador, capturas oficiales o reseñas de profesores con fecha).
> - **(captura)**: lo he visto directamente en las capturas oficiales de la App Store. Lo que se ve en una imagen describe la interfaz, pero no explica su lógica interna.
> - **(reseña de usuario)**: aparece en reseñas de usuarios de la App Store o Google Play. Es una sola opinión, no una documentación.
> - **(inferido)**: deducción mía a partir de varios datos parciales.
> - **(no verificado)**: no he encontrado una fuente fiable que lo confirme. Puede ser falso.

---

## 0. Resumen ejecutivo

- **Qué es:** un juego de reconocimiento de notas sueltas sobre el pentagrama. Las notas (redondas) entran por la derecha desde una máquina con engranajes y avanzan hacia la izquierda. El jugador las nombra antes de que lleguen. Si acierta, el personaje **Munchy** se come la nota. Si falla, la nota se quema en un incinerador. Al terminar la ronda, una lluvia apaga el fuego y el jugador puede volver a intentar las notas falladas.
- **Desarrollador:** Azati Corporation (Livingston, Nueva Jersey, EE. UU.), con la marca **DoReMiWorld** (doremiworld.com). No he encontrado ningún vínculo con un "Charles Wright".
- **Formas de responder:** teclado de piano en pantalla, botones con nombres de letra (ABC, en 4 órdenes que incluyen la H alemana), botones de solfeo (Do fijo y, solo en iPhone y Android, Do móvil), diapasón de guitarra (iPhone y Android) y teclado MIDI externo.
- **Contenido:** clave de sol, fa, do en 3.ª (alto) y do en 4.ª (tenor), más el sistema de piano (gran pentagrama, solo en iPad). Se avanza por rango de notas → alteraciones → armaduras de hasta 7 sostenidos y 7 bemoles. Hay **21 niveles en iPad** y **17 en iPhone y Android**. No hay ritmo (solo redondas), ni intervalos, ni acordes.
- **Lite/Free:** **1 nivel**, solo clave de sol y un rango limitado (según usuarios, Do4–Sol4, 5 notas), sin alteraciones ni armaduras, sin avance automático y sin compartir el progreso con el profesor. Sí incluye MIDI, los nombres ABC y Do-Re-Mi, el modo con ayudas, la puntuación, la velocidad ajustable, varios jugadores y las tablas de lectura.
- **Estado actual:** las apps de iOS siguen a la venta (4,99 USD la completa, gratis la Lite), pero no se actualizan desde 2018 (iPad) y enero de 2019 (iPhone). Las de Android tuvieron su última actualización el 4-11-2019 y **ya no están en Google Play** (la URL devuelve "Not Found").

---

## 1. Ficha: desarrollador, plataformas, precio, edad e historial

### 1.1 Desarrollador
- En las cuatro fichas de la App Store, el vendedor y titular del copyright es **Azati Corporation**, con la web de soporte `doremiworld.com/Games/NoteWorks`.
- En Google Play, el desarrollador figuraba como "Azati", con web azati.com, correo info@azati.com y dirección 184 South Livingston Avenue, Suite 119, Livingston, NJ 07039 (según las capturas archivadas de las fichas).
- Las condiciones de uso de doremiworld.com (de 2012) dicen que el sistema y las apps "are products and services of Azati Corporation" y que se rigen por la ley de Nueva Jersey.
- Azati publica NoteWorks / "DOREMIWORLD Games" como un proyecto de su portfolio (tecnologías: Ruby, iOS, Android, JavaScript y MySQL). Según ese caso de estudio, el proyecto incluye la app y un portal web para profesores y padres.
- En una reseña de 2012, la persona de contacto de DoReMiWorld.com es **Jon Chakoff** (Music Educator Resources).
- La propia web dice estar diseñada "by music teachers for music teachers", con los requisitos definidos por profesores particulares de música.
- **No he encontrado ninguna relación con "Charles Wright".**

### 1.2 Apps y plataformas
Cada versión de iOS es una app separada. **No existe app universal**, así que había que comprar la versión de iPad y la de iPhone por separado (varias reseñas lo critican).

| App | Plataforma | ID / paquete | Precio | Tamaño | Requisitos | Valoración (EE. UU., oct-2026) |
|---|---|---|---|---|---|---|
| NoteWorks | iPad | id546003758 | 4,99 USD | 23,5 MB | iPadOS 7+; Mac con M1 y visionOS ("Designed for iPad") | 4,0 (174) |
| NoteWorks Lite | iPad | id577433139 (slug `noteworks-free-music-theory`) | Gratis | 24,4 MB | iPadOS 7+ | 4,1 (144) |
| NoteWorks for iPhone | iPhone/iPod touch (funciona en iPad) | id728401013 | 4,99 USD | 32,3 MB | iOS 7+ | 3,3 (39) |
| NoteWorks Lite for iPhone | iPhone/iPod touch | id731430479 | Gratis | 32,4 MB | iOS 7+ | 3,6 (43) |
| NoteWorks | Android (Google Play y Amazon) | com.azati.noteworks / Amazon B071WCVJSQ | 4,99 USD | – | Android 2.3+ (en 2016) | 2,6 (274) en nov-2022; ya no está en Google Play |
| NoteWorks Free | Android (Google Play y Amazon) | com.azati.noteworksfree / Amazon B06W522S93 | Gratis | 17 MB (2019) | Android 4.0.3+ (2019) | 3,5 (489) en dic-2022; 4,2 (322) en sep-2019; ya no está en Google Play |
| NoteWorks Free (Flash) | Navegador | doremiworld.com/Games/NoteWorks-Free/Flash | Gratis | – | Flash, 1024×768 | Archivada en nov-dic de 2012; "First level only" |

- **Idiomas (iOS):** 12. Inglés, bielorruso, francés, alemán, italiano, japonés, coreano, portugués (Brasil), ruso, chino simplificado, español y turco.
- **Instalaciones en Android:** la completa tenía 1.000–5.000 en nov-2016 y 10K+ en 2022. La Free tenía 10K–50K en 2016 y 50K+ en 2019 y 2022.
- **Precio:** 4,99 USD en todas las fuentes oficiales. Un blog de la UBC de 2017 da 6,99 USD (no verificado; puede ser otra tienda u otro momento).

### 1.3 Edad objetivo
- La App Store la clasifica como **4+**. Google Play la clasifica como "Everyone", y la Free aparecía en la sección familiar como **"Ages 6-12"** (ficha de 2019).
- La descripción oficial dice: "Players of all ages", "Beginners to advanced music students", "Families with multiple players", "Music teachers with multiple students". También propone usarla para preparar exámenes de teoría y aprender claves de otros instrumentos.
- En la práctica, hay reseñas de profesores que la usan con niños de 5–7 años, con alumnos de 6.º a 8.º curso (coro de secundaria) y con adultos principiantes (reseñas de usuario).

### 1.4 Historial de versiones

**NoteWorks para iPad (completa)**

| Versión | Fecha | Cambios (según la ficha) |
|---|---|---|
| 1.0.0 | 30-07-2012 | Lanzamiento. El 3-7-2012 la web decía "about to release"; el vídeo "Munchy Story" se publicó el 17-7-2012. |
| 1.1.0 | 09-11-2012 | Corrige un fallo de iOS 6, añade ruso, mejora el teclado de piano y rediseña menús. |
| 1.2.0 | 28-03-2013 | **MIDI** y 12 idiomas. |
| 1.2.1 | 07-10-2013 | Optimización para iOS 7. |
| 1.2.2 | 12-03-2014 | Corrige un fallo de compatibilidad con teclados MIDI. |
| 1.2.3 | 03-10-2014 | Correcciones para iOS 8. |
| 1.2.4 | 28-10-2015 | Correcciones para iOS 9. |
| 1.3.0 | 22-12-2015 | **Compartir el progreso con profesores.** |
| 1.3.1 | 30-03-2016 | **Ajustes de sonido: "Notes" y "Effects".** |
| 1.3.2 | 26-09-2016 | Optimización para iOS 10. |
| 1.3.3 | 09-01-2017 | Revisa la localización al alemán. |
| 1.3.4 | 10-03-2017 | **Sincronización del progreso con iCloud.** |
| 1.3.5 | 16-06-2017 | Correcciones. |
| 1.3.6 | 19-04-2018 | Mejoras de conexión MIDI. Es la última versión. |

**NoteWorks Lite para iPad:** 1.0.0 (06-12-2012), 1.2.0 (01-04-2013, MIDI y 12 idiomas), 1.2.1 (10-10-2013), 1.2.2 (12-03-2014), 1.2.3 (03-10-2014), 1.2.4 (05-11-2015), 1.3.1 (30-03-2016, ajustes de sonido), 1.3.2 (26-09-2016), 1.3.3 (09-01-2017), 1.3.4 (20-03-2017, sin iCloud), 1.3.5 (16-06-2017) y 1.3.6 (19-04-2018).

**NoteWorks for iPhone (completa)**

| Versión | Fecha | Cambios |
|---|---|---|
| 1.0.0 | 25-10-2013 | Lanzamiento en iPhone. |
| 1.1.0 | 14-02-2014 | Gráficos HD, ruso y **4 órdenes para los nombres ABC**: CDEFGAB, CDEFGAH, ABCDEFG y AHCDEFG. |
| 1.2.0 | 12-03-2014 | **Entrada con diapasón de guitarra** y corrección de MIDI. |
| 1.3.0 | 22-12-2015 | Compartir el progreso con profesores. |
| 1.3.1 | 08-04-2016 | Ajustes de sonido "Notes" y "Effects". |
| 1.3.2 | 13-04-2016 | Correcciones. |
| 1.4.0 | 06-06-2016 | **Do móvil.** |
| 1.4.1 – 1.4.3 | 26-09-2016 / 30-11-2016 / 09-01-2017 | iOS 10 y alemán. |
| 1.4.4 | 10-03-2017 | Sincronización con iCloud. |
| 1.4.5 | 16-06-2017 | Correcciones. |
| 1.4.6 | 19-04-2018 | Mejoras de MIDI. |
| 1.4.7 | 24-01-2019 | Correcciones. Es la última versión. |

**NoteWorks Lite for iPhone:** 1.0.0 (31-10-2013), 1.1.0 (14-02-2014, HD y órdenes ABC), 1.2.0 (12-03-2014, guitarra), 1.3.1 (08-04-2016, sonido) y así hasta la 1.4.0 (24-01-2019). Las notas de versión de la Lite **no mencionan** el Do móvil, iCloud ni compartir con profesores.

**Android:** las primeras reseñas de la Free son de mayo de 2014. En 2016 la completa iba por la 1.3.1 y la Free por la 1.2.2, y en septiembre de 2019 la Free por la 1.2.7. La última actualización de ambas fue el 4-11-2019. En 2019–2022 hay muchas reseñas que dicen que la app se cierra al arrancar (en la pantalla de presentación) en Android 11 y en Samsung recientes. Hoy ninguna de las dos está en Google Play.

**Contexto de producto:** en 2012 DoReMiWorld la anunciaba como "the first in a series of interactive educational games, designed to teach music theory". No he encontrado otros juegos publicados de esa serie.

---

## 2. Bucle de juego principal

### 2.1 Escena y metáfora
- La acción transcurre en una "fábrica de NoteWorks". Las notas salen de una **máquina o torre con engranajes y una cadena** a la derecha de la pantalla y pasan por un **pentagrama horizontal** que ocupa casi todo el ancho. Al fondo hay un paisaje industrial con fábricas, chimeneas y un molino (captura, y reseña de Music Educator Resources de 2012).
- **Munchy** es un personaje rojo y triangular con ojos grandes y patas finas. Está en el centro de la escena, debajo del pentagrama. Una niña lo llama "hungry crab" (reseña de usuario).
- A la izquierda hay un **carro-incinerador** con chimenea en llamas (captura). Hay **nubes** en la parte superior.
- En la torre de la derecha se ve un **contador numérico** que baja durante la partida (45→43→39 en el nivel 14; 17→16→15 en el nivel 1 de la Lite) (captura). Probablemente son las notas que faltan en la ronda (inferido, no verificado).

### 2.2 Cómo aparecen y se mueven las notas
- **Dirección:** de **derecha a izquierda**, desde la máquina hacia Munchy y el incinerador (captura y reseñas).
- Las notas son **redondas (whole notes)**. Una reseña se queja de que no hay negras ni otras figuras.
- La nota que hay que contestar en cada momento se pinta en **azul**. Las siguientes, en gris. Las falladas quedan a la izquierda **en llamas** (captura y descripción oficial: "Hungry Munchy is eager to swallow elusive blue notes").
- En pantalla se ven varias notas a la vez, más o menos de 2 a 5 (captura).
- **Velocidad:**
  - En **iPad** hay 3 velocidades: *Slow*, *Medium* y *Fast*, representadas con una tortuga y una liebre (captura; Color In My Piano, 2012).
  - En **iPhone y Android** hay 4: **∞ (sin límite de tiempo)**, tortuga (lento), lagarto (medio) y liebre (rápido) (captura). La tabla oficial confirma "Unlimited time per note": No en iPad, Sí en iPhone (también en la Lite) y en Android.
  - Una reseña dice que las notas van primero lentas y después más rápido, y que eso estresa a los niños pequeños (reseña de usuario).

### 2.3 Qué toca el jugador (métodos de entrada)
1. **Teclado de piano en pantalla.**
   - En iPad es de varias octavas y ocupa todo el ancho inferior. Un punto naranja marca el Do central (captura).
   - En iPhone se ve más ampliado, alrededor de una octava y media, con las teclas Do4 y Do5 rotuladas (captura).
   - En Android solo se ve una octava, y un profesor lo critica en una reseña de 2016.
   - **La nota se registra al soltar la tecla, no al pulsarla.** Así se puede deslizar el dedo hasta la tecla correcta antes de levantarlo. Lo explica la pantalla de ayuda "How to use the piano keyboard" (captura) y lo confirmó el desarrollador en 2012.
2. **Botones con nombres de letra (ABC).**
   - Hay una fila de 7 botones grandes de notas naturales. Cuando el nivel tiene alteraciones, encima de cada letra aparecen dos botones pequeños, **♭** y **♯** (captura).
   - En iPhone y Android se puede elegir el orden y el sistema: CDEFGAB, CDEFGAH, ABCDEFG o AHCDEFG.
   - En la captura de iPad, el botón B muestra una "H" pequeña en gris (captura). Su significado exacto no está verificado.
3. **Botones de solfeo (Do-Re-Mi).** Usan las sílabas Do, Re, Mi, Fa, Sol, La y **Ti** (no "Si"), también con botones ♭/♯ (captura). Es **Do fijo** en todas las versiones. El **Do móvil** llegó en la v1.4.0 de iPhone (2016) y en Android, y **nunca en iPad** (tabla oficial).
4. **Diapasón de guitarra en pantalla.** Solo en iPhone y Android, desde la v1.2.0 (marzo de 2014). Una reseña lo menciona ("where the notes live on the piano and guitar").
5. **Teclado MIDI externo.** Disponible desde la v1.2.0 (marzo de 2013), también en la Lite. Hay usuarios que lo conectan con iRig MIDI, por USB con adaptador Lightning, o con pianos Kawai y Yamaha Clavinova (reseñas de usuario).
6. **Micrófono / piano acústico.** El caso de estudio de Azati afirma "microphone-based acoustic piano note detection". **(no verificado)** Ninguna ficha de tienda, nota de versión ni tabla oficial lo menciona, y en 2012 dos profesoras lo pedían como algo que faltaba.

### 2.4 Qué pasa al acertar, fallar o dejar pasar una nota
- **Acierto:** Munchy **se come la nota**, con un sonido de mordisco o crujido. Además suena la nota con su altura real, y un profesor valora que "the note's tone is correct" (reseñas de 2012 y 2013).
- **Error:** la nota **se incendia**, va hacia la izquierda y queda apartada (Color In My Piano; Music Educator Resources). Según una reseña de usuario, **en modo rápido cada error resta 50 puntos**.
- **Nota no contestada a tiempo:** no hay documentación clara **(no verificado)**. Lo más probable es que cuente como fallo y se queme (inferido).
- **Fin de ronda, segunda oportunidad:** "after students go through all the notes in the level, the clouds rain upon the notes putting the fire out and allowing them another chance to correct the notes that they missed" (Music Educator Resources). Varios profesores destacan esta opción de "re-do" o "return to missed notes".
- **Retroalimentación en el modo sin ayuda:** un usuario de la Lite se queja de que, si falla, el juego no le dice cuál era la nota correcta (reseña de usuario). Otros piden que se muestre el nombre de la nota al pulsar una tecla, lo que significa que no se muestra (reseñas de 2016 y 2017).

### 2.5 Vidas, temporizador, puntuación, combos y estrellas
- **Vidas o "game over":** no he encontrado nada que indique que existan. Un profesor valora que los niños "can get some wrong and still be in the game" (reseña de usuario). Lo más probable es que **no haya vidas** (inferido).
- **Temporizador:** no hay un reloj global. El tiempo de cada nota depende de la velocidad a la que avanzan, salvo en el modo ∞ de iPhone y Android.
- **Puntos:** el marcador "Points" aparece arriba a la derecha durante la partida (captura). Se puntúa solo en el modo **sin ayuda**: "Students play without hints to earn points and stars" (descripción de iPhone y Android).
- **Puntos extra:** la pantalla de configuración muestra "Bonus Points", que cambian con la velocidad: 300 en *Slow* (iPhone, nivel 5) y 400 en *Medium* (iPad, nivel 14) (captura). No he podido verificar los valores de *Fast* ni de ∞, ni si dependen también del rango o del nivel.
- **Combos o rachas:** no he encontrado nada **(no verificado; probablemente no existen)**.
- **Estrellas:**
  - En cada nivel hay **3 estrellas**, visibles en la parte superior durante la partida y en la pantalla de configuración (captura).
  - Cada jugador tiene un total acumulado, "**All Your Stars**" (captura).
  - En la versión completa el avance de nivel es automático; un profesor lo describe como "movement to levels based on point accrual" (reseña de usuario). Otro usuario dice: "When you finish fast mode you level up!".
  - Las estrellas **no se pueden canjear por nada**. Hay quejas de que "the stars are useless", y peticiones de una tienda con monedas o decoraciones para Munchy (reseñas de usuario).
  - Un usuario dice que no puede pasar del nivel 6 aunque tiene 3 estrellas. La regla exacta para desbloquear niveles **(no verificado)**.

### 2.6 Modos de juego
- **Práctica con ayuda ("Practice", "with help"):** muestra pistas. En las capturas, la tecla o el botón correcto se resalta en **verde**. No da puntos ni estrellas.
- **Reto ("Challenge", "Without help"):** sin pistas. Da puntos y estrellas.
- **Partida automática:** el juego configura el nivel según el progreso de cada jugador. En iPhone hay un botón "**Set up the game for me**" (captura). En la tabla oficial aparece como "Auto game settings" o "Auto level advancement", **solo en la versión completa**.
- **Partida personalizada ("Custom Game"):** se eligen a mano el nivel, la clave, el método de respuesta, la velocidad y si hay ayuda. En iPhone y Android también el **rango de notas**: hay dos asas que se arrastran sobre un teclado y el rango resultante se ve en un pentagrama (captura).
- Un profesor de 2012 dice: "Just as mastery is near, another type of game is suggested". Parece que el juego sugiere cambiar de modo o de nivel **(no verificado en detalle)**.

---

## 3. Contenido musical y estructura de niveles

### 3.1 Claves y sistemas

| Clave | iPad completa | iPhone completa | Android completa | Lite/Free (todas) |
|---|---|---|---|---|
| Sol | Sí | Sí | Sí | **Sí (la única)** |
| Fa | Sí | Sí | Sí | No |
| Gran pentagrama (sol + fa) | **Sí** | **No** | No aparece en la tabla | No |
| Do en 4.ª (tenor) | Sí | Sí | Sí | No |
| Do en 3.ª (alto) | Sí | Sí | Sí | No |

Fuente: tabla comparativa oficial en doremiworld.com/Games/NoteWorks. Una reseña de 2018 confirma que la versión de iPhone no tiene gran pentagrama y la de iPad no permite ajustar el rango.

### 3.2 Rango de notas y líneas adicionales
- **Principiantes:** el juego empieza con un rango pequeño que crece a medida que el alumno avanza ("For beginners, the game starts by teaching a limited range of notes. Note range gradually increases as students advance").
- **Lite/Free:** según dos usuarios, 5 notas en clave de sol, **Do central a Sol** ("middle C thru G. 5 notes total"; "I mastered 'do' to 'so'"). La captura de la Lite (nivel 1) cuadra con eso.
- **Rango personalizado:** en iPhone y Android se puede ajustar libremente en las cuatro claves ("Custom note range in all four clefs"). **En iPad no**: solo hay rangos predefinidos por nivel. Lo critican varios profesores: "can't pick which notes to quiz", "My kiddos start with D above middle C…".
- **En Android,** un usuario de 2016 dice que el rango parecía fijo en una quinta (reseña de usuario; podría ser un error o una mala interpretación).
- **Rango máximo:** la tabla de lectura del gran pentagrama va de **Do2 a Do6** (4 octavas, 29 teclas blancas), es decir, hasta **dos líneas adicionales** por encima y por debajo de cada pentagrama (captura). Que ese sea también el rango máximo dentro del juego **(no verificado)**. Un usuario echa de menos más práctica con líneas adicionales ("Wish it was more comprehensive in ledger notes").

### 3.3 Alteraciones y armaduras
- **Alteraciones sueltas (♯/♭):** solo en la versión completa. Llegan después de los niveles de rango ("After mastering accidentals, students learn key signatures").
- **Armaduras:** solo en la versión completa, **hasta 7 sostenidos y 7 bemoles en varias claves** (web oficial). En cada nivel se ven la tonalidad mayor y su relativa menor, por ejemplo "A Major / F♯ minor" (captura).
- Dentro de una armadura, el jugador tiene que dar el nombre con la alteración que marca la armadura (Color In My Piano: "the student must identify the notes within a key signature").
- No hay ninguna mención a dobles alteraciones ni a cómo se tratan los enharmónicos en el modo ABC **(no verificado)**.

### 3.4 Lo que no incluye
- **Ritmo, figuras o silencios:** no. Solo redondas. Hay usuarios que piden negras y silencios.
- **Intervalos, acordes o escalas:** no. Hay peticiones de un "app on intervals" y de "chords and scales".
- **Lectura de melodías o fragmentos reales:** no. Un usuario pide un modo tipo "Guitar Hero for piano".
- **Entrenamiento auditivo:** no hay un modo específico. Las notas suenan con su altura real, pero no hay ejercicios de oído.
- **Varios instrumentos de respuesta:** piano y guitarra (esta última solo en iPhone y Android). La cita de Azati "select instruments" se refiere a esto.

### 3.5 Estructura de niveles
- **Número de niveles:** iPad completa **21**; iPhone completa **17**; Android completa **17**; todas las Lite/Free **1** (tabla oficial).
- No hay "mundos": es una lista lineal de niveles numerados que se elige en la configuración (captura).
- Según Color In My Piano (2012, iPad): "Levels 1-5 are for students who are just learning how to read. Levels 6 and above are for advanced students. As the levels get more difficult, the range of notes tested increases, and then accidentals are added, and finally… key signature".

**Niveles comprobados en las capturas:**
- iPad: 12 = La M / Fa♯ m; 13 = Mi♭ M / Do m; 14 = Mi M / Do♯ m; 15 = La♭ M / Fa m; 16 = Si M / Sol♯ m.
- iPhone: 5 = Fa M / Re m; 10 = clave de fa con 4 sostenidos (Mi M); 17 = clave de do en 3.ª con 7 bemoles (Do♭ M).

**Reconstrucción probable (inferido, no verificado):** las armaduras alternan sostenidos y bemoles de 1 a 7, lo que da 14 niveles de armadura.

| iPad (21) | Contenido probable |
|---|---|
| 1–5 | Rango creciente, sin alteraciones (Do mayor) |
| 6–7 | Alteraciones sueltas |
| 8–21 | Sol M (1♯), Fa M (1♭), Re M (2♯), Si♭ M (2♭), **La M (3♯)**, **Mi♭ M (3♭)**, **Mi M (4♯)**, **La♭ M (4♭)**, **Si M (5♯)**, Re♭ M (5♭), Fa♯ M (6♯), Sol♭ M (6♭), Do♯ M (7♯), Do♭ M (7♭) |

| iPhone/Android (17) | Contenido probable |
|---|---|
| 1–3 | Sin armadura (rango y alteraciones; el rango se ajusta con el selector) |
| 4–17 | Las mismas 14 armaduras en el mismo orden (**5 = Fa M**, **10 = Mi M**, **17 = Do♭ M** coinciden con las capturas) |

---

## 4. Diferencias exactas entre la Lite/Free y la versión completa

### 4.1 iPad: NoteWorks Lite frente a NoteWorks (tabla oficial actual)

| Función | Lite | Completa |
|---|---|---|
| Niveles | **1** | **21** |
| Configuración automática y avance de nivel | No | Sí |
| Rango de notas | Limitado | Ampliado |
| Alteraciones | No | Sí |
| Armaduras | No | Sí |
| Clave de sol | Sí | Sí |
| Clave de fa | No | Sí |
| Gran pentagrama | No | Sí |
| Clave de do en 4.ª (tenor) | No | Sí |
| Clave de do en 3.ª (alto) | No | Sí |
| Teclado de piano en pantalla | Sí | Sí |
| Teclado MIDI | Sí | Sí |
| Nombres A, B, C | Sí | Sí |
| Do-Re-Mi (Do fijo) | Sí | Sí |
| Do-Re-Mi (Do móvil) | No | **No** |
| Práctica con ayuda | Sí | Sí |
| Jugar por puntos | Sí | Sí |
| Velocidad ajustable | Sí | Sí |
| Varios jugadores | Sí | Sí |
| Preferencias por jugador | Sí | Sí |
| Tablas de lectura | Sí | Sí |
| Compartir el progreso con el profesor | No | Sí |
| Vídeos de YouTube | Gratis | Gratis |

La tabla de 2012–2013 añade una fila "Custom game settings: Yes / Yes", así que la Lite también permitía la partida personalizada dentro de su único nivel.

### 4.2 iPhone: NoteWorks Lite for iPhone frente a NoteWorks for iPhone (tabla oficial)

| Función | Lite | Completa |
|---|---|---|
| Niveles | **1** | **17** |
| Configuración automática | No | Sí |
| Rango de notas | Limitado | Ampliado |
| **Rango personalizado** | No | **Sí** |
| Alteraciones y armaduras | No | Sí |
| Claves | Solo sol | Sol, fa, tenor y alto (**sin gran pentagrama**) |
| Piano en pantalla, MIDI, ABC, Do-Re-Mi | Sí | Sí |
| **Do móvil** | No | **Sí** |
| Práctica con ayuda, puntos, velocidad ajustable | Sí | Sí |
| Tiempo limitado por nota | Sí | Sí |
| **Tiempo ilimitado por nota** | **Sí** | Sí |
| Varios jugadores, preferencias, tablas de lectura | Sí | Sí |
| Compartir el progreso con el profesor | No | Sí |

El diapasón de guitarra y los 4 órdenes ABC aparecen en la descripción de **ambas** apps de iPhone, también en la Lite.

### 4.3 Android: NoteWorks Free frente a NoteWorks (tabla oficial)
Es igual que la tabla de iPhone: 1 frente a 17 niveles; sin rango personalizado, alteraciones ni armaduras en la Free; solo clave de sol en la Free, frente a sol, fa, tenor y alto en la completa; Do móvil solo en la completa; tiempo ilimitado en ambas; compartir con el profesor solo en la completa.

La tabla de Android **no tiene fila de MIDI**, aunque la descripción de Google Play sí menciona "MIDI keyboard input" y "guitar fretboard input" **(no verificado si funcionaba en Android)**.

### 4.4 Otras diferencias que señalan los usuarios
- La Lite trae un botón "**Full Version**" que lleva a la app de pago, que es otra app distinta y no una compra dentro de la app (captura). En 2019 varios usuarios de EE. UU. no podían comprar la completa de iPhone desde la Lite ("not available in your country or region") (reseñas de usuario).
- En la Lite de iPad de 2013, el juego **dejaba de funcionar hasta que el usuario valoraba la app** (reseña de usuario, v1.0.0).
- iCloud solo aparece en las notas de versión de las apps completas.
- Opinión de usuarios sobre la Lite: "all you get free is level 1, which takes about 10 minutes"; "only one free level, that only allows you to play 5 notes at a slow speed, even on the highest setting".

### 4.5 Diferencias entre plataformas de la versión completa
Las versiones "completas" **no son iguales entre sí**:
- **iPad:** tiene gran pentagrama, pero **no** rango personalizado, tiempo ilimitado, Do móvil ni guitarra. Tiene 21 niveles.
- **iPhone:** tiene rango personalizado, tiempo ilimitado, Do móvil, guitarra y 4 órdenes ABC, pero **no** gran pentagrama. Tiene 17 niveles.
- **Android:** funciones parecidas a iPhone, pero el teclado solo muestra una octava (reseña de usuario). Ya no está disponible.

---

## 5. Funciones de alrededor

### 5.1 Perfiles de jugador
- **Jugadores ilimitados:** "you can add unlimited players for this game!!!" (Music Educator Resources). Cada uno tiene nombre, estrellas y "Individual preferences" (tabla oficial).
- El nombre del jugador y su total de estrellas se ven en el menú principal (captura).
- Desde un perfil se pueden ajustar sus preferencias, "select exactly what they need to work on" (reseña de profesor, 2014).
- **Problema:** borrar jugadores es complicado. Una profesora tuvo que llamar a la empresa para saber cómo hacerlo, y otra dice que "It's time-consuming and annoying" (reseñas de usuario).
- **Problema:** en iPad, en 2024, la app no guardaba la configuración entre sesiones (por ejemplo, el gran pentagrama) (reseña de usuario).

### 5.2 Progreso y estadísticas
- Por jugador: nivel actual, estrellas por nivel y estrellas totales (captura).
- **Sincronización con iCloud** del progreso desde marzo de 2017, solo en las versiones completas.
- No he encontrado pantallas de estadísticas detalladas dentro de la app, como precisión por nota o tiempos de respuesta **(no verificado; no aparece en ninguna captura ni ficha)**.

### 5.3 Informes para el profesor ("Sharing of Game Progress")
Está **solo en la versión completa** y necesita conexión a internet. Se añadió en diciembre de 2015. Según la página oficial "NoteWorks: Game Progress", funciona así:
1. El profesor crea una cuenta en DoReMiWorld.com y añade al alumno a su lista "My Students". El sistema genera un **código de invitación** único.
2. El alumno o sus padres meten ese código en la página "**My Teachers**" de la app.
3. El profesor recibe un correo de confirmación. Desde ese momento, **cada vez que el alumno abre la app o completa un nivel**, sus resultados se sincronizan con el portal y el profesor puede consultarlos.

No he encontrado qué datos concretos ve el profesor (precisión, tiempo de juego, niveles, etc.) **(no verificado)**. El caso de estudio de Azati dice que el portal tiene deberes, seguimiento de lecciones, calendario, informes y comunicación con los padres, con cifras de "25k+ active students monthly" y "15k+ homework assignments completed via the web portal" **(no verificado; es material comercial de Azati, y la web de 2012 hablaba de esas funciones como planes futuros)**.

### 5.4 Ajustes
- **Clave:** sol, fa, gran pentagrama (solo iPad), tenor y alto.
- **Método de respuesta:** teclado, ABC o Do-Re-Mi. En iPhone y Android, también guitarra. Siempre, también MIDI.
- **Nombres de las notas:** ABC en 4 órdenes (iPhone y Android), Do fijo y Do móvil (Do móvil solo en las completas de iPhone y Android).
- **Velocidad:** 3 niveles en iPad; ∞ y 3 niveles en iPhone y Android.
- **Con o sin ayuda.**
- **Rango de notas:** en iPhone y Android.
- **Sonido:** volumen o activación por separado de "**Notes**" (las notas musicales) y "**Effects**" (los efectos), desde la v1.3.1 de 2016. El detalle exacto **(no verificado)**.
- **Idioma de la interfaz:** 12 idiomas.
- **Modo para zurdos:** no he encontrado nada **(no verificado; probablemente no existe)**.
- **Zoom o tamaño del teclado y del pentagrama:** no existe. Es una petición repetida de profesores y usuarios.
- **Desplazamiento de octava o del teclado:** en iPhone el teclado se ve ampliado y en iPad completo. No se sabe si el usuario puede desplazarlo **(no verificado)**.
- **Elegir solo sostenidos o solo bemoles:** no existe; un usuario lo pide.

### 5.5 Logros
- No hay un sistema de logros más allá de las estrellas por nivel. No he encontrado integración con Game Center **(no verificado)**.
- El caso de estudio de Azati menciona "achievements" y "leaderboards" **(no verificado; no aparece en ninguna ficha ni captura)**.
- El blog de la UBC dice que "Several players can play and compare scores". Seguramente se refiere a comparar puntuaciones entre perfiles del mismo dispositivo (inferido).

### 5.6 Personajes e historia
- **Munchy** es el protagonista. Hay dos vídeos oficiales en el canal de YouTube **DoReMiWORLD**, publicados el 17-7-2012: "**Munchy Story**" y "**The Munchy Song**". Se pueden ver desde la app con el botón azul del "mundo" (captura; Music Educator Resources; Color In My Piano).
- Según una reseña, la historia presenta a "Munchy y su familia" (Music Educator Resources).
- Dentro del juego no hay un modo historia ni escenas narrativas, y el escenario es siempre el mismo **(inferido de las capturas)**.

### 5.7 Música y sonido
- Las notas suenan con su altura real al contestar (reseñas de profesores).
- Hay efectos de mordisco y crujido, una banda sonora ("I like the soundtrack and the crunching sound") y una canción propia (The Munchy Song).
- **Problemas:** a varios usuarios se les dejó de oír el sonido tras actualizar iOS (2013, 2016 y 2017). Algunos dicen que los efectos distraen o suenan demasiado fuerte y que querían bajarlos; los ajustes "Notes/Effects" se añadieron en 2016. Al saltar las pantallas de puntuación se perdía el sonido de las notas (Lite, 2015) (reseñas de usuario).

### 5.8 Material de apoyo dentro de la app
- **Tablas de lectura ("Note Reading Chart"):** una para cada clave (sol, fa, gran pentagrama, tenor y alto). Muestran un teclado con nombres en letra y en solfeo, y líneas que unen cada tecla con su posición en el pentagrama. Están **también en la Lite**, con todas las claves (captura).
- **Ayuda con pestañas** (1–4), por ejemplo "How to use the piano keyboard" (captura). Aun así, varios usuarios dicen que no hay instrucciones ni guía, o piden una lección rápida antes de empezar.

### 5.9 Accesibilidad
- En la App Store, el desarrollador **no ha declarado ninguna función de accesibilidad** ("The developer has not yet indicated which accessibility features this app supports").
- No he encontrado soporte para VoiceOver, modos para daltónicos, alto contraste ni texto escalable **(no verificado)**.
- Problemas que señalan los usuarios: teclas pequeñas, sobre todo en iPad mini y para dedos infantiles; pentagrama pequeño en iPhone y Android; Do central descentrado; la aceleración genera estrés.
- Ayuda a la motricidad fina: la nota se registra al soltar la tecla, así que se puede corregir deslizando el dedo.

### 5.10 Privacidad y datos
- En las fichas de Apple pone "No Details Provided", y en Google Play no había información de seguridad de datos.
- La función de compartir con el profesor necesita una cuenta en DoReMiWorld. Su política de privacidad es de 2012.

---

## 6. Qué valoran y qué critican los profesores

### 6.1 Lo que valoran
- **Jugadores ilimitados y preferencias por alumno**, ideal para el aula o la academia (Music Educator Resources; Color In My Piano; reseñas de profesores de 2013–2014).
- **Muchas claves**, también alto y tenor, útiles para viola y chelo ("I was really glad to see alto clef as an option for my viola players"), y gran pentagrama.
- **Tres formas de responder** (teclado, letras y solfeo), que relacionan el pentagrama con el teclado.
- **Armaduras de hasta 7 alteraciones**, algo poco habitual en apps de lectura de notas ("Another great feature that many note reading apps do not have").
- **Los errores no se ignoran:** la segunda oportunidad al final de la ronda (la lluvia) da retroalimentación ("Mistakes are not ignored until 'game over' but have an opportunity to be rescued").
- **Progresión automática con control manual** ("advances you automatically… still with full override ability").
- **Velocidades:** las rápidas motivan a repetir ("Who doesn't want to try the faster tempo?!").
- **MIDI:** se puede usar con un piano digital real.
- **Personaje, gráficos y sonido atractivos.** Funciona con niños de 5–7 años, con alumnos de secundaria y con adultos ("not too babyish").
- **Sustituye a las tarjetas** y ahorra tiempo de clase. El desarrollador lo plantea así en su ficha, y los profesores lo confirman.
- **Informes al profesor** y la posibilidad de repetir ("re-do option because it encourages students to try again").

### 6.2 Lo que critican (oportunidades para nuestro juego)
1. **Teclado en pantalla demasiado pequeño y sin zoom.** En el nivel 1 se ven demasiadas octavas y el Do central no está centrado. Lo que piden: ampliar el teclado al rango del nivel e ir mostrando más octavas al avanzar.
2. **No se pueden elegir notas concretas** (en iPad), solo rangos predefinidos. En iPhone sí hay rango, pero no gran pentagrama. Piden poder elegir exactamente qué notas practicar ("EXACTLY what notes they want to learn", "only 2 or 3 notes at a time").
3. **Funciones distintas según el dispositivo y compra por separado** (sin app universal ni sincronización entre plataformas). Las reseñas de 1 estrella lo dicen claramente.
4. **No se muestra el nombre de la nota al pulsar una tecla,** y no hay corrección explícita del error en el modo sin ayuda.
5. **Velocidad:** la más lenta es demasiado rápida para niños pequeños y la más rápida, demasiado lenta para avanzados (Android). La aceleración estresa. El iPad no tiene modo sin límite de tiempo.
6. **Solo Do fijo** en iPad. Varios profesores lo rechazan para la lectura cantada y piden Do móvil.
7. **Solo redondas:** sin negras, sin ritmo, sin silencios. Tampoco intervalos, acordes, escalas ni fragmentos de lectura reales.
8. **Pocas líneas adicionales** en la práctica.
9. **Monotonía, y estrellas que no sirven para nada:** piden recompensas, una tienda, personalización de Munchy y más variedad.
10. **Falta de introducción y progresión poco clara:** "not clear how many stars there are or if there is any way to progress or finish", "No instructions or guidance". Menús confusos.
11. **Gestión de alumnos poco práctica:** borrar perfiles es complicado y los ajustes no siempre se guardan.
12. **No reconoce un piano acústico por micrófono:** ya lo pedían profesoras en 2012.
13. **Estabilidad y abandono:** cierres inesperados, pérdida de sonido tras actualizaciones de iOS, Android que no arranca en versiones recientes, sin actualizaciones desde 2018–2019 y retirada de Google Play.
14. **Lite demasiado limitada** (1 nivel, 5 notas, ~10 minutos) y con un aviso que obligaba a valorar la app.
15. **Solo uno o dos instrumentos de respuesta:** un usuario pide más instrumentos.
16. Una petición de un usuario de Android: poder usar solo sostenidos y no bemoles.

---

## 7. Lagunas y datos no verificados

- La lista exacta de los 21 y 17 niveles. Solo he comprobado los niveles que aparecen en las capturas; la sección 3.5 es una reconstrucción.
- Las reglas exactas de puntuación: puntos por acierto, valor de los puntos extra en Fast y ∞, la penalización (solo hay un dato de un usuario: −50 en Fast) y los umbrales de 1, 2 y 3 estrellas.
- La regla de avance automático: si depende de los puntos, de las estrellas o de completar el modo rápido.
- Qué pasa exactamente cuando una nota llega sin respuesta.
- El significado del contador de la torre y de la "H" del botón B en iPad.
- Qué datos ve el profesor en el portal de DoReMiWorld.
- La detección de piano acústico por micrófono, los logros y las clasificaciones (solo los afirma el caso de estudio de Azati).
- El funcionamiento del MIDI y de la guitarra en Android.
- El tratamiento de los enharmónicos y si hay dobles alteraciones.
- No he encontrado reseñas de NoteWorks en Common Sense Media, Teach Piano Today, Pianimation, Music Teacher's Helper ni en el blog de Leila Viss (88pianokeys.me). Tampoco hilos relevantes en Reddit ni vídeos de partidas de terceros. Las reseñas de profesores con más detalle son las de Color In My Piano (Joy Morin, 2012) y Music Educator Resources (2012 y 2013).

---

## Fuentes

**Fichas de tienda (consultadas el 27-10-2026; descripción, historial de versiones, reseñas y capturas)**
- App Store, NoteWorks (iPad): https://apps.apple.com/us/app/id546003758 (también https://apps.apple.com/app/id546003758)
- App Store, NoteWorks Lite (iPad): https://apps.apple.com/us/app/id577433139
- App Store, NoteWorks for iPhone: https://apps.apple.com/us/app/id728401013
- App Store, NoteWorks Lite for iPhone: https://apps.apple.com/us/app/id731430479
- Feed RSS de reseñas de la App Store (EE. UU.), con todas las páginas disponibles: https://itunes.apple.com/us/rss/customerreviews/page=1/id=546003758/sortby=mostrecent/json, y lo mismo para los ID 577433139, 728401013 y 731430479
- Capturas oficiales (servidas por mzstatic.com desde las fichas de arriba), por ejemplo: https://is1-ssl.mzstatic.com/image/thumb/Purple62/v4/d6/3e/aa/d63eaad0-7992-ba11-1438-93e598eeb961/mzl.tvvzoqxq.png/1200x0w.jpg (Custom Game, iPad), https://is1-ssl.mzstatic.com/image/thumb/Purple62/v4/0c/73/5f/0c735ff9-07ac-451b-2a90-789b0abb5e69/pr_source.png/1200x0w.jpg (configuración, iPhone) y https://is1-ssl.mzstatic.com/image/thumb/Purple62/v4/ed/54/38/ed5438ba-8699-887f-ebca-ac6f4d116251/pr_source.png/1200x0w.jpg (selector de rango, iPhone)
- Google Play, NoteWorks (hoy da "Not Found"): https://play.google.com/store/apps/details?id=com.azati.noteworks
- Google Play, NoteWorks Free (hoy da "Not Found"): https://play.google.com/store/apps/details?id=com.azati.noteworksfree
- Wayback Machine, Google Play NoteWorks: http://web.archive.org/web/20221129181007/https://play.google.com/store/apps/details?id=com.azati.noteworks y http://web.archive.org/web/20161121014037/https://play.google.com/store/apps/details?id=com.azati.noteworks
- Wayback Machine, Google Play NoteWorks Free: http://web.archive.org/web/20221206072121/https://play.google.com/store/apps/details?id=com.azati.noteworksfree, http://web.archive.org/web/20190922141520/https://play.google.com/store/apps/details?id=com.azati.noteworksfree y http://web.archive.org/web/20161129135723/https://play.google.com/store/apps/details?id=com.azati.noteworksfree
- Amazon Appstore (enlaces de la web oficial; no se pudieron cargar): https://www.amazon.com/azati-com-NoteWorks-Free/dp/B06W522S93 y https://www.amazon.com/azati-com-NoteWorks/dp/B071WCVJSQ

**Web oficial del desarrollador**
- Comparativa de versiones y descripción: https://doremiworld.com/Games/NoteWorks
- Compartir el progreso con el profesor: https://doremiworld.com/Games/NoteWorks-Game-Progress
- Portada: https://doremiworld.com/
- Condiciones de uso (EULA): https://doremiworld.com/terms
- Política de privacidad: https://doremiworld.com/privacy
- Wayback Machine, portada antes del lanzamiento (3-7-2012): http://web.archive.org/web/20120703205650/http://doremiworld.com/
- Wayback Machine, comparativa de iPad de 2013: http://web.archive.org/web/20131007101621/http://doremiworld.com/Games/NoteWorks
- Wayback Machine, NoteWorks Free para navegador (2012): http://web.archive.org/web/20121130231039/http://www.doremiworld.com/Games/NoteWorks-Free y http://web.archive.org/web/20121206052541/http://www.doremiworld.com/Games/NoteWorks-Free/Flash
- Caso de estudio de Azati (material comercial): https://azati.com/portfolio/doremiworld-games/ (también https://azati.ai/portfolio/doremiworld-games)
- YouTube, canal DoReMiWORLD: https://www.youtube.com/@DoReMiWORLD
- YouTube, "Munchy Story": https://www.youtube.com/watch?v=5HNbutw_S6E
- YouTube, "The Munchy Song": https://www.youtube.com/watch?v=i8-hCSaqjMs

**Reseñas de profesores y terceros**
- Color In My Piano (Joy Morin), "Review: NoteWorks iPad app & Giveaway" (13-9-2012): https://colorinmypiano.com/2012/09/13/review-noteworks-ipad-app-giveaway/
- Music Educator Resources, "Tech Tuesday: NoteWorks App" (6-11-2012): https://musiceducatorresources.com/2012/11/06/tech-tuesday-noteworks-app-review-and-giveaway/ (también https://musiceducatorresources.com/?p=1786)
- Music Educator Resources, "NoteWorks now available on iPhone and iPod Touch!" (nov-2013): https://musiceducatorresources.com/?p=3610
- UBC Scarfe Digital Sandbox, entrada sobre NoteWorks (29-8-2017): https://blogs.ubc.ca/scarfesandbox/tag/sight-reading/ (enlace original https://scarfedigitalsandbox.teach.educ.ubc.ca/?p=6872, bloqueado por una verificación del navegador)

**Aparecieron en las búsquedas pero no aportan nada (solo para que conste)**
- https://www.commonsensemedia.org/app-reviews/note-rush-music-reading-game (es otra app, Note Rush; no he encontrado reseña de NoteWorks en Common Sense Media)
