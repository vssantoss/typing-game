import type { ContentPack } from '../content/types';

export type ScreenName = 'home' | 'game' | 'settings';

export interface AppContext {
  root: HTMLElement;
  /** Content pack for the currently selected language. */
  pack: () => ContentPack;
  navigate: (screen: ScreenName, params?: { level?: number }) => void;
}
