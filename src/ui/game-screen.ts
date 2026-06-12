import { sounds } from '../audio/sounds';
import type { SentenceItem } from '../content/types';
import { TypingEngine, type EngineEvent } from '../game/typing-engine';
import { recordItemDone, resumeIndex } from '../state/progress';
import { settings } from '../state/settings';
import { burstConfetti } from './celebration';
import type { AppContext } from './context';
import { createMascot } from './mascot';
import { showPlayground } from './reward-playground';

const TILE_COLORS = ['#ff6b6b', '#f4a261', '#ffd166', '#06d6a0', '#4cc9f0', '#9b5de5', '#f15bb5'];

export interface Board {
  el: HTMLElement;
  /** Tile element per character index of the target string. */
  tiles: HTMLElement[];
  /** Word wrapper per word index (target.split(' ')). */
  words: HTMLElement[];
}

export function buildBoard(target: string, kind: 'sentence' | 'answer'): Board {
  const el = document.createElement('div');
  el.className = `board ${kind}-board`;
  if (target.length > 34) el.classList.add('long');
  if (target.length > 52) el.classList.add('very-long');
  const tiles: HTMLElement[] = [];
  const words: HTMLElement[] = [];
  let word: HTMLElement | null = null;
  let colorIdx = 0;
  for (let i = 0; i < target.length; i++) {
    const char = target[i];
    if (char === ' ') {
      word = null;
      const space = document.createElement('span');
      space.className = 'tile space';
      tiles.push(space);
      el.appendChild(space);
      continue;
    }
    if (!word) {
      word = document.createElement('span');
      word.className = 'word';
      words.push(word);
      el.appendChild(word);
    }
    const tile = document.createElement('span');
    tile.className = 'tile';
    if (/[^\p{L}\p{N}]/u.test(char)) tile.classList.add('punct');
    tile.textContent = char;
    tile.style.setProperty('--tile-color', TILE_COLORS[colorIdx % TILE_COLORS.length]);
    colorIdx++;
    tiles.push(tile);
    word.appendChild(tile);
  }
  return { el, tiles, words };
}

export function setCaret(board: Board, index: number): void {
  board.tiles.forEach((t) => t.classList.remove('current'));
  board.tiles[index]?.classList.add('current');
}

export function renderGameScreen(ctx: AppContext, levelIndex: number): void {
  const pack = ctx.pack();
  const level = pack.levels[levelIndex];
  // Fresh random order every time the level opens, so it never starts with
  // the same sentence twice in a row. Progress counts items, not positions.
  const items = shuffled(level.items);
  let itemIndex = resumeIndex(settings.language, levelIndex, items.length);

  ctx.root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen game-screen';
  ctx.root.appendChild(screen);

  // -- header ---------------------------------------------------------------
  const header = document.createElement('header');
  header.className = 'game-header';
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'btn btn-round';
  backBtn.setAttribute('aria-label', pack.ui.back);
  backBtn.textContent = '←';
  backBtn.addEventListener('click', () => ctx.navigate('home'));
  const chip = document.createElement('div');
  chip.className = 'level-chip';
  chip.textContent = `${level.emoji} ${level.title}`;
  const dots = document.createElement('div');
  dots.className = 'item-dots';
  items.forEach(() => {
    const d = document.createElement('span');
    d.className = 'dot';
    dots.appendChild(d);
  });
  header.append(backBtn, chip, dots);
  screen.appendChild(header);

  // -- stage ----------------------------------------------------------------
  const stage = document.createElement('main');
  stage.className = 'stage';
  screen.appendChild(stage);

  // Hidden input keeps the on-screen keyboard up on phones/tablets and is the
  // single source of typed text (so dead keys and composition work).
  const input = document.createElement('input');
  input.className = 'hidden-input';
  input.type = 'text';
  input.autocapitalize = 'off';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('aria-hidden', 'true');
  screen.appendChild(input);
  // Never focus during the reward playground — focus would summon the mobile
  // keyboard, and every toy tap would make it flicker hide/show.
  const focusInput = () => {
    if (phase === 'reward') return;
    input.focus({ preventScroll: true });
  };
  screen.addEventListener('pointerdown', (ev) => {
    sounds.unlock();
    // Let real buttons and the mascot handle their own taps without stealing
    // focus mid-press; refocus right after.
    if ((ev.target as HTMLElement).closest('button, .mascot')) {
      window.setTimeout(focusInput, 50);
      return;
    }
    if (phase === 'reward') return;
    // iOS hides the keyboard when the tap's default handling blurs the hidden
    // input, then ignores the later out-of-gesture refocus — so block the
    // default here and handle focus entirely inside the gesture.
    ev.preventDefault();
    // iOS also won't reopen a dismissed keyboard for focus() on an input that
    // is already focused; cycling blur→focus within the gesture forces it.
    if (document.activeElement === input) input.blur();
    input.focus({ preventScroll: true });
  });
  input.addEventListener('blur', () => window.setTimeout(focusInput, 100));

  const mascot = createMascot();
  screen.appendChild(mascot.el);

  let engine: TypingEngine | null = null;
  let board: Board | null = null;
  let sentenceBoard: Board | null = null;
  let phase: 'sentence' | 'question' | 'reward' = 'sentence';
  let hintTimer = 0;
  let currentItem: SentenceItem;
  let hintBtn: HTMLButtonElement | null = null;
  let questionMistakes = 0;

  function refreshDots(): void {
    [...dots.children].forEach((d, i) => {
      d.classList.toggle('done', i < itemIndex);
      d.classList.toggle('active', i === itemIndex);
    });
  }

  function danceHint(): void {
    if (!sentenceBoard) return;
    for (const wi of currentItem.hint) {
      const w = sentenceBoard.words[wi];
      if (!w) continue;
      w.classList.remove('dance');
      void w.offsetWidth;
      w.classList.add('dance');
    }
  }

  function armHintTimer(): void {
    window.clearTimeout(hintTimer);
    if (phase !== 'question') return;
    hintTimer = window.setTimeout(() => {
      danceHint();
      armHintTimer();
    }, 8000);
  }

  function handleEvents(events: EngineEvent[]): void {
    if (!board || !engine) return;
    for (const ev of events) {
      if (ev.type === 'correct') {
        const tile = board.tiles[ev.index];
        tile.classList.add('typed');
        tile.classList.remove('cue');
        if (ev.char === ' ') {
          sounds.softClick();
        } else if (ev.auto) {
          sounds.softClick();
          tile.classList.add('auto');
        } else {
          sounds.click();
        }
      } else if (ev.type === 'word') {
        sounds.wordChime();
        const w = board.words[ev.wordIndex];
        if (w) {
          w.classList.remove('word-done');
          void w.offsetWidth;
          w.classList.add('word-done');
        }
      } else if (ev.type === 'complete') {
        onTargetComplete();
      } else if (ev.type === 'ignored') {
        if (settings.errorSound) sounds.thud();
        if (phase === 'question' && hintBtn?.classList.contains('hint-hidden')) {
          questionMistakes++;
          if (questionMistakes >= 3) hintBtn.classList.remove('hint-hidden');
        }
        if (settings.visualCue) {
          const tile = board.tiles[engine.cursor];
          if (tile) {
            tile.classList.remove('cue');
            void tile.offsetWidth;
            tile.classList.add('cue');
          }
        }
      }
    }
    // onTargetComplete may have cleared the engine mid-loop (reward phase)
    if (engine && board && !engine.done) setCaret(board, engine.cursor);
    if (phase === 'question') armHintTimer();
  }

  input.addEventListener('input', () => {
    const text = input.value;
    input.value = '';
    if (!text || !engine || phase === 'reward') return;
    handleEvents(engine.input(text));
  });

  function startEngine(target: string, b: Board): void {
    engine = new TypingEngine(target, {
      accentLenient: settings.accentLenient,
      autoPunctuation: settings.autoPunctuation
    });
    board = b;
    handleEvents(engine.autoComplete());
    if (!engine.done) setCaret(b, engine.cursor);
  }

  function showSentencePhase(): void {
    phase = 'sentence';
    refreshDots();
    stage.innerHTML = '';

    const label = document.createElement('div');
    label.className = 'prompt-label pop-in';
    label.textContent = pack.ui.typeIt;
    stage.appendChild(label);

    sentenceBoard = buildBoard(currentItem.sentence, 'sentence');
    sentenceBoard.el.classList.add('pop-in');
    stage.appendChild(sentenceBoard.el);

    startEngine(currentItem.sentence, sentenceBoard);
    focusInput();
  }

  function showQuestionPhase(): void {
    phase = 'question';
    if (sentenceBoard) sentenceBoard.el.classList.add('compact');
    const oldLabel = stage.querySelector('.prompt-label');
    oldLabel?.remove();

    const bubble = document.createElement('div');
    bubble.className = 'question-bubble pop-in';
    bubble.innerHTML = `<span class="q-spark">✨</span> <span class="q-text"></span>`;
    bubble.querySelector('.q-text')!.textContent = currentItem.question;
    stage.appendChild(bubble);

    const answerBoard = buildBoard(currentItem.answer, 'answer');
    answerBoard.el.classList.add('pop-in');
    stage.appendChild(answerBoard.el);

    hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'btn hint-btn pop-in';
    if (settings.hintAfterMistakes) hintBtn.classList.add('hint-hidden');
    questionMistakes = 0;
    hintBtn.textContent = `💡 ${pack.ui.hint}`;
    hintBtn.addEventListener('click', () => {
      sounds.toy('sparkle');
      danceHint();
      armHintTimer();
    });
    stage.appendChild(hintBtn);

    startEngine(currentItem.answer, answerBoard);
    armHintTimer();
    focusInput();
  }

  function onTargetComplete(): void {
    window.clearTimeout(hintTimer);
    if (phase === 'sentence') {
      sounds.sentenceDone();
      mascot.celebrate();
      burstConfetti(stage, 14);
      window.setTimeout(showQuestionPhase, 700);
    } else if (phase === 'question') {
      phase = 'reward';
      engine = null;
      input.blur(); // dismiss the mobile keyboard for the playground
      sounds.fanfare();
      mascot.celebrate();
      recordItemDone(settings.language, levelIndex, itemIndex);
      const lastItem = itemIndex >= items.length - 1;
      window.setTimeout(() => {
        if (lastItem) sounds.victory();
        // the round is over — clear it so it doesn't ghost through the
        // party overlay or flash when the party fades out
        stage.innerHTML = '';
        board = null;
        sentenceBoard = null;
        hintBtn = null;
        showPlayground({
          container: screen,
          praise: lastItem ? pack.ui.levelComplete : pick(pack.ui.praise),
          phrases: pack.ui.praise,
          tapLabel: pack.ui.tapTheToys,
          nextLabel: pack.ui.next,
          big: lastItem,
          onDone: () => {
            if (lastItem) {
              ctx.navigate('home');
            } else {
              itemIndex++;
              startItem();
            }
          }
        });
      }, 800);
    }
  }

  function startItem(): void {
    currentItem = items[itemIndex];
    showSentencePhase();
  }

  startItem();
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Fisher–Yates shuffle into a new array; the content pack stays untouched. */
export function shuffled<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
