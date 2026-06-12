import type { ContentPack } from './types';

export const en: ContentPack = {
  ui: {
    appName: 'Type & Play',
    tagline: 'Type it. Answer it. Play the sounds!',
    play: 'Play',
    settings: 'Parents Area',
    back: 'Back',
    next: 'Next',
    typeIt: 'Type the sentence!',
    nowAnswer: 'Now answer!',
    hint: 'Hint',
    stars: 'stars',
    levelComplete: 'Level complete!',
    tapTheToys: 'Tap the toys!',
    letsPlay: "Let's play!",
    praise: ['Amazing!', 'You did it!', 'Wonderful!', 'Super!', 'Fantastic!', 'Great job!', 'Brilliant!', 'Congratulations!'],
    settingsTitle: 'Parents Area',
    language: 'Language',
    volume: 'Sound volume',
    errorSound: 'Sound on wrong key',
    errorSoundHelp: 'Plays a quiet, boring thud when a wrong key is pressed. Off keeps wrong keys completely silent.',
    visualCue: 'Show next letter glow',
    visualCueHelp: 'The next letter to type softly glows after a wrong key, to help find it.',
    accentLenient: 'Easy accents',
    accentLenientHelp: 'Letters like é, ã and ç can be typed without the accent (e, a, c).',
    autoPunctuation: 'Auto punctuation',
    autoPunctuationHelp: 'Dots, commas and question marks type themselves — no need to find them.',
    hintAfterMistakes: 'Hint button only after mistakes',
    hintAfterMistakesHelp: 'Hides the hint button until a few wrong keys are pressed. Off shows it right away.',
    calmMode: 'Calm animations',
    calmModeHelp: 'Slower, gentler animations with less movement.',
    on: 'On',
    off: 'Off',
    openLevels: 'Open all levels',
    openLevelsHelp: 'Unlocks every level right away, no stars needed. "Reset levels" locks them again.',
    openLevelsDone: 'All levels open!',
    resetLevels: 'Reset levels',
    resetLevelsHelp: 'Removes all stars and locks the levels again, in every language. Settings are kept.',
    resetConfirm: 'Tap again to confirm',
    resetDone: 'Levels reset!',
    parentGateTitle: 'For grown-ups only!',
    parentGateAsk: 'What is {a} × {b}?',
    parentGateGo: 'Enter'
  },
  levels: [
    {
      title: 'First Words',
      emoji: '🐣',
      items: [
        { sentence: 'I see a cat.', question: 'What do I see?', answer: 'cat', hint: [3] },
        { sentence: 'The dog runs.', question: 'Who runs?', answer: 'dog', hint: [1] },
        { sentence: 'I like pizza.', question: 'What do I like?', answer: 'pizza', hint: [2] },
        { sentence: 'The sun is hot.', question: 'What is hot?', answer: 'sun', hint: [1] },
        { sentence: 'We play ball.', question: 'What do we play?', answer: 'ball', hint: [2] },
        { sentence: 'The bird can fly.', question: 'What can the bird do?', answer: 'fly', hint: [3] },
        { sentence: 'I love mom.', question: 'Who do I love?', answer: 'mom', hint: [2] },
        { sentence: 'The fish can swim.', question: 'What can the fish do?', answer: 'swim', hint: [3] }
      ]
    },
    {
      title: 'Colors & Numbers',
      emoji: '🌈',
      items: [
        { sentence: 'I saw a red ball.', question: 'What color is the ball?', answer: 'red', hint: [3] },
        { sentence: 'The cat has two kittens.', question: 'How many kittens?', answer: 'two', hint: [3] },
        { sentence: 'My new bike is blue.', question: 'What color is the bike?', answer: 'blue', hint: [4] },
        { sentence: 'The big dog is happy.', question: 'How does the dog feel?', answer: 'happy', hint: [4] },
        { sentence: 'I ate three sweet apples.', question: 'How many apples did I eat?', answer: 'three', hint: [2] },
        { sentence: 'The frog is small and green.', question: 'What color is the frog?', answer: 'green', hint: [5] },
        { sentence: 'She has a yellow hat.', question: 'What color is the hat?', answer: 'yellow', hint: [3] },
        { sentence: 'The little bunny is white.', question: 'What color is the bunny?', answer: 'white', hint: [4] }
      ]
    },
    {
      title: 'Who & Where',
      emoji: '🗺️',
      items: [
        { sentence: 'Tom plays soccer in the park.', question: 'Where does Tom play soccer?', answer: 'park', hint: [5] },
        { sentence: 'Anna eats breakfast in the morning.', question: 'When does Anna eat breakfast?', answer: 'morning', hint: [5] },
        { sentence: 'Grandpa reads books in his chair.', question: 'Who reads books?', answer: 'grandpa', hint: [0] },
        { sentence: 'The kids swim at the beach.', question: 'Where do the kids swim?', answer: 'beach', hint: [5] },
        { sentence: 'Mia feeds her cat every day.', question: 'Who feeds the cat?', answer: 'Mia', hint: [0] },
        { sentence: 'Dad cooks dinner in the kitchen.', question: 'Where does Dad cook?', answer: 'kitchen', hint: [5] },
        { sentence: 'The owl sleeps during the day.', question: 'When does the owl sleep?', answer: 'day', hint: [5] },
        { sentence: 'Leo rides his bike to school.', question: 'Where does Leo ride his bike?', answer: 'school', hint: [5] }
      ]
    },
    {
      title: 'Big Sentences',
      emoji: '🚀',
      items: [
        { sentence: 'Ben has a kite, and it is bright orange.', question: 'What color is the kite?', answer: 'bright orange', hint: [7, 8] },
        { sentence: 'The puppy was hungry, so it ate dog food.', question: 'What did the puppy eat?', answer: 'dog food', hint: [7, 8] },
        { sentence: 'Lily went outside, and she saw a pink butterfly.', question: 'What did Lily see?', answer: 'pink butterfly', hint: [7, 8] },
        { sentence: 'It was raining, so we played a board game.', question: 'What did we play?', answer: 'board game', hint: [7, 8] },
        { sentence: 'Sam was sleepy, so he hugged his teddy bear.', question: 'What did Sam hug?', answer: 'teddy bear', hint: [7, 8] },
        { sentence: 'Mom made a cake, and it tasted like sweet chocolate.', question: 'What did the cake taste like?', answer: 'sweet chocolate', hint: [8, 9] },
        { sentence: 'We went to the zoo and saw a baby lion.', question: 'What did we see?', answer: 'baby lion', hint: [8, 9] },
        { sentence: 'Emma lost her tooth, so she got a shiny coin.', question: 'What did Emma get?', answer: 'shiny coin', hint: [8, 9] }
      ]
    },
    {
      title: 'Little Stories',
      emoji: '📚',
      items: [
        { sentence: 'Max has a little turtle. It eats green leaves.', question: 'What does the turtle eat?', answer: 'green leaves', hint: [7, 8] },
        { sentence: 'We made a snowman. He has a carrot nose.', question: 'What is his nose made of?', answer: 'carrot', hint: [7] },
        { sentence: 'Nina found a seashell. She put it in her pocket.', question: 'Where did she put the seashell?', answer: 'pocket', hint: [9] },
        { sentence: 'The baker makes fresh bread. The whole town loves it.', question: 'What does the baker make?', answer: 'fresh bread', hint: [3, 4] },
        { sentence: 'Leo planted a tiny seed. It grew into a tall sunflower.', question: 'What did the seed grow into?', answer: 'sunflower', hint: [10] },
        { sentence: 'Our cat sleeps in a box. She thinks it is a castle.', question: 'Where does the cat sleep?', answer: 'box', hint: [5] },
        { sentence: 'Tom baked cookies with grandma. The kitchen smelled like vanilla.', question: 'What did the kitchen smell like?', answer: 'vanilla', hint: [9] },
        { sentence: 'The pirate found a treasure chest. It was full of gold.', question: 'What was in the chest?', answer: 'gold', hint: [10] }
      ]
    }
  ]
};
