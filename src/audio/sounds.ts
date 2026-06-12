/**
 * All game audio, synthesized live with the Web Audio API — no sound files.
 * Every reward sound is bright and bouncy; the only "negative" sound (thud,
 * opt-in via settings) is deliberately quiet and boring.
 */

type ToyName = 'pop' | 'squeak' | 'boing' | 'sparkle' | 'ding' | 'whistle';

class SoundKit {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private volume = 0.8;

  /** Call from any user gesture; creates/resumes the AudioContext. */
  unlock(): void {
    if (!this.ctx) {
      // iPhones route Web Audio through the ringer channel, so the hardware
      // silent switch mutes the whole game. Declaring a 'playback' session
      // (Safari 17+) routes it through the media channel, like a video.
      const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
      if (session) session.type = 'playback';
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volume;
      this.master.connect(this.ctx.destination);
    }
    // Covers 'suspended' and Safari's non-standard 'interrupted' (set after
    // a phone call or Siri), which never recovers without an explicit resume.
    if (this.ctx.state !== 'running') void this.ctx.resume();
  }

  setVolume(v: number): void {
    this.volume = v;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(v, this.ctx.currentTime, 0.02);
    }
  }

  private get ready(): boolean {
    return !!this.ctx && this.ctx.state === 'running' && this.volume > 0;
  }

  /** One enveloped oscillator note. */
  private note(
    freq: number,
    opts: {
      at?: number;
      dur?: number;
      type?: OscillatorType;
      gain?: number;
      glideTo?: number;
      glideAt?: number;
    } = {}
  ): void {
    if (!this.ready || !this.ctx || !this.master) return;
    const { at = 0, dur = 0.2, type = 'sine', gain = 0.3, glideTo, glideAt } = opts;
    const t = this.ctx.currentTime + at;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (glideTo !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(glideTo, t + (glideAt ?? dur));
    }
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.05);
  }

  /** Short filtered-noise burst (typewriter clack, balloon pop). */
  private noise(opts: { at?: number; dur?: number; freq?: number; q?: number; gain?: number; type?: BiquadFilterType } = {}): void {
    if (!this.ready || !this.ctx || !this.master) return;
    const { at = 0, dur = 0.06, freq = 2500, q = 1, gain = 0.3, type = 'bandpass' } = opts;
    const t = this.ctx.currentTime + at;
    const length = Math.ceil(this.ctx.sampleRate * dur);
    const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(g).connect(this.master);
    src.start(t);
  }

  // ---- typing feedback -----------------------------------------------------

  /** Typewriter click for every correct letter, with playful pitch wobble. */
  click(): void {
    const vary = 0.85 + Math.random() * 0.4;
    this.noise({ dur: 0.045, freq: 2200 * vary, q: 1.2, gain: 0.32 });
    this.note(900 * vary, { dur: 0.05, type: 'square', gain: 0.06 });
  }

  /** Softer click for punctuation that types itself. */
  softClick(): void {
    this.noise({ dur: 0.04, freq: 1400, q: 1, gain: 0.15 });
  }

  /** Two ascending notes when a word is finished. */
  wordChime(): void {
    const base = 523.25 * (1 + (Math.random() - 0.5) * 0.04); // ~C5
    this.note(base, { dur: 0.12, type: 'triangle', gain: 0.22 });
    this.note(base * 1.25, { at: 0.09, dur: 0.18, type: 'triangle', gain: 0.22 });
  }

  /** Happy arpeggio when the whole sentence is typed. */
  sentenceDone(): void {
    const seq = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    seq.forEach((f, i) => this.note(f, { at: i * 0.09, dur: 0.25, type: 'triangle', gain: 0.25 }));
    this.noise({ at: 0.36, dur: 0.3, freq: 6000, q: 0.5, gain: 0.08, type: 'highpass' });
  }

  /** Big fanfare when the question is answered correctly. */
  fanfare(): void {
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    melody.forEach((f, i) => {
      this.note(f, { at: i * 0.11, dur: 0.3, type: 'triangle', gain: 0.26 });
      this.note(f / 2, { at: i * 0.11, dur: 0.3, type: 'sine', gain: 0.12 });
    });
    // closing chord
    [1046.5, 1318.5, 1568].forEach((f) => this.note(f, { at: 0.6, dur: 0.7, type: 'triangle', gain: 0.16 }));
  }

  /** Longer victory jingle for finishing a level. */
  victory(): void {
    const seq = [392, 523.25, 659.25, 783.99, 659.25, 783.99, 1046.5];
    seq.forEach((f, i) => {
      this.note(f, { at: i * 0.14, dur: 0.32, type: 'triangle', gain: 0.24 });
    });
    [523.25, 659.25, 783.99, 1046.5].forEach((f) =>
      this.note(f, { at: 1.0, dur: 1.1, type: 'triangle', gain: 0.14 })
    );
    this.noise({ at: 1.0, dur: 0.6, freq: 7000, q: 0.4, gain: 0.07, type: 'highpass' });
  }

  /** Optional, deliberately boring thud for wrong keys (off by default). */
  thud(): void {
    this.note(95, { dur: 0.08, type: 'triangle', gain: 0.1 });
  }

  // ---- background music -----------------------------------------------------

  private musicTimer: number | null = null;
  private musicStep = 0;
  private musicNextNoteTime = 0;

  get musicPlaying(): boolean {
    return this.musicTimer !== null;
  }

  /** Start the looping radio tune. Safe to call repeatedly. */
  startMusic(): void {
    if (this.musicTimer !== null) return;
    this.unlock();
    if (!this.ctx) return;
    this.musicStep = 0;
    this.musicNextNoteTime = this.ctx.currentTime + 0.05;
    const tick = () => this.scheduleMusic();
    tick();
    this.musicTimer = window.setInterval(tick, 200);
  }

  stopMusic(): void {
    if (this.musicTimer === null) return;
    window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  /**
   * Lookahead scheduler: every interval tick, schedule the loop's notes up to
   * half a second ahead at exact AudioContext times, so the tune stays on the
   * beat regardless of timer jitter.
   */
  private scheduleMusic(): void {
    if (!this.ctx) return;
    const STEP = 0.27; // one eighth note ≈ 111 bpm — bouncy but not frantic
    while (this.musicNextNoteTime < this.ctx.currentTime + 0.5) {
      const at = Math.max(0, this.musicNextNoteTime - this.ctx.currentTime);
      const melody = MELODY[this.musicStep % MELODY.length];
      const bass = BASS[this.musicStep % BASS.length];
      // Quiet on purpose: the typing clicks and reward sounds stay the stars.
      if (melody) this.note(melody, { at, dur: 0.24, type: 'triangle', gain: 0.1 });
      if (bass) this.note(bass, { at, dur: 0.3, type: 'sine', gain: 0.08 });
      this.musicNextNoteTime += STEP;
      this.musicStep++;
    }
  }

  // ---- reward playground toys ---------------------------------------------

  toy(name: ToyName): void {
    const vary = 0.9 + Math.random() * 0.25;
    switch (name) {
      case 'pop':
        this.noise({ dur: 0.09, freq: 900 * vary, q: 0.7, gain: 0.5 });
        this.note(420 * vary, { dur: 0.1, type: 'square', gain: 0.12, glideTo: 120 });
        break;
      case 'squeak':
        this.note(950 * vary, { dur: 0.09, type: 'sine', gain: 0.3, glideTo: 1500 * vary, glideAt: 0.07 });
        this.note(1400 * vary, { at: 0.1, dur: 0.12, type: 'sine', gain: 0.3, glideTo: 800 * vary });
        break;
      case 'boing':
        this.note(420 * vary, { dur: 0.35, type: 'triangle', gain: 0.3, glideTo: 110, glideAt: 0.3 });
        break;
      case 'sparkle': {
        const base = 1600 * vary;
        [1, 1.33, 1.66, 2].forEach((m, i) =>
          this.note(base * m, { at: i * 0.05, dur: 0.18, type: 'sine', gain: 0.16 })
        );
        break;
      }
      case 'ding':
        this.note(880 * vary, { dur: 0.7, type: 'sine', gain: 0.3 });
        this.note(880 * vary * 2.76, { dur: 0.4, type: 'sine', gain: 0.08 });
        break;
      case 'whistle':
        this.note(500 * vary, { dur: 0.3, type: 'sine', gain: 0.25, glideTo: 1300 * vary, glideAt: 0.25 });
        this.note(1300 * vary, { at: 0.32, dur: 0.3, type: 'sine', gain: 0.25, glideTo: 450 * vary, glideAt: 0.25 });
        break;
    }
  }
}

// Radio tune: an original 8-bar music-box loop in C major. Each row is one
// bar of eighth notes (null = rest); frequencies are in Hz.
const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, G5 = 783.99, A5 = 880, C6 = 1046.5;
const G2 = 98, A2 = 110, B2 = 123.47, C3 = 130.81, D3 = 146.83, E3 = 164.81, F3 = 174.61;

const MELODY: (number | null)[] = [
  C5, null, E5, null, G5, null, E5, null,
  A5, null, G5, null, E5, null, null, null,
  D5, null, E5, null, F5, null, D5, null,
  E5, null, D5, null, C5, null, null, null,
  C5, null, E5, null, G5, null, E5, null,
  A5, null, C6, null, A5, null, G5, null,
  F5, null, E5, null, D5, null, E5, null,
  C5, null, null, null, null, null, null, null
];

// Oom-pah bass on the quarter notes (root–fifth), following the melody's chords.
const BASS: (number | null)[] = [
  C3, null, G2, null, C3, null, G2, null,
  A2, null, E3, null, A2, null, E3, null,
  D3, null, A2, null, D3, null, A2, null,
  G2, null, D3, null, G2, null, B2, null,
  C3, null, G2, null, C3, null, G2, null,
  A2, null, E3, null, A2, null, E3, null,
  F3, null, C3, null, G2, null, D3, null,
  C3, null, G2, null, C3, null, G2, null
];

export type { ToyName };
export const sounds = new SoundKit();
