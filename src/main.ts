import '@fontsource-variable/baloo-2';
import '@fontsource-variable/nunito';
import './styles/main.css';
import './styles/game.css';

import { en } from './content/en';
import { es } from './content/es';
import { ptBr } from './content/pt-br';
import { settings } from './state/settings';
import { sounds } from './audio/sounds';
import type { AppContext, ScreenName } from './ui/context';
import { renderHomeScreen } from './ui/home-screen';
import { renderGameScreen } from './ui/game-screen';
import { renderSettingsScreen } from './ui/settings-screen';

const root = document.getElementById('app')!;

const ctx: AppContext = {
  root,
  pack: () => ({ en, 'pt-br': ptBr, es })[settings.language],
  navigate(screen: ScreenName, params?: { level?: number }) {
    switch (screen) {
      case 'home':
        renderHomeScreen(ctx);
        break;
      case 'game':
        renderGameScreen(ctx, params?.level ?? 0);
        break;
      case 'settings':
        renderSettingsScreen(ctx);
        break;
    }
  }
};

// One background theme per visit, picked at random (classes in main.css).
const THEMES = [
  'theme-golden',
  'theme-mint',
  'theme-sky',
  'theme-lavender',
  'theme-strawberry',
  'theme-peach',
  'theme-periwinkle',
  'theme-lemon'
];
document.body.classList.add(THEMES[Math.floor(Math.random() * THEMES.length)]);

document.body.classList.toggle('calm', settings.calmMode);
sounds.setVolume(settings.volume);
// The AudioContext can only start from a user gesture.
window.addEventListener('pointerdown', () => sounds.unlock(), { once: false });

ctx.navigate('home');
