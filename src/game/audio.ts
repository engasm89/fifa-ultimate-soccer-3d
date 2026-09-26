/**
 * Realistic Procedural Web Audio Sound Generator for Soccer Stadium
 * Synthesizes crowd noise, ball kicks, goalpost clangs, referee whistles,
 * cloth net rustles, and fireworks celebration sounds without external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private crowdNode: AudioNode | null = null;
  private crowdGain: GainNode | null = null;
  private isMuted: boolean = false;
  private initialized: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public init() {
    if (this.initialized) return;
    this.initContext();
    this.startAmbientCrowd();
    this.initialized = true;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.crowdGain && this.ctx) {
      this.crowdGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Continuous background ambient crowd murmur & stadium atmosphere
   */
  private startAmbientCrowd() {
    if (!this.ctx || this.isMuted) return;

    // Pink/Brown noise generation for crowd murmur
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter approximation
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Bandpass filter to make it sound like stadium acoustics
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 450;
    filter.Q.value = 1.2;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.12;

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();
    this.crowdNode = noise;
    this.crowdGain = gain;
  }

  /**
   * Punchy acoustic ball kick sound with thud and high-frequency friction
   */
  public playKick(power: number = 0.7) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Fast pitch drop from 180Hz to 40Hz (leather ball impact)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 + power * 80, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.09);

    gain.gain.setValueAtTime(0.8 * Math.min(power, 1), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);

    // Impact click
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'triangle';
    click.frequency.setValueAtTime(800, now);
    click.frequency.exponentialRampToValueAtTime(100, now + 0.02);
    clickGain.gain.setValueAtTime(0.3 * power, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    click.connect(clickGain);
    clickGain.connect(this.ctx.destination);
    click.start(now);
    click.stop(now + 0.035);
  }

  /**
   * Goal post hit sound (ringing metallic clang)
   */
  public playPostHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [520, 890, 1420].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.4 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    });
  }

  /**
   * Sound of ball hitting the net (soft rustle and swish)
   */
  public playNetRustle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.linearRampToValueAtTime(400, now + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  /**
   * Referee whistle (dual tones with slight frequency vibrato)
   */
  public playWhistle(long: boolean = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const duration = long ? 0.8 : 0.25;

    [2600, 2900].forEach((freq) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // vibrato
      osc.frequency.setValueAtTime(freq + Math.sin(now * 30) * 40, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.04);
      gain.gain.setValueAtTime(0.25, now + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now);
      osc.stop(now + duration + 0.01);
    });
  }

  /**
   * Huge Goal Roar & Celebration
   */
  public playGoalRoar() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    this.playWhistle(true);

    // Sudden massive crowd swell
    const now = this.ctx.currentTime;
    if (this.crowdGain) {
      this.crowdGain.gain.cancelScheduledValues(now);
      this.crowdGain.gain.setValueAtTime(this.crowdGain.gain.value, now);
      this.crowdGain.gain.linearRampToValueAtTime(0.65, now + 0.5);
      this.crowdGain.gain.exponentialRampToValueAtTime(0.12, now + 4.5);
    }

    // Horn / Stadium siren sound
    const horn = this.ctx.createOscillator();
    const hornGain = this.ctx.createGain();
    horn.type = 'sawtooth';
    horn.frequency.setValueAtTime(220, now + 0.1);
    horn.frequency.setValueAtTime(293.66, now + 0.4);
    horn.frequency.setValueAtTime(329.63, now + 0.7);

    hornGain.gain.setValueAtTime(0, now);
    hornGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
    hornGain.gain.setValueAtTime(0.18, now + 1.2);
    hornGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    horn.connect(hornGain);
    hornGain.connect(this.ctx.destination);

    horn.start(now + 0.1);
    horn.stop(now + 2.1);
  }

  /**
   * Firework explosion sound
   */
  public playFireworkBoom() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Low frequency explosion
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);

    // Crackle noise
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(Math.random(), 3);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
  }
}

export const soundEngine = new SoundEngine();
