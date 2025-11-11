import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
import { start, getContext, now as toneNow } from 'tone';
import { getSongInstrumentOverrides, SongInstrumentOverrides } from './songInstrumentMap';

let drumSampler: Tone.Sampler | Tone.MembraneSynth | null = null;
let masterVolume: Tone.Volume | null = null;
let globalVolume: number = 0.7;
let trackInstruments: Map<number, string> = new Map();
let trackSamplers: Map<number, Tone.Sampler> = new Map();
let mutedTracks: Set<number> = new Set();

let allSamplers: Map<string, Tone.Sampler> = new Map();
let samplersInitialized = false;

async function initializeAllSamplers() {
  if (samplersInitialized) return;
  
  for (const [instrument, config] of Object.entries(instrumentConfigs)) {
    try {
      const sampler = new Tone.Sampler(config);
      allSamplers.set(instrument, sampler);
    } catch (error) {
      // Silent error handling
    }
  }
  
  // Tone.js v14: loaded() 被移除，等待采样器加载完成
  await new Promise(resolve => setTimeout(resolve, 100));
  samplersInitialized = true;
}

const instrumentConfigs = {
  piano: {
    urls: { C5: 'piano.wav' },
    baseUrl: '/sfx/piano/',
    onload: () => {},
    onerror: (error: any) => {}
  },
  guitar: {
    urls: { C4: 'nylon-guitar.wav' },
    baseUrl: '/sfx/guitar/',
    onload: () => {},
    onerror: (error: any) => {}
  },
  bass: {
    urls: { C2: 'bass.wav' },
    baseUrl: '/sfx/bass/',
    onload: () => {},
    onerror: (error: any) => {}
  },
  ukulele: {
    urls: { C4: 'ukulele.wav' },
    baseUrl: '/sfx/ukulele/',
    onload: () => {},
    onerror: (error: any) => {}
  },
  drums: {
    urls: {
      C2: 'kick.wav',
      E2: 'snare.wav',
      B3: 'ride-edge.wav',
      'C#3': 'clash-high.wav',
      'F#2': 'hi-hat.wav',
      G3: 'splash-hit.wav',
    },
    baseUrl: '/sfx/drums/',
    onload: () => {},
    onerror: (error: any) => {}
  }
};

type OnTrackEndCallback = () => void;
let onTrackEndCallback: OnTrackEndCallback | null = null;

export function setOnTrackEnd(callback: OnTrackEndCallback) {
  onTrackEndCallback = callback;
}

export function setGlobalVolume(volume: number) {
  globalVolume = Math.max(0, Math.min(1, volume));
  
  if (masterVolume) {
    const dbValue = globalVolume === 0 ? -60 : 20 * Math.log10(globalVolume);
    masterVolume.volume.value = dbValue;
  }
}

export function getGlobalVolume(): number {
  return globalVolume;
}

type TrackState = {
  name: string;
  channel: number;
  notes: number;
  isDrum: boolean;
  instrumentId: string;
};

let midiPlayState: {
  isPlaying: boolean;
  startTime: number;
  scheduledUntil: number;
  timerId: any;
  midi: Midi | null;
  earliestTime: number;
  totalDuration: number;
  arrayBuffer: ArrayBuffer | null;
  isCleaningUp: boolean;
  tracks: TrackState[];
} = {
  isPlaying: false,
  startTime: 0,
  scheduledUntil: 0,
  timerId: null,
  midi: null,
  earliestTime: 0,
  totalDuration: 0,
  arrayBuffer: null,
  isCleaningUp: false,
  tracks: [],
};

const SCHEDULE_WINDOW = 1;
const SCHEDULE_INTERVAL = 200;

function normalizeSongKey(url: string): string {
  try {
    const fileName = url.split('/').pop() || '';
    return fileName.replace(/\.[^/.]+$/, '').toLowerCase();
  } catch (error) {
    return '';
  }
}

function determineInstrumentForTrack(track: any, overrides?: SongInstrumentOverrides): string {
  const channel = track.channel ?? 0;

  if (channel === 9) {
    return 'drums';
  }

  const instrumentName = (track.instrument?.name || '').toLowerCase();
  const instrumentFamily = (track.instrument?.family || '').toLowerCase();
  const trackName = (track.name || '').toLowerCase();

  const isDrumLike = [instrumentName, instrumentFamily, trackName].some(text =>
    text.includes('drum') || text.includes('percussion') || text.includes('kit')
  );
  if (isDrumLike) {
    return 'drums';
  }

  const isBass = [instrumentName, instrumentFamily, trackName].some(text =>
    text.includes('bass')
  );
  if (isBass) {
    return 'bass';
  }

  const isGuitar = [instrumentName, instrumentFamily, trackName].some(text =>
    text.includes('guitar')
  );
  if (isGuitar) {
    return 'guitar';
  }

  const isUkulele = [instrumentName, instrumentFamily, trackName].some(text =>
    text.includes('ukulele')
  );
  if (isUkulele) {
    return 'ukulele';
  }

  const override = overrides?.[channel];
  if (override) {
    return override;
  }

  return 'piano';
}

function cleanupAudioObject(obj: any, name: string) {
  if (obj) {
    try {
      if (obj.releaseAll) {
        obj.releaseAll();
      }
      obj.disconnect();
      obj.dispose();
    } catch (error) {
      // Silent error handling
    }
  }
}

function cleanupMidiObjects() {
  try {
    if (midiPlayState.midi) {
      midiPlayState.midi = null;
    }
    
    if (midiPlayState.arrayBuffer) {
      midiPlayState.arrayBuffer = null;
    }
  } catch (error) {
    // Silent error handling
  }
}

function cleanupAllAudioResources() {
  midiPlayState.isCleaningUp = true;
  
  midiPlayState.isPlaying = false;
  
  if (midiPlayState.timerId) {
    clearTimeout(midiPlayState.timerId);
    midiPlayState.timerId = null;
  }
  
  try {
    if (drumSampler && 'releaseAll' in drumSampler) {
      (drumSampler as any).releaseAll();
    }
    trackSamplers.forEach((sampler, channel) => {
      if (sampler && 'releaseAll' in sampler) {
        (sampler as any).releaseAll();
      }
    });
    allSamplers.forEach((sampler, instrument) => {
      if (sampler && 'releaseAll' in sampler) {
        (sampler as any).releaseAll();
      }
    });
  } catch (error) {
    // Silent error handling
  }
  
  cleanupAudioObject(drumSampler, 'drumSampler');
  
  trackSamplers.clear();
  trackInstruments.clear();
  
  cleanupMidiObjects();
  
  drumSampler = null;
  
  midiPlayState = {
    isPlaying: false,
    startTime: 0,
    scheduledUntil: 0,
    timerId: null,
    midi: null,
    earliestTime: 0,
    totalDuration: 0,
    arrayBuffer: null,
    isCleaningUp: false,
    tracks: [],
  };
}

export async function playMidiSample(url: string) {
  try {

    if (midiPlayState.isCleaningUp) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
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
    
    await initializeAllSamplers();
  
    if (midiPlayState.isPlaying) {
      stopMidiSample();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (midiPlayState.isPlaying || midiPlayState.isCleaningUp) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    if (!masterVolume) {
      masterVolume = new Tone.Volume(-15);
      masterVolume.toDestination();
    }
    
    setGlobalVolume(globalVolume);
    
    drumSampler = new Tone.Sampler({
      urls: {
        C2: 'kick.wav',   // Bass Drum
        E2: 'snare.wav',  // Snare Drum
        B3: 'ride-edge.wav',
        'C#3': 'clash-high.wav',
        'F#2': 'hi-hat.wav',
        G3:'splash-hit.wav',
      },
      baseUrl: '/sfx/drums/',
    }).connect(masterVolume);

    // Tone.js v14: loaded() 被移除，等待采样器加载
    await new Promise(resolve => setTimeout(resolve, 500));

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const midi = new Midi(arrayBuffer);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let earliestTime = Infinity;
    midi.tracks.forEach(track => {
      track.notes.forEach(note => {
        if (note.time < earliestTime) {
          earliestTime = note.time;
        }
      });
    });


    let totalDuration = 0;
    midi.tracks.forEach(track => {
      track.notes.forEach(note => {
        const endTime = note.time + note.duration;
        if (endTime > totalDuration) {
          totalDuration = endTime;
        }
      });
    });

    trackInstruments.clear();
    trackSamplers.clear();
    const songKey = normalizeSongKey(url);
    const overrides = getSongInstrumentOverrides(songKey);
    for (const track of midi.tracks) {
      const channel = typeof track.channel === 'number' ? track.channel : 0;
      const instrumentId = determineInstrumentForTrack(track, overrides);
      trackInstruments.set(channel, instrumentId);
    }

    const tracks = midi.tracks
      .filter(track => track.notes.length > 0)
      .map(track => {
        const channel = typeof track.channel === 'number' ? track.channel : 0;
        const instrumentId = trackInstruments.get(channel) || 'piano';
        const isDrum = instrumentId === 'drums';
        return {
          name: track.name || `Track ${track.channel}`,
          channel,
          notes: track.notes.length,
          isDrum,
          instrumentId,
        };
      });

    for (const track of tracks) {
      try {
        if (track.isDrum) {
          continue;
        }

        const instrument = getTrackInstrument(track.channel);

        if (allSamplers.has(instrument)) {
          const preloadedSampler = allSamplers.get(instrument)!;
          if (masterVolume) {
            preloadedSampler.disconnect();
            preloadedSampler.connect(masterVolume);
          }
          trackSamplers.set(track.channel, preloadedSampler);
        } else if (allSamplers.has('piano')) {
          const pianoSampler = allSamplers.get('piano')!;
          if (masterVolume) {
            pianoSampler.disconnect();
            pianoSampler.connect(masterVolume);
          }
          trackSamplers.set(track.channel, pianoSampler);
        }
      } catch (error) {
        // Silent error handling
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    midiPlayState = {
      isPlaying: true,
      startTime: toneNow() + 0.5,
      scheduledUntil: 0,
      timerId: null,
      midi,
      earliestTime,
      totalDuration,
      arrayBuffer: arrayBuffer,
      isCleaningUp: false,
      tracks,
    };

    scheduleNextWindow();
    
  } catch (error) {
    cleanupAllAudioResources();
    throw error;
  }
}

function scheduleNextWindow() {
  if (midiPlayState.isCleaningUp || !midiPlayState.isPlaying || !midiPlayState.midi) {
    return;
  }

  const { midi, startTime, scheduledUntil, earliestTime, totalDuration } = midiPlayState;
  const currentTime = toneNow();
  
  if (!midiPlayState.isPlaying || midiPlayState.isCleaningUp) {
    return;
  }
  
  const playhead = currentTime - startTime + earliestTime;
  const windowStart = scheduledUntil || earliestTime;
  const windowEnd = playhead + SCHEDULE_WINDOW;

  let scheduledNotes = 0;

  midi.tracks.forEach(track => {
    const channel = typeof track.channel === 'number' ? track.channel : 0;
    const instrumentId = getTrackInstrument(channel);
    const isDrum = instrumentId === 'drums';

    if (mutedTracks.has(channel)) {
      return;
    }
    
    track.notes.forEach(note => {
      if (!midiPlayState.isPlaying || midiPlayState.isCleaningUp) {
        return;
      }
      
      if (
        note.time >= windowStart &&
        note.time < windowEnd
      ) {
        try {
          if (isDrum) {
            if (drumSampler instanceof Tone.Sampler) {
              let drumNote = note.name;
              const availableDrumNotes = [
                "C2", "E2", "F#2", "B3", "C#3", "G3"
              ];
              if (!availableDrumNotes.includes(drumNote)) {
                drumNote = "B3";
              }
              drumSampler.triggerAttackRelease(
                drumNote,
                2,
                startTime + (note.time - earliestTime),
                note.velocity
              );
              scheduledNotes++;
            }
          } else {
            const trackSampler = trackSamplers.get(channel);
            if (trackSampler) {
              trackSampler.triggerAttackRelease(
                note.name,
                2,
                startTime + (note.time - earliestTime),
                note.velocity
              );
              scheduledNotes++;
            }
          }
        } catch (error) {
          // Silent error handling
        }
      }
    });
  });

  if (!midiPlayState.isPlaying || midiPlayState.isCleaningUp) {
    return;
  }

  midiPlayState.scheduledUntil = windowEnd;

  if (windowEnd < totalDuration + earliestTime) {
    midiPlayState.timerId = setTimeout(scheduleNextWindow, SCHEDULE_INTERVAL);
  } else {
    cleanupAllAudioResources();
    
    setTimeout(() => {
      if (onTrackEndCallback) {
        onTrackEndCallback();
      }
    }, 100);
  }
}

export function stopMidiSample() {
  midiPlayState.isPlaying = false;
  midiPlayState.isCleaningUp = true;
  
  if (midiPlayState.timerId) {
    clearTimeout(midiPlayState.timerId);
    midiPlayState.timerId = null;
  }
  
  try {
    if (drumSampler && 'releaseAll' in drumSampler) {
      (drumSampler as any).releaseAll();
    }
    trackSamplers.forEach((sampler, channel) => {
      if (sampler && 'releaseAll' in sampler) {
        (sampler as any).releaseAll();
      }
    });
    allSamplers.forEach((sampler, instrument) => {
      if (sampler && 'releaseAll' in sampler) {
        (sampler as any).releaseAll();
      }
    });
  } catch (error) {
    // Silent error handling
  }
  
  cleanupAllAudioResources();
}

export function isMidiPlaying(): boolean {
  return midiPlayState.isPlaying && !midiPlayState.isCleaningUp;
}

export function getMidiPlayState() {
  return { ...midiPlayState };
}

export function getCurrentTracks() {
  return midiPlayState.tracks;
}

export function setTrackInstrument(trackChannel: number, instrument: string) {
  trackInstruments.set(trackChannel, instrument);

  const trackState = midiPlayState.tracks.find(t => t.channel === trackChannel);
  if (trackState) {
    trackState.instrumentId = instrument;
    trackState.isDrum = instrument === 'drums';
  }

  if (instrument === 'drums') {
    trackSamplers.delete(trackChannel);
  } else if (allSamplers.has(instrument)) {
    const preloadedSampler = allSamplers.get(instrument)!;
    if (masterVolume) {
      preloadedSampler.disconnect();
      preloadedSampler.connect(masterVolume);
    }
    trackSamplers.set(trackChannel, preloadedSampler);
  } else if (allSamplers.has('piano')) {
    const pianoSampler = allSamplers.get('piano')!;
    if (masterVolume) {
      pianoSampler.disconnect();
      pianoSampler.connect(masterVolume);
    }
    trackSamplers.set(trackChannel, pianoSampler);
  }

  if (midiPlayState.isPlaying) {
    scheduleNextWindow();
  }
}

export function getTrackInstrument(trackChannel: number): string {
  if (trackInstruments.has(trackChannel)) {
    return trackInstruments.get(trackChannel)!;
  }

  const track = midiPlayState.tracks.find(t => t.channel === trackChannel);
  if (track) {
    return track.instrumentId;
  }

  return 'piano';
}

export function setTrackMuted(trackChannel: number, muted: boolean) {
  if (muted) {
    mutedTracks.add(trackChannel);
  } else {
    mutedTracks.delete(trackChannel);
  }
  console.log(`Track ${trackChannel} mute status set to: ${muted}`);
}

export function isTrackMuted(trackChannel: number): boolean {
  return mutedTracks.has(trackChannel);
}

export function getMutedTracks(): Set<number> {
  return new Set(mutedTracks);
} 

export const instrumentKeys = Object.keys(instrumentConfigs);
export { instrumentConfigs }; 

export const instrumentMeta = [
  { id: 'piano', name: 'Piano', icon: '🎹' },
  { id: 'guitar', name: 'Guitar', icon: '🎸' },
  { id: 'bass', name: 'Bass', icon: '🎸' },
  { id: 'ukulele', name: 'Ukulele', icon: '🪕' },
  { id: 'drums', name: 'Drums', icon: '🥁' }
]; 