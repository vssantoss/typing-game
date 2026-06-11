import type { LanguageId } from './settings';

/** Per-language, per-level count of items completed (0..items.length). */
interface ProgressData {
  en: number[];
  'pt-br': number[];
  es: number[];
  /** Parents Area switch: every level playable regardless of stars. */
  unlockAll: boolean;
}

const KEY = 'vskids.progress.v1';

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        en: parsed.en ?? [],
        'pt-br': parsed['pt-br'] ?? [],
        es: parsed.es ?? [],
        unlockAll: parsed.unlockAll ?? false
      };
    }
  } catch {
    // corrupted storage — start fresh
  }
  return { en: [], 'pt-br': [], es: [], unlockAll: false };
}

const data = load();

function save(): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // storage unavailable — progress lives only in memory this session
  }
}

export function starsFor(lang: LanguageId, level: number): number {
  return data[lang][level] ?? 0;
}

/** A level is open if it's the first one or the previous has at least one star. */
export function isUnlocked(lang: LanguageId, level: number): boolean {
  return data.unlockAll || level === 0 || starsFor(lang, level - 1) > 0;
}

export function isAllUnlocked(): boolean {
  return data.unlockAll;
}

export function unlockAllLevels(): void {
  data.unlockAll = true;
  save();
}

export function recordItemDone(lang: LanguageId, level: number, itemIndex: number): void {
  const current = data[lang][level] ?? 0;
  if (itemIndex + 1 > current) {
    data[lang][level] = itemIndex + 1;
    save();
  }
}

/** Wipes all stars in every language — levels lock again except the first. */
export function resetProgress(): void {
  data.en = [];
  data['pt-br'] = [];
  data.es = [];
  data.unlockAll = false;
  save();
}

/** Where to resume a level: the first item not yet completed (or 0 on replay). */
export function resumeIndex(lang: LanguageId, level: number, itemCount: number): number {
  const done = starsFor(lang, level);
  return done >= itemCount ? 0 : done;
}
