import { sounds } from '../audio/sounds';
import { isAllUnlocked, resetProgress, unlockAllLevels } from '../state/progress';
import { saveSettings, settings, type Settings } from '../state/settings';
import type { AppContext } from './context';

function toggleRow(
  label: string,
  help: string,
  onLabel: string,
  offLabel: string,
  key: keyof Pick<Settings, 'errorSound' | 'visualCue' | 'accentLenient' | 'autoPunctuation' | 'hintAfterMistakes' | 'calmMode'>,
  onFlip?: (value: boolean) => void
): HTMLElement {
  const row = document.createElement('div');
  row.className = 'setting-row';
  const text = document.createElement('div');
  text.className = 'setting-text';
  const l = document.createElement('div');
  l.className = 'setting-label';
  l.textContent = label;
  const h = document.createElement('div');
  h.className = 'setting-help';
  h.textContent = help;
  text.append(l, h);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'toggle';
  btn.setAttribute('role', 'switch');
  const sync = () => {
    const v = settings[key];
    btn.classList.toggle('on', v);
    btn.setAttribute('aria-checked', String(v));
    btn.innerHTML = `<span class="knob"></span><span class="state">${v ? onLabel : offLabel}</span>`;
  };
  btn.addEventListener('click', () => {
    sounds.unlock();
    const v = !settings[key];
    saveSettings({ [key]: v });
    sounds.click();
    sync();
    onFlip?.(v);
  });
  sync();
  row.append(text, btn);
  return row;
}

export function renderSettingsScreen(ctx: AppContext): void {
  const pack = ctx.pack();
  ctx.root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen settings-screen';
  ctx.root.appendChild(screen);

  const header = document.createElement('header');
  header.className = 'game-header';
  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'btn btn-round';
  backBtn.setAttribute('aria-label', pack.ui.back);
  backBtn.textContent = '←';
  backBtn.addEventListener('click', () => ctx.navigate('home'));
  const title = document.createElement('h2');
  title.className = 'screen-title';
  title.textContent = `🔐 ${pack.ui.settingsTitle}`;
  header.append(backBtn, title);
  screen.appendChild(header);

  const list = document.createElement('div');
  list.className = 'settings-list';
  screen.appendChild(list);

  // language
  const langRow = document.createElement('div');
  langRow.className = 'setting-row';
  const langText = document.createElement('div');
  langText.className = 'setting-text';
  langText.innerHTML = `<div class="setting-label"></div>`;
  langText.querySelector('.setting-label')!.textContent = pack.ui.language;
  const langSeg = document.createElement('div');
  langSeg.className = 'segmented';
  (
    [
      ['en', 'English 🇺🇸'],
      ['pt-br', 'Português 🇧🇷'],
      ['es', 'Español 🇪🇸']
    ] as const
  ).forEach(([id, label]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'seg-btn' + (settings.language === id ? ' active' : '');
    b.textContent = label;
    b.addEventListener('click', () => {
      sounds.unlock();
      if (settings.language !== id) {
        saveSettings({ language: id });
        sounds.wordChime();
        renderSettingsScreen(ctx); // re-render in the new language
      }
    });
    langSeg.appendChild(b);
  });
  langRow.append(langText, langSeg);
  list.appendChild(langRow);

  // volume
  const volRow = document.createElement('div');
  volRow.className = 'setting-row';
  const volText = document.createElement('div');
  volText.className = 'setting-text';
  volText.innerHTML = `<div class="setting-label"></div>`;
  volText.querySelector('.setting-label')!.textContent = `🔊 ${pack.ui.volume}`;
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.value = String(Math.round(settings.volume * 100));
  slider.className = 'volume-slider';
  slider.addEventListener('input', () => {
    sounds.unlock();
    const v = Number(slider.value) / 100;
    saveSettings({ volume: v });
    sounds.setVolume(v);
  });
  slider.addEventListener('change', () => sounds.wordChime());
  volRow.append(volText, slider);
  list.appendChild(volRow);

  list.appendChild(
    toggleRow(`🔕 ${pack.ui.errorSound}`, pack.ui.errorSoundHelp, pack.ui.on, pack.ui.off, 'errorSound')
  );
  list.appendChild(
    toggleRow(`✨ ${pack.ui.visualCue}`, pack.ui.visualCueHelp, pack.ui.on, pack.ui.off, 'visualCue')
  );
  list.appendChild(
    toggleRow(`🪄 ${pack.ui.accentLenient}`, pack.ui.accentLenientHelp, pack.ui.on, pack.ui.off, 'accentLenient')
  );
  list.appendChild(
    toggleRow(`✏️ ${pack.ui.autoPunctuation}`, pack.ui.autoPunctuationHelp, pack.ui.on, pack.ui.off, 'autoPunctuation')
  );
  list.appendChild(
    toggleRow(`💡 ${pack.ui.hintAfterMistakes}`, pack.ui.hintAfterMistakesHelp, pack.ui.on, pack.ui.off, 'hintAfterMistakes')
  );
  list.appendChild(
    toggleRow(`🌿 ${pack.ui.calmMode}`, pack.ui.calmModeHelp, pack.ui.on, pack.ui.off, 'calmMode', (v) =>
      document.body.classList.toggle('calm', v)
    )
  );

  // open all levels
  const openRow = document.createElement('div');
  openRow.className = 'setting-row';
  const openText = document.createElement('div');
  openText.className = 'setting-text';
  const openLabel = document.createElement('div');
  openLabel.className = 'setting-label';
  openLabel.textContent = `🗝️ ${pack.ui.openLevels}`;
  const openHelp = document.createElement('div');
  openHelp.className = 'setting-help';
  openHelp.textContent = pack.ui.openLevelsHelp;
  openText.append(openLabel, openHelp);

  const openBtn = document.createElement('button');
  openBtn.type = 'button';
  openBtn.className = 'btn action-btn';
  const syncOpenBtn = () => {
    openBtn.disabled = isAllUnlocked();
    openBtn.textContent = isAllUnlocked() ? pack.ui.openLevelsDone : pack.ui.openLevels;
  };
  syncOpenBtn();
  openBtn.addEventListener('click', () => {
    sounds.unlock();
    unlockAllLevels();
    sounds.wordChime();
    syncOpenBtn();
  });
  openRow.append(openText, openBtn);
  list.appendChild(openRow);

  // reset levels (two taps to confirm, disarms after a few seconds)
  const resetRow = document.createElement('div');
  resetRow.className = 'setting-row';
  const resetText = document.createElement('div');
  resetText.className = 'setting-text';
  const resetLabel = document.createElement('div');
  resetLabel.className = 'setting-label';
  resetLabel.textContent = `🧹 ${pack.ui.resetLevels}`;
  const resetHelp = document.createElement('div');
  resetHelp.className = 'setting-help';
  resetHelp.textContent = pack.ui.resetLevelsHelp;
  resetText.append(resetLabel, resetHelp);

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn action-btn';
  resetBtn.textContent = pack.ui.resetLevels;
  let armed = false;
  let disarmTimer = 0;
  resetBtn.addEventListener('click', () => {
    sounds.unlock();
    window.clearTimeout(disarmTimer);
    if (!armed) {
      armed = true;
      resetBtn.classList.add('armed');
      resetBtn.textContent = pack.ui.resetConfirm;
      disarmTimer = window.setTimeout(() => {
        armed = false;
        resetBtn.classList.remove('armed');
        resetBtn.textContent = pack.ui.resetLevels;
      }, 4000);
      return;
    }
    resetProgress();
    armed = false;
    resetBtn.classList.remove('armed');
    resetBtn.textContent = pack.ui.resetDone;
    resetBtn.disabled = true;
    syncOpenBtn(); // reset also re-locks the levels
    sounds.wordChime();
  });
  resetRow.append(resetText, resetBtn);
  list.appendChild(resetRow);

  // build stamp (commit + build time), for checking which version is deployed
  const build = document.createElement('div');
  build.className = 'build-info';
  const when = new Date(__BUILD_INFO__.builtAt);
  build.textContent = `${__BUILD_INFO__.commit} · ${when.toLocaleString()}`;
  screen.appendChild(build);
}
