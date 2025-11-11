import * as Tone from 'tone';

let masterGain: Tone.Gain | null = null;
let musicBus: Tone.Gain | null = null;
let musicLimiter: Tone.Limiter | null = null;
let sfxBus: Tone.Gain | null = null;
let sfxLimiter: Tone.Limiter | null = null;

function ensureBuses() {
  if (!masterGain) {
    masterGain = new Tone.Gain(1);
    masterGain.toDestination();
  }

  if (!musicBus) {
    musicBus = new Tone.Gain(1);
    musicLimiter = new Tone.Limiter(-3);
    musicBus.connect(musicLimiter);
    musicLimiter.connect(masterGain);
  }

  if (!sfxBus) {
    sfxBus = new Tone.Gain(1);
    sfxLimiter = new Tone.Limiter(-3);
    sfxBus.connect(sfxLimiter);
    sfxLimiter.connect(masterGain);
  }
}

export function getMusicBus(): Tone.Gain {
  ensureBuses();
  return musicBus!;
}

export function getSfxBus(): Tone.Gain {
  ensureBuses();
  return sfxBus!;
}

export function disposeAudioBuses() {
  musicBus = null;
  musicLimiter = null;
  sfxBus = null;
  sfxLimiter = null;
  masterGain = null;
}

