import type { ContentPack } from './types';

export const ptBr: ContentPack = {
  ui: {
    appName: 'Type & Play',
    tagline: 'Digite. Responda. Brinque com os sons!',
    play: 'Jogar',
    settings: 'Área dos Pais',
    back: 'Voltar',
    next: 'Próxima',
    typeIt: 'Digite a frase!',
    nowAnswer: 'Agora responda!',
    objectsTitle: 'O Que É?',
    objectsPrompt: 'O que é isso? Digite!',
    hint: 'Dica',
    stars: 'estrelas',
    levelComplete: 'Fase completa!',
    tapTheToys: 'Toque nos brinquedos!',
    letsPlay: 'Vamos jogar!',
    praise: ['Incrível!', 'Você conseguiu!', 'Maravilha!', 'Super!', 'Fantástico!', 'Muito bem!', 'Genial!', 'Parabéns!'],
    settingsTitle: 'Área dos Pais',
    language: 'Idioma',
    volume: 'Volume do som',
    errorSound: 'Som na tecla errada',
    errorSoundHelp: 'Toca um som baixinho e sem graça quando aperta a tecla errada. Desligado, a tecla errada fica em silêncio total.',
    visualCue: 'Brilho na próxima letra',
    visualCueHelp: 'A próxima letra brilha de leve depois de uma tecla errada, para ajudar a encontrar.',
    accentLenient: 'Acentos fáceis',
    accentLenientHelp: 'Letras como é, ã e ç podem ser digitadas sem o acento (e, a, c).',
    autoPunctuation: 'Pontuação automática',
    autoPunctuationHelp: 'Pontos, vírgulas e interrogações se digitam sozinhos — não precisa procurar.',
    hintAfterMistakes: 'Dica só depois de errar',
    hintAfterMistakesHelp: 'Esconde o botão de dica até errar algumas teclas. Desligado, o botão aparece desde o início.',
    calmMode: 'Animações calmas',
    calmModeHelp: 'Animações mais lentas e suaves, com menos movimento.',
    on: 'Ligado',
    off: 'Desligado',
    openLevels: 'Abrir todas as fases',
    openLevelsHelp: 'Desbloqueia todas as fases agora, sem precisar de estrelas. "Reiniciar fases" bloqueia de novo.',
    openLevelsDone: 'Fases abertas!',
    resetLevels: 'Reiniciar fases',
    resetLevelsHelp: 'Remove todas as estrelas e bloqueia as fases de novo, em todos os idiomas. Os ajustes são mantidos.',
    resetConfirm: 'Toque de novo para confirmar',
    resetDone: 'Fases reiniciadas!',
    parentGateTitle: 'Só para adultos!',
    parentGateAsk: 'Quanto é {a} × {b}?',
    parentGateGo: 'Entrar'
  },
  levels: [
    {
      title: 'Primeiras Palavras',
      emoji: '🐣',
      items: [
        { sentence: 'Eu vejo um gato.', question: 'O que eu vejo?', answer: 'gato', hint: [3] },
        { sentence: 'O cachorro corre.', question: 'Quem corre?', answer: 'cachorro', hint: [1] },
        { sentence: 'Eu gosto de pizza.', question: 'Do que eu gosto?', answer: 'pizza', hint: [3] },
        { sentence: 'O sol é quente.', question: 'O que é quente?', answer: 'sol', hint: [1] },
        { sentence: 'Nós jogamos bola.', question: 'O que nós jogamos?', answer: 'bola', hint: [2] },
        { sentence: 'O pássaro pode voar.', question: 'O que o pássaro pode fazer?', answer: 'voar', hint: [3] },
        { sentence: 'Eu amo a mamãe.', question: 'Quem eu amo?', answer: 'mamãe', hint: [3] },
        { sentence: 'O peixe sabe nadar.', question: 'O que o peixe sabe fazer?', answer: 'nadar', hint: [3] }
      ]
    },
    {
      title: 'Cores e Números',
      emoji: '🌈',
      items: [
        { sentence: 'Eu vi uma bola vermelha.', question: 'Qual é a cor da bola?', answer: 'vermelha', hint: [4] },
        { sentence: 'A gata tem dois filhotes.', question: 'Quantos filhotes a gata tem?', answer: 'dois', hint: [3] },
        { sentence: 'Minha bicicleta nova é azul.', question: 'Qual é a cor da bicicleta?', answer: 'azul', hint: [4] },
        { sentence: 'O cachorro grande está feliz.', question: 'Como o cachorro está?', answer: 'feliz', hint: [4] },
        { sentence: 'Eu comi três maçãs doces.', question: 'Quantas maçãs eu comi?', answer: 'três', hint: [2] },
        { sentence: 'O sapo é pequeno e verde.', question: 'Qual é a cor do sapo?', answer: 'verde', hint: [5] },
        { sentence: 'Ela tem um chapéu amarelo.', question: 'Qual é a cor do chapéu?', answer: 'amarelo', hint: [4] },
        { sentence: 'O coelhinho pequeno é branco.', question: 'Qual é a cor do coelhinho?', answer: 'branco', hint: [4] }
      ]
    },
    {
      title: 'Quem e Onde',
      emoji: '🗺️',
      items: [
        { sentence: 'Tom joga futebol no parque.', question: 'Onde Tom joga futebol?', answer: 'parque', hint: [4] },
        { sentence: 'Ana toma café da manhã cedo.', question: 'Quando Ana toma café?', answer: 'cedo', hint: [5] },
        { sentence: 'Vovô lê livros na poltrona.', question: 'Quem lê livros?', answer: 'vovô', hint: [0] },
        { sentence: 'As crianças nadam na praia.', question: 'Onde as crianças nadam?', answer: 'praia', hint: [4] },
        { sentence: 'Mia alimenta seu gato todo dia.', question: 'Quem alimenta o gato?', answer: 'Mia', hint: [0] },
        { sentence: 'Papai faz o jantar na cozinha.', question: 'Onde papai faz o jantar?', answer: 'cozinha', hint: [5] },
        { sentence: 'A coruja dorme durante o dia.', question: 'Quando a coruja dorme?', answer: 'dia', hint: [5] },
        { sentence: 'Leo vai de bicicleta para a escola.', question: 'Para onde Leo vai?', answer: 'escola', hint: [6] }
      ]
    },
    {
      title: 'Frases Grandes',
      emoji: '🚀',
      items: [
        { sentence: 'Ben tem uma pipa, e ela é laranja brilhante.', question: 'Qual é a cor da pipa?', answer: 'laranja brilhante', hint: [7, 8] },
        { sentence: 'O filhote estava com fome, então comeu ração.', question: 'O que o filhote comeu?', answer: 'ração', hint: [7] },
        { sentence: 'Lily saiu de casa e viu uma borboleta rosa.', question: 'O que Lily viu?', answer: 'borboleta rosa', hint: [7, 8] },
        { sentence: 'Estava chovendo, então jogamos um jogo de tabuleiro.', question: 'O que nós jogamos?', answer: 'jogo de tabuleiro', hint: [5, 6, 7] },
        { sentence: 'Sam estava com sono, então abraçou seu urso de pelúcia.', question: 'O que Sam abraçou?', answer: 'urso de pelúcia', hint: [7, 8, 9] },
        { sentence: 'Mamãe fez um bolo com gosto de chocolate doce.', question: 'Qual era o gosto do bolo?', answer: 'chocolate doce', hint: [7, 8] },
        { sentence: 'Nós fomos ao zoológico e vimos um leão bebê.', question: 'O que nós vimos?', answer: 'leão bebê', hint: [7, 8] },
        { sentence: 'Emma perdeu um dente, então ganhou uma moeda brilhante.', question: 'O que Emma ganhou?', answer: 'moeda brilhante', hint: [7, 8] }
      ]
    },
    {
      title: 'Pequenas Histórias',
      emoji: '📚',
      items: [
        { sentence: 'Max tem uma tartaruga pequena. Ela come folhas verdes.', question: 'O que a tartaruga come?', answer: 'folhas verdes', hint: [7, 8] },
        { sentence: 'Nós fizemos um boneco de neve. O nariz dele é uma cenoura.', question: 'O que é o nariz dele?', answer: 'cenoura', hint: [11] },
        { sentence: 'Nina achou uma concha na praia. Ela guardou no bolso.', question: 'Onde Nina guardou a concha?', answer: 'bolso', hint: [9] },
        { sentence: 'O padeiro faz pão fresquinho. A cidade toda adora.', question: 'O que o padeiro faz?', answer: 'pão fresquinho', hint: [3, 4] },
        { sentence: 'Leo plantou uma semente pequena. Ela virou um girassol alto.', question: 'O que a semente virou?', answer: 'girassol', hint: [8] },
        { sentence: 'Nossa gata dorme numa caixa. Ela acha que é um castelo.', question: 'Onde a gata dorme?', answer: 'caixa', hint: [4] },
        { sentence: 'Tom fez biscoitos com a vovó. A cozinha cheirava a baunilha.', question: 'Qual era o cheiro da cozinha?', answer: 'baunilha', hint: [10] },
        { sentence: 'O pirata achou um baú de tesouro. Estava cheio de ouro.', question: 'O que tinha no baú?', answer: 'ouro', hint: [10] }
      ]
    }
  ],
  objects: [
    { emoji: '⚽', name: 'bola' },
    { emoji: '☂️', name: 'guarda-chuva' },
    { emoji: '🍬', name: 'bala' },
    { emoji: '🍎', name: 'maçã' },
    { emoji: '🚗', name: 'carro' },
    { emoji: '🏠', name: 'casa' },
    { emoji: '☀️', name: 'sol' },
    { emoji: '🌙', name: 'lua' },
    { emoji: '⭐', name: 'estrela' },
    { emoji: '🐶', name: 'cachorro' },
    { emoji: '🐱', name: 'gato' },
    { emoji: '🐟', name: 'peixe' },
    { emoji: '🦆', name: 'pato' },
    { emoji: '📖', name: 'livro' },
    { emoji: '🌸', name: 'flor' },
    { emoji: '🌳', name: 'árvore' },
    { emoji: '🎂', name: 'bolo' },
    { emoji: '🍌', name: 'banana' },
    { emoji: '🚲', name: 'bicicleta' },
    { emoji: '🔑', name: 'chave' },
    { emoji: '🧀', name: 'queijo' },
    { emoji: '🥛', name: 'leite' },
    { emoji: '🦋', name: 'borboleta' },
    { emoji: '🚀', name: 'foguete' }
  ]
};
