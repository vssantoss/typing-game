export type LanguageId = 'en' | 'pt-br' | 'es';

export interface Settings {
  language: LanguageId;
  /** 0..1 master volume. */
  volume: number;
  /** Play a quiet thud on wrong keys. OFF by default — wrong keys stay silent. */
  errorSound: boolean;
  /** Glow the next expected letter after a wrong key. */
  visualCue: boolean;
  /** e matches é, c matches ç. */
  accentLenient: boolean;
  /** Punctuation types itself. */
  autoPunctuation: boolean;
  /** Hide the hint button until a few wrong keys are pressed. */
  hintAfterMistakes: boolean;
  /** Slower, gentler animations. */
  calmMode: boolean;
  /** Happy background music (the radio in the corner). */
  music: boolean;
}

const KEY = 'vskids.settings.v1';

/** First-run default: follow the OS/browser language when we support it. */
function detectLanguage(): LanguageId {
  if (typeof navigator === 'undefined') return 'en';
  const tags = navigator.languages?.length ? navigator.languages : [navigator.language ?? 'en'];
  for (const tag of tags) {
    const lower = tag.toLowerCase();
    if (lower.startsWith('pt')) return 'pt-br';
    if (lower.startsWith('es')) return 'es';
    if (lower.startsWith('en')) return 'en';
  }
  return 'en';
}

const defaults: Settings = {
  language: detectLanguage(),
  volume: 0.8,
  errorSound: false,
  visualCue: false,
  accentLenient: true,
  autoPunctuation: true,
  hintAfterMistakes: false,
  calmMode: false,
  music: true
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {
    // corrupted storage — fall back to defaults
  }
  return { ...defaults };
}

export const settings: Settings = load();

export function saveSettings(patch: Partial<Settings>): void {
  Object.assign(settings, patch);
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // storage unavailable (private mode) — keep in-memory settings
  }
}
