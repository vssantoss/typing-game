export interface EngineOptions {
  /** Accept unaccented letters for accented targets (e matches é). */
  accentLenient: boolean;
  /** Punctuation characters complete themselves when reached. */
  autoPunctuation: boolean;
}

export type EngineEvent =
  /** A character was filled in. `auto` = punctuation that typed itself. */
  | { type: 'correct'; index: number; char: string; auto: boolean }
  /** A whole word was just finished (index into target.split(' ')). */
  | { type: 'word'; wordIndex: number }
  /** The whole target is done. */
  | { type: 'complete' }
  /** Input didn't match the expected character — silently ignored. */
  | { type: 'ignored'; expected: string };

const NON_TYPEABLE = /[^\p{L}\p{N} ]/u;

export function isPunctuation(char: string): boolean {
  return NON_TYPEABLE.test(char);
}

const COMBINING_MARKS = /[̀-ͯ]/g;

export function normalizeChar(char: string, accentLenient: boolean): string {
  let c = char.toLowerCase();
  if (accentLenient) {
    c = c.normalize('NFD').replace(COMBINING_MARKS, '');
  }
  return c;
}

export class TypingEngine {
  readonly target: string;
  private opts: EngineOptions;
  private cursorPos = 0;
  private wordsDone = 0;

  constructor(target: string, opts: EngineOptions) {
    this.target = target;
    this.opts = opts;
  }

  get cursor(): number {
    return this.cursorPos;
  }

  get done(): boolean {
    return this.cursorPos >= this.target.length;
  }

  /** The character the player must type next ('' when done). */
  get expected(): string {
    return this.target[this.cursorPos] ?? '';
  }

  /**
   * Feed typed text (one or more characters, e.g. from an input event).
   * Returns the events produced, in order.
   */
  input(text: string): EngineEvent[] {
    const events: EngineEvent[] = [];
    for (const char of text) {
      if (this.done) break;
      const expected = this.target[this.cursorPos];
      const matches =
        normalizeChar(char, this.opts.accentLenient) ===
        normalizeChar(expected, this.opts.accentLenient);
      if (!matches) {
        events.push({ type: 'ignored', expected });
        continue;
      }
      this.advance(events, false);
    }
    return events;
  }

  /**
   * Auto-complete any punctuation sitting at the cursor (also call once at
   * the start, in case the target opens with punctuation like “).
   */
  autoComplete(): EngineEvent[] {
    const events: EngineEvent[] = [];
    this.runAutoPunctuation(events);
    return events;
  }

  private advance(events: EngineEvent[], auto: boolean): void {
    events.push({ type: 'correct', index: this.cursorPos, char: this.target[this.cursorPos], auto });
    this.cursorPos++;
    this.checkBoundaries(events);
    this.runAutoPunctuation(events);
  }

  private runAutoPunctuation(events: EngineEvent[]): void {
    if (!this.opts.autoPunctuation) return;
    while (!this.done && isPunctuation(this.target[this.cursorPos])) {
      events.push({ type: 'correct', index: this.cursorPos, char: this.target[this.cursorPos], auto: true });
      this.cursorPos++;
      this.checkBoundaries(events);
    }
  }

  private checkBoundaries(events: EngineEvent[]): void {
    const atEnd = this.cursorPos >= this.target.length;
    const justFilled = this.target[this.cursorPos - 1];
    const atWordBreak = atEnd || this.target[this.cursorPos] === ' ';
    // A word ends only once we cross onto a space (or the end) coming from a
    // non-space character, so punctuation runs can't double-fire it.
    if (atWordBreak && justFilled !== ' ') {
      events.push({ type: 'word', wordIndex: this.wordsDone });
      this.wordsDone++;
    }
    if (atEnd) {
      events.push({ type: 'complete' });
    }
  }
}
