import type { UiStrings } from '../content/types';

/**
 * Mobile-game style parental gate: a multiplication an adult solves in a
 * second but a kid is unlikely to. Wrong answer or tapping outside quietly
 * closes the dialog — no error state, no sound (a kid may be the one trying).
 */
export function showParentGate(ui: UiStrings, onPass: () => void): void {
  const a = 5 + Math.floor(Math.random() * 6); // 5..10
  const b = 5 + Math.floor(Math.random() * 6); // 5..10

  const overlay = document.createElement('div');
  overlay.className = 'gate-overlay';
  overlay.addEventListener('pointerdown', (ev) => {
    if (ev.target === overlay) overlay.remove();
  });

  const card = document.createElement('div');
  card.className = 'gate-card pop-in';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'gate-close';
  close.setAttribute('aria-label', ui.back);
  close.textContent = '✕';
  close.addEventListener('click', () => overlay.remove());

  const title = document.createElement('div');
  title.className = 'gate-title';
  title.textContent = `🔐 ${ui.parentGateTitle}`;

  const ask = document.createElement('div');
  ask.className = 'gate-ask';
  ask.textContent = ui.parentGateAsk.replace('{a}', String(a)).replace('{b}', String(b));

  const input = document.createElement('input');
  input.className = 'gate-input';
  input.type = 'text';
  input.inputMode = 'numeric';
  input.autocomplete = 'off';
  input.maxLength = 4;

  const go = document.createElement('button');
  go.type = 'button';
  go.className = 'btn gate-go';
  go.textContent = ui.parentGateGo;

  function submit(): void {
    if (Number(input.value.trim()) === a * b) {
      overlay.remove();
      onPass();
    } else {
      overlay.remove();
    }
  }
  go.addEventListener('click', submit);
  input.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') submit();
  });

  card.append(close, title, ask, input, go);
  overlay.appendChild(card);
  document.body.appendChild(overlay);
  input.focus();
}
