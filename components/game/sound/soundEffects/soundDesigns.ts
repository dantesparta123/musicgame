import * as Tone from 'tone';
import { SoundEffectType } from './types';

// ====== 音效配置 ======
export const soundConfigs = new Map([
  // 爆炸音效
  [SoundEffectType.EXPLOSION, { type: SoundEffectType.EXPLOSION, volume: -6, duration: 0.6, throttleMs: 60 }],
  [SoundEffectType.EXPLOSION_2, { type: SoundEffectType.EXPLOSION_2, volume: -8, duration: 0.5, throttleMs: 60 }],
  
  // 射击音效
  [SoundEffectType.SHOOT, { type: SoundEffectType.SHOOT, volume: -9, duration: 0.2, throttleMs: 10 }],
  
  // 玩家音效
  [SoundEffectType.PLAYER_DEATH, { type: SoundEffectType.PLAYER_DEATH, volume: -10, duration: 1.0, throttleMs: 1000 }], // 死亡音效音量
  [SoundEffectType.PLAYER_HURT, { type: SoundEffectType.PLAYER_HURT, volume: -8, duration: 0.3, throttleMs: 200 }], // 受伤音效音量
  [SoundEffectType.PLAYER_HEAL, { type: SoundEffectType.PLAYER_HEAL, volume: -6, duration: 0.5, throttleMs: 300 }], // 治疗音效音量
  
  // 游戏状态音效
  [SoundEffectType.GAME_START, { type: SoundEffectType.GAME_START, volume: -6, duration: 2.0, throttleMs: 5000 }],
  [SoundEffectType.GAME_OVER, { type: SoundEffectType.GAME_OVER, volume: -8, duration: 3.0, throttleMs: 5000 }],
  [SoundEffectType.LEVEL_COMPLETE, { type: SoundEffectType.LEVEL_COMPLETE, volume: -6, duration: 2.5, throttleMs: 3000 }],
  
  // UI音效
  [SoundEffectType.BUTTON_CLICK, { type: SoundEffectType.BUTTON_CLICK, volume: -20, duration: 0.1, throttleMs: 50 }],
  [SoundEffectType.MENU_OPEN, { type: SoundEffectType.MENU_OPEN, volume: -15, duration: 0.3, throttleMs: 100 }],
  [SoundEffectType.MENU_CLOSE, { type: SoundEffectType.MENU_CLOSE, volume: -15, duration: 0.2, throttleMs: 100 }],
  
  // 环境音效
  [SoundEffectType.FOOTSTEP, { type: SoundEffectType.FOOTSTEP, volume: -25, duration: 0.1, throttleMs: 100 }],
  [SoundEffectType.DOOR_OPEN, { type: SoundEffectType.DOOR_OPEN, volume: -12, duration: 0.8, throttleMs: 500 }],
  [SoundEffectType.DOOR_CLOSE, { type: SoundEffectType.DOOR_CLOSE, volume: -12, duration: 0.6, throttleMs: 500 }],
  
  // 技能音效
  [SoundEffectType.SKILL_ACTIVATE, { type: SoundEffectType.SKILL_ACTIVATE, volume: -8, duration: 0.4, throttleMs: 200 }],
  [SoundEffectType.SKILL_COOLDOWN, { type: SoundEffectType.SKILL_COOLDOWN, volume: -15, duration: 0.2, throttleMs: 100 }],
  [SoundEffectType.POWER_UP, { type: SoundEffectType.POWER_UP, volume: -6, duration: 1.0, throttleMs: 1000 }]
]);

// ====== 池配置 ======
export const poolConfigs = new Map([
  [SoundEffectType.EXPLOSION, { poolSize: 6, throttleMs: 60 }],
  [SoundEffectType.EXPLOSION_2, { poolSize: 6, throttleMs: 60 }],
  [SoundEffectType.SHOOT, { poolSize: 6, throttleMs: 10 }],
  [SoundEffectType.PLAYER_DEATH, { poolSize: 2, throttleMs: 1000 }],
  [SoundEffectType.PLAYER_HURT, { poolSize: 4, throttleMs: 200 }],
  [SoundEffectType.PLAYER_HEAL, { poolSize: 3, throttleMs: 300 }],
  [SoundEffectType.GAME_START, { poolSize: 1, throttleMs: 5000 }],
  [SoundEffectType.GAME_OVER, { poolSize: 1, throttleMs: 5000 }],
  [SoundEffectType.LEVEL_COMPLETE, { poolSize: 1, throttleMs: 3000 }],
  [SoundEffectType.BUTTON_CLICK, { poolSize: 8, throttleMs: 50 }],
  [SoundEffectType.MENU_OPEN, { poolSize: 3, throttleMs: 100 }],
  [SoundEffectType.MENU_CLOSE, { poolSize: 3, throttleMs: 100 }],
  [SoundEffectType.FOOTSTEP, { poolSize: 10, throttleMs: 100 }],
  [SoundEffectType.DOOR_OPEN, { poolSize: 2, throttleMs: 500 }],
  [SoundEffectType.DOOR_CLOSE, { poolSize: 2, throttleMs: 500 }],
  [SoundEffectType.SKILL_ACTIVATE, { poolSize: 4, throttleMs: 200 }],
  [SoundEffectType.SKILL_COOLDOWN, { poolSize: 6, throttleMs: 100 }],
  [SoundEffectType.POWER_UP, { poolSize: 2, throttleMs: 1000 }]
]);

export function createExplosionSound() {
  const noise = new Tone.Noise('white');
  const noiseFilter = new Tone.Filter({ type: 'bandpass', frequency: 400, Q: 1 });
  const noiseEnvelope = new Tone.AmplitudeEnvelope({ attack: 0.01, decay: 0.4, sustain: 0, release: 0.2 });
  const boomOsc = new Tone.Oscillator({ type: 'sine', frequency: 60 });
  const boomEnvelope = new Tone.AmplitudeEnvelope({ attack: 0.001, decay: 0.5, sustain: 0, release: 0.1 });

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseEnvelope);
  noiseEnvelope.toDestination();

  boomOsc.connect(boomEnvelope);
  boomEnvelope.toDestination();

  return { noise, noiseFilter, noiseEnvelope, boomOsc, boomEnvelope, busy: false, lastPlayTime: 0 };
}

export function createExplosion2Sound() {
  const noise = new Tone.Noise('white');
  const noiseFilter = new Tone.Filter({ type: 'bandpass', frequency: 250, Q: 1.5 });
  const noiseEnvelope = new Tone.AmplitudeEnvelope({ attack: 0.005, decay: 0.3, sustain: 0, release: 0.18 });
  const boomOsc = new Tone.Oscillator({ type: 'sine', frequency: 90 });
  const boomEnvelope = new Tone.AmplitudeEnvelope({ attack: 0.002, decay: 0.35, sustain: 0, release: 0.15 });
  const reverb = new Tone.Reverb({ decay: 1.0, wet: 0.25 }).toDestination();

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseEnvelope);
  noiseEnvelope.connect(reverb);

  boomOsc.connect(boomEnvelope);
  boomEnvelope.connect(reverb);

  return { noise, noiseFilter, noiseEnvelope, boomOsc, boomEnvelope, reverb, busy: false, lastPlayTime: 0 };
}

export function createShootSound() {
  const reverb = new Tone.Reverb({
    decay: 1.5,
    preDelay: 0.01,
    wet: 0.5
  });

  const synth = new Tone.MonoSynth({
    oscillator: { type: 'square' },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.3,
      release: 0.1
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.5,
      release: 0.3,
      baseFrequency: 800,
      octaves: 2
    }
  }).connect(reverb);

  reverb.toDestination();

  return { synth, reverb, busy: false, lastPlayTime: 0 };
}

export function createPlayerDeathSound() {
  const mainSynth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    envelope: {
      attack: 0.1,
      decay: 0.5,
      sustain: 0.3,
      release: 0.4
    },
    filterEnvelope: {
      attack: 0.1,
      decay: 0.5,
      sustain: 0.3,
      release: 0.4,
      baseFrequency: 100,
      octaves: 3
    }
  });

  const subOsc = new Tone.Oscillator({ type: 'sine', frequency: 55 });
  const subEnvelope = new Tone.AmplitudeEnvelope({ attack: 0.1, decay: 0.5, sustain: 0.3, release: 0.4 });
  const subGain = new Tone.Volume(-8);
  const mainVolume = new Tone.Volume(-15);

  subOsc.connect(subGain);
  subGain.connect(subEnvelope);
  subEnvelope.toDestination();

  mainSynth.connect(mainVolume);
  mainVolume.toDestination();

  return { mainSynth, subOsc, subEnvelope, subGain, mainVolume, busy: false, lastPlayTime: 0 };
}

export function createPlayerHurtSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'square' },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.2
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.2,
      release: 0.2,
      baseFrequency: 400,
      octaves: 1
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createPlayerHealSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.4,
      release: 0.3
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createGameStartSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.5,
      release: 1.5
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createGameOverSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    envelope: {
      attack: 0.2,
      decay: 0.5,
      sustain: 0.3,
      release: 2.0
    },
    filterEnvelope: {
      attack: 0.2,
      decay: 0.5,
      sustain: 0.3,
      release: 2.0,
      baseFrequency: 50,
      octaves: 2
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createLevelCompleteSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.05,
      decay: 0.2,
      sustain: 0.6,
      release: 1.5
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createButtonClickSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'square' },
    envelope: {
      attack: 0.01,
      decay: 0.05,
      sustain: 0.1,
      release: 0.05
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createMenuOpenSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.3,
      release: 0.2
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createMenuCloseSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.2,
      release: 0.15
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createFootstepSound() {
  const noise = new Tone.Noise('white');
  const filter = new Tone.Filter({ type: 'lowpass', frequency: 800, Q: 2 });
  const envelope = new Tone.AmplitudeEnvelope({ attack: 0.01, decay: 0.05, sustain: 0, release: 0.04 });

  noise.connect(filter);
  filter.connect(envelope);
  envelope.toDestination();

  return { noise, filter, envelope, busy: false, lastPlayTime: 0 };
}

export function createDoorOpenSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    envelope: {
      attack: 0.2,
      decay: 0.3,
      sustain: 0.4,
      release: 0.3
    },
    filterEnvelope: {
      attack: 0.2,
      decay: 0.3,
      sustain: 0.4,
      release: 0.3,
      baseFrequency: 200,
      octaves: 3
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createDoorCloseSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sawtooth' },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.3,
      release: 0.2
    },
    filterEnvelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.3,
      release: 0.2,
      baseFrequency: 150,
      octaves: 2
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createSkillActivateSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'square' },
    envelope: {
      attack: 0.01,
      decay: 0.15,
      sustain: 0.3,
      release: 0.2
    },
    filterEnvelope: {
      attack: 0.01,
      decay: 0.15,
      sustain: 0.3,
      release: 0.2,
      baseFrequency: 600,
      octaves: 2
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createSkillCooldownSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'square' },
    envelope: {
      attack: 0.01,
      decay: 0.08,
      sustain: 0.1,
      release: 0.1
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export function createPowerUpSound() {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.5,
      release: 0.5
    }
  }).toDestination();

  return { synth, busy: false, lastPlayTime: 0 };
}

export const soundCreators = new Map<SoundEffectType, () => any>([
  [SoundEffectType.EXPLOSION, createExplosionSound],
  [SoundEffectType.EXPLOSION_2, createExplosion2Sound],
  [SoundEffectType.SHOOT, createShootSound],
  [SoundEffectType.PLAYER_DEATH, createPlayerDeathSound],
  [SoundEffectType.PLAYER_HURT, createPlayerHurtSound],
  [SoundEffectType.PLAYER_HEAL, createPlayerHealSound],
  [SoundEffectType.GAME_START, createGameStartSound],
  [SoundEffectType.GAME_OVER, createGameOverSound],
  [SoundEffectType.LEVEL_COMPLETE, createLevelCompleteSound],
  [SoundEffectType.BUTTON_CLICK, createButtonClickSound],
  [SoundEffectType.MENU_OPEN, createMenuOpenSound],
  [SoundEffectType.MENU_CLOSE, createMenuCloseSound],
  [SoundEffectType.FOOTSTEP, createFootstepSound],
  [SoundEffectType.DOOR_OPEN, createDoorOpenSound],
  [SoundEffectType.DOOR_CLOSE, createDoorCloseSound],
  [SoundEffectType.SKILL_ACTIVATE, createSkillActivateSound],
  [SoundEffectType.SKILL_COOLDOWN, createSkillCooldownSound],
  [SoundEffectType.POWER_UP, createPowerUpSound]
]);

export const soundPlayParams = new Map([
  [SoundEffectType.SHOOT, { note: 'C5', duration: 0.2 }],
  [SoundEffectType.PLAYER_DEATH, { note: 'A2', duration: 1.0 }],
  [SoundEffectType.PLAYER_HURT, { note: 'C3', duration: 0.3 }],
  [SoundEffectType.PLAYER_HEAL, { note: 'A4', duration: 0.5 }],
  [SoundEffectType.GAME_START, { note: 'C4', duration: 2.0 }],
  [SoundEffectType.GAME_OVER, { note: 'A1', duration: 3.0 }],
  [SoundEffectType.LEVEL_COMPLETE, { note: 'C5', duration: 2.5 }],
  [SoundEffectType.BUTTON_CLICK, { note: 'C6', duration: 0.1 }]
]); 