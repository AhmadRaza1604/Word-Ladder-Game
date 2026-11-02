/**
 * Web Audio API synthesized sound effects.
 * 100% offline, zero external audio asset dependencies.
 * Supports granular volume reduction and muting.
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.5; // 0.0 to 1.0 (default 50% comfortable volume)

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Subtle tactile click when typing or tapping a letter tile.
   */
  public playTileTap() {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.04);

      const peakGain = 0.08 * this.volume;
      gain.gain.setValueAtTime(peakGain, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted
    }
  }

  /**
   * Resonant positive chime when a valid word move is accepted.
   */
  public playValidMove() {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25]; // C5 -> E5

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        const peakGain = 0.12 * this.volume;
        gain.gain.setValueAtTime(peakGain, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.15);
      });
    } catch {
      // Audio ignored
    }
  }

  /**
   * Low dull thud/buzzer when an invalid word or move is submitted.
   */
  public playInvalid() {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.15);

      const peakGain = 0.14 * this.volume;
      gain.gain.setValueAtTime(peakGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio ignored
    }
  }

  /**
   * Victory fanfare on completing a level!
   */
  public playVictory() {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5];

      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const startTime = now + idx * 0.09;
        const duration = idx === chord.length - 1 ? 0.45 : 0.2;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        const peakGain = 0.14 * this.volume;
        gain.gain.setValueAtTime(peakGain, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    } catch {
      // Audio ignored
    }
  }

  /**
   * Hint chime
   */
  public playHint() {
    if (!this.enabled || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.12);

      const peakGain = 0.1 * this.volume;
      gain.gain.setValueAtTime(peakGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {
      // Audio ignored
    }
  }
}

export const sounds = new SoundManager();
