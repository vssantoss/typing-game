import type { ContentPack } from './types';

export const es: ContentPack = {
  ui: {
    appName: 'Type & Play',
    tagline: '¡Escribe. Responde. Juega con los sonidos!',
    play: 'Jugar',
    settings: 'Zona de Padres',
    back: 'Volver',
    next: 'Siguiente',
    typeIt: '¡Escribe la frase!',
    nowAnswer: '¡Ahora responde!',
    hint: 'Pista',
    stars: 'estrellas',
    levelComplete: '¡Nivel completado!',
    tapTheToys: '¡Toca los juguetes!',
    letsPlay: '¡A jugar!',
    praise: ['¡Increíble!', '¡Lo lograste!', '¡Maravilloso!', '¡Súper!', '¡Fantástico!', '¡Muy bien!', '¡Genial!', '¡Felicidades!'],
    settingsTitle: 'Zona de Padres',
    language: 'Idioma',
    volume: 'Volumen del sonido',
    errorSound: 'Sonido en tecla equivocada',
    errorSoundHelp: 'Suena un golpecito suave y aburrido al pulsar una tecla equivocada. Apagado, la tecla equivocada queda en silencio total.',
    visualCue: 'Brillo en la siguiente letra',
    visualCueHelp: 'La siguiente letra brilla suavemente después de una tecla equivocada, para ayudar a encontrarla.',
    accentLenient: 'Acentos fáciles',
    accentLenientHelp: 'Letras como é, ñ y á se pueden escribir sin el acento (e, n, a).',
    autoPunctuation: 'Puntuación automática',
    autoPunctuationHelp: 'Los puntos, comas y signos de interrogación se escriben solos — no hay que buscarlos.',
    hintAfterMistakes: 'Pista solo después de errores',
    hintAfterMistakesHelp: 'Oculta el botón de pista hasta pulsar algunas teclas equivocadas. Apagado, aparece desde el principio.',
    calmMode: 'Animaciones tranquilas',
    calmModeHelp: 'Animaciones más lentas y suaves, con menos movimiento.',
    on: 'Activado',
    off: 'Desactivado',
    openLevels: 'Abrir todos los niveles',
    openLevelsHelp: 'Desbloquea todos los niveles ahora, sin necesitar estrellas. "Reiniciar niveles" los bloquea de nuevo.',
    openLevelsDone: '¡Niveles abiertos!',
    resetLevels: 'Reiniciar niveles',
    resetLevelsHelp: 'Quita todas las estrellas y bloquea los niveles de nuevo, en todos los idiomas. Los ajustes se mantienen.',
    resetConfirm: 'Toca de nuevo para confirmar',
    resetDone: '¡Niveles reiniciados!',
    parentGateTitle: '¡Solo para adultos!',
    parentGateAsk: '¿Cuánto es {a} × {b}?',
    parentGateGo: 'Entrar'
  },
  levels: [
    {
      title: 'Primeras Palabras',
      emoji: '🐣',
      items: [
        { sentence: 'Veo un gato.', question: '¿Qué veo?', answer: 'gato', hint: [2] },
        { sentence: 'El perro corre.', question: '¿Quién corre?', answer: 'perro', hint: [1] },
        { sentence: 'Me gusta la pizza.', question: '¿Qué me gusta?', answer: 'pizza', hint: [3] },
        { sentence: 'El sol es caliente.', question: '¿Qué es caliente?', answer: 'sol', hint: [1] },
        { sentence: 'Jugamos a la pelota.', question: '¿A qué jugamos?', answer: 'pelota', hint: [3] },
        { sentence: 'El pájaro puede volar.', question: '¿Qué puede hacer el pájaro?', answer: 'volar', hint: [3] },
        { sentence: 'Quiero a mamá.', question: '¿A quién quiero?', answer: 'mamá', hint: [2] },
        { sentence: 'El pez sabe nadar.', question: '¿Qué sabe hacer el pez?', answer: 'nadar', hint: [3] }
      ]
    },
    {
      title: 'Colores y Números',
      emoji: '🌈',
      items: [
        { sentence: 'Vi una pelota roja.', question: '¿De qué color es la pelota?', answer: 'roja', hint: [3] },
        { sentence: 'La gata tiene dos gatitos.', question: '¿Cuántos gatitos tiene la gata?', answer: 'dos', hint: [3] },
        { sentence: 'Mi bici nueva es azul.', question: '¿De qué color es la bici?', answer: 'azul', hint: [4] },
        { sentence: 'El perro grande está feliz.', question: '¿Cómo está el perro?', answer: 'feliz', hint: [4] },
        { sentence: 'Comí tres manzanas dulces.', question: '¿Cuántas manzanas comí?', answer: 'tres', hint: [1] },
        { sentence: 'La rana es pequeña y verde.', question: '¿De qué color es la rana?', answer: 'verde', hint: [5] },
        { sentence: 'Ella tiene un sombrero amarillo.', question: '¿De qué color es el sombrero?', answer: 'amarillo', hint: [4] },
        { sentence: 'El conejito pequeño es blanco.', question: '¿De qué color es el conejito?', answer: 'blanco', hint: [4] }
      ]
    },
    {
      title: 'Quién y Dónde',
      emoji: '🗺️',
      items: [
        { sentence: 'Tom juega fútbol en el parque.', question: '¿Dónde juega Tom?', answer: 'parque', hint: [5] },
        { sentence: 'Ana desayuna por la mañana.', question: '¿Cuándo desayuna Ana?', answer: 'mañana', hint: [4] },
        { sentence: 'El abuelo lee libros en su sillón.', question: '¿Quién lee libros?', answer: 'abuelo', hint: [1] },
        { sentence: 'Los niños nadan en la playa.', question: '¿Dónde nadan los niños?', answer: 'playa', hint: [5] },
        { sentence: 'Mia alimenta a su gato cada día.', question: '¿Quién alimenta al gato?', answer: 'Mia', hint: [0] },
        { sentence: 'Papá cocina la cena en la cocina.', question: '¿Dónde cocina papá?', answer: 'cocina', hint: [6] },
        { sentence: 'El búho duerme durante el día.', question: '¿Cuándo duerme el búho?', answer: 'día', hint: [5] },
        { sentence: 'Leo va en bici a la escuela.', question: '¿A dónde va Leo?', answer: 'escuela', hint: [6] }
      ]
    },
    {
      title: 'Frases Grandes',
      emoji: '🚀',
      items: [
        { sentence: 'Ben tiene una cometa, y es naranja brillante.', question: '¿De qué color es la cometa?', answer: 'naranja brillante', hint: [6, 7] },
        { sentence: 'El cachorro tenía hambre, y comió su comida.', question: '¿Qué comió el cachorro?', answer: 'comida', hint: [7] },
        { sentence: 'Lily salió afuera y vio una mariposa rosa.', question: '¿Qué vio Lily?', answer: 'mariposa rosa', hint: [6, 7] },
        { sentence: 'Estaba lloviendo, y jugamos un juego de mesa.', question: '¿A qué jugamos?', answer: 'juego de mesa', hint: [5, 6, 7] },
        { sentence: 'Sam tenía sueño, y abrazó su osito de peluche.', question: '¿Qué abrazó Sam?', answer: 'osito de peluche', hint: [6, 7, 8] },
        { sentence: 'Mamá hizo un pastel con sabor a chocolate dulce.', question: '¿A qué sabía el pastel?', answer: 'chocolate dulce', hint: [7, 8] },
        { sentence: 'Fuimos al zoológico y vimos un león bebé.', question: '¿Qué vimos?', answer: 'león bebé', hint: [6, 7] },
        { sentence: 'Emma perdió un diente, y recibió una moneda brillante.', question: '¿Qué recibió Emma?', answer: 'moneda brillante', hint: [7, 8] }
      ]
    },
    {
      title: 'Pequeñas Historias',
      emoji: '📚',
      items: [
        { sentence: 'Max tiene una tortuga pequeña. Come hojas verdes.', question: '¿Qué come la tortuga?', answer: 'hojas verdes', hint: [6, 7] },
        { sentence: 'Hicimos un muñeco de nieve. Su nariz es una zanahoria.', question: '¿Qué es su nariz?', answer: 'zanahoria', hint: [9] },
        { sentence: 'Nina encontró una concha en la playa. La guardó en su bolsillo.', question: '¿Dónde guardó la concha?', answer: 'bolsillo', hint: [11] },
        { sentence: 'El panadero hace pan fresco. Todo el pueblo lo adora.', question: '¿Qué hace el panadero?', answer: 'pan fresco', hint: [3, 4] },
        { sentence: 'Leo plantó una semilla pequeña. Creció hasta ser un girasol alto.', question: '¿En qué se convirtió la semilla?', answer: 'girasol', hint: [9] },
        { sentence: 'Nuestra gata duerme en una caja. Cree que es un castillo.', question: '¿Dónde duerme la gata?', answer: 'caja', hint: [5] },
        { sentence: 'Tom horneó galletas con la abuela. La cocina olía a vainilla.', question: '¿A qué olía la cocina?', answer: 'vainilla', hint: [10] },
        { sentence: 'El pirata encontró un cofre del tesoro. Estaba lleno de oro.', question: '¿Qué había en el cofre?', answer: 'oro', hint: [10] }
      ]
    }
  ]
};
