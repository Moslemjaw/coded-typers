// ============================================================
// Web Audio System — Zero external assets procedural audio
// ============================================================

class SoundSystem {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private isMusicPlaying = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /** Play click sound for keystrokes */
  playKeystroke(isCorrect: boolean) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (isCorrect) {
        // Crisp mechanical click sound
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800 + Math.random() * 200, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
      } else {
        // Error thud sound
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.06);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
      }
    } catch {
      // AudioContext muted/blocked by browser policy
    }
  }

  /** Play round finished celebratory chime */
  playFinishChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {}
  }

  /** Start ambient background music loop */
  startMusic() {
    if (this.isMusicPlaying) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.isMusicPlaying = true;
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.05, this.ctx.currentTime); // Soft background level

      // Filter to keep background music warm and non-intrusive
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      this.musicGain.connect(filter);
      filter.connect(this.ctx.destination);

      // Ambient warm chord frequencies (C major 7th / F major 7th ambient pads)
      const baseFreqs = [130.81, 164.81, 196.00, 246.94]; // C3, E3, G3, B3
      this.musicOscillators = baseFreqs.map(freq => {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);
        osc.connect(this.musicGain!);
        osc.start();
        return osc;
      });
    } catch {}
  }

  /** Stop ambient background music */
  stopMusic() {
    if (!this.isMusicPlaying) return;
    try {
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          this.musicOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch {}
          });
          this.musicOscillators = [];
          this.isMusicPlaying = false;
        }, 500);
      }
    } catch {
      this.isMusicPlaying = false;
    }
  }
}

export const soundSystem = new SoundSystem();
