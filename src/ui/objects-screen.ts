import { sounds } from '../audio/sounds';
import { TypingEngine, type EngineEvent } from '../game/typing-engine';
import { settings } from '../state/settings';
import { burstConfetti } from './celebration';
import type { AppContext } from './context';
import { buildBoard, pick, setCaret, shuffled, type Board } from './game-screen';
import { createMascot } from './mascot';
import { showPlayground } from './reward-playground';

/** Objects per play — same rhythm as a level. A fresh random set every time. */
const ROUND_SIZE = 8;

/**
 * "What is it?" game: a big emoji is shown and the kid types its name into
 * hidden-letter slots. If nothing happens for a while — or after a few wrong
 * keys — the next letter peeks out of its slot as a hint.
 */
export function renderObjectsScreen(ctx: AppContext): void {
  const pack = ctx.pack();
  const items = shuffled(pack.objects).slice(0, ROUND_SIZE);
  let itemIndex = 0;

  ctx.root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen game-screen objects-screen';
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
  chip.textContent = `🔍 ${pack.ui.objectsTitle}`;
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
  let phase: 'typing' | 'reward' = 'typing';
  let hintTimer = 0;
  let mistakes = 0;
  let hintBtn: HTMLButtonElement | null = null;

  function refreshDots(): void {
    [...dots.children].forEach((d, i) => {
      d.classList.toggle('done', i < itemIndex);
      d.classList.toggle('active', i === itemIndex);
    });
  }

  /** Hint: the next expected letter peeks out of its slot for a moment. */
  function peekHint(): void {
    if (!board || !engine || engine.done) return;
    const tile = board.tiles[engine.cursor];
    if (!tile) return;
    tile.classList.remove('peek');
    void tile.offsetWidth;
    tile.classList.add('peek');
  }

  /** Re-armed on every correct letter; fires when the kid is stuck. */
  function armHintTimer(): void {
    window.clearTimeout(hintTimer);
    if (phase !== 'typing') return;
    hintTimer = window.setTimeout(() => {
      peekHint();
      armHintTimer();
    }, 8000);
  }

  function handleEvents(events: EngineEvent[]): void {
    if (!board || !engine) return;
    for (const ev of events) {
      if (ev.type === 'correct') {
        mistakes = 0;
        const tile = board.tiles[ev.index];
        tile.classList.remove('peek');
        tile.classList.add('typed');
        tile.classList.remove('cue');
        if (ev.char === ' ' || ev.auto) {
          sounds.softClick();
          if (ev.auto) tile.classList.add('auto');
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
        onComplete();
      } else if (ev.type === 'ignored') {
        if (settings.errorSound) sounds.thud();
        mistakes++;
        if (mistakes >= 3) {
          mistakes = 0;
          hintBtn?.classList.remove('hint-hidden');
          peekHint();
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
    // onComplete may have cleared the engine mid-loop (reward phase)
    if (engine && board && !engine.done) setCaret(board, engine.cursor);
    armHintTimer();
  }

  input.addEventListener('input', () => {
    const text = input.value;
    input.value = '';
    if (!text || !engine || phase === 'reward') return;
    handleEvents(engine.input(text));
  });

  function onComplete(): void {
    window.clearTimeout(hintTimer);
    phase = 'reward';
    engine = null;
    input.blur(); // dismiss the mobile keyboard for the playground
    sounds.fanfare();
    mascot.celebrate();
    burstConfetti(stage, 14);
    const lastItem = itemIndex >= items.length - 1;
    window.setTimeout(() => {
      if (lastItem) sounds.victory();
      stage.innerHTML = '';
      board = null;
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

  function startItem(): void {
    const item = items[itemIndex];
    phase = 'typing';
    mistakes = 0;
    refreshDots();
    stage.innerHTML = '';

    const label = document.createElement('div');
    label.className = 'prompt-label pop-in';
    label.textContent = pack.ui.objectsPrompt;
    stage.appendChild(label);

    const display = document.createElement('div');
    display.className = 'object-display pop-in';
    display.textContent = item.emoji;
    stage.appendChild(display);

    board = buildBoard(item.name, 'answer');
    board.el.classList.add('pop-in');
    stage.appendChild(board.el);

    hintBtn = document.createElement('button');
    hintBtn.type = 'button';
    hintBtn.className = 'btn hint-btn pop-in';
    if (settings.hintAfterMistakes) hintBtn.classList.add('hint-hidden');
    hintBtn.textContent = `💡 ${pack.ui.hint}`;
    hintBtn.addEventListener('click', () => {
      sounds.toy('sparkle');
      peekHint();
      armHintTimer();
    });
    stage.appendChild(hintBtn);

    engine = new TypingEngine(item.name, {
      accentLenient: settings.accentLenient,
      autoPunctuation: settings.autoPunctuation
    });
    handleEvents(engine.autoComplete());
    if (engine && !engine.done) setCaret(board, engine.cursor);
    armHintTimer();
    focusInput();
  }

  startItem();
}
