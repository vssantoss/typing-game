/**
 * Pip — a sunny round buddy who only knows two moods: happy and HAPPIER.
 * (No disappointed state, on purpose.)
 */
export function createMascot(): { el: HTMLElement; celebrate: () => void } {
  const el = document.createElement('div');
  el.className = 'mascot idle';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <svg viewBox="0 0 120 120" class="mascot-svg">
      <defs>
        <radialGradient id="pip-body" cx="40%" cy="35%" r="80%">
          <stop offset="0%" stop-color="#ffe29a"/>
          <stop offset="100%" stop-color="#ffc94d"/>
        </radialGradient>
      </defs>
      <ellipse class="pip-shadow" cx="60" cy="112" rx="30" ry="6" fill="rgba(61,64,91,.12)"/>
      <g class="pip-body-group">
        <circle cx="60" cy="64" r="42" fill="url(#pip-body)" stroke="#f4a93c" stroke-width="3"/>
        <circle class="pip-cheek" cx="38" cy="72" r="7" fill="#ffadad" opacity=".7"/>
        <circle class="pip-cheek" cx="82" cy="72" r="7" fill="#ffadad" opacity=".7"/>
        <g class="pip-eyes">
          <circle cx="46" cy="58" r="5.5" fill="#3d405b"/>
          <circle cx="74" cy="58" r="5.5" fill="#3d405b"/>
          <circle cx="48" cy="56" r="2" fill="#fff"/>
          <circle cx="76" cy="56" r="2" fill="#fff"/>
        </g>
        <path class="pip-mouth" d="M48 76 Q60 88 72 76" fill="none" stroke="#3d405b" stroke-width="3.5" stroke-linecap="round"/>
        <path class="pip-tuft" d="M56 24 Q60 12 66 22 Q70 14 74 26" fill="none" stroke="#f4a93c" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>`;

  let timer = 0;
  function celebrate(): void {
    el.classList.remove('celebrate');
    // restart the CSS animation
    void el.offsetWidth;
    el.classList.add('celebrate');
    window.clearTimeout(timer);
    timer = window.setTimeout(() => el.classList.remove('celebrate'), 1600);
  }

  return { el, celebrate };
}
