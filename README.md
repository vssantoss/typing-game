# Type & Play

A colorful, sound-rich typing game for kids. Type a sentence, answer a comprehension question about it, then celebrate in a playground of tappable sound toys. Built with positive reinforcement only — there is no way to fail, only ways to succeed.

Designed with neurodivergent kids in mind (autism, ADHD, typing anxiety): rewarding sounds fire **only** on correct actions, and wrong keys are completely inert by default — no sound, no shake, no error state.

## The game loop

1. **Type the sentence** — each correct letter pops in on a candy-colored tile with a typewriter click. Wrong keys are silently ignored.
2. **Answer the question** — a comprehension question about the sentence, answered letter-by-letter into friendly blank slots. A hint button makes the answer word dance inside the sentence.
3. **Play in the reward playground** — balloons, ducks, balls, stars, bells and trumpets float around, each with its own synthesized sound when tapped. Pop them all (or tap Next) to move on.

Five levels of increasing difficulty, from "I see a cat." up to two-sentence mini stories. Finishing a level earns a star and unlocks the next.

## Features

- **Three languages** — English, Brazilian Portuguese, and Spanish, each with its own content pack and separate progress. Defaults to the device language on first run.
- **Anxiety reducers** — punctuation types itself, accents are forgiven (`cafe` matches `café`, `manana` matches `mañana`), hints are free and never punished.
- **No pressure** — no timers, no scores, no fail state. The mascot only celebrates.
- **Sensory-friendly options** — calm animations mode, optional gentle glow on the next letter, optional (deliberately boring) wrong-key sound, volume control.
- **Parents Area** — behind a small multiplication gate: language, sound and hint settings, unlock all levels, reset progress.
- **Fully offline PWA** — installable, works without a network, all sounds synthesized with the Web Audio API (zero audio files). Random background theme on every visit.

## Tech

Vanilla TypeScript + Vite. No framework, no server, no tracking. Relative asset paths keep it ready for Electron or Capacitor packaging.

## Run it

```bash
npm install
npm run dev       # dev server
npm test          # typing-engine unit tests (vitest)
npm run build     # type-check + production build + service worker
npm run preview   # serve the production build
```
