import { PlayerInfo, PlayerFeature, FeatureRequirement } from '../types/PlayerTypes';


export const ALL_SONGS = [
  { name: 'Sweet-Child-O-Mine4', file: '/sfx/background-music/Sweet-Child-O-Mine4.mid', displayName: 'Sweet Child O Mine' },
  { name: 'Love-Story', file: '/sfx/background-music/Love-Story.mid', displayName: 'Love Story' },
  { name: 'My-Heart-Will-Go-On', file: '/sfx/background-music/My-Heart-Will-Go-On.mid', displayName: 'My Heart Will Go On' },
  { name: 'He-is-a-pirate', file: '/sfx/background-music/He-is-a-pirate.mid', displayName: 'He is a Pirate' },
  { name: 'mz-311', file: '/sfx/background-music/mz-311.mid', displayName: 'mz 311' },
  { name: 'The-Thrill-Is-Gone', file: '/sfx/background-music/The-Thrill-Is-Gone.mid', displayName: 'The Thrill Is Gone' }
];


const FEATURE_REQUIREMENTS: FeatureRequirement[] = [
  {
    feature: 'basic_playback',
    requiredSubtopic: 'Music basics',
    description: 'Basic playback functionality - Complete music basics learning'
  },
  {
    feature: 'playlist',
    requiredSubtopic: 'Music history',
    description: 'Playlist functionality - Complete music history learning'
  },
  {
    feature: 'prev_track',
    requiredSubtopic: 'Music history',
    description: 'Previous track functionality - Complete music history learning'
  },
  {
    feature: 'next_track',
    requiredSubtopic: 'Music history',
    description: 'Next track functionality - Complete music history learning'
  },
  {
    feature: 'volume_control',
    requiredSubtopic: 'Fundamentals of Acoustics',
    description: 'Volume control functionality - Complete acoustics fundamentals learning'
  },
  {
    feature: 'favorites',
    requiredSubtopic: 'Blues music basic',
    description: 'Unlock a music - Complete blues music basics learning'
  },
  {
    feature: 'instrument_panel',
    requiredSubtopic: 'Instrument history',
    description: 'Instrument panel - Complete instrument history learning'
  },
];


const INSTRUMENT_UNLOCK_CONFIG: Record<string, string[]> = {
  'guitar basic': ['guitar'],
  'ukulele basic': ['ukulele'],
  'bass basic': ['bass'],
};



export class PlayerService {
  private static instance: PlayerService;
  private currentPlayer: PlayerInfo | null = null;
  private realCompletedSubtopics: { id: string; title: string }[] = [];

  private constructor() {}

  static getInstance(): PlayerService {
    if (!PlayerService.instance) {
      PlayerService.instance = new PlayerService();
    }
    return PlayerService.instance;
  }


  setRealCompletedSubtopics(completedSubtopics: { id: string; title: string }[]) {
    this.realCompletedSubtopics = completedSubtopics;
    console.log('🎵 Setting real subtopics data:', completedSubtopics);
  }


  getCurrentPlayer(): PlayerInfo | null {
    return this.currentPlayer;
  }


  setCurrentPlayer(player: PlayerInfo): void {
    this.currentPlayer = player;
    this.savePlayerToStorage(player);
  }




  completeSubtopic(subtopicId: string): PlayerInfo | null {
    console.warn('completeSubtopic method is deprecated, now using real subtopics data');
    return null;
  }


  private checkNewlyUnlockedFeatures(): PlayerFeature[] {
    console.warn('checkNewlyUnlockedFeatures method is deprecated, now using real subtopics data');
    return [];
  }


  isFeatureUnlocked(feature: PlayerFeature): boolean {
    const requirementExists = FEATURE_REQUIREMENTS.find(r => r.feature === feature);
    return !!requirementExists;
  }


  getAvailableFeatures(): PlayerFeature[] {
    return FEATURE_REQUIREMENTS.map(req => req.feature);
  }


  getUpcomingFeatures(): FeatureRequirement[] {
    return [];
  }


  private savePlayerToStorage(player: PlayerInfo): void {
    try {
      localStorage.setItem('music-player-data', JSON.stringify(player));
    } catch (error) {
      console.warn('Unable to save player data:', error);
    }
  }


  loadPlayerFromStorage(): PlayerInfo | null {
    try {
      const data = localStorage.getItem('music-player-data');
      if (data) {
        const player = JSON.parse(data) as PlayerInfo;
        this.currentPlayer = player;
        return player;
      }
    } catch (error) {
      console.warn('Unable to load player data:', error);
    }
    return null;
  }


  resetPlayerData(): void {
    this.currentPlayer = null;
    localStorage.removeItem('music-player-data');
  }


  getFeatureProgress(): Array<{
    feature: PlayerFeature;
    requirement: FeatureRequirement;
    isUnlocked: boolean;
    progress: number;
  }> {
    if (!this.currentPlayer) return [];

    return FEATURE_REQUIREMENTS.map(req => ({
      feature: req.feature,
      requirement: req,
      isUnlocked: true,
      progress: 100
    }));
  }


  getAvailableSongs(): typeof ALL_SONGS {
    return ALL_SONGS;
  }


  getSongUnlockInfo(): Array<{
    song: typeof ALL_SONGS[0];
    isUnlocked: boolean;
    requiredSubtopic?: string;
    subtopicName?: string;
  }> {
    return ALL_SONGS.map(song => {

      return {
        song,
        isUnlocked: true
      };
    });
  }


  isInstrumentUnlocked(instrumentId: string): boolean {
    return true;
  }


  getAvailableInstruments(): string[] {
    const defaultInstruments = ['piano', 'guitar', 'drums', 'ukulele', 'bass'];
    const unlockableInstruments = Object.values(INSTRUMENT_UNLOCK_CONFIG).flat();
    const extendedInstruments = [
      'violin',
      'flute',
      'saxophone',
      'trumpet',
      'accordion',
      'harp',
      'xylophone',
      'organ'
    ];

    return Array.from(new Set([...defaultInstruments, ...unlockableInstruments, ...extendedInstruments]));
  }


  getInstrumentUnlockInfo(): Array<{
    instrumentId: string;
    instrumentName: string;
    isUnlocked: boolean;
    requiredSubtopic?: string;
    subtopicName?: string;
  }> {
    const allInstruments = ['piano', 'guitar', 'drums', 'ukulele', 'bass', 'violin', 'flute', 'saxophone', 'trumpet', 'accordion', 'harp', 'xylophone', 'organ'];
    
    return allInstruments.map(instrumentId => {

      return { 
        instrumentId, 
        instrumentName: this.getInstrumentDisplayName(instrumentId), 
        isUnlocked: true 
      };
    });
  }


  private getInstrumentDisplayName(instrumentId: string): string {
    const instrumentNames: Record<string, string> = {
      'piano': 'Piano',
      'guitar': 'Guitar',
      'drums': 'Drums',
      'ukulele': 'Ukulele',
      'bass': 'Bass',
      'violin': 'Violin',
      'flute': 'Flute',
      'saxophone': 'Saxophone',
      'trumpet': 'Trumpet',
      'accordion': 'Accordion',
      'harp': 'Harp',
      'xylophone': 'Xylophone',
      'organ': 'Organ'
    };
    
    return instrumentNames[instrumentId] || instrumentId;
  }
} 