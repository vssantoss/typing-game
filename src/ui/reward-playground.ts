import { sounds, type ToyName } from '../audio/sounds';
import { burstConfetti } from './celebration';
import { createMascot } from './mascot';

interface ToySpec {
  type: ToyName;
  emoji: string;
  /** Balloons pop on the first tap; other toys fly away after a few taps. */
  taps: number;
  hueSpin?: boolean;
}

const TOY_POOL: ToySpec[] = [
  { type: 'pop', emoji: '🎈', taps: 1, hueSpin: true },
  { type: 'pop', emoji: '🎈', taps: 1, hueSpin: true },
  { type: 'squeak', emoji: '🦆', taps: 3 },
  { type: 'boing', emoji: '⚽', taps: 3 },
  { type: 'boing', emoji: '🏀', taps: 3 },
  { type: 'sparkle', emoji: '⭐', taps: 3 },
  { type: 'sparkle', emoji: '🌟', taps: 3 },
  { type: 'ding', emoji: '🔔', taps: 3 },
  { type: 'whistle', emoji: '🎺', taps: 2 },
  { type: 'squeak', emoji: '🐤', taps: 3 },
  { type: 'ding', emoji: '🛎️', taps: 3 },
  { type: 'pop', emoji: '🎈', taps: 1, hueSpin: true }
];

export interface PlaygroundOptions {
  container: HTMLElement;
  praise: string;
  /** Pool of praise phrases Pip says in his speech balloon. */
  phrases: string[];
  tapLabel: string;
  nextLabel: string;
  /** Level-complete version: more toys. */
  big?: boolean;
  onDone: () => void;
}

export function showPlayground(opts: PlaygroundOptions): () => void {
  const overlay = document.createElement('div');
  overlay.className = 'playground';

  const praise = document.createElement('div');
  praise.className = 'praise';
  praise.textContent = opts.praise;
  overlay.appendChild(praise);

  const tapLabel = document.createElement('div');
  tapLabel.className = 'tap-label';
  tapLabel.textContent = opts.tapLabel;
  overlay.appendChild(tapLabel);

  let finished = false;
  let autoTimer = 0;
  function finish(): void {
    if (finished) return;
    finished = true;
    window.clearTimeout(autoTimer);
    overlay.classList.add('leaving');
    window.setTimeout(() => {
      overlay.remove();
      opts.onDone();
    }, 350);
  }

  const count = opts.big ? 10 : 6;
  const pool = [...TOY_POOL].sort(() => Math.random() - 0.5).slice(0, count);
  let alive = pool.length;

  pool.forEach((spec, i) => {
    const toy = document.createElement('button');
    toy.type = 'button';
    toy.className = 'toy';
    toy.textContent = spec.emoji;
    toy.style.left = `${6 + Math.random() * 78}%`;
    toy.style.top = `${20 + Math.random() * 48}%`;
    toy.style.setProperty('--float-delay', `${Math.random() * 2}s`);
    toy.style.setProperty('--float-dur', `${2.6 + Math.random() * 1.8}s`);
    toy.style.setProperty('--toy-scale', `${0.9 + Math.random() * 0.45}`);
    toy.style.animationDelay = `${i * 0.08}s`;
    if (spec.hueSpin) {
      toy.style.filter = `hue-rotate(${Math.floor(Math.random() * 300)}deg)`;
    }

    let tapsLeft = spec.taps;
    toy.addEventListener('pointerdown', (ev) => {
      ev.preventDefault();
      if (toy.classList.contains('gone')) return;
      sounds.unlock();
      sounds.toy(spec.type);
      tapsLeft--;
      if (tapsLeft <= 0) {
        toy.classList.add('gone', spec.type === 'pop' ? 'popped' : 'flyaway');
        if (spec.type === 'pop') {
          const puff = document.createElement('div');
          puff.className = 'pop-puff';
          puff.style.left = toy.style.left;
          puff.style.top = toy.style.top;
          overlay.appendChild(puff);
          window.setTimeout(() => puff.remove(), 600);
        }
        window.setTimeout(() => toy.remove(), 700);
        alive--;
        if (alive === 0) {
          burstConfetti(overlay, 20);
          autoTimer = window.setTimeout(finish, 900);
        }
      } else {
        toy.classList.remove('bounce');
        void toy.offsetWidth;
        toy.classList.add('bounce');
      }
    });
    overlay.appendChild(toy);
  });

  // Pip joins the party — here he never gets tired of being tapped. His
  // balloon shows one praise phrase for the whole party.
  const mascot = createMascot();
  const bubble = document.createElement('div');
  bubble.className = 'mascot-bubble show';
  bubble.textContent = pick(opts.phrases);
  mascot.el.addEventListener('pointerdown', () => {
    sounds.unlock();
    sounds.toy('squeak');
    mascot.celebrate();
  });
  overlay.append(mascot.el, bubble);

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'btn btn-big next-btn';
  next.textContent = `${opts.nextLabel} ➜`;
  next.addEventListener('click', finish);
  overlay.appendChild(next);

  opts.container.appendChild(overlay);
  burstConfetti(overlay, opts.big ? 40 : 28);
  return finish;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
