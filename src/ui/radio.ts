import { sounds } from '../audio/sounds';
import { saveSettings, settings, type LanguageId } from '../state/settings';

const LABELS: Record<LanguageId, string> = {
  en: 'Music',
  'pt-br': 'Música',
  es: 'Música'
};

/**
 * The little radio in the bottom-left corner. It dances (and leaks music
 * notes) while the background tune plays; tapping it toggles the music.
 * Mounted once on <body> so it survives screen changes.
 */
export function mountRadio(): void {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'radio-toggle';
  btn.innerHTML = '<span class="radio-emoji">📻</span>';

  const sync = () => {
    btn.classList.toggle('playing', settings.music);
    btn.setAttribute('aria-pressed', String(settings.music));
    btn.setAttribute('aria-label', LABELS[settings.language]);
  };

  btn.addEventListener('click', () => {
    sounds.unlock();
    const on = !settings.music;
    saveSettings({ music: on });
    if (on) {
      sounds.startMusic();
    } else {
      sounds.stopMusic();
    }
    sync();
  });

  sync();
  document.body.appendChild(btn);
}
