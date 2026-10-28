// Mundos de teoría musical (Lenguaje Musical, enseñanzas elementales). Fuente: docs/investigacion-teoria.md § 5.
// Cada nivel indica el tipo de pregunta (kind, ver js/theory.js), sus parámetros, los botones (options),
// lo que requiere y su lección: texto corto, ejemplo resuelto y un ítem de muestra para dibujar.

const ORD = (n) => ({ value: String(n), label: `${n}.ª` });
const opt = (pairs) => pairs.map(([value, label]) => ({ value: String(value), label }));
const T = (limit, target) => ({ limit, target });

const FIG_OPTS = opt([['redonda', 'Redonda'], ['blanca', 'Blanca'], ['negra', 'Negra'], ['corchea', 'Corchea'], ['semicorchea', 'Semicorchea'], ['fusa', 'Fusa']]);
// Calidad del intervalo: letra grande y la palabra debajo, para que quepan en una fila.
const QUAL = { M: 'mayor', m: 'menor', J: 'justa', A: 'aument.', d: 'dismin.' };
const qual = (...qs) => qs.map((q) => ({ value: q, label: q, sub: QUAL[q] }));
const ROMAN = opt(['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].map((r) => [r, r]));
const DEG_NAMES = opt(['tónica', 'supertónica', 'mediante', 'subdominante', 'dominante', 'superdominante', 'sensible'].map((n) => [n, n.charAt(0).toUpperCase() + n.slice(1)]));
const MEL = ['E4 E4 F4 G4', 'G4 F4 E4 D4', 'C4 D4 E4 C4', 'E4 D4 C4 D4', 'G4 G4 A4 G4', 'C5 B4 A4 G4', 'E4 F4 G4 E4', 'D4 E4 F4 D4', 'G4 E4 C4', 'C4 E4 G4 C5', 'A4 G4 F4 E4', 'F4 A4 G4 F4'];

export const THEORY_WORLDS = [
  {
    id: 'ritmo',
    title: 'Figuras y silencios',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'Cuánto dura cada sonido y cada silencio.',
    intro: 'Hasta ahora has leído qué nota suena. Ahora toca cuánto dura: cada figura tiene su forma y su valor.',
    levels: [
      {
        id: 'rit-1', title: 'Redonda, blanca y negra', kind: 'figure', set: [1, 2, 4], requires: 'sol-2',
        options: FIG_OPTS.slice(0, 3), ...T(4, 2.2),
        lesson: { title: 'Tres figuras para empezar', text: ['Cada figura dice cuánto dura un sonido. La redonda es una cabeza blanca sin palito (plica); la blanca tiene plica; la negra, cabeza rellena y plica.'], example: 'Cabeza blanca con plica → blanca. La redonda nunca lleva plica.' },
      },
      {
        id: 'rit-2', title: 'Corchea, semicorchea y fusa', kind: 'figure', set: [1, 2, 4, 8, 16, 32], beamed: true,
        options: FIG_OPTS, ...T(4, 2.2),
        lesson: { title: 'Cuenta las banderitas', text: ['Cuenta los corchetes (las banderitas) o las barras: 1 = corchea, 2 = semicorchea, 3 = fusa. Cada banderita más hace la figura el doble de rápida.'], example: 'Plica con dos corchetes → 2 → semicorchea.' },
      },
      {
        id: 'rit-3', title: '¿Cuánto dura?', kind: 'value', set: [{ dur: 1 }, { dur: 2 }, { dur: 4 }, { dur: 8 }, { dur: 16 }],
        options: opt([['4', '4'], ['2', '2'], ['1', '1'], ['0.5', '½'], ['0.25', '¼']]), ...T(4, 2.2),
        lesson: { title: 'La negra vale 1', text: ['Si la negra vale 1 tiempo, la blanca vale 2 y la redonda 4. Hacia abajo se parte por la mitad: corchea ½, semicorchea ¼.'], example: 'Corchea = la mitad de una negra → ½ tiempo. Dos corcheas hacen 1 tiempo.' },
      },
      {
        id: 'rit-4', title: 'Los silencios', kind: 'rest', set: [1, 2, 4, 8, 16],
        options: opt([['r1', 'Sil. de redonda'], ['r2', 'Sil. de blanca'], ['r4', 'Sil. de negra'], ['r8', 'Sil. de corchea'], ['r16', 'Sil. de semicorchea']]), ...T(4, 2.4),
        lesson: { title: 'Silencios: duran pero no suenan', text: ['Cada figura tiene su silencio, que dura lo mismo pero sin sonar.', 'El de redonda cuelga de la 4.ª línea (pesa más) y el de blanca se sienta sobre la 3.ª, como un sombrero.'], example: 'Rectángulo colgando de la 4.ª línea → silencio de redonda.' },
      },
      {
        id: 'rit-5', title: 'Puntillo y ligadura', kind: 'value',
        set: [{ dur: 2, dots: 1 }, { dur: 4, dots: 1 }, { dur: 8, dots: 1 }, { dur: 1, dots: 1 }, { dur: 4, dots: 1, rest: true }],
        ties: [[{ dur: 2 }, { dur: 4 }], [{ dur: 4 }, { dur: 8 }]],
        options: opt([['0.75', '¾'], ['1.5', '1½'], ['2.5', '2½'], ['3', '3'], ['6', '6']]), ...T(5, 2.6),
        lesson: { title: 'El puntillo suma la mitad', text: ['El puntillo suma a la figura la mitad de lo que vale.', 'La ligadura une dos notas iguales: se tocan como una sola y sus tiempos se suman.'], example: 'Blanca con puntillo: 2 + la mitad de 2 (1) = 3 tiempos.' },
      },
    ],
  },
  {
    id: 'melodia',
    title: 'Melodías: sube, baja, paso y salto',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'Leer el dibujo de la melodía antes que cada nota.',
    levels: [
      {
        id: 'dir-1', title: '¿Sube, baja o se repite?', kind: 'direction', variant: 'updown', range: ['C4', 'G4'], requires: 'sol-2',
        options: opt([['up', '↗ Sube'], ['down', '↘ Baja'], ['same', '= Igual']]), ...T(4, 2.0),
        lesson: { title: 'El dibujo de la melodía', text: ['Mira dos pájaros seguidos: si el segundo está más arriba en el pentagrama, la melodía sube (suena más agudo); si está más abajo, baja; si está a la misma altura, se repite.'], example: 'Mi y luego Sol: Sol está más arriba → sube.' },
      },
      {
        id: 'dir-2', title: '¿Paso o salto?', kind: 'direction', variant: 'stepskip', range: ['C4', 'C5'], requires: ['dir-1', 'sol-3'],
        options: opt([['paso', 'Paso'], ['salto', 'Salto']]), ...T(4, 2.0),
        lesson: { title: 'Vecinas o separadas', text: ['Si la nota siguiente está en la línea o el espacio de al lado, es un paso (intervalo conjunto). Si se salta alguna línea o espacio, es un salto (intervalo disjunto).'], example: 'Sol (2.ª línea) → La (2.º espacio): vecinos → paso.' },
      },
      {
        id: 'mel-1', title: 'Melodías cortas', kind: 'melody', melodies: MEL, requires: ['dir-2', 'sol-5'], count: 8, mode: 'calm', ...T(null, 2.0),
        lesson: { title: 'Lee como quien lee una frase', text: ['Ahora lee varias notas seguidas, como las palabras de una frase. Fíjate en si sube o baja y si va por pasos o saltos: así la siguiente nota casi la adivinas.'], example: 'Mi-Mi-Fa-Sol: se repite y luego sube por pasos → Mi, Mi, Fa, Sol (el «Himno de la alegría»).' },
      },
    ],
  },
  {
    id: 'intervalo',
    title: 'Intervalos: el número',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'La distancia entre dos notas, contando las dos.',
    intro: 'Un intervalo es la distancia entre dos notas. Su número se cuenta incluyendo la primera y la última.',
    levels: [
      {
        id: 'int-1', title: 'Segundas y terceras', kind: 'interval', sizes: [2, 3], range: ['C4', 'C5'], requires: ['dir-2', 'sol-5'],
        options: [ORD(2), ORD(3), ORD(4)], ...T(4, 2.2),
        lesson: { title: 'Cuenta las dos notas', text: ['Para saber el número, cuenta todas las notas desde la primera hasta la última, contando las dos: Do-Re es una 2.ª; Do-Re-Mi, una 3.ª.'], example: 'Fa → La: Fa (1), Sol (2), La (3) → 3.ª. Truco: las dos están en espacio → número impar.' },
      },
      {
        id: 'int-2', title: 'Cuartas y quintas', kind: 'interval', sizes: [2, 3, 4, 5], range: ['C4', 'C5'],
        options: [2, 3, 4, 5].map(ORD), ...T(4, 2.2),
        lesson: { title: 'Línea-línea o línea-espacio', text: ['En la 3.ª y en la 5.ª las dos notas están en líneas, o las dos en espacios; en la 2.ª y en la 4.ª, una está en línea y la otra en espacio. Así descartas la mitad de los botones de un vistazo.'], example: 'Do → Sol: Do (1), Re (2), Mi (3), Fa (4), Sol (5) → 5.ª. Las dos en línea: impar, cuadra.' },
      },
      {
        id: 'int-3', title: 'Sextas, séptimas y octavas', kind: 'interval', sizes: [2, 3, 4, 5, 6, 7, 8], range: ['C4', 'G5'], arrangement: 'mix', requires: ['int-2', 'sol-8'],
        options: [2, 3, 4, 5, 6, 7, 8].map(ORD), ...T(4, 2.4),
        lesson: { title: 'Hasta la octava', text: ['La 8.ª (octava) une dos notas con el mismo nombre: Do-Do. La 7.ª tiene una nota menos y la 6.ª, dos menos.', 'Si las dos notas suenan a la vez (una encima de otra), el intervalo es armónico; si suenan una tras otra, melódico.'], example: 'Re-Do: casi una octava (Re-Re), pero con una nota menos → 7.ª.' },
      },
      {
        id: 'int-4', title: 'Intervalos en clave de fa', kind: 'interval', sizes: [2, 3, 4, 5, 6, 7, 8], clef: 'bass', range: ['F2', 'C4'], arrangement: 'mix', requires: ['int-3', 'fa-8'],
        options: [2, 3, 4, 5, 6, 7, 8].map(ORD), ...T(4, 2.4),
        lesson: { title: 'En cualquier clave, igual', text: ['Los intervalos se cuentan igual en cualquier clave: la distancia en líneas y espacios no cambia. ¡Para saber el número ni siquiera hace falta saber cómo se llaman las notas!'], example: 'Dos notas en líneas seguidas (línea, espacio, línea) → 3.ª, tanto en clave de sol como de fa.' },
      },
      {
        id: 'int-5', title: 'Desafío de intervalos', kind: 'interval', sizes: [2, 3, 4, 5, 6, 7, 8], ranges: { treble: ['C4', 'G5'], bass: ['F2', 'C4'] }, clefs: ['treble', 'bass'], arrangement: 'mix', requires: ['int-4', 'gran-2'],
        count: 30, passAcc: 0.92, options: [2, 3, 4, 5, 6, 7, 8].map(ORD), ...T(3, 2.0),
        lesson: { title: 'Mira la forma', text: ['Último reto del número: mira la forma, no las notas. Un vistazo a «línea-línea» o «línea-espacio» y al hueco entre las dos notas basta.'], example: 'Una nota en la 1.ª línea y otra en la 4.ª: 7 posiciones contando las dos → 7.ª.' },
      },
    ],
  },
  {
    id: 'compas',
    title: 'El compás',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'Cómo se agrupan los tiempos: 2/4, 3/4 y 4/4.',
    levels: [
      {
        id: 'comp-1', title: '2/4, 3/4 y 4/4', kind: 'measure', variant: 'which', meters: ['2/4', '3/4', '4/4'], figures: [1, 2, 4, 8], requires: 'rit-3',
        options: opt([['2/4', '2/4'], ['3/4', '3/4'], ['4/4', '4/4']]), mode: 'calm', ...T(null, 5),
        lesson: { title: 'Arriba, cuántos; abajo, cuáles', text: ['El número de arriba dice cuántos tiempos tiene cada compás; el de abajo, qué figura vale un tiempo (4 = negra). Se lee «dos por cuatro», «tres por cuatro», «cuatro por cuatro».'], example: 'Blanca + negra = 2 + 1 = 3 tiempos → 3/4.' },
      },
      {
        id: 'comp-2', title: '¿Está completo?', kind: 'measure', variant: 'complete', meters: ['2/4', '3/4', '4/4'], figures: [2, 4, 8], rests: true, requires: ['comp-1', 'rit-4'],
        options: opt([['completo', 'Completo'], ['falta', 'Falta'], ['sobra', 'Sobra']]), mode: 'calm', ...T(null, 5),
        lesson: { title: 'Suma los tiempos', text: ['Suma los tiempos de todas las figuras y silencios. Si da justo lo que pide el número de arriba, el compás está completo.'], example: '3/4: negra (1) + silencio de negra (1) + dos corcheas (½ + ½) = 3 → completo.' },
      },
      {
        id: 'comp-3', title: '¿Cuántos tiempos faltan?', kind: 'measure', variant: 'missing', meters: ['2/4', '3/4', '4/4'], figures: [2, 4, 8], rests: true, missing: [0.5, 1, 1.5, 2, 3],
        options: opt([['0.5', '½'], ['1', '1'], ['1.5', '1½'], ['2', '2'], ['3', '3']]), mode: 'calm', ...T(null, 6),
        lesson: { title: 'Lo que falta', text: ['Cuenta lo que ya hay y réstalo del total. Lo que falta se puede rellenar con una figura o con un silencio.'], example: '4/4 con blanca + negra = 3 → falta 1 tiempo: una negra o un silencio de negra.' },
      },
      {
        id: 'comp-4', title: 'Puntillos y semicorcheas en el compás', kind: 'measure', variant: 'missing', meters: ['2/4', '3/4', '4/4'], figures: [2, 4, 8, 16], rests: true, dots: true, missing: [0, 0.5, 1, 1.5, 2], requires: ['comp-3', 'rit-5'],
        options: opt([['0', 'Nada'], ['0.5', '½'], ['1', '1'], ['1.5', '1½'], ['2', '2']]), mode: 'calm', ...T(null, 6),
        lesson: { title: 'Primero cada valor, luego la suma', text: ['Con puntillos y ligaduras se suma igual: primero calcula cuánto vale cada figura y luego súmalo. Cuatro semicorcheas valen 1 tiempo.'], example: '2/4 con negra con puntillo (1½) → falta ½: una corchea.' },
      },
      {
        id: 'comp-5', title: 'Ritmos con nombre', kind: 'rhythm', requires: 'comp-4',
        options: opt([['anacrusa', 'Anacrusa'], ['síncopa', 'Síncopa'], ['contratiempo', 'Contratiempo'], ['tresillo', 'Tresillo']]), mode: 'calm', ...T(null, 5),
        lesson: { title: 'Anacrusa, síncopa, contratiempo y tresillo', text: ['La anacrusa es el compás incompleto con el que empieza una obra. La síncopa empieza en parte débil y se alarga a la fuerte; el contratiempo suena en la débil tras un silencio.', 'El tresillo mete 3 corcheas en el tiempo de 2.'], example: 'Corchea-negra-corchea: la negra empieza en la mitad débil y cruza al tiempo siguiente → síncopa.' },
      },
      {
        id: 'comp-6', title: 'Desafío del compás', kind: 'mixed', from: ['comp-1', 'comp-2', 'comp-4'], requires: 'comp-5', count: 24, passAcc: 0.92, mode: 'calm', ...T(null, 5),
        lesson: { title: 'Todo el compás mezclado', text: ['¿Qué compás es?, ¿está completo?, ¿cuánto falta? Las tres preguntas mezcladas: lee primero qué te preguntan.'], example: '4/4 con blanca y negra con puntillo: 2 + 1½ = 3½ → falta ½.' },
      },
    ],
  },
  {
    id: 'semitono',
    title: 'Tonos y semitonos',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'Las distancias más pequeñas del piano.',
    levels: [
      {
        id: 'ts-1', title: 'Tono o semitono', kind: 'tone', range: ['C4', 'C5'], requires: ['int-1', 'sol-5'],
        options: opt([['T', 'Tono'], ['S', 'Semitono']]), ...T(4, 2.2),
        lesson: { title: 'Mira si hay tecla en medio', text: ['El semitono es la distancia más pequeña del piano: de una tecla a la de al lado, sin ninguna en medio. Un tono son dos semitonos.', 'Entre las teclas blancas, solo Mi-Fa y Si-Do son semitonos, porque no tienen tecla negra en medio.'], example: 'Re-Mi: hay una tecla negra entre las dos → tono. Mi-Fa: ninguna tecla en medio → semitono.' },
      },
      {
        id: 'ts-2', title: 'Los semitonos de la escala de Do', kind: 'scalePair', scales: [{ key: 0, clef: 'treble', oct: 4 }, { key: 0, clef: 'bass', oct: 3 }], requires: ['ts-1', 'fa-5'],
        options: opt([['T', 'Tono'], ['S', 'Semitono']]), mode: 'calm', ...T(null, 3),
        lesson: { title: 'T, T, S, T, T, T, S', text: ['La escala mayor siempre sigue el mismo dibujo: tono, tono, semitono, tono, tono, tono, semitono. En Do mayor los semitonos caen entre Mi-Fa (3.º-4.º) y Si-Do (7.º-8.º).'], example: 'Grados 6.º y 7.º (La-Si): tecla negra en medio → tono.' },
      },
      {
        id: 'ts-3', title: 'Diatónico, cromático y enarmonía', kind: 'tone', four: true, requires: ['ts-2', 'alt-5'],
        pairs: [['C4', 'C#4'], ['F4', 'F#4'], ['Bb4', 'B4'], ['E4', 'F4'], ['C#4', 'D4'], ['A4', 'Bb4'], ['C#4', 'D#4'], ['F4', 'G4'], ['C#4', 'Db4'], ['F#4', 'Gb4'], ['G#4', 'Ab4']],
        options: opt([['T', 'Tono'], ['Sd', 'S. diatónico'], ['Sc', 'S. cromático'], ['E', 'Enarmónicas']]), ...T(5, 2.6),
        lesson: { title: 'Dos maneras de escribir un semitono', text: ['Si las dos notas tienen distinto nombre (Mi-Fa, Do♯-Re), el semitono es diatónico; si tienen el mismo nombre (Do-Do♯), es cromático.', 'Y si dos notas de distinto nombre caen en la misma tecla (Do♯ y Re♭), son enarmónicas.'], example: 'Fa-Fa♯: mismo nombre → semitono cromático. Fa♯-Sol: distinto nombre → semitono diatónico.' },
      },
    ],
  },
  {
    id: 'expresion',
    title: 'Expresión: matices, aire y signos',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'Cómo tocar: fuerte o suave, deprisa o despacio, ligado o picado.',
    levels: [
      {
        id: 'expr-1', title: 'Piano y forte', kind: 'symbol', symbols: ['pp', 'p', 'mp', 'mf', 'f', 'ff'], requires: 'rit-1', mode: 'calm', ...T(null, 3),
        lesson: { title: 'Los matices', text: ['Los matices dicen con qué fuerza tocar. Son palabras italianas: piano (p) es suave, forte (f) es fuerte y mezzo (m), medio.'], example: 'mf = mezzo forte → medio fuerte: más que mp, menos que f.' },
      },
      {
        id: 'expr-2', title: 'Crescendo, diminuendo y acentos', kind: 'symbol', symbols: ['cresc', 'dim', 'cresc.', 'dim.', 'sfz', 'fp', 'acento'], requires: 'expr-1', mode: 'calm', ...T(null, 3),
        lesson: { title: 'Como un embudo', text: ['Los reguladores son como un embudo: si se abre (<), cada vez más fuerte (crescendo); si se cierra (>), cada vez más suave (diminuendo).', 'El acento es pequeño y va sobre una sola nota.'], example: 'Un > largo bajo cuatro notas → regulador → diminuendo. Un > pequeño sobre una nota → acento.' },
      },
      {
        id: 'expr-3', title: '¿Deprisa o despacio? El aire', kind: 'symbol', symbols: ['Largo', 'Lento', 'Adagio', 'Andante', 'Moderato', 'Allegro', 'Presto', 'rit.', 'accel.', 'a tempo'], requires: 'expr-1', mode: 'calm', ...T(null, 3),
        lesson: { title: 'El aire', text: ['El aire (o movimiento) es la velocidad de la obra. De más lento a más rápido: Largo, Lento, Adagio, Andante, Moderato, Allegro, Presto.', 'Andante viene de «andar»: a paso tranquilo, no rápido.'], example: 'rit. = ritardando → frena poco a poco; luego «a tempo» → vuelve a la velocidad de antes.' },
      },
      {
        id: 'expr-4', title: 'Articulación y pedal', kind: 'symbol', symbols: ['picado', 'ligado', 'tenuto', 'picado-ligado', 'Ped', 'Ped-up', '8va'], requires: ['expr-2', 'rit-5'], mode: 'calm', ...T(null, 3),
        lesson: { title: 'Cómo atacar cada nota', text: ['El puntito sobre o bajo la nota es el picado: tócala corta. La ligadura de expresión une notas distintas para tocarlas unidas.', 'Ped. = pisa el pedal derecho; ✱ = suéltalo.'], example: 'Arco sobre Do-Re-Mi (notas distintas) → ligadura de expresión → ligado.' },
      },
      {
        id: 'expr-5', title: 'Repeticiones y calderón', kind: 'symbol', symbols: ['ritornello', 'D.C.', 'D.S.', 'segno', 'coda', 'Fine', 'D.C. al Fine', 'volta', 'calderon'], requires: 'expr-3', mode: 'calm', ...T(null, 3.5),
        lesson: { title: 'Las repeticiones ahorran papel', text: ['Las barras con dos puntos encierran lo que se repite. D.C. (Da Capo) es «desde el principio» y D.S. (Dal Segno), «desde el signo» 𝄋.', 'El calderón detiene el tiempo: alarga la nota a tu gusto.'], example: '«D.C. al Fine» → vuelve al principio y termina donde pone Fine.' },
      },
    ],
  },
  {
    id: 'grados',
    title: 'Los grados de la escala',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'Cada nota de la escala tiene su número y su nombre.',
    levels: [
      {
        id: 'gra-1', title: 'Grados en números', kind: 'degree', keys: [{ fifths: 0 }], variant: 'number', requires: 'ts-2',
        options: ROMAN, mode: 'calm', ...T(null, 3),
        lesson: { title: 'Números romanos desde la tónica', text: ['Cada nota de la escala es un grado y se numera con números romanos desde la tónica, la nota que da nombre a la tonalidad. En Do mayor: Do = I, Re = II… Si = VII.'], example: 'En Do mayor, ¿Sol? Do (I), Re (II), Mi (III), Fa (IV), Sol (V) → V.' },
      },
      {
        id: 'gra-2', title: 'El nombre de cada grado', kind: 'degree', keys: [{ fifths: 0 }], variant: 'name', weights: [1, 1, 1, 2, 2, 2, 1], requires: 'gra-1',
        options: DEG_NAMES, mode: 'calm', ...T(null, 3.5),
        lesson: { title: 'Tónica, dominante, sensible…', text: ['I tónica, II supertónica, III mediante, IV subdominante, V dominante, VI superdominante y VII sensible.', '«Sub» es debajo y «super», encima: la subdominante está justo debajo de la dominante y la superdominante, justo encima.'], example: 'En Do mayor, La es el VI: justo encima de la dominante (Sol) → superdominante.' },
      },
      {
        id: 'gra-3', title: 'Grados en otras tonalidades', kind: 'degree', keys: [{ fifths: 1 }, { fifths: -1 }, { fifths: 2 }, { fifths: -2 }, { fifths: 0, mode: 'minor' }], harmonic: true, variant: 'alternate', requires: ['gra-2', 'ton-3'],
        options: ROMAN, mode: 'calm', ...T(null, 4),
        lesson: { title: 'La tónica cambia, el método no', text: ['En cualquier tonalidad la tónica es el I y se cuenta hacia arriba.', 'La sensible es el VII cuando está a un semitono de la tónica, porque «tira» hacia ella: en La menor es Sol♯.'], example: 'Re mayor, ¿La? Re (I), Mi (II), Fa♯ (III), Sol (IV), La (V) → V, la dominante.' },
      },
    ],
  },
  {
    id: 'calidad',
    title: 'Intervalos: mayor, menor y justo',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'El apellido de cada intervalo.',
    intro: 'Dos intervalos con el mismo número pueden medir distinto. El apellido (mayor, menor, justo…) lo dice: depende de los tonos y semitonos que caben dentro.',
    levels: [
      {
        id: 'intc-1', title: 'Segundas mayores y menores', kind: 'quality', sizes: [2], ranges: { treble: ['C4', 'C5'], bass: ['C3', 'C4'] }, clefs: ['treble', 'bass'], requires: ['ts-2', 'int-3'],
        options: qual('M', 'm'), ...T(4, 2.4),
        lesson: { title: 'Ya lo sabes sin saberlo', text: ['Una 2.ª mayor es un tono y una 2.ª menor es un semitono. Mayor = más grande; menor = más pequeña.'], example: 'Si-Do → semitono → 2.ª menor (2.ªm).' },
      },
      {
        id: 'intc-2', title: 'Terceras mayores y menores', kind: 'quality', sizes: [3, 3, 2], ranges: { treble: ['C4', 'C5'], bass: ['C3', 'C4'] }, clefs: ['treble', 'bass'], requires: 'intc-1',
        options: qual('M', 'm'), ...T(4, 2.6),
        lesson: { title: 'Dos tonos o tono y medio', text: ['Una 3.ª mayor tiene 2 tonos; una 3.ª menor, tono y medio.', 'Truco: si entre las dos notas se esconde Mi-Fa o Si-Do (un semitono), la 3.ª es menor.'], example: 'Re-Fa: Re-Mi (tono) + Mi-Fa (semitono) = tono y medio → 3.ª menor.' },
      },
      {
        id: 'intc-3', title: 'Cuartas, quintas y octavas justas', kind: 'quality', sizes: [4, 5, 8], range: ['C4', 'C6'], requires: 'intc-2',
        options: qual('J', 'A', 'd'), ...T(4, 2.6),
        lesson: { title: 'Ni mayores ni menores: justas', text: ['La 4.ª, la 5.ª y la 8.ª no son mayores ni menores: son justas (J). La 4.ª justa tiene 2 tonos y medio, y la 5.ª justa, 3 tonos y medio.', 'Solo hay una trampa entre notas blancas: Fa-Si tiene 3 tonos (4.ª aumentada) y Si-Fa es una 5.ª disminuida.'], example: 'Re-La: Re, Mi, Fa, Sol, La = 5.ª. No es la pareja Si-Fa → 5.ª justa.' },
      },
      {
        id: 'intc-4', title: 'Sextas y séptimas', kind: 'quality', sizes: [6, 7, 3], range: ['C4', 'C6'], requires: 'intc-3',
        options: qual('M', 'm'), ...T(4, 2.8),
        lesson: { title: 'El truco del espejo', text: ['Una 6.ª y una 3.ª suman 9: al dar la vuelta a una 6.ª mayor sale una 3.ª menor, y al revés.', 'La 7.ª mayor está a un semitono de la octava; la menor, a un tono.'], example: 'Do-Si: de Si a Do (la octava) falta un semitono → 7.ª mayor.' },
      },
      {
        id: 'intc-5', title: 'Intervalos con alteraciones', kind: 'quality', sizes: [2, 3, 4, 5, 6, 7], range: ['C4', 'C5'], alter: true, requires: ['intc-4', 'alt-4'],
        options: qual('M', 'm', 'J', 'A', 'd'), ...T(5, 3.0),
        lesson: { title: 'Primero sin alteraciones, luego ajusta', text: ['Clasifica el intervalo como si no hubiera alteraciones; luego mira qué hace la alteración.', 'Si la nota de arriba sube o la de abajo baja, el intervalo crece (m → M → A). Si la de arriba baja o la de abajo sube, encoge (M → m → d).'], example: 'Re-Fa♯: Re-Fa es 3.ª menor; el ♯ sube la nota de arriba → crece → 3.ª mayor.' },
      },
      {
        id: 'intc-6', title: 'Desafío: el nombre completo', kind: 'quality', prompt: '¿Qué intervalo es? Número y apellido', sizes: [2, 3, 4, 5, 6, 7, 8], range: ['C4', 'C5'], alter: true, twoStep: true, requires: ['intc-5', 'int-5'],
        options: { first: [2, 3, 4, 5, 6, 7, 8].map(ORD), second: qual('M', 'm', 'J', 'A', 'd') }, passAcc: 0.92, ...T(6, 3.5),
        lesson: { title: 'Número y apellido', text: ['Dos pasos, siempre en el mismo orden: primero el número (cuenta las dos notas) y luego el apellido (mayor, menor, justo…). Toca los dos botones.'], example: 'Mi-Do: Mi, Fa, Sol, La, Si, Do = 6.ª. Es Do-Mi (3.ª mayor) dado la vuelta → 6.ª menor.' },
      },
    ],
  },
  {
    id: 'compuesto',
    title: 'Compases compuestos',
    area: 'teoria',
    clefIcon: 'treble',
    description: '6/8, 9/8 y 12/8: tiempos que se dividen en tres.',
    levels: [
      {
        id: 'cc-1', title: '¿3/4 o 6/8?', kind: 'measure', variant: 'which', meters: ['3/4', '6/8'], figures: [2, 4, 8], dots: true, requires: 'comp-6',
        options: opt([['2/4', '2/4'], ['3/4', '3/4'], ['6/8', '6/8']]), mode: 'calm', ...T(null, 5),
        lesson: { title: 'De dos en dos o de tres en tres', text: ['6/8 tiene 6 corcheas por compás, igual que 3/4, ¡pero no se cuenta igual! En 6/8 hay 2 tiempos y cada uno es una negra con puntillo (3 corcheas).', 'Por eso las corcheas se agrupan de 3 en 3; en 3/4, de 2 en 2.'], example: 'Seis corcheas unidas en dos grupos de tres → 2 tiempos de negra con puntillo → 6/8.' },
      },
      {
        id: 'cc-2', title: 'Contar en 6/8', kind: 'measure', variant: 'complete', meters: ['6/8'], figures: [2, 4, 8], dots: true, rests: true, unit: 'corchea', requires: 'cc-1',
        options: opt([['completo', 'Completo'], ['falta', 'Falta'], ['sobra', 'Sobra']]), mode: 'calm', ...T(null, 5),
        lesson: { title: 'Piensa en corcheas', text: ['En 6/8 piensa en corcheas: la corchea vale 1, la negra 2, la negra con puntillo 3 y la blanca con puntillo 6 (un compás entero).'], example: 'Negra (2) + corchea (1) + negra con puntillo (3) = 6 → completo.' },
      },
      {
        id: 'cc-3', title: '9/8 y 12/8', kind: 'measure', variant: 'which', meters: ['2/4', '3/4', '4/4', '6/8', '9/8', '12/8'], figures: [2, 4, 8], dots: true, requires: 'cc-2',
        options: opt(['2/4', '3/4', '4/4', '6/8', '9/8', '12/8'].map((m) => [m, m])), mode: 'calm', ...T(null, 5),
        lesson: { title: 'Divide entre tres', text: ['Los compuestos llevan 6, 9 o 12 arriba: divide entre 3 y sabrás los tiempos (6/8 = 2, 9/8 = 3, 12/8 = 4).', 'Cada compuesto es «primo» de un simple: 6/8 de 2/4, 9/8 de 3/4 y 12/8 de 4/4.'], example: 'Tres grupos de tres corcheas → 3 tiempos de negra con puntillo → 9/8.' },
      },
    ],
  },
  {
    id: 'acordes',
    title: 'Acordes',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'Tres notas apiladas: tríadas mayores, menores, disminuidas y aumentadas.',
    levels: [
      {
        id: 'aco-1', title: 'Tríadas: ¿qué acorde es?', kind: 'triad', variant: 'name', ranges: { treble: ['C4', 'G5'], bass: ['F2', 'C4'] }, clefs: ['treble', 'bass'], requires: ['intc-2', 'gra-1'],
        ...T(4, 2.4),
        lesson: { title: 'Un muñeco de nieve', text: ['Una tríada son tres notas apiladas de 3.ª en 3.ª, como un muñeco de nieve: todas en líneas o todas en espacios.', 'La nota de abajo es la fundamental y da nombre al acorde.'], example: 'Fa-La-Do (tres espacios seguidos) → la de abajo es Fa → acorde de Fa.' },
      },
      {
        id: 'aco-2', title: 'Mayor o menor', kind: 'triad', variant: 'quality', requires: ['aco-1', 'alt-2'],
        triads: ['C4 E4 G4', 'F4 A4 C5', 'G4 B4 D5', 'D4 F4 A4', 'E4 G4 B4', 'A4 C5 E5', 'D4 F#4 A4', 'G4 Bb4 D5'],
        options: opt([['M', 'Mayor'], ['m', 'menor']]), ...T(4, 2.6),
        lesson: { title: 'Mira la tercera de abajo', text: ['Mira la 3.ª de abajo (fundamental y tercera). Si es mayor, el acorde es perfecto mayor (3.ªM + 3.ªm); si es menor, perfecto menor (3.ªm + 3.ªM). Los dos tienen la 5.ª justa.'], example: 'La-Do-Mi: La-Do es 3.ª menor → La menor.' },
      },
      {
        id: 'aco-3', title: 'Disminuido y aumentado', kind: 'triad', variant: 'quality', requires: ['aco-2', 'intc-5'],
        triads: ['C4 E4 G4', 'D4 F4 A4', 'A4 C5 E5', 'G4 B4 D5', 'B4 D5 F5', 'C#4 E4 G4', 'F#4 A4 C5', 'C4 E4 G#4', 'F4 A4 C#5', 'Eb4 G4 B4'],
        options: opt([['M', 'Mayor'], ['m', 'menor'], ['dim', 'disminuido'], ['aum', 'aumentado']]), ...T(5, 3.0),
        lesson: { title: 'Dos menores o dos mayores', text: ['Si las dos 3.ªs son menores, el acorde es disminuido; si las dos son mayores, aumentado.', 'En Do mayor, el único disminuido es el del VII grado: Si-Re-Fa.'], example: 'Do-Mi-Sol♯: Do-Mi 3.ªM y Mi-Sol♯ 3.ªM → dos mayores → aumentado.' },
      },
      {
        id: 'aco-4', title: 'Los acordes de I, IV y V', kind: 'degree', chord: true, keys: [{ fifths: 0 }, { fifths: 1 }, { fifths: -1 }, { fifths: 2 }], variant: 'number', weights: [2, 1, 0, 2, 2, 1, 0], requires: ['aco-2', 'gra-3'],
        options: ROMAN, mode: 'calm', ...T(null, 4),
        lesson: { title: 'Los grados tonales', text: ['Los acordes construidos sobre los grados tonales (I, IV y V) son los más importantes: con ellos se acompañan miles de canciones. En una tonalidad mayor, los tres son mayores.'], example: 'En Sol mayor, Re-Fa♯-La: su fundamental, Re, es el V grado → acorde de dominante.' },
      },
    ],
  },
  {
    id: 'tonalidad',
    title: 'Escalas y tonalidades',
    area: 'teoria',
    clefIcon: 'treble',
    description: 'De la armadura a la tonalidad, mayor y menor.',
    levels: [
      {
        id: 'ton-1', title: 'Por qué Sol mayor lleva Fa♯', kind: 'scalePair', scales: [{ key: 1 }, { key: -1 }, { key: 2 }], requires: ['ts-2', 'alt-2'],
        options: opt([['T', 'Tono'], ['S', 'Semitono']]), mode: 'calm', ...T(null, 3),
        lesson: { title: 'El dibujo T-T-S-T-T-T-S', text: ['Para que una escala sea mayor necesita el dibujo T-T-S-T-T-T-S. Si empiezas en Sol, entre Fa y Sol habría un tono, así que hay que subir el Fa: Fa♯-Sol es un semitono. Por eso Sol mayor lleva Fa♯.'], example: 'Fa mayor, grados 3.º y 4.º: La-Si sería un tono, pero tiene que ser un semitono → Si♭.' },
      },
      {
        id: 'ton-2', title: 'Armaduras de sostenidos', kind: 'keysig', keys: [0, 1, 2, 3, 4], clefs: ['treble', 'bass'], mode: 'major', requires: ['ton-1', 'arm-2'],
        ...T(null, 3.5), present: 'board',
        lesson: { title: 'El último sostenido, un semitono más', text: ['Los sostenidos de la armadura aparecen siempre en el mismo orden: Fa, Do, Sol, Re, La, Mi, Si.', 'Para saber la tonalidad mayor, mira el último sostenido y sube un semitono.'], example: 'Fa♯, Do♯, Sol♯ → último: Sol♯ → un semitono más arriba, La → La mayor.' },
      },
      {
        id: 'ton-3', title: 'Armaduras de bemoles', kind: 'keysig', keys: [-1, -2, -3, -4, 1, 2], clefs: ['treble', 'bass'], mode: 'major', requires: ['ton-2', 'arm-3'],
        ...T(null, 3.5),
        lesson: { title: 'El penúltimo bemol', text: ['Los bemoles van en el orden contrario: Si, Mi, La, Re, Sol, Do, Fa. La tonalidad mayor es el penúltimo bemol.', 'Con un solo bemol no hay penúltimo: es Fa mayor (apréndetelo de memoria).'], example: 'Si♭, Mi♭, La♭ → penúltimo: Mi♭ → Mi bemol mayor.' },
      },
      {
        id: 'ton-4', title: 'La tonalidad relativa menor', kind: 'keysig', keys: [0, 1, 2, 3, -1, -2, -3], mode: 'minor', requires: ['ton-3', 'intc-2'],
        ...T(null, 4),
        lesson: { title: 'Una 3.ª menor más abajo', text: ['Cada armadura sirve para dos tonalidades: una mayor y su relativa menor.', 'Para encontrar la menor, busca la mayor y baja una 3.ª menor (tres semitonos); también es el VI grado de la escala mayor.'], example: '1 sostenido → Sol mayor → bajo una 3.ª menor → Mi menor.' },
      },
      {
        id: 'ton-5', title: 'Tres escalas menores', kind: 'scale', requires: ['ton-4', 'ts-3'],
        options: opt([['mayor', 'Mayor'], ['natural', 'Menor natural'], ['armonica', 'Menor armónica'], ['melodica', 'Menor melódica']]), mode: 'calm', ...T(null, 6),
        lesson: { title: 'Natural, armónica y melódica', text: ['La menor natural usa solo las notas de su armadura (La menor: todas blancas). La armónica sube el VII grado para tener sensible (Sol♯).', 'La melódica, al subir, sube el VI y el VII (Fa♯ y Sol♯).'], example: 'La, Si, Do, Re, Mi, Fa, Sol♯, La: solo está alterado el VII → menor armónica.' },
      },
      {
        id: 'ton-6', title: 'Desafío de tonalidades', kind: 'keysig', keys: [-4, -3, -2, -1, 0, 1, 2, 3, 4], mode: 'mix', requires: ['ton-5', 'arm-4'], passAcc: 0.92,
        ...T(null, 4),
        lesson: { title: 'El círculo de quintas', text: ['Las tonalidades con sostenidos avanzan de 5.ª en 5.ª hacia arriba (Do, Sol, Re, La, Mi…) y las de bemoles, de 5.ª en 5.ª hacia abajo (Do, Fa, Si♭, Mi♭…). Cada paso añade una alteración.'], example: '2 bemoles, ¿menor? → la mayor es Si♭ → bajo una 3.ª menor → Sol menor.' },
      },
    ],
  },
  {
    id: 'repaso-teoria',
    title: 'Gran repaso de teoría',
    area: 'teoria',
    clefIcon: 'bass',
    description: 'Todo mezclado, como en un examen de Lenguaje Musical.',
    levels: [
      {
        id: 'fin-1', title: 'Gran repaso', kind: 'mixed', from: ['ton-6', 'intc-5', 'aco-3', 'cc-3', 'expr-5', 'comp-4', 'gra-3', 'ts-3'], requires: ['ton-6', 'intc-6', 'aco-4', 'cc-3', 'expr-5'],
        count: 30, passAcc: 0.9, mode: 'calm', ...T(null, 4),
        lesson: { title: 'Como en el examen', text: ['Todo mezclado, como en un examen de Lenguaje Musical: cada pregunta es distinta. Respira, mira primero qué te preguntan y luego responde.'], example: 'Armadura de 3 bemoles, ¿mayor? Penúltimo bemol, Mi♭ → Mi bemol mayor.' },
      },
    ],
  },
];

// Ruta recomendada que intercala lectura y teoría (docs/investigacion-teoria.md § 5.2).
export const ROUTE = [
  'p1', 'sol-1', 'sol-2', 'rit-1', 'rit-2', 'dir-1', 'sol-3', 'dir-2', 'rit-3', 'sol-4', 'sol-5', 'rit-4', 'mel-1', 'int-1',
  'fa-1', 'fa-2', 'rit-5', 'comp-1', 'int-2', 'fa-3', 'fa-4', 'comp-2', 'ts-1', 'expr-1', 'fa-5', 'comp-3', 'ts-2', 'gra-1', 'expr-2',
  'sol-6', 'sol-7', 'sol-8', 'int-3', 'comp-4', 'expr-3', 'fa-6', 'fa-7', 'fa-8', 'int-4', 'comp-5', 'gra-2', 'expr-4',
  'gran-1', 'gran-2', 'int-5', 'comp-6', 'intc-1', 'expr-5', 'sol-9', 'fa-9', 'intc-2', 'gran-3', 'sol-10', 'intc-3', 'cc-1',
  'sol-11', 'fa-10', 'intc-4', 'cc-2', 'gran-4', 'aco-1', 'cc-3', 'alt-1', 'alt-2', 'ton-1', 'aco-2', 'alt-3', 'alt-4', 'intc-5',
  'alt-5', 'ts-3', 'aco-3', 'intc-6', 'arm-1', 'arm-2', 'ton-2', 'arm-3', 'ton-3', 'gra-3', 'ton-4', 'arm-4', 'aco-4', 'ton-5',
  'ton-6', 'gran-5', 'arm-5', 'fin-1',
];
