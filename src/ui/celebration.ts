const CONFETTI_COLORS = ['#ff6b6b', '#ffd166', '#06d6a0', '#4cc9f0', '#9b5de5', '#f15bb5'];

/**
 * Burst of CSS confetti from the middle of `container`.
 * Pieces clean themselves up when their animation ends.
 */
export function burstConfetti(container: HTMLElement, count = 28): void {
  const calm = document.body.classList.contains('calm');
  const n = calm ? Math.min(count, 12) : count;
  for (let i = 0; i < n; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    const angle = Math.random() * Math.PI * 2;
    const dist = 80 + Math.random() * 200;
    piece.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    piece.style.setProperty('--dy', `${Math.sin(angle) * dist - 120}px`);
    piece.style.setProperty('--rot', `${(Math.random() - 0.5) * 720}deg`);
    piece.style.setProperty('--confetti-color', CONFETTI_COLORS[i % CONFETTI_COLORS.length]);
    piece.style.animationDuration = `${(calm ? 1.4 : 0.9) + Math.random() * 0.6}s`;
    if (Math.random() > 0.5) piece.classList.add('round');
    piece.addEventListener('animationend', () => piece.remove());
    container.appendChild(piece);
  }
}
