import { sounds } from '../audio/sounds';
import { isUnlocked, starsFor } from '../state/progress';
import { settings } from '../state/settings';
import type { AppContext } from './context';
import { createMascot } from './mascot';
import { showParentGate } from './parent-gate';

export function renderHomeScreen(ctx: AppContext): void {
  const pack = ctx.pack();
  ctx.root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';
  ctx.root.appendChild(screen);

  const gear = document.createElement('button');
  gear.type = 'button';
  gear.className = 'btn btn-round settings-btn';
  gear.setAttribute('aria-label', pack.ui.settings);
  gear.textContent = '⚙️';
  gear.addEventListener('click', () => {
    sounds.unlock();
    showParentGate(pack.ui, () => ctx.navigate('settings'));
  });
  screen.appendChild(gear);

  const hero = document.createElement('div');
  hero.className = 'hero';
  const title = document.createElement('h1');
  title.className = 'app-title';
  // one bouncing candy letter per character
  [...pack.ui.appName].forEach((c, i) => {
    const s = document.createElement('span');
    s.textContent = c === ' ' ? ' ' : c;
    s.style.setProperty('--i', String(i));
    title.appendChild(s);
  });
  const tagline = document.createElement('p');
  tagline.className = 'tagline';
  tagline.textContent = pack.ui.tagline;
  hero.append(title, tagline);
  screen.appendChild(hero);

  const grid = document.createElement('div');
  grid.className = 'level-grid';
  pack.levels.forEach((level, i) => {
    const unlocked = isUnlocked(settings.language, i);
    const stars = starsFor(settings.language, i);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'level-card';
    card.style.setProperty('--i', String(i));
    card.disabled = !unlocked;
    const starsRow = unlocked
      ? `<div class="card-stars">${'★'.repeat(stars)}${'☆'.repeat(level.items.length - stars)}</div>`
      : `<div class="card-stars locked">🔒</div>`;
    card.innerHTML = `
      <div class="card-emoji">${level.emoji}</div>
      <div class="card-title"></div>
      ${starsRow}`;
    card.querySelector('.card-title')!.textContent = level.title;
    if (unlocked) {
      card.addEventListener('click', () => {
        sounds.unlock();
        sounds.wordChime();
        ctx.navigate('game', { level: i });
      });
    }
    grid.appendChild(card);
  });

  // "What is it?" game: always open — no stars, no locks, just for fun.
  const objectsCard = document.createElement('button');
  objectsCard.type = 'button';
  objectsCard.className = 'level-card objects-card';
  objectsCard.style.setProperty('--i', String(pack.levels.length));
  objectsCard.innerHTML = `
    <div class="card-emoji">🔍</div>
    <div class="card-title"></div>
    <div class="card-stars">🧸</div>`;
  objectsCard.querySelector('.card-title')!.textContent = pack.ui.objectsTitle;
  objectsCard.addEventListener('click', () => {
    sounds.unlock();
    sounds.wordChime();
    ctx.navigate('objects');
  });
  grid.appendChild(objectsCard);
  screen.appendChild(grid);

  const mascot = createMascot();
  screen.appendChild(mascot.el);

  // Pip is fun to poke, but he shouldn't out-compete the actual game: after
  // a burst of taps he goes quiet and points back at playing.
  const bubble = document.createElement('div');
  bubble.className = 'mascot-bubble';
  bubble.textContent = pack.ui.letsPlay;
  screen.appendChild(bubble);

  // Once he's had enough he stays quiet for good (until the next visit to
  // this screen) — waiting him out isn't rewarded, playing is.
  let taps = 0;
  mascot.el.addEventListener('pointerdown', () => {
    sounds.unlock();
    taps++;
    if (taps > 6) {
      bubble.classList.add('show');
      return; // no sound, no jump — time to play the game
    }
    sounds.toy('squeak');
    mascot.celebrate();
  });
}
