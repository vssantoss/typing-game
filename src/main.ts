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
import { mountRadio } from './ui/radio';

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

// When an updated service worker takes over, reload once so new versions show
// up on the first visit instead of the second. The guard skips the very first
// install (the page is already the newest version) and prevents reload loops.
if ('serviceWorker' in navigator) {
  let hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController) {
      hadController = true;
      return;
    }
    window.location.reload();
  });
  // Long-lived tabs (the game tends to stay open) re-check for updates hourly.
  navigator.serviceWorker.ready.then((reg) => {
    window.setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
  });
}

// Size the app to the visible area, not the window: when the mobile keyboard
// opens it covers the bottom of the layout viewport, and without this the
// mascot hides behind the keyboard and the stage centers on covered space.
const vv = window.visualViewport;
if (vv) {
  const syncViewport = () => {
    document.documentElement.style.setProperty('--app-height', `${Math.round(vv.height)}px`);
    // Some browsers scroll the page to "reveal" the focused input when the
    // keyboard opens; with the app sized to the visual viewport that scroll
    // only misaligns everything, so pin the page back.
    if (window.scrollY !== 0) window.scrollTo(0, 0);
  };
  vv.addEventListener('resize', syncViewport);
  vv.addEventListener('scroll', syncViewport);
  syncViewport();
}

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
mountRadio();
// The AudioContext can only start from a user gesture — the same gesture also
// kicks off the radio tune (startMusic is a no-op while it's already playing).
// iOS Safari only counts touchend/click/keydown as activation for audio, not
// pointerdown, so listen to all of them; unlock is idempotent.
const unlockAudio = () => {
  sounds.unlock();
  if (settings.music) sounds.startMusic();
};
(['pointerdown', 'touchend', 'click', 'keydown'] as const).forEach((evt) =>
  window.addEventListener(evt, unlockAudio)
);

// The 'playback' audio session keeps Web Audio alive when the game goes to
// the background (like a music app would) — stop the tune when another app
// takes over and bring it back when the game returns.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    sounds.stopMusic();
  } else if (settings.music) {
    sounds.startMusic();
  }
});

ctx.navigate('home');
