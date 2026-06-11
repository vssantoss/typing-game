export interface SentenceItem {
  sentence: string;
  question: string;
  answer: string;
  /** Indexes of the words in `sentence` (split by spaces) that dance as a hint. */
  hint: number[];
}

export interface Level {
  title: string;
  emoji: string;
  items: SentenceItem[];
}

export interface UiStrings {
  appName: string;
  tagline: string;
  play: string;
  settings: string;
  back: string;
  next: string;
  typeIt: string;
  nowAnswer: string;
  hint: string;
  stars: string;
  levelComplete: string;
  tapTheToys: string;
  letsPlay: string;
  praise: string[];
  settingsTitle: string;
  language: string;
  volume: string;
  errorSound: string;
  errorSoundHelp: string;
  visualCue: string;
  visualCueHelp: string;
  accentLenient: string;
  accentLenientHelp: string;
  autoPunctuation: string;
  autoPunctuationHelp: string;
  hintAfterMistakes: string;
  hintAfterMistakesHelp: string;
  calmMode: string;
  calmModeHelp: string;
  on: string;
  off: string;
  openLevels: string;
  openLevelsHelp: string;
  openLevelsDone: string;
  resetLevels: string;
  resetLevelsHelp: string;
  resetConfirm: string;
  resetDone: string;
  parentGateTitle: string;
  /** Math challenge template; {a} and {b} are replaced with numbers. */
  parentGateAsk: string;
  parentGateGo: string;
}

export interface ContentPack {
  ui: UiStrings;
  levels: Level[];
}
