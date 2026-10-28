// Currículo: mundos y niveles. La justificación está en docs/diseno-niveles.md y en
// docs/investigacion-pedagogia.md (§ 2.8). Resumen:
// - Notas guía primero (Do central y la nota que marca la clave) y luego 2 notas nuevas por nivel.
// - Primera octava de sol → primera octava de fa → resto de sol → resto de fa → gran pentagrama.
// - Líneas adicionales por sus notas guía (Do agudo, Do grave), como mucho 3.
// - Alteraciones escritas antes que armaduras; armaduras de 1 a 4, alternando ♯ y ♭.
// - Cada nivel abre con una lección corta (lesson) que se ve y se oye antes de jugar.
//
// Campos de un nivel: notes ('G4' en la clave del nivel o 'bass:F3'; 'F4♮' dibuja el becuadro),
// newNotes, clefs, key o keys (armaduras que se alternan), mode ('calm' sin tiempo o 'timed'),
// limit (segundos por nota en el desafío), target (mediana de respuesta para 3 estrellas),
// count, warmup (notas sin prisa al empezar), passAcc (precisión para pasar), requires.

import { parseNote, staffPos, keyAlters, noteId, naturalRange, noteAtPos } from './music.js';
import { cardKey } from './adaptive.js';
import { THEORY_WORLDS, ROUTE } from './curriculum-theory.js';
import { generateItems } from './theory.js';

export { ROUTE };

const R = naturalRange;
const on = (clef, ids) => ids.map((id) => `${clef}:${id}`);
const T = (limit, target) => ({ limit, target });

const READING_WORLDS = [
  {
    id: 'inicio',
    title: 'Primeros pasos',
    clefIcon: 'treble',
    description: 'Antes de los nombres: aprender a mirar dónde se posa cada pájaro.',
    levels: [
      {
        id: 'p1',
        title: 'Línea o espacio',
        answer: 'linespace',
        notes: R('D4', 'G5'),
        mode: 'calm',
        ...T(null, 1.5),
        lesson: {
          title: 'Cables y huecos',
          text: [
            'El pentagrama son cinco cables. Un pájaro puede posarse en un cable, con la línea atravesándolo, o en el hueco entre dos cables: un espacio.',
            'Antes de aprender nombres, mira bien: ¿está en una línea o en un espacio? Responde con los dos botones de abajo.',
          ],
          show: ['E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
          bands: ['E4', 'F4'],
        },
      },
    ],
  },
  {
    id: 'sol1',
    title: 'Clave de sol: primera octava',
    clefIcon: 'treble',
    description: 'Del Do central al Do de arriba, empezando por las notas guía.',
    intro: 'La clave de sol es la de la mano derecha del piano, la flauta, el violín, la guitarra y la voz.',
    levels: [
      {
        id: 'sol-1',
        title: 'Sol y Do',
        notes: ['C4', 'G4'],
        newNotes: ['C4', 'G4'],
        ...T(4, 2.0),
        lesson: {
          title: 'Sol y Do, las notas guía',
          text: [
            'La clave de sol se enrosca en la segunda línea: el pájaro que se posa en ese cable es Sol.',
            'Debajo del pentagrama, en su propio cable cortito (una línea adicional), está Do: el Do central del piano.',
            'Son notas guía: desde ellas encontrarás todas las demás.',
          ],
        },
      },
      {
        id: 'sol-2',
        title: 'Re y Fa',
        notes: ['C4', 'D4', 'F4', 'G4'],
        newNotes: ['D4', 'F4'],
        ...T(4, 2.0),
        lesson: {
          title: 'Re y Fa, vecinos de las guías',
          text: [
            'Re cuelga justo debajo del pentagrama: es el paso siguiente a Do.',
            'Fa está en el primer espacio, justo debajo de Sol. De una nota a la siguiente siempre se alternan línea y espacio.',
          ],
        },
      },
      {
        id: 'sol-3',
        title: 'Mi y La',
        notes: R('C4', 'A4'),
        newNotes: ['E4', 'A4'],
        ...T(3.5, 1.8),
        lesson: {
          title: 'Mi y La',
          text: [
            'Mi está en la primera línea, el cable de abajo. Encima, en el primer espacio, ya conoces a Fa.',
            'La está en el segundo espacio, justo encima de Sol. Si dudas, busca el Sol de la clave y sube o baja un paso.',
          ],
        },
      },
      {
        id: 'sol-4',
        title: 'Si y el Do de arriba',
        notes: R('C4', 'C5'),
        newNotes: ['B4', 'C5'],
        ...T(3.5, 1.8),
        lesson: {
          title: 'Si y el Do de arriba',
          text: [
            'Si se posa en la línea del medio, la tercera.',
            'En el tercer espacio vuelve a aparecer Do: el mismo nombre ocho notas más arriba. Es otra nota guía.',
          ],
        },
      },
      {
        id: 'sol-5',
        title: 'Desafío de la primera octava',
        notes: R('C4', 'C5'),
        count: 30,
        passAcc: 0.92,
        ...T(2.5, 1.6),
        lesson: {
          title: 'Desafío: de Do a Do',
          text: [
            'Las ocho notas de la primera octava, ahora más deprisa y sin calentamiento.',
            'Mira primero si el pájaro está en línea o en espacio y cuenta desde la guía más cercana: Do central, Sol o el Do de arriba.',
          ],
          bands: ['C4', 'G4', 'C5'],
        },
      },
    ],
  },
  {
    id: 'fa1',
    title: 'Clave de fa: primera octava',
    clefIcon: 'bass',
    description: 'La mano izquierda del piano: del Do grave al Do central.',
    intro: 'La clave de fa es la de la mano izquierda del piano, el violonchelo, el contrabajo y el fagot. Ojo: las mismas posiciones tienen otros nombres que en clave de sol.',
    levels: [
      {
        id: 'fa-1',
        title: 'Fa y Do',
        clefs: ['bass'],
        notes: ['F3', 'C4'],
        newNotes: ['F3', 'C4'],
        ...T(4, 2.0),
        lesson: {
          title: 'Fa y Do, las guías de la clave de fa',
          text: [
            'Los dos puntos de la clave de fa abrazan la cuarta línea: el pájaro que se posa ahí es Fa.',
            'Encima del pentagrama, en una línea adicional, está otra vez el Do central: el mismo Do de la clave de sol, visto desde abajo.',
          ],
        },
      },
      {
        id: 'fa-2',
        title: 'Mi y Sol',
        clefs: ['bass'],
        notes: ['E3', 'F3', 'G3', 'C4'],
        newNotes: ['E3', 'G3'],
        ...T(4, 2.0),
        lesson: {
          title: 'Mi y Sol, a los lados de Fa',
          text: [
            'Mi está en el espacio de debajo de Fa (el tercer espacio) y Sol en el de encima (el cuarto).',
            'Cuidado: en clave de sol esos mismos huecos se llamaban de otra manera. Mira siempre la clave antes de nombrar.',
          ],
        },
      },
      {
        id: 'fa-3',
        title: 'La y Si',
        clefs: ['bass'],
        notes: R('E3', 'C4'),
        newNotes: ['A3', 'B3'],
        ...T(3.5, 1.8),
        lesson: {
          title: 'La y Si, hasta el Do central',
          text: [
            'La se posa en la quinta línea, la de arriba del todo.',
            'Si cuelga justo encima del pentagrama, y el siguiente paso ya es el Do central en su línea adicional.',
          ],
        },
      },
      {
        id: 'fa-4',
        title: 'El Do grave',
        clefs: ['bass'],
        notes: R('C3', 'C4'),
        newNotes: ['C3', 'D3'],
        ...T(3.5, 1.8),
        lesson: {
          title: 'El Do grave y Re',
          text: [
            'Do está en el segundo espacio: es el Do ocho notas por debajo del Do central, otra nota guía.',
            'Re se posa en la línea del medio, entre Do y Mi.',
          ],
        },
      },
      {
        id: 'fa-5',
        title: 'Desafío de la primera octava de fa',
        clefs: ['bass'],
        notes: R('C3', 'C4'),
        count: 30,
        passAcc: 0.92,
        ...T(2.5, 1.6),
        lesson: {
          title: 'Desafío: de Do a Do en clave de fa',
          text: [
            'La primera octava de fa, más deprisa. Guías: el Do grave, el Fa de la clave y el Do central.',
            'Si te sale el nombre que tendría en clave de sol, para un instante y mira la clave.',
          ],
          bands: ['C3', 'F3', 'C4'],
        },
      },
    ],
  },
  {
    id: 'sol2',
    title: 'Clave de sol: todo el pentagrama',
    clefIcon: 'treble',
    description: 'Las notas de arriba, hasta el Sol que se posa sobre el pentagrama.',
    levels: [
      {
        id: 'sol-6',
        title: 'Re y Mi de arriba',
        notes: R('C4', 'E5'),
        newNotes: ['D5', 'E5'],
        ...T(3, 1.7),
        lesson: {
          title: 'Re y Mi, una octava más arriba',
          text: [
            'Re se posa en la cuarta línea y Mi en el cuarto espacio.',
            'Se llaman igual que el Re y el Mi de abajo, pero suenan ocho notas más agudos.',
          ],
        },
      },
      {
        id: 'sol-7',
        title: 'Fa y Sol de arriba',
        notes: R('C4', 'G5'),
        newNotes: ['F5', 'G5'],
        ...T(3, 1.7),
        lesson: {
          title: 'Fa y Sol, en lo alto',
          text: [
            'Fa se posa en la quinta línea, el cable de arriba. Sol, encima del pentagrama.',
            'Ese Sol está una octava por encima del Sol de la clave: otra guía para las notas agudas.',
          ],
        },
      },
      {
        id: 'sol-8',
        title: 'Desafío del pentagrama de sol',
        notes: R('C4', 'G5'),
        count: 30,
        passAcc: 0.92,
        ...T(2, 1.4),
        lesson: {
          title: 'Desafío: todo el pentagrama de sol',
          text: [
            'Doce notas, del Do central al Sol de arriba, y cada vez más deprisa.',
            'Tus guías: Do central, el Sol de la clave, el Do del tercer espacio y el Sol de arriba.',
          ],
          bands: ['C4', 'G4', 'C5', 'G5'],
        },
      },
    ],
  },
  {
    id: 'fa2',
    title: 'Clave de fa: todo el pentagrama',
    clefIcon: 'bass',
    description: 'Las notas graves, hasta el Fa que cuelga bajo el pentagrama.',
    levels: [
      {
        id: 'fa-6',
        title: 'Si y La graves',
        clefs: ['bass'],
        notes: R('A2', 'C4'),
        newNotes: ['B2', 'A2'],
        ...T(3, 1.7),
        lesson: {
          title: 'Si y La, bajando desde el Do grave',
          text: [
            'Si se posa en la segunda línea y La en el primer espacio.',
            'Desde el Do grave se baja paso a paso: Do, Si, La.',
          ],
        },
      },
      {
        id: 'fa-7',
        title: 'Sol y Fa graves',
        clefs: ['bass'],
        notes: R('F2', 'C4'),
        newNotes: ['G2', 'F2'],
        ...T(3, 1.7),
        lesson: {
          title: 'Sol y Fa, en lo más bajo',
          text: [
            'Sol se posa en la primera línea y Fa cuelga debajo del pentagrama.',
            'Ese Fa está ocho notas por debajo del Fa de la clave: otra guía para las notas graves.',
          ],
        },
      },
      {
        id: 'fa-8',
        title: 'Desafío del pentagrama de fa',
        clefs: ['bass'],
        notes: R('F2', 'C4'),
        count: 30,
        passAcc: 0.92,
        ...T(2, 1.4),
        lesson: {
          title: 'Desafío: todo el pentagrama de fa',
          text: [
            'Del Fa grave al Do central, cada vez más deprisa.',
            'Tus guías: Fa grave, Do grave, el Fa de la clave y el Do central.',
          ],
          bands: ['F2', 'C3', 'F3', 'C4'],
        },
      },
    ],
  },
  {
    id: 'gran1',
    exact: true, // con piano, hay que tocar en la octava escrita
    title: 'Gran pentagrama',
    clefIcon: 'treble',
    description: 'Los dos pentagramas del piano a la vez.',
    intro: 'El piano se lee con dos pentagramas unidos por una llave: arriba la clave de sol (mano derecha) y abajo la de fa (mano izquierda).',
    levels: [
      {
        id: 'gran-1',
        title: 'Guías en los dos pentagramas',
        clefs: ['treble', 'bass'],
        notes: [...on('bass', ['C3', 'F3', 'C4']), ...on('treble', ['C4', 'G4', 'C5'])],
        ...T(3, 1.6),
        lesson: {
          title: 'Dos pentagramas a la vez',
          text: [
            'Ahora los pájaros pueden posarse arriba o abajo. Antes de nombrar, mira en qué pentagrama está.',
            'El Do central queda entre los dos y puede escribirse en cualquiera: con una línea adicional bajo el de sol o sobre el de fa.',
          ],
          bands: ['treble:C4', 'bass:C4'],
        },
      },
      {
        id: 'gran-2',
        title: 'Saltar de clave',
        clefs: ['treble', 'bass'],
        notes: [...on('bass', R('F2', 'C4')), ...on('treble', R('C4', 'G5'))],
        ...T(2.5, 1.6),
        lesson: {
          title: 'La misma línea, otro nombre',
          text: [
            'La primera línea es Sol en clave de fa y Mi en clave de sol. La quinta, La en clave de fa y Fa en clave de sol.',
            'Cada vez que el pájaro cambie de pentagrama, cambia también de clave en tu cabeza.',
          ],
          show: ['bass:G2', 'treble:E4', 'bass:A3', 'treble:F5'],
          bands: ['bass:G2', 'treble:E4'],
        },
      },
    ],
  },
  {
    id: 'adic',
    exact: true, // con piano, hay que tocar en la octava escrita
    title: 'Líneas adicionales',
    clefIcon: 'treble',
    description: 'Más allá de los cinco cables: hasta el Do agudo y el Do más grave.',
    intro: 'Las líneas adicionales son cables cortos que alargan el pentagrama. No hace falta contarlas una a una: aprende la forma de cada posición, como haces con las demás.',
    levels: [
      {
        id: 'sol-9',
        title: 'Por debajo del Do central',
        notes: R('A3', 'G5'),
        newNotes: ['B3', 'A3'],
        ...T(3, 1.7),
        lesson: {
          title: 'Si y La, bajo el Do central',
          text: [
            'Si cuelga justo debajo de la línea del Do central.',
            'La se posa en una segunda línea adicional. Fíjate en la forma: dos cables cortos y el pájaro atravesando el de abajo.',
          ],
        },
      },
      {
        id: 'fa-9',
        title: 'Un paso más en clave de fa',
        clefs: ['bass'],
        notes: R('E2', 'D4'),
        newNotes: ['E2', 'D4'],
        ...T(3, 1.7),
        lesson: {
          title: 'Mi grave y Re',
          text: [
            'Mi se posa en la línea adicional de debajo del pentagrama de fa.',
            'Re cuelga por encima de la línea del Do central.',
          ],
        },
      },
      {
        id: 'gran-3',
        title: 'La zona central',
        clefs: ['treble', 'bass'],
        notes: [...on('treble', R('A3', 'E4')), ...on('bass', R('A3', 'E4'))],
        ...T(3, 1.7),
        lesson: {
          title: 'La misma nota, dos escrituras',
          text: [
            'Alrededor del Do central, las mismas notas pueden escribirse en clave de sol (con líneas por debajo) o en clave de fa (con líneas por encima).',
            'Suenan igual y se llaman igual: solo cambia el pentagrama.',
          ],
          show: ['treble:A3', 'treble:C4', 'treble:E4', 'bass:A3', 'bass:C4', 'bass:E4'],
          bands: ['treble:C4', 'bass:C4'],
        },
      },
      {
        id: 'sol-10',
        title: 'El Do agudo',
        notes: [...R('A3', 'A5'), 'C6'],
        newNotes: ['A5', 'C6'],
        ...T(3, 1.7),
        lesson: {
          title: 'La agudo y el Do agudo',
          text: [
            'La se posa en la primera línea adicional de arriba.',
            'Do se posa en la segunda: es el Do agudo, dos octavas por encima del Do central. Otra nota guía.',
          ],
        },
      },
      {
        id: 'sol-11',
        title: 'Completar arriba y abajo',
        notes: R('G3', 'C6'),
        newNotes: ['B5', 'G3'],
        ...T(2.5, 1.6),
        lesson: {
          title: 'Si agudo y Sol grave',
          text: [
            'Si cuelga justo debajo del Do agudo, entre dos líneas adicionales.',
            'Sol cuelga debajo de la segunda línea adicional de abajo. ¿Está el pájaro sobre la línea o colgando de ella?',
          ],
        },
      },
      {
        id: 'fa-10',
        title: 'El Do más grave',
        clefs: ['bass'],
        notes: R('C2', 'D4'),
        newNotes: ['D2', 'C2'],
        ...T(3, 1.7),
        lesson: {
          title: 'Re y el Do más grave',
          text: [
            'Re cuelga de la primera línea adicional de abajo.',
            'Do se posa en la segunda: dos octavas por debajo del Do central.',
          ],
        },
      },
      {
        id: 'gran-4',
        title: 'Todo el teclado',
        clefs: ['treble', 'bass'],
        notes: [...on('bass', R('C2', 'C4')), ...on('treble', R('C4', 'C6'))],
        ...T(2.5, 1.6),
        lesson: {
          title: 'Cinco Do para orientarte',
          text: [
            'Del Do más grave al Do agudo, en los dos pentagramas.',
            'Cinco Do te sirven de guía: dos líneas por debajo del de fa, el segundo espacio de fa, el central, el tercer espacio de sol y dos líneas por encima.',
          ],
          show: ['bass:C2', 'bass:C3', 'bass:C4', 'treble:C5', 'treble:C6'],
          bands: [],
        },
      },
    ],
  },
  {
    id: 'alter',
    exact: true, // con piano, hay que tocar en la octava escrita
    title: 'Sostenidos y bemoles',
    clefIcon: 'treble',
    description: 'Las teclas negras: ♯ sube, ♭ baja y ♮ devuelve la nota a su sitio.',
    intro: 'Las alteraciones cambian el sonido de una nota sin cambiar su sitio en el pentagrama. Si respondes con botones, escribe bien su nombre: Fa♯ y Sol♭ son la misma tecla pero no la misma nota escrita.',
    levels: [
      {
        id: 'alt-1',
        title: 'El sostenido',
        notes: [...R('C4', 'G5'), 'F#4', 'F#5', 'C#5'],
        newNotes: ['F#4', 'F#5', 'C#5'],
        ...T(3, 1.7),
        lesson: {
          title: 'El sostenido sube',
          text: [
            'El sostenido (♯) delante de una nota la sube medio tono: en el piano, la tecla de su derecha.',
            'Fa♯ es la tecla negra justo a la derecha de Fa. El pájaro sigue en el mismo sitio: solo cambia su nombre.',
          ],
          show: ['F4', 'F#4', 'C5', 'C#5'],
          bands: ['F#4', 'C#5'],
        },
      },
      {
        id: 'alt-2',
        title: 'El bemol',
        notes: [...R('C4', 'G5'), 'F#4', 'C#5', 'Bb4', 'Eb4', 'Eb5'],
        newNotes: ['Bb4', 'Eb4', 'Eb5'],
        ...T(3, 1.7),
        lesson: {
          title: 'El bemol baja',
          text: [
            'El bemol (♭) baja la nota medio tono: en el piano, la tecla de su izquierda.',
            'Si♭ es la tecla negra justo a la izquierda de Si; Mi♭, la de la izquierda de Mi.',
          ],
          show: ['E4', 'Eb4', 'B4', 'Bb4'],
          bands: ['Eb4', 'Bb4'],
        },
      },
      {
        id: 'alt-3',
        title: 'El becuadro',
        notes: [...R('C4', 'G5'), 'F#4', 'Bb4', 'Eb5', 'G#4', 'Ab4', 'F4♮', 'B4♮'],
        newNotes: ['G#4', 'Ab4', 'F4♮', 'B4♮'],
        ...T(3, 1.7),
        lesson: {
          title: 'El becuadro anula',
          text: [
            'El becuadro (♮) quita el sostenido o el bemol: la nota vuelve a ser natural.',
            'Sol♯ y La♭ son la misma tecla negra, pero se escriben en sitios distintos y se llaman distinto.',
          ],
          show: ['F4♮', 'G#4', 'Ab4', 'B4♮'],
          bands: ['G#4', 'Ab4'],
        },
      },
      {
        id: 'alt-4',
        title: 'Alteraciones en clave de fa',
        clefs: ['bass'],
        notes: [...R('F2', 'C4'), 'F#3', 'C#3', 'Bb2', 'Eb3', 'F3♮', 'B2♮'],
        newNotes: ['F#3', 'C#3', 'Bb2', 'Eb3'],
        ...T(3, 1.7),
        lesson: {
          title: 'Lo mismo, en clave de fa',
          text: [
            'Sostenidos, bemoles y becuadros funcionan igual en clave de fa.',
            'Solo cambia dónde está cada nota: Fa♯ en la cuarta línea, Do♯ en el segundo espacio, Si♭ en la segunda línea.',
          ],
          show: ['Bb2', 'C#3', 'Eb3', 'F#3'],
        },
      },
      {
        id: 'alt-5',
        title: 'Misma tecla, dos nombres',
        clefs: ['treble', 'bass'],
        notes: [
          ...on('treble', [...R('C4', 'C5'), 'F#4', 'Bb4', 'Db5', 'Gb4', 'A#4', 'D#5']),
          ...on('bass', [...R('F2', 'C4'), 'Eb3', 'Ab2', 'C#3', 'F#3']),
        ],
        newNotes: ['treble:Db5', 'treble:Gb4', 'treble:A#4', 'treble:D#5'],
        passAcc: 0.92,
        ...T(2, 1.5),
        lesson: {
          title: 'Misma tecla, dos nombres',
          text: [
            'Re♭ y Do♯ suenan igual, pero se escriben en sitios distintos: Re♭ en el sitio de Re y Do♯ en el de Do.',
            'Lee siempre primero la posición y después añade la alteración.',
          ],
          show: ['treble:Gb4', 'treble:F#4', 'treble:A#4', 'treble:Bb4'],
          bands: [],
        },
      },
    ],
  },
  {
    id: 'armad',
    exact: true, // con piano, hay que tocar en la octava escrita
    title: 'Armaduras',
    clefIcon: 'treble',
    description: 'Los sostenidos y bemoles junto a la clave valen para toda la pieza.',
    intro: 'La armadura son los sostenidos o bemoles escritos junto a la clave. Valen para todas las notas con ese nombre, en cualquier octava, aunque el pájaro no lleve alteración.',
    levels: [
      {
        id: 'arm-1',
        title: 'Sol mayor y Fa mayor',
        keys: [1, -1],
        notes: R('C4', 'G5'),
        ...T(3, 1.8),
        lesson: {
          title: 'Una alteración en la armadura',
          text: [
            'Con un ♯ en la línea de Fa (Sol mayor), todos los Fa son Fa♯. Con un ♭ en la línea de Si (Fa mayor), todos los Si son Si♭.',
            'A mitad del nivel cambia la armadura: mira siempre junto a la clave antes de nombrar.',
          ],
          show: ['F4', 'G4', 'F5'],
          bands: ['F4', 'F5'],
        },
      },
      {
        id: 'arm-2',
        title: 'Re mayor y Si♭ mayor',
        clefs: ['treble', 'bass'],
        keys: [2, -2],
        notes: [...on('bass', R('F2', 'C4')), ...on('treble', R('C4', 'G5'))],
        ...T(3, 1.8),
        lesson: {
          title: 'Dos alteraciones',
          text: [
            'Re mayor lleva Fa♯ y Do♯. Si♭ mayor lleva Si♭ y Mi♭.',
            'La última alteración de la armadura es la que más se olvida: Do♯ en Re mayor y Mi♭ en Si♭ mayor.',
          ],
          show: ['treble:C5', 'treble:F4', 'bass:C3', 'bass:F3'],
          bands: ['treble:C5', 'bass:C3'],
        },
      },
      {
        id: 'arm-3',
        title: 'La mayor y Mi♭ mayor',
        clefs: ['treble', 'bass'],
        keys: [3, -3],
        notes: [...on('bass', R('F2', 'C4')), ...on('treble', R('C4', 'G5'))],
        ...T(3, 1.8),
        lesson: {
          title: 'Tres alteraciones',
          text: [
            'La mayor lleva Fa♯, Do♯ y Sol♯. Mi♭ mayor lleva Si♭, Mi♭ y La♭.',
            'Los sostenidos aparecen siempre en el mismo orden: Fa, Do, Sol, Re, La, Mi, Si. Los bemoles, al revés: Si, Mi, La, Re, Sol, Do, Fa.',
          ],
          show: ['treble:G4', 'treble:C5', 'treble:F5', 'bass:G2', 'bass:G3'],
          bands: ['treble:G4', 'bass:G3'],
        },
      },
      {
        id: 'arm-4',
        title: 'Mi mayor y La♭ mayor',
        clefs: ['treble', 'bass'],
        keys: [4, -4],
        notes: [...on('bass', R('F2', 'C4')), ...on('treble', R('C4', 'G5'))],
        ...T(3, 1.9),
        lesson: {
          title: 'Cuatro alteraciones',
          text: [
            'Mi mayor lleva Fa♯, Do♯, Sol♯ y Re♯. La♭ mayor lleva Si♭, Mi♭, La♭ y Re♭.',
            'Truco para saber la tonalidad: con sostenidos, sube medio tono desde el último; con bemoles, es el penúltimo bemol.',
          ],
          show: ['treble:D5', 'treble:D4', 'bass:D3'],
          bands: ['treble:D5', 'treble:D4', 'bass:D3'],
        },
      },
    ],
  },
  {
    id: 'final',
    exact: true, // con piano, hay que tocar en la octava escrita
    title: 'Gran final',
    clefIcon: 'bass',
    description: 'Los desafíos de quien ya lee con soltura.',
    levels: [
      {
        id: 'gran-5',
        title: 'Desafío final del gran pentagrama',
        clefs: ['treble', 'bass'],
        notes: [...on('bass', R('C2', 'C4')), ...on('treble', R('C4', 'C6'))],
        count: 30,
        passAcc: 0.92,
        ...T(1.8, 1.3),
        lesson: {
          title: 'Del Do más grave al Do agudo',
          text: [
            'Todas las notas de los dos pentagramas, saltando de clave sin parar y muy deprisa.',
            'Ya no cuentes: reconoce la forma de cada posición, como quien reconoce una cara.',
          ],
          show: ['bass:C2', 'bass:F3', 'treble:G4', 'treble:C6'],
          bands: [],
        },
      },
      {
        id: 'arm-5',
        title: 'Armaduras mezcladas',
        clefs: ['treble', 'bass'],
        keyChoices: [1, -1, 2, -2, 3, -3, 4, -4],
        keyCount: 3,
        notes: [...on('bass', R('F2', 'C4')), ...on('treble', R('C4', 'G5'))],
        count: 30,
        passAcc: 0.92,
        ...T(2, 1.6),
        lesson: {
          title: 'La armadura cambia cada 10 notas',
          text: [
            'Tres armaduras distintas en el mismo nivel, de una a cuatro alteraciones.',
            'Cuando aparezca el aviso de cambio, mira la armadura nueva antes de seguir.',
          ],
          show: ['treble:F4', 'treble:B4', 'bass:F3'],
          bands: [],
        },
      },
    ],
  },
  {
    id: 'experto',
    exact: true, // con piano, hay que tocar en la octava escrita
    title: 'Para expertos',
    clefIcon: 'treble',
    optional: true,
    description: 'Opcional. Tres líneas adicionales, alteraciones raras y armaduras de 5 a 7.',
    levels: [
      {
        id: 'exp-1', title: 'Tres líneas por arriba', requires: 'sol-11', notes: R('G3', 'E6'), newNotes: ['D6', 'E6'], ...T(2.5, 1.6),
        lesson: { title: 'Re y Mi sobreagudos', text: ['Re cuelga encima del Do agudo y Mi se posa en la tercera línea adicional.', 'Más allá de tres líneas, hasta los músicos expertos dudan: por eso se escribe «8va».'] },
      },
      {
        id: 'exp-2', title: 'Jefe final de la clave de sol', notes: R('F3', 'E6'), newNotes: ['F3'], count: 30, passAcc: 0.92, ...T(1.8, 1.3),
        lesson: { title: 'Toda la clave de sol', text: ['Del Fa con tres líneas por debajo al Mi con tres por encima.', 'Velocidad de músico: menos de un segundo y medio por nota.'] },
      },
      {
        id: 'exp-3', title: 'Jefe final de la clave de fa', requires: 'fa-10', clefs: ['bass'], notes: R('C2', 'E4'), newNotes: ['E4'], count: 30, passAcc: 0.92, ...T(1.8, 1.3),
        lesson: { title: 'Toda la clave de fa', text: ['Mi se posa en la segunda línea adicional de arriba.', 'Del Do más grave al Mi de arriba, a velocidad de músico.'] },
      },
      {
        id: 'exp-4', title: 'Alteraciones raras', requires: 'alt-5', notes: [...R('C4', 'G5'), 'E#4', 'B#4', 'Cb5', 'Fb4', 'E#5'], newNotes: ['E#4', 'B#4', 'Cb5', 'Fb4'], ...T(3, 1.8),
        lesson: { title: 'Mi♯, Si♯, Do♭ y Fa♭', text: ['Entre Mi y Fa, y entre Si y Do, no hay tecla negra. Por eso Mi♯ suena como Fa, y Do♭ como Si.', 'Aparecen en tonalidades con muchas alteraciones. Con botones, escribe el nombre tal como está escrito.'], show: ['E4', 'E#4', 'Fb4', 'F4'] },
      },
      {
        id: 'exp-5', title: 'Armaduras de 5 a 7', requires: 'arm-4', keys: [5, -5, 6, -6, 7, -7], notes: R('C4', 'G5'), count: 30, ...T(3, 2.0),
        lesson: { title: 'Muchas alteraciones', text: ['Si mayor y Re♭ mayor (5), Fa♯ mayor y Sol♭ mayor (6), Do♯ mayor y Do♭ mayor (7).', 'Con siete sostenidos o siete bemoles, todas las notas están alteradas.'], show: ['F4', 'C5', 'G4'] },
      },
    ],
  },
];

// Lectura y teoría; el mundo de expertos (opcional) va al final.
export const WORLDS = [
  ...READING_WORLDS.filter((w) => !w.optional).map((w) => ({ ...w, area: 'lectura' })),
  ...THEORY_WORLDS,
  ...READING_WORLDS.filter((w) => w.optional).map((w) => ({ ...w, area: 'lectura' })),
];

// Notas guía de cada clave: se aprenden primero y sirven de referencia para contar.
export const LANDMARKS = {
  treble: ['C4', 'G4', 'C5', 'G5', 'C6'],
  bass: ['C2', 'F2', 'C3', 'F3', 'C4'],
  alto: ['F3', 'C4', 'G4'],
  tenor: ['D3', 'C4', 'A4'],
};

export const CHART_TIPS = {
  treble: 'La clave de sol rodea la segunda línea: ahí está el Sol. Se usa para la mano derecha del piano, la flauta, el violín o la voz aguda.',
  bass: 'Los dos puntos de la clave de fa abrazan la cuarta línea: ahí está el Fa. Se usa para la mano izquierda del piano, el violonchelo o el fagot.',
  alto: 'La clave de do en tercera línea marca el Do central en el centro del pentagrama. Es la clave de la viola.',
  tenor: 'La clave de do en cuarta línea pone el Do central en la cuarta línea. La usan el violonchelo, el fagot y el trombón en su registro agudo.',
};

// Lista plana. Cada nivel requiere el anterior de su mundo; el primero de un mundo de lectura
// requiere el último del mundo de lectura anterior; teoría y opcionales dicen qué requieren.
export const LEVELS = [];
{
  let prevTrunk = null;
  for (const w of WORLDS) {
    w.levels.forEach((l, i) => {
      const req = l.requires ?? (i > 0 ? w.levels[i - 1].id : w.optional || w.area === 'teoria' ? null : prevTrunk);
      LEVELS.push({ ...l, world: w.id, area: w.area, exact: !!w.exact, optional: !!w.optional, requires: req ? [].concat(req) : [] });
    });
    if (!w.optional && w.area === 'lectura') prevTrunk = w.levels[w.levels.length - 1].id;
  }
}

export const levelById = (id) => LEVELS.find((l) => l.id === id);

// Lo siguiente después de un nivel: el próximo de la ruta que ya esté abierto y sin estrellas.
export function nextLevel(id, progress = {}) {
  const i = ROUTE.indexOf(id);
  const after = i >= 0 ? ROUTE.slice(i + 1) : [];
  const nextId = after.find((x) => isUnlocked(x, progress) && !(progress[x]?.stars > 0));
  if (nextId) return levelById(nextId);
  const j = LEVELS.findIndex((l) => l.id === id);
  return j >= 0 ? LEVELS[j + 1] ?? null : null;
}

export function isUnlocked(id, progress) {
  const l = levelById(id);
  return !!l && l.requires.every((r) => (progress[r]?.stars ?? 0) > 0);
}

// El nivel que toca jugar: el primero de la ruta (lectura y teoría intercaladas) abierto y sin
// estrellas; si la ruta está terminada, el primero abierto de los opcionales.
export function nextToPlay(progress) {
  const open = (id) => isUnlocked(id, progress) && !(progress[id]?.stars > 0);
  const inRoute = ROUTE.find(open);
  if (inRoute) return levelById(inRoute);
  return LEVELS.find((l) => open(l.id)) ?? levelById(ROUTE[ROUTE.length - 1]);
}

// Repite las notas afectadas por la armadura hasta que sean ~35 % de las que salen,
// con una copia más para la última alteración (la que más se olvida).
function boostAffected(pool, key) {
  if (!key) return pool;
  const alters = keyAlters(key);
  const affected = pool.filter((p) => alters[p.note.step] !== 0);
  if (!affected.length) return pool;
  const copies = Math.max(1, Math.round((0.35 * (pool.length - affected.length)) / (0.65 * affected.length)));
  const order = key > 0 ? [3, 0, 4, 1, 5, 2, 6] : [6, 2, 5, 1, 4, 0, 3];
  const lastStep = order[Math.abs(key) - 1];
  const extra = affected.flatMap((p) => Array(copies - 1 + (p.note.step === lastStep ? 1 : 0)).fill(p));
  return [...pool, ...extra];
}

const DEFAULT_PROMPTS = {
  direction: '¿Cómo sigue la melodía?', interval: '¿Qué intervalo es?', quality: '¿Mayor, menor o justo?',
  tone: '¿Tono o semitono?', figure: '¿Qué figura es?', value: '¿Cuántos tiempos dura?', rest: '¿Qué silencio es?',
  triad: '¿Qué acorde es?',
};

// Nivel de teoría: los ítems salen del generador de su tipo (o de varios, si es mixto).
function buildTheoryLevel(def, ctx) {
  const parts = def.kind === 'mixed' ? def.from.map(levelById) : [def];
  const pool = parts.flatMap((d) => generateItems(d, ctx).map((it) => ({
    ...it,
    options: it.options ?? (Array.isArray(d.options) ? d.options : undefined),
    prompt: it.prompt ?? d.prompt ?? DEFAULT_PROMPTS[it.kind],
    present: def.kind === 'mixed' ? 'board' : it.present,
  })));
  const present = pool.every((it) => it.present === 'board') ? 'board' : 'wire';
  const clefs = def.clefs ?? [pool[0].clef ?? 'treble'];
  const limit = def.limit ?? 4;
  const ls = def.lesson ?? {};
  // Ejemplos de la lección: un ítem de cada respuesta distinta (como mucho 3).
  const seen = new Set();
  const samples = pool.filter((it) => (seen.has(it.answer) ? false : seen.add(it.answer))).slice(0, 3);
  return {
    id: def.id,
    world: def.world,
    title: def.title,
    theory: true,
    kind: def.kind,
    answer: null,
    clefs,
    key: 0,
    segments: null,
    pool,
    newKeys: [],
    lesson: { title: ls.title ?? def.title, text: [].concat(ls.text ?? []), example: ls.example ?? '', samples, show: [], bands: [] },
    present,
    pad: def.twoStep ? { type: 'twostep', ...def.options } : def.kind === 'melody' ? { type: 'notes' } : { type: 'choices', options: Array.isArray(def.options) ? def.options : [] },
    mode: def.mode ?? (present === 'board' ? 'calm' : 'timed'),
    count: def.count ?? (def.kind === 'melody' ? 8 : 20),
    warmup: def.warmup ?? (present === 'wire' ? 4 : 0),
    passAcc: def.passAcc ?? 0.9,
    exactOctave: false,
    spawnMs: def.spawnMs ?? limit * 1000,
    travelMs: def.travelMs ?? limit * 2000,
    targetMs: (def.target ?? 2.5) * 1000,
  };
}

// Convierte la definición en un nivel jugable con su conjunto de tarjetas.
// ctx = { naming } para los textos de los niveles de teoría.
export function buildLevel(def, ctx = {}) {
  if (def.kind) return buildTheoryLevel(def, ctx);
  const clefs = def.clefs ?? ['treble'];
  let keys = def.keys ?? [def.key ?? 0];
  if (def.keyChoices) keys = [...def.keyChoices].sort(() => Math.random() - 0.5).slice(0, def.keyCount ?? 3);

  const makeItem = (key) => (spec) => {
    const [clef, raw] = spec.includes(':') ? spec.split(':') : [clefs[0], spec];
    const natural = raw.endsWith('♮');
    const written = parseNote(natural ? raw.slice(0, -1) : raw);
    // Con armadura las notas se escriben sin alteración y suenan alteradas.
    const note = key && written.alt === 0 && !natural ? { ...written, alt: keyAlters(key)[written.step] } : written;
    const shownAlt = natural ? 0 : key ? null : written.alt || null;
    return { key: cardKey(clef, noteId(note)), clef, note, shownAlt, pos: staffPos(written, clef), spec };
  };

  const segments = keys.map((k) => {
    const toItem = makeItem(k);
    return {
      key: k,
      pool: boostAffected(def.notes.map(toItem), k),
      newKeys: (def.newNotes ?? []).map((s) => toItem(s).key),
    };
  });
  const toItem = makeItem(keys[0]);
  const { pool, newKeys } = segments[0];

  // Lección: lo que se enseña antes de jugar. Por defecto, todas las notas del nivel si caben,
  // con la línea o el espacio de las nuevas resaltados.
  const ls = def.lesson ?? {};
  const unique = (items) => items.filter((it, i) => items.findIndex((x) => x.key === it.key && x.clef === it.clef && x.shownAlt === it.shownAlt) === i);
  const byPitch = (a, b) => (a.clef === b.clef ? 0 : a.clef === 'bass' ? -1 : 1) || a.pos - b.pos || (a.note.alt - b.note.alt);
  const base = def.notes.map(toItem);
  const defaultShow = base.length <= 10 || !def.newNotes?.length ? base : def.newNotes.map(toItem);
  const lesson = {
    title: ls.title ?? def.title,
    text: [].concat(ls.text ?? []),
    show: unique(ls.show ? ls.show.map(toItem) : defaultShow).sort(ls.show ? () => 0 : byPitch).slice(0, 16),
    bands: (ls.bands ?? def.newNotes ?? []).map(toItem),
  };

  const limit = def.limit ?? 3;
  return {
    id: def.id,
    world: def.world,
    title: def.title,
    answer: def.answer ?? null,
    clefs,
    key: keys[0],
    segments: segments.length > 1 ? segments : null,
    pool,
    newKeys,
    lesson,
    present: 'wire',
    pad: { type: 'notes' },
    exactOctave: !!def.exact,
    mode: def.mode ?? 'timed',
    count: def.count ?? 20,
    warmup: def.warmup ?? (def.newNotes?.length ? 5 : 0),
    passAcc: def.passAcc ?? 0.9,
    spawnMs: def.spawnMs ?? limit * 1000,
    travelMs: def.travelMs ?? limit * 2000,
    targetMs: (def.target ?? 2) * 1000,
  };
}

// Rango para la práctica libre: el pentagrama más n líneas adicionales por arriba y por abajo
// (incluye la nota que cuelga de la última línea adicional).
export function rangeFor(clef, ledgers) {
  const out = [];
  for (let p = -(2 * ledgers + 1); p <= 9 + 2 * ledgers; p++) out.push(noteId(noteAtPos(p, clef)));
  return out;
}

// cfg = { clef: 'treble'|'bass'|'grand'|'alto'|'tenor', ledgers, accidentals: 'none'|'sharp'|'flat'|'both',
//         key, mode, travelMs, count }
export function practiceLevel(cfg) {
  const clefs = cfg.clef === 'grand' ? ['treble', 'bass'] : [cfg.clef];
  let notes = clefs.flatMap((c) => rangeFor(c, cfg.ledgers).map((id) => `${c}:${id}`));
  if (!cfg.key && cfg.accidentals !== 'none') {
    const extra = [];
    for (const spec of notes) {
      const [c, id] = spec.split(':');
      const n = parseNote(id);
      if (cfg.accidentals !== 'flat' && ![2, 6].includes(n.step)) extra.push(`${c}:${noteId({ ...n, alt: 1 })}`);
      if (cfg.accidentals !== 'sharp' && ![0, 3].includes(n.step)) extra.push(`${c}:${noteId({ ...n, alt: -1 })}`);
    }
    notes = [...notes, ...extra];
  }
  return buildLevel({
    id: null,
    world: 'practice',
    title: 'Práctica libre',
    clefs,
    key: cfg.key,
    notes,
    mode: cfg.mode,
    count: cfg.count,
    spawnMs: cfg.travelMs / 2,
    travelMs: cfg.travelMs,
    target: 2,
  });
}

// Sesión de repaso con las tarjetas pendientes de una clave.
export function reviewLevel(keys, clef) {
  return buildLevel({
    id: null,
    world: 'review',
    title: 'Repaso de hoy',
    clefs: [clef],
    notes: keys.map((k) => k.slice(clef.length + 1)),
    mode: 'timed',
    count: Math.max(10, Math.min(30, keys.length * 2)),
    limit: 3,
    target: 1.8,
  });
}

// Repaso de teoría: preguntas de los niveles de teoría ya superados cuyo concepto toca repasar
// (cajas de Leitner vencidas) o que más se fallan. Todo en cartel, cada una con sus botones.
export function theoryReviewLevel(cards, progress, ctx = {}, size = 20, now = Date.now()) {
  const defs = LEVELS.filter((l) => l.kind && !['mixed', 'melody'].includes(l.kind) && !l.twoStep && (progress[l.id]?.stars ?? 0) > 0);
  const items = defs.flatMap((d) => buildTheoryLevel(d, ctx).pool).filter((it) => it.options?.length);
  const acc = (c) => (c?.recent?.length ? c.recent.filter(Boolean).length / c.recent.length : 1);
  const scored = items
    .map((it) => ({ it, c: cards[it.key] }))
    .filter(({ c }) => c?.seen)
    .sort((a, b) => (a.c.due <= now) - (b.c.due <= now) || acc(a.c) - acc(b.c))
    .reverse();
  const seen = new Set();
  const pool = [];
  for (const { it } of scored.sort((a, b) => (b.c.due <= now) - (a.c.due <= now) || acc(a.c) - acc(b.c))) {
    if (pool.length >= size) break;
    if (seen.has(it.key) && pool.length < size / 2) continue;
    seen.add(it.key);
    pool.push({ ...it, present: 'board' });
  }
  if (pool.length < 4) return null;
  return {
    id: null, world: 'review', title: 'Repaso de teoría', theory: true, kind: 'mixed', answer: null, clefs: ['treble'], key: 0,
    segments: null, pool, newKeys: [], lesson: { title: 'Repaso de teoría', text: [], example: '', samples: [], show: [], bands: [] },
    present: 'board', pad: { type: 'choices', options: [] }, mode: 'calm', count: Math.min(20, Math.max(10, pool.length)),
    warmup: 0, passAcc: 0.9, exactOctave: false, spawnMs: 4000, travelMs: 8000, targetMs: 4000,
  };
}

export function theoryDueCount(cards, now = Date.now()) {
  return Object.entries(cards).filter(([k, c]) => !k.startsWith('treble:') && !k.startsWith('bass:') && c.seen && c.due <= now).length;
}

// ---------- prueba de nivel por mundo ----------
// 8 preguntas mezcladas, sobre todo de los últimos niveles del mundo. Con 7 aciertos o más, todos sus
// niveles quedan superados con una estrella (docs/investigacion-teoria.md § 2.2).

export const PLACEMENT_SIZE = 8;
export const PLACEMENT_PASS = 7;

export function placementAvailable(world, progress) {
  if (world.levels.length < 2) return false;
  return isUnlocked(world.levels[0].id, progress) && world.levels.some((l) => !(progress[l.id]?.stars > 0));
}

// Reparte n huecos entre los niveles, empezando por el último (el más difícil) y dando la vuelta.
function roundRobin(groups, n, rnd = Math.random) {
  const bags = groups.map((g) => [...g].sort(() => rnd() - 0.5));
  const picked = [];
  const keys = new Set();
  for (let round = 0; picked.length < n && round < 50; round++) {
    for (let i = bags.length - 1; i >= 0 && picked.length < n; i--) {
      const idx = bags[i].findIndex((it) => !keys.has(it.key));
      const it = idx >= 0 ? bags[i].splice(idx, 1)[0] : bags[i].shift();
      if (!it) continue;
      keys.add(it.key);
      picked.push(it);
    }
  }
  return picked;
}

export function buildPlacementLevel(worldId, ctx = {}, rnd = Math.random) {
  const world = WORLDS.find((w) => w.id === worldId);
  if (!world) return null;
  const defs = LEVELS.filter((l) => l.world === worldId);
  const base = {
    id: null,
    world: worldId,
    title: `Prueba de nivel: ${world.title}`,
    placement: worldId,
    placementLevels: defs.map((d) => d.id),
    answer: null,
    newKeys: [],
    lesson: { title: '', text: [], example: '', samples: [], show: [], bands: [] },
    mode: 'calm',
    count: PLACEMENT_SIZE,
    warmup: 0,
    passAcc: PLACEMENT_PASS / PLACEMENT_SIZE,
    fixedOrder: true,
    noRescue: true,
    exactOctave: false,
    spawnMs: 3000,
    travelMs: 6000,
    targetMs: 3000,
  };

  if (world.area === 'teoria') {
    // Las melodías y la respuesta en dos toques necesitan otro teclado: se quedan fuera de la prueba.
    const groups = defs
      .filter((d) => !['melody'].includes(d.kind) && !d.twoStep)
      .map((d) => buildTheoryLevel(d, ctx).pool.filter((it) => it.options?.length).map((it) => ({ ...it, present: 'board' })))
      .filter((g) => g.length);
    const pool = roundRobin(groups, PLACEMENT_SIZE, rnd);
    return { ...base, theory: true, kind: 'mixed', clefs: ['treble'], key: 0, segments: null, pool, present: 'board', pad: { type: 'choices', options: [] } };
  }

  // Lectura: notas de cada nivel; si el mundo cambia de clave usa el gran pentagrama, y si cambia de
  // armadura la prueba va por tramos (como los niveles de armaduras).
  const levels = defs.filter((d) => !d.answer).map((d) => buildLevel(d, ctx));
  if (!levels.length) return null;
  const clefs = [...new Set(levels.flatMap((l) => l.clefs))].sort((a, b) => (a === 'treble' ? -1 : b === 'treble' ? 1 : 0));
  const byKey = new Map();
  for (const l of levels) {
    for (const seg of l.segments ?? [{ key: l.key, pool: l.pool }]) {
      if (!byKey.has(seg.key)) byKey.set(seg.key, []);
      byKey.get(seg.key).push(seg.pool);
    }
  }
  let keys = [...byKey.keys()];
  const nSeg = keys.length >= 4 ? 4 : keys.length >= 2 ? 2 : 1;
  keys = keys.slice(-nSeg);
  const per = PLACEMENT_SIZE / nSeg;
  const segments = keys.map((k) => ({ key: k, pool: roundRobin(byKey.get(k), per, rnd), newKeys: [] }));
  return {
    ...base,
    clefs,
    key: segments[0].key,
    segments: segments.length > 1 ? segments : null,
    pool: segments[0].pool,
    present: 'wire',
    pad: { type: 'notes' },
  };
}
