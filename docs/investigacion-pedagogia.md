# Investigación: cómo se aprende mejor a leer notas en el pentagrama

**Para qué sirve este documento:** fijar con base en la evidencia la progresión de niveles y el algoritmo adaptativo de Noteworks, un juego web para móvil (táctil) con el que niños y adultos principiantes aprenden a leer notas en clave de sol, clave de fa, clave de do en 3ª (contralto) y gran pentagrama, con líneas adicionales, alteraciones y armaduras.

**Fecha:** 27-10-2026.

---

## Cómo leer este informe

Cada afirmación lleva su fuente entre corchetes ([F18] y similares, con todas las URL en la sección «Fuentes») y una etiqueta de solidez:

- **[Fuerte]**: metaanálisis o varios experimentos replicados.
- **[Moderada]**: experimentos concretos, a veces con muestras pequeñas, pero específicos de lectura musical o muy cercanos.
- **[Débil]**: práctica docente, métodos comerciales, blogs, tesis pequeñas o extrapolación desde otro dominio (por ejemplo, de las tablas de multiplicar a las notas).
- **[Diseño]**: propuesta nuestra a partir de lo anterior; no está probada directamente y conviene validarla con datos del propio juego.

**Notación usada.** Do4 = Do central (índice científico internacional). Ojo: muchos conservatorios españoles usan el índice franco-belga, en el que el Do central es Do3 [F13][F15]. Internamente, el juego debería usar el índice científico y mostrar a los niños solo el nombre (Do, Re, Mi…), sin número de octava.

---

## 0. Resumen ejecutivo: las cifras que hay que implementar

| Parámetro | Valor recomendado | Solidez |
|---|---|---|
| Notas nuevas por nivel | **2** (nunca más de 2 a la vez; 1 si el nivel añade líneas adicionales o alteraciones y el jugador va justo) | Moderada + Diseño |
| Tamaño inicial del pool | **2–3 notas**, que crece hasta 6–8 en la primera octava | Moderada + Diseño |
| Pool activo máximo por nivel | **12–16 ítems**; lo ya dominado vuelve por repaso espaciado, no como parte del pool | Diseño |
| Dificultad durante el entrenamiento | Tasa de acierto móvil entre **80 y 90 %** (objetivo 85 %) | Moderada |
| Criterio para desbloquear el siguiente nivel | **≥ 90 %** en una ronda de desafío de **≥ 30 notas**, cada nota con **≥ 4 de sus 5 últimas** acertadas y **mediana del tiempo de respuesta ≤ objetivo** | Moderada |
| Consolidación | Repetir **≥ 90 %** en una comprobación corta en **otra sesión, ≥ 1 día después** | Moderada |
| Tiempo de respuesta objetivo, adulto con botones | **2,0 s** al empezar → **1,4 s** con el pentagrama completo → **1,2–1,3 s** en los niveles finales; nivel experto **≈ 1,0 s** | Moderada + Diseño |
| Multiplicador por edad | 5–7 años ×1,8 · 8–10 ×1,5 · 11–13 ×1,25 · ≥ 14 ×1,0 | Débil |
| Multiplicador por contexto | Líneas adicionales ×1,2 · claves mezcladas ×1,1 · alteración escrita ×1,2 · armadura ×1,25 · teclado de piano ×1,2 (×1,3 si se exige la octava exacta) | Moderada (Wood) + Diseño |
| Límite de tiempo en la fase «desafío» | Bajar por etapas: **4 → 3 → 2 → 1,5 s** (adultos) | Moderada (Galvão) |
| Al empezar un nivel | **Sin tiempo**; el temporizador solo aparece cuando la precisión es alta | Moderada |
| Repaso tras un error | Volver a preguntar la misma nota a los **2–3 ensayos** y otra vez a los **6–8**, e intercalar la nota con la que se confundió | Diseño (basado en el repaso incremental) |
| Repaso entre sesiones | Cajas de Leitner con intervalos de **1, 2, 4, 8, 16 y 32 días** | Fuerte (espaciado) + Diseño (intervalos) |
| Parte de la sesión dedicada a repaso | **25–30 %** | Diseño |
| Duración de la sesión | Niños **5–8 min**, adultos **10–15 min**, en rondas de **20 notas** | Débil + Diseño |
| Feedback tras un error | Inmediato, con **la respuesta correcta**, el sonido y una pista que muestre la nota de referencia (landmark) más cercana | Fuerte (dar la respuesta) / Moderada (resto) |
| Sonido | Que suene la nota **después** de responder, nunca antes | Débil–moderada |
| Leaderboards globales | **No** (desmotivan a quien va por detrás). Sí comparar con uno mismo | Moderada |

---

## 1. Qué dice la evidencia

### 1.1 Pedagogía de lectura de notas

#### Landmarks e intervalos frente a frases mnemotécnicas

- En la pedagogía de piano actual domina la combinación de **notas de referencia («landmarks» o «guide notes») con lectura por intervalos**. El alumno memoriza pocas notas ancla (habitualmente Do grave de la clave de fa, Fa de la clave de fa, Do central, Sol de la clave de sol y Do agudo de la clave de sol) y deduce las demás contando pasos (2ª) y saltos (3ª) desde ellas [F1][F2][F4][F9]. **[Débil]**: es consenso docente, no un resultado experimental.
- Contra las frases mnemotécnicas tipo «Every Good Boy Does Fine»: los docentes las consideran el método más lento para identificar una nota, porque hay que elegir la frase según la clave y si la nota está en línea o en espacio, recitarla y luego encontrar la letra. Se toleran, como mucho, como andamio pasajero [F1][F2]. **[Débil]**: no encontré ningún estudio que compare directamente mnemotecnias con landmarks.
- Los lectores expertos **no cuentan**: reconocen patrones geométricos. En pianistas expertos, las octavas se leen mejor (85,8 %) que las notas sueltas (76,5 %), y los errores con líneas adicionales delatan una lectura por la forma y no por el recuento de líneas [F19]. Bean (1973) concluyó que captar de un vistazo patrones de tres o más notas es esencial para leer rápido [F29]. **[Moderada]**

#### Do central, lectura interválica y método multi-tonalidad («Middle C», «intervallic», «multi-key»)

- **DiCienzo (2019, tesis de máster, Universidad de Ottawa)** comparó alumnos de 7 a 11 años que aprendían con el método del Do central con otros que seguían el método interválico mixto. Contra su hipótesis, el grupo del **Do central superó al interválico en todas las pruebas** (identificación de notas en clave de sol y de fa, intervalos, patrones, lectura a primera vista), salvo en la identificación de teclas y en los patrones de 3 notas en posición de Sol [F16]. **[Moderada–débil]**: diseño cuasi-experimental con alumnos que ya usaban cada método y muestra pequeña. Aun así, sugiere que **nombrar notas sueltas con soltura sí aporta**, que es justo lo que entrena este juego.
- **Emond y Comeau (2013)**, con modelos cognitivos, estimaron que el método interválico exige más conocimiento declarativo sobre las notas y más planificación que el del Do central [F17]. **[Moderada]**: es una simulación.
- **Implicación:** el juego no tiene que elegir bando. El nombrado rápido de notas (lo que se entrena aquí) es un componente que complementa la lectura por intervalos del método que use el alumno. Usamos los landmarks como **orden de introducción y como pista tras un error**, no como sustituto del nombrado.

#### Cómo ordenan las notas los métodos

| Método | Orden de introducción | Fuente |
|---|---|---|
| **Faber, Piano Adventures (Primer)** | Primero teclas (Do-Re-Mi, Fa-Sol-La-Si); luego las claves, **Do central → Sol de la clave de sol → Fa de la clave de fa**; después las notas vecinas; Re y Do graves más tarde. Posiciones de Do central y de Do | [F5] **[Débil–moderada]** (índice del libro según un listado) |
| **Alfred's Premier Piano Course** | Landmarks en vez de posiciones fijas de mano. **La clave de fa se introduce primero**, «porque muchos alumnos leen mejor la de sol». Primero pasos y saltos, luego intervalos uno a uno. Desde la pre-lectura se usa todo el teclado | [F4] **[Débil]** (material del editor) |
| **The Music Tree (Clark, Goss, Holland)** | Pre-lectura fuera del pentagrama; luego pentagramas de **2, 3 y 4 líneas** antes del de 5 con claves. Enfoque interválico | [F6] **[Débil]** |
| **Celebrate Piano!** | 1A: pre-lectura en teclas negras; en la unidad 3 llega el pentagrama de 5 líneas con notas en línea y en espacio y los pasos. **Las claves no aparecen hasta 1B**, junto con landmarks, líneas adicionales y alteraciones | [F7] **[Débil]**. No pude verificar el orden exacto de sus landmarks |
| **Piano Town (Snell y Hidy)** | Multi-tonalidad que arranca en el Do central, con foco en intervalos (2ª a 5ª, de uno en uno). El cuaderno de lectura de notas presenta **por separado las notas en línea y las notas en espacio, alternando clave de sol y clave de fa**, y después lo junta todo en el gran pentagrama | [F8] **[Débil]** |
| **Piano Safari** | 2ª desde landmarks → 3ª → 2ª y 3ª → gran pentagrama → 3ª con 5ª → 2ª con 4ª. Empareja intervalos «del mismo tipo» (3ª y 5ª van de línea a línea o de espacio a espacio) para contrastarlos | [F3] **[Débil]** |
| **Kodály** | Solmisación relativa (Do móvil): sol-mi → la → do → re (pentatónica) → fa y si. Sonido antes que símbolo. No pude verificar cuándo se introducen los nombres absolutos | [F10] **[Débil]** |
| **Gordon (Music Learning Theory)** | «Sonido antes que vista»: la notación se asocia a sonidos que el alumno ya oye interiormente (audiación) | [F11] **[Débil]** (teoría) |
| **Conservatorio español (Elda, enseñanzas elementales 2024/25)** | 1º: **clave de sol** (mínimos: Do3–Do4 franco-belga, es decir, del Do central al Do del 3er espacio; programa completo de Mi2 a Do5 con líneas adicionales) **+ clave de fa en 4ª** (Do2–Do3 franco-belga, del Do del 2º espacio al Do central) + alteraciones. 2º: lectura en sol y fa. 3º: **clave de do en 3ª** y escritura de la armadura. 4º: do en 4ª. Se evalúa «lectura de notas con cambios de claves» | [F13] **[Moderada]** como referencia del contexto español; los rangos los interpreto en índice franco-belga |

**Patrón común:** se empieza por un landmark central (Do central o Sol de la clave de sol), se añade lo cercano por pasos, se trabajan por separado línea y espacio, la clave de fa entra pronto, el gran pentagrama llega cuando ambas claves funcionan por separado, y las alteraciones van antes que las armaduras.

### 1.2 Investigación específica sobre lectura de notas: tiempos y errores

**Wood (2016), *Visual Confusion in Piano Notation*, TENOR** [F18]. **[Moderada]**

- Participantes: 22 adultos, de aficionados a profesionales. Tarea: leer en pantalla tríadas de 3 notas y tocarlas en un teclado MIDI. Ojo: son **tríadas, no notas sueltas**.
- **Clave de fa más lenta que la de sol en todos los participantes.** Grupo experto: 1115 ms en clave de sol frente a 1233 ms en clave de fa (+118 ms). Grupo intermedio: 1835 frente a 2044 ms (+209 ms). También hubo más errores en clave de fa, y ningún participante leyó mejor la clave de fa, ni siquiera los zurdos ni quienes leían habitualmente en clave de fa.
- **Coste de cambiar de clave:** +46 ms en expertos y +138 ms en intermedios.
- **Armadura:** fue el efecto más fuerte. Expertos: 1011 ms sin alteraciones frente a 1196 ms en la tonalidad más lenta (2♯). Intermedios: 1678 frente a 2298 ms (4♯). En conjunto, la armadura **añade alrededor de un 25 %** al tiempo de respuesta. 16 de los 22 participantes rindieron mejor sin alteraciones.
- **Adaptación:** tras un cambio de armadura, el tiempo de respuesta baja 74 ms (expertos) y 148 ms (intermedios) entre el primer y el segundo tercio del bloque.
- **Cerca del 50 % de los errores de una sola nota consistían en olvidar la última alteración de la armadura**: el 4º grado en las tonalidades con bemoles y el 7º en las de sostenidos.

**Aiba y Sakaguchi (2018), *Frontiers in Psychology*** [F19]. **[Moderada]**

- Participantes: 16 pianistas titulados. Veían la nota durante solo **300 ms** y luego la tocaban.
- Acierto global del 78 %: 76,5 % con notas sueltas, 85,8 % con octavas, 62,9 % con séptimas. Con alteración escrita, 73,2 % frente a 78,6 % sin ella.
- **Las notas sueltas solo se leían con fiabilidad hasta la 3ª línea adicional.**
- Cuatro tipos de error. Tipo I: confundir la nota con una vecina que tiene la **misma configuración de líneas adicionales** (por ejemplo, leer un Do como La o Mi). Tipo II: interferencia de las alturas habituales. Tipo III: sesgo hacia las notas más frecuentes (leer Sol♭ como La♭, que aparece más en armaduras). Tipo IV: combinaciones de los anteriores.
- Los autores concluyen que los pianistas leen patrones geométricos «sin contar lógicamente las líneas adicionales».

**Galvão (2022), tesis de máster, Universidade Federal de Minas Gerais** [F20]. **[Moderada]**: n = 13 adultos, pero describe un protocolo calcado a lo que queremos construir.

- Las 7 notas de clave de sol se enseñaron **por acumulación: 2 → 3 → 4 → 5 → 6 → 7 notas**, con el criterio de acertar N notas seguidas para pasar de bloque.
- **Criterio de experto:** ≥ 90 % de aciertos y **≥ 35 notas correctas por minuto** (≈ 1,7 s por nota, incluida la respuesta con teclas).
- **Entrenamiento de velocidad** con plazo límite decreciente: **4 s → 3 s → 2 s → 1 s** (en la práctica 1,5 s); para pasar de bloque había que acertar 7 seguidas.
- Resultados en la dirección «ver la nota y dar su nombre»: de 32,4 notas correctas por minuto (1,85 s/nota) a **41,0 por minuto (1,46 s/nota)** en una sola sesión.
- A los 14 días la precisión se mantenía (≈ 84 % de media) pero **la velocidad había caído** a 26,1 por minuto (2,29 s). Bastó repetir el entrenamiento para llegar a 45,9 por minuto (**1,30 s/nota**), y 6 de los 10 novatos superaron la media de los expertos.
- **Lo aprendido con negras no se generalizó a redondas ni a corcheas.** Lección: hay que variar la figura y la plica para que el jugador no se apoye en pistas irrelevantes.

**Grégoire, Perruchet y Poulin-Charronnat (2013, 2015): efecto Stroop musical** [F21][F22]. **[Moderada]**

- Participantes: niños franceses que nombraban notas (DO, RE, MI…) entre el Do central y el Do del 3er espacio en clave de sol.
- Cometían pocos errores (3,4 % de media) y **nombraban más rápido a cada año de formación**.
- La interferencia, que delata que leer la nota se ha vuelto automático, **aparece ya en el 2º año** y crece de forma lineal hasta el 5º.
- **Implicación:** la automaticidad tarda años de práctica real. Un juego puede acelerarla, pero no conviene prometer «automaticidad» en semanas.
- Detalle de diseño copiable: **la posición del estímulo en pantalla cambiaba entre ensayos** para que la memoria visual del ensayo anterior no ayudara.

**D'Anselmo y cols. (2018): lectura en siete claves** [F23]. **[Moderada]**

- Participantes: 63 músicos.
- La precisión y el tiempo de respuesta **empeoran cuanto más se aleja la clave de la de sol**, lo que apunta a un código espacial anclado en ella.
- **Implicación:** la clave de do (y en parte la de fa) tiende a leerse transportando desde la de sol. Hay que entrenarla con sus propios landmarks y con ejercicios de contraste.

**Stewart y cols. (2003) y Stewart (2005)** [F24]. **[Moderada]**

- Tras 15 semanas aprendiendo a leer y tocar teclado, los principiantes mostraban activación parietal compatible con una traducción automática del código espacial de la partitura a pulsaciones.
- **Implicación para la respuesta:** en pianistas, leer es sobre todo pasar de una posición en el pentagrama a una tecla, no necesariamente decir el nombre. De ahí que el modo de respuesta con teclado tenga sentido para ellos (§ 2.4).

**Otros predictores y estudios de intervención**

- **Kopiez y Lee (2006):** los mejores predictores de la lectura a primera vista fueron la velocidad psicomotora, la experiencia de lectura acumulada hasta los 15 años, la velocidad de procesamiento y la audición interna (en conjunto, alrededor del 60 % de la varianza) [F25]. **[Moderada]** Apoya combinar lo visual con lo auditivo (que suene la nota).
- **Mishra (2014, metaanálisis de 92 estudios) y Mishra (2015):** las intervenciones para mejorar la lectura a primera vista tienen efectos modestos. En ritmo funcionan los sistemas de conteo, el movimiento y la práctica intensiva; modificar la notación no mejoró la lectura [F26]. **[Fuerte]** como panorama general.
- **Goodenough (2010):** con alumnos de 3º de primaria, practicar 10 minutos con un entrenador de notas en ordenador (Note Trainer, de musictheory.net) dio más del doble de aciertos que las tarjetas en parejas tras la 1ª sesión, y un 30 % más tras la 3ª [F27]. **[Débil–moderada]**
- **Gudmundsdottir (2010)** analizó los errores de lectura de 35 alumnos de piano de 6 a 13 años y señala que la adquisición en la infancia está mucho menos estudiada que la lectura experta [F28]. **[Moderada]**, pero no pude leer el texto completo, así que no uso sus porcentajes.

### 1.3 Ciencia del aprendizaje aplicable

**Práctica de recuperación: preguntar en vez de mostrar.**

- Practicar respondiendo supera a repasar (metaanálisis de Adesope y cols., 2017: efecto medio de g ≈ 0,5–0,6, y ≈ 0,67 en el aula según resúmenes secundarios). Los mayores efectos aparecen con 1 a 6 días entre la práctica y el examen [F34].
- Dunlosky y cols. (2013) califican la práctica de recuperación y la práctica espaciada como las técnicas de **mayor utilidad**, y el intercalado como de utilidad moderada [F33].
- **[Fuerte]** Un juego de identificar notas ya es práctica de recuperación por diseño.

**Espaciado.**

- El intervalo óptimo entre repasos crece con el tiempo que se quiere recordar: alrededor del 20–40 % de ese tiempo si es una semana y del 5–10 % si es un año (Cepeda y cols., 2008, más de 1350 participantes) [F35]. **[Fuerte]**
- El sobreaprendizaje masivo (repetir mucho en una sola sesión) da beneficios que se esfuman pronto. Espaciar es más eficiente [F43]. **[Moderada–fuerte]**

**Intercalado.**

- Intercalar categorías supera a practicarlas en bloque, con g = 0,42 de media, y **el beneficio es mayor cuanto más se parecen entre sí las categorías** (Brunmair y Richter, 2019, 59 estudios) [F36].
- Kornell y Bjork (2008): el intercalado gana aunque los participantes crean que les ayudó más practicar en bloque [F37].
- Carvalho y Goldstone (2014): intercalar conviene con categorías **muy parecidas**; practicar en bloque, con categorías poco parecidas [F38].
- **[Fuerte]** Las notas vecinas (Mi y Fa, línea frente a espacio) son categorías muy parecidas, así que hay que intercalarlas pronto y emparejar a propósito las que se confunden.

**Dificultad deseable.**

- Espaciar, intercalar y preguntar ralentizan la ejecución inmediata pero mejoran la retención, **siempre que el alumno pueda acertar**; si no puede, la dificultad deja de ser deseable [F39]. **[Fuerte]**

**¿Cuánto acierto conviene durante la práctica?**

- **Wilson y cols. (2019)** demuestran que, en algoritmos que aprenden por gradiente en tareas de clasificación binaria, el error óptimo es de alrededor del **15,87 %** (≈ 85 % de acierto). Los propios autores advierten que no se traslada sin más al aula [F40]. **[Moderada]** como guía para el aprendizaje perceptivo; **[Débil]** como ley para personas.
- **Rosenshine (2012):** «la tasa de éxito óptima para fomentar el aprendizaje parece estar en torno al **80 %**». En matemáticas de 4º, los mejores docentes lograban un 82 % de respuestas correctas y los peores, un 73 % [F41]. **[Moderada]**
- Conclusión: mantener la práctica **entre el 80 y el 90 %**.

**Criterio de dominio.**

- En adquisición de habilidades, los criterios del 50 % y el 80 % mantuvieron peor lo aprendido que el del 90 % (Fuller y Fienup, 2018).
- Exigir el **100 % en varias sesiones** o el 90 % en sesiones consecutivas mejora el mantenimiento, y una revisión sistemática de 2022 favorece el «100 % en dos sesiones» frente al 80 % habitual [F42].
- **[Moderada]**: son estudios clínicos con niños con autismo, así que extrapolamos. Respaldan dos cosas: exigir **≥ 90 %** y **pedir que se repita en otra sesión**.

**Repaso incremental (incremental rehearsal).**

- Presentar **1 ítem nuevo intercalado entre 8 o 9 conocidos** (proporción 90/10), con huecos crecientes, da mejor retención que las tarjetas tradicionales con todo nuevo [F44]. **[Moderada]**
- **Memoria de trabajo:** el límite central ronda los **4 bloques de información** en adultos y es algo menor en niños (Cowan, 2001) [F49]. **[Fuerte]** para adultos; lo de los niños es secundario.
- **Implicación:** introducir 1–2 notas nuevas a la vez, rodeadas de conocidas.

**Feedback.**

- Decir solo «bien» o «mal» **no ayudó más que no decir nada**; dar la **respuesta correcta** sí ayudó, y el efecto seguía a la semana (Pashler y cols., 2005) [F45]. **[Moderada–fuerte]**
- En preguntas de opción múltiple (como 7 botones), dar feedback **reduce que se aprendan los distractores** (Butler y Roediger, 2008) [F47]. **[Moderada]**
- En contextos aplicados, el feedback inmediato funcionó mejor que el diferido (Kulik y Kulik, 1988, según Smith y Kimball). El diferido favoreció la transferencia en tareas conceptuales universitarias (Mullet y cols., 2014), que no es nuestro caso [F46]. **[Moderada]**

**Multisensorial.**

- Entrenar con estímulos audiovisuales congruentes aceleró el aprendizaje visual frente a entrenar solo con lo visual [F48]. **[Moderada]** en general; **[Débil]** para la notación en concreto, porque no encontré estudios que prueben que oír la nota mejore el aprendizaje de su nombre.

**Velocidad de procesamiento y respuesta táctil.**

- Un niño de 8 años procesa aproximadamente **la mitad de rápido que un adulto**, y uno de 4–5 años, a un tercio (Kail, 1991, citado en [F56]). **[Moderada]**
- En adultos, el tiempo de reacción de elección en un iPad ronda los **400 ms** [F57].
- Los niños **fallan el objetivo táctil en el 46 % de los toques, frente al 32 % de los adultos** [F58]. **[Moderada]** Hacen falta botones grandes.

**Umbrales de «automaticidad» en otros dominios.**

- En las tablas de multiplicar se citan umbrales de 1 a 3 s por hecho, o de 40–60 dígitos correctos por minuto [F55]. **[Débil]**: fuentes comerciales.
- En precision teaching el objetivo se fija en respuestas correctas por minuto, por ejemplo el 90 % de lo que logra un alumno competente [F53]. **[Débil]**

**Gamificación.**

- **Sailer y Homner (2020, metaanálisis):** efectos pequeños-moderados y positivos sobre el aprendizaje (g ≈ 0,49), la motivación (0,36) y la conducta (0,25), según resúmenes secundarios. La ficción narrativa y la interacción social moderan el efecto, y los efectos motivacionales son menos estables en los estudios más rigurosos [F59]. **[Fuerte]** en la dirección; las cifras exactas, por verificar.
- **Deci, Koestner y Ryan (1999, 128 estudios):** las recompensas tangibles **reducen la motivación intrínseca**: d = −0,40 si dependen solo de participar, −0,36 si dependen de completar y −0,28 si dependen del rendimiento [F60]. **[Fuerte]**
- **Rachas:** mostrar una racha intacta aumenta el uso posterior frente a mostrarla rota. El daño de romperla disminuye si **se puede reparar** (Silverman y Barasch, 2023, 7 estudios) [F61]. **[Moderada]**
- **Leaderboards, insignias, competición y puntos** son los elementos que más se asocian a efectos negativos, como peor rendimiento y desmotivación, sobre todo en los alumnos que van por detrás (revisión de 87 artículos) [F62]. **[Moderada]**

**Presión de tiempo.**

- Cronometrar explícitamente sube la velocidad en tareas **fáciles** y en alumnos con nivel de práctica, pero **no** en quien aún no domina la tarea. Puede bajar la precisión en la fase de adquisición. Añadir feedback inmediato potencia su efecto [F54]. **[Moderada]** (en matemáticas).
- En notas, el entrenamiento con plazos decrecientes de Galvão mejoró la velocidad **después** de que la precisión estuviera asentada [F20].

---

## 2. Respuestas a las 8 preguntas

### 2.1 ¿En qué orden se introducen las notas en cada clave?

**Principios** (detrás de cada uno, la evidencia citada en § 1):

1. **Empezar por landmarks visualmente distintos y fáciles de anclar**: el Do central (línea adicional) y la nota que marca la clave (Sol en la 2ª línea de la clave de sol, Fa en la 4ª de la de fa, Do en la 3ª de la de do) [F4][F5][F9]. **[Débil–moderada]**
2. **Crecer por pasos alrededor de los landmarks**, con **2 notas nuevas por nivel**, cada una vecina (a una 2ª) de algo ya conocido [F3][F20][F44]. **[Moderada + Diseño]**
3. **Contrastar línea y espacio desde el principio**: es la confusión visual más básica (tipo I de Aiba). Piano Town incluso las presenta por separado [F8][F19]. **[Moderada]**
4. **Primero el pentagrama completo de una clave, después las líneas adicionales.** Excepción: el Do central, que es landmark desde el nivel 1. Las líneas adicionales entran por sus propios landmarks (Do agudo a 2 líneas por encima del pentagrama de sol y Do grave a 2 líneas por debajo del de fa [F9]) y sus vecinas, con un **máximo de 3 líneas adicionales**, porque ni los expertos leen con fiabilidad más allá [F19]. **[Moderada]**
5. **La clave de fa entra pronto y alternada con la de sol**, no cuando la de sol ya está «terminada». Todos los participantes de Wood leían peor la clave de fa (los zurdos lo atribuían a haber aprendido antes la de sol), y Alfred llega a introducirla primero por ese motivo [F4][F18]. Ruta recomendada: primera octava de sol → primera octava de fa → resto de sol → resto de fa. **[Moderada + Diseño]**
6. **El gran pentagrama, cuando ambas claves están completas por separado**, entrenando a propósito la **alternancia de claves**, que tiene coste medible (+46 a +138 ms [F18]), y la zona central «misma nota, dos escrituras» (Si3, Do4, Re4 en ambas claves). **[Moderada]**
7. **Alteraciones escritas antes que armaduras**, y siempre sobre notas ya fluidas. Empezar por **Fa♯ y Si♭**, las primeras alteraciones de las armaduras, que más tarde ayudan en Sol M y Fa M [Diseño]. Las alteraciones bajan la precisión incluso en expertos (73 % frente a 79 % [F19]).
8. **Armaduras por número de alteraciones, alternando sostenidos y bemoles**: Sol M y Fa M (1) → Re M y Si♭ M (2) → La M y Mi♭ M (3) → Mi M y La♭ M (4) → más (opcional). Las tonalidades centrales son las más rápidas y la armadura añade alrededor de un 25 % al tiempo [F18]. **Hay que sobrerrepresentar las notas afectadas, en especial la última alteración de la armadura** (el 4º grado con bemoles y el 7º con sostenidos), porque olvidarla explica la mitad de los errores [F18]. **[Moderada]**
9. **Clave de do en 3ª**: va en una ruta propia y opcional, pensada para quien toca viola o para alumnos avanzados. Se desbloquea tras la primera octava de sol, o directamente si el perfil es de viola. Su landmark es el **Do central en la 3ª línea** [F14], y conviene entrenarla con contrastes porque tiende a leerse «transportando» desde la de sol [F23]. En España aparece en 3º de las enseñanzas elementales [F13]. **[Moderada + Diseño]**
10. **Nada de frases mnemotécnicas en el núcleo del juego.** La pista tras un error muestra el landmark más cercano y cuántos pasos hay [F1][F2]. **[Débil]**

**Ruta por perfil de instrumento [Diseño]:**

- **Piano:** pre-lectura → S1–S5 → F1–F5 → S6–S8 → F6–F8 → G1–G2 → líneas adicionales (S9–S11, F9–F10) → G3–G4 → alteraciones → armaduras → G5. Véase el currículo en § 2.8.
- **Instrumentos en clave de sol** (violín, flauta, voz, guitarra): S1–S13 → alteraciones X1–X3 → armaduras en clave de sol.
- **Instrumentos en clave de fa** (chelo, fagot, trombón): F1–F11 → X4 → armaduras en clave de fa.
- **Viola:** A1–A7, y la clave de sol como ruta secundaria.

### 2.2 ¿Cuántas notas en el pool activo y qué criterio de dominio?

**Pool [Moderada + Diseño]:**

- **Inicio: 2–3 notas.** Galvão empieza con 2 [F20]; con 2 notas el acierto por azar es del 50 %, pero el objetivo de este nivel es formar la asociación, no medir.
- **Crecimiento: 2 nuevas por nivel**, hasta **6–8** en la primera octava y **12–16** con el pentagrama completo y algunas líneas adicionales.
- **Excepción:** en los niveles de combinación sin notas nuevas (jefes finales de clave, G2–G5, K5) aparecen más ítems (20–30), porque todos son conocidos. El tope de 12–16 vale para los ítems que aún se están aprendiendo; en estos niveles el peso hace que salgan más las notas flojas.
- **Ítem**, en el modelo del juego, = (clave, altura, contexto de alteración o armadura). Por ejemplo, «Fa♯5 con sostenido escrito» y «Fa5 bajo armadura de Sol M» son ítems distintos.
- **Composición de la sesión:** ~70 % del nivel actual y ~25–30 % de repaso espaciado de niveles anteriores. Lo dominado sale del pool activo y vuelve cuando le toca por su intervalo (§ 2.3).
- **Introducción de una nota nueva al estilo del repaso incremental** [F44]:
  1. Presentarla unos 5 s: la nota sobre el pentagrama, su relación con el landmark («Sol → La: un paso arriba»), el nombre y el sonido.
  2. Preguntarla en los ensayos +0, +2, +5, +9 y +14 respecto a su introducción (huecos crecientes de 2, 3, 4 y 5), con notas conocidas entre medias.
  3. La segunda nota nueva del nivel no arranca hasta que la primera lleva 3 presentaciones.

**Criterio para desbloquear un nivel** (todas las condiciones a la vez) **[Moderada]**:

| Condición | Valor | Justificación |
|---|---|---|
| Precisión global en la ronda de desafío | **≥ 90 %** en ≥ 30 notas (≥ 92 % en los niveles de repaso o «jefe») | Más del 80 % para mantener lo aprendido [F42]; criterio de experto de Galvão [F20] |
| Precisión de cada nota | **≥ 4 de sus 5 últimas** presentaciones | Que la media no esconda una nota floja [Diseño] |
| Velocidad | **Mediana** del tiempo de respuesta en aciertos **≤ objetivo** del nivel (tabla en § 2.8) × multiplicador de edad × multiplicador de entrada | Ver la tabla siguiente |
| Consolidación (no bloquea, pero da la insignia) | ≥ 90 % en una comprobación de 10–15 notas en **otra sesión, ≥ 1 día después** | El criterio en varias sesiones mejora el mantenimiento [F42]; espaciado [F35] |

**De dónde salen los objetivos de tiempo** (adulto respondiendo con 7 botones de nombre):

- **2,0 s al empezar un nivel**: los novatos de Galvão pasaron de 1,85 a 1,46 s por nota en una sesión; el umbral de experto era 1,7 s (35 por minuto) [F20].
- **1,4 s con el pentagrama completo** y **1,2–1,3 s en los niveles finales**: alcanzable, puesto que los novatos llegaron a 1,30 s tras el segundo entrenamiento [F20].
- **Estrella de maestría ≈ 1,0 s** (60 por minuto). Hay que restar unos 400 ms de componente motora en táctil [F57]. Como referencia, los expertos de Wood tardan unos 1,1 s **por tríada** leída y tocada [F18]. **[Moderada + Diseño]**
- **Multiplicadores de edad** (5–7 años ×1,8; 8–10 ×1,5; 11–13 ×1,25), basados en Kail (≈ ×2 a los 8 años [F56]) y en la menor precisión táctil de los niños [F58]. **[Débil]**: hay que calibrarlos con datos propios.
- **Personalización recomendada [Diseño]:** medir la «velocidad motora» de cada jugador (mediana de sus 3 notas más dominadas) y no exigir a ninguna nota menos de 1,3 veces esa base. Así no se penaliza a quien es lento con el dedo pero ya lee bien.
- Usar siempre la **mediana**, no la media, y descartar del cálculo de velocidad las respuestas de más de 8 s (distracciones), aunque sigan contando para la precisión.

**Estrellas por nivel [Diseño]:**

- ★: aprobado (≥ 90 % y mediana ≤ objetivo).
- ★★: ≥ 95 % y mediana ≤ 0,85 × objetivo.
- ★★★: 20 seguidas sin fallo y mediana ≤ 0,7 × objetivo.

Las estrellas informan de la competencia; no son un premio por jugar [F60].

### 2.3 ¿Cómo programar el repaso de las notas flojas?

**Recomendación:** un sistema híbrido. **Dentro de la sesión**, elección aleatoria ponderada con colas forzadas (introducción incremental y reinserción tras error). **Entre sesiones**, cajas de Leitner con intervalos que se duplican.

- **¿Por qué no SM-2 de entrada?** SM-2 (intervalos de 1 día, 6 días y luego anterior × factor de facilidad, con facilidad inicial 2,5 y mínima 1,3, y vuelta a 1 día si la nota es < 3 [F51]) está pensado para miles de tarjetas y respuestas autoevaluadas.
- **¿Por qué Leitner?** Aquí hay menos de 150 ítems y medimos objetivamente acierto y tiempo. Leitner (tarjetas que suben de caja si se aciertan y vuelven abajo si se fallan [F52]) es más simple, transparente y fácil de depurar. **[Diseño]**
- **Evolución:** cuando haya datos, se puede ajustar un modelo de vida media del recuerdo (half-life regression, de Settles y Meeder). En Duolingo predijo el recuerdo con casi la mitad de error que su sistema Leitner original [F50]. **[Moderada]**

**Estado de cada ítem:**

```ts
interface ItemState {
  box: number;             // 0 = en aprendizaje (solo nivel actual); 1..6 = Leitner
  dueAt: number;           // epoch ms del próximo repaso
  acc: number;             // EWMA de acierto (α = 0.3), valor inicial 0.5
  logRt: number | null;    // EWMA de ln(TR) en aciertos (α = 0.3)
  n: number;               // presentaciones totales
  lastTrial: number;       // índice del último ensayo en que apareció
  confusedWith: Record<string, number>; // id respondido en su lugar -> veces
}
const LEITNER_DAYS = [0, 1, 2, 4, 8, 16, 32];
```

**Elección del siguiente ensayo (dentro de la sesión):**

```ts
function nextItem(ctx): ItemId {
  // 1) Colas forzadas, por prioridad:
  //    a) reinserción tras error (a +2..3 y a +6..8 ensayos del fallo)
  //    b) calendario de introducción incremental de la nota nueva (+0, +2, +5, +9, +14)
  //    c) "pareja de confusión": la nota que el jugador respondió por error, en +1..4
  if (ctx.forcedQueue.hasDue(ctx.trial)) return ctx.forcedQueue.pop(ctx.trial);

  // 2) Elección aleatoria ponderada sobre el pool (nivel actual + repasos vencidos)
  return weightedRandom(ctx.pool, (id) => {
    const s = ctx.state[id];
    const gap = ctx.trial - s.lastTrial;
    if (gap <= 1) return 0;                        // nunca repetir seguido
    let w = 1;
    w *= 1 + 2.5 * (1 - s.acc);                    // notas flojas
    const ratio = s.logRt != null ? Math.exp(s.logRt) / ctx.targetMs(id) : 1;
    w *= 1 + clamp(ratio - 1, 0, 1);               // notas lentas
    if (s.box > 0 && s.dueAt <= ctx.now) w *= 1.5; // repaso vencido
    if (gap === 2) w *= 0.3;                       // separar repeticiones
    if (gap > 2 * ctx.pool.length) w *= 2;         // garantizar cobertura
    return w;
  });
}
```

Restricciones adicionales [Diseño]:

- Que el botón correcto no se repita más de 2 veces seguidas.
- Variar entre ensayos la plica (arriba o abajo), la figura (redonda, blanca, negra, corchea) y la posición horizontal. Galvão vio que lo aprendido con negras no se generalizaba [F20], y Grégoire cambiaba la posición para que no ayudara la memoria visual [F21].

**Controlador de dificultad.** Cada 10 ensayos se mira la precisión de los últimos 20 **[Moderada + Diseño]** [F40][F41]:

- **> 92 %**: endurecer. Aumentar el peso de las notas más lentas o flojas, admitir la siguiente nota nueva y, en las fases con tiempo, bajar el plazo un 10 % sin pasar del mínimo del nivel.
- **80–92 %**: no tocar nada.
- **< 75 %**: suavizar. Congelar la introducción de notas nuevas, sacar temporalmente del pool la última nota introducida y alargar el plazo un 20 %.

**Protocolo tras un error** [F44][F45]:

1. Feedback inmediato (§ 2.4).
2. Volver a preguntar la misma nota a los 2–3 ensayos y otra vez a los 6–8, con distinta figura o plica.
3. Insertar la **pareja de confusión** cerca, para que se vea el contraste [F36][F38].
4. Actualizar `acc`, sumar 1 en `confusedWith` y bajar de caja al cierre de la sesión.

**Cajas de Leitner entre sesiones.** Se actualizan **una vez por ítem y sesión**, usando su primera aparición en esa sesión:

```ts
function endOfSessionUpdate(s: ItemState, firstTryCorrect: boolean, rtMs: number, target: number) {
  if (!firstTryCorrect)      s.box = Math.max(1, s.box - 2); // fallo: bajar dos cajas
  else if (rtMs <= target)   s.box = Math.min(6, s.box + 1); // acierto rápido: subir
  /* acierto lento: se queda en su caja (cuenta la fluidez, no solo el acierto) */
  s.dueAt = now() + LEITNER_DAYS[s.box] * DAY_MS;
}
```

- Intervalos de 1, 2, 4, 8, 16 y 32 días: coherentes con un intervalo óptimo del 10–20 % del tiempo que se quiere retener [F35]. **[Diseño]**
- **Nota «dominada»** = caja ≥ 3, es decir, ha superado al menos dos repasos espaciados. **Nivel «consolidado»** = todos sus ítems en caja ≥ 2.
- **Calentamiento:** cada sesión empieza con hasta 20 ítems vencidos, primero los de caja más baja y los más atrasados, que suman como mucho el 25–30 % de la sesión.
- **Recordatorio de velocidad:** si un nivel lleva más de 14 días sin jugarse, se programa una ronda corta con tiempo, porque la velocidad se pierde antes que la precisión [F20]. **[Moderada]**

### 2.4 Modo de respuesta, sonido y feedback

| Modo | A favor | En contra | Recomendación |
|---|---|---|---|
| **7 botones con el nombre** (Do Re Mi Fa Sol La Si, o C D E… según el idioma) | Mide el nombrado puro; la respuesta motora es la más rápida y estable (mejor medida del tiempo); sirve para cualquier instrumento; los botones caben grandes en el móvil | No enseña registro ni octava; con alteraciones hacen falta modificadores | **Modo por defecto.** Orden fijo de la escala, **nunca barajado**, para que la respuesta motora se automatice y no se mida búsqueda visual [Diseño]. Botones de ≥ 48 px, más grandes en el perfil infantil [F58] |
| **Teclado de piano** | Es la tarea real del pianista: posición en el pentagrama → tecla [F24]; enseña registro; las alteraciones encajan en las teclas negras | Más lento (componente espacial); en el móvil las teclas quedan pequeñas; obliga a saber el teclado; las enarmonías quedan ambiguas | **«Modo piano»**: al principio 1 octava y se acepta cualquier octava; desde el gran pentagrama, 2 octavas con desplazamiento y **octava exacta obligatoria** (entrena el registro y destapa la confusión entre claves). Multiplicador de tiempo ×1,2–1,3 |
| **Solfeo** | En español, **Do-Re-Mi es el propio sistema de nombres (Do fijo)** [F12]; es lo que usan los conservatorios españoles y los franceses [F21] | El **Do móvil** de Kodály (sílaba = grado de la escala) no sirve para nombrar posiciones absolutas | En español, los botones con nombre **son** solfeo de Do fijo. Ofrecer C-D-E como opción (anglosajones). El Do móvil queda para un posible modo de oído, no para este juego |

**Más reglas de respuesta [Diseño]:**

- **No mezclar modos dentro de un nivel**, porque el tiempo de respuesta no sería comparable.
- **Alteraciones:**
  - Modo botones: un selector ♭ ♮ ♯ que se marca antes del nombre, o una pulsación larga.
  - Modo piano: teclas negras, aceptando la enarmonía, salvo en un modo «ortografía» que exija, por ejemplo, Sol♭ y no Fa♯.
- **Nunca escribir el nombre dentro de la cabeza de la nota.** El efecto Stroop musical muestra que nombre y posición compiten [F22], y el nombre se convertiría en muleta.

**¿Debe sonar la nota? Sí, al responder [Débil–moderada]:**

- **A favor:** el entrenamiento audiovisual congruente acelera el aprendizaje [F48], la audición interna predice la lectura a primera vista [F25] y la pedagogía (Gordon, Kodály) defiende asociar el símbolo a un sonido ya conocido [F10][F11].
- **Cómo:** que suene **en el registro correcto** (el Do central como Do central), con timbre de piano. **Al fallar, que suene la nota correcta.** Debe poder silenciarse.
- **Que no suene antes de responder** en los modos de lectura: se convertiría en una prueba de oído y regalaría la respuesta a quien tenga oído absoluto. Podría haber un modo aparte, «escucha y lee».

**¿Mostrar el nombre tras un error? Sí, siempre y al momento [Fuerte en lo esencial]:**

- El simple «mal» no enseña; la respuesta correcta sí [F45]. Con opción múltiple, el feedback además impide aprender el distractor [F47].
- **Feedback recomendado** (≤ 1,5 s, o tocar para seguir):
  1. Resaltar la nota con su nombre correcto, en grande.
  2. Que suene la nota.
  3. Una **pista de landmark**: marcar en el pentagrama el landmark más cercano y una flecha con los pasos («Sol → La, 1 paso»). Así se enseña la estrategia, no solo el dato.
  4. Si la confusión fue de línea o espacio, resaltar si la nota está en línea o en espacio.
- [Diseño] **Pedir al jugador que toque la respuesta correcta antes de seguir.** Cuesta menos de 1 s, convierte la corrección en una respuesta activa y deja la última respuesta registrada como correcta. No tengo una fuente directa para esto, así que conviene probarlo con un test A/B.
- Para daltonismo, que el feedback no dependa solo del rojo o el verde: usar icono y forma.

### 2.5 Presión de tiempo: cuándo ayuda y cuándo perjudica

- **Perjudica en la adquisición.** Mientras el jugador aún no domina una nota, el cronómetro baja la precisión y lleva a practicar errores [F54][F41]. **[Moderada]**
- **Ayuda en la fase de fluidez.** Con la precisión ya alta, los plazos decrecientes suben la velocidad de forma rápida y medible [F20]. **[Moderada]**
- **La velocidad se pierde antes que la precisión** y se recupera rápido con un recordatorio [F20].

**Cada nivel tiene tres fases [Diseño basado en lo anterior]:**

1. **Aprender**: sin tiempo, con el temporizador oculto. Note Rush, por ejemplo, permite ocultarlo a los principiantes [F30]. Se pasa a la fase 2 cuando la precisión móvil es ≥ 85 % y cada nota nueva lleva 3 aciertos.
2. **Practicar**: tiempo «blando». Se muestra la velocidad y se dan estrellas por rapidez, pero agotar el tiempo no cuenta como fallo.
3. **Desafío**: plazo duro (si se agota, cuenta como error y se muestra la respuesta). Plazo **por etapas: 4 s → 3 s → 2 s → 1,5 s** para adultos [F20], multiplicado por la edad. Dentro del desafío conviene adaptar el plazo de cada nota a **máx(plazo del nivel, 1,25 × mediana personal de esa nota)**, para que apriete siempre un poco pero no frustre.

**Progresión a lo largo del currículo** (adulto con botones): plazo del desafío de **4 s** (S1–S2) → **3–3,5 s** (resto de la primera octava) → **2,5 s** (repasos) → **2 s** (pentagrama completo) → **1,5–1,8 s** (niveles finales). Las medianas objetivo, **2,0 → 1,4 → 1,2–1,3 s**, quedan bastante por debajo del plazo, de modo que el plazo solo corta las respuestas atascadas. Los tiempos de cada nivel están en § 2.8.

**¿Es 1–1,5 s por nota un buen objetivo de automaticidad?**

- **Sí, para adultos en táctil**, con la mediana en **1,2 s** y **≈ 1,0 s** para la maestría:
  - Galvão: novatos a 1,3–1,5 s tras dos sesiones; criterio de experto 1,7 s [F20].
  - Componente motora táctil: ≈ 0,4 s [F57].
  - Umbrales de automaticidad en otros dominios: 1–3 s [F55], **[Débil]**.
- **Para un niño de 7 años el equivalente es ≈ 2,0–2,2 s** (×1,8).
- **La automaticidad real**, la que medirían los experimentos de interferencia, **tarda años** [F21]. El juego mide fluidez, no automaticidad en sentido estricto, y conviene comunicarlo con honestidad.

**Excepciones:** sin plazo duro para menores de 7 años en los niveles iniciales, y un «modo relajado» opcional para todos (sin plazo, con estrellas solo por precisión).

### 2.6 Duración de la sesión y gamificación

**Duración [Débil + Diseño, apoyado en el espaciado, que sí es Fuerte]:**

- **Ronda = 20 notas** (≈ 45–90 s).
- **Sesión:** niños de 5–9 años, 3–5 rondas (**5–8 min**); de 10–13 años, 8–12 min; adultos, **10–15 min**. Lo ideal son **4–6 sesiones por semana**: mejor varias cortas que una larga [F33][F35][F43]. Goodenough logró efecto con prácticas de 10 minutos [F27]. En aprendizaje motor musical se ha visto consolidación entre sesiones con sueño de por medio [F63]. **[Débil]**: fuentes secundarias.
- **Estructura de la sesión:**
  1. Calentamiento con repasos vencidos (≤ 20 notas).
  2. Rondas del nivel actual.
  3. Desafío, si el jugador está cerca del criterio.
  4. [Diseño] Cerrar con una ronda corta asequible para terminar con buen sabor de boca. **[Débil]**

**Elementos que conviene usar:**

- **Estrellas por precisión y velocidad**, con criterios explícitos (§ 2.2). Son feedback informativo sobre la competencia.
- **Mapa de progreso con niveles** y un **medidor de dominio por nota** (qué notas están flojas). Aporta información y metacognición.
- **Récords personales y «carrera contra tu fantasma»** en lugar de leaderboards [F62].
- **Racha diaria con «congelación» o reparación**: la racha intacta aumenta el uso, y poder repararla reduce el daño de romperla [F61]. Que la racha se gane con una sesión corta de verdad (≥ 2 rondas), no con abrir la app.
- **Ficción ligera** (personaje, historia, mundos por clave): la ficción narrativa es moderadora positiva en el metaanálisis [F59]. Opcionalmente, colaboración en clase con objetivos comunes.
- **Retos del profesor o de la familia**: compartir niveles o progreso, como hace Note Rush [F30].

**Elementos que conviene evitar:**

- **Leaderboards globales**: son los más asociados a desmotivación y peor rendimiento en quien va por detrás [F62].
- **Vidas o energía que bloquean la práctica**: castigan precisamente a quien más necesita practicar [Diseño].
- **Premios por tiempo jugado o por entrar**: el tipo de recompensa que más reduce la motivación intrínseca (d = −0,40) [F60].
- **Animaciones entre ensayos de más de ~1 s**, cofres y recompensas aleatorias: alargan la sesión sin aprendizaje y añaden carga cognitiva ajena a la tarea [Diseño].
- **Cronómetro por defecto en principiantes** (§ 2.5).

### 2.7 Confusiones frecuentes y cómo atacarlas

La base es **registrar una matriz de confusión** (nota presentada → nota respondida) por jugador y usarla en la elección de ensayos (§ 2.3).

| Confusión | Cómo se detecta en los datos | Qué hace el juego | Evidencia |
|---|---|---|---|
| **Línea frente a espacio** (error de un paso: Mi↔Fa, Sol↔La) | Respuesta a ±1 grado | Nivel de pre-lectura P1 «¿línea o espacio?»; pareja de confusión intercalada; en el feedback, resaltar la línea que atraviesa la nota o el espacio que ocupa | Tipo I de Aiba [F19]; Piano Town separa línea y espacio [F8]; el intercalado ayuda con categorías parecidas [F36] — **Moderada** |
| **Leer la clave de fa como si fuera la de sol** (error de una 3ª: Sol2 en la 1ª línea leído como «Mi») | La respuesta coincide con el nombre que tendría esa posición en la otra clave | Clave de fa pronto y alternada; en G1–G3, ejercicios de «misma posición, dos claves»; clave muy visible y coloreada en el gran pentagrama; sobrerrepresentar la clave de fa (peso ×1,3) | La clave de fa es más lenta y da más errores [F18][F29]; testimonios en foros [F32] — **Moderada** (el desplazamiento de una 3ª concreto es **Débil**) |
| **Contar líneas adicionales** (Do6 leído como La5 o Mi6) | Error de ±2 grados con la misma configuración de líneas | Introducirlas por landmarks (Do agudo, Do grave) y vecinas; contrastar notas con igual número de líneas; máximo 3 líneas; animación de la «forma» (nota sobre la línea frente a colgando de ella) | Tipos I y II de Aiba; se lee la geometría, no se cuenta [F19] — **Moderada** |
| **Olvidar la armadura** (sobre todo su última alteración) | Fallo en las notas afectadas, en especial el 4º grado con bemoles y el 7º con sostenidos | El 30–40 % de los ensayos del nivel son notas afectadas; recordatorio de la armadura siempre visible; cambio de armadura cada 10–15 notas en K5 | Wood: ~50 % de los errores de una nota [F18] — **Moderada** |
| **Octava o registro** (modo piano) | Nombre correcto en la octava equivocada | Exigir la octava exacta desde el gran pentagrama; que suene en el registro real | Aiba: la octava se reconoce aunque falle la altura [F19] — **Moderada** |
| **El Do central en dos escrituras** | Fallos en Do4, Si3 o Re4 según la clave | Nivel G3, «zona central» | [Diseño] |
| **Pistas irrelevantes** (plica, figura, posición en pantalla) | Precisión que baja al cambiar la figura o la plica | Variar figura, plica y posición en cada ensayo | Galvão [F20]; Grégoire [F21] — **Moderada** |
| **Alteraciones raras o enarmonías** (Mi♯, Do♭) | Fallos concentrados | Nivel opcional de experto; aceptar la enarmonía en modo piano salvo en el modo ortografía | Tipo III de Aiba (sesgo hacia lo frecuente) [F19] — **Moderada** |

### 2.8 Currículo propuesto (50 niveles)

**Cómo leer la tabla:**

- **Nuevas**: notas (o conceptos) que se añaden en el nivel; se introducen con el calendario incremental de § 2.2.
- **Límite del desafío** y **TR objetivo** (mediana en aciertos) son para un **adulto con botones de nombre**. Hay que multiplicarlos por la edad (5–7 años ×1,8; 8–10 ×1,5; 11–13 ×1,25) y por el modo de entrada (piano ×1,2; piano con octava exacta ×1,3).
- La tabla **ya incluye** los factores de contexto: líneas adicionales, alteraciones y armaduras.
- Criterio por defecto: ≥ 90 % en ≥ 30 notas y cada nota ≥ 4 de sus 5 últimas. «92 %» indica nivel de repaso o «jefe». En todos los niveles, la fase «Aprender» va sin tiempo (§ 2.5).
- Los niveles **K** se crean para la clave o claves de la ruta del jugador.

| ID | Clave | Notas activas al terminar el nivel | Nuevas | Líneas adic. | Alteraciones / armadura | Límite desafío | Precisión · TR objetivo | Requisito |
|---|---|---|---|---|---|---|---|---|
| P1 | Sol | — (¿línea o espacio?; responde con 2 botones) | concepto línea/espacio | 0 | — | sin límite | 90 % · 1,5 s | — |
| P2 | Sol | — (2 notas: ¿sube, baja o repite? ¿paso o salto?) | concepto 2ª/3ª | 0 | — | sin límite | 90 % · 2,0 s | P1 |
| S1 | Sol | Do4, Sol4 | Do4, Sol4 (landmarks) | 1 (Do4) | — | 4,0 s | 90 % · 2,0 s | P2 |
| S2 | Sol | Do4 Re4 Fa4 Sol4 | Re4, Fa4 | 1 | — | 4,0 s | 90 % · 2,0 s | S1 |
| S3 | Sol | Do4–La4 (6) | Mi4, La4 | 1 | — | 3,5 s | 90 % · 1,8 s | S2 |
| S4 | Sol | Do4–Do5 (8) | Si4, Do5 (landmark) | 1 | — | 3,5 s | 90 % · 1,8 s | S3 |
| S5 | Sol | Do4–Do5 (8): **jefe de la 1ª octava** | — | 1 | — | 2,5 s | 92 % · 1,6 s | S4 |
| F1 | Fa | Fa3, Do4 | Fa3 (landmark) + Do4 en clave de fa | 1 (Do4) | — | 4,0 s | 90 % · 2,0 s | S5 |
| F2 | Fa | Mi3 Fa3 Sol3 Do4 | Mi3, Sol3 | 1 | — | 4,0 s | 90 % · 2,0 s | F1 |
| F3 | Fa | Mi3–Do4 (6) | La3, Si3 | 1 | — | 3,5 s | 90 % · 1,8 s | F2 |
| F4 | Fa | Do3–Do4 (8) | Do3 (landmark), Re3 | 1 | — | 3,5 s | 90 % · 1,8 s | F3 |
| F5 | Fa | Do3–Do4 (8): **jefe de la 1ª octava de fa** | — | 1 | — | 2,5 s | 92 % · 1,6 s | F4 |
| S6 | Sol | Do4–Mi5 (10) | Re5, Mi5 | 1 | — | 3,0 s | 90 % · 1,7 s | S5 |
| S7 | Sol | Do4–Sol5 (12) | Fa5, Sol5 | 1 | — | 3,0 s | 90 % · 1,7 s | S6 |
| S8 | Sol | Do4–Sol5 (12): **jefe del pentagrama de sol** | — | 1 | — | 2,0 s | 92 % · 1,4 s | S7 |
| F6 | Fa | La2–Do4 (10) | Si2, La2 | 1 | — | 3,0 s | 90 % · 1,7 s | F5 |
| F7 | Fa | Fa2–Do4 (12) | Sol2, Fa2 | 1 | — | 3,0 s | 90 % · 1,7 s | F6 |
| F8 | Fa | Fa2–Do4 (12): **jefe del pentagrama de fa** | — | 1 | — | 2,0 s | 92 % · 1,4 s | F7 |
| G1 | Gran pentagrama | Landmarks: Do3, Fa3, Do4 (fa), Do4 (sol), Sol4, Do5 | contexto de claves mezcladas | 1 | — | 3,0 s | 90 % · 1,6 s | S8, F8 |
| G2 | Gran pentagrama | Ambos pentagramas sin más líneas adicionales que el Do4 (24 ítems: Fa2–Do4 en clave de fa y Do4–Sol5 en clave de sol) | alternancia frecuente de claves | 1 | — | 2,5 s | 90 % · 1,6 s | G1 |
| S9 | Sol | La3–Sol5 (14) | Si3, La3 | 2 inf. | — | 3,0 s | 90 % · 1,7 s | S8 |
| F9 | Fa | Mi2–Re4 (14) | Mi2, Re4 | 1 sup./inf. | — | 3,0 s | 90 % · 1,7 s | F8 |
| G3 | Gran pentagrama | Zona central: La3, Si3, Do4, Re4, Mi4 escritas en las dos claves | «misma nota, dos escrituras» (Mi4 en clave de fa) | 2 | — | 3,0 s | 90 % · 1,7 s | S9, F9 |
| S10 | Sol | La3–Do6 (16, sin Si5) | La5, Do6 (landmark Do agudo) | 2 sup./inf. | — | 3,0 s | 90 % · 1,7 s | S9 |
| S11 | Sol | Sol3–Do6 (18) | Si5, Sol3 | 2 | — | 2,5 s | 90 % · 1,6 s | S10 |
| F10 | Fa | Do2–Re4 (16) | Re2, Do2 (landmark Do grave) | 2 inf. | — | 3,0 s | 90 % · 1,7 s | F9 |
| G4 | Gran pentagrama | Líneas adicionales exteriores mezcladas: Do2 Re2 Mi2 / La5 Si5 Do6 + todo lo anterior | contexto mezclado | 2 | — | 2,5 s | 90 % · 1,6 s | S11, F10 |
| X1 | Sol | Pentagrama de sol + Fa♯4, Fa♯5, Do♯5 | ♯ (Fa♯, Do♯) | 1 | alteración escrita | 3,0 s | 90 % · 1,7 s | S8 |
| X2 | Sol | + Si♭4, Mi♭4, Mi♭5 | ♭ (Si♭, Mi♭) | 1 | alteración escrita | 3,0 s | 90 % · 1,7 s | X1 |
| X3 | Sol | + becuadro; Sol♯4, La♭4 | ♮, Sol♯, La♭ | 1 | alteración escrita | 3,0 s | 90 % · 1,7 s | X2 |
| K1 | Sol (y Fa según la ruta) | Pentagrama completo bajo **Sol M (1♯)** y **Fa M (1♭)**, en bloques alternos | armadura de 1 alteración; 30–40 % de notas afectadas (Fa♯ / Si♭) | 1 | armadura | 3,0 s | 90 % · 1,8 s | X3 |
| X4 | Fa | Pentagrama de fa + Fa♯3, Do♯3, Si♭2, Mi♭3, ♮ | alteraciones en clave de fa | 1 | alteración escrita | 3,0 s | 90 % · 1,7 s | F8, X3 |
| K2 | Sol + Fa | **Re M (2♯)** y **Si♭ M (2♭)** | énfasis en la última alteración: Do♯ / Mi♭ | 1 | armadura | 3,0 s | 90 % · 1,8 s | K1, X4 |
| X5 | Gran pentagrama | Alteraciones mezcladas + enarmonías comunes (Re♭, Sol♭, La♯, Re♯) | enarmonías | 2 | alteración escrita | 2,0 s | 92 % · 1,5 s | X4, G2 |
| K3 | Sol + Fa | **La M (3♯)** y **Mi♭ M (3♭)** | énfasis en Sol♯ / La♭ | 1 | armadura | 3,0 s | 90 % · 1,8 s | K2 |
| K4 | Sol + Fa | **Mi M (4♯)** y **La♭ M (4♭)** | énfasis en Re♯ / Re♭ | 1 | armadura | 3,0 s | 90 % · 1,9 s | K3 |
| G5 | Gran pentagrama | **Desafío final del gran pentagrama**: Do2–Do6, alternancia frecuente de claves | — | 2 | — | 1,8 s | 92 % · 1,3 s | G4 |
| K5 | Gran pentagrama | Armaduras de 0 a 4 alteraciones mezcladas; cambio de armadura cada 10–15 notas | — | 2 | armadura | 2,0 s | 92 % · 1,6 s | K4, G5 |
| S12 | Sol (opcional) | Sol3–Mi6 (20) | Re6, Mi6 | 3 sup. | — | 2,5 s | 90 % · 1,6 s | S11 |
| S13 | Sol (opcional) | Fa3–Mi6 (21): **jefe final de clave de sol** | Fa3 | 3 | — | 1,8 s | 92 % · 1,3 s | S12 |
| F11 | Fa (opcional) | Do2–Mi4 (17): **jefe final de clave de fa** | Mi4 | 2 | — | 1,8 s | 92 % · 1,3 s | F10 |
| A1 | Do en 3ª | Si3, Do4, Re4 | Do4 en la 3ª línea (landmark) + vecinas | 0 | — | 4,0 s | 90 % · 2,0 s | S5 (o perfil viola) |
| A2 | Do en 3ª | La3–Mi4 (5) | Mi4, La3 | 0 | — | 4,0 s | 90 % · 2,0 s | A1 |
| A3 | Do en 3ª | Sol3–Fa4 (7) | Fa4, Sol3 | 0 | — | 3,5 s | 90 % · 1,8 s | A2 |
| A4 | Do en 3ª | Fa3–Sol4 (9: todas las líneas) | Sol4, Fa3 | 0 | — | 3,0 s | 90 % · 1,7 s | A3 |
| A5 | Do en 3ª | Mi3–La4 (11) | La4, Mi3 | 0 | — | 3,0 s | 92 % · 1,6 s | A4 |
| A6 | Do en 3ª | Mi3–Do5 (13) | Si4, Do5 | 1 sup. | — | 3,0 s | 90 % · 1,7 s | A5 |
| A7 | Do en 3ª | Do3–Do5 (15): **jefe de clave de do** | Re3, Do3 | 1 inf. | — | 2,0 s | 92 % · 1,4 s | A6 |
| X6 | Gran pentagrama (opcional, experto) | Mi♯, Si♯, Do♭, Fa♭ | alteraciones raras | 2 | alteración escrita | 3,0 s | 90 % · 1,8 s | X5 |
| K6 | Gran pentagrama (opcional, experto) | Armaduras de 5 a 7 alteraciones | — | 2 | armadura | 3,0 s | 90 % · 2,0 s | K5 |

**Comprobación de las posiciones** (para quien implemente el renderizado):

- **Clave de sol.** Líneas: Mi4, Sol4, Si4, Re5, Fa5. Espacios: Fa4, La4, Do5, Mi5. Encima: Sol5 en el espacio superior, La5 en la 1ª línea adicional, Do6 en la 2ª, Mi6 en la 3ª. Debajo: Re4 en el espacio inferior, Do4 en la 1ª línea adicional, La3 en la 2ª, Fa3 en la 3ª.
- **Clave de fa.** Líneas: Sol2, Si2, Re3, Fa3, La3. Espacios: La2, Do3, Mi3, Sol3. Encima: Si3 en el espacio superior, Do4 en la 1ª línea adicional, Mi4 en la 2ª. Debajo: Fa2 en el espacio inferior, Mi2 en la 1ª línea adicional, Do2 en la 2ª.
- **Clave de do en 3ª.** Líneas: Fa3, La3, Do4, Mi4, Sol4. Espacios: Sol3, Si3, Re4, Fa4 [F14].

**Total:** 50 niveles. La ruta troncal de piano tiene 38. Los 12 opcionales son S12, S13 y F11 (más de 2 líneas adicionales o jefes finales de clave), A1–A7 (ruta de viola) y X6 y K6 (experto).

**Orden de la ruta troncal de piano:** P1–P2 → S1–S5 → F1–F5 → S6–S8 → F6–F8 → G1–G2 → S9 → F9 → G3 → S10–S11 → F10 → G4 → X1–X3 → K1 → X4 → K2 → X5 → K3 → K4 → G5 → K5.

---

## 3. Lagunas de evidencia y qué medir con la telemetría del juego

Lo que **no** está bien establecido y conviene probar con un test A/B:

1. **Objetivos de tiempo por edad** (multiplicadores 1,8 / 1,5 / 1,25): calibrarlos con los percentiles reales del juego, para que el objetivo quede en torno al percentil 50–60 de los jugadores que ya dominan el nivel.
2. **Botones frente a teclado**: transferencia a la lectura real (por ejemplo, una prueba de lectura de 20 notas en partitura fuera del modo de entrenamiento).
3. **Sonido sí o no** tras responder: efecto en la retención a 7 días.
4. **Criterio de dominio del 90 % frente al 95 %**: retención a 7 y 30 días, frente al riesgo de frustración (abandono).
5. **Obligar a tocar la respuesta correcta** tras un error, frente a solo mostrarla.
6. **Clave de fa primero (como Alfred) frente a alternada** (la propuesta).
7. **Intervalos de Leitner**: ajustarlos con un modelo de vida media del recuerdo cuando haya suficientes datos [F50].

**Telemetría mínima por ensayo:**

- Identificadores: id del ítem, clave, altura, contexto (alteración o armadura), plica, figura, posición horizontal.
- Respuesta dada y si fue correcta.
- **Tiempo de respuesta medido con `performance.now()` en `pointerdown`**, no en `click`, para evitar el retraso táctil.
- Fase (aprender, practicar, desafío), plazo vigente, sesión y día, edad y modo de entrada.

---

## Fuentes

### Pedagogía musical y métodos

- [F1] Colourful Keys, «Note Identification Methods: Which is the right one?». https://colourfulkeys.ie/note-identification-methods-one/
- [F2] Colourful Keys, «Why *NOT* to Teach Your Child Music Staff Mnemonics». https://colourfulkeys.ie/music-mnemonics/
- [F3] Compose Create, «An Integrated Approach to Reading Music» (Piano Safari). https://composecreate.com/an-integrated-approach-to-reading-music/
- [F4] Alfred, *Premier Piano Course*: documento de pedagogía. https://images.alfred.com/pdf/Piano/51114_103732_PPC_Ped.pdf
- [F5] Faber, *Piano Adventures Primer Lesson Book*: índice (Simply Charlotte Mason) y ficha de Hal Leonard. https://apps.simplycharlottemason.com/resources/detail/177949 · https://www.halleonard.com/product/420168/primer-level-lesson-book-2nd-edition
- [F6] Clark, Goss y Holland, *The Music Tree: Time to Begin* (descripción). https://www.colemansmusic.com.au/products/the-music-tree-time-to-begin-student-book
- [F7] *Celebrate Piano!* (J.W. Pepper). https://JWPEPPER.COM/Celebrate-Piano%21/5979289.item
- [F8] Snell y Hidy, *Piano Town*: catálogo de Kjos, J.W. Pepper y Note-Speller. https://pianoinspires.com/wp-content/uploads/easyblog_articles/1587/Keith-Snel-Catalogue.pdf · https://www.jwpepper.com/10041605.item · https://www.sheetmusicplus.com/look_inside/19248282
- [F9] Hoffman Academy, «Guide Notes Low C / High C» y «Staff Guide Notes». https://app.hoffmanacademy.com/lessons/piano/guide-notes-low-c-high-c/video/ · https://app.hoffmanacademy.com/lessons/piano/staff-guide-notes-2019/video/
- [F10] Método Kodály (Wikipedia) y «Why don't we start with DO?». https://en.wikipedia.org/wiki/Kod%C3%A1ly_method · https://aulavirtualmusica.com/inicio/en/blog/why-dont-we-start-with-do
- [F11] Gordon Music Learning Theory (Wikipedia). https://en.wikipedia.org/wiki/Gordon_music_learning_theory
- [F12] Britannica, «Solmization» (Do fijo en Francia, Italia y España). https://www.britannica.com/art/solmization
- [F13] Conservatorio de Elda, Programación didáctica de Lenguaje Musical, Enseñanzas Elementales 2024/25. https://portal.edu.gva.es/conservatorioelda/wp-content/uploads/sites/1677/2024/11/LENGUAJE-MUSICAL-EE.pdf
- [F14] Clave de do en 3ª: All About Music Theory y Music Theory Practice. https://www.allaboutmusictheory.com/musical-staff/alto-clef/ · https://music-theory-practice.com/music-notes/alto-clef-flashcards
- [F15] Índices acústicos: científico (Do4) frente a franco-belga (Do3). Fuente divulgativa, **débil**. https://todosloshechos.es/cual-es-el-do-4

### Investigación sobre lectura musical

- [F16] DiCienzo, A. (2019). *A Comparison of the Middle C and the Mixed Intervallic Reading Approaches on Music Reading Among Beginner Piano Students*. Tesis de máster, Universidad de Ottawa. https://ruor.uottawa.ca/handle/10393/39944
- [F17] Emond, B. y Comeau, G. (2013). Modelado cognitivo de los métodos del Do central e interválico. https://piano.uottawa.ca/wp-content/uploads/2020/10/09.-Emond_cognitive-modelling.pdf
- [F18] Wood, M. (2016). *Visual Confusion in Piano Notation*. Actas de TENOR 2016, pp. 230–239. https://zenodo.org/records/1289600
- [F19] Aiba, E. y Sakaguchi, Y. (2018). *Visual Information Pianists Use for Efficient Score Reading*. Frontiers in Psychology, 9:2192. https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.02192/full
- [F20] Galvão, H. A. (2022). *Treinamento de velocidade na tarefa de reconhecimento de notação musical utilizando discriminação condicional*. Tesis de máster, UFMG. https://repositorio.ufmg.br/handle/1843/46935 · PDF: https://repositorio.ufmg.br/bitstream/1843/46935/1/Disserta%c3%a7%c3%a3o%20Vers%c3%a3o%20Reposit%c3%b3rio%20-%20Henrique%20Galv%c3%a3o.pdf
- [F21] Grégoire, L., Perruchet, P. y Poulin-Charronnat, B. (2015). *How Does Stroop Interference Change With Practice? A Reappraisal From the Musical Stroop Paradigm*. JEP:LMC. https://lead.ube.fr/wp-content/uploads/2023/09/001071-how-does-stroop-interference-change-with-practice-a-reappraisal-from-the-musical-stroop-paradigm.pdf
- [F22] Grégoire, L., Perruchet, P. y Poulin-Charronnat, B. (2013). *The Musical Stroop Effect: Opening a New Avenue to Research on Automatisms*. https://lead.ube.fr/wp-content/uploads/2023/09/000957-the-musical-stroop-effect-opening-a-new-avenue-to-research-on-automatisms.pdf
- [F23] D'Anselmo, A., Giuliani, F., Campopiano, F., Carta, E. y Brancucci, A. (2018). *Hemispheric Asymmetries in Setticlavio Reading*. Neuropsychology. https://ricerca.unich.it/retrieve/e4233f18-c71f-2860-e053-6605fe0a460a/2018_Neuropsychology.pdf · https://iris.uniroma4.it/handle/20.500.14244/2022
- [F24] Stewart, L. y cols. (2003). *Brain changes after learning to read and play music*. NeuroImage. Stewart, L. (2005). *A neurocognitive approach to music reading*. https://research.gold.ac.uk/id/eprint/51 · https://research.gold.ac.uk/id/eprint/5464
- [F25] Kopiez, R. y Lee, J. I. (2006). *Towards a dynamic model of skills involved in sight reading music*. Music Education Research. https://edisciplinas.usp.br/pluginfile.php/5556036/mod_resource/content/0/Artigo-KopiezLee-DynamicModelSightReading-2006.pdf
- [F26] Mishra, J. (2014). *Improving sightreading accuracy: A meta-analysis*. Psychology of Music. Mishra (2015), metaanálisis rítmico y melódico. https://journals.sagepub.com/doi/10.1177/0305735612463770 · https://journals.sagepub.com/doi/abs/10.1177/0305735615610925
- [F27] Goodenough, P. K. (2010). *A Comparison of Computer-Assisted and Peer-Partner Practice in Treble-Staff Note Recognition*. Tesis, Eastern Illinois University. https://thekeep.eiu.edu/theses/506
- [F28] Gudmundsdottir, H. R. (2010). *Pitch error analysis of young piano students' music reading performances* (IJME) y *Advances in music-reading research* (Music Education Research). https://journals.sagepub.com/doi/10.1177/0255761409351342 · https://helgarut.hi.is/wp-content/uploads/2015/09/Advances-in-Music-Reading-Research-2010-Gudmundsdottir.pdf
- [F29] Bean (1973), estudio de lectura a primera vista con estudiantes universitarios de piano (citado vía SciSpace). **Débil.** https://scispace.com/topics/clef-195ncwcu/1973
- [F30] Note Rush: reseña de una profesora y ficha en la App Store. https://thebrainstormbreakroom.substack.com/p/how-note-rush-transformed-my-studio · https://apps.apple.com/app/id1083801827
- [F31] Flashnote Derby, ficha en la App Store (referencia de mercado: claves, rangos, entrada por letra, solfeo o piano). https://apps.apple.com/us/app/flashnote-derby/id453126527
- [F32] Foro de tonebase, «Bass Clef Reading» (testimonios). **Débil.** https://piano-community.tonebase.co/t/60h065j/bass-clef-reading

### Ciencia del aprendizaje

- [F33] Dunlosky, J. y cols. (2013). *Improving Students' Learning With Effective Learning Techniques*. PSPI (resumen). https://www.readingrockets.org/resources/resource-library/improving-students-learning-effective-learning-techniques-promising
- [F34] Adesope, O., Trevisan, D. y Sundararajan, N. (2017). *Rethinking the Use of Tests: A Meta-Analysis of Practice Testing*. Review of Educational Research. https://journals.sagepub.com/doi/10.3102/0034654316689306
- [F35] Cepeda, N. J. y cols. (2008). *Spacing effects in learning: a temporal ridgeline of optimal retention*. Psychological Science. https://pubmed.ncbi.nlm.nih.gov/19076480/
- [F36] Brunmair, M. y Richter, T. (2019). *Similarity matters: A meta-analysis of interleaved learning and its moderators*. Psychological Bulletin. https://www.psychologie.uni-wuerzburg.de/fileadmin/06020400/2019/Brunmair_Richter_in_press__2019_META-ANALYSIS_OF_INTERLEAVED_LEARNING.pdf
- [F37] Kornell, N. y Bjork, R. A. (2008). *Learning Concepts and Categories: Is Spacing the «Enemy of Induction»?* Psychological Science. https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/Kornell_Bjork_2008_PsychScience.pdf
- [F38] Carvalho, P. F. y Goldstone, R. L. (2014). Estudio intercalado frente a en bloque según la similitud de las categorías (Frontiers in Psychology; véase también Memory & Cognition 2014). https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2014.00936/full
- [F39] Bjork, R. A., dificultades deseables (capítulo y referencias). https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/RBjork_inpress.pdf
- [F40] Wilson, R. C., Shenhav, A., Straccia, M. y Cohen, J. D. (2019). *The Eighty Five Percent Rule for optimal learning*. Nature Communications 10:4646. https://pmc.ncbi.nlm.nih.gov/articles/PMC6831579
- [F41] Rosenshine, B. (2012). *Principles of Instruction*. American Educator 36(1). https://www.aft.org/sites/default/files/periodicals/Rosenshine.pdf
- [F42] Fuller, J. L. y Fienup, D. M. (2018), criterios de dominio y mantenimiento; replicación posterior; resumen de la revisión de Wong y cols. (2022). https://pmc.ncbi.nlm.nih.gov/articles/PMC5843573 · https://pmc.ncbi.nlm.nih.gov/articles/PMC9120273 · https://behavioristbookclub.com/aba-research/assessment-research/systematic-review-of-acquisition-mastery-criteria-and-statistical-anal/
- [F43] Rohrer, D. y Taylor, K. (2006), sobreaprendizaje y práctica distribuida; Rohrer (2009), *Avoidance of overlearning characterizes the spacing effect*. https://digitalcommons.usf.edu/psy_facpub/1770/ · https://digitalcommons.usf.edu/psy_facpub/1762
- [F44] Repaso incremental: Tucker y Burns; Burns y Sterling-Turner (eficiencia); Swehla, Burns y cols. (espaciado en el repaso incremental). https://nj.dyslexiaida.org/wp-content/uploads/sites/18/2025/10/Tucker-and-Burns-CQ_44_6.pdf · https://experts.umn.edu/en/publications/comparison-of-efficiency-measures-for-academic-interventions-base/ · https://experts.umn.edu/en/publications/examining-the-use-of-spacing-effect-to-increase-the-efficiency-of/
- [F45] Pashler, H., Cepeda, N., Wixted, J. y Rohrer, D. (2005). *When does feedback facilitate learning of words?* JEP:LMC. https://www.yorku.ca/ncepeda/publications/PCWR2005.pdf
- [F46] Smith, T. A. y Kimball, D. R. (2010), revisión que incluye a Kulik y Kulik (1988); Mullet y cols. (2014). https://www.ou.edu/memorylab/pdfs/SmithKimball_2010_LearningFromFeedback_ms.pdf · https://profiles.wustl.edu/en/publications/delaying-feedback-promotes-transfer-of-knowledge-despite-student-/
- [F47] Butler, A. C. y Roediger, H. L. (2008). *Feedback enhances the positive effects and reduces the negative effects of multiple-choice testing*. https://mrbartonmaths.com/resourcesnew/8.%20Research/Formative%20Assessment/Feedback%20enhances%20the%20positive%20effects%20and%20reduces.pdf
- [F48] Shams, L. y Seitz, A. R. (2008). *Benefits of multisensory learning*. Trends in Cognitive Sciences. https://faculty.ucr.edu/%7Easeitz/pubs/Shams_Seitz08.pdf
- [F49] Cowan, N. (2001). *The magical number 4 in short-term memory*. Behavioral and Brain Sciences. https://memory.psych.missouri.edu/assets/doc/articles/2001/cowan-bbs-2001.pdf
- [F50] Settles, B. y Meeder, B. (2016). *A Trainable Spaced Repetition Model for Language Learning*. ACL; blog de Duolingo. https://preview.aclanthology.org/landing_page/P16-1174 · https://blog.duolingo.com/how-we-learn-how-you-learn
- [F51] Algoritmo SM-2 (Wozniak) y SuperMemo (Wikipedia). https://www-v1.supermemo.com/archives1990-2015/english/ol/sm2 · https://en.wikipedia.org/wiki/SuperMemo
- [F52] Sistema Leitner (descripción). https://e-student.org/leitner-system/
- [F53] Precision teaching, guía de Kent (KELSI). https://www.kelsi.org.uk/__data/assets/pdf_file/0011/27479/Handy-Guide-PTL-2.pdf
- [F54] Cronometraje explícito: Codding y cols. (2007); guía de práctica; propuesta de tesis de Hou. https://experts.umn.edu/en/publications/comparing-mathematics-interventions-does-initial-level-of-fluency/ · https://www.rcsdk12.org/cms/lib/NY01001156/Centricity/Domain/9831/8.%20Math%20Computation-%20Boost%20Fluency%20Through%20Explicit%20Time-Drills.pdf · https://cehs.usu.edu/sperc/files/hou-f_thesis_proposal.pdf
- [F55] Umbrales de automaticidad en tablas de multiplicar (fuentes comerciales, **débil**). https://www.Reflexmath.com/user_area/content_media/raw/Reflex_White_Paper.pdf · https://www.rocketmath.com/tag/elementary/page/3/
- [F56] Kail (1991), velocidad de procesamiento por edad, citado en Frontiers in Human Neuroscience (2021). https://www.frontiersin.org/journals/human-neuroscience/articles/10.3389/fnhum.2021.667612/pdf
- [F57] Tiempo de reacción simple y de elección en dispositivos móviles (adultos). https://metatoc.com/papers/52034-characterizing-information-processing-with-a-mobile-device-measurement-of-simple-and-choice-reaction-time
- [F58] Brown, Q. y Anthony, L. (2012). Precisión táctil de niños frente a adultos (CHI). https://lisa-anthony.com/wp-content/uploads/2012/03/brown-and-anthony-chi2012eist.pdf
- [F59] Sailer, M. y Homner, L. (2020). *The Gamification of Learning: a Meta-analysis*. Educational Psychology Review. https://opus.bibliothek.uni-augsburg.de/opus4/frontdoor/index/index/docId/109056
- [F60] Deci, E. L., Koestner, R. y Ryan, R. M. (1999). *A meta-analytic review of experiments examining the effects of extrinsic rewards on intrinsic motivation*. Psychological Bulletin. https://depts.washington.edu/techdocs/papers/deciExtrinsicRewardsAndIntrinsicMotivation99.pdf
- [F61] Silverman, J. y Barasch, A. (2023). *On or Off Track: How (Broken) Streaks Affect Consumer Decisions*. Journal of Consumer Research. https://www.colorado.edu/business/faculty-research/2023/04/19/or-track-how-broken-streaks-affect-consumer-decisions
- [F62] Almeida y cols. (2023), efectos negativos de la gamificación (revisión de 87 artículos); estudio de leaderboards (GaLA 2020). https://arxiv.org/abs/2305.08346 · https://trepo.tuni.fi/bitstream/10024/130150/1/GaLA_Conf_2020_paper_leaderboard.pdf
- [F63] Práctica distribuida y consolidación en aprendizaje motor musical: Allen (SMU), resumen de Simmons (2012) y Cognitive Music Lab de UT Austin. **Débil**: secundarias. https://blog.smu.edu/research/?p=5527 · https://hoffmanacademy.com/blog/want-to-learn-piano-faster-make-sure-you-get-enough-sleep · https://cml.music.utexas.edu/research/skill-learning-and-procedural-memory
