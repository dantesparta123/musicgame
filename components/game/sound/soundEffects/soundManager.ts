import * as Tone from 'tone';
import { start, getContext, now as toneNow } from 'tone';
import { soundConfigs, poolConfigs, soundCreators, soundPlayParams } from './soundDesigns';
import { SoundEffectType, SoundEffectConfig, SoundPoolConfig } from './types';

export { SoundEffectType };
export type { SoundEffectConfig, SoundPoolConfig };

let soundEngineInitialized = false;
let isInitializing = false;
let globalVolume = 0;

const soundPools: Map<SoundEffectType, any[]> = new Map();
const lastPlayTimes: Map<SoundEffectType, number> = new Map();
const poolConfigsMap: Map<SoundEffectType, SoundPoolConfig> = new Map();

function cleanupSoundObject(obj: any, name: string) {
  if (obj) {
    try {
      if (obj.releaseAll) {
        obj.releaseAll();
      }
      obj.disconnect();
      obj.dispose();
      console.log(`Cleaned up sound object ${name}`);
    } catch (error) {
      console.error(`Error cleaning up sound object ${name}:`, error);
    }
  }
}

export async function initSoundManager() {
  if (soundEngineInitialized || isInitializing) {
    console.log('Sound manager already initialized or initializing');
    return;
  }
  
  isInitializing = true;
  console.log('Initializing sound manager...');
  
  try {
    // Tone.js v14: 使用 start() 启动音频上下文
    await start();
    
    // 然后获取 context
    const context = getContext();
    if (!context) {
      console.warn('⚠️ Tone context is not available after start()');
      return;
    }
    // 确保 audio context 在运行状态
    if (context.state !== 'running') {
      await context.resume();
    }
    console.log('✅ Tone.js started, context state:', context.state);

    for (const [type, config] of poolConfigs) {
      const pool: any[] = [];
      const creator = soundCreators.get(type);
      
      if (creator) {
        for (let i = 0; i < config.poolSize; i++) {
          pool.push(creator());
        }
        soundPools.set(type, pool);
        lastPlayTimes.set(type, 0);
        poolConfigsMap.set(type, config);
        console.log(`Initialized sound pool: ${type} (${config.poolSize} objects)`);
      }
    }

    soundEngineInitialized = true;
    console.log('Sound manager initialization complete');
  } catch (error) {
    console.error('Sound manager initialization failed:', error);
    cleanupSoundManager();
  } finally {
    isInitializing = false;
  }
}

export function cleanupSoundManager() {
  console.log('Cleaning up sound manager...');
  
  for (const [type, pool] of soundPools) {
    pool.forEach((effect, index) => {
      if (effect.noise) {
        cleanupSoundObject(effect.noise, `${type}_noise_${index}`);
        cleanupSoundObject(effect.noiseFilter, `${type}_filter_${index}`);
        cleanupSoundObject(effect.noiseEnvelope, `${type}_envelope_${index}`);
        cleanupSoundObject(effect.boomOsc, `${type}_osc_${index}`);
        cleanupSoundObject(effect.boomEnvelope, `${type}_boom_envelope_${index}`);
        if (effect.reverb) {
          cleanupSoundObject(effect.reverb, `${type}_reverb_${index}`);
        }
      } else if (effect.synth) {
        cleanupSoundObject(effect.synth, `${type}_synth_${index}`);
        if (effect.reverb) {
          cleanupSoundObject(effect.reverb, `${type}_reverb_${index}`);
        }
      } else if (effect.mainSynth) {
        cleanupSoundObject(effect.mainSynth, `${type}_main_synth_${index}`);
        cleanupSoundObject(effect.subOsc, `${type}_sub_osc_${index}`);
        cleanupSoundObject(effect.subEnvelope, `${type}_sub_envelope_${index}`);
        cleanupSoundObject(effect.subGain, `${type}_sub_gain_${index}`);
        cleanupSoundObject(effect.mainVolume, `${type}_main_volume_${index}`);
        if (effect.reverb) {
          cleanupSoundObject(effect.reverb, `${type}_reverb_${index}`);
        }
      }
    });
  }
  
  soundPools.clear();
  lastPlayTimes.clear();
  poolConfigsMap.clear();
  soundEngineInitialized = false;
  console.log('Sound manager cleanup complete');
}

export async function playSoundEffect(type: SoundEffectType, options?: Partial<SoundEffectConfig>) {
  console.log(`Attempting to play sound effect: ${type}, sound manager initialized: ${soundEngineInitialized}`);
  if (!soundEngineInitialized) {
    console.warn(`Sound manager not initialized, cannot play ${type}`);
    return;
  }

  const config = soundConfigs.get(type);
  const poolConfig = poolConfigsMap.get(type);
  
  if (!config || !poolConfig) {
    console.warn(`Sound effect configuration not found: ${type}`);
    return;
  }

  const now = Date.now();
  const lastPlayTime = lastPlayTimes.get(type) || 0;
  const throttleMs = options?.throttleMs || config.throttleMs || poolConfig.throttleMs;
  
  if (now - lastPlayTime < throttleMs) {
    return;
  }
  lastPlayTimes.set(type, now);

  const pool = soundPools.get(type);
  if (!pool) {
    console.warn(`Sound effect pool not found: ${type}`);
    return;
  }

  const effect = pool.find(e => !e.busy);
  if (!effect) {
    console.warn(`Sound effect pool ${type} is full, dropping this play`);
    return;
  }

  effect.busy = true;

  try {
    const adjustedConfig = {
      ...config,
      volume: adjustVolume(config.volume || 0)
    };
    await playSoundByType(type, effect, adjustedConfig, options);
  } catch (error) {
    console.error(`Failed to play sound effect ${type}:`, error);
  } finally {
    const duration = options?.duration || config.duration || 1.0;
    setTimeout(() => {
      effect.busy = false;
    }, duration * 1000);
  }
}

async function playSoundByType(type: SoundEffectType, effect: any, config: SoundEffectConfig, options?: Partial<SoundEffectConfig>) {
  const currentTime = toneNow();
  const playTime = Math.max(currentTime, effect.lastPlayTime + 0.01);
  effect.lastPlayTime = playTime;

  const playParams = soundPlayParams.get(type);
  
  switch (type) {
    case SoundEffectType.EXPLOSION:
      effect.noise.start(playTime);
      effect.boomOsc.start(playTime);
      effect.noiseEnvelope.triggerAttackRelease(0.6, playTime);
      effect.boomEnvelope.triggerAttackRelease(0.6, playTime);
      break;

    case SoundEffectType.EXPLOSION_2:
      effect.noise.start(playTime);
      effect.boomOsc.start(playTime);
      effect.noiseEnvelope.triggerAttackRelease(0.5, playTime);
      effect.boomEnvelope.triggerAttackRelease(0.5, playTime);
      break;

    case SoundEffectType.SHOOT:
      const shootParams = playParams || { note: 'C5', duration: 0.2 };
      if (config.volume !== undefined) {
        effect.synth.volume.value = config.volume;
      }
      effect.synth.triggerAttackRelease(shootParams.note, shootParams.duration, playTime, 1);
      break;

    case SoundEffectType.PLAYER_DEATH:
      console.log('Player death sound effect disabled');
      break;

    case SoundEffectType.PLAYER_HURT:
      const hurtParams = playParams || { note: 'C3', duration: 0.3 };
      if (config.volume !== undefined) {
        effect.synth.volume.value = config.volume;
      }
      effect.synth.triggerAttackRelease(hurtParams.note, hurtParams.duration, playTime, 1);
      break;

    case SoundEffectType.PLAYER_HEAL:
      const healParams = playParams || { note: 'A4', duration: 0.5 };
      if (config.volume !== undefined) {
        effect.synth.volume.value = config.volume;
      }
      effect.synth.triggerAttackRelease(healParams.note, healParams.duration, playTime, 1);
      break;

    case SoundEffectType.BUTTON_CLICK:
      const clickParams = playParams || { note: 'C6', duration: 0.1 };
      if (config.volume !== undefined) {
        effect.synth.volume.value = config.volume;
      }
      effect.synth.triggerAttackRelease(clickParams.note, clickParams.duration, playTime, 1);
      break;

    case SoundEffectType.GAME_START:
      const startParams = playParams || { note: 'C4', duration: 2.0 };
      if (config.volume !== undefined) {
        effect.synth.volume.value = config.volume;
      }
      effect.synth.triggerAttackRelease(startParams.note, startParams.duration, playTime, 1);
      break;

    case SoundEffectType.GAME_OVER:
      const overParams = playParams || { note: 'A1', duration: 3.0 };
      if (config.volume !== undefined) {
        effect.synth.volume.value = config.volume;
      }
      effect.synth.triggerAttackRelease(overParams.note, overParams.duration, playTime, 1);
      break;

    case SoundEffectType.LEVEL_COMPLETE:
      const completeParams = playParams || { note: 'C5', duration: 2.5 };
      if (config.volume !== undefined) {
        effect.synth.volume.value = config.volume;
      }
      effect.synth.triggerAttackRelease(completeParams.note, completeParams.duration, playTime, 1);
      break;

    default:
      console.warn(`Unimplemented sound effect type: ${type}`);
  }
}

export function setGlobalVolume(volume: number) {
  globalVolume = Math.max(-60, Math.min(0, volume));
  console.log(`Global volume set to: ${globalVolume}dB`);
}

export function getGlobalVolume(): number {
  return globalVolume;
}

export function adjustVolume(volume: number): number {
  return volume + globalVolume;
}

export const playExplosion = () => playSoundEffect(SoundEffectType.EXPLOSION);
export const playExplosion2 = () => playSoundEffect(SoundEffectType.EXPLOSION_2);
export const playShoot = () => playSoundEffect(SoundEffectType.SHOOT);
export const playPlayerDeath = () => {
  console.log('Calling playPlayerDeath function');
  return playSoundEffect(SoundEffectType.PLAYER_DEATH);
};
export const playPlayerHurt = () => playSoundEffect(SoundEffectType.PLAYER_HURT);
export const playPlayerHeal = () => playSoundEffect(SoundEffectType.PLAYER_HEAL);
export const playButtonClick = () => playSoundEffect(SoundEffectType.BUTTON_CLICK);

export function isSoundManagerInitialized(): boolean {
  return soundEngineInitialized;
}

export function getSoundManagerStats() {
  const stats: Record<string, any> = {};
  
  for (const [type, pool] of soundPools) {
    const busyCount = pool.filter(e => e.busy).length;
    const totalCount = pool.length;
    stats[type] = {
      total: totalCount,
      busy: busyCount,
      available: totalCount - busyCount,
      utilization: (busyCount / totalCount * 100).toFixed(1) + '%'
    };
  }
  
  return stats;
} 