import { describe, expect, it } from 'vitest';
import { TypingEngine, normalizeChar, isPunctuation } from './typing-engine';

const lenient = { accentLenient: true, autoPunctuation: true };
const strict = { accentLenient: false, autoPunctuation: false };

function typeAll(engine: TypingEngine, text: string) {
  const events = [];
  for (const c of text) events.push(...engine.input(c));
  return events;
}

describe('normalizeChar', () => {
  it('is case-insensitive', () => {
    expect(normalizeChar('A', false)).toBe('a');
  });
  it('strips accents when lenient', () => {
    expect(normalizeChar('é', true)).toBe('e');
    expect(normalizeChar('ç', true)).toBe('c');
    expect(normalizeChar('ã', true)).toBe('a');
  });
  it('keeps accents when strict', () => {
    expect(normalizeChar('é', false)).toBe('é');
  });
});

describe('isPunctuation', () => {
  it('detects punctuation but not letters, digits or spaces', () => {
    expect(isPunctuation('.')).toBe(true);
    expect(isPunctuation(',')).toBe(true);
    expect(isPunctuation('?')).toBe(true);
    expect(isPunctuation('a')).toBe(false);
    expect(isPunctuation('é')).toBe(false);
    expect(isPunctuation('3')).toBe(false);
    expect(isPunctuation(' ')).toBe(false);
  });
});

describe('TypingEngine', () => {
  it('advances on correct letters and ignores wrong ones', () => {
    const e = new TypingEngine('cat', lenient);
    expect(e.input('x')).toEqual([{ type: 'ignored', expected: 'c' }]);
    expect(e.cursor).toBe(0);
    e.input('c');
    expect(e.cursor).toBe(1);
    e.input('A'); // case-insensitive
    expect(e.cursor).toBe(2);
  });

  it('fires word and complete events', () => {
    const e = new TypingEngine('we go', lenient);
    const events = typeAll(e, 'we go');
    const types = events.map((ev) => ev.type);
    expect(types).toEqual(['correct', 'correct', 'word', 'correct', 'correct', 'correct', 'word', 'complete']);
    expect(e.done).toBe(true);
  });

  it('auto-completes trailing punctuation', () => {
    const e = new TypingEngine('I see a cat.', lenient);
    const events = typeAll(e, 'I see a cat');
    expect(e.done).toBe(true);
    const auto = events.filter((ev) => ev.type === 'correct' && ev.auto);
    expect(auto).toHaveLength(1);
    expect(events.at(-1)?.type).toBe('complete');
  });

  it('auto-completes mid-sentence commas exactly once per word', () => {
    const e = new TypingEngine('a kite, and', lenient);
    typeAll(e, 'a kite');
    expect(e.expected).toBe(' '); // comma typed itself
    const wordEvents = typeAll(e, ' and').filter((ev) => ev.type === 'word');
    expect(wordEvents).toHaveLength(1);
    expect(e.done).toBe(true);
  });

  it('requires punctuation to be typed when autoPunctuation is off', () => {
    const e = new TypingEngine('cat.', strict);
    typeAll(e, 'cat');
    expect(e.done).toBe(false);
    expect(e.expected).toBe('.');
    const events = e.input('.');
    expect(events.map((ev) => ev.type)).toEqual(['correct', 'word', 'complete']);
  });

  it('accepts unaccented typing for accented targets when lenient', () => {
    const e = new TypingEngine('maçã', lenient);
    typeAll(e, 'maca');
    expect(e.done).toBe(true);
  });

  it('rejects unaccented typing when strict', () => {
    const e = new TypingEngine('maçã', { accentLenient: false, autoPunctuation: true });
    typeAll(e, 'mac');
    expect(e.cursor).toBe(2); // 'c' did not match 'ç'
    e.input('ç');
    expect(e.cursor).toBe(3);
  });

  it('handles multi-character input strings', () => {
    const e = new TypingEngine('red ball', lenient);
    const events = e.input('red ball');
    expect(e.done).toBe(true);
    expect(events.filter((ev) => ev.type === 'word')).toHaveLength(2);
  });

  it('fires word once even when the word ends in punctuation at the end', () => {
    const e = new TypingEngine('park.', lenient);
    const events = typeAll(e, 'park');
    expect(events.filter((ev) => ev.type === 'word')).toHaveLength(1);
  });

  it('ignores input after completion', () => {
    const e = new TypingEngine('hi', lenient);
    typeAll(e, 'hi');
    expect(e.input('x')).toEqual([]);
  });

  it('auto-completes leading punctuation via autoComplete()', () => {
    const e = new TypingEngine('"Hi!"', { accentLenient: true, autoPunctuation: true });
    e.autoComplete();
    expect(e.expected).toBe('H');
    typeAll(e, 'Hi');
    expect(e.done).toBe(true);
  });
});
